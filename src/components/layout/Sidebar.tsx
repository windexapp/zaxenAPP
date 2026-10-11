import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  Search, 
  Zap, 
  Gamepad2, 
  LineChart, 
  Wrench, 
  RotateCcw, 
  Settings, 
  KeyRound, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Crown,
  Flame,
  Shield,
  Cpu,
  Target,
  MessageSquare,
  Lock,
  ExternalLink
} from 'lucide-react';
import { TabType, LicenseState, AccentColor, AppBranding } from '../../types';
import { THEMES } from '../../services/themeHelper';
import { brandingService } from '../../services/brandingService';

interface SidebarProps {
  currentTab: TabType;
  onSelectTab: (tab: TabType) => void;
  license: LicenseState;
  onOpenLicenseModal: () => void;
  onOpenAdminModal?: () => void;
  accentColor?: AccentColor;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  license,
  onOpenLicenseModal,
  onOpenAdminModal,
  accentColor = 'red',
}) => {
  const theme = THEMES[accentColor] || THEMES.red;
  const [branding, setBranding] = useState<AppBranding>(() => brandingService.getBranding());

  useEffect(() => {
    const unsub = brandingService.subscribe(newB => {
      setBranding(newB);
    });
    return unsub;
  }, []);

  const renderBrandIcon = () => {
    switch (branding.logoIcon) {
      case 'crown': return <Crown className="w-5 h-5 text-amber-300" />;
      case 'flame': return <Flame className="w-5 h-5 text-rose-400" />;
      case 'shield': return <Shield className="w-5 h-5 text-blue-400" />;
      case 'cpu': return <Cpu className="w-5 h-5 text-emerald-400" />;
      case 'target': return <Target className="w-5 h-5 text-red-400" />;
      case 'gamepad': return <Gamepad2 className="w-5 h-5 text-purple-400" />;
      case 'zap':
      default:
        return <Zap className="w-5 h-5 text-white fill-white" />;
    }
  };

  const navItems: { id: TabType; label: string; icon: React.ReactNode; badge?: string; isGreen?: boolean }[] = [
    { id: 'dashboard', label: 'Dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
    { id: 'analysis', label: 'Analiz', icon: <Search className="w-4 h-4" />, badge: 'Tara' },
    { id: 'boost', label: 'Boost', icon: <Zap className="w-4 h-4" /> },
    { 
      id: 'nvidia', 
      label: 'NVIDIA Renk & Ayar', 
      isGreen: true,
      icon: (
        <svg viewBox="0 0 100 80" className="w-4 h-4 fill-[#76B900]">
          <path d="M50 0C25 0 5 15 0 35c7-12 25-20 50-20s43 8 50 20c-5-20-25-35-50-35zm0 25c-20 0-35 10-38 22 5-7 18-12 38-12s33 5 38 12c-3-12-18-22-38-22zm0 20c-12 0-22 5-24 12 3-4 10-7 24-7s21 3 24 7c-2-7-12-12-24-12z"/>
        </svg>
      ), 
      badge: 'GeForce' 
    },
    { id: 'games', label: 'Oyunlar (Steam)', icon: <Gamepad2 className="w-4 h-4" /> },
    { id: 'fps', label: 'FPS Testi', icon: <LineChart className="w-4 h-4" /> },
    { id: 'tools', label: 'Araçlar & Espor', icon: <Wrench className="w-4 h-4" />, badge: 'Espor' },
    { id: 'backups', label: 'Geçmiş & Yedek', icon: <RotateCcw className="w-4 h-4" /> },
    { id: 'settings', label: 'Ayarlar', icon: <Settings className="w-4 h-4" /> },
  ];

  const isVipTier = license.tier === 'ultimate' || license.isOwnerMasterMode;

  return (
    <aside className="w-64 bg-[#0a0c12]/80 border-r border-white/[0.08] flex flex-col justify-between shrink-0 select-none backdrop-blur-2xl z-20">
      {/* Brand Header */}
      <div className="overflow-y-auto">
        <div className="p-4 border-b border-white/[0.08] flex items-center gap-3">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center shadow-lg transition-colors border border-white/20 shrink-0"
            style={{ 
              backgroundColor: theme.primaryHex,
              boxShadow: `0 0 20px ${theme.glowHex}`
            }}
          >
            {renderBrandIcon()}
          </div>
          <div className="min-w-0 flex-1 overflow-hidden">
            <div className="flex items-baseline gap-1 font-display tracking-wider whitespace-nowrap">
              <span className="font-black text-base text-white tracking-wide">{branding.brandName}</span>
              <span 
                className="font-black text-base tracking-wide transition-colors drop-shadow-[0_0_10px_rgba(225,29,72,0.7)]" 
                style={{ color: theme.primaryHex }}
              >
                {branding.brandSuffix}
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono tracking-tight uppercase truncate">
              {branding.slogan}
            </div>
          </div>
        </div>

        {/* Navigation list */}
        <nav className="p-2 space-y-1">
          {navItems.map(item => {
            const isActive = currentTab === item.id;
            const itemColor = item.isGreen ? '#76B900' : theme.primaryHex;

            return (
              <button
                key={item.id}
                onClick={() => onSelectTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2 rounded-xl text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-white/[0.1] text-white shadow-md border-t border-white/[0.15]'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-white/[0.04]'
                }`}
                style={isActive ? { borderLeft: `3px solid ${itemColor}` } : {}}
              >
                <div className="flex items-center gap-3">
                  <span 
                    className="transition-colors"
                    style={{ color: isActive ? itemColor : undefined }}
                  >
                    {item.icon}
                  </span>
                  <span className="font-display tracking-wide">{item.label}</span>
                </div>
                {item.badge && (
                  <span 
                    className="text-[10px] font-mono px-1.5 py-0.5 rounded border"
                    style={{
                      backgroundColor: item.isGreen ? 'rgba(118,185,0,0.15)' : `${theme.glowHex}`,
                      color: item.isGreen ? '#76B900' : theme.primaryHex,
                      borderColor: item.isGreen ? 'rgba(118,185,0,0.3)' : `${theme.primaryHex}40`
                    }}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Section: Support & License Card */}
      <div className="p-3 border-t border-white/[0.08] space-y-2.5">
        {/* Support Buttons: WhatsApp & Discord */}
        <div className="grid grid-cols-2 gap-1.5">
          <a
            href={`https://wa.me/${branding.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(branding.whatsappMessage)}`}
            target="_blank"
            rel="noreferrer"
            className="py-1.5 px-2 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
            title="WhatsApp Destek Hattı"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
            <span>WhatsApp</span>
          </a>

          <a
            href={branding.discordUrl}
            target="_blank"
            rel="noreferrer"
            className="py-1.5 px-2 rounded-xl bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-400 border border-indigo-500/30 text-[10px] font-bold flex items-center justify-center gap-1 transition-colors"
            title="Discord Destek & Topluluk"
          >
            <span className="w-1.5 h-1.5 rounded-full bg-indigo-400"></span>
            <span>Discord</span>
          </a>
        </div>

        {/* License State Card */}
        <div className="p-3 rounded-2xl bg-white/[0.04] border border-white/[0.08] text-xs backdrop-blur-xl space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5">
              {isVipTier ? (
                <Crown className="w-3.5 h-3.5 text-amber-400" />
              ) : (
                <KeyRound className="w-3.5 h-3.5" style={{ color: theme.primaryHex }} />
              )}
              <span className="font-bold text-white text-[11px] truncate max-w-[110px]">
                {license.tierLabel || 'Ücretsiz'}
              </span>
            </div>

            {license.isLicensed && !license.isExpired ? (
              <span className={`flex items-center gap-1 text-[10px] font-mono font-bold ${
                isVipTier ? 'text-amber-400' : 'text-emerald-400'
              }`}>
                <CheckCircle2 className="w-3 h-3" />
                <span>{isVipTier ? 'VIP' : 'AKTİF'}</span>
              </span>
            ) : (
              <span className="flex items-center gap-1 text-[10px] font-mono text-amber-400">
                <AlertTriangle className="w-3 h-3" />
                <span>KISITLI</span>
              </span>
            )}
          </div>

          <div className="text-[11px] text-slate-400 flex items-center gap-1.5 font-mono">
            <Clock className="w-3 h-3 text-slate-500 shrink-0" />
            {license.isLicensed && !license.isExpired ? (
              license.licenseType === 'lifetime' || license.isOwnerMasterMode ? (
                <span className="truncate">Sınırsız (Lifetime)</span>
              ) : (
                <span className="truncate">{license.remainingHours}s {license.remainingMinutes}dk kaldı</span>
              )
            ) : (
              <span className="truncate">Deneme Kodu: zaxen1</span>
            )}
          </div>

          <button
            onClick={onOpenLicenseModal}
            className="w-full py-1.5 px-2 text-white border rounded-xl text-[11px] font-semibold transition-all shadow-sm"
            style={{
              backgroundColor: `${theme.glowHex}`,
              borderColor: `${theme.primaryHex}60`
            }}
          >
            {license.isLicensed && !license.isExpired ? 'Paket & Lisans Yönetimi' : 'Key Gir / Deneme Başlat'}
          </button>
        </div>

        {/* Discreet Admin Login Link Button */}
        {onOpenAdminModal && (
          <button
            onClick={onOpenAdminModal}
            className="w-full py-1 text-[10px] font-mono text-slate-500 hover:text-amber-400 flex items-center justify-center gap-1.5 transition-colors"
          >
            <Lock className="w-3 h-3" />
            <span>Admin Girişi (zaxen001)</span>
          </button>
        )}
      </div>
    </aside>
  );
};
