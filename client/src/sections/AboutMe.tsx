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

        // Track mouse relative to center of section
        const handleMouseMove = (e: MouseEvent) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width - 0.5; // -0.5 to 0.5
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            mousePos.current = { x, y };
        };

        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, { scope: containerRef });

    // Word Cloud Configuration
    // We pick a subset to avoid clutter, scattered randomly but thoughtfully
    const bgWords = [
        // Top Left / Top Edge
        { text: "SYSTEMS", x: 2, y: 5, depth: 1.5 },
        { text: "ENTROPY", x: 25, y: -5, depth: 0.6 },

        // Top Right
        { text: "INFERENCE", x: 80, y: 15, depth: 1.2 },

        // Mid Left Edge
        { text: "LATENCY", x: 2, y: 45, depth: 0.8 },
        { text: "VECTOR", x: -5, y: 65, depth: 1.4 },

        // Mid Right Edge
        { text: "CONTEXT", x: 85, y: 50, depth: 1.0 },
        { text: "WEIGHTS", x: 92, y: 35, depth: 0.7 },

        // Bottom Left
        { text: "TRAJECTORY", x: 5, y: 85, depth: 0.9 },

        // Bottom Right / Center
        { text: "MODEL", x: 75, y: 90, depth: 1.1 },
        { text: "DEPTH", x: 50, y: 95, depth: 0.5 },
    ];

    useGSAP(() => {
        const container = containerRef.current;
        if (!container) return;


        /* ------------------------------------------
           2. TEXT REVEALS ON SCROLL
           ------------------------------------------ */
        textRefs.current.forEach((el) => {
            if (!el) return;
            gsap.fromTo(el,
                { opacity: 0.1, filter: "blur(5px)", scale: 0.95 },
                {
                    opacity: 1, filter: "blur(0px)", scale: 1, duration: 1, ease: "power2.out",
                    scrollTrigger: {
                        trigger: el,
                        start: "top 85%",
                        end: "bottom center",
                        toggleActions: "play reverse play reverse",
                        scrub: 1,
                    }
                }
            );
        });


    }, { scope: containerRef });

    return (
        <section
            id="aboutme-section"
            ref={containerRef}
            className="relative w-full bg-[#050505] overflow-hidden"
            style={{ height: '180vh', perspective: '1000px' }} // Added perspective for 3D text
        >
            {/* BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,19,254,0.03)_0%,transparent_60%)] pointer-events-none" />

            {/* DYNAMIC 3D PERSPECTIVE TEXT LAYER */}
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


            {/* STATIC TIMELINE TEXT (HTML for alignment & visibility) */}
            {/* 1. Learning Systems - Near top curve */}
            {/* <div className="absolute top-[18%] left-[60%] text-white/40 text-xs md:text-sm font-mono tracking-widest pointer-events-none z-10"> */}
            {/* LEARNING SYSTEMS */}
            {/* </div> */}
            {/* 2. Building Products - Near middle right */}
            {/* <div className="absolute top-[40%] right-[15%] text-white/40 text-xs md:text-sm font-mono tracking-widest pointer-events-none z-10 text-right"> */}
            {/* BUILDING PRODUCTS */}
            {/* </div> */}
            {/* 3. Optimizing Perf - Near bottom left */}
            {/* <div className="absolute top-[67%] left-[18%] text-white/40 text-xs md:text-sm font-mono tracking-widest pointer-events-none z-10"> */}
            {/* OPTIMIZING PERF */}
            {/* </div> */}



            {/* SCROLLYTELLING CONTENT */}

            {/* STOP 1: IDENTITY */}
            <div className="absolute top-[10%] left-[5%] md:left-[10%] max-w-xl text-left z-30">
                <div ref={el => { textRefs.current[0] = el }} className="md:ml-20">
                    <h3 className="text-[#00f2ff] text-xs md:text-sm font-semibold tracking-[0.4em] uppercase mb-4 opacity-80">
                        AI Engineer | Systems Thinker | Builder
                    </h3>
                    <h1 className="text-4xl md:text-6xl font-thin tracking-tighter text-white leading-tight">
                        SHAIK <br />
                        <span className="font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-400">IMAD UDDIN</span>
                    </h1>
                </div>
            </div>

            {/* STOP 2: NARRATIVE */}
            <div className="absolute top-[35%] left-1/2 -translate-x-1/2 max-w-2xl text-center z-30">
                <div ref={el => { textRefs.current[1] = el }} className="flex flex-col items-center">
                    <h2 className="text-2xl md:text-4xl font-light leading-relaxed text-white/90">
                        I design and build systems where<br />
                        <span className="italic text-white/60">interfaces</span>,
                        <span className="italic text-[#bc13fe]/80"> intelligence</span>, and
                        <span className="italic text-[#00f2ff]/80"> motion</span> converge.
                    </h2>
                    <div className="mt-8 h-px w-32 bg-gradient-to-r from-transparent via-white/30 to-transparent" />
                </div>
            </div>

            {/* STOP 3: DETAILS & CHIPS */}
            <div className="absolute top-[65%] left-1/2 -translate-x-1/2 max-w-4xl w-full text-center px-6 z-30">
                <div ref={el => { textRefs.current[2] = el }} className="flex flex-col items-center">
                    <p className="text-base md:text-xl text-gray-400 font-light leading-relaxed max-w-2xl mb-12">
                        My work spans <strong className="text-white font-medium">frontend engineering</strong>,
                        <strong className="text-white font-medium"> LLM-powered applications</strong>,
                        <strong className="text-white font-medium"> computer vision</strong>, and
                        <strong className="text-white font-medium"> real-time systems</strong>.
                    </p>

                    {/* INTERACTIVE CHIPS */}
                    <div className="flex flex-wrap justify-center gap-6 text-xs md:text-sm font-mono tracking-widest text-white/70 uppercase">
                        {/* Structure */}
                        <div className="group relative px-6 py-3 rounded-full border border-white/10 overflow-hidden cursor-crosshair transition-all hover:border-white/40">
                            <div className="absolute inset-0 opacity-0 group-hover:opacity-20 transition-opacity bg-[linear-gradient(rgba(255,255,255,0.2)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.2)_1px,transparent_1px)] bg-[size:10px_10px]" />
                            <span className="relative z-10">Structure</span>
                        </div>

                        {/* Performance */}
                        <div className="group relative px-6 py-3 rounded-full border border-white/10 overflow-hidden cursor-crosshair transition-all hover:border-[#00f2ff]/50 hover:text-[#00f2ff]">
                            <span className="relative z-10 group-hover:animate-pulse">Performance</span>
                            <div className="absolute inset-0 bg-[#00f2ff]/5 translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
                        </div>

                        {/* Intentional Interaction */}
                        <div className="group relative px-6 py-3 rounded-full border border-white/10 overflow-hidden cursor-crosshair transition-all hover:border-[#bc13fe]/50 hover:scale-105 active:scale-95 duration-300">
                            <span className="relative z-10">Intentional Interaction</span>
                            <div className="absolute inset-0 bg-[#bc13fe]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </div>

                    {/* PERSONAL ANCHOR */}
                    <div className="mt-20 opacity-80">
                        <p className="text-sm md:text-base font-light italic text-white/50 tracking-wider">
                            "Obsessed with how systems feel, not just how they work."
                        </p>
                        <p className="mt-4 text-[10px] tracking-[0.2em] uppercase text-[#bc13fe]/70">
                            Currently Pursuing B.Tech CSE (AI & ML)
                        </p>
                    </div>
                </div>
            </div>

        </section>
    );
}
