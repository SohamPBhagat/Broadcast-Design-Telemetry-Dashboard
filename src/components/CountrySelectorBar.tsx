import React, { useState } from 'react';
import { WORLD_COUNTRIES, CountryTelemetry } from '../data/countriesData';
import { hudAudio } from './AudioSynth';
import { Search, Globe, Radio, Zap, Shield, Satellite } from 'lucide-react';

interface CountrySelectorBarProps {
  activeCountry: CountryTelemetry;
  onSelectCountry: (country: CountryTelemetry) => void;
}

export const CountrySelectorBar: React.FC<CountrySelectorBarProps> = ({
  activeCountry,
  onSelectCountry
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedContinent, setSelectedContinent] = useState<string>('ALL');

  const continents = ['ALL', 'North America', 'South America', 'Europe', 'Africa', 'Asia', 'Oceania'];

  const filteredCountries = WORLD_COUNTRIES.filter(c => {
    const matchesSearch = c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          c.capital.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesContinent = selectedContinent === 'ALL' || c.continent === selectedContinent;
    return matchesSearch && matchesContinent;
  });

  return (
    <div className="w-full flex flex-col gap-2 p-2.5 bg-[#06080e]/90 border border-slate-800 rounded-sm font-mono-tech select-none">
      {/* Top Row: Search Input + Continent Filter Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-slate-400" />
          <input
            type="text"
            placeholder="SEARCH COUNTRY, CAPITAL OR CODE..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-[#040508] border border-slate-700 focus:border-red-500 text-slate-100 text-xs pl-8 pr-3 py-1.5 rounded focus:outline-none placeholder-slate-500 uppercase tracking-wider"
          />
        </div>

        {/* Continent Pills */}
        <div className="flex flex-wrap items-center gap-1 overflow-x-auto max-w-full py-0.5">
          {continents.map(cont => (
            <button
              key={cont}
              onClick={() => {
                hudAudio.playBeep(1100, 'sine', 0.03);
                setSelectedContinent(cont);
              }}
              className={`px-2 py-0.5 text-[10px] uppercase rounded border transition-all ${
                selectedContinent === cont
                  ? 'bg-red-950/80 border-red-500 text-red-300 font-bold glow-red-sm'
                  : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
              }`}
            >
              {cont}
            </button>
          ))}
        </div>
      </div>

      {/* Country Selection Chips Horizontal Scrollbar */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-2 pt-0.5 scroll-smooth scrollbar-thin">
        {filteredCountries.map(country => {
          const isSelected = country.id === activeCountry.id;
          return (
            <button
              key={country.id}
              onClick={() => {
                hudAudio.playTargetLock();
                onSelectCountry(country);
              }}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded border text-[11px] whitespace-nowrap transition-all flex-shrink-0 ${
                isSelected
                  ? 'bg-red-600/90 border-red-400 text-white font-bold shadow-[0_0_12px_rgba(255,40,70,0.6)] scale-105'
                  : 'bg-[#090c14] border-slate-800 text-slate-300 hover:border-slate-600 hover:bg-slate-900'
              }`}
            >
              <Globe className={`w-3 h-3 ${isSelected ? 'text-white animate-spin' : 'text-red-400'}`} />
              <span>{country.name}</span>
              <span className={`text-[9px] px-1 rounded ${isSelected ? 'bg-black/40 text-red-200' : 'bg-slate-800 text-slate-400'}`}>
                {country.code}
              </span>
            </button>
          );
        })}
      </div>

      {/* Active Selected Country Telemetry Dashboard Box */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 pt-2 border-t border-slate-800/80 text-[10px] bg-[#040508]/80 p-2 rounded">
        <div className="flex flex-col">
          <span className="text-slate-500 flex items-center gap-1">
            <Globe className="w-3 h-3 text-red-400" /> TARGET NAME
          </span>
          <span className="font-orbitron font-bold text-red-400 text-xs truncate">
            {activeCountry.name.toUpperCase()}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-500 flex items-center gap-1">
            <Radio className="w-3 h-3 text-cyan-400" /> CAPITAL / SECTOR
          </span>
          <span className="font-bold text-slate-200 text-xs truncate">
            {activeCountry.capital}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-500 flex items-center gap-1">
            <Shield className="w-3 h-3 text-amber-400" /> DEFENSE / STATUS
          </span>
          <span className={`font-bold text-xs truncate ${activeCountry.status === 'ALERT' ? 'text-red-400 animate-pulse' : 'text-emerald-400'}`}>
            {activeCountry.securityLevel}
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-500 flex items-center gap-1">
            <Satellite className="w-3 h-3 text-blue-400" /> SATELLITE ARRAY
          </span>
          <span className="font-bold text-slate-200 text-xs">
            {activeCountry.activeSatellites} NODES ACTIVE
          </span>
        </div>

        <div className="flex flex-col">
          <span className="text-slate-500 flex items-center gap-1">
            <Zap className="w-3 h-3 text-yellow-400" /> POWER GRID
          </span>
          <span className="font-bold text-slate-200 text-xs">
            {activeCountry.powerOutput}
          </span>
        </div>

        <div className="flex flex-col justify-center">
          <div className="flex justify-between text-[9px] text-slate-400 mb-0.5">
            <span>UPLINK SIGNAL</span>
            <span className="text-red-400 font-bold">{activeCountry.signalStrength}%</span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded overflow-hidden">
            <div
              style={{ width: `${activeCountry.signalStrength}%` }}
              className="h-full bg-gradient-to-r from-red-600 to-red-400 glow-red-sm"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
