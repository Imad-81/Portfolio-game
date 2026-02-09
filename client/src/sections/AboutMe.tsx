"use client";
import React, { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { MotionPathPlugin } from "gsap/MotionPathPlugin";
import { useGSAP } from "@gsap/react";

// Register Plugins
gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

export default function AboutMe() {
    const containerRef = useRef<HTMLDivElement>(null);
    const pathRef = useRef<SVGPathElement>(null);
    const sunRef = useRef<HTMLDivElement>(null);

    // Refs for animated elements
    const textRefs = useRef<(HTMLDivElement | null)[]>([]);
    const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const signalRefs = useRef<(HTMLDivElement | null)[]>([]);

    useGSAP(() => {
        const container = containerRef.current;
        const path = pathRef.current;
        const sun = sunRef.current;

        if (!container || !path || !sun) return;

        /* ------------------------------------------
           1. SUN FOLLOWING THE PATH
           ------------------------------------------ */
        gsap.to(sun, {
            motionPath: {
                path: path,
                align: path,
                alignOrigin: [0.5, 0.5],
                autoRotate: false,
            },
            ease: "none",
            scrollTrigger: {
                trigger: container,
                start: "top center",
                end: "bottom center",
                scrub: 1,
            },
        });

        // Sun Pulse
        gsap.to(sun, {
            scale: 1.2,
            boxShadow: "0 0 40px 10px rgba(255, 200, 0, 0.6), 0 0 80px 20px rgba(255, 100, 0, 0.3)",
            duration: 2,
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut"
        });

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
                        start: "top center+=150",
                        end: "bottom center-=100",
                        toggleActions: "play reverse play reverse",
                        scrub: 1,
                    }
                }
            );
        });

        /* ------------------------------------------
           3. CONSTELLATION NODES (Simulated proximity)
           ------------------------------------------ */
        const nodeTriggers = [
            { start: "10%", end: "20%" }, // Frontend
            { start: "30%", end: "40%" }, // LLM
            { start: "55%", end: "65%" }, // Vision
            { start: "75%", end: "85%" }, // Trading
        ];

        nodeRefs.current.forEach((el, i) => {
            if (!el || !nodeTriggers[i]) return;

            // Fades in when sun enters zone, fades out when it leaves
            gsap.fromTo(el,
                { opacity: 0, scale: 0 },
                {
                    opacity: 1, scale: 1, duration: 0.3,
                    scrollTrigger: {
                        trigger: container,
                        start: `top+=${nodeTriggers[i].start} center`,
                        end: `top+=${nodeTriggers[i].end} center`,
                        toggleActions: "play reverse play reverse", // Validates "disappear as sun goes down"
                        scrub: 0.5
                    }
                }
            );
        });

        /* ------------------------------------------
           4. SIGNAL LAYER (Ghost Words)
           ------------------------------------------ */
        signalRefs.current.forEach((el, i) => {
            if (!el) return;
            gsap.to(el, {
                y: -50,
                opacity: 0.08,
                scrollTrigger: {
                    trigger: container,
                    start: "top bottom",
                    end: "bottom top",
                    scrub: 2
                }
            });
        });

    }, { scope: containerRef });

    return (
        <section
            ref={containerRef}
            className="relative w-full bg-[#050505] overflow-hidden"
            style={{ height: '180vh' }}
        >
            {/* BACKGROUND ELEMENTS */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,19,254,0.03)_0%,transparent_60%)] pointer-events-none" />

            {/* SIGNAL LAYER (Ghost Words) */}
            <div className="absolute inset-0 pointer-events-none select-none overflow-hidden font-black text-white/5 uppercase tracking-tighter">
                <div ref={el => { signalRefs.current[0] = el }} className="absolute top-[10%] left-[5%] text-8xl md:text-[10rem] opacity-0">VISION</div>
                <div ref={el => { signalRefs.current[1] = el }} className="absolute top-[30%] right-[0%] text-8xl md:text-[12rem] opacity-0 text-right">INFERENCE</div>
                <div ref={el => { signalRefs.current[2] = el }} className="absolute top-[55%] left-[10%] text-6xl md:text-[8rem] opacity-0">LATENCY</div>
                <div ref={el => { signalRefs.current[3] = el }} className="absolute top-[80%] right-[10%] text-7xl md:text-[9rem] opacity-0">SYSTEMS</div>
            </div>

            {/* SVG PATH (The Track) */}
            <div className="absolute top-0 left-0 w-full h-full pointer-events-none z-10">
                <svg
                    width="100%"
                    height="100%"
                    viewBox="0 0 100 100"
                    preserveAspectRatio="none"
                    className="overflow-visible"
                >
                    <path
                        ref={pathRef}
                        d="M 50 -5 
                           C 50 10, 80 15, 80 30 
                           C 80 45, 20 50, 20 65 
                           C 20 80, 50 85, 50 105"
                        fill="none"
                        stroke="url(#pathGradient)"
                        strokeWidth="0.2"
                        vectorEffect="non-scaling-stroke"
                        className="opacity-30"
                    />
                    <defs>
                        <linearGradient id="pathGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                            <stop offset="0%" stopColor="#bc13fe" stopOpacity="0" />
                            <stop offset="20%" stopColor="#bc13fe" stopOpacity="0.8" />
                            <stop offset="80%" stopColor="#00f2ff" stopOpacity="0.8" />
                            <stop offset="100%" stopColor="#00f2ff" stopOpacity="0" />
                        </linearGradient>
                    </defs>


                </svg>
            </div>

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


            {/* CONSTELLATION NODES (Floating Capability Data) */}
            {/* Node 1: Frontend Systems */}
            {/* <div ref={el => { nodeRefs.current[0] = el }} className="absolute top-[18%] right-[25%] z-20 flex items-center gap-3 pointer-events-none opacity-0">
                <div className="w-2 h-2 rounded-full border border-[#00f2ff] bg-[#00f2ff]/20 shadow-[0_0_10px_#00f2ff]" />
                <span className="text-[#00f2ff] text-xs tracking-widest uppercase font-mono">Frontend Systems</span>
            </div> */}
            {/* Node 2: LLM Pipelines */}
            {/* <div ref={el => { nodeRefs.current[1] = el }} className="absolute top-[40%] left-[20%] z-20 flex items-center gap-3 pointer-events-none flex-row-reverse opacity-0">
                <div className="w-2 h-2 rounded-full border border-[#bc13fe] bg-[#bc13fe]/20 shadow-[0_0_10px_#bc13fe]" />
                <span className="text-[#bc13fe] text-xs tracking-widest uppercase font-mono">LLM Pipelines</span>
            </div> */}
            {/* Node 3: Computer Vision */}
            {/* <div ref={el => { nodeRefs.current[2] = el }} className="absolute top-[60%] right-[25%] z-20 flex items-center gap-3 pointer-events-none opacity-0">
                <div className="w-2 h-2 rounded-full border border-white bg-white/20 shadow-[0_0_10px_white]" />
                <span className="text-white text-xs tracking-widest uppercase font-mono">Computer Vision</span>
            </div> */}
            {/* Node 4: Trading Algos */}
            {/* <div ref={el => { nodeRefs.current[3] = el }} className="absolute top-[82%] left-[30%] z-20 flex items-center gap-3 pointer-events-none flex-row-reverse opacity-0">
                <div className="w-2 h-2 rounded-full border border-yellow-400 bg-yellow-400/20 shadow-[0_0_10px_yellow]" />
                <span className="text-yellow-400 text-xs tracking-widest uppercase font-mono">Trading Algos</span>
            </div> */}


            {/* THE SUN FOLLOWER */}
            <div
                ref={sunRef}
                className="absolute top-0 left-0 w-6 h-6 rounded-full z-20 pointer-events-none"
                style={{
                    background: "radial-gradient(circle, #fff 0%, #ffd700 40%, #ff8c00 100%)",
                    boxShadow: "0 0 25px 5px rgba(255, 200, 0, 0.5)",
                }}
            />

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
            <div className="absolute top-[35%] right-[5%] md:right-[15%] max-w-2xl text-right z-30">
                <div ref={el => { textRefs.current[1] = el }} className="md:mr-20">
                    <h2 className="text-2xl md:text-4xl font-light leading-relaxed text-white/90">
                        I design and build systems where<br />
                        <span className="italic text-white/60">interfaces</span>,
                        <span className="italic text-[#bc13fe]/80"> intelligence</span>, and
                        <span className="italic text-[#00f2ff]/80"> motion</span> converge.
                    </h2>
                    <div className="mt-8 h-px w-32 bg-gradient-to-l from-white/30 to-transparent ml-auto" />
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
