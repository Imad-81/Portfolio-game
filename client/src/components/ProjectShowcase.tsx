"use client";
import React from "react";

interface ProjectCardData {
    name: string;
    emoji: string;
    description: string;
    tags: string[];
    images: string[];
    side: "left" | "right";
    distanceStart: number;
}

const PROJECTS: ProjectCardData[] = [
    {
        name: "CUT",
        emoji: "🔥",
        description:
            "AI-powered calorie tracking app with natural language food logging, real-time macro tracking, and precision nutrition analytics.",
        tags: ["Next.js", "AI", "NLP"],
        images: ["/Cut.png"],
        side: "left",
        distanceStart: 200,
    },
    {
        name: "ML_BOT_MARK5",
        emoji: "📈",
        description:
            "Experimental crypto trading system combining algorithmic strategies with LSTM and XGBoost models.",
        tags: ["Python", "LSTM", "XGBoost"],
        images: ["/trading.png"],
        side: "right",
        distanceStart: 700,
    },
    {
        name: "noCap",
        emoji: "🧠",
        description:
            "Privacy-first slang interpretation platform powered by local LLMs with real-time chat capabilities.",
        tags: ["Next.js", "LLM", "Privacy"],
        images: ["/nocap1.png"],
        side: "left",
        distanceStart: 1200,
    },
    {
        name: "Smart Campus",
        emoji: "📡",
        description:
            "Real-time crowd monitoring and prediction using YOLOv8 computer vision and FastAPI.",
        tags: ["YOLOv8", "FastAPI", "React"],
        images: [],
        side: "right",
        distanceStart: 1700,
    },
    {
        name: "AI Humanizer",
        emoji: "✍️",
        description:
            "Automation pipeline that rewrites AI text into natural, academic-quality human prose.",
        tags: ["LLM", "NLP", "Python"],
        images: [],
        side: "left",
        distanceStart: 2200,
    },
    {
        name: "CampusTasks",
        emoji: "🎯",
        description:
            "Peer-to-peer campus marketplace for micro-tasks with gamification and real-time management.",
        tags: ["React", "Node.js", "P2P"],
        images: [],
        side: "right",
        distanceStart: 2700,
    },
];

export { PROJECTS };
export type { ProjectCardData };

