import React, { useState } from 'react';
import { 
  Zap, 
  HelpCircle, 
  CheckCircle2, 
  ShieldCheck, 
  X, 
  Check, 
  RotateCcw, 
  Lock, 
  Sparkles, 
  Crown,
  Layers,
  ArrowRight,
  ShieldAlert
} from 'lucide-react';
import { OptimizationItem, LicenseState, AccentColor } from '../../types';
import { OptimizerService } from '../../services/optimizerService';
import { THEMES } from '../../services/themeHelper';
import { soundFx } from '../../services/soundFxService';
import { checkOptimizationItemAccess, checkFeatureAccess } from '../../services/licensingService';

interface BoostViewProps {
  license: LicenseState;
  onOpenLicenseModal: () => void;
  onNavigateTab: (tab: any) => void;
  accentColor?: AccentColor;
}

export const BoostView: React.FC<BoostViewProps> = ({
  license,
  onOpenLicenseModal,
  onNavigateTab,
  accentColor = 'red',
}) => {
  const optimizerService = OptimizerService.getInstance();
  const theme = THEMES[accentColor] || THEMES.red;

  const [items, setItems] = useState<OptimizationItem[]>(optimizerService.getOptimizations());
  const [activeInfoModal, setActiveInfoModal] = useState<OptimizationItem | null>(null);
  const [lockedFeatureModal, setLockedFeatureModal] = useState<{
    item: OptimizationItem;
    requiredTierLabel: string;
  } | null>(null);

  const [isApplying, setIsApplying] = useState(false);
  const [reportData, setReportData] = useState<{
    appliedCount: number;
    lockedCount: number;
    backupId: string;
    message: string;
  } | null>(null);

  const boostAccess = checkFeatureAccess('boost', license);
  const isOwner = license.isOwnerMasterMode;

  const handleToggle = (item: OptimizationItem) => {
    soundFx.playClickSound();

    // Check if item is locked for customer tier
    const access = checkOptimizationItemAccess(item, license);
    if (!access.allowed && !isOwner) {
      setLockedFeatureModal({
        item,
        requiredTierLabel: access.requiredTierLabel,
      });
      return;
    }

    optimizerService.toggleItem(item.id);
    setItems(optimizerService.getOptimizations());
  };

  const handleApplySelected = async () => {
    if (!boostAccess.allowed && !isOwner) {
      soundFx.playClickSound();
      onOpenLicenseModal();
      return;
    }

    soundFx.playBoostSound();
    setIsApplying(true);
    try {
      await new Promise(r => setTimeout(r, 1200));

      // Calculate allowed items for this customer tier
      const allowedIds = items
        .filter(i => isOwner || checkOptimizationItemAccess(i, license).allowed)
        .map(i => i.id);

      const res = await optimizerService.applySelected(allowedIds);
      soundFx.playCleanSound();
      setItems(optimizerService.getOptimizations());

      const selectedTotal = items.filter(i => i.enabled).length;
      const lockedCount = selectedTotal - res.appliedCount;

      let msg = `${res.appliedCount} adet optimizasyon başarıyla Windows sisteminize uygulandı.`;
      if (lockedCount > 0 && !isOwner) {
        msg += ` (${lockedCount} adet gelişmiş ayar paketinizde kilitli olduğu için atlandı).`;
      }

      setReportData({
        appliedCount: res.appliedCount,
        lockedCount,
        backupId: res.backupId,
        message: msg,
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleApplyAll = async () => {
    if (!boostAccess.allowed && !isOwner) {
      soundFx.playClickSound();
      onOpenLicenseModal();
      return;
    }

    soundFx.playBoostSound();
    setIsApplying(true);
    try {
      await new Promise(r => setTimeout(r, 1400));

      const allowedIds = items
        .filter(i => isOwner || checkOptimizationItemAccess(i, license).allowed)
        .map(i => i.id);

      const res = await optimizerService.applyAll(allowedIds);
      soundFx.playCleanSound();
      setItems(optimizerService.getOptimizations());

      const lockedCount = items.length - res.appliedCount;
      let msg = isOwner 
        ? `Tüm sistem ve oyun profilleri (${res.appliedCount} ayar) Sahip Yetkisiyle devreye alındı!` 
        : `Paketiniz dahilindeki ${res.appliedCount} ayar başarıyla devreye alındı!`;
      
      if (lockedCount > 0 && !isOwner) {
        msg += ` (${lockedCount} adet üst paket ayarı atlandı).`;
      }

      setReportData({
        appliedCount: res.appliedCount,
        lockedCount,
        backupId: res.backupId,
        message: msg,
      });
    } finally {
      setIsApplying(false);
    }
  };

  const handleRevertAll = async () => {
    soundFx.playClickSound();
    await optimizerService.revertAll();
    setItems(optimizerService.getOptimizations());
    setReportData({
      appliedCount: 0,
      lockedCount: 0,
      backupId: '',
      message: 'Uygulanan tüm optimizasyonlar geri alındı, Windows orijinal varsayılan durumuna getirildi.',
    });
  };

  const selectedCount = items.filter(i => i.enabled).length;

  return (
    <div className="space-y-6 pb-6 select-none">
      {/* Top Header Card */}
      <div className="glass-panel rounded-2xl p-5 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span 
              className="text-[10px] font-mono px-2.5 py-0.5 rounded-full border font-bold uppercase tracking-wider"
              style={{
                backgroundColor: theme.glowHex,
                color: theme.primaryHex,
                borderColor: `${theme.primaryHex}40`
              }}
            >
              Optimizasyon Modülü
            </span>

            {/* Current Tier Pill */}
            <span className={`text-[11px] font-mono font-bold px-2.5 py-0.5 rounded-full border flex items-center gap-1.5 ${
              isOwner ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
              license.tier === 'ultimate' ? 'bg-amber-500/20 text-amber-300 border-amber-500/30' :
              license.tier === 'pro' ? 'bg-rose-500/20 text-rose-300 border-rose-500/30' :
              license.tier === 'starter' ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' :
              license.tier === 'trial' ? 'bg-blue-500/20 text-blue-300 border-blue-500/30' :
              'bg-slate-800 text-slate-300 border-white/10'
            }`}>
              {isOwner ? <Crown className="w-3.5 h-3.5 text-amber-400" /> : <Layers className="w-3.5 h-3.5" />}
              <span>{license.tierLabel}</span>
            </span>
          </div>

          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <Zap className="w-5 h-5" style={{ color: theme.primaryHex }} />
            Windows Sistem & Oyun Optimizasyon Merkezi
          </h1>
          <p className="text-xs text-slate-400">
            {isOwner 
              ? '👑 Sahip Modu devrede: Tüm optimizasyonları ve paket kısıtlamalarını serbestçe yönetebilirsiniz.'
              : 'Satın aldığınız lisans paketine göre optimizasyonları seçin; gelişmiş ayarlar için paketinizi yükseltin.'
            }
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={onOpenLicenseModal}
            className="px-3.5 py-2 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-white border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>Paketler & Key</span>
          </button>

          <button
            onClick={handleRevertAll}
            className="px-3.5 py-2 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Ayarları Geri Al</span>
          </button>
        </div>
      </div>

      {/* Free mode notice */}
      {!license.isLicensed && (
        <div className="p-4 rounded-2xl bg-amber-950/40 border border-amber-800/80 text-xs text-amber-200 flex items-center justify-between gap-3 animate-in fade-in backdrop-blur-md">
          <div className="flex items-center gap-2.5">
            <Lock className="w-4 h-4 text-amber-400 shrink-0" />
            <span>Ücretsiz sürümdesiniz. Optimizasyonları aktifleştirmek için <strong>zaxen1</strong> deneme kodunu girebilirsiniz.</span>
          </div>
          <button
            onClick={onOpenLicenseModal}
            className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-black font-bold text-xs rounded-lg transition-colors flex items-center gap-1 shrink-0"
          >
            <Sparkles className="w-3 h-3" />
            <span>Deneme Başlat (zaxen1)</span>
          </button>
        </div>
      )}

      {/* Optimization Items List */}
      <div className="space-y-3">
        {items.map(item => {
          const access = checkOptimizationItemAccess(item, license);
          const isLocked = !access.allowed && !isOwner;

          return (
            <div
              key={item.id}
              onClick={() => {
                if (isLocked) {
                  setLockedFeatureModal({
                    item,
                    requiredTierLabel: access.requiredTierLabel,
                  });
                }
              }}
              className={`p-4 rounded-2xl border transition-all flex flex-col md:flex-row items-start md:items-center justify-between gap-4 glass-panel-hover ${
                isLocked 
                  ? 'bg-[#080a10]/50 border-white/[0.04] opacity-80 cursor-pointer' 
                  : item.applied
                  ? 'bg-white/[0.08] border-white/20 shadow-[0_0_20px_rgba(255,255,255,0.03)]'
                  : item.enabled
                  ? 'glass-panel'
                  : 'bg-[#08090d]/40 border-white/[0.04] opacity-75'
              }`}
            >
              <div className="space-y-1.5 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-bold text-white font-tech">{item.name}</span>
                  
                  {/* Impact badge */}
                  <span 
                    className="text-[10px] font-mono px-2 py-0.5 rounded border"
                    style={{
                      backgroundColor: theme.glowHex,
                      color: theme.primaryHex,
                      borderColor: `${theme.primaryHex}30`
                    }}
                  >
                    {item.impact} Etki
                  </span>

                  {/* Tier lock or access badge */}
                  {isLocked ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/15 text-amber-300 border border-amber-500/30 flex items-center gap-1">
                      <Lock className="w-3 h-3 text-amber-400" />
                      <span>{access.badgeText}</span>
                    </span>
                  ) : isOwner ? (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-300 border border-amber-500/20 flex items-center gap-1">
                      <Crown className="w-3 h-3 text-amber-400" />
                      <span>SAHİP</span>
                    </span>
                  ) : item.requiredTier && item.requiredTier !== 'starter' ? (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-slate-300 border border-white/10">
                      {item.requiredTier.toUpperCase()}
                    </span>
                  ) : null}

                  {/* Applied status indicator */}
                  {item.applied && (
                    <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      Aktif
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed max-w-3xl">
                  {item.description}
                </p>
              </div>

              {/* Actions: Info button + Toggle switch */}
              <div 
                className="flex items-center gap-4 shrink-0 self-end md:self-center"
                onClick={e => e.stopPropagation()}
              >
                <button
                  onClick={() => {
                    soundFx.playClickSound();
                    setActiveInfoModal(item);
                  }}
                  className="text-xs text-slate-400 hover:text-white flex items-center gap-1 p-1 rounded-lg hover:bg-white/[0.05] transition-colors"
                  title="Bu ayar ne yapıyor?"
                >
                  <HelpCircle className="w-4 h-4" style={{ color: theme.primaryHex }} />
                  <span className="hidden sm:inline">Ne yapıyor?</span>
                </button>

                {/* Custom Toggle Switch */}
                {isLocked ? (
                  <button
                    onClick={() => {
                      soundFx.playClickSound();
                      setLockedFeatureModal({
                        item,
                        requiredTierLabel: access.requiredTierLabel,
                      });
                    }}
                    className="w-12 h-6 rounded-full bg-white/[0.06] border border-white/10 flex items-center justify-center text-slate-500 hover:text-amber-400 transition-colors"
                    title="Bu özellik için paket yükseltmesi gerekiyor"
                  >
                    <Lock className="w-3.5 h-3.5" />
                  </button>
                ) : (
                  <button
                    onClick={() => handleToggle(item)}
                    className="w-12 h-6 rounded-full transition-colors relative flex items-center p-0.5"
                    style={{
                      backgroundColor: item.enabled ? theme.primaryHex : 'rgba(255,255,255,0.1)'
                    }}
                  >
                    <div
                      className={`w-5 h-5 rounded-full bg-white shadow-md transform transition-transform ${
                        item.enabled ? 'translate-x-6' : 'translate-x-0'
                      }`}
                    ></div>
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom Sticky Action Bar */}
      <div className="glass-panel p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-2xl">
        <div className="text-xs text-slate-400">
          <span>Seçilen Optimizasyonlar: </span>
          <strong className="text-white font-mono text-sm">{selectedCount} / {items.length}</strong>
          <span className="ml-2 text-emerald-400 font-mono">· Otomatik Güvenli Yedek Hazır</span>
        </div>

        <div className="flex items-center gap-3 w-full sm:w-auto">
          <button
            onClick={handleApplySelected}
            disabled={isApplying || selectedCount === 0}
            className="flex-1 sm:flex-none px-6 py-3 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 text-xs font-bold rounded-xl transition-all"
          >
            {isApplying ? 'Uygulanıyor...' : `SEÇİLENLERİ UYGULA (${selectedCount})`}
          </button>

          <button
            onClick={handleApplyAll}
            disabled={isApplying}
            className="flex-1 sm:flex-none px-7 py-3 text-white text-xs font-extrabold tracking-wide rounded-xl shadow-lg transition-all flex items-center justify-center gap-2 transform active:scale-95"
            style={{
              backgroundColor: theme.primaryHex,
              boxShadow: `0 0 24px ${theme.glowHex}`
            }}
          >
            <Zap className="w-4 h-4 fill-white" />
            <span>HEPSİNİ UYGULA</span>
          </button>
        </div>
      </div>

      {/* Report Modal */}
      {reportData && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md glass-panel rounded-2xl shadow-2xl p-5 border border-white/15 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-emerald-400 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5" />
                <span>Optimizasyon Raporu</span>
              </div>
              <button 
                onClick={() => setReportData(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">
              {reportData.message}
            </p>

            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs space-y-1.5 font-mono">
              <div className="flex justify-between text-slate-400">
                <span>Uygulanan Ayar:</span>
                <span className="text-white font-bold">{reportData.appliedCount}</span>
              </div>
              {reportData.lockedCount > 0 && (
                <div className="flex justify-between text-amber-400">
                  <span>Pakette Kilitli Olan:</span>
                  <span className="font-bold">{reportData.lockedCount}</span>
                </div>
              )}
              {reportData.backupId && (
                <div className="flex justify-between text-slate-400 pt-1 border-t border-white/[0.06]">
                  <span>Yedek Kimliği:</span>
                  <span className="text-emerald-400">{reportData.backupId}</span>
                </div>
              )}
            </div>

            <button
              onClick={() => setReportData(null)}
              className="w-full py-2.5 bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-bold rounded-xl transition-colors"
            >
              Tamam
            </button>
          </div>
        </div>
      )}

      {/* Locked Feature Explanation Modal */}
      {lockedFeatureModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-md glass-panel rounded-2xl shadow-2xl p-5 border border-amber-500/30 animate-in fade-in zoom-in-95 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2 text-amber-400 font-bold text-sm">
                <Lock className="w-4 h-4" />
                <span>Paket Kısıtlaması</span>
              </div>
              <button 
                onClick={() => setLockedFeatureModal(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="space-y-2">
              <h3 className="text-sm font-bold text-white font-tech">
                {lockedFeatureModal.item.name}
              </h3>
              <p className="text-xs text-slate-300 leading-relaxed">
                Bu optimizasyon ayarı için en az <strong className="text-amber-400 font-mono">{lockedFeatureModal.requiredTierLabel}</strong> paketi gerekmektedir.
              </p>
              <div className="p-3 rounded-xl bg-white/[0.03] border border-white/[0.08] text-xs text-slate-400">
                Mevcut Paketiniz: <strong className="text-white">{license.tierLabel}</strong>
              </div>
            </div>

            <div className="flex gap-2.5 pt-2">
              <button
                onClick={() => setLockedFeatureModal(null)}
                className="flex-1 py-2.5 bg-white/[0.06] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold rounded-xl transition-colors"
              >
                Vazgeç
              </button>
              <button
                onClick={() => {
                  setLockedFeatureModal(null);
                  onOpenLicenseModal();
                }}
                className="flex-1 py-2.5 text-white text-xs font-bold rounded-xl transition-all shadow-md flex items-center justify-center gap-1.5"
                style={{
                  backgroundColor: theme.primaryHex,
                  boxShadow: `0 0 16px ${theme.glowHex}`
                }}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Paket Yükselt & Key Gir</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Info Modal */}
      {activeInfoModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
          <div className="w-full max-w-lg glass-panel rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 border border-white/15">
            <div className="p-5 border-b border-white/10 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" style={{ color: theme.primaryHex }} />
                <h3 className="font-extrabold text-sm text-white font-tech">{activeInfoModal.name}</h3>
              </div>
              <button
                onClick={() => setActiveInfoModal(null)}
                className="w-7 h-7 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-5 space-y-4 text-xs">
              <div>
                <h4 className="font-semibold text-slate-300 mb-1">Bu Ayar Ne Yapıyor?</h4>
                <p className="text-slate-400 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                  {activeInfoModal.whatItDoes}
                </p>
              </div>

              <div>
                <h4 className="font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Güvenlik & Geri Alma Garantisi</span>
                </h4>
                <p className="text-slate-400 leading-relaxed bg-white/[0.03] p-3 rounded-xl border border-white/[0.06]">
                  {activeInfoModal.rollbackInfo}
                </p>
              </div>

              <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.04] border border-white/10">
                <span className="text-slate-400">Performans Etkisi:</span>
                <span className="font-bold text-white font-mono">{activeInfoModal.impact}</span>
              </div>
            </div>

            <div className="p-4 bg-white/[0.02] border-t border-white/10 flex justify-end">
              <button
                onClick={() => setActiveInfoModal(null)}
                className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.14] text-white text-xs font-semibold rounded-xl transition-colors"
              >
                Anladım
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
