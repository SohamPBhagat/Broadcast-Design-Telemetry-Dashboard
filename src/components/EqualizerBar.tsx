import React, { useState, useEffect } from 'react';

export const EqualizerBar: React.FC = () => {
  const barCount = 54;

  const generateHeights = () => {
    return Array.from({ length: barCount }, (_, i) => {
      // Create organic wave shape with peaks
      const base = Math.sin(i * 0.18) * 20 + Math.cos(i * 0.35) * 15 + 30;
      const noise = Math.random() * 25;
      return Math.min(Math.max(base + noise, 10), 95);
    });
  };

  const [heights, setHeights] = useState<number[]>(generateHeights);

  useEffect(() => {
    const interval = setInterval(() => {
      setHeights(prev =>
        prev.map((h, i) => {
          const delta = (Math.random() - 0.48) * 16;
          return Math.min(Math.max(h + delta, 8), 98);
        })
      );
    }, 120);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full flex flex-col items-center gap-1.5 px-2">
      {/* Spectrum Bars */}
      <div className="w-full h-12 flex items-end justify-between gap-[2px] bg-[#05070a]/90 p-1 border-t border-b border-slate-800/80 overflow-hidden relative">
        {/* Background Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between pointer-events-none opacity-20">
          <div className="border-b border-slate-500 w-full" />
          <div className="border-b border-slate-500 w-full" />
          <div className="border-b border-slate-500 w-full" />
        </div>

        {heights.map((h, idx) => {
          // Make specific bars bright red like in reference image
          const isRed = idx === 12 || idx === 13 || idx === 25 || idx === 38 || idx === 39 || idx === 50;

          return (
            <div
              key={idx}
              className="flex-1 flex flex-col justify-end h-full group transition-all duration-100"
            >
              <div
                style={{ height: `${h}%` }}
                className={`w-full rounded-[1px] transition-all duration-150 ${
                  isRed
                    ? 'bg-red-500 glow-red-sm'
                    : h > 65
                    ? 'bg-slate-200'
                    : 'bg-slate-400/80'
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Underneath Precision Ruler & Ticks */}
      <div className="w-full flex flex-col gap-0.5 font-mono-tech text-[9px] text-slate-500 select-none">
        <div className="w-full flex justify-between items-center opacity-80 px-1">
          {Array.from({ length: 18 }).map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className={`w-[1px] ${i % 3 === 0 ? 'h-2 bg-slate-400' : 'h-1 bg-slate-700'}`} />
              {i % 3 === 0 && <span className="text-[8px] text-slate-400">{i * 5}</span>}
            </div>
          ))}
        </div>

        {/* Micro status ticker dots */}
        <div className="flex justify-between items-center text-[8px] text-slate-500 tracking-wider font-mono-tech pt-0.5">
          <span className="text-red-400 font-bold">▶ AUDIO CH-01 [ACTIVE]</span>
          <span className="hidden sm:inline text-slate-400">SPECTRUM: 12.4 kHz</span>
          <span className="text-slate-400">GAIN: +3.2 dB</span>
          <span className="text-red-400">98.4% PK</span>
        </div>
      </div>
    </div>
  );
};
