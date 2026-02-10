"use client";
import React from "react";
import HolographicLabel from "./HolographicLabel";

interface PortalProps {
  label: string;
  href: string;
  side: "left" | "right";
  distance: number;
  currentDistance: number;
  offset?: number;
}

const Portal: React.FC<PortalProps> = ({
  label,
  href,
  side,
  distance,
  currentDistance,
  offset,
}) => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  // Relative distance (meters/pixels) from the camera
  // If moving forward increases currentDistance, then:
  // positive result = in front of us
  // negative result = behind us
  const relativePos = distance - currentDistance;

  // Don't render if too far behind (performance & cleaner DOM)
  if (relativePos < -200) return null;
  // Don't render if too far ahead (optional optimization)
  if (relativePos > 6000) return null;

  // Side offset from center (0)
  // Use explicit offset if provided, otherwise fallback to side defaults
  const xOffset = offset !== undefined ? offset : (side === "left" ? -250 : 250);

  // Visual opacity fade approach
  const opacity = Math.min(1, Math.max(0, 1 - relativePos / 2500));

  // Calculate if focused for styling (close proximity)
  const isClose = relativePos < 500 && relativePos > 0;

  return (
    <div
      className="absolute top-1/2 left-1/2 will-change-transform"
      style={{
        transformStyle: "preserve-3d",
        transform: `
          translateX(-50%) 
          translateY(-50%)
          translateY(${-relativePos}px) 
          translateX(${xOffset}px) 
          rotateX(-75deg)
          scale(1.5)
        `,
        opacity,
        zIndex: Math.floor(1000 - relativePos), // Simple z-sorting
      }}
    >
      {/* HITBOX DEBUG (optional) */}
      {/* <div className="absolute inset-0 bg-red-500/20" /> */}

      {/* LABEL */}
      <div className="mb-6 flex justify-center [transform-style:preserve-3d] translate-z-[50px]">
        <HolographicLabel text={label} />
      </div>

      {/* PORTAL SVG */}
      <div className="relative">
        <svg
          viewBox="0 0 220 360"
          width="220"
          height="360"
          className={`transition-all duration-300 ${isClose ? "drop-shadow-[0_0_30px_rgba(0,245,255,0.6)]" : ""}`}
          style={{
            filter: isClose ? "brightness(1.2)" : "none"
          }}
        >
          <defs>
            <linearGradient id={`portal-edge-${label}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#00f5ff" />
              <stop offset="100%" stopColor="#ff4ecd" />
            </linearGradient>

            <filter id={`portal-glow-${label}`}>
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* OUTER FRAME */}
          <rect
            x="20"
            y="20"
            width="180"
            height="320"
            fill="rgba(0,0,0,0.4)"
            stroke={`url(#portal-edge-${label})`}
            strokeWidth="2"
            opacity="0.55"
            filter={`url(#portal-glow-${label})`}
          />

          {/* INNER FRAME */}
          <rect
            x="40"
            y="40"
            width="140"
            height="280"
            fill="none"
            stroke={`url(#portal-edge-${label})`}
            strokeWidth="2.5"
            opacity="0.9"
          />

          {/* SCAN LINE */}
          <rect x="42" y="60" width="136" height="2" fill="#00f5ff" opacity="0.35">
            <animate
              attributeName="y"
              values="60;300;60"
              dur="4s"
              repeatCount="indefinite"
            />
          </rect>

          {/* PARTICLES */}
          {Array.from({ length: 6 }).map((_, i) => (
            <rect
              key={i}
              x={60 + Math.abs(Math.sin(i * 32.1)) * 100}
              y={300 + Math.abs(Math.cos(i * 12.3)) * 40}
              width="2"
              height="6"
              fill="#00f5ff"
              opacity="0.6"
            >
              <animate
                attributeName="y"
                values="320;60"
                dur={`${3 + Math.abs(Math.sin(i * 99.9)) * 3}s`}
                repeatCount="indefinite"
                begin={`${Math.abs(Math.cos(i * 55.5)) * 2}s`}
              />
              <animate
                attributeName="opacity"
                values="0;0.6;0"
                dur="2.5s"
                repeatCount="indefinite"
              />
            </rect>
          ))}
        </svg>

        {/* 🔹 GRID CONTACT GLOW */}
        {/* We move this 'down' in Y (which is flat on grid) or Z? 
            Visual context: Portal is standing up. 
            Ground is at local Y=Bottom of SVG?
            SVG is 360 high. 
        */}
        <div
          style={{
            position: "absolute",
            bottom: "-10px",
            left: "50%",
            width: "140px",
            height: "40px",
            transform: "translateX(-50%) rotateX(75deg)", // Lay flat on the virtual ground again?
            // Actually parent is 'standing up' with rotateX(-75).
            // So if we want this flat on ground, we rotateX(75) relative to parent?
            background:
              "radial-gradient(ellipse at center, rgba(0,245,255,0.6), transparent 70%)",
            filter: "blur(12px)",
            opacity: 0.8,
          }}
        />
      </div>
    </div>
  );
};

export default Portal;
