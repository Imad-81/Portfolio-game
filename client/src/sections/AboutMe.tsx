"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PerspectiveText from "../components/PerspectiveText";

// Register Plugins
gsap.registerPlugin(ScrollTrigger);

export default function AboutMe() {
    const containerRef = useRef<HTMLDivElement>(null);

    // Mouse Position Tracker for 3D effect
    const mousePos = useRef({ x: 0, y: 0 });

    // Refs for animated elements
    const textRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;

        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            mousePos.current = { x, y };
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, { scope: containerRef });

    // Background floating words
    const bgWords = [
        { text: "SYSTEMS", x: 2, y: 5, depth: 1.5 },
        { text: "ENTROPY", x: 25, y: -5, depth: 0.6 },
        { text: "INFERENCE", x: 80, y: 15, depth: 1.2 },
        { text: "LATENCY", x: 2, y: 45, depth: 0.8 },
        { text: "VECTOR", x: -5, y: 65, depth: 1.4 },
        { text: "CONTEXT", x: 85, y: 50, depth: 1.0 },
        { text: "WEIGHTS", x: 92, y: 35, depth: 0.7 },
        { text: "TRAJECTORY", x: 5, y: 85, depth: 0.9 },
        { text: "MODEL", x: 75, y: 90, depth: 1.1 },
        { text: "DEPTH", x: 50, y: 95, depth: 0.5 },
    ];

    useGSAP(() => {
        textRefs.current.forEach((el) => {
            if (!el) return;

            gsap.fromTo(
                el,
                { opacity: 0.1, filter: "blur(5px)", scale: 0.95 },
                {
                    opacity: 1,
                    filter: "blur(0px)",
                    scale: 1,
                    duration: 1,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        end: "bottom center",
                        toggleActions: "play reverse play reverse",
                        scrub: 1,
                    },
                }
            );
        });
    }, { scope: containerRef });

    return (
        <section
            id="aboutme-section"
            ref={containerRef}
            className="relative w-full bg-[#050505] overflow-hidden"
            style={{ height: "180vh", perspective: "1000px" }}
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,19,254,0.03)_0%,transparent_60%)] pointer-events-none" />

            {/* Floating 3D Words */}
            {bgWords.map((word, i) => (
                <PerspectiveText
                    key={i}
                    text={word.text}
                    initialX={word.x}
                    initialY={word.y}
                    depth={word.depth}
                    mousePos={mousePos}
                />
            ))}

            {/* 1 — Identity Block (Top Left) */}
            <div className="absolute top-[10%] left-[5%] md:left-[10%] max-w-xl text-left z-30">
                <div ref={el => { textRefs.current[0] = el }} className="md:ml-20">
                    <p className="text-[10px] md:text-xs font-mono tracking-[0.5em] uppercase text-white/40 mb-6">
                        AI & ML &nbsp;|&nbsp; Quant Systems &nbsp;|&nbsp; Full-Stack Engineering
                    </p>

                    <h1 className="text-5xl md:text-7xl tracking-[-0.04em] leading-[0.9] text-white">
                        <span className="font-extralight">SHAIK</span>
                        <br />
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-300 to-gray-500">
                            IMAD UDDIN
                        </span>
                    </h1>
                </div>
            </div>

            {/* 2 — Core Positioning (Centered Mid) */}
            <div className="absolute top-[38%] left-1/2 -translate-x-1/2 max-w-2xl text-center z-30 px-6">
                <div ref={el => { textRefs.current[1] = el }}>
                    <p className="text-xl md:text-[1.7rem] font-light leading-[1.7] text-white/85 tracking-[-0.01em]">
                        I build quantitative trading systems and applied AI tools.
                        <br />
                        <span className="text-white/60">
                            My work focuses on turning strategy ideas into executable infrastructure.
                        </span>
                    </p>

                    <div className="mt-10 h-px w-24 mx-auto bg-white/15" />
                </div>
            </div>

            {/* 3 — Technical Proof Layer (Lower) */}
            <div className="absolute top-[62%] left-1/2 -translate-x-1/2 max-w-3xl w-full text-center px-6 z-30">
                <div ref={el => { textRefs.current[2] = el }} className="flex flex-col items-center">

                    <p className="text-sm md:text-base text-white/50 font-light leading-relaxed max-w-2xl mb-10">
                        Built a multi-timeframe trading engine with custom backtesting, risk management,
                        position sizing, and machine learning experimentation.
                    </p>

                    <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-[10px] md:text-xs font-mono tracking-[0.25em] text-white/30 uppercase">
                        <span>Backtesting Engine</span>
                        <span>Multi-Timeframe Logic</span>
                        <span>Support/Resistance Detection</span>
                        <span>Feature Engineering Pipeline</span>
                        <span>Paper Trading Deployment</span>
                    </div>
                </div>
            </div>

            {/* 4 — Transition Cue */}
            <div className="absolute bottom-[8%] left-1/2 -translate-x-1/2 z-30">
                <div ref={el => { textRefs.current[3] = el }}>
                    <p className="text-[11px] tracking-[0.35em] uppercase text-white/25 font-mono">
                        Scroll to explore the systems
                    </p>
                </div>
            </div>
        </section>
    );
}
