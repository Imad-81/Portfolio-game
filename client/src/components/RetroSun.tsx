"use client";
import React from "react";

const RetroSun = () => {
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  if (!mounted) return null;

  return (
    <div
      className="
        absolute left-1/2 -translate-x-1/2 bottom-0
        w-[30vh] h-[30vh]
        rounded-full
        pointer-events-none
        mix-blend-screen
        sun-glow
      "
      style={{
        background:
          "linear-gradient(to bottom, #ffe066 0%, #ffb703 45%, #ff006e 100%)",
      }}
    >
      {/* SLATS */}
      <div className="absolute inset-0 rounded-full overflow-hidden">
        <div
          className="absolute inset-0 sun-slats"
          style={{
            background:
              "repeating-linear-gradient(to bottom, transparent 0%, transparent 78%, rgba(0,0,0,0.9) 78%, rgba(0,0,0,0.9) 100%)",
            backgroundSize: "100% 6%",
          }}
        />
      </div>
    </div>
  );
};

export default RetroSun;
