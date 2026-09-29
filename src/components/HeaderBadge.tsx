import React, { useState } from 'react';
import { hudAudio } from './AudioSynth';

interface HeaderBadgeProps {
  title?: string;
  onTitleChange?: (newTitle: string) => void;
}

export const HeaderBadge: React.FC<HeaderBadgeProps> = ({
  title = "BROADCAST DESIGN",
  onTitleChange
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [tempTitle, setTempTitle] = useState(title);

  const handleBlur = () => {
    setIsEditing(false);
    if (onTitleChange && tempTitle.trim()) {
      onTitleChange(tempTitle.toUpperCase());
    }
  };

  return (
    <div className="flex flex-col items-center justify-center w-full my-1">
      {/* Small Category Subtitle */}
      <span className="font-mono-tech text-[10px] tracking-[0.3em] uppercase text-slate-400 opacity-90 mb-1">
        SUITABLE FOR
      </span>

      {/* Main Container with Title & Flanking Dials */}
      <div className="flex items-center gap-3 sm:gap-5">
        {/* Left Side Circular Gauges */}
        <div className="flex items-center gap-1.5 opacity-80">
          <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center animate-radar">
            <div className="w-3 h-3 rounded-full border border-dashed border-red-500/80" />
          </div>
          <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center animate-radar-reverse">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
          </div>
        </div>

        {/* Central Red Glowing Badge: [ BROADCAST DESIGN ] */}
        <div
          onClick={() => {
            hudAudio.playBeep(1400, 'sine', 0.04);
            setIsEditing(true);
          }}
          className="relative px-5 py-1.5 bg-gradient-to-r from-red-950/80 via-red-600/90 to-red-950/80 border border-red-500 glow-red rounded-sm cursor-pointer group transition-all duration-300 hover:scale-105 select-none"
        >
          {/* Decorative Corner Brackets */}
          <div className="absolute -top-1 -left-1 w-2.5 h-2.5 border-t-2 border-l-2 border-red-400" />
          <div className="absolute -top-1 -right-1 w-2.5 h-2.5 border-t-2 border-r-2 border-red-400" />
          <div className="absolute -bottom-1 -left-1 w-2.5 h-2.5 border-b-2 border-l-2 border-red-400" />
          <div className="absolute -bottom-1 -right-1 w-2.5 h-2.5 border-b-2 border-r-2 border-red-400" />

          {isEditing ? (
            <input
              type="text"
              value={tempTitle}
              onChange={(e) => setTempTitle(e.target.value)}
              onBlur={handleBlur}
              onKeyDown={(e) => e.key === 'Enter' && handleBlur()}
              autoFocus
              className="bg-black/80 text-white font-orbitron font-extrabold text-sm sm:text-lg tracking-wider text-center px-2 py-0.5 border border-red-400 focus:outline-none rounded"
            />
          ) : (
            <h1 className="font-orbitron font-black text-sm sm:text-base md:text-lg tracking-widest text-white glow-red-text uppercase px-1">
              [ {title} ]
            </h1>
          )}
        </div>

        {/* Right Side Circular Gauges */}
        <div className="flex items-center gap-1.5 opacity-80">
          <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center animate-radar">
            <div className="w-2 h-2 rounded-full bg-slate-400" />
          </div>
          <div className="w-5 h-5 rounded-full border border-slate-600 flex items-center justify-center animate-radar-reverse">
            <div className="w-3 h-3 rounded-full border border-dashed border-red-500/80" />
          </div>
        </div>
      </div>
    </div>
  );
};
