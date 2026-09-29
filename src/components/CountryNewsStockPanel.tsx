import React, { useState, useEffect } from 'react';
import { CountryTelemetry } from '../data/countriesData';
import { CountryNewsAndStocks, NewsItem, StockItem, getCountryNewsAndStocks } from '../data/countryNewsAndStocks';
import { fetchAiCountryNewsAndStocks } from '../data/aiInferenceEngine';
import { getAiSettings } from '../data/aiSettings';
import { MatrixGlyphStream } from './MatrixGlyphStream';
import { hudAudio } from './AudioSynth';
import { Newspaper, TrendingUp, TrendingDown, Sparkles, RefreshCw, Sliders, Zap, CheckCircle2 } from 'lucide-react';

interface CountryNewsStockPanelProps {
  activeCountry: CountryTelemetry;
  onOpenSettings?: () => void;
}

export const CountryNewsStockPanel: React.FC<CountryNewsStockPanelProps> = ({ activeCountry, onOpenSettings }) => {
  const [activeTab, setActiveTab] = useState<'NEWS' | 'STOCKS'>('NEWS');
  const [stockView, setStockView] = useState<'GAINERS' | 'LOSERS' | 'BOTH'>('BOTH');
  
  // Telemetry data state
  const [telemetryData, setTelemetryData] = useState<CountryNewsAndStocks>(() =>
    getCountryNewsAndStocks(activeCountry.id, activeCountry.name)
  );
  
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [isAiFetched, setIsAiFetched] = useState(false);
  
  // Custom HUD Theme Slider State (Controls Risk Filter / Auto-Refresh Speed)
  const [refreshInterval, setRefreshInterval] = useState<number>(30); // 30s default
  const [showSlider, setShowSlider] = useState(false);

  // Update telemetry when active country changes
  useEffect(() => {
    const settings = getAiSettings();
    if (settings.autoFetchOnCountrySelect) {
      handleAiFetch();
    } else {
      setTelemetryData(getCountryNewsAndStocks(activeCountry.id, activeCountry.name));
      setIsAiFetched(false);
    }
  }, [activeCountry.id, activeCountry.name]);

  // AI Live Synchronize Fetch Trigger
  const handleAiFetch = async () => {
    hudAudio.playBeep(1400, 'sine', 0.05);
    setIsAiLoading(true);
    try {
      const settings = getAiSettings();
      const freshData = await fetchAiCountryNewsAndStocks(activeCountry.id, activeCountry.name, settings);
      setTelemetryData(freshData);
      setIsAiFetched(true);
      hudAudio.playBeep(1800, 'sine', 0.06);
    } catch (err) {
      console.error('AI Fetch failed:', err);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleTabChange = (tab: 'NEWS' | 'STOCKS') => {
    hudAudio.playBeep(1200, 'sine', 0.04);
    setActiveTab(tab);
  };

  return (
    <div className="p-2.5 bg-[#06080d]/90 border border-slate-800/80 rounded-sm flex flex-col gap-2 min-h-[220px] select-none font-mono-tech relative overflow-hidden shadow-lg">
      
      {/* Top Bar: Tabs + Country Badge + AI Single-Click Gateway Trigger */}
      <div className="flex flex-wrap items-center justify-between gap-1.5 pb-2 border-b border-slate-800">
        
        {/* Left: Tab Switchers */}
        <div className="flex items-center gap-1">
          <button
            onClick={() => handleTabChange('NEWS')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
              activeTab === 'NEWS'
                ? 'bg-red-600/90 text-white border border-red-400 glow-red-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <Newspaper className="w-3 h-3 text-red-300" />
            <span>TOP 5 NEWS</span>
          </button>

          <button
            onClick={() => handleTabChange('STOCKS')}
            className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition-all ${
              activeTab === 'STOCKS'
                ? 'bg-red-600/90 text-white border border-red-400 glow-red-sm'
                : 'bg-slate-900 text-slate-400 hover:text-slate-200 border border-slate-800'
            }`}
          >
            <TrendingUp className="w-3 h-3 text-emerald-400" />
            <span>STOCKS (+5 / -5)</span>
          </button>
        </div>

        {/* Right: AI Gateway Single-Click Button & Country Badge */}
        <div className="flex items-center gap-1.5">
          {/* AI Fetch Trigger Button */}
          <button
            onClick={handleAiFetch}
            disabled={isAiLoading}
            title="Single-click AI Inference Gateway fetch for global country news & stocks"
            className={`px-2 py-1 rounded text-[9px] font-bold flex items-center gap-1 border transition-all ${
              isAiLoading
                ? 'bg-amber-950/80 border-amber-500 text-amber-300'
                : isAiFetched
                ? 'bg-emerald-950/70 border-emerald-500 text-emerald-300'
                : 'bg-red-950/70 border-red-500 hover:bg-red-900 text-red-200 glow-red-sm'
            }`}
          >
            {isAiLoading ? (
              <RefreshCw className="w-3 h-3 animate-spin text-amber-400" />
            ) : isAiFetched ? (
              <CheckCircle2 className="w-3 h-3 text-emerald-400" />
            ) : (
              <Sparkles className="w-3 h-3 text-amber-300 animate-pulse" />
            )}
            <span>{isAiLoading ? 'AI FETCHING...' : isAiFetched ? 'AI SYNCHRONIZED' : 'AI LIVE FETCH'}</span>
          </button>

          {/* Theme Slider Toggle Button */}
          <button
            onClick={() => setShowSlider(!showSlider)}
            className={`p-1 rounded border text-[9px] transition-colors ${
              showSlider ? 'bg-slate-800 border-red-500 text-red-400' : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-slate-200'
            }`}
            title="Toggle Theme Range Slider"
          >
            <Sliders className="w-3 h-3" />
          </button>

          {/* Selected Country Badge */}
          <span className="text-[9px] text-red-400 font-bold font-orbitron bg-red-950/40 px-1.5 py-0.5 rounded border border-red-500/40">
            [{activeCountry.code}] {activeCountry.name.toUpperCase()}
          </span>
        </div>
      </div>

      {/* Theme Range Slider Control Bar (matching the HUD Theme) */}
      {showSlider && (
        <div className="p-1.5 bg-[#030509] border border-slate-800 rounded flex items-center justify-between gap-3 text-[9px] text-slate-300 animate-fade-in">
          <div className="flex items-center gap-1.5 text-red-400 font-bold">
            <Zap className="w-3 h-3" />
            <span>TELEMETRY CYCLE: {refreshInterval}s</span>
          </div>
          <div className="flex-1 max-w-[180px] flex items-center gap-2">
            <span className="text-slate-500 text-[8px]">10s</span>
            <input
              type="range"
              min="10"
              max="120"
              step="5"
              value={refreshInterval}
              onChange={(e) => setRefreshInterval(Number(e.target.value))}
              className="hud-slider w-full cursor-pointer"
            />
            <span className="text-slate-500 text-[8px]">120s</span>
          </div>
        </div>
      )}

      {/* Main Content Split Area: Left = News / Stocks, Right = Shifted Glitch Stream */}
      <div className="flex items-stretch justify-between gap-2 flex-1">
        
        {/* ================= LEFT CONTENT ================= */}
        <div className="flex-1 flex flex-col justify-between overflow-hidden pr-1">
          {activeTab === 'NEWS' ? (
            /* ================= TOP 5 NEWS HEADLINES ================= */
            <div className="flex flex-col gap-1.5 overflow-y-auto max-h-[180px] scrollbar-thin pr-1">
              {telemetryData.news.slice(0, 5).map((item: NewsItem, index: number) => (
                <div
                  key={item.id || index}
                  className="p-1.5 bg-[#040508] border border-slate-800/80 hover:border-red-500/60 rounded flex flex-col gap-0.5 group transition-colors"
                >
                  {/* News Source & Meta Badge */}
                  <div className="flex items-center justify-between text-[8.5px]">
                    <div className="flex items-center gap-1">
                      <span className="text-red-400 font-bold">#{index + 1}</span>
                      <span className="text-slate-300 font-bold bg-slate-900 px-1 rounded border border-slate-800">
                        {item.source}
                      </span>
                      <span className="text-slate-500">{item.timeAgo}</span>
                    </div>

                    <span className={`text-[8px] px-1 rounded font-bold ${
                      item.impact === 'HIGH' ? 'text-red-400 bg-red-950/60 border border-red-500/50' : 'text-slate-400 bg-slate-900'
                    }`}>
                      {item.category}
                    </span>
                  </div>

                  {/* Headline Text */}
                  <div className="text-[9.5px] text-slate-200 group-hover:text-red-300 font-sans leading-tight line-clamp-2">
                    {item.headline}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            /* ================= TOP 5 STOCKS (GAINERS & LOSERS) ================= */
            <div className="flex flex-col gap-1.5 max-h-[180px] overflow-y-auto scrollbar-thin pr-1">
              
              {/* Stock Selector Sub-bar */}
              <div className="flex items-center justify-between text-[8.5px] border-b border-slate-800 pb-1">
                <span className="text-slate-400 font-bold flex items-center gap-1">
                  <Zap className="w-2.5 h-2.5 text-amber-400" />
                  {activeCountry.name} MARKET TELEMETRY
                </span>

                <div className="flex gap-1">
                  <button
                    onClick={() => setStockView('BOTH')}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      stockView === 'BOTH' ? 'bg-slate-700 text-white' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    ALL (10)
                  </button>
                  <button
                    onClick={() => setStockView('GAINERS')}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      stockView === 'GAINERS' ? 'bg-emerald-950 text-emerald-300 border border-emerald-500/50' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    TOP +5
                  </button>
                  <button
                    onClick={() => setStockView('LOSERS')}
                    className={`px-1.5 py-0.5 rounded text-[8px] font-bold ${
                      stockView === 'LOSERS' ? 'bg-red-950 text-red-300 border border-red-500/50' : 'text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    TOP -5
                  </button>
                </div>
              </div>

              {/* Stock Lists */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                {/* TOP 5 GROWING STOCKS (+5) */}
                {(stockView === 'BOTH' || stockView === 'GAINERS') && (
                  <div className="flex flex-col gap-1">
                    <div className="text-[8.5px] font-bold text-emerald-400 flex items-center gap-1 border-b border-emerald-500/30 pb-0.5">
                      <TrendingUp className="w-2.5 h-2.5" /> TOP 5 GAINERS (+5)
                    </div>
                    {telemetryData.gainers.slice(0, 5).map((stock: StockItem, i: number) => (
                      <div key={stock.ticker || i} className="flex items-center justify-between p-1 bg-[#040806] border border-emerald-900/50 rounded text-[8.5px]">
                        <div>
                          <div className="font-bold text-slate-200">{stock.ticker}</div>
                          <div className="text-[7.5px] text-slate-400 truncate max-w-[70px]">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-300">{stock.price}</div>
                          <div className="text-emerald-400 font-bold">+{stock.changePercent}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                {/* BOTTOM 5 DECLINING STOCKS (-5) */}
                {(stockView === 'BOTH' || stockView === 'LOSERS') && (
                  <div className="flex flex-col gap-1">
                    <div className="text-[8.5px] font-bold text-red-400 flex items-center gap-1 border-b border-red-500/30 pb-0.5">
                      <TrendingDown className="w-2.5 h-2.5" /> BOTTOM 5 LOSERS (-5)
                    </div>
                    {telemetryData.losers.slice(0, 5).map((stock: StockItem, i: number) => (
                      <div key={stock.ticker || i} className="flex items-center justify-between p-1 bg-[#080405] border border-red-900/50 rounded text-[8.5px]">
                        <div>
                          <div className="font-bold text-slate-200">{stock.ticker}</div>
                          <div className="text-[7.5px] text-slate-400 truncate max-w-[70px]">{stock.name}</div>
                        </div>
                        <div className="text-right">
                          <div className="text-slate-300">{stock.price}</div>
                          <div className="text-red-400 font-bold">{stock.changePercent}%</div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

            </div>
          )}
        </div>

        {/* ================= RIGHT SIDE: SHIFTED MATRIX GLITCH UI STREAM ================= */}
        <div className="w-[72px] sm:w-[84px] border-l border-slate-800/80 pl-1.5 flex flex-col justify-center items-center overflow-hidden bg-[#040508]/60 rounded-r">
          <div className="text-[8px] text-slate-500 font-bold mb-1 tracking-widest text-center uppercase">
            GLITCH_STREAM
          </div>
          <MatrixGlyphStream rows={9} cols={4} speed={100} />
        </div>

      </div>
    </div>
  );
};
