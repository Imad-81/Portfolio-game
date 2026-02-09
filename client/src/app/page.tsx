import Hero from "@/sections/Hero";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black">
      <Hero />

      {/* Placeholder Content for Scrolling */}
      <section className="min-h-screen w-full flex items-center justify-center bg-[#0a0a0a] text-white border-t border-white/10 z-10 relative">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">Selected Work</h2>
          <p className="text-gray-400">Project list coming soon...</p>
        </div>
      </section>

      <section className="min-h-screen w-full flex items-center justify-center bg-[#050505] text-white border-t border-white/5 z-10 relative">
        <div className="text-center">
          <h2 className="text-4xl font-bold mb-4">About Me</h2>
          <p className="text-gray-400">Developer narrative coming soon...</p>
        </div>
      </section>
    </main>
  );
}
