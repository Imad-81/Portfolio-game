"use client";
import React from "react";

const Mountains = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div className="absolute left-0 w-full h-full pointer-events-none z-10 opacity-45 mix-blend-screen">
      <svg
        viewBox="0 0 1200 300"
        preserveAspectRatio="none"
        className="w-full h-full"
      >
        <defs>
          {/* Strong neon glow */}
          <filter id="strongGlow">
            <feGaussianBlur stdDeviation="4.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>

          {/* Irregular mountain silhouette */}
          <mask id="mountain-mask">
            <path
              d="
                M0,300
                L0,215
                L70,165
                L130,235
                L210,130
                L290,245
                L360,150
                L430,260
                L510,120
                L580,225
                L650,145
                L710,255
                L790,135
                L860,215
                L920,160
                L990,235
                L1050,155
                L1120,220
                L1200,195
                L1200,300 Z
              "
              fill="white"
            />
          </mask>
        </defs>

        {/* Horizontal grid lines – irregular contours */}
        {Array.from({ length: 22 }).map((_, i) => (
          <path
            key={`h-${i}`}
            d={`
              M0 ${115 + i * 8}
              L90 ${95 + i * 7}
              L170 ${135 + i * 8}
              L260 ${85 + i * 7}
              L340 ${145 + i * 9}
              L430 ${90 + i * 7}
              L510 ${155 + i * 8}
              L590 ${80 + i * 7}
              L670 ${135 + i * 9}
              L750 ${95 + i * 8}
              L820 ${150 + i * 9}
              L900 ${115 + i * 8}
              L980 ${140 + i * 9}
              L1050 ${120 + i * 8}
              L1120 ${155 + i * 9}
              L1200 ${130 + i * 8}
            `}
            stroke="#00f2ff"
            strokeWidth="1.15"
            fill="none"
            opacity="0.7"
            mask="url(#mountain-mask)"
            filter="url(#strongGlow)"
          />
        ))}

        {/* Vertical grid lines – uneven spacing */}
        {[
          0, 40, 85, 140, 210, 265, 330, 395, 470, 545, 610, 690, 770, 840, 920,
          995, 1070, 1145
        ].map((x, i) => (
          <path
            key={`v-${i}`}
            d={`M${x} 85 L${x + (i % 2 ? 6 : -4)} 300`}
            stroke="#00f2ff"
            strokeWidth="1"
            opacity="0.15"
            mask="url(#mountain-mask)"
            filter="url(#strongGlow)"
          />
        ))}
      </svg>

      {/* Atmospheric distance fade */}
      <div className="absolute bottom-0 left-0 w-full h-2/3 bg-gradient-to-t from-[#120024] via-[#120024]/55 to-transparent" />
    </div>
  );
};

export default Mountains;
