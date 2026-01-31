"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

const RetroSun = () => {
    const sunRef = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        // Animate the slats moving upwards
        gsap.to(".sun-slat", {
            y: -10, // Move up slightly
            height: 0, // Shrink as they go up? 
            // Better: Move the background-position if using gradients, or translate divs.
            // Let's rely on CSS animation for the slats as it's cleaner for infinite loops sometimes, or simple GSAP.

            // Actually, simplest way for the "blinds" effect:
            // Animate a mask or a repeating gradient.
            // Let's use GSAP to move a repeating gradient mask.
        });
    }, { scope: sunRef });

    return (
        <div ref={sunRef} className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[50vh] h-[50vh] rounded-full z-0 pointer-events-none mix-blend-screen"
            style={{
                background: 'linear-gradient(to bottom, #ffdd00 0%, #ffaa00 50%, #ff0055 100%)', // Yellow -> Orange -> Red
                boxShadow: '0 0 50px #ff5500, 0 0 100px #ffdd00'
            }}
        >
            {/* The Slats/Blinds Mask */}
            <div className="absolute inset-0 w-full h-full rounded-full overflow-hidden">
                {/* Moving Slat Animation Container */}
                <div className="absolute inset-0 bg-transparent animate-sun-slats"
                    style={{
                        // Sharp black lines
                        background: 'repeating-linear-gradient(to bottom, transparent 0%, transparent 90%, #000 90%, #000 100%)',
                        backgroundSize: '100% 8%'
                    }}
                ></div>
            </div>
        </div>
    );
};

export default RetroSun;
