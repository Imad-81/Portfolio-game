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
                height: Math.random() * 100 + 150, // Base height (scaled later)
                width: Math.random() * 30 + 40,
                color: '#050110', // Dark solid base
                neonColor: `hsl(${Math.random() * 360}, 100%, 50%)`,
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
                const endX = (side === 'left' ? -1 : 1) * (150 + Math.random() * 200); // Random spread

                // Create a timeline for infinite loop
                gsap.timeline({
                    repeat: -1,
                    delay: Math.random() * 5 // Random start delay for natural feel
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
                        width: `${b.width}px`,
                        backgroundColor: b.color,
                        boxShadow: `0 0 10px ${b.neonColor}, inset 0 0 20px ${b.neonColor}40`, // Solid neon glow
                        border: `2px solid ${b.neonColor}`,
                        top: 0, // Horizon line anchor
                    }}
                >
                    {b.isBillboard ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-black/90 m-1 border border-white animate-pulse shadow-[0_0_20px_white]">
                            <span className="text-lg neon-text font-bold tracking-widest">{b.billboardContent}</span>
                        </div>
                    ) : (
                        // Solid Monolith look - maybe just a vertical line
                        <div className="w-[2px] h-full bg-white/20 mx-auto blur-[1px]"></div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default Cityscape;
