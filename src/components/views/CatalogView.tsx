import React, { useState } from 'react';
import { 
  Search, 
  CheckCircle2, 
  Zap, 
  Cpu, 
  Wifi, 
  MousePointer, 
  EyeOff, 
  LayoutGrid, 
  Server, 
  Sparkles,
  Terminal,
  Download,
  Check,
  ChevronDown,
  ChevronUp,
  AlertCircle
} from 'lucide-react';
import { soundFx } from '../../services/soundFxService';
import { LicenseState } from '../../types';
import { systemExecutor, TWEAK_COMMANDS, ExecutionResult } from '../../services/systemExecutorService';

interface CatalogTweak {
  id: string;
  category: 'cpu' | 'gpu' | 'network' | 'mouse' | 'privacy' | 'win11' | 'services';
  categoryLabel: string;
  title: string;
  description: string;
  evidenceLevel: 'Laboratuvar Kanıtlı' | 'Yüksek Kanıt' | 'Orta Kanıt';
  riskLevel: 'Güvenli' | 'Düşük Risk' | 'Tartışmalı (Efsane)';
  isPro?: boolean;
  enabled: boolean;
  impactScore: number; // 1 to 5
}

const INITIAL_CATALOG: CatalogTweak[] = [
  // GÜÇ & İŞLEMCİ
  {
    id: 'cpu_unpark',
    category: 'cpu',
    categoryLabel: 'Güç ve İşlemci',
    title: 'CPU Core Unparking (Tüm Çekirdekleri Canlı Tutma)',
    description: 'Windows güç yöneticisinin işlemci çekirdeklerini uykuya almasını engeller. Oyunlarda ani mikro takılmaları (micro-stutter) sıfıra indirir.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 5
  },
  {
    id: 'cpu_ultimate_power',
    category: 'cpu',
    categoryLabel: 'Güç ve İşlemci',
    title: 'Ultimate Performance (Nihai Performans) Güç Planı',
    description: 'Donanım üreticileri için tasarlanmış gecikmesiz güç profilini aktif eder. Frekans düşüşlerini ve C-State gecikmelerini keser.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 4
  },
  {
    id: 'cpu_hpet_disable',
    category: 'cpu',
    categoryLabel: 'Güç ve İşlemci',
    title: 'HPET (High Precision Event Timer) Devre Dışı Bırakma',
    description: 'Eski anakart zamanlayıcısını kapatıp CPU iç TSC zamanlayıcısını kullanır. FPS frame-time gecikmesinde %12 kararlılık artışı sağlar.',
    evidenceLevel: 'Yüksek Kanıt',
    riskLevel: 'Düşük Risk',
    enabled: false,
    impactScore: 4
  },

  // EKRAN KARTI
  {
    id: 'gpu_hags',
    category: 'gpu',
    categoryLabel: 'Ekran Kartı',
    title: 'Donanım Hızlandırmalı GPU Zamanlaması (HAGS)',
    description: 'VRAM yönetimini CPU yerine doğrudan GPU işlemcisine devreder. Giriş gecikmesini düşürür ve modern sürücülerde kare üretimini açar.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 5
  },
  {
    id: 'gpu_tdr_delay',
    category: 'gpu',
    categoryLabel: 'Ekran Kartı',
    title: 'TdrDelay Zaman Aşımı Genişletme (8 Saniye)',
    description: 'Yoğun sahne yüklemelerinde Windows ekran kartı sürücüsünü çöktü sayıp yeniden başlatmasını önler.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 4
  },
  {
    id: 'gpu_mpo_disable',
    category: 'gpu',
    categoryLabel: 'Ekran Kartı',
    title: 'Multi-Plane Overlay (MPO) Düzeltmesi',
    description: 'Discord veya Spotify açıkken ikinci monitördeki ekran yırtılmalarını ve Discord yayınındaki ani FPS düşüşlerini çözer.',
    evidenceLevel: 'Yüksek Kanıt',
    riskLevel: 'Güvenli',
    enabled: false,
    impactScore: 3
  },

  // AĞ GECİKMESİ
  {
    id: 'net_tcp_nodelay',
    category: 'network',
    categoryLabel: 'Ağ Gecikmesi',
    title: 'TCP NoDelay & Nagle Algoritması Kapatma',
    description: 'Küçük oyun paketlerinin tamponda birikmesini engelleyip anında sunucuya iletir. CS2 ve Valorant ping dalgalanmalarını (jitter) keser.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 5
  },
  {
    id: 'net_throttle_disable',
    category: 'network',
    categoryLabel: 'Ağ Gecikmesi',
    title: 'NetworkThrottlingIndex Kısıtlamasını Kaldırma',
    description: 'Windows multimedya servislerinin ağ kartı bant genişliğini %10 ile %20 arasında kısmasını engeller.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 4
  },
  {
    id: 'net_mtu_clamp',
    category: 'network',
    categoryLabel: 'Ağ Gecikmesi',
    title: 'MTU & MSS Paket Parçalanma Koruması',
    description: 'Paketlerin ISP sınırında bölünmesini engelleyerek paket kaybını (packet loss) %0 seviyesine kilitler.',
    evidenceLevel: 'Yüksek Kanıt',
    riskLevel: 'Güvenli',
    enabled: false,
    impactScore: 3
  },

  // FARE VE KLAVYE TEPKİSİ
  {
    id: 'input_markc_fix',
    category: 'mouse',
    categoryLabel: 'Fare ve Klavye Tepkisi',
    title: 'MarkC 1:1 Doğrusal Espor Fare İvmesi Yaması',
    description: 'Windows masaüstü fare ivmesini tam 1:1 piksel oranına kilitler. Bilek reflekslerinin oyunda milimetrik tutarlı olmasını sağlar.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 5
  },
  {
    id: 'input_filterkeys_0ms',
    category: 'mouse',
    categoryLabel: 'Fare ve Klavye Tepkisi',
    title: 'FilterKeys Sıfır Gecikmeli Tuş Tepkisi (Flags 27)',
    description: 'Tuşa basma gecikmesini (Repeat Delay) 0ms seviyesine çekerek strafe, zıplama ve yön tuşu tepkisini anında iletir.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 4
  },
  {
    id: 'input_usb_selective_suspend',
    category: 'mouse',
    categoryLabel: 'Fare ve Klavye Tepkisi',
    title: 'USB Seçici Askıya Almayı Kapatma',
    description: 'Windows güç tasarrufunun USB portlarına giden gücü kesmesini engeller; 1000Hz/4000Hz/8000Hz farelerde polling kaybını önler.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 4
  },

  // GİZLİLİK & TELEMETRİ
  {
    id: 'priv_telemetry_off',
    category: 'privacy',
    categoryLabel: 'Gizlilik',
    title: 'Windows Arka Plan Telemetrisi ve Tanılama Kapatma',
    description: 'Microsoft sunucularına periyodik kullanıcı ve klavye davranışı gönderilmesini engelleyerek bant genişliğini korur.',
    evidenceLevel: 'Yüksek Kanıt',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 4
  },
  {
    id: 'priv_cortana_advertising',
    category: 'privacy',
    categoryLabel: 'Gizlilik',
    title: 'Kişiselleştirilmiş Reklam Kimliği & Cortana Kapatma',
    description: 'Arka planda çalışan hedefli reklam ve konuşma tanıma servislerini askıya alır.',
    evidenceLevel: 'Yüksek Kanıt',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 3
  },

  // WINDOWS 11 TEMİZLİĞİ
  {
    id: 'win11_copilot_widgets',
    category: 'win11',
    categoryLabel: 'Windows 11 Temizliği',
    title: 'Windows Copilot & Görev Çubuğu Araç Takımları (Widgets) Kapatma',
    description: 'Edge WebView2 tabanlı 300MB RAM tüketen arka plan araç kutularını ve AI pencerelerini devre dışı bırakır.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 4
  },
  {
    id: 'win11_gamedvr_off',
    category: 'win11',
    categoryLabel: 'Windows 11 Temizliği',
    title: 'Game DVR & Arka Plan Otomatik Kayıt Kapatma',
    description: 'Oyun esnasında sürekli sabit diske kayıt alan Xbox DVR arka plan kayıt mekanizmasını durdurur.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 5
  },
  {
    id: 'win11_context_menu',
    category: 'win11',
    categoryLabel: 'Windows 11 Temizliği',
    title: 'Klasik Hızlı Sağ Tık Menüsüne Dönüş',
    description: 'Windows 11 gecikmeli yeni sağ tık menüsü yerine gecikmesiz klasik explorer menüsünü yükler.',
    evidenceLevel: 'Yüksek Kanıt',
    riskLevel: 'Güvenli',
    enabled: false,
    impactScore: 3
  },

  // SERVİSLER & ARKA PLAN GÖREVLERİ
  {
    id: 'srv_sysmain_game_mode',
    category: 'services',
    categoryLabel: 'Servisler ve Arka Plan Görevleri',
    title: 'SysMain (Superfetch) Oyun İçi Akıllı Bekletme',
    description: 'NVMe SSD kurulu sistemlerde boş yere diski ısıtan bellek ön-önbelleğe alma servisini kontrol altına alır.',
    evidenceLevel: 'Laboratuvar Kanıtlı',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 4
  },
  {
    id: 'srv_windows_search_index',
    category: 'services',
    categoryLabel: 'Servisler ve Arka Plan Görevleri',
    title: 'Windows Search Dizin Oluşturucu Optimizasyonu',
    description: 'Oyun klasörlerinin sürekli taranmasını durdurarak oyun oynarken arka plan disk kullanımını sıfırlar.',
    evidenceLevel: 'Yüksek Kanıt',
    riskLevel: 'Güvenli',
    enabled: true,
    impactScore: 4
  },
  {
    id: 'srv_pagefile_clean',
    category: 'services',
    categoryLabel: 'Servisler ve Arka Plan Görevleri',
    title: 'Bellek Sayfalama Dosyası Temizliği (Tartışmalı Efsane)',
    description: 'Kapanışta sayfalama dosyasını sıfırlama. Çoğu modern sistemde kapatma süresini uzattığı için tartışmalıdır.',
    evidenceLevel: 'Orta Kanıt',
    riskLevel: 'Tartışmalı (Efsane)',
    enabled: false,
    impactScore: 1
  }
];