// =====================================================
// Individual card rendered INSIDE the 3D grid world
// Uses the same coordinate system as Portal.tsx
// =====================================================
interface ProjectCardProps {
    project: ProjectCardData;
    index: number;
    distance: number;
    currentDistance: number;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
    project,
    index,
    distance,
    currentDistance,
}) => {
    const [mounted, setMounted] = React.useState(false);
    React.useEffect(() => setMounted(true), []);
    if (!mounted) return null;

    const relativePos = distance - currentDistance;

    // Cull: don't render if too far behind or too far ahead
    if (relativePos < -200) return null;
    if (relativePos > 4000) return null;

    // X offset — further out than portals so they don't overlap
    const xOffset = project.side === "left" ? -420 : 420;

    // Opacity: fade in as you approach, full when close
    const opacity = Math.min(1, Math.max(0, 1 - relativePos / 3000));

    // Close proximity for glow
    const isClose = relativePos < 600 && relativePos > -100;
    const isLeft = project.side === "left";
    const accentColor = isLeft ? "#00f5ff" : "#ff4ecd";
    const accentRgba = isLeft
        ? "rgba(0,245,255,"
        : "rgba(255,78,205,";

    return (
        <div
            className="absolute top-1/2 left-1/2 will-change-transform"
            style={{
                transformStyle: "preserve-3d",
                transform: `
          translateX(-50%) 
          translateY(-50%)
          translateY(${-relativePos}px) 
          translateX(${xOffset}px) 
          rotateX(-75deg)
          scale(1.5)
        `,
                opacity,
                zIndex: Math.floor(1000 - relativePos),
            }}
        >
            {/* The card — stands upright like a portal */}
            <div
                className="relative"
                style={{
                    width: "260px",
                    minHeight: "180px",
                }}
            >
                {/* Card Frame */}
                <div
                    className="relative rounded-lg overflow-hidden"
                    style={{
                        background: `linear-gradient(180deg, ${accentRgba}0.08) 0%, rgba(5,1,16,0.9) 30%, rgba(5,1,16,0.95) 100%)`,
                        border: `1.5px solid ${accentRgba}${isClose ? "0.5)" : "0.2)"}`,
                        boxShadow: isClose
                            ? `0 0 25px ${accentRgba}0.25), inset 0 0 15px ${accentRgba}0.05)`
                            : `0 0 8px ${accentRgba}0.1)`,
                        transition: "box-shadow 0.4s ease, border-color 0.4s ease",
                    }}
                >
                    {/* Project number badge */}
                    <div
                        className="absolute top-2 right-3 text-[9px] font-mono tracking-widest"
                        style={{ color: accentColor, opacity: 0.5 }}
                    >
                        {String(index + 1).padStart(2, "0")}/
                        {String(PROJECTS.length).padStart(2, "0")}
                    </div>

                    {/* Header */}
                    <div className="px-4 pt-3 pb-2">
                        <div className="flex items-center gap-2 mb-1">
                            <span className="text-lg">{project.emoji}</span>
                            <h3
                                className="text-[11px] font-bold tracking-[0.15em] uppercase"
                                style={{
                                    color: accentColor,
                                    textShadow: `0 0 8px ${accentRgba}0.4)`,
                                }}
                            >
                                {project.name}
                            </h3>
                        </div>

                        {/* Description */}
                        <p
                            className="text-[10px] leading-[1.5] mt-1 font-light"
                            style={{ color: "rgba(255,255,255,0.55)" }}
                        >
                            {project.description}
                        </p>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-1 mt-2">
                            {project.tags.map((tag, i) => (
                                <span
                                    key={i}
                                    className="text-[8px] px-1.5 py-[1px] rounded font-mono tracking-wide"
                                    style={{
                                        background: `${accentRgba}0.08)`,
                                        color: accentColor,
                                        border: `1px solid ${accentRgba}0.15)`,
                                    }}
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    </div>

                    {/* Image */}
                    {project.images.length > 0 && (
                        <div className="px-3 pb-3">
                            <div
                                className="rounded overflow-hidden"
                                style={{
                                    border: `1px solid ${accentRgba}0.12)`,
                                }}
                            >
                                <img
                                    src={project.images[0]}
                                    alt={project.name}
                                    className="w-full object-cover"
                                    style={{
                                        maxHeight: "100px",
                                        filter: "saturate(0.7) contrast(1.1) brightness(0.85)",
                                    }}
                                />
                            </div>
                        </div>
                    )}

                    {/* No image placeholder */}
                    {project.images.length === 0 && (
                        <div className="px-3 pb-3">
                            <div
                                className="rounded h-10 flex items-center justify-center"
                                style={{
                                    background: `${accentRgba}0.03)`,
                                    border: `1px dashed ${accentRgba}0.12)`,
                                }}
                            >
                                <span
                                    className="text-[8px] font-mono tracking-[0.2em]"
                                    style={{ color: accentColor, opacity: 0.35 }}
                                >
                                    {">"} IN DEVELOPMENT
                                </span>
                            </div>
                        </div>
                    )}

                    {/* Scan line */}
                    <div
                        className="absolute top-0 left-0 w-full h-[1px]"
                        style={{
                            background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
                            opacity: 0.3,
                        }}
                    >
                        <div
                            style={{
                                width: "100%",
                                height: "1px",
                                background: `linear-gradient(to right, transparent, ${accentColor}, transparent)`,
                                animation: "projectScan 3s ease-in-out infinite",
                                position: "absolute",
                            }}
                        />
                    </div>
                </div>

                {/* Ground contact glow — same approach as Portal */}
                <div
                    style={{
                        position: "absolute",
                        bottom: "-8px",
                        left: "50%",
                        width: "160px",
                        height: "30px",
                        transform: "translateX(-50%) rotateX(75deg)",
                        background: `radial-gradient(ellipse at center, ${accentRgba}0.4), transparent 70%)`,
                        filter: "blur(10px)",
                        opacity: isClose ? 0.7 : 0.3,
                        transition: "opacity 0.4s ease",
                    }}
                />
            </div>
        </div>
    );
};

export default ProjectCard;
