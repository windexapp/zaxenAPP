import React, { useState, useEffect } from 'react';
import { Minus, Square, X, ShieldCheck, Zap, Minimize2, Lock } from 'lucide-react';
import { THEMES } from '../../services/themeHelper';
import { brandingService } from '../../services/brandingService';
import { AccentColor, AppBranding } from '../../types';

interface TitleBarProps {
  onQuickBoost?: () => void;
  isOptimized?: boolean;
  accentColor?: AccentColor;
  onToggleHudMode?: () => void;
  onOpenAdminModal?: () => void;
}

export const TitleBar: React.FC<TitleBarProps> = ({ 
  isOptimized, 
  accentColor = 'red',
  onToggleHudMode,
  onOpenAdminModal
}) => {
  const [isMaximized, setIsMaximized] = useState(false);
  const theme = THEMES[accentColor] || THEMES.red;
  const [branding, setBranding] = useState<AppBranding>(() => brandingService.getBranding());

  useEffect(() => {
    const unsub = brandingService.subscribe(newB => {
      setBranding(newB);
    });
    return unsub;
  }, []);

  return (
    <header className="h-9 bg-[#07080c]/90 border-b border-white/[0.08] flex items-center justify-between px-3 select-none text-xs text-[#8f9cae] z-40 backdrop-blur-md">
      {/* Brand Zone */}
      <div className="flex items-center gap-2 shrink-0 min-w-0">
        <div 
          className="w-4 h-4 rounded flex items-center justify-center text-white font-black text-[9px] shadow-md transition-colors shrink-0"
          style={{ backgroundColor: theme.primaryHex }}
        >
          {branding.brandName.slice(0, 1)}
        </div>
        <span className="font-bold tracking-wider text-slate-200 whitespace-nowrap">
          {branding.brandName}<span style={{ color: theme.primaryHex }}>{branding.brandSuffix}</span>
        </span>
        <span className="hidden sm:inline text-[10px] text-slate-500 font-mono ml-1 shrink-0">v1.4.0 ESPORTS</span>
      </div>

      {/* Middle Status Info / Announcement */}
      <div className="hidden sm:flex items-center gap-3 text-[11px] truncate max-w-xl">
        <div className="flex items-center gap-1.5 text-slate-400 shrink-0">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>HWID Kilidi: <strong className="text-emerald-400 font-medium">Aktif</strong></span>
        </div>
        <span className="text-slate-600">|</span>
        <div className="flex items-center gap-1.5 text-slate-300 truncate">
          <Zap 
            className="w-3.5 h-3.5 shrink-0 transition-colors" 
            style={{ color: isOptimized ? theme.primaryHex : '#64748b' }} 
          />
          <span className="truncate">{branding.announcementText}</span>
        </div>
      </div>

      {/* Window Controls + Admin + Mini HUD Button */}
      <div className="flex items-center gap-1.5 -mr-1">
        {onOpenAdminModal && (
          <button
            onClick={onOpenAdminModal}
            title="Yönetici Paneli (zaxen001)"
            className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/15 hover:bg-amber-500/25 text-amber-300 border border-amber-500/30 transition-colors mr-1 shadow-sm"
          >
            <Lock className="w-3 h-3 text-amber-400" />
            <span className="hidden md:inline">Admin</span>
          </button>
        )}

        {onToggleHudMode && (
          <button
            onClick={onToggleHudMode}
            title="Kompakt Mini HUD Moduna Geç"
            className="hidden md:flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-semibold bg-white/[0.04] hover:bg-white/[0.1] text-slate-300 hover:text-white border border-white/[0.08] transition-colors mr-1"
          >
            <Minimize2 className="w-3 h-3" style={{ color: theme.primaryHex }} />
            <span>Mini HUD</span>
          </button>
        )}

        <button 
          title="Simge durumuna küçült" 
          className="w-8 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <Minus className="w-3.5 h-3.5" />
        </button>
        <button 
          title={isMaximized ? "Önceki Boyut" : "Ekranı Kapla"} 
          onClick={() => setIsMaximized(!isMaximized)}
          className="w-8 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 rounded transition-colors"
        >
          <Square className="w-3.5 h-3.5" />
        </button>
        <button 
          title="Kapat" 
          className="w-8 h-7 flex items-center justify-center text-slate-400 hover:text-white hover:bg-rose-600 rounded transition-colors"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>
    </header>
  );
};
