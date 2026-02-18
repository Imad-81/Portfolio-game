"use client";
import React from "react";

interface BikeProps {
    speed?: number; // 0–1 normalized
}

const Bike: React.FC<BikeProps> = ({ speed = 0 }) => {
    const displayKmh = Math.round(8 + speed * 164); // 8–172 km/h range
    const needleAngle = -135 + speed * 270; // -135° to 135° sweep

    return (
        <div
            className="
        absolute
        bottom-[-14%]
        left-1/2
        -translate-x-1/2
        w-[700px]
        max-w-[94vw]
        pointer-events-none
        bike-cockpit
      "
        >
            <svg viewBox="0 0 900 380" className="w-full h-auto">
                <defs>
                    {/* ================= FILTERS ================= */}
                    <filter id="softGlow">
                        <feGaussianBlur stdDeviation="3" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    <filter id="strongGlow">
                        <feGaussianBlur stdDeviation="5" result="blur" />
                        <feMerge>
                            <feMergeNode in="blur" />
                            <feMergeNode in="blur" />
                            <feMergeNode in="SourceGraphic" />
                        </feMerge>
                    </filter>

                    {/* ================= GRADIENTS ================= */}
                    <linearGradient id="metal" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#555" />
                        <stop offset="50%" stopColor="#bbb" />
                        <stop offset="100%" stopColor="#555" />
                    </linearGradient>

                    <linearGradient id="chrome" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#999" />
                        <stop offset="50%" stopColor="#ddd" />
                        <stop offset="100%" stopColor="#777" />
                    </linearGradient>

                    <linearGradient id="edge" x1="0%" y1="0%" x2="100%" y2="0%">
                        <stop offset="0%" stopColor="#00f5ff" />
                        <stop offset="100%" stopColor="#ff4ecd" />
                    </linearGradient>

                    <linearGradient id="screen" x1="0%" y1="0%" x2="0%" y2="100%">
                        <stop offset="0%" stopColor="#001a1a" />
                        <stop offset="100%" stopColor="#000" />
                    </linearGradient>

                    <radialGradient id="mirrorGlow">
                        <stop offset="0%" stopColor="#00f5ff" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="#ff4ecd" stopOpacity="0" />
                    </radialGradient>
                </defs>

                {/* ================= WIREFRAME CABLES (BACK LAYER) ================= */}
                <g opacity="0.3">
                    <path d="M420 240 Q380 280, 340 320" stroke="#00f5ff" strokeWidth="1.5" />
                    <path d="M480 240 Q520 280, 560 320" stroke="#ff4ecd" strokeWidth="1.5" />
                    <circle cx="340" cy="320" r="3" fill="#00f5ff" opacity="0.6">
                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" />
                    </circle>
                    <circle cx="560" cy="320" r="3" fill="#ff4ecd" opacity="0.6">
                        <animate attributeName="opacity" values="0.4;0.8;0.4" dur="2s" repeatCount="indefinite" begin="1s" />
                    </circle>
                </g>

                {/* ================= HANDLEBARS ================= */}
                <path
                    d="M120 210 C230 175, 350 165, 450 165 C550 165, 670 175, 780 210"
                    stroke="url(#metal)"
                    strokeWidth="14"
                    fill="none"
                />

                {/* Neon edge highlight */}
                <path
                    d="M125 206 C235 175, 350 168, 450 168 C550 168, 665 175, 775 206"
                    stroke="url(#edge)"
                    strokeWidth="2"
                    opacity="0.7"
                    filter="url(#softGlow)"
                >
                    <animate attributeName="opacity" values="0.5;0.9;0.5" dur="4s" repeatCount="indefinite" />
                </path>

                {/* ================= BRAKE LEVERS ================= */}
                {[
                    { x: 160, angle: -12 },
                    { x: 740, angle: 12 },
                ].map((lever, i) => (
                    <g key={i} transform={`translate(${lever.x}, 195) rotate(${lever.angle})`}>
                        <rect x="-8" y="0" width="16" height="35" rx="4" fill="#333" stroke="#666" strokeWidth="1.5" />
                        <rect x="-6" y="8" width="12" height="3" fill="#00f5ff" opacity="0.8">
                            <animate attributeName="opacity" values="0.6;1;0.6" dur="3s" repeatCount="indefinite" />
                        </rect>
                    </g>
                ))}

                {/* ================= GRIPS WITH THROTTLE INDICATOR ================= */}
                {[
                    { x: 90, label: "L" },
                    { x: 760, label: "R" },
                ].map((g, i) => (
                    <g key={i}>
                        {/* Grip body */}
                        <rect
                            x={g.x}
                            y="195"
                            width="50"
                            height="60"
                            rx="10"
                            fill="#111"
                            stroke="#555"
                            strokeWidth="2"
                        />

                        {/* Grip segments */}
                        {Array.from({ length: 6 }).map((_, j) => (
                            <line
                                key={j}
                                x1={g.x + 8 + j * 6}
                                y1="200"
                                x2={g.x + 8 + j * 6}
                                y2="250"
                                stroke="#00f5ff"
                                opacity="0.35"
                            />
                        ))}

                        {/* Power indicator (right grip only) */}
                        {i === 1 && (
                            <rect x={g.x + 43} y="200" width="4" height="45" fill="#ffe066" opacity="0.7">
                                <animate attributeName="height" values="10;45;10" dur="2.5s" repeatCount="indefinite" />
                                <animate attributeName="y" values="235;200;235" dur="2.5s" repeatCount="indefinite" />
                            </rect>
                        )}

                        {/* Grip label */}
                        <text x={g.x + 25} y="270" textAnchor="middle" fontSize="10" fill="#666" fontFamily="monospace">
                            {g.label}
                        </text>
                    </g>
                ))}

                {/* ================= SIDE MIRRORS ================= */}
                {[
                    { x: 75, flip: false },
                    { x: 825, flip: true },
                ].map((mirror, i) => (
                    <g key={i}>
                        {/* Mirror mount arm */}
                        <line
                            x1={mirror.flip ? mirror.x : mirror.x + 30}
                            y1="205"
                            x2={mirror.x + (mirror.flip ? 40 : -10)}
                            y2="175"
                            stroke="url(#chrome)"
                            strokeWidth="3"
                        />

                        {/* Mirror housing */}
                        <ellipse
                            cx={mirror.x + (mirror.flip ? 45 : -15)}
                            cy="165"
                            rx="30"
                            ry="22"
                            fill="#0a0a0a"
                            stroke="#00f5ff"
                            strokeWidth="2"
                            opacity="0.9"
                        >
                            <animate attributeName="stroke" values="#00f5ff;#ff4ecd;#00f5ff" dur="6s" repeatCount="indefinite" />
                        </ellipse>

                        {/* Mirror reflection gradient */}
                        <ellipse
                            cx={mirror.x + (mirror.flip ? 45 : -15)}
                            cy="165"
                            rx="26"
                            ry="18"
                            fill="url(#mirrorGlow)"
                            opacity="0.6"
                        />

                        {/* Mirror highlight */}
                        <ellipse
                            cx={mirror.x + (mirror.flip ? 48 : -12)}
                            cy="162"
                            rx="8"
                            ry="6"
                            fill="#fff"
                            opacity="0.15"
                        />
                    </g>
                ))}

                {/* ================= CENTER CLAMP ================= */}
                <rect
                    x="410"
                    y="175"
                    width="80"
                    height="45"
                    rx="8"
                    fill="#222"
                    stroke="#666"
                    strokeWidth="2"
                />

                {/* Clamp detail lines */}
                <line x1="420" y1="197" x2="480" y2="197" stroke="#444" strokeWidth="1" />
                <circle cx="430" cy="197" r="3" fill="#00f5ff" opacity="0.5" />
                <circle cx="470" cy="197" r="3" fill="#ff4ecd" opacity="0.5" />

                {/* ================= MAIN DASHBOARD ================= */}
                <path
                    d="M340 80 H560 L610 180 H290 Z"
                    fill="#0a0a0a"
                    stroke="#555"
                    strokeWidth="2.5"
                />

                {/* Dashboard bezel glow */}
                <path
                    d="M342 82 H558 L608 178 H292 Z"
                    fill="none"
                    stroke="url(#edge)"
                    strokeWidth="1"
                    opacity="0.4"
                    filter="url(#softGlow)"
                >
                    <animate attributeName="opacity" values="0.3;0.6;0.3" dur="5s" repeatCount="indefinite" />
                </path>

                {/* ================= MULTI-GAUGE CLUSTER ================= */}
                {/* Left gauge - RPM/System */}
                <g transform="translate(360, 115)">
                    <circle cx="0" cy="0" r="30" fill="url(#screen)" stroke="#00f5ff" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="28" fill="none" stroke="#00f5ff" strokeWidth="0.5" opacity="0.3" />

                    {/* Gauge ticks */}
                    {Array.from({ length: 8 }).map((_, i) => {
                        const angle = (i * 45 - 135) * (Math.PI / 180);
                        return (
                            <line
                                key={i}
                                x1={Math.cos(angle) * 22}
                                y1={Math.sin(angle) * 22}
                                x2={Math.cos(angle) * 26}
                                y2={Math.sin(angle) * 26}
                                stroke="#00f5ff"
                                strokeWidth="1"
                                opacity="0.6"
                            />
                        );
                    })}

                    {/* Needle */}
                    <line
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="-20"
                        stroke="#00f5ff"
                        strokeWidth="2"
                        filter="url(#softGlow)"
                        transform={`rotate(${needleAngle})`}
                        style={{ transition: 'transform 0.15s ease-out' }}
                    />

                    <text y="20" textAnchor="middle" fontSize="8" fill="#00f5ff" opacity="0.7" fontFamily="monospace">
                        SYS
                    </text>
                </g>

                {/* Right gauge - Portfolio Progress */}
                <g transform="translate(540, 115)">
                    <circle cx="0" cy="0" r="30" fill="url(#screen)" stroke="#ff4ecd" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="28" fill="none" stroke="#ff4ecd" strokeWidth="0.5" opacity="0.3" />

                    {/* Progress arc */}
                    <path
                        d="M -21,-21 A 30 30 0 0 1 21,-21"
                        fill="none"
                        stroke="#ff4ecd"
                        strokeWidth="3"
                        opacity="0.8"
                    >
                        <animate attributeName="opacity" values="0.6;1;0.6" dur="2s" repeatCount="indefinite" />
                    </path>

                    <text y="20" textAnchor="middle" fontSize="8" fill="#ff4ecd" opacity="0.7" fontFamily="monospace">
                        PROG
                    </text>
                </g>

                {/* ================= CENTER SPEED DISPLAY ================= */}
                <rect
                    x="410"
                    y="100"
                    width="80"
                    height="50"
                    rx="6"
                    fill="#000"
                    stroke="#00f5ff"
                    strokeWidth="1.5"
                    opacity="0.9"
                />

                {/* Scan line effect */}
                <rect
                    x="412"
                    y="102"
                    width="76"
                    height="2"
                    fill="#00f5ff"
                    opacity="0.4"
                >
                    <animate attributeName="y" values="102;146;102" dur="2s" repeatCount="indefinite" />
                </rect>

                {/* Speed number */}
                <text
                    x="450"
                    y="133"
                    textAnchor="middle"
                    fontSize="26"
                    fill="#00f5ff"
                    fontFamily="monospace"
                    letterSpacing="2"
                    filter="url(#softGlow)"
                >
                    {displayKmh}
                    <animate attributeName="opacity" values="1;0.9;1" dur="1s" repeatCount="indefinite" />
                </text>

                <text
                    x="450"
                    y="147"
                    textAnchor="middle"
                    fontSize="8"
                    fill="#00f5ff"
                    opacity="0.6"
                    fontFamily="monospace"
                >
                    KM/H
                </text>

                {/* ================= STATUS INDICATORS ================= */}
                <g transform="translate(300, 145)">
                    {[
                        { label: "GIT", color: "#00f5ff" },
                        { label: "IN", color: "#ff4ecd" },
                        { label: "DEV", color: "#ffe066" },
                    ].map((status, i) => (
                        <g key={i} transform={`translate(${i * 32}, 0)`}>
                            <circle cx="0" cy="0" r="4" fill={status.color} opacity="0.8">
                                <animate attributeName="opacity" values="0.6;1;0.6" dur="1.5s" repeatCount="indefinite" begin={`${i * 0.5}s`} />
                            </circle>
                            <text x="0" y="12" textAnchor="middle" fontSize="7" fill={status.color} opacity="0.7" fontFamily="monospace">
                                {status.label}
                            </text>
                        </g>
                    ))}
                </g>

                {/* ================= PORTFOLIO STATS (RIGHT SIDE) ================= */}
                <g transform="translate(570, 145)">
                    <text x="0" y="0" fontSize="7" fill="#666" fontFamily="monospace">REPOS: 42</text>
                    <text x="0" y="12" fontSize="7" fill="#666" fontFamily="monospace">STAR: 128</text>
                </g>

                {/* ================= HUD OVERLAYS ================= */}
                {/* Top left objective */}
                <text x="20" y="30" fontSize="10" fill="#00f5ff" opacity="0.6" fontFamily="monospace">
                    &gt; MISSION: PORTFOLIO
                </text>

                {/* Top right stats */}
                <text x="880" y="30" textAnchor="end" fontSize="10" fill="#ff4ecd" opacity="0.6" fontFamily="monospace">
                    SECTIONS: 0/5
                </text>

                {/* Bottom hint */}
                <text x="450" y="360" textAnchor="middle" fontSize="9" fill="#666" fontFamily="monospace">
                    [ W - ACCELERATE ] [ A / D - STEER ]
                    <animate attributeName="opacity" values="0.4;0.7;0.4" dur="3s" repeatCount="indefinite" />
                </text>
            </svg>
        </div>
    );
};

export default Bike;
