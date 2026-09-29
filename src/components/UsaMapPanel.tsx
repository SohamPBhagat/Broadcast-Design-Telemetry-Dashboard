import React, { useState } from 'react';
import { CountryTelemetry } from '../data/countriesData';
import { hudAudio } from './AudioSynth';

interface UsaMapPanelProps {
  activeCountry?: CountryTelemetry;
  onTargetClick?: (location: string) => void;
}

export const UsaMapPanel: React.FC<UsaMapPanelProps> = ({ activeCountry, onTargetClick }) => {
  const [isLocked, setIsLocked] = useState(true);

  const handleToggle = () => {
    hudAudio.playTargetLock();
    setIsLocked(!isLocked);
    if (onTargetClick) onTargetClick("USA_SECTOR_01");
  };

  const countryName = activeCountry ? activeCountry.name : "UNITED STATES";
  const countryCode = activeCountry ? activeCountry.code : "US";
  const gridCoords = activeCountry ? activeCountry.gridRef : "38.8951° N, 77.0364° W";

  return (
    <div className="flex flex-col gap-2 w-full p-2 bg-[#06080d]/80 border border-slate-800/80 rounded-sm relative group">
      {/* Top Header Row with Red Icon & Waveform */}
      <div className="flex items-center justify-between pb-1 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          {/* Red Glowing Triangular Logo Icon */}
          <div className="w-5 h-5 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center glow-red-sm">
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-b-[8px] border-b-red-400" />
          </div>

          {/* Waveform graphic */}
          <svg width="70" height="12" className="opacity-80">
            <path
              d="M0,6 Q8,0 16,6 T32,6 T48,6 T64,6"
              fill="none"
              stroke="rgba(255,255,255,0.6)"
              strokeWidth="1.2"
            />
            <path
              d="M0,6 Q6,12 12,6 T24,6 T36,6 T48,6 T60,6 T70,6"
              fill="none"
              stroke="rgba(255,50,70,0.8)"
              strokeWidth="1"
            />
          </svg>
        </div>

        <span className="font-mono-tech text-[9px] text-slate-400 tracking-wider truncate max-w-[140px]">
          GRID: {gridCoords}
        </span>
      </div>

      {/* USA Vector Map Area */}
      <div
        onClick={handleToggle}
        className="relative w-full h-36 flex items-center justify-center cursor-pointer select-none overflow-hidden"
      >
        {/* USA Map SVG Outline */}
        <svg viewBox="0 0 960 600" className="w-full h-full object-contain filter drop-shadow">
          <g fill="none" stroke="rgba(255, 255, 255, 0.25)" strokeWidth="1.5" strokeLinejoin="round">
            <path d="M150,140 L210,135 L280,140 L350,145 L410,140 L480,145 L520,150 L590,140 L650,150 L720,165 L810,180 L860,220 L870,260 L850,300 L870,350 L840,400 L810,430 L780,480 L760,510 L740,500 L710,480 L670,440 L640,430 L590,420 L540,430 L480,430 L420,440 L370,430 L320,440 L260,420 L210,430 L160,390 L120,320 L110,240 Z" fill="rgba(255,255,255,0.02)" />
            <path d="M210,135 L210,260 L200,390" />
            <path d="M280,140 L280,270 L270,420" />
            <path d="M350,145 L350,280 L350,430" />
            <path d="M410,140 L410,280 L420,440" />
            <path d="M480,145 L480,300 L480,430" />
            <path d="M520,150 L520,320 L540,430" />
            <path d="M590,140 L590,320 L590,420" />
            <path d="M650,150 L650,340 L640,430" />
            <path d="M720,165 L720,360 L710,480" />
            <path d="M150,220 L870,260" strokeDasharray="3 3" opacity="0.6" />
            <path d="M120,300 L850,300" strokeDasharray="3 3" opacity="0.6" />
            <path d="M160,380 L810,380" strokeDasharray="3 3" opacity="0.6" />
          </g>

          {/* Highlighted Red Target Zone */}
          <g>
            <rect
              x="310"
              y="250"
              width="80"
              height="60"
              fill="rgba(255, 30, 60, 0.2)"
              stroke="#ff2a4b"
              strokeWidth="2"
              className={isLocked ? 'animate-pulse' : ''}
            />
            <line x1="350" y1="230" x2="350" y2="330" stroke="#ff2a4b" strokeWidth="1.2" strokeDasharray="2 2" />
            <line x1="290" y1="280" x2="410" y2="280" stroke="#ff2a4b" strokeWidth="1.2" strokeDasharray="2 2" />
            <circle cx="350" cy="280" r="14" fill="none" stroke="#ff2a4b" strokeWidth="1.5" />
            <circle cx="350" cy="280" r="3" fill="#ff2a4b" />
            <polyline points="350,280 280,200 220,200" fill="none" stroke="#ff2a4b" strokeWidth="1.2" />
            <rect x="140" y="185" width="85" height="22" fill="#080b12" stroke="#ff2a4b" strokeWidth="1" />
            <text x="182" y="200" fill="#ffffff" fontSize="11" fontFamily="Share Tech Mono" textAnchor="middle">
              {countryCode}-SECTOR
            </text>
          </g>
        </svg>

        {/* Floating status tag */}
        <div className="absolute bottom-1 left-1 bg-black/80 px-1.5 py-0.5 border border-red-500/60 rounded text-[9px] font-mono-tech text-red-400">
          ● REGIONAL TARGET: {countryName.toUpperCase()}
        </div>
      </div>

      {/* Bottom Telemetry Histogram Bar Graph */}
      <div className="w-full flex items-end justify-between h-7 gap-[2px] bg-[#040508] p-1 border-t border-slate-800">
        {Array.from({ length: 32 }).map((_, i) => {
          const h = (Math.sin(i * 0.5) * 0.4 + 0.5) * 100;
          const isRed = i > 12 && i < 18;
          return (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 rounded-[0.5px] ${isRed ? 'bg-red-500 glow-red-sm' : 'bg-slate-500/70'}`}
            />
          );
        })}
      </div>
    </div>
  );
};
