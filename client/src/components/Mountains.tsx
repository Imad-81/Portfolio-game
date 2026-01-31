"use client";
import React from 'react';

const Mountains = () => {
    return (
        <div className="absolute left-0 w-full h-full pointer-events-none z-10 opacity-30 mix-blend-screen">
            <svg viewBox="0 0 1200 300" preserveAspectRatio="none" className="w-full h-full">
                <defs>
                    <linearGradient id="mtn-grad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="0%" stopColor="#240046" stopOpacity="0.9" />
                        <stop offset="100%" stopColor="#0a001a" stopOpacity="1" />
                    </linearGradient>
                    <pattern id="grid-pattern" width="20" height="20" patternUnits="userSpaceOnUse">
                        <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#bc13fe" strokeWidth="0.5" opacity="0.5" />
                    </pattern>
                </defs>

                {/* Complex Terrain Shape */}
                <path d="M0,300 
                         L0,200 L50,150 L100,180 L150,80 L200,160 
                         L250,100 L300,200 L350,120 L400,220 
                         L450,90 L500,190 L550,60 L600,180 
                         L650,70 L700,200 L750,100 L800,230 
                         L850,90 L900,170 L950,60 L1000,190 
                         L1050,100 L1100,200 L1150,150 L1200,200 
                         L1200,300 Z"
                    fill="url(#mtn-grad)"
                    stroke="#00f2ff"
                    strokeWidth="2"
                />

                {/* Overlay Grid Pattern on the mountain shape */}
                <path d="M0,300 
                         L0,200 L50,150 L100,180 L150,80 L200,160 
                         L250,100 L300,200 L350,120 L400,220 
                         L450,90 L500,190 L550,60 L600,180 
                         L650,70 L700,200 L750,100 L800,230 
                         L850,90 L900,170 L950,60 L1000,190 
                         L1050,100 L1100,200 L1150,150 L1200,200 
                         L1200,300 Z"
                    fill="url(#grid-pattern)"
                    opacity="0.5"
                />
            </svg>

            {/* Fog / Horizon Blend Overlay - Increased coverage and density */}
            <div className="absolute bottom-0 left-0 w-full h-3/4 bg-gradient-to-t from-[#240046] via-[#240046]/80 to-transparent"></div>
        </div>
    );
};

export default Mountains;
