import React, { useState, useEffect } from 'react';
import { CountryTelemetry } from '../data/countriesData';

interface LedGridProps {
  activeCountry?: CountryTelemetry;
}

export const LedGrid: React.FC<LedGridProps> = ({ activeCountry }) => {
  const cols = 16;
  const rows = 3;

  // Determine health condition tier: 'OPTIMAL' (green dominant), 'ALERT' (red dominant), 'NEUTRAL' (blue/amber/slate)
  const getConditionTier = () => {
    if (!activeCountry) return 'OPTIMAL';
    if (activeCountry.status === 'ALERT' || activeCountry.signalStrength < 70) return 'ALERT';
    if (activeCountry.status === 'OPTIMAL' || activeCountry.signalStrength >= 85) return 'OPTIMAL';
    return 'STANDBY';
  };

  const tier = getConditionTier();

  const generateInitialStates = () => {
    const states: string[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        if (tier === 'OPTIMAL') {
          // Positive: green, emerald, white, cyan, neutral gray, few red
          if ((r === 1 && c === 3) || (r === 0 && c === 12) || (r === 2 && c === 7)) {
            row.push('green-vibrant');
          } else if ((r === 0 && c === 2) || (r === 1 && c === 9) || (r === 2 && c === 14)) {
            row.push('emerald');
          } else if ((c + r) % 4 === 0) {
            row.push('cyan');
          } else if ((c * r) % 3 === 0) {
            row.push('white');
          } else if (c === 15) {
            row.push('red');
          } else {
            row.push('dark');
          }
        } else if (tier === 'ALERT') {
          // Negative / Alert: dominant red, crimson, dark gray, warning amber
          if ((r === 0 && c === 1) || (r === 1 && c === 5) || (r === 2 && c === 10) || (r === 1 && c === 13)) {
            row.push('red-vibrant');
          } else if ((c + r) % 2 === 0) {
            row.push('red');
          } else if ((c * r) % 3 === 0) {
            row.push('amber');
          } else {
            row.push('dark');
          }
        } else {
          // Standby / Scanning: cyan, yellow, white, slate
          if ((r === 1 && c === 4) || (r === 0 && c === 11)) {
            row.push('amber');
          } else if ((c + r) % 3 === 0) {
            row.push('cyan');
          } else if ((c * r) % 4 === 0) {
            row.push('white');
          } else {
            row.push('dark');
          }
        }
      }
      states.push(row);
    }
    return states;
  };

  const [grid, setGrid] = useState<string[][]>(generateInitialStates);

  // Regenerate when activeCountry changes
  useEffect(() => {
    setGrid(generateInitialStates());
  }, [activeCountry?.id, tier]);

  // Subtle live flicker simulation matching condition
  useEffect(() => {
    const interval = setInterval(() => {
      setGrid(prev => {
        const next = prev.map(r => [...r]);
        const r = Math.floor(Math.random() * rows);
        const c = Math.floor(Math.random() * cols);
        const rand = Math.random();

        if (tier === 'OPTIMAL') {
          if (rand > 0.7) next[r][c] = 'green-vibrant';
          else if (rand > 0.5) next[r][c] = 'emerald';
          else if (rand > 0.3) next[r][c] = 'cyan';
          else if (rand > 0.15) next[r][c] = 'white';
          else next[r][c] = 'dark';
        } else if (tier === 'ALERT') {
          if (rand > 0.6) next[r][c] = 'red-vibrant';
          else if (rand > 0.35) next[r][c] = 'red';
          else if (rand > 0.2) next[r][c] = 'amber';
          else next[r][c] = 'dark';
        } else {
          if (rand > 0.75) next[r][c] = 'cyan';
          else if (rand > 0.5) next[r][c] = 'amber';
          else if (rand > 0.3) next[r][c] = 'white';
          else next[r][c] = 'dark';
        }
        return next;
      });
    }, 350);

    return () => clearInterval(interval);
  }, [tier]);

  return (
    <div className="flex flex-col gap-1.5 font-mono-tech">
      {/* Condition Header Tag */}
      <div className="flex items-center justify-between text-[8px] px-0.5 font-bold">
        <span className="text-slate-400">STATUS TELEMETRY GRID:</span>
        <span
          className={`px-1 py-0.5 rounded text-[7.5px] border ${
            tier === 'OPTIMAL'
              ? 'bg-emerald-950/80 text-emerald-300 border-emerald-500/50'
              : tier === 'ALERT'
              ? 'bg-red-950/80 text-red-300 border-red-500/50 animate-pulse'
              : 'bg-amber-950/80 text-amber-300 border-amber-500/50'
          }`}
        >
          {tier === 'OPTIMAL' ? 'POSITIVE [GREEN NODE]' : tier === 'ALERT' ? 'CRITICAL [RED ALERT]' : 'SCANNING [STANDBY]'}
        </span>
      </div>

      {/* 16x3 Block LED Grid */}
      <div className="grid grid-cols-16 gap-[3px] bg-[#07090d] p-1.5 border border-slate-800/80 rounded-sm">
        {grid.map((row, rIdx) =>
          row.map((cell, cIdx) => {
            let bgStyle = 'bg-slate-800/60';
            if (cell === 'green-vibrant') {
              bgStyle = 'bg-emerald-400 glow-green-sm animate-pulse';
            } else if (cell === 'emerald') {
              bgStyle = 'bg-emerald-600';
            } else if (cell === 'red-vibrant') {
              bgStyle = 'bg-rose-500 glow-red-sm animate-pulse';
            } else if (cell === 'red') {
              bgStyle = 'bg-red-600';
            } else if (cell === 'cyan') {
              bgStyle = 'bg-cyan-400';
            } else if (cell === 'amber') {
              bgStyle = 'bg-amber-500';
            } else if (cell === 'white') {
              bgStyle = 'bg-slate-200 glow-white-sm';
            }

            return (
              <div
                key={`${rIdx}-${cIdx}`}
                className={`w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-[1px] transition-colors duration-300 ${bgStyle}`}
              />
            );
          })
        )}
      </div>

      {/* Row of 7 Circular Micro Indicators (o o o o o o o) reflecting conditions */}
      <div className="flex items-center justify-between px-1 py-0.5">
        {Array.from({ length: 7 }).map((_, i) => {
          let dotBorder = 'border-slate-600 bg-slate-900';
          let dotFill = 'bg-slate-600';

          if (tier === 'OPTIMAL') {
            if (i === 1 || i === 3 || i === 5) {
              dotBorder = 'border-emerald-500 bg-emerald-950/50';
              dotFill = 'bg-emerald-400 animate-pulse';
            } else if (i % 2 === 0) {
              dotFill = 'bg-slate-200';
            }
          } else if (tier === 'ALERT') {
            if (i === 2 || i === 3 || i === 4) {
              dotBorder = 'border-red-500 bg-red-950/50';
              dotFill = 'bg-red-500 animate-ping';
            } else if (i % 2 === 0) {
              dotFill = 'bg-red-700';
            }
          } else {
            if (i === 3) {
              dotBorder = 'border-amber-500 bg-amber-950/50';
              dotFill = 'bg-amber-400 animate-pulse';
            } else if (i % 2 === 0) {
              dotFill = 'bg-cyan-400';
            }
          }

          return (
            <div
              key={i}
              className={`w-3 h-3 rounded-full border flex items-center justify-center relative ${dotBorder}`}
            >
              <div className={`w-1 h-1 rounded-full ${dotFill}`} />
            </div>
          );
        })}
      </div>
    </div>
  );
};

