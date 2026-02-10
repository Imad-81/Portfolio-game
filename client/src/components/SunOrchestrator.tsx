"use client";
import React, { useRef, useEffect, useState } from "react";
import ReactDOM from "react-dom";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

interface SunOrchestratorProps {
    isGameActive: boolean;
}

export default function SunOrchestrator({ isGameActive }: SunOrchestratorProps) {
    const sunRef = useRef<HTMLDivElement>(null);
    const [isReady, setIsReady] = useState(false);

    // Wait for DOM to be ready to find targets
    useEffect(() => {
        const checkTargets = () => {
            const heroTarget = document.getElementById("hero-sun-target");
            const pathInfo = document.getElementById("aboutme-path");

            if (heroTarget && pathInfo) {
                setIsReady(true);
            }
        };

        // Check immediately and then a small timeout to ensure hydration
        checkTargets();
        const timer = setTimeout(checkTargets, 500);
        return () => clearTimeout(timer);
    }, []);

    useGSAP(() => {
        if (!isReady || !sunRef.current) return;

        console.log("SunOrchestrator: Initializing...");

        const sun = sunRef.current;
        const heroTarget = document.getElementById("hero-sun-target");
        const path = document.getElementById("aboutme-path") as SVGPathElement;

        if (!heroTarget) console.error("SunOrchestrator: HERO TARGET MISSING");
        if (!path) console.error("SunOrchestrator: PATH MISSING");

        if (!heroTarget || !path) return;

        console.log("SunOrchestrator: SYNC STARTING");

        // Initial Position: Match Hero Target exactly
        const updatePosition = () => {
            if (isGameActive) return;

            const rect = heroTarget.getBoundingClientRect();
            // Important: For absolute positioning, add window.scrollY
            const absoluteTop = rect.top + window.scrollY;
            const absoluteLeft = rect.left + window.scrollX;

            gsap.set(sun, {
                x: absoluteLeft,
                y: absoluteTop,
                width: rect.width,
                height: rect.height,
                opacity: 1
            });
        };

        // Initialize immediately
        updatePosition();

        // Also update on resize
        window.addEventListener("resize", updatePosition);

        // 1. Garage Door Logic (Game Active)
        if (isGameActive) {
            gsap.to(sun, {
                y: "-100vh", // Move up with the overlay
                duration: 1.5,
                ease: "power3.inOut"
            });
            return; // Exit scrollytelling logic if game is active
        } else {
            // Reset if coming back from game
            gsap.to(sun, {
                y: heroTarget.getBoundingClientRect().top,
                duration: 1
            });
        }

        /* ------------------------------------------
           SCROLLYTELLING TIMELINE
           ------------------------------------------ */
        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: "body", // Global scroll
                start: "top top",
                end: "bottom bottom", // Entire page
                scrub: 1,
            }
        });

        // STEP 1: Interpolate from Hero Position to AboutMe Path Start
        // We know AboutMe usually starts after Hero (100vh)
        // Let's assume the path starts relatively early in AboutMe.
        // We need to animate 'x' and 'y' to the start of the path.

        // This is tricky because MotionPathPlugin wants to control the element.
        // Strategy: 
        // 0-10% Scroll: Move Sun from Fixed Hero position to Path Start.
        // 10%-End Scroll: Follow Path.

        // Actually, simpler: The Sun in Hero is just fixed.
        // When we scroll, the Hero assumes "Absolute" positioning relative to viewport? 
        // No, the Hero scrolls away.

        // Let's make the Sun FIXED initially. 
        // As we scroll down, the Hero moves up. The Sun should stay with the Hero text?
        // OR does the user want the Sun to stay on screen and travel to the next section?
        // "follow it down from the hero section to the about me section"

        // If the sun is in the DOM as `fixed`, it stays on screen. 
        // The Hero text moves UP and OFF screen. 
        // Use a timeline to animate the sun from matching the Hero Text (which is moving up)
        // to the Path (which is coming up).

        // Better Loop: 
        // Just put the Sun in the 'AboutMe' section but use absolute positioning to place it
        // in the Hero section initially? 
        // No, separate components make that hard.

        // Global Fixed Sun is best.
        // We need to sync with scroll.

        // When scroll is 0: Sun is at rect of #hero-sun-target.
        // When scroll is > 0: The #hero-sun-target moves UP.
        // The Sun needs to BREAK FREE from the target and move DOWN to meet the path.

        // Let's get the absolute coordinates of the path start.
        // Note: SVG path coordinates are local to the SVG. We need global coordinates.
        // This is complex. 

        // Simplified approach for reliability:
        // Use `MotionPath` for the whole thing? 
        // Or just map the sun to the path for the AboutMe section and interpolate before.

        gsap.to(sun, {
            motionPath: {
                path: path,
                align: path,
                alignOrigin: [0.5, 0.5],
                autoRotate: false,
                start: 0,
                end: 1
            },
            ease: "none",
            scrollTrigger: {
                trigger: "#aboutme-section", // Target the section specifically
                start: "top center", // When AboutMe hits center
                end: "bottom center",
                scrub: 1,
            }
        });

        // We need a transition FROM hero TO the start of the path.
        // The path interaction starts at "top center" of AboutMe.
        // Between Scroll 0 and AboutMe "top center", we need the sun to move.

    }, { dependencies: [isReady, isGameActive] });

    // Styles for the Orb
    // Use Portal to escape parent layout (flexboxes, relative containers) 
    // and position strictly relative to the document/viewport.
    if (!isReady || typeof document === 'undefined') return null;

    return ReactDOM.createPortal(
        <div
            ref={sunRef}
            className="absolute z-[60] pointer-events-none rounded-full will-change-transform"
            style={{
                top: 0, left: 0,
                width: '4rem', height: '4rem',
                background: "radial-gradient(circle, #fff 0%, #ffd700 40%, #ff8c00 100%)",
                boxShadow: "0 0 40px 10px rgba(255, 200, 0, 0.6)"
            }}
        />,
        document.body
    );
}
