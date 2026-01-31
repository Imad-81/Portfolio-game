"use client";
import React, { useRef } from 'react';
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';
import Cityscape from '../components/Cityscape';
import RetroSun from '../components/RetroSun';
import Mountains from '../components/Mountains';

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
    <section ref={containerRef} className="relative h-screen w-full overflow-hidden flex flex-col items-center justify-center bg-[#120024]">
      {/* Global CRT Overlay */}
      <div className="crt-overlay"></div>

      <div ref={tiltRef} className="relative w-full h-full flex flex-col items-center justify-center transition-transform will-change-transform z-10">

        {/* Horizon Line - Lowered for Bike POV (approx 40%) */}
        <div className="absolute top-[40%] w-full flex justify-center z-0">

          {/* Mountains - Sits slightly BEHIND fading/masking to look distant */}
          {/* Scaled down height for "distance" feel and pushed down */}
          <div className="absolute bottom-0 w-full h-[100px] flex justify-center z-10 pointer-events-none transform translate-y-[260px]">
            <Mountains />
          </div>

          {/* Retro Sun - Behind Mountains */}
          <div className="absolute bottom-0 z-0 transform translate-y-[120px] pointer-events-none">
            <RetroSun />
          </div>

        </div>

        {/* Cityscape (Palm Trees) */}
        <div className="absolute top-[50%] w-full h-full z-20 pointer-events-none">
          <Cityscape side="left" />
          <Cityscape side="right" />
        </div>

        {/* Wireframe Grid Floor - Fixed Visibility */}
        {/* Using a large plane that starts from the horizon and extends down */}
        <div className="absolute top-[40%] w-full h-[60%] overflow-hidden z-10">
          <div className="absolute w-[200%] h-[200%] -left-[50%] -top-[50%] bg-transparent flex justify-center 
                              [transform-style:preserve-3d] [transform:perspective(200px)_rotateX(75deg)] origin-center">
            <div className="w-[400vw] h-[400vw] bg-transparent animate-grid-scroll"
              style={{
                backgroundImage: `
                                linear-gradient(to right, var(--color-grid-pink) 2px, transparent 2px),
                                linear-gradient(to bottom, var(--color-grid-pink) 2px, transparent 2px)
                            `,
                backgroundSize: '60px 60px',
                maskImage: 'linear-gradient(to top, black 0%, black 60%, transparent 100%)'
              }}
            ></div>
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
