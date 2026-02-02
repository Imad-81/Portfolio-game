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
  const d = distance - currentDistance;

  /* ===== DEPTH & POSITION ===== */
  const horizon = 40;
  const depth = Math.abs(d) / 40;
  const scale = Math.max(0.3, Math.min(1.1, 1.8 / (1 + Math.abs(d) / 300)));
  const yPos = Math.min(70, horizon + depth);
  const opacity = Math.max(0.35, 1 - Math.abs(d) / 1500);

  const convergence = Math.abs(d) / 4200;
  const baseX = side === "left" ? 20 : 80;
  const xPos =
    side === "left"
      ? `${baseX + convergence * 6}%`
      : `${baseX - convergence * 6}%`;

  const focused = Math.abs(d) < 140;

  return (
    <div
      className="portal-container"
      style={{
        top: `${yPos}%`,
        left: xPos,
        transform: `translate(-50%, -50%) scale(${scale})`,
        opacity,
        cursor: "pointer",
      }}
    >
      {/* LABEL */}
      <div className="mb-6 flex justify-center">
        <HolographicLabel text={label} />
      </div>

      {/* PORTAL */}
      <svg
        viewBox="0 0 220 360"
        width="220"
        height="360"
        className={`portal-svg ${focused ? "portal-focused" : ""}`}
      >
        <defs>
          <linearGradient id="portal-edge" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#00f5ff" />
            <stop offset="100%" stopColor="#ff4ecd" />
          </linearGradient>

          <filter id="portal-glow">
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
          fill="none"
          stroke="url(#portal-edge)"
          strokeWidth="2"
          opacity="0.5"
          filter="url(#portal-glow)"
        />

        {/* INNER FRAME */}
        <rect
          x="40"
          y="40"
          width="140"
          height="280"
          fill="none"
          stroke="url(#portal-edge)"
          strokeWidth="2.5"
          opacity="0.9"
        />

        {/* SCAN LINE */}
        <rect
          x="42"
          y="60"
          width="136"
          height="2"
          fill="#00f5ff"
          opacity="0.35"
        >
          <animate
            attributeName="y"
            values="60;300;60"
            dur="4s"
            repeatCount="indefinite"
          />
        </rect>

        {/* PARTICLES */}
        {Array.from({ length: 12 }).map((_, i) => (
          <rect
            key={i}
            x={50 + Math.random() * 120}
            y={300 + Math.random() * 40}
            width="2"
            height="6"
            fill="#00f5ff"
            opacity="0.6"
          >
            <animate
              attributeName="y"
              values="320;60"
              dur={`${4 + Math.random() * 3}s`}
              repeatCount="indefinite"
              begin={`${Math.random() * 2}s`}
            />
            <animate
              attributeName="opacity"
              values="0;0.6;0"
              dur="2s"
              repeatCount="indefinite"
            />
          </rect>
        ))}
      </svg>
    </div>
  );
};

export default Portal;
