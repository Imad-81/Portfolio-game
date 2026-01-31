"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Cityscape from '../components/Cityscape';

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const roadRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  useGSAP(() => {
    // Road Animation (Base Speed)
    // Moves the background/dashed line down to simulate forward movement
    gsap.to(roadRef.current, {
      y: 100, // Move down by a segment
      duration: 1, // Speed
      ease: "none",
      repeat: -1,
      // Reset logic would be needed for seamless loop, relying on CSS dashed-line repeat for now or texture
      modifiers: {
        y: gsap.utils.unitize(y => parseFloat(y) % 100) // Assuming dashed line repeats every 100px approx
      }
    });

    // Dr. Driving Tilt Logic
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'a' || e.key === 'A') {
        gsap.to(tiltRef.current, {
          rotationZ: -5, // Tilt left
          x: -50, // Move left
          duration: 0.5,
          ease: "power2.out"
        });
      } else if (e.key === 'd' || e.key === 'D') {
        gsap.to(tiltRef.current, {
          rotationZ: 5, // Tilt right
          x: 50, // Move right
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (['a', 'A', 'd', 'D'].includes(e.key)) {
        gsap.to(tiltRef.current, {
          rotationZ: 0,
          x: 0,
          duration: 0.5,
          ease: "power2.out"
        });
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, { scope: containerRef });

  return (
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#0a0118]">
      <div ref={tiltRef} className="relative w-full h-full flex flex-col items-center justify-center transition-transform will-change-transform">
        {/* Horizon Line */}
        <div className="absolute top-[30%] w-full h-[2px] bg-accent blur-[2px] z-10 shadow-[0_0_20px_var(--color-accent)]"></div>

        <h1 className="absolute top-[10%] z-20 text-6xl font-bold text-accent animate-pulse drop-shadow-[0_0_15px_rgba(188,19,254,0.8)]">
          CYBER RIDE
        </h1>

        {/* Cityscape Backgrounds - Placed behind the road but in the tilt container */}
        <Cityscape side="left" />
        <Cityscape side="right" />

        {/* 3D Road Container - Lowered and tilted more aggressively */}
        <div className="absolute top-[30%] w-full h-[150vh] flex justify-center [transform-style:preserve-3d] [transform:perspective(500px)_rotateX(80deg)] origin-top z-10">
          {/* The Road */}
          <div className="w-[400px] h-full bg-gray-900 relative shadow-[0_0_50px_var(--color-primary)] overflow-hidden border-x-4 border-primary/50">
            {/* Moving Road Texture */}
            <div ref={roadRef} className="absolute inset-0 flex justify-center h-[200%] -top-[100%]">
              {/* Center Line */}
              <div className="w-6 h-full bg-transparent"
                style={{
                  backgroundImage: 'linear-gradient(to bottom, var(--color-accent) 50%, transparent 50%)',
                  backgroundSize: '100% 200px'
                }}
              ></div>
            </div>

            {/* Side Glows */}
            <div className="absolute left-0 top-0 bottom-0 w-2 bg-primary blur-[2px] shadow-[0_0_20px_var(--color-primary)]"></div>
            <div className="absolute right-0 top-0 bottom-0 w-2 bg-primary blur-[2px] shadow-[0_0_20px_var(--color-primary)]"></div>
          </div>
        </div>
      </div>

      {/* Verification Text */}
      <div className="absolute bottom-10 text-white/50 text-sm z-30">
        Controls: Press 'A' or 'D' to steer
      </div>
    </section>
  );
}
