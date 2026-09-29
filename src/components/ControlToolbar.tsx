import React, { useState } from 'react';
import { Volume2, VolumeX, Pause, Play, AlertTriangle, RefreshCw, Eye, Maximize2, Settings } from 'lucide-react';
import { hudAudio } from './AudioSynth';

interface ControlToolbarProps {
  isRotating: boolean;
  onToggleRotation: () => void;
  onAlertTrigger: () => void;
  onResetLayout: () => void;
  showScanlines: boolean;
  onToggleScanlines: () => void;
  onOpenSettings?: () => void;
}

export const ControlToolbar: React.FC<ControlToolbarProps> = ({
  isRotating,
  onToggleRotation,
  onAlertTrigger,
  onResetLayout,
  showScanlines,
  onToggleScanlines,
  onOpenSettings
}) => {
  const [soundEnabled, setSoundEnabled] = useState(false);

  const toggleAudio = () => {
    const state = hudAudio.toggleSound();
    setSoundEnabled(state);
  };

  const handleFullscreen = () => {
    hudAudio.playBeep(1200, 'sine', 0.05);
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto flex flex-wrap items-center justify-between px-3 py-1.5 bg-[#06080e]/90 border-b border-slate-800 text-xs font-mono-tech select-none gap-2">
      {/* Left: System Status Ticker */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
          <span className="text-red-400 font-bold uppercase tracking-wider">
            BROADCAST HUD // LIVE
          </span>
        </div>
        <span className="hidden sm:inline text-slate-500">|</span>
        <span className="hidden sm:inline text-slate-400">
          FPS: 60.0
        </span>
        <span className="hidden md:inline text-slate-500">|</span>
        <span className="hidden md:inline text-slate-400">
          LATENCY: 12ms
        </span>
      </div>

      {/* Right: Interactive Command Buttons */}
      <div className="flex items-center gap-2">
        {/* Sound Toggle */}
        <button
          onClick={toggleAudio}
          className={`flex items-center gap-1 px-2.5 py-1 rounded border transition-all ${
            soundEnabled
              ? 'bg-red-950/60 border-red-500 text-red-400 glow-red-sm'
              : 'bg-slate-900 border-slate-700 text-slate-400 hover:text-slate-200'
          }`}
          title="Toggle SFX Audio"
        >
          {soundEnabled ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          <span className="hidden xs:inline">{soundEnabled ? 'AUDIO ON' : 'AUDIO OFF'}</span>
        </button>

        {/* Globe Rotation Pause/Play */}
        <button
          onClick={() => {
            hudAudio.playBeep(1100, 'sine', 0.04);
            onToggleRotation();
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-300 rounded transition-colors"
          title="Pause or Resume Globe Rotation"
        >
          {isRotating ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
          <span className="hidden xs:inline">{isRotating ? 'ROTATE' : 'PAUSED'}</span>
        </button>

        {/* Scanlines Toggle */}
        <button
          onClick={() => {
            hudAudio.playBeep(1300, 'sine', 0.04);
            onToggleScanlines();
          }}
          className={`flex items-center gap-1 px-2 py-1 rounded border transition-colors ${
            showScanlines ? 'bg-slate-800 border-slate-500 text-slate-200' : 'bg-slate-900 border-slate-700 text-slate-500'
          }`}
          title="Toggle CRT Scanline Overlay"
        >
          <Eye className="w-3.5 h-3.5" />
          <span className="hidden xs:inline">CRT SCAN</span>
        </button>

        {/* Red Alert Simulation */}
        <button
          onClick={() => {
            hudAudio.playAlert();
            onAlertTrigger();
          }}
          className="flex items-center gap-1 px-2.5 py-1 bg-red-900/40 border border-red-600/80 hover:bg-red-800/60 text-red-300 rounded transition-colors glow-red-sm"
          title="Trigger Red Alert Telemetry Scan"
        >
          <AlertTriangle className="w-3.5 h-3.5 text-red-400 animate-pulse" />
          <span>ALERT</span>
        </button>

        {/* Reset View */}
        <button
          onClick={() => {
            hudAudio.playBeep(900, 'sine', 0.05);
            onResetLayout();
          }}
          className="p-1 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded"
          title="Reset Telemetry Data"
        >
          <RefreshCw className="w-3.5 h-3.5" />
        </button>

        {/* Fullscreen */}
        <button
          onClick={handleFullscreen}
          className="p-1 bg-slate-900 border border-slate-700 hover:border-slate-500 text-slate-400 hover:text-slate-200 rounded"
          title="Toggle Fullscreen"
        >
          <Maximize2 className="w-3.5 h-3.5" />
        </button>

        {/* AI Gateway Settings */}
        {onOpenSettings && (
          <button
            onClick={() => {
              hudAudio.playBeep(1400, 'sine', 0.05);
              onOpenSettings();
            }}
            className="flex items-center gap-1 px-2 py-1 bg-red-950/60 border border-red-500/80 hover:bg-red-900/80 text-red-200 rounded transition-all glow-red-sm"
            title="Configure AI Gateway Model, Endpoint & API Keys"
          >
            <Settings className="w-3.5 h-3.5 text-red-400 animate-spin-slow" />
            <span className="hidden sm:inline font-bold">SETTINGS</span>
          </button>
        )}
      </div>
    </div>
  );
};
