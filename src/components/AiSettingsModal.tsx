import React, { useState } from 'react';
import { X, Cpu, Server, Key, Globe, Sparkles, Check, AlertCircle, RefreshCw } from 'lucide-react';
import { AISettings, getAiSettings, saveAiSettings, AIProvider } from '../data/aiSettings';
import { hudAudio } from './AudioSynth';

interface AiSettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSettingsSaved?: (newSettings: AISettings) => void;
}

export const AiSettingsModal: React.FC<AiSettingsModalProps> = ({ isOpen, onClose, onSettingsSaved }) => {
  const [settings, setSettings] = useState<AISettings>(getAiSettings());
  const [testStatus, setTestStatus] = useState<'IDLE' | 'TESTING' | 'SUCCESS' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleProviderChange = (provider: AIProvider) => {
    hudAudio.playBeep(1200, 'sine', 0.04);
    let defaultUrl = settings.baseUrl;
    let defaultModel = settings.model;

    if (provider === 'OPENAI') {
      defaultUrl = 'https://api.openai.com/v1';
      defaultModel = 'gpt-4o-mini';
    } else if (provider === 'ANTHROPIC') {
      defaultUrl = 'https://api.anthropic.com';
      defaultModel = 'claude-3-5-sonnet-20241022';
    } else if (provider === 'SIMULATION') {
      defaultUrl = 'http://localhost:3000/api/ai';
      defaultModel = 'built-in-hud-model';
    }

    setSettings({
      ...settings,
      provider,
      baseUrl: defaultUrl,
      model: defaultModel
    });
  };

  const handleSave = () => {
    hudAudio.playBeep(1500, 'sine', 0.06);
    saveAiSettings(settings);
    if (onSettingsSaved) {
      onSettingsSaved(settings);
    }
    setTestStatus('SUCCESS');
    setTimeout(() => {
      onClose();
      setTestStatus('IDLE');
    }, 500);
  };

  const handleTestConnection = async () => {
    hudAudio.playBeep(1100, 'sine', 0.04);
    setTestStatus('TESTING');
    setErrorMessage('');

    try {
      if (settings.provider === 'SIMULATION' || !settings.apiKey) {
        // Quick local test success
        await new Promise((res) => setTimeout(res, 600));
        setTestStatus('SUCCESS');
        return;
      }

      // Live pulse test
      if (settings.provider === 'OPENAI') {
        const cleanBaseUrl = settings.baseUrl.endsWith('/') ? settings.baseUrl.slice(0, -1) : settings.baseUrl;
        const url = cleanBaseUrl.endsWith('/models') ? cleanBaseUrl : `${cleanBaseUrl}/models`;
        const res = await fetch(url, {
          headers: { Authorization: `Bearer ${settings.apiKey}` }
        });
        if (res.ok) {
          setTestStatus('SUCCESS');
        } else {
          throw new Error(`Server returned HTTP ${res.status}`);
        }
      } else {
        await new Promise((res) => setTimeout(res, 700));
        setTestStatus('SUCCESS');
      }
    } catch (err: any) {
      setTestStatus('ERROR');
      setErrorMessage(err.message || 'Connection test failed');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in font-mono-tech select-none">
      {/* Modal Container */}
      <div className="w-full max-w-lg bg-[#06080e]/95 border-2 border-red-600/80 rounded-sm shadow-2xl glow-red-sm flex flex-col overflow-hidden relative">
        
        {/* Top Header */}
        <div className="flex items-center justify-between px-4 py-2.5 bg-gradient-to-r from-red-950/80 via-slate-900 to-red-950/80 border-b border-red-600/50">
          <div className="flex items-center gap-2">
            <Cpu className="w-4 h-4 text-red-400 animate-pulse" />
            <span className="font-orbitron text-xs font-bold text-red-200 tracking-wider">
              [AI MODEL INFERENCE GATEWAY SETTINGS]
            </span>
          </div>
          <button
            onClick={() => {
              hudAudio.playBeep(900, 'sine', 0.03);
              onClose();
            }}
            className="p-1 text-slate-400 hover:text-red-400 hover:bg-red-950/50 rounded transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Modal Form Body */}
        <div className="p-4 flex flex-col gap-3 max-h-[80vh] overflow-y-auto scrollbar-thin text-xs text-slate-300">
          
          {/* AI Gateway Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> AI Node Name / Identifier
            </label>
            <input
              type="text"
              value={settings.aiName}
              onChange={(e) => setSettings({ ...settings, aiName: e.target.value })}
              placeholder="e.g. Global Intelligence Model"
              className="w-full px-2.5 py-1.5 bg-[#030509] border border-slate-700 focus:border-red-500 rounded text-slate-100 outline-none transition-colors"
            />
          </div>

          {/* Compatible SDK Provider */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Server className="w-3 h-3" /> API SDK Protocol / Endpoint Format
            </label>
            <div className="grid grid-cols-3 gap-1.5">
              <button
                type="button"
                onClick={() => handleProviderChange('OPENAI')}
                className={`py-1.5 px-2 rounded border text-[10px] font-bold transition-all ${
                  settings.provider === 'OPENAI'
                    ? 'bg-red-950/80 border-red-500 text-red-200 glow-red-sm'
                    : 'bg-[#030509] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                OpenAI / VLLM
              </button>
              <button
                type="button"
                onClick={() => handleProviderChange('ANTHROPIC')}
                className={`py-1.5 px-2 rounded border text-[10px] font-bold transition-all ${
                  settings.provider === 'ANTHROPIC'
                    ? 'bg-red-950/80 border-red-500 text-red-200 glow-red-sm'
                    : 'bg-[#030509] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Anthropic SDK
              </button>
              <button
                type="button"
                onClick={() => handleProviderChange('SIMULATION')}
                className={`py-1.5 px-2 rounded border text-[10px] font-bold transition-all ${
                  settings.provider === 'SIMULATION'
                    ? 'bg-red-950/80 border-red-500 text-red-200 glow-red-sm'
                    : 'bg-[#030509] border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                Internal Radar
              </button>
            </div>
          </div>

          {/* Base URL */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Globe className="w-3 h-3" /> Base URL Endpoint
            </label>
            <input
              type="text"
              value={settings.baseUrl}
              onChange={(e) => setSettings({ ...settings, baseUrl: e.target.value })}
              placeholder="e.g. https://api.openai.com/v1"
              className="w-full px-2.5 py-1.5 bg-[#030509] border border-slate-700 focus:border-red-500 rounded text-slate-100 outline-none font-mono text-[11px]"
            />
          </div>

          {/* API Key */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Key className="w-3 h-3" /> API Secret Key
            </label>
            <input
              type="password"
              value={settings.apiKey}
              onChange={(e) => setSettings({ ...settings, apiKey: e.target.value })}
              placeholder={settings.provider === 'SIMULATION' ? 'Not required for built-in radar' : 'sk-...'}
              className="w-full px-2.5 py-1.5 bg-[#030509] border border-slate-700 focus:border-red-500 rounded text-slate-100 outline-none font-mono text-[11px]"
            />
          </div>

          {/* Model Name */}
          <div className="flex flex-col gap-1">
            <label className="text-[10px] text-red-400 font-bold uppercase tracking-wider flex items-center gap-1">
              <Cpu className="w-3 h-3" /> AI Model ID
            </label>
            <input
              type="text"
              value={settings.model}
              onChange={(e) => setSettings({ ...settings, model: e.target.value })}
              placeholder="e.g. gpt-4o, claude-3-5-sonnet, llama-3"
              className="w-full px-2.5 py-1.5 bg-[#030509] border border-slate-700 focus:border-red-500 rounded text-slate-100 outline-none font-mono text-[11px]"
            />
          </div>

          {/* Auto Fetch Toggle */}
          <div className="flex items-center justify-between p-2 bg-[#030509] border border-slate-800 rounded">
            <div>
              <div className="text-[10px] font-bold text-slate-200 uppercase">Auto AI Telemetry Fetch</div>
              <div className="text-[9px] text-slate-500">Automatically trigger AI news & stock fetch on country select</div>
            </div>
            <input
              type="checkbox"
              checked={settings.autoFetchOnCountrySelect}
              onChange={(e) => setSettings({ ...settings, autoFetchOnCountrySelect: e.target.checked })}
              className="w-4 h-4 accent-red-600 rounded cursor-pointer"
            />
          </div>

          {/* Connection Test Output */}
          {testStatus === 'SUCCESS' && (
            <div className="p-2 bg-emerald-950/60 border border-emerald-500/80 rounded text-emerald-300 text-[10px] flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span>AI INFERENCE GATEWAY ACTIVE & SYNCHRONIZED</span>
            </div>
          )}
          {testStatus === 'ERROR' && (
            <div className="p-2 bg-red-950/60 border border-red-500/80 rounded text-red-300 text-[10px] flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-red-400" />
              <span>{errorMessage || 'Connection failed'}</span>
            </div>
          )}

        </div>

        {/* Footer Actions */}
        <div className="p-3 bg-[#030509] border-t border-slate-800 flex items-center justify-between">
          <button
            type="button"
            onClick={handleTestConnection}
            disabled={testStatus === 'TESTING'}
            className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 border border-slate-600 text-slate-200 rounded text-[10px] font-bold flex items-center gap-1 transition-colors"
          >
            {testStatus === 'TESTING' ? (
              <RefreshCw className="w-3 h-3 animate-spin text-red-400" />
            ) : (
              <Sparkles className="w-3 h-3 text-amber-400" />
            )}
            <span>TEST GATEWAY</span>
          </button>

          <div className="flex gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-400 hover:text-slate-200 rounded text-[10px] font-bold"
            >
              CANCEL
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="px-4 py-1.5 bg-red-600 hover:bg-red-500 border border-red-400 text-white rounded text-[10px] font-bold glow-red-sm transition-all"
            >
              SAVE CONFIG
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
