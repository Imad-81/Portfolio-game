import Hero from "@/sections/Hero";
import AboutMe from "@/sections/AboutMe";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between bg-black">
      <Hero />
      <AboutMe />
    </main>
  );
}
