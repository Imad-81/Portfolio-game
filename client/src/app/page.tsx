"use client";
import React, { useState } from "react";
import Hero from "@/sections/Hero";
import Projects from "@/sections/Projects";
export default function Home() {
  const [isGameActive, setIsGameActive] = useState(false);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black">
      <Hero isGameActive={isGameActive} setIsGameActive={setIsGameActive} />
      <Projects />
    </main>
  );
}
