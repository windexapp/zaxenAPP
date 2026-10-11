import React from 'react';
import { Zap, Sparkles, Maximize2, Cpu, Flame, Layers } from 'lucide-react';
import { SystemMetrics } from '../../types';
import { THEMES } from '../../services/themeHelper';

interface CompactHudOverlayProps {
  metrics: SystemMetrics;
  accentColor: string;
  onRestore: () => void;
  onQuickCleanRam: () => void;
}

export const CompactHudOverlay: React.FC<CompactHudOverlayProps> = ({
  metrics,
  accentColor,
  onRestore,
  onQuickCleanRam,
}) => {
  const theme = THEMES[accentColor as keyof typeof THEMES] || THEMES.red;

  return (
    <div className="fixed bottom-6 right-6 z-50 w-80 bg-[#08090e]/90 border border-white/15 rounded-2xl shadow-[0_0_35px_rgba(0,0,0,0.8)] backdrop-blur-xl p-4 select-none animate-in fade-in slide-in-from-bottom-5">
      {/* HUD Header */}
      <div className="flex items-center justify-between pb-3 border-b border-white/10">
        <div className="flex items-center gap-2">
          <div 
            className="w-5 h-5 rounded flex items-center justify-center text-white text-[10px] font-black shadow-md"
            style={{ backgroundColor: theme.primaryHex }}
          >
            Z
          </div>
          <span className="font-bold text-xs tracking-wider text-white">
            ZAXEN<span style={{ color: theme.primaryHex }}>HUD</span>
          </span>
          <span className="text-[10px] text-emerald-400 font-mono">CANLI</span>
        </div>

        <button
          onClick={onRestore}
          title="Tam Boyuta Dön"
          className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors flex items-center gap-1 text-[11px]"
        >
          <Maximize2 className="w-3.5 h-3.5" />
          <span className="text-[10px]">Genişlet</span>
        </button>
      </div>

      {/* Live Compact Metrics Strip */}
      <div className="grid grid-cols-3 gap-2 py-3 text-center">
        {/* CPU */}
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <Cpu className="w-3 h-3 text-blue-400" />
            <span>CPU</span>
          </div>
          <div className="text-sm font-black font-mono text-white mt-0.5">
            %{metrics.cpu.usagePercent}
          </div>
          <div className="text-[10px] font-mono text-amber-400 flex items-center justify-center gap-0.5">
            <Flame className="w-2.5 h-2.5" />
            <span>{metrics.cpu.temperatureC}°C</span>
          </div>
        </div>

        {/* GPU */}
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <Layers className="w-3 h-3 text-emerald-400" />
            <span>GPU</span>
          </div>
          <div className="text-sm font-black font-mono text-white mt-0.5">
            %{metrics.gpu.usagePercent}
          </div>
          <div className="text-[10px] font-mono text-amber-400 flex items-center justify-center gap-0.5">
            <Flame className="w-2.5 h-2.5" />
            <span>{metrics.gpu.temperatureC}°C</span>
          </div>
        </div>

        {/* RAM */}
        <div className="p-2 rounded-xl bg-white/[0.03] border border-white/[0.06]">
          <div className="flex items-center justify-center gap-1 text-[10px] text-slate-400">
            <Sparkles className="w-3 h-3" style={{ color: theme.primaryHex }} />
            <span>RAM</span>
          </div>
          <div className="text-sm font-black font-mono text-white mt-0.5">
            %{metrics.ram.usagePercent}
          </div>
          <div className="text-[10px] font-mono text-slate-400">
            {metrics.ram.usedGB} GB
          </div>
        </div>
      </div>

      {/* Quick RAM Clean button in HUD */}
      <button
        onClick={onQuickCleanRam}
        className="w-full py-2 rounded-xl text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg transition-all transform active:scale-95"
        style={{
          background: `linear-gradient(to right, ${theme.primaryHex}, #9f1239)`,
        }}
      >
        <Sparkles className="w-3.5 h-3.5" />
        <span>HIZLI RAM BOŞALT</span>
      </button>
    </div>
  );
};