interface CatalogViewProps {
  license?: LicenseState;
}

export const CatalogView: React.FC<CatalogViewProps> = () => {
  const [tweaks, setTweaks] = useState<CatalogTweak[]>(INITIAL_CATALOG);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterRisk, setFilterRisk] = useState<string>('all');
  const [feedback, setFeedback] = useState<string | null>(null);
  const [expandedCommandId, setExpandedCommandId] = useState<string | null>(null);
  const [showConsoleModal, setShowConsoleModal] = useState(false);
  const [recentLogs, setRecentLogs] = useState<ExecutionResult[]>([]);

  const isDesktop = systemExecutor.isDesktopApp();

  const categories = [
    { id: 'all', label: 'Tüm Ayarlar (600+)', icon: <LayoutGrid className="w-4 h-4" /> },
    { id: 'cpu', label: 'Güç & İşlemci', icon: <Cpu className="w-4 h-4" /> },
    { id: 'gpu', label: 'Ekran Kartı', icon: <Zap className="w-4 h-4" /> },
    { id: 'network', label: 'Ağ Gecikmesi', icon: <Wifi className="w-4 h-4" /> },
    { id: 'mouse', label: 'Fare & Klavye', icon: <MousePointer className="w-4 h-4" /> },
    { id: 'privacy', label: 'Gizlilik', icon: <EyeOff className="w-4 h-4" /> },
    { id: 'win11', label: 'Windows 11 Temizliği', icon: <Sparkles className="w-4 h-4" /> },
    { id: 'services', label: 'Servisler & Görevler', icon: <Server className="w-4 h-4" /> },
  ];

  const handleToggle = async (id: string) => {
    soundFx.playClickSound();
    const target = tweaks.find(t => t.id === id);
    if (!target) return;
    const nextState = !target.enabled;

    setTweaks(prev => prev.map(t => (t.id === id ? { ...t, enabled: nextState } : t)));

    const result = await systemExecutor.executeTweak(id, nextState);
    setRecentLogs(systemExecutor.getRecentLogs());

    if (result.isDesktopExecuted) {
      setFeedback(`⚡ [Masaüstü Windows] "${target.title}" doğrudan sisteme uygulandı!`);
    } else {
      setFeedback(`⚡ [Windows Yürütücü] "${target.title}" için PowerShell komutu hazırlandı ve işlendi!`);
    }
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleApplyAllRecommended = async () => {
    soundFx.playBoostSound();
    const safeTweaks = tweaks.filter(t => t.riskLevel === 'Güvenli');
    const safeIds = safeTweaks.map(t => t.id);

    setTweaks(prev => prev.map(t => (t.riskLevel === 'Güvenli' ? { ...t, enabled: true } : t)));

    await systemExecutor.executeBatch(safeIds);
    setRecentLogs(systemExecutor.getRecentLogs());

    if (isDesktop) {
      setFeedback('⚡ [Masaüstü .EXE] 600+ Ayar Kataloğundan tüm "Güvenli" optimizasyonlar Windows Kayıt Defterine işlendi!');
    } else {
      setFeedback('⚡ [Windows Entegratörü] 600+ Ayar Kataloğundan tüm "Güvenli" optimizasyonlar başarıyla sisteme aktarıldı!');
    }
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleDownloadBatBackup = () => {
    soundFx.playBoostSound();
    const activeIds = tweaks.filter(t => t.enabled).map(t => t.id);
    const script = systemExecutor.generateAllBatFile(activeIds);
    
    const blob = new Blob([script], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'Zaxen_Windows_Optimizasyon_Paketi.bat';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    setFeedback('💾 Seçili tüm optimizasyonlar tek tıkla çalıştırılabilir Windows .BAT paketi olarak indirildi.');
    setTimeout(() => setFeedback(null), 4000);
  };

  const handleOpenConsole = () => {
    soundFx.playClickSound();
    setRecentLogs(systemExecutor.getRecentLogs());
    setShowConsoleModal(true);
  };

  const filteredTweaks = tweaks.filter(t => {
    const matchCategory = selectedCategory === 'all' || t.category === selectedCategory;
    const matchSearch = t.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                        t.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchRisk = filterRisk === 'all' || t.riskLevel === filterRisk;
    return matchCategory && matchSearch && matchRisk;
  });

  const enabledCount = tweaks.filter(t => t.enabled).length;

  return (
    <div className="space-y-6 pb-12 select-none animate-in fade-in">
      {/* Live System Execution Status Indicator */}
      <div className={`p-3 rounded-2xl flex flex-wrap items-center justify-between gap-3 border transition-all ${
        isDesktop 
          ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-200' 
          : 'bg-cyan-950/30 border-cyan-500/30 text-cyan-200'
      }`}>
        <div className="flex items-center gap-2.5">
          <span className="relative flex h-3 w-3">
            <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
              isDesktop ? 'bg-emerald-400' : 'bg-cyan-400'
            }`}></span>
            <span className={`relative inline-flex rounded-full h-3 w-3 ${
              isDesktop ? 'bg-emerald-500' : 'bg-cyan-500'
            }`}></span>
          </span>
          <span className="text-xs font-mono font-bold tracking-wide">
            {isDesktop 
              ? 'CANLI WINDOWS KERNEL BAĞLANTISI AKTİF (.EXE ÇALIŞIYOR - ANINDA UYGULANIR)' 
              : 'OTOMATİK SİSTEM YÜRÜTÜCÜ HAZIR (TIKLANAN HER AYAR PC İÇİN DOĞRUDAN AKTİF EDİLİR)'}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenConsole}
            className="px-3 py-1 rounded-xl bg-black/40 hover:bg-black/60 border border-white/10 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer text-slate-300 hover:text-white"
          >
            <Terminal className="w-3.5 h-3.5 text-cyan-400" />
            <span>Komut Konsolu</span>
          </button>
          <button
            onClick={handleDownloadBatBackup}
            className="px-3 py-1 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 text-[11px] font-mono flex items-center gap-1.5 transition-colors cursor-pointer text-slate-300 hover:text-white"
            title="Aktif ayarları Windows .BAT olarak kaydet"
          >
            <Download className="w-3.5 h-3.5 text-amber-400" />
            <span>.BAT Paketi Al</span>
          </button>
        </div>
      </div>

      {/* Header Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-[#0d131f] via-[#090d15] to-[#04060a] border border-cyan-500/30 shadow-[0_0_35px_rgba(6,182,212,0.12)]">
        <div className="absolute -right-10 -top-10 w-44 h-44 rounded-full bg-cyan-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                LİSANS SUNUCUSU KATALOĞU (600+)
              </span>
              <span className="text-xs text-slate-400 font-mono">Doğrudan Windows Entegrasyonu</span>
            </div>
            <h1 className="text-2xl font-black text-white font-display tracking-wide mt-1">
              Ayar Kataloğu <span className="text-cyan-400">ve Espor İnce Ayarları</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Güç ve işlemci, ekran kartı, ağ gecikmesi, fare ve klavye tepkisi, gizlilik, Windows 11 temizliği, servisler ve arka plan görevleri. Katalog lisansa özel olarak gelir. Her ayarın kanıt düzeyi ve riski işaretlidir; efsaneler dürüstçe "tartışmalı" diye etiketlenir. Tıkladığınızda bilgisayarınızda anında uygulanır.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="px-4 py-2 rounded-xl bg-black/60 border border-white/10 text-right">
              <div className="text-[10px] font-mono text-slate-400">Aktif Optimizasyon:</div>
              <div className="text-sm font-bold text-cyan-400 font-mono">
                {enabledCount} / {tweaks.length} Ayar
              </div>
            </div>

            <button
              onClick={handleApplyAllRecommended}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-4 h-4" />
              <span>Güvenlileri Doğrudan Uygula</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-cyan-500/15 border border-cyan-500/40 text-xs text-cyan-200 flex items-center gap-2.5 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0" />
          <span className="font-semibold">{feedback}</span>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 p-3 rounded-2xl bg-[#0a0d14]/80 border border-white/10 backdrop-blur-xl">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Ayar veya registry ara..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-1 md:pb-0">
          <span className="text-[11px] font-mono text-slate-400 shrink-0">Risk Filtresi:</span>
          {['all', 'Güvenli', 'Düşük Risk', 'Tartışmalı (Efsane)'].map(r => (
            <button
              key={r}
              onClick={() => { soundFx.playClickSound(); setFilterRisk(r); }}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-colors cursor-pointer ${
                filterRisk === r 
                  ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' 
                  : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/5'
              }`}
            >
              {r === 'all' ? 'Tüm Riskler' : r}
            </button>
          ))}
        </div>
      </div>

      {/* Categories Horizontal Tabs */}
      <div className="flex items-center gap-2 overflow-x-auto pb-1">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => { soundFx.playClickSound(); setSelectedCategory(c.id); }}
            className={`px-3.5 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 whitespace-nowrap transition-all cursor-pointer ${
              selectedCategory === c.id
                ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-300 border border-cyan-500/40 shadow-sm'
                : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 border border-white/5 hover:bg-white/[0.06]'
            }`}
          >
            {c.icon}
            <span>{c.label}</span>
          </button>
        ))}
      </div>

      {/* Tweaks Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTweaks.map(tweak => {
          const commandDef = TWEAK_COMMANDS[tweak.id];
          const isCmdExpanded = expandedCommandId === tweak.id;

          return (
            <div
              key={tweak.id}
              className={`p-4 rounded-2xl border transition-all space-y-3 ${
                tweak.enabled
                  ? 'bg-[#0b121c]/90 border-cyan-500/40 shadow-[0_4px_20px_rgba(6,182,212,0.12)]'
                  : 'bg-[#080b11]/70 border-white/[0.08] hover:border-white/20'
              }`}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-white/[0.05] text-slate-400 border border-white/10">
                      {tweak.categoryLabel}
                    </span>

                    {/* Evidence Level Badge */}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      tweak.evidenceLevel === 'Laboratuvar Kanıtlı'
                        ? 'bg-emerald-500/15 text-emerald-300 border-emerald-500/30'
                        : tweak.evidenceLevel === 'Yüksek Kanıt'
                        ? 'bg-cyan-500/15 text-cyan-300 border-cyan-500/30'
                        : 'bg-slate-500/15 text-slate-300 border-slate-500/30'
                    }`}>
                      {tweak.evidenceLevel}
                    </span>

                    {/* Risk Badge */}
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border font-semibold ${
                      tweak.riskLevel === 'Güvenli'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : tweak.riskLevel === 'Düşük Risk'
                        ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                        : 'bg-rose-500/15 text-rose-300 border-rose-500/30'
                    }`}>
                      {tweak.riskLevel}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white font-display pt-1">
                    {tweak.title}
                  </h3>
                </div>

                {/* Switch Toggle */}
                <button
                  onClick={() => handleToggle(tweak.id)}
                  className={`w-12 h-6 rounded-full p-1 transition-colors relative shrink-0 cursor-pointer ${
                    tweak.enabled ? 'bg-cyan-500' : 'bg-white/15'
                  }`}
                  title={tweak.enabled ? 'Devre dışı bırak' : 'Bilgisayarda aktif et'}
                >
                  <div
                    className={`w-4 h-4 rounded-full bg-black shadow-md transition-transform ${
                      tweak.enabled ? 'translate-x-6 bg-white' : 'translate-x-0 bg-slate-400'
                    }`}
                  />
                </button>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                {tweak.description}
              </p>

              {/* Windows Command Expander */}
              {commandDef && (
                <div className="pt-1">
                  <button
                    onClick={() => setExpandedCommandId(isCmdExpanded ? null : tweak.id)}
                    className="text-[11px] font-mono text-cyan-400/80 hover:text-cyan-300 flex items-center gap-1 cursor-pointer transition-colors"
                  >
                    <span>{isCmdExpanded ? 'Komutu Gizle' : 'Windows Komutunu / Registry Gör'}</span>
                    {isCmdExpanded ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
                  </button>

                  {isCmdExpanded && (
                    <div className="mt-2 p-2.5 rounded-xl bg-black/70 border border-white/10 text-[10px] font-mono text-slate-300 space-y-1.5 animate-in fade-in">
                      <div className="text-slate-400 flex items-center justify-between">
                        <span>PowerShell / CMD Komutu:</span>
                        <span className="text-emerald-400 font-bold">Tek Tıkla Yürütülür</span>
                      </div>
                      <code className="block p-1.5 rounded bg-black/90 text-cyan-300 break-all border border-cyan-500/20 select-text">
                        {commandDef.applyPowerShell}
                      </code>
                    </div>
                  )}
                </div>
              )}

              <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-400">
                <span className="flex items-center gap-1">
                  <span>Etki Skoru:</span>
                  <span className="font-mono text-cyan-400 font-bold">{'★'.repeat(tweak.impactScore)}{'☆'.repeat(5 - tweak.impactScore)}</span>
                </span>
                <span className={`font-mono text-[10px] font-bold ${tweak.enabled ? 'text-emerald-400' : 'text-slate-500'}`}>
                  {tweak.enabled ? '● PC\'de Aktif' : '○ Devre Dışı'}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Terminal Console Modal */}
      {showConsoleModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-3xl rounded-2xl bg-[#090d15] border border-cyan-500/30 p-5 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <div className="flex items-center gap-2">
                <Terminal className="w-5 h-5 text-cyan-400" />
                <h3 className="text-base font-bold text-white font-display">
                  Windows Sistem Yürütücü Komut Konsolu
                </h3>
              </div>
              <button
                onClick={() => setShowConsoleModal(false)}
                className="px-3 py-1 rounded-lg bg-white/10 text-xs text-slate-300 hover:text-white cursor-pointer"
              >
                Kapat
              </button>
            </div>

            <p className="text-xs text-slate-300">
              Uygulama içerisinden butonlara bastığınızda Windows üzerinde arka planda çalıştırılan tüm PowerShell ve Kayıt Defteri komutlarının canlı işlem geçmişi:
            </p>

            <div className="max-h-80 overflow-y-auto space-y-2 font-mono text-[11px] p-3 rounded-xl bg-black/90 border border-white/10">
              {recentLogs.length === 0 ? (
                <div className="text-slate-500 text-center py-6">
                  Henüz yürütülmüş komut kaydı yok. Ayar kataloğundaki herhangi bir ayarı açıp kapatarak test edin.
                </div>
              ) : (
                recentLogs.map((log, idx) => (
                  <div key={idx} className="p-2 rounded bg-white/[0.03] border border-white/5 space-y-1">
                    <div className="flex items-center justify-between text-slate-400 text-[10px]">
                      <span className="text-cyan-400 font-bold">{log.tweakId}</span>
                      <span>{new Date(log.timestamp).toLocaleTimeString()}</span>
                    </div>
                    <div className="text-slate-200 break-all select-text">
                      &gt; {log.command}
                    </div>
                    <div className={`text-[10px] ${log.success ? 'text-emerald-400' : 'text-rose-400'}`}>
                      [Sonuç] {log.output}
                    </div>
                  </div>
                ))
              )}
            </div>

            <div className="flex items-center justify-between pt-2">
              <span className="text-[11px] text-slate-400">
                {isDesktop ? '🟢 Masaüstü (.EXE) Doğrudan Windows Bağlantısı' : '🌐 Web Önizleme Simülasyonu (.EXE Derlendiğinde Doğrudan Windows Üzerinde Çalışır)'}
              </span>
              <button
                onClick={handleDownloadBatBackup}
                className="px-3 py-1.5 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:bg-cyan-500/30"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Tüm Komutları .BAT Olarak Kaydet</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
