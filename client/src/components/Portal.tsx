"use client";
import React from "react";
import HolographicLabel from "./HolographicLabel";

interface PortalProps {
    label: string;
    href: string;
    side: "left" | "right";
    distance: number;
    currentDistance: number;
}

const Portal: React.FC<PortalProps> = ({
    label,
    href,
    side,
    distance,
    currentDistance,
}) => {
    // Calculate distance from bike
    const distanceFromBike = distance - currentDistance;

    // === 3D PERSPECTIVE CALCULATIONS ===

    // Vertical perspective (portals rise toward horizon as distance increases)
    const horizonY = 42; // horizon line percentage from top
    const baseY = 60; // where portals appear when at bike position
    const verticalPos = baseY - (distanceFromBike / 1500) * (baseY - horizonY);

    // Enhanced perspective scaling (dramatic size reduction with distance)
    const maxScale = 1.2;
    const minScale = 0.2;
    const scale = Math.max(minScale, Math.min(maxScale, maxScale - Math.abs(distanceFromBike) / 800));

    // Atmospheric fade (fog effect with distance)
    const opacity = Math.max(0.3, Math.min(1, 1 - Math.abs(distanceFromBike) / 1200));

    // Horizontal convergence (portals move slightly toward center when far)
    const convergence = distanceFromBike / 3000;
    const baseXPos = side === "left" ? 15 : 85;
    const xPos = side === "left"
        ? `${baseXPos + convergence * 3}%`
        : `${baseXPos - convergence * 3}%`;

    // Check if in warning zone
    const inWarningZone = Math.abs(distanceFromBike) < 150;

    // Handle click (placeholder for now)
    const handleClick = () => {
        console.log(`Portal clicked: ${label}`);
    };

    return (
        <div
            className="portal-container"
            style={{
                top: `${verticalPos}%`,
                left: xPos,
                transform: `translateX(-50%) translateY(-50%) scale(${scale})`,
                opacity,
                cursor: "pointer",
            }}
            onClick={handleClick}
        >
            {/* Holographic Label */}
            <div className="portal-label-wrapper">
                <HolographicLabel text={label} />
            </div>

            {/* Portal Frame and Energy */}
            <svg
                viewBox="0 0 200 400"
                className={`portal-svg ${inWarningZone ? "portal-warning" : ""}`}
                style={{ width: "200px", height: "400px" }}
            >
                <defs>
                    {/* Energy gradient */}
                    <radialGradient id={`portal-energy-${label}`} cx="50%" cy="50%">
                        <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.8" />
                        <stop offset="50%" stopColor="#ff4ecd" stopOpacity="0.6" />
                        <stop offset="100%" stopColor="#240046" stopOpacity="0.3" />
                    </radialGradient>

                    {/* Swirl gradient */}
                    <linearGradient id={`portal-swirl-${label}`} x1="0%" y1="0%" x2="100%" y2="100%">
                        <stop offset="0%" stopColor="#00f5ff">
                            <animate attributeName="stop-color" values="#00f5ff;#ff4ecd;#00f5ff" dur="3s" repeatCount="indefinite" />
                        </stop>
                        <stop offset="100%" stopColor="#ff4ecd">
                            <animate attributeName="stop-color" values="#ff4ecd;#00f5ff;#ff4ecd" dur="3s" repeatCount="indefinite" />
                        </stop>
                    </linearGradient>

                    {/* Glow filter */}
                    <filter id={`portal-glow-${label}`}>
                        <feGaussianBlur stdDeviation="8" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>
                </defs>

                {/* Outer glow */}
                <rect
                    x="30"
                    y="50"
                    width="140"
                    height="300"
                    rx="10"
                    fill={`url(#portal-energy-${label})`}
                    opacity="0.3"
                    filter={`url(#portal-glow-${label})`}
                />

                {/* Energy vortex */}
                <ellipse
                    cx="100"
                    cy="200"
                    rx="60"
                    ry="120"
                    fill={`url(#portal-swirl-${label})`}
                    opacity="0.7"
                    className="portal-vortex"
                />

                {/* Particles */}
                {Array.from({ length: 12 }).map((_, i) => (
                    <circle
                        key={i}
                        cx={80 + Math.random() * 40}
                        cy="350"
                        r={2 + Math.random() * 2}
                        fill="#00f5ff"
                        opacity="0.8"
                        className="portal-particle"
                        style={{
                            animationDelay: `${i * 0.3}s`,
                        }}
                    />
                ))}

                {/* Portal frame */}
                <rect
                    x="40"
                    y="60"
                    width="120"
                    height="280"
                    rx="8"
                    fill="none"
                    stroke={`url(#portal-swirl-${label})`}
                    strokeWidth="3"
                    opacity="0.9"
                >
                    <animate attributeName="stroke-opacity" values="0.7;1;0.7" dur="2s" repeatCount="indefinite" />
                </rect>

                {/* Inner frame detail */}
                <rect
                    x="45"
                    y="65"
                    width="110"
                    height="270"
                    rx="6"
                    fill="none"
                    stroke="#fff"
                    strokeWidth="1"
                    opacity="0.3"
                />
            </svg>
        </div>
    );
};

export default Portal;
