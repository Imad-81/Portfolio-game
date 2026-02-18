"use client";
import React, { useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import PerspectiveText from "../components/PerspectiveText";

gsap.registerPlugin(ScrollTrigger);

interface ProjectData {
    name: string;
    subtitle: string;
    description: string;
    image: string | null;
    gradient: string;
    tags: string[];
    fullDetails: string[];
}

const PROJECTS: ProjectData[] = [
    {
        name: "CUT",
        subtitle: "AI Calorie Tracker",
        description:
            "A high-performance, AI-powered calorie tracking app built with Next.js that enables natural language food logging, real-time macro tracking, and precision nutrition analytics through a bold, data-driven interface.",
        image: "/Cut.png",
        gradient: "linear-gradient(135deg, #0f2027, #203a43, #2c5364)",
        tags: ["Next.js", "AI", "NLP"],
        fullDetails: [
            "CUT. Bold. Fast. Lean.",
            "CUT is a high-performance calorie tracker designed for precision and speed. It leverages AI to simplify food logging and provides a streamlined, high-contrast interface for elite nutrition management.",
            "",
            "⚡ Features",
            "• AI-Powered Capture — Log meals in natural language. No more searching through tedious databases.",
            "• Macro HUD — Real-time tracking of Protein, Carbs, and Fats with high-visibility indicators.",
            "• Progress Ring — Instant visual feedback on your daily calorie intake relative to your TDEE.",
            "• Analytics — Track your progress over time with clean, data-driven visualizations.",
            "• Performance First — Built with Next.js and Framer Motion for a fluid user experience.",
            "",
            "🎨 Design Philosophy — \"The Obsidian Edge\"",
            "• Obsidian (#050505): Deep, focused backgrounds.",
            "• Electric Lime (#ccff00): High-energy accents for critical data.",
            "• Crisp White (#ffffff): Editorial-grade typography.",
            "",
            "🛠 Tech Stack",
            "• Framework: Next.js 15+ (App Router)",
            "• Language: TypeScript",
            "• Animations: Framer Motion",
            "• Styling: Tailwind CSS 4",
            "• State Management: Zustand",
            "• Charts: Recharts",
        ],
    },
    {
        name: "ML_BOT_MARK5",
        subtitle: "Machine Learning Trading Algorithm",
        description:
            "An experimental cryptocurrency trading system that combines algorithmic strategies with LSTM and XGBoost models to generate data-driven trade decisions using structured backtesting and balanced ML pipelines.",
        image: "/trading.png",
        gradient: "linear-gradient(135deg, #1a1a2e, #16213e, #0f3460)",
        tags: ["Python", "LSTM", "XGBoost"],
        fullDetails: [
            "ML_BOT_MARK5",
            "An experimental machine learning based trading bot project. The focus is on exploring and implementing different algorithmic trading strategies using historical cryptocurrency data (ETHUSD), with ML models for decision-making.",
            "",
            "📂 Repository Structure",
            "• Strategy files: Bounce+EMA, Breakout_Only, and other trading strategy prototypes.",
            "• data_Balancer_LSTM.py / data_Balancer_XG.py — Scripts for preparing and balancing datasets.",
            "• ML_Test3.py / ML_Test4.py — Test harnesses for ML model experiments.",
            "• TF_Converter.py — Converting model formats (e.g., TensorFlow).",
            "• data/ — CSV files with historical price data at various timeframes (1m, 5m, 15m, 1h, 4h).",
            "",
            "🔄 Workflow",
            "1. Experiment with different feature sets and model architectures.",
            "2. Balance datasets using the provided balancer scripts.",
            "3. Train models and evaluate performance on out-of-sample data.",
            "4. Generate trades and review results in Balanced_Trades.csv.",
            "",
            "🛠 Tech Stack",
            "• Python 3.10+",
            "• pandas, numpy, scikit-learn",
            "• TensorFlow (LSTM)",
            "• XGBoost",
        ],
    },
    {
        name: "noCap",
        subtitle: "AI Slang Decoder",
        description:
            "A privacy-first slang interpretation platform powered by local LLMs, delivering fast, stylish, and offline AI analysis through a premium Next.js interface with real-time chat capabilities.",
        image: "/nocap1.png",
        gradient: "linear-gradient(135deg, #0d0d0d, #1a1a2e, #2d1b69)",
        tags: ["Next.js", "LLM", "Privacy"],
        fullDetails: [
            "noCap — Slang Decoder",
            "Decode the streets, one phrase at a time. A premium AI-powered slang analyzer built with Next.js, Tailwind CSS, and local LLMs.",
            "",
            "✨ Features",
            "• Modern Architecture — Built with Next.js (App Router) & Bun.",
            "• Premium UI — Dark mode, glassmorphism, and smooth animations using Framer Motion.",
            "• Privacy-First AI — Runs completely offline using LM Studio (local LLMs).",
            "• Fast — Optimized for performance with Bun and TurboPack.",
            "",
            "📁 Project Structure",
            "• src/app/api/chat/route.ts — Backend API for LM Studio",
            "• src/app/page.tsx — Main Chat Interface",
            "• src/app/layout.tsx — App Layout (Fonts, Metadata)",
            "• src/app/globals.css — Global Styles & Theme",
            "",
            "🛠 Tech Stack",
            "• Next.js (App Router) + Bun",
            "• Tailwind CSS + Framer Motion",
            "• LM Studio (Mistral 7B Instruct)",
        ],
    },
    {
        name: "Smart Campus",
        subtitle: "Crowd Management System",
        description:
            "A real-time crowd monitoring and prediction system using YOLOv8 computer vision and FastAPI, paired with a React dashboard to help students make smarter campus movement decisions.",
        image: null,
        gradient: "linear-gradient(135deg, #0a0a1a, #1a0a2e, #2a1a3e)",
        tags: ["YOLOv8", "FastAPI", "React"],
        fullDetails: [
            "Smart Campus Crowd Management System",
            "A real-time crowd monitoring and predictive analytics system designed for campus facilities (like canteens). Leverages Computer Vision (YOLOv8) to detect occupancy levels and provides a sleek React Dashboard for users to check crowd status before visiting.",
            "",
            "🌟 Key Features",
            "• Real-time Occupancy Detection — Uses YOLOv8 to count people in video streams with high accuracy.",
            "• Dynamic Crowd Classification — Automatically categorizes crowd levels as LOW, MEDIUM, or HIGH.",
            "• Predictive Analytics — Considers time of day and special events (e.g., Wednesday Biryani Day 🍛).",
            "• Modern Dashboard — Responsive, high-performance UI built with React and Tailwind CSS.",
            "• Auto-syncing API — Seamless integration between the Python CV backend and the Web frontend.",
            "",
            "🏗️ Architecture",
            "Video Stream → YOLOv8 Processor → FastAPI Backend → React Dashboard → User Device",
            "",
            "🛠 Tech Stack",
            "• Frontend: React, Vite, Tailwind CSS",
            "• Backend: FastAPI, Uvicorn",
            "• AI/ML: Ultralytics YOLOv8, OpenCV",
        ],
    },
    {
        name: "AI Humanizer",
        subtitle: "AI Text Rewriter",
        description:
            "An automation pipeline that rewrites AI-generated text into natural, academic-quality human prose while preserving structure, facts, and length using local LLMs and intelligent validation logic.",
        image: null,
        gradient: "linear-gradient(135deg, #0d1117, #161b22, #21262d)",
        tags: ["LLM", "NLP", "Python"],
        fullDetails: [
            "AI Humanizer",
            "A robust automation pipeline designed to rewrite AI-generated text into a natural, academic, and professional human-like style. Optimized for use with local LLMs (like Mistral-7B) via LM Studio.",
            "",
            "✨ Features",
            "• Human-Centric Rewriting — Transforms robotic prose into text with natural human variation, rhythm, and tone.",
            "• Academic Precision — Maintains a formal, professional tone suitable for academic and research contexts.",
            "• Content Integrity — Strictly preserves all facts, numbers, dates, and technical terms.",
            "• Length Preservation — Ensures the rewritten text maintains a similar length and sentence count.",
            "• Chunk-Based Processing — Automatically handles long documents by splitting into manageable chunks.",
            "• Detector Resistance — Specifically designed to avoid common hallmarks of AI-generated content.",
            "",
            "📂 Available Pipelines",
            "1. Standard LLM Pipeline (main.py) — High-quality humanization and academic tone.",
            "2. Length-Preserving Pipeline (main2.py) — Adds strict length and sentence count preservation.",
            "3. Rule-Based Transformer (pra_transform.py) — Fast, non-LLM alternative using rule-based transformations.",
            "",
            "🛠 Tech Stack",
            "• Python 3.9+",
            "• LM Studio (Mistral-7B Instruct)",
            "• requests, regex, nltk, textstat",
        ],
    },
    {
        name: "CampusTasks",
        subtitle: "Student Micro-task Marketplace",
        description:
            "A modern peer-to-peer campus marketplace that enables students to post, accept, and complete micro-tasks through an interactive dashboard-driven UI with gamification and real-time task management.",
        image: null,
        gradient: "linear-gradient(135deg, #0a0a0a, #1a0a1a, #2a0a2e)",
        tags: ["React", "Node.js", "P2P"],
        fullDetails: [
            "CampusTasks — Student Micro-task Marketplace",
            "A modern, sleek, and highly interactive marketplace designed specifically for university students. Facilitates peer-to-peer assistance by allowing students to post micro-tasks, share study materials, and help each other with academic challenges in exchange for rewards.",
            "",
            "🌟 Key Features",
            "• Dynamic Task Marketplace — A centralized hub for students to browse and filter micro-tasks across various categories like Coding, Study Materials, and Concept Explanations.",
            "• Micro-task Management — Seamless flow for creating, accepting, and completing tasks with real-time status updates.",
            "• Interactive Dashboard — A personalized command center for tracking active tasks, pending requests, and overall progress.",
            "• Leaderboard & Gamification — Global leaderboard recognizing top contributors in the campus community.",
            "• Student Profiles — Showcase expertise, bio, and history of completed tasks.",
            "• Secure Authentication — Robust mock-authentication system with student signups and secure logins.",
            "• Responsive & Modern UI — Premium Glassmorphism aesthetic with smooth animations and mobile-first design.",
            "",
            "🛠 Tech Stack",
            "• Frontend: React 19",
            "• Build Tool: Vite",
            "• Routing: React Router DOM 7",
            "• Styling: Vanilla CSS (Custom Variable-based Design System)",
            "• Persistence: Browser LocalStorage",
        ],
    },
];

// =====================================================
// Project Detail Modal
// =====================================================
function ProjectModal({
    project,
    onClose,
}: {
    project: ProjectData;
    onClose: () => void;
}) {
    return (
        <div
            className="project-modal-overlay"
            onClick={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="project-modal">
                {/* Close button */}
                <button
                    onClick={onClose}
                    className="project-modal-close"
                    aria-label="Close"
                >
                    ✕
                </button>

                {/* Header */}
                <div className="project-modal-header">
                    {project.image && (
                        <img
                            src={project.image}
                            alt={project.name}
                            className="project-modal-img"
                        />
                    )}
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            {project.name}
                        </h2>
                        <p className="text-sm text-white/40 mt-1">{project.subtitle}</p>
                        <div className="flex flex-wrap gap-2 mt-3">
                            {project.tags.map((tag) => (
                                <span
                                    key={tag}
                                    className="text-[10px] px-2.5 py-1 rounded-full font-mono tracking-wider text-white/50 border border-white/10 bg-white/[0.04]"
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Divider */}
                <div className="h-px w-full bg-white/[0.06] my-5" />

                {/* Body — formatted text */}
                <div className="project-modal-body">
                    {project.fullDetails.map((line, i) => {
                        if (line === "") {
                            return <div key={i} className="h-4" />;
                        }
                        // Section headers (lines starting with emoji or all-caps-ish)
                        if (
                            /^[⚡✨🎨🛠📂📁🔄🌟🏗️📞🚀]/.test(line) ||
                            /^[A-Z][A-Z_]/.test(line)
                        ) {
                            return (
                                <h3
                                    key={i}
                                    className="text-base font-semibold text-white/80 mt-4 mb-2"
                                >
                                    {line}
                                </h3>
                            );
                        }
                        // Bullet points
                        if (line.startsWith("•") || line.startsWith("1.") || line.startsWith("2.") || line.startsWith("3.") || line.startsWith("4.")) {
                            return (
                                <p
                                    key={i}
                                    className="text-sm text-white/50 leading-relaxed pl-2 mb-1.5"
                                >
                                    {line}
                                </p>
                            );
                        }
                        // Regular text
                        return (
                            <p
                                key={i}
                                className="text-sm text-white/55 leading-relaxed mb-2"
                            >
                                {line}
                            </p>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}

// =====================================================
// Main Projects Section
// =====================================================
export default function Projects() {
    const containerRef = useRef<HTMLDivElement>(null);
    const mousePos = useRef({ x: 0, y: 0 });
    const cardRefs = useRef<(HTMLDivElement | null)[]>([]);
    const headingRef = useRef<HTMLHeadingElement>(null);
    const [selectedProject, setSelectedProject] = useState<ProjectData | null>(null);

    useGSAP(
        () => {
            const container = containerRef.current;
            if (!container) return;

            const handleMouseMove = (e: MouseEvent) => {
                const rect = container.getBoundingClientRect();
                const x = (e.clientX - rect.left) / rect.width - 0.5;
                const y = (e.clientY - rect.top) / rect.height - 0.5;
                mousePos.current = { x, y };
            };

            window.addEventListener("mousemove", handleMouseMove);
            return () => window.removeEventListener("mousemove", handleMouseMove);
        },
        { scope: containerRef }
    );

    const bgWords = [
        { text: "SYSTEMS", x: 2, y: 5, depth: 1.5 },
        { text: "ENTROPY", x: 25, y: -5, depth: 0.6 },
        { text: "INFERENCE", x: 80, y: 15, depth: 1.2 },
        { text: "LATENCY", x: 2, y: 45, depth: 0.8 },
        { text: "VECTOR", x: -5, y: 65, depth: 1.4 },
        { text: "CONTEXT", x: 85, y: 50, depth: 1.0 },
        { text: "WEIGHTS", x: 92, y: 35, depth: 0.7 },
        { text: "TRAJECTORY", x: 5, y: 85, depth: 0.9 },
        { text: "MODEL", x: 75, y: 90, depth: 1.1 },
        { text: "DEPTH", x: 50, y: 95, depth: 0.5 },
    ];

    useGSAP(
        () => {
            if (headingRef.current) {
                gsap.fromTo(
                    headingRef.current,
                    { opacity: 0, y: 60 },
                    {
                        opacity: 1,
                        y: 0,
                        duration: 1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: headingRef.current,
                            start: "top 85%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            }

            cardRefs.current.forEach((el, i) => {
                if (!el) return;
                gsap.fromTo(
                    el,
                    { opacity: 0, y: 80, scale: 0.95 },
                    {
                        opacity: 1,
                        y: 0,
                        scale: 1,
                        duration: 0.8,
                        delay: i * 0.1,
                        ease: "power3.out",
                        scrollTrigger: {
                            trigger: el,
                            start: "top 90%",
                            toggleActions: "play none none reverse",
                        },
                    }
                );
            });
        },
        { scope: containerRef }
    );

    return (
        <section
            id="projects-section"
            ref={containerRef}
            className="relative w-full bg-[#050505] overflow-hidden"
            style={{ minHeight: "100vh", perspective: "1000px" }}
        >
            {/* Background gradient */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(188,19,254,0.03)_0%,transparent_60%)] pointer-events-none" />

            {/* Floating 3D Words */}
            {bgWords.map((word, i) => (
                <PerspectiveText
                    key={i}
                    text={word.text}
                    initialX={word.x}
                    initialY={word.y}
                    depth={word.depth}
                    mousePos={mousePos}
                />
            ))}

            {/* Content */}
            <div className="relative z-30 px-6 md:px-12 lg:px-20 py-20 md:py-32">
                <h2
                    ref={headingRef}
                    className="text-5xl md:text-7xl lg:text-8xl font-bold text-center mb-20 md:mb-28 tracking-[-0.04em]"
                    style={{
                        background:
                            "linear-gradient(to bottom, #ffffff, rgba(255,255,255,0.6))",
                        WebkitBackgroundClip: "text",
                        WebkitTextFillColor: "transparent",
                    }}
                >
                    Projects
                </h2>

                {/* Grid */}
                <div className="project-grid">
                    {PROJECTS.map((project, i) => (
                        <div
                            key={project.name}
                            ref={(el) => {
                                cardRefs.current[i] = el;
                            }}
                            className="project-card group"
                            onClick={() => setSelectedProject(project)}
                        >
                            <div className="project-card-image">
                                {project.image ? (
                                    <img
                                        src={project.image}
                                        alt={project.name}
                                        className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-110"
                                    />
                                ) : (
                                    <div
                                        className="w-full h-full flex items-center justify-center"
                                        style={{ background: project.gradient }}
                                    >
                                        <div className="text-center">
                                            <span className="text-3xl md:text-4xl block mb-2 opacity-40">
                                                {project.tags[0] === "YOLOv8"
                                                    ? "📡"
                                                    : project.tags[0] === "LLM"
                                                        ? "✍️"
                                                        : "🎯"}
                                            </span>
                                            <span className="text-[10px] font-mono tracking-[0.3em] text-white/20 uppercase">
                                                Coming Soon
                                            </span>
                                        </div>
                                    </div>
                                )}
                                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-40 transition-opacity duration-500" />
                            </div>

                            <div className="project-card-info">
                                <h3 className="text-sm md:text-base font-bold tracking-[0.08em] text-white mb-0.5">
                                    {project.name}
                                </h3>
                                <p className="text-[11px] md:text-xs font-light text-white/45 tracking-wide">
                                    {project.subtitle}
                                </p>
                                <div className="flex flex-wrap gap-1.5 mt-3">
                                    {project.tags.map((tag) => (
                                        <span
                                            key={tag}
                                            className="text-[9px] md:text-[10px] px-2 py-0.5 rounded-full font-mono tracking-wider text-white/50 border border-white/10 bg-white/[0.03]"
                                        >
                                            {tag}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            <div className="project-card-glow" />
                        </div>
                    ))}
                </div>
            </div>

            {/* Modal */}
            {selectedProject && (
                <ProjectModal
                    project={selectedProject}
                    onClose={() => setSelectedProject(null)}
                />
            )}
        </section>
    );
}
