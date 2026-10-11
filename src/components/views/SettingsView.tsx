import React, { useState } from 'react';
import { Settings, Palette, Bell, Volume2, KeyRound, RefreshCw, CheckCircle2, Lock, Crown, Sparkles } from 'lucide-react';
import { AccentColor, AppSettings, LicenseState, LicenseTier } from '../../types';
import { THEMES, applyThemeVariables } from '../../services/themeHelper';
import { soundFx } from '../../services/soundFxService';
import { setSimulatedTier } from '../../services/licensingService';

interface SettingsViewProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
  license: LicenseState;
  onOpenLicenseModal: () => void;
  onReplaySplash?: () => void;
  onLicenseChanged?: (updated: LicenseState) => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  onUpdateSettings,
  license,
  onOpenLicenseModal,
  onReplaySplash,
  onLicenseChanged,
}) => {
  const [isCheckingUpdate, setIsCheckingUpdate] = useState(false);
  const [updateFeedback, setUpdateFeedback] = useState<string | null>(null);

  // Developer Master Access
  const [ownerCodeInput, setOwnerCodeInput] = useState('');
  const [isOwnerUnlocked, setIsOwnerUnlocked] = useState(license.isOwnerMasterMode || false);
  const [ownerMsg, setOwnerMsg] = useState<string | null>(null);

  const theme = THEMES[settings.accentColor] || THEMES.red;

  const colors: { id: AccentColor; label: string; bgClass: string; hex: string }[] = [
    { id: 'red', label: 'ZAXEN Red', bgClass: 'bg-[#e11d48]', hex: '#e11d48' },
    { id: 'blue', label: 'Cyber Blue', bgClass: 'bg-blue-500', hex: '#3b82f6' },
    { id: 'purple', label: 'Neon Purple', bgClass: 'bg-purple-500', hex: '#a855f7' },
    { id: 'green', label: 'Toxic Green', bgClass: 'bg-emerald-500', hex: '#10b981' },
    { id: 'gold', label: 'Apex Gold', bgClass: 'bg-amber-500', hex: '#f59e0b' },
  ];

  const handleColorChange = (col: AccentColor) => {
    soundFx.playClickSound();
    applyThemeVariables(col);
    onUpdateSettings({ ...settings, accentColor: col });
  };

  const handleToggle = (key: keyof AppSettings) => {
    soundFx.playClickSound();
    const updated = !settings[key];
    if (key === 'enableSoundEffects') {
      soundFx.setEnabled(updated as boolean);
    }
    onUpdateSettings({ ...settings, [key]: updated });
  };

  const handleCheckUpdate = () => {
    soundFx.playClickSound();
    setIsCheckingUpdate(true);
    setTimeout(() => {
      setIsCheckingUpdate(false);
      setUpdateFeedback('Tebrikler! ZAXENBOOSTER v1.0.4 en güncel sürümündesiniz.');
      setTimeout(() => setUpdateFeedback(null), 4000);
    }, 1500);
  };

  const handleUnlockOwner = (e: React.FormEvent) => {
    e.preventDefault();
    if (ownerCodeInput.trim().toLowerCase() === 'zaxenboss') {
      soundFx.playBoostSound();
      setIsOwnerUnlocked(true);
      setOwnerMsg('Geliştirici Master Paneli açıldı. Müşteri paketlerini simüle edebilirsiniz.');
      setOwnerCodeInput('');
    } else {
      setOwnerMsg('Geçersiz sahip kodu.');
    }
  };

  const handleSimulateTier = (tier: LicenseTier) => {
    soundFx.playClickSound();
    const updated = setSimulatedTier(tier);
    if (onLicenseChanged) onLicenseChanged(updated);
  };

  return (
    <div className="space-y-6 pb-6 select-none max-w-4xl">
      {/* Header */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <Settings className="w-5 h-5" style={{ color: theme.primaryHex }} />
            Uygulama Ayarları & Kişiselleştirme
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Dinamik tema renkleri, siber ses efektleri ve lisans durumunu yönetin.
          </p>
        </div>
      </div>

      {/* 1. Tema & Görünüm */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
          <Palette className="w-4 h-4" style={{ color: theme.primaryHex }} />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-display">Arayüz & Accent Rengi</h2>
        </div>

        <div className="space-y-2">
          <label className="text-xs font-semibold text-slate-300 block">Kişisel Vurgu Rengini Seçin:</label>
          <div className="flex flex-wrap gap-3">
            {colors.map(col => {
              const isSelected = settings.accentColor === col.id;
              return (
                <button
                  key={col.id}
                  onClick={() => handleColorChange(col.id)}
                  className={`px-4 py-2.5 rounded-xl border flex items-center gap-2.5 text-xs font-semibold transition-all backdrop-blur-md ${
                    isSelected
                      ? 'bg-white/10 border-white text-white shadow-lg'
                      : 'bg-white/[0.03] border-white/10 text-slate-400 hover:text-white'
                  }`}
                  style={isSelected ? { borderColor: col.hex, boxShadow: `0 0 14px ${col.hex}50` } : {}}
                >
                  <span className={`w-3.5 h-3.5 rounded-full ${col.bgClass}`}></span>
                  <span>{col.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* 2. Ses Efektleri & Otomasyon */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
          <Bell className="w-4 h-4" style={{ color: theme.primaryHex }} />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-display">Ses & Bildirim Tercihleri</h2>
        </div>

        <div className="space-y-3">
          {[
            {
              key: 'enableSoundEffects' as const,
              icon: <Volume2 className="w-4 h-4 text-emerald-400" />,
              title: 'Fütüristik Siber Ses Efektleri (Web Audio FX)',
              desc: 'Boost ve RAM temizliği yapıldığında sci-fi reaktör şarj sesi çalar.',
            },
            {
              key: 'autoBoostOnGameLaunch' as const,
              icon: <Settings className="w-4 h-4 text-blue-400" />,
              title: 'Oyun Açıldığında Otomatik Boost',
              desc: 'Kütüphanedeki oyunlar başlatıldığında profili otomatik devreye sokar.',
            },
            {
              key: 'enableNotifications' as const,
              icon: <Bell className="w-4 h-4 text-amber-400" />,
              title: 'Akıllı Uyarı Bildirimleri',
              desc: 'RAM %85 üzerine çıktığında veya yüksek sıcaklıkta masaüstü bildirimi verir.',
            },
          ].map(opt => (
            <div
              key={opt.key}
              className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-white/[0.04] flex items-center justify-center shrink-0">
                  {opt.icon}
                </div>
                <div>
                  <div className="text-xs font-semibold text-white">{opt.title}</div>
                  <div className="text-[11px] text-slate-400">{opt.desc}</div>
                </div>
              </div>

              <button
                onClick={() => handleToggle(opt.key)}
                className="w-11 h-6 rounded-full transition-colors relative flex items-center p-0.5 shrink-0"
                style={{
                  backgroundColor: settings[opt.key] ? theme.primaryHex : 'rgba(255,255,255,0.1)'
                }}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings[opt.key] ? 'translate-x-5' : 'translate-x-0'
                  }`}
                ></div>
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Lisans Bilgileri & Paket Durumu */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-4">
        <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
          <KeyRound className="w-4 h-4" style={{ color: theme.primaryHex }} />
          <h2 className="text-xs font-bold text-white uppercase tracking-wider font-display">Lisans & Ürün Durumu</h2>
        </div>

        <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="text-xs font-bold text-white flex items-center gap-2">
              <span>Paket:</span>
              <span className={`px-2 py-0.5 rounded text-[11px] font-mono font-bold ${
                license.tier === 'ultimate' ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30' :
                license.isLicensed ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' :
                'bg-rose-500/20 text-rose-300 border border-rose-500/30'
              }`}>
                {license.tierLabel}
              </span>
            </div>
            <div className="text-[11px] text-slate-400 font-mono">
              Lisans Anahtarı: {license.key || 'Girilmedi (Deneme Kodu: zaxen1)'}
            </div>
            {license.isLicensed && !license.isExpired && (
              <div className="text-[11px] text-slate-400 font-mono">
                Kalan Süre: {license.licenseType === 'lifetime' || license.isOwnerMasterMode ? 'Ömür Boyu (Lifetime)' : `${license.remainingHours} saat ${license.remainingMinutes} dakika`}
              </div>
            )}
          </div>

          <button
            onClick={() => {
              soundFx.playClickSound();
              onOpenLicenseModal();
            }}
            className="px-4 py-2 text-white text-xs font-bold rounded-xl transition-all shadow-md"
            style={{
              backgroundColor: theme.primaryHex,
              boxShadow: `0 0 12px ${theme.glowHex}`
            }}
          >
            Lisans Yönet / Deneme Gir
          </button>
        </div>
      </div>

      {/* 4. SANA ÖZEL: Geliştirici & Paket Simülatörü */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white font-display">
            {isOwnerUnlocked ? <Crown className="w-4 h-4 text-amber-400" /> : <Lock className="w-4 h-4 text-slate-400" />}
            <span>ZAXEN Sahip & Paket Simülasyon Paneli</span>
          </div>
          {isOwnerUnlocked && (
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/20 px-2 py-0.5 rounded border border-emerald-500/30">
              GELİŞTİRİCİ KİLİDİ AÇIK
            </span>
          )}
        </div>

        {!isOwnerUnlocked ? (
          <form onSubmit={handleUnlockOwner} className="flex gap-2 pt-1">
            <input
              type="password"
              placeholder="Sahip Kodu (Örn: zaxenboss)"
              value={ownerCodeInput}
              onChange={e => setOwnerCodeInput(e.target.value)}
              className="flex-1 px-3 py-1.5 bg-black/40 border border-white/10 rounded-xl text-xs text-white placeholder:text-slate-600 outline-none"
            />
            <button
              type="submit"
              className="px-4 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-xl border border-white/15 transition-colors"
            >
              Paneli Aç
            </button>
          </form>
        ) : (
          <div className="space-y-3 pt-1">
            <p className="text-[11px] text-slate-400">
              Müşterilerin satın aldıkları paketlerde uygulamanın nasıl kısıtlandığını canlı test edin veya anahtar üretin:
            </p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleSimulateTier('free')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  license.tier === 'free' ? 'bg-rose-500/30 text-rose-200 border-rose-500' : 'bg-white/[0.03] text-slate-300 border-white/10'
                }`}
              >
                Ücretsiz / Kısıtlı
              </button>
              <button
                onClick={() => handleSimulateTier('trial')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  license.tier === 'trial' ? 'bg-blue-500/30 text-blue-200 border-blue-500' : 'bg-white/[0.03] text-slate-300 border-white/10'
                }`}
              >
                1 Günlük Deneme
              </button>
              <button
                onClick={() => handleSimulateTier('starter')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  license.tier === 'starter' ? 'bg-emerald-500/30 text-emerald-200 border-emerald-500' : 'bg-white/[0.03] text-slate-300 border-white/10'
                }`}
              >
                Starter Core
              </button>
              <button
                onClick={() => handleSimulateTier('pro')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  license.tier === 'pro' ? 'bg-purple-500/30 text-purple-200 border-purple-500' : 'bg-white/[0.03] text-slate-300 border-white/10'
                }`}
              >
                Pro Gamer
              </button>
              <button
                onClick={() => handleSimulateTier('ultimate')}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all ${
                  license.tier === 'ultimate' ? 'bg-amber-500/30 text-amber-200 border-amber-500' : 'bg-white/[0.03] text-slate-300 border-white/10'
                }`}
              >
                Ultimate VIP (Ömür Boyu)
              </button>
            </div>

            <div className="pt-1 flex items-center justify-between">
              <span className="text-[11px] text-slate-400">Müşteriler için key üretimi:</span>
              <button
                onClick={() => {
                  soundFx.playClickSound();
                  onOpenLicenseModal();
                }}
                className="px-3 py-1.5 bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 rounded-xl text-xs font-bold transition-colors flex items-center gap-1.5"
              >
                <Crown className="w-3.5 h-3.5" />
                <span>Key Üreticiyi Aç</span>
              </button>
            </div>
          </div>
        )}

        {ownerMsg && (
          <div className="text-[11px] text-emerald-400 font-mono pt-1">
            {ownerMsg}
          </div>
        )}
      </div>

      {/* 5. Sürüm & Animasyon */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div>
            <div className="text-xs font-bold text-white font-display">ZAXENBOOSTER Windows Desktop</div>
            <div className="text-[11px] text-slate-500 font-mono">Mevcut Sürüm: v1.0.4 (Build 2026.10)</div>
          </div>

          <div className="flex items-center gap-2">
            {onReplaySplash && (
              <button
                onClick={() => {
                  soundFx.playClickSound();
                  onReplaySplash();
                }}
                className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 text-xs font-semibold rounded-xl transition-colors"
              >
                <span>Açılış Animasyonunu İzle</span>
              </button>
            )}

            <button
              onClick={handleCheckUpdate}
              disabled={isCheckingUpdate}
              className="px-3.5 py-2 bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border border-white/10 text-xs font-semibold rounded-xl flex items-center gap-2 transition-colors"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${isCheckingUpdate ? 'animate-spin' : ''}`} style={{ color: theme.primaryHex }} />
              <span>{isCheckingUpdate ? 'Kontrol Ediliyor...' : 'Update Kontrol Et'}</span>
            </button>
          </div>
        </div>

        {updateFeedback && (
          <div className="p-2.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{updateFeedback}</span>
          </div>
        )}
      </div>
    </div>
  );
};
