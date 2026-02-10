"use client";
import React, { useRef, useMemo } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

interface CityscapeProps {
    side: 'left' | 'right';
}

const BUILDING_COUNT = 30; // More buildings for a dense stream

const Cityscape: React.FC<CityscapeProps> = ({ side }) => {
    const containerRef = useRef<HTMLDivElement>(null);

    // Generate buildings
    const buildings = useMemo(() => {
        return Array.from({ length: BUILDING_COUNT }).map((_, i) => {
            // Billboard logic: every 20th building
            const isBillboard = i > 0 && i % 20 === 0;
            const billboardType = (i / 20) % 2 === 1 ? 'GitHub' : 'LinkedIn';

            return {
                id: i,
                // Deterministic "random" using sin/cos with index
                height: (Math.abs(Math.sin(i * 45.32)) * 100) + 150,
                width: (Math.abs(Math.cos(i * 12.54)) * 30) + 40,
                color: '#050110', // Dark solid base
                neonColor: `hsl(${Math.abs(Math.sin(i * 99.12)) * 360}, 100%, 50%)`,
                isBillboard,
                billboardContent: billboardType,
                delay: i * 0.5 // Stagger spawn time
            };

        });
    }, []);

    useGSAP(() => {
        const ctx = gsap.context(() => {
            buildings.forEach((b, i) => {
                const el = document.getElementById(`building-${side}-${i}`);
                if (!el) return;

                // Pseudo-3D Animation
                // Start at Horizon (top 30%, center-ish)
                // End at Bottom, far Left/Right (depending on side)

                // X-axis movement:
                // visual center is roughly screen center. 
                // 'left' side buildings move from 0 to -500 (relative) or similar.
                // 'right' side buildings move from 0 to 500.
                // But we are inside a container that is positioned.
                // Let's assume the container moves them.

                const startScale = 0.1;
                const endScale = 2.5;
                const startY = 0; // Relative to horizon line
                const endY = 800; // Move down past screen

                // Trajectory
                // Side 'left': x goes from 0 to -400%
                // Side 'right': x goes from 0 to 400%
                const startX = 0;
                const endX = (side === 'left' ? -1 : 1) * (150 + Math.abs(Math.sin(i * 22.4)) * 200); // Random spread

                // Create a timeline for infinite loop
                gsap.timeline({
                    repeat: -1,
                    delay: Math.abs(Math.cos(i * 5.6)) * 5 // Random start delay for natural feel
                })
                    .fromTo(el,
                        {
                            scale: startScale,
                            y: startY,
                            x: startX,
                            opacity: 0,
                            z: 0
                        },
                        {
                            scale: endScale,
                            y: endY,
                            x: endX,
                            opacity: 1,
                            z: 100, // Just for stacking context if needed
                            duration: 4, // consistent speed
                            ease: "power1.in", // Accelerate (exponential feel)
                        }
                    );
            });
        }, containerRef);

        return () => ctx.revert();
    }, { scope: containerRef });

    return (
        <div ref={containerRef} className={`absolute top-[30%] w-full h-[70vh] pointer-events-none z-0 overflow-visible flex justify-center`}>
            {/* Center point for spawn is the center of this container */}
            {buildings.map((b, i) => (
                <div key={`${side}-${i}`}
                    id={`building-${side}-${i}`}
                    className="absolute origin-bottom opacity-0"
                    style={{
                        height: `${b.height}px`,
                        width: `${b.height * 0.6}px`, // Tree aspect ratio
                        top: 0,
                        zIndex: 20
                    }}
                >
                    {/* Neon Palm Tree SVG */}
                    <svg viewBox="0 0 100 150" className="w-full h-full drop-shadow-[0_0_5px_#ff0099]">
                        {/* Trunk */}
                        <path d="M50,150 Q45,100 50,50"
                            stroke="#aa00ff" strokeWidth="6" fill="none" strokeLinecap="round"
                            className="drop-shadow-[0_0_5px_#aa00ff]" />

                        {/* Trunk Segments */}
                        {Array.from({ length: 6 }).map((_, k) => (
                            <path key={k} d={`M45,${140 - k * 15} L55,${140 - k * 15}`}
                                stroke="#000" strokeWidth="2" opacity="0.3" />
                        ))}

                        {/* Leaves - Palm Crown */}
                        <g transform="translate(50,50)">
                            {/* Left Leaves */}
                            <path d="M0,0 Q-20,-10 -30,10" stroke="#00f2ff" strokeWidth="3" fill="none" />
                            <path d="M0,0 Q-25,-25 -40,-5" stroke="#00f2ff" strokeWidth="3" fill="none" />
                            <path d="M0,0 Q-15,-30 -25,-40" stroke="#00f2ff" strokeWidth="3" fill="none" />

                            {/* Right Leaves */}
                            <path d="M0,0 Q20,-10 30,10" stroke="#00f2ff" strokeWidth="3" fill="none" />
                            <path d="M0,0 Q25,-25 40,-5" stroke="#00f2ff" strokeWidth="3" fill="none" />
                            <path d="M0,0 Q15,-30 25,-40" stroke="#00f2ff" strokeWidth="3" fill="none" />

                            {/* Top Leaves */}
                            <path d="M0,0 Q0,-35 0,-45" stroke="#00f2ff" strokeWidth="3" fill="none" />
                        </g>
                    </svg>
                </div>
            ))}
        </div>
    );
};

export default Cityscape;
