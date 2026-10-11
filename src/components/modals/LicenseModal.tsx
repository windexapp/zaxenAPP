import React, { useState } from 'react';
import { 
  X, 
  KeyRound, 
  ShieldCheck, 
  Check, 
  Sparkles, 
  Copy, 
  Clock, 
  CheckCircle2, 
  AlertTriangle,
  Crown,
  Layers,
  ArrowRight,
  Sliders,
  Terminal,
  Zap,
  Lock
} from 'lucide-react';
import { LicenseState, LicenseTier } from '../../types';
import { 
  activateLicenseKey, 
  generateCustomerKey, 
  getLivePackagePlans, 
  setSimulatedTier 
} from '../../services/licensingService';
import { brandingService } from '../../services/brandingService';
import { soundFx } from '../../services/soundFxService';

interface LicenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  license: LicenseState;
  onLicenseUpdated: (newLicense: LicenseState) => void;
}

export const LicenseModal: React.FC<LicenseModalProps> = ({
  isOpen,
  onClose,
  license,
  onLicenseUpdated,
}) => {
  const [activeTab, setActiveTab] = useState<'activate' | 'packages' | 'owner'>('activate');
  const [keyInput, setKeyInput] = useState('');
  const [trialInput, setTrialInput] = useState('');
  const [feedback, setFeedback] = useState<{ message: string; isError: boolean } | null>(null);
  const [copiedHwid, setCopiedHwid] = useState(false);

  // Key Generator State for Owner
  const [genTier, setGenTier] = useState<'starter' | 'pro' | 'ultimate'>('pro');
  const [genDays, setGenDays] = useState<number>(30);
  const [generatedKey, setGeneratedKey] = useState<string>('');
  const [copiedKey, setCopiedKey] = useState(false);

  if (!isOpen) return null;

  const isOwner = license.isOwnerMasterMode;

  const handleActivateKey = () => {
    soundFx.playClickSound();
    if (!keyInput.trim()) {
      setFeedback({ message: 'Lütfen bir lisans anahtarı veya yetkili kod girin.', isError: true });
      return;
    }

    const res = activateLicenseKey(keyInput);
    if (res.success && res.license) {
      soundFx.playBoostSound();
      setFeedback({ message: res.message, isError: false });
      onLicenseUpdated(res.license);
      setKeyInput('');
      if (res.license.isOwnerMasterMode) {
        setActiveTab('owner');
      }
    } else {
      setFeedback({ message: res.message, isError: true });
    }
  };

  const handleActivateTrial = () => {
    soundFx.playClickSound();
    const code = trialInput.trim() || 'zaxen1';
    const res = activateLicenseKey(code);
    if (res.success && res.license) {
      soundFx.playBoostSound();
      setFeedback({ message: res.message, isError: false });
      onLicenseUpdated(res.license);
      setTrialInput('');
    } else {
      setFeedback({ message: res.message, isError: true });
    }
  };

  const copyHWID = () => {
    soundFx.playClickSound();
    navigator.clipboard?.writeText(license.hwid);
    setCopiedHwid(true);
    setTimeout(() => setCopiedHwid(false), 2000);
  };

  const handleGenerateKey = () => {
    soundFx.playClickSound();
    const key = generateCustomerKey(genTier, genDays);
    setGeneratedKey(key);
  };

  const copyGeneratedKey = () => {
    soundFx.playClickSound();
    navigator.clipboard?.writeText(generatedKey);
    setCopiedKey(true);
    setTimeout(() => setCopiedKey(false), 2000);
  };

  const handleSimulateTier = (tier: LicenseTier) => {
    soundFx.playClickSound();
    const updated = setSimulatedTier(tier);
    onLicenseUpdated(updated);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4">
      <div className="w-full max-w-2xl glass-panel rounded-2xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 border border-white/15 max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-white/[0.02]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-[#e11d48] to-[#9f1239] flex items-center justify-center text-white shadow-[0_0_16px_rgba(225,29,72,0.5)] border border-white/20">
              {isOwner ? <Crown className="w-5 h-5 text-amber-300" /> : <KeyRound className="w-5 h-5" />}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-sm text-white font-display">ZAXENBOOSTER Paket & Lisans Merkezi</h3>
                {isOwner && (
                  <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    SAHİP / MASTER
                  </span>
                )}
              </div>
              <p className="text-[11px] text-slate-400">Üyelik paketleri, müşteri kısıtlamaları ve aktivasyon yönetimi</p>
            </div>
          </div>

          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-white/10 px-4 bg-white/[0.01]">
          <button
            onClick={() => setActiveTab('activate')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'activate'
                ? 'border-[#e11d48] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Key Aktivasyonu</span>
          </button>

          <button
            onClick={() => setActiveTab('packages')}
            className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
              activeTab === 'packages'
                ? 'border-[#e11d48] text-white'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Paketler & Kıyaslama</span>
          </button>

          {isOwner && (
            <button
              onClick={() => setActiveTab('owner')}
              className={`py-2.5 px-4 text-xs font-bold border-b-2 transition-all flex items-center gap-2 ${
                activeTab === 'owner'
                  ? 'border-amber-400 text-amber-300'
                  : 'border-transparent text-slate-400 hover:text-slate-200'
              }`}
            >
              <Crown className="w-3.5 h-3.5 text-amber-400" />
              <span>Sahip & Key Üretici</span>
            </button>
          )}
        </div>

        {/* Content Body */}
        <div className="p-5 space-y-4 overflow-y-auto flex-1">
          {feedback && (
            <div className={`p-3 rounded-xl text-xs font-medium border flex items-center gap-2.5 ${
              feedback.isError 
                ? 'bg-rose-950/60 border-rose-800 text-rose-300' 
                : 'bg-emerald-950/60 border-emerald-800 text-emerald-300'
            }`}>
              <ShieldCheck className="w-4 h-4 shrink-0" />
              <span>{feedback.message}</span>
            </div>
          )}

          {/* TAB 1: KEY ACTIVATION */}
          {activeTab === 'activate' && (
            <div className="space-y-4">
              {/* Current Status Box */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-400">Aktif Paketiniz:</span>
                  <span className={`font-mono font-bold px-2.5 py-0.5 rounded text-[11px] border ${
                    isOwner ? 'bg-amber-500/20 text-amber-300 border-amber-500/40' :
                    license.isLicensed && !license.isExpired 
                      ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' 
                      : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                  }`}>
                    {license.tierLabel}
                  </span>
                </div>

                {license.isLicensed && !license.isExpired && (
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400">Kalan Süre:</span>
                    <span className="font-mono text-slate-200">
                      {license.licenseType === 'lifetime' || isOwner 
                        ? 'Sınırsız (Ömür Boyu)' 
                        : `${license.remainingHours} saat ${license.remainingMinutes} dakika`}
                    </span>
                  </div>
                )}

                <div className="flex items-center justify-between text-xs pt-1.5 border-t border-white/[0.06]">
                  <span className="text-slate-400">Cihaz HWID (Donanım Kimliği):</span>
                  <div className="flex items-center gap-1.5">
                    <span className="font-mono text-[11px] text-slate-300">{license.hwid}</span>
                    <button 
                      onClick={copyHWID} 
                      title="HWID Kopyala"
                      className="p-1 rounded text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
                    >
                      {copiedHwid ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                    </button>
                  </div>
                </div>
              </div>

              {/* Customer Activation Key Input */}
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-slate-300 block">
                  Satın Alınan Lisans Anahtarını Girin
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Örn: ZXN-PRO-XXXXXXXX-XXXX"
                    value={keyInput}
                    onChange={e => setKeyInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-black/40 border border-white/10 focus:border-[#e11d48] rounded-xl text-xs font-mono text-white placeholder:text-slate-600 outline-none uppercase transition-colors"
                  />
                  <button
                    onClick={handleActivateKey}
                    className="px-5 py-2.5 bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] text-white font-bold text-xs rounded-xl transition-all shadow-[0_0_16px_rgba(225,29,72,0.4)] shrink-0"
                  >
                    Key'i Etkinleştir
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  * Müşteri anahtarları satın alınan pakete göre özellikleri açar. Sahip kodu girilirse tam yetki açılır.
                </p>
              </div>

              {/* 1-Day Trial code ('zaxen1') */}
              <div className="space-y-1.5 pt-3 border-t border-white/[0.08]">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-slate-300">Hediye / Deneme Kodu</label>
                  <span className="text-[11px] text-[#ff4770] font-mono font-bold">Kod: zaxen1</span>
                </div>
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="zaxen1 (1 Günlük Ücretsiz Deneme)"
                    value={trialInput}
                    onChange={e => setTrialInput(e.target.value)}
                    className="flex-1 px-3.5 py-2.5 bg-black/40 border border-white/10 focus:border-[#e11d48] rounded-xl text-xs font-mono text-white placeholder:text-slate-600 outline-none transition-colors"
                  />
                  <button
                    onClick={handleActivateTrial}
                    className="px-5 py-2.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 font-bold text-xs rounded-xl transition-colors shrink-0 flex items-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-[#ff4770]" />
                    <span>Deneme Başlat</span>
                  </button>
                </div>
                <p className="text-[10px] text-slate-500">
                  * Deneme süresi bittikten sonra optimizasyonlar kilitlenir; ancak sistem ayarlarını geri alma koruması daima çalışır.
                </p>
              </div>
            </div>
          )}

          {/* TAB 2: PACKAGES COMPARISON */}
          {activeTab === 'packages' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300">
                ZAXENBOOSTER üyelik paketleri ve erişim yetkileri:
              </p>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {getLivePackagePlans().map(pkg => (
                  <div
                    key={pkg.id}
                    className={`p-4 rounded-xl border relative flex flex-col justify-between space-y-3 ${
                      license.tier === pkg.id 
                        ? 'bg-white/[0.08] border-white/30 shadow-lg' 
                        : 'bg-white/[0.02] border-white/[0.06]'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <h4 className="text-sm font-bold text-white font-tech">{pkg.title}</h4>
                          {pkg.price && (
                            <span className="text-[11px] font-mono font-bold text-amber-300">
                              {pkg.price}
                            </span>
                          )}
                        </div>
                        <span 
                          className="text-[10px] font-mono font-bold px-2 py-0.5 rounded border"
                          style={{
                            backgroundColor: `${pkg.highlightColor}20`,
                            color: pkg.highlightColor,
                            borderColor: `${pkg.highlightColor}40`
                          }}
                        >
                          {pkg.badge}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 mt-0.5">{pkg.tagline}</p>

                      {/* Feature checkmarks */}
                      <ul className="mt-3 space-y-1.5 text-[11px]">
                        {pkg.features.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-slate-300">
                            <Check className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                        {pkg.restrictedFeatures.map((feat, idx) => (
                          <li key={idx} className="flex items-start gap-1.5 text-slate-500 line-through">
                            <Lock className="w-3.5 h-3.5 text-slate-600 shrink-0 mt-0.5" />
                            <span>{feat}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {license.tier === pkg.id && (
                      <div className="pt-2 border-t border-white/10 text-center text-[10px] font-mono font-bold text-emerald-400">
                        ✓ MEVCUT PAKETİNİZ
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: OWNER & KEY GENERATOR */}
          {activeTab === 'owner' && isOwner && (
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-amber-950/30 border border-amber-500/30 space-y-3">
                <div className="flex items-center gap-2 text-amber-300 font-bold text-xs font-display">
                  <Crown className="w-4 h-4 text-amber-400" />
                  <span>Müşteriler İçin Lisans Anahtarı Üretici (Key Generator)</span>
                </div>
                <p className="text-[11px] text-slate-300">
                  Müşterilerinize satacağınız veya göndereceğiniz dijital imzalı lisans anahtarlarını buradan anında üretebilirsiniz:
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Paket Kademesi:</label>
                    <select
                      value={genTier}
                      onChange={e => setGenTier(e.target.value as any)}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white outline-none"
                    >
                      <option value="starter">Starter Core (Temel)</option>
                      <option value="pro">Pro Gamer (En Çok Satan)</option>
                      <option value="ultimate">Ultimate VIP (Full Açık)</option>
                    </select>
                  </div>

                  <div>
                    <label className="text-[11px] font-semibold text-slate-300 block mb-1">Süre:</label>
                    <select
                      value={genDays}
                      onChange={e => setGenDays(Number(e.target.value))}
                      className="w-full px-3 py-2 bg-black/50 border border-white/10 rounded-xl text-xs text-white outline-none"
                    >
                      <option value={7}>7 Günlük</option>
                      <option value={30}>30 Günlük (1 Ay)</option>
                      <option value={90}>90 Günlük (3 Ay)</option>
                      <option value={365}>365 Günlük (1 Yıl)</option>
                      <option value={3650}>Ömür Boyu (Lifetime)</option>
                    </select>
                  </div>
                </div>

                <div className="pt-1">
                  <button
                    onClick={handleGenerateKey}
                    className="w-full py-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs rounded-xl transition-colors shadow-md flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Müşteri Lisans Anahtarı Üret</span>
                  </button>
                </div>

                {generatedKey && (
                  <div className="p-3 rounded-xl bg-black/60 border border-amber-500/40 space-y-1.5 animate-in fade-in">
                    <div className="text-[10px] text-amber-300 font-mono">Üretilen Anahtar:</div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-xs font-bold text-white selection:bg-amber-500">
                        {generatedKey}
                      </span>
                      <button
                        onClick={copyGeneratedKey}
                        className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white text-xs font-semibold rounded-lg flex items-center gap-1"
                      >
                        {copiedKey ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
                        <span>{copiedKey ? 'Kopyalandı' : 'Kopyala'}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Simulation Mode for Owner */}
              <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.08] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-white font-tech">
                  <Sliders className="w-4 h-4 text-blue-400" />
                  <span>Müşteri Görünümü Simülatörü</span>
                </div>
                <p className="text-[11px] text-slate-400">
                  Uygulamanın farklı müşteri paketlerinde nasıl kilitlendiğini canlı görmek için test kademesini seçin:
                </p>
                <div className="flex flex-wrap gap-2 pt-1">
                  <button
                    onClick={() => handleSimulateTier('free')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/10 border border-white/10 text-slate-300"
                  >
                    Ücretsiz (Free)
                  </button>
                  <button
                    onClick={() => handleSimulateTier('trial')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/10 border border-white/10 text-blue-300"
                  >
                    1 Günlük Deneme
                  </button>
                  <button
                    onClick={() => handleSimulateTier('starter')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/10 border border-white/10 text-emerald-300"
                  >
                    Starter Core
                  </button>
                  <button
                    onClick={() => handleSimulateTier('pro')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/10 border border-white/10 text-rose-300"
                  >
                    Pro Gamer
                  </button>
                  <button
                    onClick={() => handleSimulateTier('ultimate')}
                    className="px-3 py-1.5 rounded-xl text-xs font-semibold bg-white/[0.04] hover:bg-white/10 border border-white/10 text-amber-300"
                  >
                    Ultimate VIP
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-white/[0.02] border-t border-white/10 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-white/[0.06] hover:bg-white/[0.12] text-slate-300 text-xs font-semibold rounded-xl transition-colors"
          >
            Kapat
          </button>
        </div>
      </div>
    </div>
  );
};
