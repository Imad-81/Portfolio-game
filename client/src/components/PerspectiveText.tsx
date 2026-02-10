"use client";
import React, { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

interface PerspectiveTextProps {
    text: string;
    initialX: number; // %
    initialY: number; // %
    depth?: number;   // 1 = close/large, 0.5 = far/small
    color?: string;
    mousePos: React.MutableRefObject<{ x: number; y: number }>;
}

export default function PerspectiveText({
    text,
    initialX,
    initialY,
    depth = 1,
    color = "rgba(255,255,255,0.1)", // Much lower base opacity
    mousePos,
}: PerspectiveTextProps) {
    const ref = useRef<HTMLDivElement>(null);

    useGSAP(() => {
        if (!ref.current) return;

        // 1. Permanent Float Animation (More dynamic)
        gsap.to(ref.current, {
            y: "+=50",
            x: "+=20",
            rotation: "random(-15, 15)",
            duration: "random(6, 12)",
            yoyo: true,
            repeat: -1,
            ease: "sine.inOut",
        });

        // 2. Mouse Interaction (Deep Parallax)
        const xFactor = 80 * depth; // Stronger movement
        const yFactor = 40 * depth;
        const zFactor = 100 * (depth - 0.5); // Z-depth parallax

        gsap.ticker.add(() => {
            if (!ref.current) return;

            // Calculate target based on mouse position (-1 to 1 range)
            const targetX = mousePos.current.x * xFactor;
            const targetY = mousePos.current.y * yFactor;

            // Smoothly interpolate current transform to target
            gsap.to(ref.current, {
                x: targetX,
                y: targetY,
                z: zFactor, // True 3D depth
                rotateX: -mousePos.current.y * 20 * depth, // Stronger tilt
                rotateY: mousePos.current.x * 20 * depth,
                duration: 1.5,
                ease: "power2.out",
                overwrite: "auto"
            });
        });

    }, { dependencies: [] });

    return (
        <div
            ref={ref}
            className="absolute pointer-events-none select-none font-black tracking-tighter uppercase whitespace-nowrap will-change-transform"
            style={{
                left: `${initialX}%`,
                top: `${initialY}%`,
                color: color,
                fontSize: `${2.5 * depth}rem`, // Much smaller size
                opacity: 0.6 * depth,          // Adjusted opacity
                // Blur distant items slightly for depth of field
                filter: depth < 0.8 ? 'blur(2px)' : 'none'
            }}
        >
            {text}
        </div>
    );
}
