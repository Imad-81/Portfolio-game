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
import SpeedLines from "../components/SpeedLines";

const ENABLE_SPEED_LINES = false;


/* ===== SPEED TUNING ===== */
const IDLE_SPEED = 0.15;   // subtle ambient motion
const DRIVE_SPEED = 4;     // active driving speed
const STEER_SPEED = 3;     // lateral speed (pixels per frame)
const MAX_LATERAL = 900;   // Road width limit
const TRACK_LENGTH = 3000; // Loop distance

// Portal X-Coordinates (Matches Portal.tsx offsets)
// Left: -250, Right: 250
const PORTALS = [
  { label: "GITHUB", href: "https://github.com/Imad-81", side: "left", distance: 600, x: -250 },
  { label: "LINKEDIN", href: "https://www.linkedin.com/in/shaik-imaduddin-a79887390/", side: "right", distance: 1200, x: 250 },
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

  // FX Refs
  const rumbleRef = useRef<HTMLDivElement>(null); // Separate shake container

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

    /* ===== DISTANCE TRACKING & COLLISION & RUMBLE ===== */
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

      // 4. Camera Rumble (High Frequency Shake)
      if (rumbleRef.current) {
        if (isDrivingRef.current) {
          gsap.set(rumbleRef.current, {
            x: (Math.random() - 0.5) * 2, // +/- 1.5px
            y: (Math.random() - 0.5) * 2
          });
        } else {
          gsap.set(rumbleRef.current, { x: 0, y: 0 });
        }
      }

      // 5. Collision Logic
      if (isDrivingRef.current) {
        PORTALS.forEach(p => {
          // INFINITE LOOP LOGIC:
          // We map the portal's static distance to a relative position in the current loop window
          // If (p.distance - dist) is -500 (behind us), we want to treat it as +2500 (ahead of us) 
          // ONLY if we treat the world as circular.

          // Calculate re-adjusted distance relative to bike
          // Modulo logic:
          // Adjust p.distance so it's always "in front" of dist by some amount, modulo TRACK_LENGTH.
          // Correct math: 
          // delta = (p.distance - dist) % TRACK_LENGTH;
          // If delta < 0, delta += TRACK_LENGTH;

          let deltaZ = (p.distance - dist) % TRACK_LENGTH;
          if (deltaZ < 0) deltaZ += TRACK_LENGTH;

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

    // FOV Surge (Scale Effect)
    const surge = (active: boolean) => {
      gsap.to(containerRef.current, {
        scale: active ? 1.02 : 1, // Slight punch in or out
        duration: 0.8,
        ease: "power2.out"
      });

      gsap.to(tiltRef.current, {
        z: active ? -50 : 0, // Pull camera back slightly
        duration: 1,
        ease: "power2.inOut"
      });
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      // Toggle Driving Mode
      if (e.key === "w" || e.key === "W") {
        const nextState = !isDrivingRef.current;
        isDrivingRef.current = nextState;
        setIsDriving(nextState); // Update UI state
        surge(nextState);

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

      {/* SPEED LINES */}
      {ENABLE_SPEED_LINES && <SpeedLines isActive={isDriving} />}

      <div ref={rumbleRef} className="relative w-full h-full will-change-transform">
        <div
          ref={tiltRef}
          className="relative w-full h-full will-change-transform z-10 [transform-style:preserve-3d]"
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
                {PORTALS.map((p, i) => {
                  // Rendering Loop Logic:
                  // Calculate where this portal should be relative to the bike,
                  // accounting for the infinite track loop.
                  let relativeZ = (p.distance - bikeDistance) % TRACK_LENGTH;
                  if (relativeZ < -500) relativeZ += TRACK_LENGTH; // if slightly behind, push to far front?
                  // Actually, standard modulo for positive loop:
                  if (relativeZ < 0) relativeZ += TRACK_LENGTH;

                  // However, if it's JUST passed us (e.g. -100), we still want to see it fade out behind.
                  // So we only "recycle" it if it's WAY behind (e.g. < -500).
                  // But the modulo above forces it 0..3000.
                  // Let's optimize:
                  // if relativeZ is > 2500 (meaning it's technically "behind" in the wrap),
                  // we can interpret that as negative distance for smooth exit.
                  if (relativeZ > TRACK_LENGTH - 500) {
                    relativeZ -= TRACK_LENGTH;
                  }

                  return (
                    <Portal
                      key={i}
                      label={p.label}
                      href={p.href}
                      side={p.side as "left" | "right"}
                      distance={bikeDistance + relativeZ} // Pass effective world position
                      offset={p.x}
                      currentDistance={bikeDistance}
                    />
                  );
                })}
              </div>

            </div>
          </div>
        </div>
      </div>

      {/* ===== BIKE (FPP COCKPIT) ===== */}
      {/* Note: Bike is OUTSIDE the camera tumble to act as the "viewport frame" 
          or shake strictly with vibration? 
          Let's put it on top of the rumbleRef but not the tiltRef.
          Actually, let's keep it clean on top.
      */}
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
