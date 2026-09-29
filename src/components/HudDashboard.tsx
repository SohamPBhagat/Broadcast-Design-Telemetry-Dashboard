import React, { useState, useEffect } from 'react';
import { HeaderBadge } from './HeaderBadge';
import { ControlToolbar } from './ControlToolbar';
import { CountrySelectorBar } from './CountrySelectorBar';
import { ActiveRadarMapPanel } from './ActiveRadarMapPanel';
import { CountryNewsStockPanel } from './CountryNewsStockPanel';
import { ThreeGlobe } from './ThreeGlobe';
import { EqualizerBar } from './EqualizerBar';
import { ArcGauge } from './ArcGauge';
import { MatrixGlyphStream } from './MatrixGlyphStream';
import { LedGrid } from './LedGrid';
import { MiniWireframeGlobe } from './MiniWireframeGlobe';
import { AiSettingsModal } from './AiSettingsModal';
import { AiChatConsolePanel } from './AiChatConsolePanel';
import { WORLD_COUNTRIES, CountryTelemetry } from '../data/countriesData';
import { hudAudio } from './AudioSynth';

export const HudDashboard: React.FC = () => {
  const [broadcastTitle, setBroadcastTitle] = useState("BROADCAST DESIGN");
  const [isRotating, setIsRotating] = useState(true);
  const [showScanlines, setShowScanlines] = useState(true);
  const [showWireframe, setShowWireframe] = useState(true);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [activeCountry, setActiveCountry] = useState<CountryTelemetry>(
    WORLD_COUNTRIES[0] // United States default
  );
  const [alertMode, setAlertMode] = useState(false);

  // Animated Oscilloscope Phase State
  const [oscPhase, setOscPhase] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setOscPhase((p) => (p + 0.15) % (Math.PI * 2));
    }, 50);
    return () => clearInterval(timer);
  }, []);

  const handleCountrySelect = (country: CountryTelemetry) => {
    hudAudio.playTargetLock();
    setActiveCountry(country);
  };

  const handleAlert = () => {
    hudAudio.playBeep(2000, 'sawtooth', 0.1);
    setAlertMode(true);
    setTimeout(() => setAlertMode(false), 3200);
  };

  // Generate dynamic wave path based on phase and signal strength
  const generateWavePath = (amplitude: number, freq: number, colorPhase: number) => {
    const points: string[] = [];
    const width = 200;
    const midY = 8;
    for (let x = 0; x <= width; x += 5) {
      const y = midY + Math.sin((x * freq) / 10 + oscPhase + colorPhase) * amplitude;
      points.push(`${x === 0 ? 'M' : 'L'}${x},${y.toFixed(1)}`);
    }
    return points.join(' ');
  };

  return (
    <div className={`relative min-h-screen w-full bg-[#030406] text-slate-200 hud-grid-bg flex flex-col justify-between overflow-x-hidden p-2 sm:p-4 select-none ${alertMode ? 'ring-4 ring-red-600/60 ring-inset' : ''}`}>
      {/* CRT Scanlines Overlay */}
      {showScanlines && <div className="pointer-events-none fixed inset-0 hud-scanline z-50 opacity-40" />}

      {/* Outer Curved Bevel Frame matching Broadcast HUD Frame */}
      <div className="w-full max-w-7xl mx-auto border-2 border-slate-800/80 rounded-2xl bg-[#050609]/95 shadow-2xl relative p-3 sm:p-5 flex flex-col gap-3 my-auto">
        
        {/* Top Control Bar */}
        <ControlToolbar
          isRotating={isRotating}
          onToggleRotation={() => setIsRotating(!isRotating)}
          onAlertTrigger={handleAlert}
          onResetLayout={() => {
            setBroadcastTitle("BROADCAST DESIGN");
            setActiveCountry(WORLD_COUNTRIES[0]);
          }}
          showScanlines={showScanlines}
          onToggleScanlines={() => setShowScanlines(!showScanlines)}
          onOpenSettings={() => setIsSettingsOpen(true)}
        />

        {/* Top Header Badge */}
        <HeaderBadge
          title={broadcastTitle}
          onTitleChange={(t) => setBroadcastTitle(t)}
        />

        {/* Interactive Real Country Selector Bar */}
        <CountrySelectorBar
          activeCountry={activeCountry}
          onSelectCountry={handleCountrySelect}
        />

        {/* Main 3-Column HUD Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-stretch">
          
          {/* ================= LEFT COLUMN (3 Cols) ================= */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            {/* Top Left: Primary Regional Radar Map Panel for Active Country */}
            <ActiveRadarMapPanel
              activeCountry={activeCountry}
              titlePrefix="PRIMARY REGIONAL RADAR"
              onTargetClick={() => hudAudio.playBeep(1400, 'sine', 0.05)}
            />

            {/* Mid Left: Country News Headlines & Stock Market (+5/-5) Telemetry Panel */}
            <CountryNewsStockPanel
              activeCountry={activeCountry}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />

            {/* Bottom Left: LED Matrix Grid + Mini Wireframe Globe & Readout */}
            <div className="p-2 bg-[#06080d]/80 border border-slate-800/80 rounded-sm flex flex-col gap-2">
              <LedGrid activeCountry={activeCountry} />

              <div className="flex items-center gap-2 pt-1 border-t border-slate-800/80">
                <MiniWireframeGlobe size={48} />
                <div className="flex-1 font-mono-tech text-[9px] text-slate-400 space-y-0.5 leading-tight">
                  <div className="flex justify-between">
                    <span>SYS_LAT:</span>
                    <span className="text-slate-200">{activeCountry.lat}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>SYS_LON:</span>
                    <span className="text-slate-200">{activeCountry.lng}°</span>
                  </div>
                  <div className="flex justify-between">
                    <span>STATUS:</span>
                    <span className="text-red-400 font-bold">{activeCountry.status}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>


          {/* ================= CENTER COLUMN (6 Cols) ================= */}
          <div className="lg:col-span-6 flex flex-col items-center justify-between min-h-[440px] relative">
            {/* Target Information Badge Overlay */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 bg-[#080b12]/90 border border-red-500/80 px-3.5 py-1 rounded text-center z-10 font-mono-tech text-[10px] tracking-wider text-slate-300 glow-red-sm flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
              <span>3D GLOBE TARGET:</span>
              <span className="text-red-400 font-bold font-orbitron">{activeCountry.name.toUpperCase()} [{activeCountry.code}]</span>
            </div>

            {/* 3D Real Country Interactive WebGL Globe */}
            <div className="w-full flex-1 flex items-center justify-center py-2">
              <ThreeGlobe
                isRotating={isRotating}
                selectedTarget={activeCountry.id}
                onSelectCountry={handleCountrySelect}
                showWireframe={showWireframe}
              />
            </div>

            {/* Bottom Center: Audio Equalizer Bar Graph */}
            <div className="w-full mt-auto">
              <EqualizerBar />
            </div>
          </div>


          {/* ================= RIGHT COLUMN (3 Cols) ================= */}
          <div className="lg:col-span-3 flex flex-col gap-3">
            {/* Top Right: Mini Globe, Wave Osc, Matrix Data, Arc Gauges */}
            <div className="p-2.5 bg-[#06080d]/90 border border-slate-800/80 rounded-sm flex flex-col gap-2 shadow-lg font-mono-tech">
              {/* Mini Globe & Readout Line */}
              <div className="flex items-start justify-between">
                <div className="font-mono-tech text-[9px] text-slate-400 space-y-0.5">
                  <div className="text-slate-200 font-bold flex items-center gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>TELEMETRY_LOG // [{activeCountry.code}]</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">SATS:</span>
                    <span className="text-slate-200 font-bold">{activeCountry.activeSatellites} ACTIVE</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">SECTOR:</span>
                    <span className="text-slate-300">{activeCountry.sector}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">SECURITY:</span>
                    <span className="text-red-400 font-bold">{activeCountry.securityLevel}</span>
                  </div>
                  <div className="flex justify-between gap-2">
                    <span className="text-slate-500">POWER:</span>
                    <span className="text-slate-200">{activeCountry.powerOutput}</span>
                  </div>
                </div>
                <MiniWireframeGlobe size={48} />
              </div>

              {/* Dynamic Animated Oscilloscope & Signal Meter Bar */}
              <div className="flex flex-col gap-1 py-1.5 border-t border-b border-slate-800/80 bg-[#030407] px-1 rounded-sm">
                <div className="flex items-center justify-between text-[8px] text-slate-400 px-0.5">
                  <span>OSCILLOSCOPE: {activeCountry.signalStrength}% SIG</span>
                  <span className="text-red-400">{(activeCountry.signalStrength * 0.42).toFixed(1)} dBm</span>
                </div>
                <svg width="100%" height="20" viewBox="0 0 200 16" preserveAspectRatio="none" className="opacity-90">
                  <path
                    d={generateWavePath(5, 0.8, 0)}
                    fill="none"
                    stroke="rgba(255, 255, 255, 0.75)"
                    strokeWidth="1.2"
                  />
                  <path
                    d={generateWavePath(6, 1.2, Math.PI / 2)}
                    fill="none"
                    stroke={activeCountry.signalStrength >= 85 ? '#10b981' : '#ff2a4b'}
                    strokeWidth="1.2"
                  />
                </svg>

                {/* Horizontal Step Meter Bar */}
                <div className="flex gap-[1.5px] w-full pt-0.5">
                  {Array.from({ length: 24 }).map((_, i) => {
                    const threshold = Math.round((activeCountry.signalStrength / 100) * 24);
                    const isActive = i < threshold;
                    return (
                      <div
                        key={i}
                        className={`h-2 flex-1 rounded-[0.5px] transition-all duration-300 ${
                          isActive
                            ? activeCountry.signalStrength >= 85
                              ? 'bg-emerald-500 glow-green-sm'
                              : 'bg-red-600 glow-red-sm'
                            : 'bg-slate-800'
                        }`}
                      />
                    );
                  })}
                </div>
              </div>

              {/* Arc Gauges Driven Dynamically by Active Country Telemetry */}
              <div className="flex items-center justify-between gap-2 pt-0.5">
                <div className="flex-1 overflow-hidden pr-2 border-r border-slate-800/80">
                  <MatrixGlyphStream rows={7} cols={5} speed={140} />
                </div>
                <div className="flex flex-col gap-1.5">
                  <ArcGauge
                    value={Math.round(activeCountry.signalStrength)}
                    size={68}
                    label="FREQ"
                  />
                  <ArcGauge
                    value={Math.min(99, Math.round(activeCountry.activeSatellites * 2.1))}
                    size={68}
                    label="GAIN"
                  />
                </div>
              </div>
            </div>

            {/* Bottom Right: AI Tactical Chat Terminal & Internet Gateway Console */}
            <AiChatConsolePanel
              activeCountry={activeCountry}
              onOpenSettings={() => setIsSettingsOpen(true)}
            />
          </div>

        </div>

        {/* Bottom Footer Info Bar */}
        <div className="w-full flex flex-wrap items-center justify-between pt-2 border-t border-slate-800/80 text-[10px] font-mono-tech text-slate-500">
          <div className="flex items-center gap-2">
            <span className="text-slate-400">SELECTED TARGET:</span>
            <span className="text-red-400 font-bold uppercase">{activeCountry.name} ({activeCountry.capital})</span>
            <span>|</span>
            <span>GRID: {activeCountry.gridRef}</span>
          </div>

          <div className="flex items-center gap-3">
            <span>SUITABLE FOR BROADCAST DESIGN & GRAPHICS</span>
            <span className="text-slate-600">●</span>
            <span className="text-slate-400">INTERACTIVE 3D GLOBE ENGINE</span>
          </div>
        </div>

      </div>

      {/* AI Model Inference Gateway Settings Modal */}
      <AiSettingsModal
        isOpen={isSettingsOpen}
        onClose={() => setIsSettingsOpen(false)}
      />
    </div>
  );
};
