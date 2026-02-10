"use client";
import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger);

interface SunOrchestratorProps {
    isGameActive: boolean;
}

const PATH_SAMPLES = 200;
const BRIDGE_FRACTION = 0.15;

export default function SunOrchestrator({ isGameActive }: SunOrchestratorProps) {
    const sunRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);

    // Cache refs to avoid repeated DOM queries
    const cacheRef = useRef({
        heroTarget: null as HTMLElement | null,
        path: null as SVGPathElement | null,
        svgEl: null as SVGSVGElement | null,
        sunSize: 32,
        lut: [] as { nx: number; ny: number }[],
    });

    useEffect(() => {
        const check = () => {
            const h = document.getElementById("hero-sun-target");
            const p = document.getElementById("aboutme-path");
            if (h && p && h.getBoundingClientRect().width > 0) setIsReady(true);
        };
        check();
        const t = [setTimeout(check, 200), setTimeout(check, 1000), setTimeout(check, 3000)];
        return () => t.forEach(clearTimeout);
    }, []);

    useGSAP(() => {
        if (!isReady || !sunRef.current) return;

        const sun = sunRef.current;
        const heroTarget = document.getElementById("hero-sun-target")!;
        const path = document.getElementById("aboutme-path") as SVGPathElement;
        const svgEl = path?.ownerSVGElement;
        if (!heroTarget || !path || !svgEl) return;

        // Store in cache
        cacheRef.current.heroTarget = heroTarget;
        cacheRef.current.path = path;
        cacheRef.current.svgEl = svgEl;

        // ─── 1. PRE-COMPUTE PATH LUT (normalised 0→1) ──────
        const pathLength = path.getTotalLength();
        const lut: { nx: number; ny: number }[] = [];
        for (let i = 0; i <= PATH_SAMPLES; i++) {
            const pt = path.getPointAtLength((i / PATH_SAMPLES) * pathLength);
            lut.push({ nx: pt.x / 100, ny: pt.y / 100 });
        }
        cacheRef.current.lut = lut;

        // ─── 2. INITIAL SETUP ───────────────────────────────
        const heroRect = heroTarget.getBoundingClientRect();
        const sunSize = heroRect.width || 32;
        cacheRef.current.sunSize = sunSize;

        gsap.set(sun, {
            width: sunSize,
            height: sunSize,
            x: heroRect.left + heroRect.width / 2 - sunSize / 2,
            y: heroRect.top + heroRect.height / 2 - sunSize / 2,
            opacity: 1,
        });

        // ─── 3. USE RAF-BASED SCROLL WITH TRANSFORM3D ──────
        // Cache previous position to avoid unnecessary updates
        let lastTx = 0;
        let lastTy = 0;
        const threshold = 0.5; // pixels - skip updates smaller than this

        const st = ScrollTrigger.create({
            trigger: "#aboutme-section",
            start: "top bottom", // Start when section enters viewport
            end: "bottom bottom", // End when section leaves viewport
            scrub: 1, // Slight scrubbing for smoothness
            onUpdate: (self) => {
                const p = self.progress;
                let tx: number, ty: number;

                const sr = svgEl.getBoundingClientRect();

                if (p <= BRIDGE_FRACTION) {
                    const t = p / BRIDGE_FRACTION;
                    const eased = t * t * (3 - 2 * t); // smoothstep

                    const hr = heroTarget.getBoundingClientRect();
                    const hcx = hr.left + hr.width / 2;
                    const hcy = hr.top + hr.height / 2;

                    const psx = sr.left + lut[0].nx * sr.width;
                    const psy = sr.top + lut[0].ny * sr.height;

                    tx = hcx + (psx - hcx) * eased;
                    ty = hcy + (psy - hcy) * eased;
                } else {
                    const pathT = (p - BRIDGE_FRACTION) / (1 - BRIDGE_FRACTION);
                    const idx = Math.min(Math.floor(pathT * PATH_SAMPLES), PATH_SAMPLES - 1);
                    const nextIdx = Math.min(idx + 1, PATH_SAMPLES);
                    const frac = pathT * PATH_SAMPLES - idx;

                    const nx = lut[idx].nx + (lut[nextIdx].nx - lut[idx].nx) * frac;
                    const ny = lut[idx].ny + (lut[nextIdx].ny - lut[idx].ny) * frac;

                    tx = sr.left + nx * sr.width;
                    ty = sr.top + ny * sr.height;
                }

                // Skip micro-updates to reduce GPU work
                const dx = Math.abs(tx - lastTx);
                const dy = Math.abs(ty - lastTy);

                if (dx > threshold || dy > threshold) {
                    lastTx = tx;
                    lastTy = ty;

                    // Use transform instead of x/y for better performance
                    // translate3d triggers GPU acceleration
                    sun.style.transform = `translate3d(${tx - sunSize / 2}px, ${ty - sunSize / 2}px, 0)`;
                }
            },
        });

        // Debounced resize handler
        let resizeTimer: number;
        const onResize = () => {
            clearTimeout(resizeTimer);
            resizeTimer = window.setTimeout(() => {
                // Recalculate sun size on resize
                const hr = heroTarget.getBoundingClientRect();
                const newSize = hr.width || 32;
                cacheRef.current.sunSize = newSize;
                gsap.set(sun, { width: newSize, height: newSize });
                st.refresh();
            }, 150);
        };

        window.addEventListener("resize", onResize, { passive: true });

        return () => {
            st.kill();
            window.removeEventListener("resize", onResize);
            clearTimeout(resizeTimer);
        };
    }, { dependencies: [isReady] });

    // Game-mode visibility with smoother transition
    useGSAP(() => {
        if (!sunRef.current) return;
        gsap.to(sunRef.current, {
            opacity: isGameActive ? 0 : 1,
            duration: 0.3,
            ease: "power2.inOut",
            overwrite: "auto",
        });
    }, [isGameActive, isReady]);

    if (!isReady || typeof document === "undefined") return null;

    return ReactDOM.createPortal(
        <div
            ref={sunRef}
            className="fixed z-[60] pointer-events-none rounded-full"
            style={{
                top: 0,
                left: 0,
                width: 0,
                height: 0,
                background: "radial-gradient(circle, #fff 0%, #ffd700 40%, #ff8c00 100%)",
                boxShadow: "0 0 40px 10px rgba(255, 200, 0, 0.6)",
                willChange: "transform, opacity",
                contain: "layout style paint",
                transform: "translate3d(0, 0, 0)", // Force GPU layer
            }}
        />,
        document.body
    );
}