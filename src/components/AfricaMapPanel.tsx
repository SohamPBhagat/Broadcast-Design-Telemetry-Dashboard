import React, { useState } from 'react';
import { CountryTelemetry } from '../data/countriesData';
import { hudAudio } from './AudioSynth';

interface AfricaMapPanelProps {
  activeCountry?: CountryTelemetry;
  onTargetClick?: (location: string) => void;
}

export const AfricaMapPanel: React.FC<AfricaMapPanelProps> = ({ activeCountry, onTargetClick }) => {
  const [isLocked, setIsLocked] = useState(true);

  const handleToggle = () => {
    hudAudio.playTargetLock();
    setIsLocked(!isLocked);
    if (onTargetClick) onTargetClick("AFRICA_SECTOR_07");
  };

  const sectorName = activeCountry ? activeCountry.sector : "AFR-SECTOR 07";
  const countryName = activeCountry ? activeCountry.name : "AFRICA";

  return (
    <div className="flex flex-col gap-2 w-full p-2 bg-[#06080d]/80 border border-slate-800/80 rounded-sm relative group">
      {/* Top Segmented Telemetry Bar */}
      <div className="w-full flex items-center justify-between pb-1 border-b border-slate-800/80">
        <div className="flex items-center gap-1">
          {Array.from({ length: 16 }).map((_, i) => (
            <div
              key={i}
              className={`w-2 h-1.5 rounded-[0.5px] ${
                i === 4 || i === 9 || i === 10 ? 'bg-red-500 glow-red-sm' : i % 2 === 0 ? 'bg-slate-300' : 'bg-slate-700'
              }`}
            />
          ))}
        </div>
        <span className="font-mono-tech text-[9px] text-slate-400 tracking-wider truncate max-w-[130px]">
          {sectorName}
        </span>
      </div>

      {/* Africa Vector Map Container */}
      <div
        onClick={handleToggle}
        className="relative w-full h-36 flex items-center justify-center cursor-pointer select-none overflow-hidden"
      >
        <svg viewBox="0 0 600 650" className="w-full h-full object-contain filter drop-shadow">
          <g fill="none" stroke="rgba(255, 255, 255, 0.28)" strokeWidth="1.8" strokeLinejoin="round">
            <path d="M180,100 L260,80 L350,75 L450,110 L500,160 L480,220 L420,250 L400,310 L430,380 L440,460 L410,540 L370,590 L330,610 L300,580 L280,510 L250,450 L190,380 L130,320 L100,260 L110,210 L140,160 Z" fill="rgba(255,255,255,0.02)" />
            <path d="M180,100 L350,160 L420,250" />
            <path d="M260,80 L280,240 L330,610" />
            <path d="M140,160 L300,220 L480,220" />
            <path d="M100,260 L280,300 L400,310" />
            <path d="M130,320 L250,380 L430,380" />
            <path d="M190,380 L280,450 L440,460" />
            <path d="M250,450 L300,510 L410,540" />
          </g>

          {/* Highlighted Red Target Zone */}
          <g>
            <rect
              x="260"
              y="260"
              width="80"
              height="80"
              fill="rgba(255, 30, 60, 0.22)"
              stroke="#ff2a4b"
              strokeWidth="2"
              className={isLocked ? 'animate-pulse' : ''}
            />
            <circle cx="300" cy="300" r="22" fill="none" stroke="#ff2a4b" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="300" cy="300" r="4" fill="#ff2a4b" className="animate-ping" />
            <circle cx="300" cy="300" r="2" fill="#ffffff" />
            <polyline points="300,300 420,420 480,420" fill="none" stroke="#ff2a4b" strokeWidth="1.5" />
            <rect x="420" y="405" width="110" height="24" fill="#080b12" stroke="#ff2a4b" strokeWidth="1.2" />
            <text x="475" y="421" fill="#ff3b3b" fontSize="11" fontFamily="Orbitron" fontWeight="bold" textAnchor="middle">
              {countryName.toUpperCase().slice(0, 10)}
            </text>
          </g>
        </svg>

        {/* Floating status tag */}
        <div className="absolute top-1 right-1 bg-black/80 px-1.5 py-0.5 border border-red-500/60 rounded text-[9px] font-mono-tech text-red-400">
          ● ACTIVE RADAR: {countryName.toUpperCase()}
        </div>
      </div>

      {/* Bottom Row: Histogram + Tech Insignia Badges */}
      <div className="flex items-center justify-between pt-1 border-t border-slate-800">
        <div className="flex items-end h-6 gap-[1.5px] w-28 bg-[#040508] p-1 border border-slate-800">
          {Array.from({ length: 18 }).map((_, i) => (
            <div
              key={i}
              style={{ height: `${(Math.sin(i * 0.7) * 0.4 + 0.5) * 100}%` }}
              className={`flex-1 ${i === 8 || i === 9 ? 'bg-red-500' : 'bg-slate-400'}`}
            />
          ))}
        </div>

        {/* Tech Insignia Badges */}
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-full border border-red-500/80 bg-red-950/40 flex items-center justify-center glow-red-sm">
            <svg viewBox="0 0 24 24" className="w-4 h-4 text-red-500 fill-current">
              <circle cx="12" cy="12" r="2" />
              <path d="M12 2A10 10 0 0 0 2 12h3a7 7 0 0 1 7-7V2zm0 0v3a7 7 0 0 1 7 7h3A10 10 0 0 0 12 2zM2 12a10 10 0 0 0 10 10v-3a7 7 0 0 1-7-7H2zm20 0h-3a7 7 0 0 1-7 7v3a10 10 0 0 0 10-10z" />
            </svg>
          </div>
          <div className="w-6 h-6 border border-red-500/80 bg-red-950/40 p-1 grid grid-cols-2 gap-0.5">
            <div className="bg-red-500" />
            <div className="bg-slate-400" />
            <div className="bg-slate-400" />
            <div className="bg-red-500" />
          </div>
        </div>
      </div>
    </div>
  );
};
