"use client";
import React, { useRef, useState } from "react";
import { useRouter } from "next/navigation";
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
const STEER_SPEED = 8;     // lateral speed (pixels per frame)
const MAX_LATERAL = 900;   // Road width limit

// Portal X-Coordinates (Matches Portal.tsx offsets)
// Left: -250, Right: 250
const PORTALS = [
  { label: "GITHUB", href: "https://github.com/yourusername", side: "left", distance: 600, x: -250 },
  { label: "LINKEDIN", href: "https://linkedin.com/in/yourusername", side: "right", distance: 1200, x: 250 },
  { label: "FUN STUFF", href: "/fun", side: "left", distance: 1800, x: -250 },
  { label: "PROJECTS", href: "/projects", side: "right", distance: 2400, x: 250 },
] as const;

export default function Hero() {
  const router = useRouter();
  const containerRef = useRef<HTMLDivElement>(null);

  // Element Refs for Parallax
  const gridTextureRef = useRef<HTMLDivElement>(null);
  const gridTransformRef = useRef<HTMLDivElement>(null); // The parent 3D container
  const cityRef = useRef<HTMLDivElement>(null);
  const mountRef = useRef<HTMLDivElement>(null);

  const tiltRef = useRef<HTMLDivElement>(null);

  // State for UI text updates only
  const [isDriving, setIsDriving] = useState(false);
  const [bikeDistance, setBikeDistance] = useState(0);

  // Refs for animation logic (avoids re-running effects)
  const isDrivingRef = useRef(false);
  const driveTween = useRef<gsap.core.Tween | null>(null);

  // -1 = Left, 0 = Center, 1 = Right
  const steerState = useRef(0);

  // Lateral Position
  const bikeX = useRef(0);

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

    /* ===== DISTANCE TRACKING & COLLISION ===== */
    let animationFrameId: number;
    let dist = 0; // Local distance tracker for collision loop

    const updatePhysics = () => {
      // 1. Forward Speed
      const speed = isDrivingRef.current ? DRIVE_SPEED : IDLE_SPEED;
      dist += speed;
      setBikeDistance(prev => prev + speed);

      // 2. Lateral Steering (Only when driving)
      if (isDrivingRef.current && steerState.current !== 0) {
        bikeX.current += steerState.current * STEER_SPEED;

        // Clamp to road logic
        bikeX.current = Math.max(-MAX_LATERAL, Math.min(MAX_LATERAL, bikeX.current));
      } else if (!isDrivingRef.current) {
        // Auto-center when stopped (optional, maybe nice for idle)
        bikeX.current += (0 - bikeX.current) * 0.05;
      }

      // 3. Apply Parallax Transforms (Simulate Camera Moving)
      // Moving RIGHT (bikeX positive) means world moves LEFT (translateX negative)

      // Grid & Portals: 1:1 movement
      if (gridTransformRef.current) {
        gsap.set(gridTransformRef.current, {
          x: -bikeX.current
        });
      }

      // City: 50% parallax
      if (cityRef.current) {
        gsap.set(cityRef.current, {
          x: -bikeX.current * 0.5
        });
      }

      // Mountains: 10% parallax
      if (mountRef.current) {
        gsap.set(mountRef.current, {
          x: -bikeX.current * 0.1
        });
      }

      // 4. Collision Logic
      if (isDrivingRef.current) {
        PORTALS.forEach(p => {
          const deltaZ = p.distance - dist; // distance to portal (Z-axis relative)
          const deltaX = Math.abs(p.x - bikeX.current); // lateral offset

          // Collision Window:
          // Z: 0 to 50 meters in front
          // X: overlapping within ~80px (portal is roughly 150px wide)
          if (deltaZ < 50 && deltaZ > 0 && deltaX < 80) {
            triggerPortal(p.href);
          }
        });
      }

      animationFrameId = requestAnimationFrame(updatePhysics);
    };
    animationFrameId = requestAnimationFrame(updatePhysics);

    const triggerPortal = (href: string) => {
      // Simple redirect logic
      // Could add a "zoom" effect here later
      if (href.startsWith("http")) {
        window.location.href = href;
      } else {
        router.push(href);
      }
    };

    /* ===== SUBTLE CAMERA FLOAT (VERTICAL ONLY) ===== */
    gsap.to(tiltRef.current, {
      y: -4,
      duration: 6,
      ease: "sine.inOut",
      yoyo: true,
      repeat: -1,
    });

    /* ===== STEERING TILT ANIMATION ===== */
    const steerRot = gsap.quickTo(tiltRef.current, "rotationZ", {
      duration: 0.4,
      ease: "power2.out",
    });

    // Bike lean effect relies on steering direction
    const updateTilt = () => {
      steerRot(steerState.current * 3); // 3 degrees lean
    };

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
        steerState.current = -1;
        updateTilt();
      }

      if (e.key === "d" || e.key === "D") {
        steerState.current = 1;
        updateTilt();
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      if (["a", "A"].includes(e.key) && steerState.current === -1) {
        steerState.current = 0;
        updateTilt();
      }
      if (["d", "D"].includes(e.key) && steerState.current === 1) {
        steerState.current = 0;
        updateTilt();
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
          <div
            ref={mountRef}
            className="absolute bottom-0 w-full h-[120px] translate-y-[260px] pointer-events-none"
          >
            <Mountains />
          </div>

          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 translate-y-[120px] pointer-events-none">
            <RetroSun />
          </div>

          <div className="absolute bottom-0 w-full h-28 bg-gradient-to-t from-[#ff4ecd]/20 via-[#ff4ecd]/10 to-transparent blur-xl" />
        </div>

        {/* ===== CITY ===== */}
        <div
          ref={cityRef}
          className="absolute top-[50%] w-full h-full z-20 pointer-events-none"
        >
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
            {/* 
                Wrapper for internal X-translation (Lateral movement).
                The outer div holds the perspective and rotation.
                This inner div slides left/right.
             */}
            <div ref={gridTransformRef} className="w-full h-full [transform-style:preserve-3d] will-change-transform">
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

              {/* PORTALS (INSIDE GRID CONTAINER) */}
              {PORTALS.map((p, i) => (
                <Portal
                  key={i}
                  label={p.label}
                  href={p.href}
                  side={p.side as "left" | "right"}
                  distance={p.distance}
                  currentDistance={bikeDistance}
                />
              ))}
            </div>

          </div>
        </div>
      </div>

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
