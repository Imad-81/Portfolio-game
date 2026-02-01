"use client";
import React from "react";

interface HolographicLabelProps {
    text: string;
    color?: string;
}

const HolographicLabel: React.FC<HolographicLabelProps> = ({
    text,
    color = "#00f5ff"
}) => {
    return (
        <div className="holographic-label-wrapper">
            <div className="holographic-label" style={{ "--label-color": color } as React.CSSProperties}>
                {/* Main text */}
                <div className="label-text">{text}</div>

                {/* RGB split layers */}
                <div className="label-text label-glitch-r" aria-hidden="true">{text}</div>
                <div className="label-text label-glitch-b" aria-hidden="true">{text}</div>

                {/* Scanlines overlay */}
                <div className="scanlines" />
            </div>
        </div>
    );
};

export default HolographicLabel;
