import React, { useState } from 'react';
import * as d3Geo from 'd3-geo';
import { CountryTelemetry } from '../data/countriesData';
import { COUNTRY_BOUNDARIES } from '../data/countryBoundaries';
import { worldCountriesGeoJSON } from '../data/worldGeo';
import { ISO_NUMERIC_MAP } from '../data/countryIsoMap';
import { hudAudio } from './AudioSynth';
import { Shield, Radio, Satellite, Zap } from 'lucide-react';

interface ActiveRadarMapPanelProps {
  activeCountry: CountryTelemetry;
  onTargetClick?: (location: string) => void;
  titlePrefix?: string;
}

export const ActiveRadarMapPanel: React.FC<ActiveRadarMapPanelProps> = ({
  activeCountry,
  onTargetClick,
  titlePrefix = "ACTIVE RADAR"
}) => {
  const [isLocked, setIsLocked] = useState(true);

  const handleToggle = () => {
    hudAudio.playTargetLock();
    setIsLocked(!isLocked);
    if (onTargetClick) onTargetClick(activeCountry.id);
  };

  // SVG dimensions
  const svgWidth = 320;
  const svgHeight = 180;

  // Search for matched official GeoJSON feature for activeCountry in worldCountriesGeoJSON
  let matchedGeoFeature: any = null;
  if (worldCountriesGeoJSON && worldCountriesGeoJSON.features) {
    matchedGeoFeature = worldCountriesGeoJSON.features.find((f: any) => {
      const rawId = String(f.id ?? '');
      const paddedId = rawId.padStart(3, '0');
      const meta = ISO_NUMERIC_MAP[paddedId] || ISO_NUMERIC_MAP[rawId];
      if (meta && (meta.id === activeCountry.id || meta.code === activeCountry.code)) {
        return true;
      }
      const props = f.properties || {};
      if (
        props.iso_a3 === activeCountry.id ||
        props.iso_a2 === activeCountry.code ||
        (props.name && props.name.toLowerCase() === activeCountry.name.toLowerCase())
      ) {
        return true;
      }
      return false;
    });
  }

  let countryPathD = '';
  let centerPt: [number, number] = [svgWidth / 2, svgHeight / 2];

  if (matchedGeoFeature) {
    // Mercator projection fitted directly to the precise country geometry with margin padding
    const fitProjection = d3Geo.geoMercator().fitExtent(
      [[26, 22], [svgWidth - 26, svgHeight - 22]],
      matchedGeoFeature
    );

    const fitPathGen = d3Geo.geoPath().projection(fitProjection);
    countryPathD = fitPathGen(matchedGeoFeature) || '';

    // Calculate capital/target projected point inside the viewport
    const projCapital = fitProjection([activeCountry.lng, activeCountry.lat]);
    if (projCapital && !isNaN(projCapital[0]) && !isNaN(projCapital[1])) {
      const clampedX = Math.max(35, Math.min(svgWidth - 100, projCapital[0]));
      const clampedY = Math.max(30, Math.min(svgHeight - 30, projCapital[1]));
      centerPt = [clampedX, clampedY];
    } else {
      const centroid = fitPathGen.centroid(matchedGeoFeature);
      if (centroid && !isNaN(centroid[0]) && !isNaN(centroid[1])) {
        const clampedX = Math.max(35, Math.min(svgWidth - 100, centroid[0]));
        const clampedY = Math.max(30, Math.min(svgHeight - 30, centroid[1]));
        centerPt = [clampedX, clampedY];
      }
    }
  } else {
    // Fallback if no feature matched in worldCountriesGeoJSON
    const fallbackProjection = d3Geo.geoEquirectangular()
      .center([activeCountry.lng, activeCountry.lat])
      .scale(220)
      .translate([svgWidth / 2, svgHeight / 2]);

    const polyRings = COUNTRY_BOUNDARIES[activeCountry.id] || [
      [
        [activeCountry.lng - 8, activeCountry.lat + 6],
        [activeCountry.lng + 8, activeCountry.lat + 6],
        [activeCountry.lng + 8, activeCountry.lat - 6],
        [activeCountry.lng - 8, activeCountry.lat - 6],
        [activeCountry.lng - 8, activeCountry.lat + 6]
      ]
    ];

    countryPathD = polyRings.map(ring => {
      return ring.map(([lng, lat], idx) => {
        const pt = fallbackProjection([lng, lat]) || [0, 0];
        return `${idx === 0 ? 'M' : 'L'}${pt[0].toFixed(1)},${pt[1].toFixed(1)}`;
      }).join(' ') + ' Z';
    }).join(' ');

    const projCapital = fallbackProjection([activeCountry.lng, activeCountry.lat]);
    if (projCapital) {
      centerPt = [projCapital[0], projCapital[1]];
    }
  }

  return (
    <div className="flex flex-col gap-2 w-full p-2.5 bg-[#06080d]/90 border border-slate-800 rounded-sm relative group font-mono-tech select-none">
      {/* Top Header Segment */}
      <div className="flex items-center justify-between pb-1.5 border-b border-slate-800">
        <div className="flex items-center gap-2">
          {/* Glowing Red Icon */}
          <div className="w-5 h-5 rounded-full bg-red-950/80 border border-red-500 flex items-center justify-center glow-red-sm">
            <Radio className="w-3 h-3 text-red-400 animate-pulse" />
          </div>
          <span className="text-red-400 font-bold text-xs tracking-wider font-orbitron">
            {titlePrefix}: {activeCountry.name.toUpperCase()}
          </span>
        </div>

        <span className="text-[9px] text-slate-400 tracking-wider">
          [{activeCountry.code}] {activeCountry.sector}
        </span>
      </div>

      {/* Dynamic Vector Map Radar Viewport */}
      <div
        onClick={handleToggle}
        className="relative w-full h-40 bg-[#040509] border border-slate-800/80 rounded overflow-hidden cursor-pointer flex items-center justify-center"
      >
        {/* Background Tactical Grid Lines */}
        <svg className="absolute inset-0 w-full h-full opacity-20">
          <defs>
            <pattern id={`radarGrid-${titlePrefix.replace(/\s+/g, '')}`} width="20" height="20" patternUnits="userSpaceOnUse">
              <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#00f0ff" strokeWidth="0.5" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill={`url(#radarGrid-${titlePrefix.replace(/\s+/g, '')})`} />
        </svg>

        {/* Dynamic Country Geographic Boundaries SVG */}
        <svg viewBox={`0 0 ${svgWidth} ${svgHeight}`} className="w-full h-full object-contain filter drop-shadow">
          <path
            d={countryPathD}
            fill="rgba(225, 29, 72, 0.28)"
            stroke="#f43f5e"
            strokeWidth="1.8"
            strokeLinejoin="round"
            strokeLinecap="round"
            className={isLocked ? 'animate-pulse filter drop-shadow-[0_0_8px_rgba(244,63,94,0.7)]' : ''}
          />
          <path
            d={countryPathD}
            fill="none"
            stroke="#ffffff"
            strokeWidth="0.8"
            strokeDasharray="4 2"
            opacity="0.8"
          />

          {/* Tactical Target Reticle Centered on Capital */}
          <g transform={`translate(${centerPt[0]}, ${centerPt[1]})`}>
            {/* Concentric Radar Target Rings */}
            <circle r="24" fill="none" stroke="rgba(255, 42, 75, 0.35)" strokeWidth="1" strokeDasharray="3 3" />
            <circle r="15" fill="none" stroke="#ff2a4b" strokeWidth="1.5" className="animate-spin-slow" />
            <circle r="4" fill="#ff2a4b" className="animate-ping" />
            <circle r="2" fill="#ffffff" />

            {/* Crosshairs */}
            <line x1="-32" y1="0" x2="32" y2="0" stroke="#ff2a4b" strokeWidth="1" strokeDasharray="2 2" />
            <line x1="0" y1="-32" x2="0" y2="32" stroke="#ff2a4b" strokeWidth="1" strokeDasharray="2 2" />

            {/* Target Label Line */}
            <polyline points="0,0 15,-15 48,-15" fill="none" stroke="#ff2a4b" strokeWidth="1.2" />
            <rect x="48" y="-25" width="85" height="18" fill="#080b12" stroke="#ff2a4b" strokeWidth="1" rx="2" />
            <text x="90.5" y="-13" fill="#ffffff" fontSize="8" fontFamily="Share Tech Mono" textAnchor="middle" fontWeight="bold">
              {activeCountry.capital.toUpperCase()}
            </text>
          </g>
        </svg>

        {/* Sweeping Radar Beam Line */}
        <div className="absolute inset-0 pointer-events-none bg-gradient-to-tr from-transparent via-red-500/10 to-transparent animate-pulse" />

        {/* Floating Sector Badge Tag */}
        <div className="absolute top-1.5 left-1.5 bg-black/85 px-2 py-0.5 border border-red-500/70 rounded text-[9px] text-red-400 flex items-center gap-1.5 font-bold">
          <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-ping" />
          <span>RADAR LOCK: {activeCountry.name.toUpperCase()} ({activeCountry.capital})</span>
        </div>

        {/* Floating Coordinates Tag */}
        <div className="absolute bottom-1.5 right-1.5 bg-black/85 px-2 py-0.5 border border-slate-700 rounded text-[9px] text-slate-300 font-mono">
          GRID: {activeCountry.gridRef}
        </div>
      </div>

      {/* Dynamic Telemetry Stats Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5 pt-1 border-t border-slate-800 text-[9px]">
        <div className="bg-[#040508] p-1.5 rounded border border-slate-800/80 flex flex-col">
          <span className="text-slate-500 flex items-center gap-1">
            <Shield className="w-2.5 h-2.5 text-amber-400" /> SECURITY
          </span>
          <span className="font-bold text-red-400 truncate">{activeCountry.securityLevel}</span>
        </div>

        <div className="bg-[#040508] p-1.5 rounded border border-slate-800/80 flex flex-col">
          <span className="text-slate-500 flex items-center gap-1">
            <Satellite className="w-2.5 h-2.5 text-blue-400" /> SATELLITES
          </span>
          <span className="font-bold text-slate-200">{activeCountry.activeSatellites} NODES</span>
        </div>

        <div className="bg-[#040508] p-1.5 rounded border border-slate-800/80 flex flex-col">
          <span className="text-slate-500 flex items-center gap-1">
            <Zap className="w-2.5 h-2.5 text-yellow-400" /> POWER GRID
          </span>
          <span className="font-bold text-slate-200">{activeCountry.powerOutput}</span>
        </div>

        <div className="bg-[#040508] p-1.5 rounded border border-slate-800/80 flex flex-col justify-center">
          <span className="text-slate-500 text-[8px]">UPLINK SIGNAL</span>
          <div className="flex items-center gap-1">
            <div className="flex-1 h-1.5 bg-slate-800 rounded overflow-hidden">
              <div
                style={{ width: `${activeCountry.signalStrength}%` }}
                className="h-full bg-red-500 glow-red-sm"
              />
            </div>
            <span className="font-bold text-red-400 text-[9px]">{activeCountry.signalStrength}%</span>
          </div>
        </div>
      </div>

      {/* Bottom Telemetry Histogram Wave Bar */}
      <div className="w-full flex items-end justify-between h-5 gap-[1.5px] bg-[#040508] p-1 border border-slate-800/80 rounded">
        {Array.from({ length: 30 }).map((_, i) => {
          const h = (Math.sin(i * 0.5 + activeCountry.signalStrength) * 0.4 + 0.5) * 100;
          const isRed = i % 5 === 0;
          return (
            <div
              key={i}
              style={{ height: `${h}%` }}
              className={`flex-1 rounded-[0.5px] ${isRed ? 'bg-red-500 glow-red-sm' : 'bg-slate-600'}`}
            />
          );
        })}
      </div>
    </div>
  );
};

