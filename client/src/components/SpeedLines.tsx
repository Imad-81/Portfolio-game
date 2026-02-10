"use client";
import React from "react";

const SpeedLines = ({ isActive }: { isActive: boolean }) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);

    if (!mounted) return null;

    return (
        <div
            className={`pointer-events-none absolute inset-0 z-50 overflow-hidden transition-opacity duration-300 ${isActive ? "opacity-100" : "opacity-0"
                }`}
        >
            <svg
                className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 scale-[2]"
                width="100%"
                height="100%"
                viewBox="0 0 100 100"
                preserveAspectRatio="none"
            >
                <radialGradient id="speed-gradient" cx="50%" cy="50%" r="50%">
                    <stop offset="0%" stopColor="transparent" />
                    <stop offset="60%" stopColor="transparent" />
                    <stop offset="100%" stopColor="rgba(0, 245, 255, 0.3)" />
                </radialGradient>

                {/* Radiating Lines */}
                {Array.from({ length: 20 }).map((_, i) => (
                    <line
                        key={i}
                        x1="50"
                        y1="50"
                        x2={50 + Math.cos(i * 18 * (Math.PI / 180)) * 100}
                        y2={50 + Math.sin(i * 18 * (Math.PI / 180)) * 100}
                        stroke="url(#speed-gradient)"
                        strokeWidth="0.5"
                        strokeDasharray="10 90" // dashes
                        strokeDashoffset="0"
                        opacity={0.6 + Math.abs(Math.sin(i * 12.3)) * 0.4}
                    >
                        <animate
                            attributeName="stroke-dashoffset"
                            from="100"
                            to="0"
                            dur={`${0.2 + Math.abs(Math.cos(i * 45.6)) * 0.3}s`} // fast speed
                            repeatCount="indefinite"
                        />
                        <animate
                            attributeName="stroke-width"
                            values="0.1; 0.8; 0.1"
                            dur={`${0.5 + Math.abs(Math.sin(i * 78.9))}s`}
                            repeatCount="indefinite"
                        />
                    </line>
                ))}
            </svg>

            {/* Edge Blur Vignette for Speed */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,rgba(0,0,0,0)_60%,rgba(0,245,255,0.05)_100%)] mix-blend-screen" />
        </div>
    );
};

export default SpeedLines;
