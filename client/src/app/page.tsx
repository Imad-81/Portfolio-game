"use client";
import React, { useState } from "react";
import Hero from "@/sections/Hero";
import AboutMe from "@/sections/AboutMe";
import SunOrchestrator from "@/components/SunOrchestrator";

export default function Home() {
  const [isGameActive, setIsGameActive] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black">
      <SunOrchestrator isGameActive={isGameActive} />
      <Hero isGameActive={isGameActive} setIsGameActive={setIsGameActive} />
      <AboutMe />
    </main>
  );
}
