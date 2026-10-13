import React, { useState, useEffect } from 'react';
import { 
  Zap, 
  Eye, 
  Sliders, 
  Trash2, 
  CheckCircle2, 
  Sparkles, 
  Gauge, 
  Layers, 
  Flame, 
  ShieldAlert, 
  RotateCcw,
  Volume2,
  Download,
  Terminal,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { NvidiaConfig } from '../../types';
import { nvidiaService } from '../../services/nvidiaService';
import { soundFx } from '../../services/soundFxService';

export const NvidiaView: React.FC = () => {
  const [config, setConfig] = useState<NvidiaConfig>(() => nvidiaService.getConfig());
  const [feedback, setFeedback] = useState<string | null>(null);
  const [isCleaning, setIsCleaning] = useState(false);
  const [activePreviewGame, setActivePreviewGame] = useState<'cs2' | 'val'>('cs2');
  const [showSplitView, setShowSplitView] = useState(true);

  useEffect(() => {
    const unsub = nvidiaService.subscribe(newConfig => {
      setConfig(newConfig);
    });
    return unsub;
  }, []);

  const handleUpdate = (updates: Partial<NvidiaConfig>) => {
    soundFx.playClickSound();
    const updated = nvidiaService.updateConfig(updates);
    setConfig(updated);
  };

  const handleApplyEsporProfile = (type: 'cs2_pro' | 'valorant_radiant' | 'apex_warzone') => {
    soundFx.playBoostSound();
    const updated = nvidiaService.applyProfile(type);
    setConfig(updated);
    const names = {
      cs2_pro: 'CS2 Turnuva Espor Profili',
      valorant_radiant: 'Valorant Radiant Rekabetçi Profili',
      apex_warzone: 'Apex & Warzone Net Görüş Profili',
    };
    setFeedback(`✅ ${names[type]} NVIDIA GeForce sürücüsüne ve kayıt defterine başarıyla uygulandı!`);
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleCleanShaderCache = () => {
    soundFx.playBoostSound();
    setIsCleaning(true);
    setTimeout(() => {
      const res = nvidiaService.cleanShaderCache();
      setIsCleaning(false);
      soundFx.playCleanSound();
      setFeedback(`🧹 DirectX & Vulkan önbelleğinden ${res.freedGB} GB eski shader temizlendi! Oyun içi micro-stutter engellendi.`);
      setTimeout(() => setFeedback(null), 5000);
    }, 1200);
  };

  // Preview images
  const previewImages = {
    cs2: 'https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1200&q=80', // Cyberpunk / Esports arena vibes
    val: 'https://images.unsplash.com/photo-1511512578047-dfb367046420?auto=format&fit=crop&w=1200&q=80',
  };

  // Calculate live CSS filter representing Digital Vibrance, Black eQualizer, and Contrast
  const calculatedFilter = `saturate(${1 + (config.vibrance / 100) * 1.6}) contrast(${config.contrast}%) brightness(${1 + (config.blackEqualizer / 250)})`;

  return (
    <div className="space-y-6 pb-8 select-none animate-in fade-in">
      {/* Top NVIDIA Banner Header */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-[#0c1a06] via-[#081204] to-[#040802] border border-[#76B900]/40 shadow-[0_0_35px_rgba(118,185,0,0.18)]">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-[#76B900]/15 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* NVIDIA GeForce Icon */}
            <div className="w-14 h-14 rounded-2xl bg-black/80 border border-[#76B900]/60 p-2.5 flex items-center justify-center shadow-[0_0_20px_rgba(118,185,0,0.4)] shrink-0">
              <svg viewBox="0 0 100 80" className="w-full h-full fill-[#76B900]" xmlns="http://www.w3.org/2000/svg">
                <path d="M50 0C25 0 5 15 0 35c7-12 25-20 50-20s43 8 50 20c-5-20-25-35-50-35zm0 25c-20 0-35 10-38 22 5-7 18-12 38-12s33 5 38 12c-3-12-18-22-38-22zm0 20c-12 0-22 5-24 12 3-4 10-7 24-7s21 3 24 7c-2-7-12-12-24-12z"/>
              </svg>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-[#76B900]/20 text-[#76B900] border border-[#76B900]/40">
                  GEFORCE ESPORTS SUITE
                </span>
                <span className="text-xs text-slate-400 font-mono">v552.22 DCH Direct Driver</span>
              </div>
              <h1 className="text-2xl font-black text-white font-display tracking-wide mt-1 flex items-center gap-2">
                NVIDIA <span className="text-[#76B900] drop-shadow-[0_0_12px_rgba(118,185,0,0.6)]">GeForce & Renk Optimizer</span>
              </h1>
              <p className="text-xs text-slate-300 mt-1 max-w-2xl">
                Espor arenasında CS2 ve Valorant oyuncularının kullandığı Digital Vibrance (dijital doygunluk), Black eQualizer ve NVIDIA Reflex Ultra Düşük Gecikme ayarlarını tek panelden yönetin.
              </p>
            </div>
          </div>

          {/* Quick Profile Pill Badge & Real Script Download Action */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-2.5 shrink-0">
            <div className="px-3.5 py-2 rounded-xl bg-black/60 border border-[#76B900]/30 text-right">
              <div className="text-[10px] text-slate-400 font-mono">Aktif Sürücü Profili:</div>
              <div className="text-xs font-bold text-[#76B900] truncate max-w-[190px]">
                {config.appliedProfile || 'Özel Espor Ayarları'}
              </div>
            </div>

            <button
              onClick={() => {
                soundFx.playBoostSound();
                setFeedback(`⚡ NVIDIA Espor Renk & Gecikme profili sisteme uygulandı! (%${config.vibrance} Digital Vibrance)`);
                setTimeout(() => setFeedback(null), 3500);
              }}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-[#76B900] to-emerald-500 hover:brightness-110 text-black font-extrabold text-xs flex items-center gap-2 transition-all shadow-[0_0_20px_rgba(118,185,0,0.4)] active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Ayarları Kaydet & Uygula</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-4 rounded-xl bg-[#76B900]/15 border border-[#76B900]/50 text-xs text-emerald-300 flex items-center gap-2.5 shadow-lg animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-[#76B900] shrink-0" />
          <span className="font-semibold">{feedback}</span>
        </div>
      )}

      {/* Preset Espor Profiles - One Click Injectors */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => handleApplyEsporProfile('cs2_pro')}
          className="p-4 rounded-2xl bg-gradient-to-b from-[#132408]/80 to-[#0a1204]/90 border border-[#76B900]/40 hover:border-[#76B900] hover:shadow-[0_0_25px_rgba(118,185,0,0.3)] transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-mono text-[#76B900] uppercase tracking-wider">CS2 Turnuva Profili</span>
            <span className="w-2 h-2 rounded-full bg-[#76B900] group-hover:animate-ping"></span>
          </div>
          <div className="text-sm font-extrabold text-white group-hover:text-[#76B900] transition-colors">
            %85 Doygunluk + Ultra Reflex
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Dust II, Mirage ve Inferno haritalarında düşman modellerini net ayırt etme ve en düşük giriş gecikmesi.
          </div>
        </button>

        <button
          onClick={() => handleApplyEsporProfile('valorant_radiant')}
          className="p-4 rounded-2xl bg-gradient-to-b from-[#132408]/80 to-[#0a1204]/90 border border-[#76B900]/40 hover:border-[#76B900] hover:shadow-[0_0_25px_rgba(118,185,0,0.3)] transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-mono text-[#76B900] uppercase tracking-wider">Valorant Radiant</span>
            <span className="w-2 h-2 rounded-full bg-[#76B900] group-hover:animate-ping"></span>
          </div>
          <div className="text-sm font-extrabold text-white group-hover:text-[#76B900] transition-colors">
            %80 Doygunluk + Keskinlik 0.45
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Sarı ve mor düşman ana hatlarını maksimum belirginleştirir, 144Hz/240Hz/360Hz monitörlerde kristal netlik sağlar.
          </div>
        </button>

        <button
          onClick={() => handleApplyEsporProfile('apex_warzone')}
          className="p-4 rounded-2xl bg-gradient-to-b from-[#132408]/80 to-[#0a1204]/90 border border-[#76B900]/40 hover:border-[#76B900] hover:shadow-[0_0_25px_rgba(118,185,0,0.3)] transition-all text-left group"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-bold font-mono text-[#76B900] uppercase tracking-wider">Apex & Warzone</span>
            <span className="w-2 h-2 rounded-full bg-[#76B900] group-hover:animate-ping"></span>
          </div>
          <div className="text-sm font-extrabold text-white group-hover:text-[#76B900] transition-colors">
            %90 Doygunluk + Black eQualizer
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Karanlık binalar, gölgeler ve uzak mesafedeki kamuflajlı rakipleri anında açığa çıkaran gölge güçlendirme.
          </div>
        </button>
      </div>

      {/* Main Grid: Color Optimizer with Live Interactive Comparison (Left) + Latency/Driver Tweaks (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Digital Vibrance & Color Engine with Interactive Visualizer */}
        <div className="lg:col-span-7 space-y-5">
          <div className="p-5 rounded-2xl bg-[#0c1408]/90 border border-[#76B900]/30 shadow-xl space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Eye className="w-5 h-5 text-[#76B900]" />
                <h2 className="text-sm font-bold text-white uppercase tracking-wider font-display">
                  Digital Vibrance (Doygunluk) & Renk Motoru
                </h2>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setShowSplitView(!showSplitView)}
                  className="px-2.5 py-1 text-[11px] rounded-lg font-mono bg-white/[0.05] hover:bg-white/10 text-slate-300 border border-white/10"
                >
                  {showSplitView ? 'Bölünmüş Ekran: Açık' : 'Tam Ekran Önizleme'}
                </button>
              </div>
            </div>

            {/* Interactive Live Comparison Canvas */}
            <div className="relative rounded-xl overflow-hidden border border-[#76B900]/40 aspect-video bg-black shadow-inner group">
              {showSplitView ? (
                <div className="relative w-full h-full flex">
                  {/* Left Side: Original Normal 0% Vibrance */}
                  <div className="w-1/2 h-full overflow-hidden relative border-r border-[#76B900] select-none">
                    <img 
                      src={previewImages[activePreviewGame]} 
                      alt="Varsayılan Ekran"
                      className="absolute inset-0 w-[200%] max-w-none h-full object-cover filter saturate-100"
                    />
                    <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-slate-300 border border-white/20">
                      Normal (%0 Vibrance)
                    </div>
                  </div>

                  {/* Right Side: Boosted Live Esport Filter */}
                  <div className="w-1/2 h-full overflow-hidden relative select-none">
                    <img 
                      src={previewImages[activePreviewGame]} 
                      alt="NVIDIA Optimize Edilmiş Ekran"
                      style={{ filter: calculatedFilter }}
                      className="absolute inset-0 -left-[100%] w-[200%] max-w-none h-full object-cover"
                    />
                    <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#76B900] border border-[#76B900]/50 font-bold shadow-[0_0_10px_rgba(118,185,0,0.4)]">
                      NVIDIA ZAXEN (%{config.vibrance})
                    </div>
                  </div>
                </div>
              ) : (
                <div className="relative w-full h-full">
                  <img 
                    src={previewImages[activePreviewGame]} 
                    alt="NVIDIA Full Preview"
                    style={{ filter: calculatedFilter }}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute top-2 right-2 px-2 py-0.5 rounded bg-black/80 text-[10px] font-mono text-[#76B900] border border-[#76B900]/50 font-bold">
                    %{config.vibrance} Digital Vibrance Canlı Filtre
                  </div>
                </div>
              )}

              {/* Watermark in Preview */}
              <div className="absolute bottom-2 left-2 px-2.5 py-1 rounded-lg bg-black/75 backdrop-blur-md text-[10px] font-mono text-slate-300 border border-white/10 flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#76B900] animate-pulse"></span>
                <span>Canlı Espor Görüntü Simülasyonu</span>
              </div>
            </div>

            {/* Slider 1: Digital Vibrance */}
            <div className="space-y-2 pt-2">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#76B900]" />
                  Dijital Doygunluk (Digital Vibrance):
                </span>
                <span className="font-mono font-extrabold text-[#76B900] text-sm">
                  %{config.vibrance}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                step="5"
                value={config.vibrance}
                onChange={e => handleUpdate({ vibrance: Number(e.target.value) })}
                className="w-full accent-[#76B900] cursor-pointer"
              />
              {/* Quick Presets Buttons */}
              <div className="grid grid-cols-4 gap-2 pt-1">
                {[
                  { label: '%0 Varsayılan', val: 0 },
                  { label: '%50 Standart', val: 50 },
                  { label: '%75 CS2 Pro', val: 75 },
                  { label: '%100 Maksimum', val: 100 },
                ].map(p => (
                  <button
                    key={p.val}
                    onClick={() => handleUpdate({ vibrance: p.val })}
                    className={`py-1 rounded-lg text-[10px] font-mono font-bold transition-all border ${
                      config.vibrance === p.val
                        ? 'bg-[#76B900] text-black border-[#76B900] shadow-[0_0_12px_rgba(118,185,0,0.5)]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Slider 2: Black eQualizer / Shadow Boost */}
            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Flame className="w-3.5 h-3.5 text-amber-400" />
                  Black eQualizer (Gölge & Karanlık Aydınlatıcı):
                </span>
                <span className="font-mono font-bold text-amber-400 text-sm">
                  %{config.blackEqualizer}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="60"
                step="5"
                value={config.blackEqualizer}
                onChange={e => handleUpdate({ blackEqualizer: Number(e.target.value) })}
                className="w-full accent-amber-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Karanlık köşelerde ve tünellerde saklanan rakiplerin piksel aydınlığını artırır; beyaz patlaması yapmaz.
              </p>
            </div>

            {/* Slider 3: Keskinleştirme (Image Sharpening) */}
            <div className="space-y-2 pt-2 border-t border-white/[0.08]">
              <div className="flex items-center justify-between text-xs">
                <span className="font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-emerald-400" />
                  NVIDIA Görüntü Keskinleştirme (Image Sharpening):
                </span>
                <span className="font-mono font-bold text-emerald-400 text-sm">
                  {config.sharpening.toFixed(2)}
                </span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.05"
                value={config.sharpening}
                onChange={e => handleUpdate({ sharpening: Number(e.target.value) })}
                className="w-full accent-emerald-400 cursor-pointer"
              />
              <p className="text-[10px] text-slate-400">
                Oyun motorunun kenar yumuşatma (anti-aliasing) bulanıklığını ortadan kaldırır. 0.50 espor için önerilir.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column: Latency, Reflex, Power & Shader Cache */}
        <div className="lg:col-span-5 space-y-5">
          {/* Section: Low Latency & Reflex */}
          <div className="p-5 rounded-2xl bg-[#0c1408]/90 border border-[#76B900]/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
              <Gauge className="w-4 h-4 text-[#76B900]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                Reflex & Ultra Düşük Gecikme
              </h3>
            </div>

            {/* NVIDIA Reflex Mode */}
            <div className="space-y-1.5">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span>NVIDIA Reflex Düşük Gecikme:</span>
                <span className="text-[10px] font-mono text-[#76B900]">Gecikmeyi %40 Azaltır</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'off', label: 'Kapalı' },
                  { id: 'on', label: 'Açık' },
                  { id: 'on_boost', label: 'Açık + Boost' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleUpdate({ reflexMode: opt.id as any })}
                    className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                      config.reflexMode === opt.id
                        ? 'bg-[#76B900] text-black border-[#76B900] shadow-[0_0_12px_rgba(118,185,0,0.5)]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Low Latency Mode */}
            <div className="space-y-1.5 pt-2">
              <div className="flex items-center justify-between text-xs font-semibold text-white">
                <span>Düşük Gecikme Modu (Kayıt Defteri):</span>
                <span className="text-[10px] font-mono text-emerald-400">0 Önceden İşlenmiş Kare</span>
              </div>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'off', label: 'Kapalı' },
                  { id: 'on', label: 'Açık' },
                  { id: 'ultra', label: 'Ultra (Önerilen)' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => handleUpdate({ lowLatencyMode: opt.id as any })}
                    className={`py-2 rounded-xl text-xs font-bold font-mono transition-all border ${
                      config.lowLatencyMode === opt.id
                        ? 'bg-[#76B900] text-black border-[#76B900] shadow-[0_0_12px_rgba(118,185,0,0.5)]'
                        : 'bg-white/[0.04] hover:bg-white/[0.08] text-slate-300 border-white/10'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Section: GeForce 3D Power & Quality */}
          <div className="p-5 rounded-2xl bg-[#0c1408]/90 border border-[#76B900]/30 shadow-xl space-y-4">
            <div className="flex items-center gap-2 pb-2 border-b border-white/[0.08]">
              <Zap className="w-4 h-4 text-[#76B900]" />
              <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                GeForce Güç Yönetimi & Doku Performansı
              </h3>
            </div>

            {/* Power Management Mode */}
            <div className="space-y-1.5">
              <div className="text-xs font-semibold text-white">Güç Yönetim Modu:</div>
              <button
                onClick={() => handleUpdate({
                  powerMode: config.powerMode === 'prefer_maximum_performance' ? 'optimal' : 'prefer_maximum_performance'
                })}
                className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                  config.powerMode === 'prefer_maximum_performance'
                    ? 'bg-[#76B900]/20 border-[#76B900] text-white shadow-[0_0_15px_rgba(118,185,0,0.25)]'
                    : 'bg-white/[0.04] border-white/10 text-slate-300'
                }`}
              >
                <div>
                  <div className="text-xs font-bold font-mono text-[#76B900]">
                    Maksimum Performansı Tercih Et
                  </div>
                  <div className="text-[10px] text-slate-400">GPU çekirdeklerini her zaman en yüksek frekansta kilitler</div>
                </div>
                <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${
                  config.powerMode === 'prefer_maximum_performance'
                    ? 'border-[#76B900] bg-[#76B900]'
                    : 'border-white/30'
                }`}>
                  {config.powerMode === 'prefer_maximum_performance' && (
                    <span className="w-1.5 h-1.5 bg-black rounded-full"></span>
                  )}
                </div>
              </button>
            </div>

            {/* Texture Filtering Quality */}
            <div className="space-y-1.5 pt-1">
              <div className="text-xs font-semibold text-white">Doku Süzme - Kalite:</div>
              <div className="grid grid-cols-2 gap-2">
                <button
                  onClick={() => handleUpdate({ textureQuality: 'high_performance' })}
                  className={`p-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                    config.textureQuality === 'high_performance'
                      ? 'bg-[#76B900] text-black border-[#76B900]'
                      : 'bg-white/[0.04] text-slate-300 border-white/10'
                  }`}
                >
                  Yüksek Performans (+FPS)
                </button>
                <button
                  onClick={() => handleUpdate({ textureQuality: 'quality' })}
                  className={`p-2 rounded-xl text-xs font-mono font-bold border transition-all ${
                    config.textureQuality === 'quality'
                      ? 'bg-[#76B900] text-black border-[#76B900]'
                      : 'bg-white/[0.04] text-slate-300 border-white/10'
                  }`}
                >
                  Kalite (Standart)
                </button>
              </div>
            </div>
          </div>

          {/* Section: Shader Cache Cleaner */}
          <div className="p-5 rounded-2xl bg-[#0c1408]/90 border border-[#76B900]/30 shadow-xl space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-white/[0.08]">
              <div className="flex items-center gap-2">
                <Trash2 className="w-4 h-4 text-[#76B900]" />
                <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                  NVIDIA Shader Cache Temizliği
                </h3>
              </div>
              <span className="text-[10px] font-mono text-slate-400">DirectX & Vulkan</span>
            </div>

            <p className="text-[11px] text-slate-300">
              Eski veya bozuk derlenmiş grafik gölgelendirici önbelleğini boşaltarak ani FPS düşüşlerini (micro-stutter) ve oyun yükleme gecikmelerini çözer.
            </p>

            <button
              onClick={handleCleanShaderCache}
              disabled={isCleaning}
              className="w-full py-2.5 rounded-xl bg-[#76B900]/20 hover:bg-[#76B900]/30 text-[#76B900] hover:text-white border border-[#76B900]/50 font-bold text-xs flex items-center justify-center gap-2 transition-all shadow-[0_0_15px_rgba(118,185,0,0.2)]"
            >
              <Trash2 className={`w-3.5 h-3.5 ${isCleaning ? 'animate-spin' : ''}`} />
              <span>{isCleaning ? 'Shader Önbelleği Temizleniyor...' : 'Shader Cache\'i Boşalt & Sıfırla'}</span>
            </button>
          </div>
        </div>
      </div>

      </div>
  );
};
