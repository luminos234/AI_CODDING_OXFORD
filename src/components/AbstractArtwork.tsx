/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';

interface AbstractArtworkProps {
  title: string;
  paletteNames: string[];
  height?: string | number;
}

// Map colloquial palette names to premium executive hex codes
const HEX_COLOR_MAP: Record<string, string> = {
  "warm beige": "#EAE4DB",
  "sand": "#DCD7D0",
  "muted terracotta": "#B97455",
  "sage green": "#8A9A5B",
  "soft gold": "#D0B075",
  "warm slate-terracotta": "#A25F42",
  "warm slate-blue": "#7E97A6",
  "warm cream": "#FAF8F5",
  "warm slate": "#7E97A6"
};

export default function AbstractArtwork({ title, paletteNames, height = 240 }: AbstractArtworkProps) {
  // Translate names to colors, backing up to beautiful defaults if not found
  const colors = (paletteNames && paletteNames.length > 0)
    ? paletteNames.map(name => HEX_COLOR_MAP[name.toLowerCase()] || name)
    : [HEX_COLOR_MAP["warm cream"], HEX_COLOR_MAP["sand"], HEX_COLOR_MAP["muted terracotta"], HEX_COLOR_MAP["sage green"]];

  // Derive stable pseudo-random values from title to keep design deterministic per batch
  const getHashValue = (str: string, index: number, mod: number) => {
    let hash = 0;
    for (let i = 0; i < str.length; i++) {
      hash = str.charCodeAt(i) + ((hash << 5) - hash);
    }
    return Math.abs(hash + index * 103) % mod;
  };

  // Generate deterministic design constraints
  const circleX1 = getHashValue(title, 1, 40) + 10; // offset %
  const circleY1 = getHashValue(title, 2, 40) + 20;
  const radius1 = getHashValue(title, 3, 50) + 40;

  const circleX2 = getHashValue(title, 4, 30) + 50;
  const circleY2 = getHashValue(title, 5, 40) + 30;
  const radius2 = getHashValue(title, 6, 60) + 40;

  const circleX3 = getHashValue(title, 7, 40) + 40;
  const circleY3 = getHashValue(title, 8, 30) + 50;
  const radius3 = getHashValue(title, 9, 30) + 20;

  // Render a lovely corporate-editorial geometric SVG composition
  return (
    <div 
      className="relative w-full rounded-xl overflow-hidden shadow-xs border border-workspace-sand bg-workspace-cream"
      style={{ height: height }}
    >
      <svg 
        width="100%" 
        height="100%" 
        viewBox="0 0 400 240" 
        preserveAspectRatio="xMidYMid slice" 
        className="absolute inset-0 select-none"
      >
        <defs>
          <linearGradient id="grid-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#FAF8F5" />
            <stop offset="100%" stopColor="#DCD7D0" />
          </linearGradient>
          <filter id="soft-shadow" x="-10%" y="-10%" width="120%" height="120%">
            <feDropShadow dx="0" dy="8" stdDeviation="15" floodColor="#3D3A35" floodOpacity="0.08" />
          </filter>
        </defs>

        {/* Crisp Architectural Grid lines inside background */}
        <rect width="100%" height="100%" fill="url(#grid-grad)" />
        <g stroke="#DCD7D0" strokeWidth="0.5" opacity="0.4">
          <line x1="50" y1="0" x2="50" y2="240" />
          <line x1="100" y1="0" x2="100" y2="240" />
          <line x1="150" y1="0" x2="150" y2="240" />
          <line x1="200" y1="0" x2="200" y2="240" />
          <line x1="250" y1="0" x2="250" y2="240" />
          <line x1="300" y1="0" x2="300" y2="240" />
          <line x1="350" y1="0" x2="350" y2="240" />

          <line x1="0" y1="40" x2="400" y2="40" />
          <line x1="0" y1="80" x2="400" y2="80" />
          <line x1="0" y1="120" x2="400" y2="120" />
          <line x1="0" y1="160" x2="400" y2="160" />
          <line x1="0" y1="200" x2="400" y2="200" />
        </g>

        {/* Dynamic shape 1: Calm Sage or Terracotta background fluid blob */}
        <path
          d={`M -50 200 C ${circleX1 + 50} ${circleY1 + 100}, ${circleX2 + 100} ${circleY2 - 30}, 450 120 L 450 300 L -50 300 Z`}
          fill={colors[2] || "#A66C52"}
          opacity="0.15"
        />

        {/* Dynamic shape 2: Overlapping premium circles with high-contrast blending */}
        <circle 
          cx={`${circleX1}%`} 
          cy={`${circleY1}%`} 
          r={radius1} 
          fill={colors[0] || "#E6D7C3"} 
          opacity="0.6" 
          filter="url(#soft-shadow)"
        />

        <circle 
          cx={`${circleX2}%`} 
          cy={`${circleY2}%`} 
          r={radius2} 
          fill={colors[1] || "#8A9B80"} 
          opacity="0.4"
          filter="url(#soft-shadow)"
        />

        {/* Intersecting line representing data and strategic path */}
        <line 
          x1="-20" 
          y1={circleY1 * 2} 
          x2="420" 
          y2={circleY2 * 1.8} 
          stroke={colors[2] || "#A66C52"} 
          strokeWidth="1.5" 
          strokeDasharray="4 4"
          opacity="0.75"
        />

        <circle 
          cx={`${circleX3}%`} 
          cy={`${circleY3}%`} 
          r={radius3} 
          fill={colors[3] || "#D0B075"} 
          opacity="0.5" 
          filter="url(#soft-shadow)"
        />

        {/* Accent concentric orbits/arcs for executive blueprint aesthetic */}
        <circle 
          cx={`${circleX1}%`} 
          cy={`${circleY1}%`} 
          r={radius1 + 15} 
          fill="none" 
          stroke={colors[2] || "#A66C52"} 
          strokeWidth="0.75" 
          strokeDasharray="5, 10" 
          opacity="0.5" 
        />

        {/* Elegant typography watermark corresponding to the briefing */}
        <text 
          x="18" 
          y="222" 
          fontFamily="monospace"
          fontSize="9" 
          fill="#3D3A35" 
          opacity="0.35"
          letterSpacing="2"
        >
          {`WORKSPACE // ID ${title.substring(0,6).toUpperCase()}`}
        </text>

        {/* Fine strategic crosshair */}
        <circle cx="340" cy="50" r="1.5" fill="#3D302A" opacity="0.6"/>
        <line x1="330" y1="50" x2="350" y2="50" stroke="#3D302A" strokeWidth="0.5" opacity="0.4" />
        <line x1="340" y1="40" x2="340" y2="60" stroke="#3D302A" strokeWidth="0.5" opacity="0.4" />
      </svg>
      
      {/* Editorial overlay accent gradient */}
      <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-workspace-cream/90 to-transparent pointer-events-none" />
    </div>
  );
}
