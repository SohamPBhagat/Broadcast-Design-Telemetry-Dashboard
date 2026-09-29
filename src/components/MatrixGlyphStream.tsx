import React, { useEffect, useState } from 'react';

// Sci-fi HUD digital matrix symbols resembling pixelated runic/telemetry code
const SYMBOL_BLOCKS = [
  ['█', '░', '▒', '▓'],
  ['⠁', '⠂', '⠄', '⡀', '⢀', '⠠', '⠐', '⠈'],
  ['⠟', '⠿', '⡿', '⢟', '⠻', '⣟', '⣻', '⣾'],
  ['░░', '▒▒', '▓▓', '██'],
  [':.', '.:', '::', '..'],
  ['⩛', '⩚', '⩠', '⩟', '⩞', '⩝']
];

interface MatrixGlyphStreamProps {
  rows?: number;
  cols?: number;
  className?: string;
  speed?: number;
}

export const MatrixGlyphStream: React.FC<MatrixGlyphStreamProps> = ({
  rows = 8,
  cols = 6,
  className = '',
  speed = 150
}) => {
  const generateGrid = () => {
    const grid: string[][] = [];
    for (let r = 0; r < rows; r++) {
      const row: string[] = [];
      for (let c = 0; c < cols; c++) {
        const set = SYMBOL_BLOCKS[Math.floor(Math.random() * SYMBOL_BLOCKS.length)];
        row.push(set[Math.floor(Math.random() * set.length)]);
      }
      grid.push(row);
    }
    return grid;
  };

  const [matrix, setMatrix] = useState<string[][]>(generateGrid);

  useEffect(() => {
    const interval = setInterval(() => {
      setMatrix(prev => {
        const next = [...prev.map(row => [...row])];
        // Mutate a few random cells
        for (let i = 0; i < 3; i++) {
          const r = Math.floor(Math.random() * rows);
          const c = Math.floor(Math.random() * cols);
          const set = SYMBOL_BLOCKS[Math.floor(Math.random() * SYMBOL_BLOCKS.length)];
          if (next[r]) {
            next[r][c] = set[Math.floor(Math.random() * set.length)];
          }
        }
        return next;
      });
    }, speed);

    return () => clearInterval(interval);
  }, [rows, cols, speed]);

  return (
    <div className={`font-mono-tech text-[10px] leading-tight tracking-widest text-slate-400 select-none ${className}`}>
      {matrix.map((row, rIdx) => (
        <div key={rIdx} className="flex gap-1.5 opacity-80 hover:opacity-100 transition-opacity">
          {row.map((cell, cIdx) => (
            <span
              key={cIdx}
              className={`inline-block w-3 text-center ${
                (rIdx + cIdx) % 7 === 0 ? 'text-red-400 opacity-90' : 'text-slate-300'
              }`}
            >
              {cell}
            </span>
          ))}
        </div>
      ))}
    </div>
  );
};
