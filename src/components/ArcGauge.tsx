import React from 'react';

interface ArcGaugeProps {
  value: number;
  max?: number;
  label?: string;
  size?: number;
  showTicks?: boolean;
  className?: string;
}

export const ArcGauge: React.FC<ArcGaugeProps> = ({
  value,
  max = 100,
  label,
  size = 76,
  showTicks = true,
  className = ''
}) => {
  const strokeWidth = 2.5;
  const radius = (size - 12) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(Math.max(value / max, 0), 1);
  const strokeDashoffset = circumference - progress * (circumference * 0.75);

  return (
    <div className={`relative flex flex-col items-center justify-center ${className}`}>
      <svg width={size} height={size} className="transform -rotate-90">
        {/* Background Track Circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255, 255, 255, 0.15)"
          strokeWidth={strokeWidth}
          strokeDasharray={`${circumference * 0.75} ${circumference * 0.25}`}
          fill="none"
        />

        {/* Outer Fine Border Accent */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius + 3}
          stroke="rgba(255, 255, 255, 0.25)"
          strokeWidth={0.8}
          strokeDasharray="2 4"
          fill="none"
        />

        {/* Active Value Arc */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="#ffffff"
          strokeWidth={strokeWidth + 0.5}
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          fill="none"
          className="transition-all duration-700 ease-out drop-shadow-[0_0_4px_rgba(255,255,255,0.6)]"
        />

        {/* Ticks if requested */}
        {showTicks && Array.from({ length: 12 }).map((_, i) => {
          const angle = (i * 30 - 135) * (Math.PI / 180);
          const x1 = size / 2 + (radius - 4) * Math.cos(angle);
          const y1 = size / 2 + (radius - 4) * Math.sin(angle);
          const x2 = size / 2 + (radius - 1) * Math.cos(angle);
          const y2 = size / 2 + (radius - 1) * Math.sin(angle);
          return (
            <line
              key={i}
              x1={x1}
              y1={y1}
              x2={x2}
              y2={y2}
              stroke="rgba(255,255,255,0.3)"
              strokeWidth={1}
            />
          );
        })}
      </svg>

      {/* Center Number Value */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-orbitron font-normal text-xl sm:text-2xl text-slate-100 tracking-tighter drop-shadow-md">
          {value}
        </span>
        {label && (
          <span className="text-[8px] font-mono-tech uppercase text-slate-400 -mt-1">
            {label}
          </span>
        )}
      </div>
    </div>
  );
};
