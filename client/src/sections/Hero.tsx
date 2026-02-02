"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { useGSAP } from "@gsap/react";
import Cityscape from "../components/Cityscape";
import RetroSun from "../components/RetroSun";
import Mountains from "../components/Mountains";
import Bike from "../components/bike/bike";
import Portal from "../components/Portal";


/* ===== SPEED TUNING ===== */
const IDLE_SPEED = 0.15;   // subtle ambient motion
const DRIVE_SPEED = 1;     // active driving speed

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const gridTextureRef = useRef<HTMLDivElement>(null);
  const tiltRef = useRef<HTMLDivElement>(null);

  // State for UI text updates only
  const [isDriving, setIsDriving] = useState(false);
  const [bikeDistance, setBikeDistance] = useState(0);

  // Refs for animation logic (avoids re-running effects)
  const isDrivingRef = useRef(false);
  const driveTween = useRef<gsap.core.Tween | null>(null);

  useGSAP(() => {
    /* ===== GRID WORLD LOOP (ALWAYS RUNNING) ===== */
    driveTween.current = gsap.to(gridTextureRef.current, {
      y: 60,
      duration: 1,
      ease: "none",
      repeat: -1,
      modifiers: {
        y: gsap.utils.unitize((y) => parseFloat(y) % 60),
      },
    });

    // Start in idle mode
    driveTween.current.timeScale(IDLE_SPEED);

    /* ===== DISTANCE TRACKING ===== */
    let animationFrameId: number;
    const updateDistance = () => {
      if (isDrivingRef.current) {
        setBikeDistance((prev) => prev + DRIVE_SPEED);
      } else {
        setBikeDistance((prev) => prev + IDLE_SPEED);
      }
      animationFrameId = requestAnimationFrame(updateDistance);
    };
    animationFrameId = requestAnimationFrame(updateDistance);

    /* ===== SUBTLE CAMERA FLOAT  ===== */
    gsap.to(tiltRef.current, {
      y: -4,
      duration: 6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    /* ===== STEERING ===== */
    const steerX = gsap.quickTo(tiltRef.current, "x", {
      duration: 0.6,
      ease: "power2.out",
    });

    const steerRot = gsap.quickTo(tiltRef.current, "rotationZ", {
      duration: 0.6,
      ease: "power2.out",
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Driving Mode
      if (e.key === "w" || e.key === "W") {
        const nextState = !isDrivingRef.current;
        isDrivingRef.current = nextState;
        setIsDriving(nextState); // Update UI state

        // Smoothly speed up or slow down
        if (driveTween.current) {
          gsap.to(driveTween.current, {
            timeScale: nextState ? DRIVE_SPEED : IDLE_SPEED,
            duration: 0.6,
            ease: "power2.out",
          });
        }
      }

      if (!isDrivingRef.current) return;

      if (e.key === "a" || e.key === "A") {
        steerX(-40);
        steerRot(-3);
      }

      if (e.key === "d" || e.key === "D") {
        steerX(40);
        steerRot(3);
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (!isDrivingRef.current) return;
      if (["a", "A", "d", "D"].includes(e.key)) {
        steerX(0);
        steerRot(0);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      cancelAnimationFrame(animationFrameId);
    };
  }, { scope: containerRef, dependencies: [] }); // Empty dependency array ensures effect runs only once

  return (
    <section
      ref={containerRef}
      className="relative h-screen w-full overflow-hidden bg-[#120024]"
    >
      {/* VIGNETTE */}
      <div className="pointer-events-none absolute inset-0 z-40 bg-[radial-gradient(circle_at_center,transparent_45%,rgba(0,0,0,0.55)_100%)]" />

      {/* CRT */}
      <div className="crt-overlay" />

      <div
        ref={tiltRef}
        className="relative w-full h-full will-change-transform z-10"
      >
        {/* ===== HORIZON ===== */}
        <div className="absolute top-[40%] w-full">
          <div className="absolute bottom-0 w-full h-[120px] translate-y-[260px] pointer-events-none">
            <Mountains />
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[120px] pointer-events-none">
            <RetroSun />
          </div>

          <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-[#ff4ecd]/20 via-[#ff4ecd]/10 to-transparent blur-xl" />
        </div>

        {/* ===== CITY ===== */}
        <div className="absolute top-[50%] w-full h-full z-20 pointer-events-none">
          <Cityscape side="left" />
          <Cityscape side="right" />
        </div>

        {/* ===== GRID ===== */}
        <div className="absolute top-[40%] w-full h-[60%] overflow-hidden z-10">
          <div
            className="
              absolute w-[200%] h-[200%] -left-[50%] -top-[50%]
              [transform-style:preserve-3d]
              [transform:perspective(240px)_rotateX(75deg)]
            "
          >
            <div
              ref={gridTextureRef}
              className="w-[400vw] h-[400vw]"
              style={{
                backgroundImage: `
                  linear-gradient(to right, var(--color-grid-pink) 2px, transparent 2px),
                  linear-gradient(to bottom, var(--color-grid-pink) 2px, transparent 2px)
                `,
                backgroundSize: "60px 60px",
                maskImage:
                  "linear-gradient(to top, black 0%, black 55%, transparent 100%)",
              }}
            />
          </div>
        </div>
      </div>

      {/* ===== PORTALS (GROUNDED - OUTSIDE CAMERA TILT) ===== */}
      <Portal
        label="GITHUB"
        href="https://github.com/yourusername"
        side="left"
        distance={600}
        currentDistance={bikeDistance}
      />
      <Portal
        label="LINKEDIN"
        href="https://linkedin.com/in/yourusername"
        side="right"
        distance={1200}
        currentDistance={bikeDistance}
      />
      <Portal
        label="FUN STUFF"
        href="/fun"
        side="left"
        distance={1800}
        currentDistance={bikeDistance}
      />
      <Portal
        label="PROJECTS"
        href="/projects"
        side="right"
        distance={2400}
        currentDistance={bikeDistance}
      />

      {/* ===== BIKE (FPP COCKPIT) ===== */}
      <div className="absolute inset-0 z-30 pointer-events-none">
        <Bike />
      </div>

      {/* UI */}
      <div className="absolute bottom-8 w-full text-center text-white/60 text-xs tracking-widest z-50">
        {isDriving ? "A / D — STEER   ·   W — STOP" : "W — START DRIVING"}
      </div>
    </section>
  );
}   
