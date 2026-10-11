import React, { useState } from 'react';
import { 
  Zap, 
  Cpu, 
  Layers, 
  HardDrive, 
  Flame, 
  CheckCircle, 
  ArrowUpRight, 
  ShieldAlert, 
  ShieldCheck, 
  Sparkles, 
  Activity,
  Maximize2
} from 'lucide-react';
import { SystemMetrics, LicenseState, AccentColor } from '../../types';
import { OptimizerService } from '../../services/optimizerService';
import { THEMES } from '../../services/themeHelper';
import { soundFx } from '../../services/soundFxService';

interface DashboardViewProps {
  metrics: SystemMetrics;
  license: LicenseState;
  accentColor?: AccentColor;
  onNavigateTab: (tab: any) => void;
  onOpenLicenseModal: () => void;
  onQuickCleanRam: () => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  metrics,
  license,
  accentColor = 'red',
  onNavigateTab,
  onOpenLicenseModal,
  onQuickCleanRam,
}) => {
  const [isBoosting, setIsBoosting] = useState(false);
  const [boostCompletedData, setBoostCompletedData] = useState<{
    appliedCount: number;
    freedRamGB: number;
    freedDiskGB: number;
  } | null>(null);

  const optimizerService = OptimizerService.getInstance();
  const theme = THEMES[accentColor] || THEMES.red;

  const handleQuickBoost = async () => {
    if (!license.isLicensed || license.isExpired) {
      onOpenLicenseModal();
      return;
    }

    soundFx.playBoostSound();
    setIsBoosting(true);
    try {
      await new Promise(r => setTimeout(r, 1300));
      const res = await optimizerService.executeQuickBoost();
      soundFx.playCleanSound();
      setBoostCompletedData({
        appliedCount: res.appliedCount,
        freedRamGB: res.freedRamGB,
        freedDiskGB: res.freedDiskGB,
      });
    } finally {
      setIsBoosting(false);
    }
  };

  // Helper for rendering SVG sparklines
  const renderSparkline = (data: number[], color: string, height: number = 36) => {
    if (!data || data.length === 0) return null;
    const min = 0;
    const max = 100;
    const width = 140;
    const step = width / (data.length - 1);
    
    const points = data.map((val, idx) => {
      const x = idx * step;
      const y = height - ((val - min) / (max - min)) * height;
      return `${x},${Math.max(2, Math.min(height - 2, y))}`;
    }).join(' ');

    return (
      <svg width={width} height={height} className="overflow-visible">
        <polyline
          fill="none"
          stroke={color}
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          points={points}
        />
      </svg>
    );
  };

  // Health score calculation & circle circumference
  const score = metrics.overallHealthScore;
  const radius = 54;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  return (
    <div className="space-y-6 pb-6 select-none">
      {/* Top Banner: PC Durumu & Hızlı Boost */}
      <div className="relative overflow-hidden rounded-2xl glass-panel p-6 shadow-2xl">
        <div 
          className="absolute top-0 right-0 w-96 h-96 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20 opacity-20"
          style={{ backgroundColor: theme.primaryHex }}
        ></div>

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-xl">
            <div className="flex items-center gap-2">
              <span 
                className="px-2.5 py-0.5 rounded text-[11px] font-mono tracking-wider font-semibold border"
                style={{
                  backgroundColor: `${theme.glowHex}`,
                  color: theme.primaryHex,
                  borderColor: `${theme.primaryHex}40`
                }}
              >
                SİSTEM DURUMU
              </span>
              <span className="text-xs text-slate-400">Windows 11 x64 Enterprise Optimizasyonu</span>
            </div>

            <h1 className="text-2xl lg:text-3xl font-extrabold text-white tracking-tight font-display">
              PC'n Rekabetçi Oyunlara <span style={{ color: theme.primaryHex }}>Hazır mı?</span>
            </h1>

            <p className="text-xs lg:text-sm text-slate-400 leading-relaxed">
              Arka plan gecikmelerini sıfırla, CPU çekirdek önceliğini kilitle ve gereksiz bellek yükünü anında boşalt. Tüm işlemler otomatik geri alınabilir yedek koruması altındadır.
            </p>
          </div>

          {/* Big Quick Boost Action */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto shrink-0">
            <button
              onClick={handleQuickBoost}
              disabled={isBoosting}
              className="relative px-8 py-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all transform active:scale-95 shadow-xl border border-white/20 flex items-center justify-center gap-3 group overflow-hidden"
              style={{
                backgroundColor: isBoosting ? '#4c0519' : theme.primaryHex,
                boxShadow: `0 0 28px ${theme.glowHex}`
              }}
            >
              <div className="absolute inset-0 bg-white/10 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              {isBoosting ? (
                <>
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  <span>SİSTEM OPTİMİZE EDİLİYOR...</span>
                </>
              ) : (
                <>
                  <Zap className="w-5 h-5 fill-white text-white group-hover:scale-110 transition-transform" />
                  <span className="text-base font-extrabold">⚡ HIZLI BOOST</span>
                </>
              )}
            </button>
            <button
              onClick={() => {
                soundFx.playClickSound();
                onNavigateTab('analysis');
              }}
              className="px-5 py-4 rounded-xl bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 text-xs font-semibold flex items-center justify-center gap-2 transition-colors backdrop-blur-md"
            >
              <span>Sistemi Tara</span>
              <ArrowUpRight className="w-4 h-4 text-slate-400" />
            </button>
          </div>
        </div>

        {/* Boost feedback bar if completed */}
        {boostCompletedData && (
          <div className="mt-4 p-3 rounded-lg bg-emerald-950/40 border border-emerald-800/60 flex items-center justify-between text-xs text-emerald-300 animate-in fade-in">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Optimizasyon Başarılı:</strong> {boostCompletedData.appliedCount} ayar uygulandı, {boostCompletedData.freedRamGB} GB RAM ve {boostCompletedData.freedDiskGB} GB disk alanı serbest bırakıldı!
              </span>
            </div>
            <button
              onClick={() => setBoostCompletedData(null)}
              className="text-emerald-400 hover:text-white underline text-[11px]"
            >
              Kapat
            </button>
          </div>
        )}
      </div>

      {/* Main Grid: Health Score Card + Real-time Telemetry Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Sistem Sağlık Skoru (4 Cols) */}
        <div className="lg:col-span-4 glass-panel rounded-2xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-white font-tech">Sistem Sağlık Skoru</h2>
                <p className="text-[11px] text-slate-400">Genel PC kararlılık ve optimizasyon durumu</p>
              </div>
              <ShieldCheck className="w-5 h-5 text-emerald-400" />
            </div>

            {/* Circular Gauge */}
            <div className="flex flex-col items-center justify-center py-4">
              <div className="relative w-36 h-36 flex items-center justify-center">
                <svg className="w-full h-full transform -rotate-90">
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    className="stroke-white/10"
                    strokeWidth="10"
                    fill="transparent"
                  />
                  <circle
                    cx="72"
                    cy="72"
                    r={radius}
                    stroke="currentColor"
                    strokeWidth="10"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    fill="transparent"
                    className={`transition-all duration-1000 ${
                      score >= 85 
                        ? 'text-emerald-500' 
                        : score >= 70 
                        ? 'text-amber-500' 
                        : ''
                    }`}
                    style={score < 70 ? { color: theme.primaryHex } : {}}
                  />
                </svg>
                <div className="absolute inset-0 flex flex-col items-center justify-center">
                  <span className="text-3xl font-extrabold font-mono text-white tracking-tight">
                    {score}
                  </span>
                  <span className="text-[10px] text-slate-400 font-medium">/ 100 PUAN</span>
                </div>
              </div>
              <div className="mt-2 text-center">
                <span className={`text-xs font-semibold ${score >= 85 ? 'text-emerald-400' : 'text-amber-400'}`}>
                  {score >= 85 ? 'Sistem Mükemmel Seviyede' : 'Optimizasyon Potansiyeli Mevcut'}
                </span>
              </div>
            </div>

            {/* Category Health Bars */}
            <div className="space-y-2.5 mt-2">
              <div className="text-[11px] font-bold text-slate-300 uppercase tracking-wider mb-2">
                Kategori Durumları
              </div>

              {[
                { label: 'İşlemci (CPU)', score: metrics.categoryScores.cpu },
                { label: 'Bellek (RAM)', score: metrics.categoryScores.ram },
                { label: 'Grafik Kartı (GPU)', score: metrics.categoryScores.gpu },
                { label: 'Depolama & SSD', score: metrics.categoryScores.disk },
                { label: 'Başlangıç Uygulamaları', score: metrics.categoryScores.startup },
                { label: 'Windows Ayarları', score: metrics.categoryScores.windowsSettings },
              ].map(cat => (
                <div key={cat.label} className="space-y-1">
                  <div className="flex justify-between text-[11px]">
                    <span className="text-slate-400">{cat.label}</span>
                    <span className="font-mono text-slate-200 font-semibold">%{cat.score}</span>
                  </div>
                  <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full transition-all duration-500 ${
                        cat.score >= 80 ? 'bg-emerald-500' : cat.score >= 65 ? 'bg-amber-500' : ''
                      }`}
                      style={{ 
                        width: `${cat.score}%`,
                        backgroundColor: cat.score < 65 ? theme.primaryHex : undefined
                      }}
                    ></div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 pt-3 border-t border-white/[0.08] flex items-center justify-between text-[11px]">
            <span className="text-slate-500">Güvenli Yedekleme</span>
            <span className="text-emerald-400 font-medium flex items-center gap-1">
              <CheckCircle className="w-3 h-3" />
              Sistem Koruması Devrede
            </span>
          </div>
        </div>

        {/* Right Column: Canlı Donanım Kartları (8 Cols) */}
        <div className="lg:col-span-8 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4" style={{ color: theme.primaryHex }} />
                Canlı Donanım & Sıcaklık Monitörü
              </h2>
              <p className="text-[11px] text-slate-400">Gerçek zamanlı sensör okumaları ve bellek durumu</p>
            </div>
            <button
              onClick={() => {
                soundFx.playClickSound();
                onNavigateTab('tools');
              }}
              className="text-xs hover:text-white flex items-center gap-1 transition-colors"
              style={{ color: theme.primaryHex }}
            >
              <span>Ayrıntılı Monitör</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {/* CPU Card */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-4 transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-tech">İşlemci (CPU)</h3>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{metrics.cpu.model}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold font-mono text-white">%{metrics.cpu.usagePercent}</div>
                  <div className={`text-[10px] font-mono flex items-center justify-end gap-1 ${
                    metrics.cpu.temperatureC >= 75 ? 'text-rose-400 font-bold' : 'text-slate-400'
                  }`}>
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{metrics.cpu.temperatureC}°C</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <div className="text-[11px] text-slate-500 font-mono">
                  <div>Çekirdek: {metrics.cpu.cores}</div>
                  <div>Saat: {metrics.cpu.clockSpeedGHz} GHz</div>
                </div>
                <div>
                  {renderSparkline(metrics.cpu.history, '#3b82f6')}
                </div>
              </div>
            </div>

            {/* GPU Card */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-4 transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-tech">Ekran Kartı (GPU)</h3>
                    <div className="text-[10px] text-slate-400 truncate max-w-[150px]">{metrics.gpu.model}</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold font-mono text-white">%{metrics.gpu.usagePercent}</div>
                  <div className={`text-[10px] font-mono flex items-center justify-end gap-1 ${
                    metrics.gpu.temperatureC >= 75 ? 'text-rose-400 font-bold' : 'text-slate-400'
                  }`}>
                    <Flame className="w-3 h-3 text-amber-400" />
                    <span>{metrics.gpu.temperatureC}°C</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 border-t border-white/[0.06]">
                <div className="text-[11px] text-slate-500 font-mono">
                  <div>VRAM: {metrics.gpu.vramUsedGB} / {metrics.gpu.vramTotalGB} GB</div>
                  <div>PCIe: Gen 4 x16</div>
                </div>
                <div>
                  {renderSparkline(metrics.gpu.history, '#10b981')}
                </div>
              </div>
            </div>

            {/* RAM Card */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-4 transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div 
                    className="w-8 h-8 rounded-xl border flex items-center justify-center"
                    style={{ 
                      backgroundColor: `${theme.glowHex}`,
                      borderColor: `${theme.primaryHex}40`,
                      color: theme.primaryHex
                    }}
                  >
                    <Sparkles className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-tech">Sistem Belleği (RAM)</h3>
                    <div className="text-[10px] text-slate-400">{metrics.ram.speedMHz} MHz DDR5 Dual-Channel</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold font-mono text-white">%{metrics.ram.usagePercent}</div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {metrics.ram.usedGB} / {metrics.ram.totalGB} GB
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full rounded-full transition-all"
                    style={{ 
                      width: `${metrics.ram.usagePercent}%`,
                      backgroundColor: theme.primaryHex
                    }}
                  ></div>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[11px] text-slate-500 font-mono">Boş: {metrics.ram.freeGB} GB</span>
                  <button
                    onClick={() => {
                      soundFx.playCleanSound();
                      onQuickCleanRam();
                    }}
                    className="text-[10px] font-semibold underline"
                    style={{ color: theme.primaryHex }}
                  >
                    Hızlı RAM Boşalt
                  </button>
                </div>
              </div>
            </div>

            {/* Disk Card */}
            <div className="glass-panel glass-panel-hover rounded-2xl p-4 transition-all space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <HardDrive className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="text-xs font-bold text-white font-tech">Sürücü ({metrics.disk.driveLetter})</h3>
                    <div className="text-[10px] text-slate-400">NVMe High-Speed SSD</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-extrabold font-mono text-white">%{metrics.disk.usagePercent}</div>
                  <div className="text-[10px] font-mono text-slate-400">
                    {metrics.disk.usedGB} / {metrics.disk.totalGB} GB
                  </div>
                </div>
              </div>

              <div className="space-y-1.5 pt-1 border-t border-white/[0.06]">
                <div className="w-full h-1.5 bg-white/10 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-purple-500 rounded-full transition-all"
                    style={{ width: `${metrics.disk.usagePercent}%` }}
                  ></div>
                </div>
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-slate-500 font-mono">Boş: {metrics.disk.freeGB} GB</span>
                  <span className="text-amber-400 font-mono font-medium">
                    {metrics.disk.cleanableGB} GB Temizlenebilir
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts Bar */}
          <div className="p-3.5 rounded-2xl glass-panel flex flex-wrap items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-2 text-slate-300">
              <ShieldAlert className="w-4 h-4" style={{ color: theme.primaryHex }} />
              <span>Önerilen Hızlı Eylemler:</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <button 
                onClick={() => {
                  soundFx.playClickSound();
                  onNavigateTab('boost');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 font-medium transition-colors"
              >
                Oyun Modunu Ayarla
              </button>
              <button 
                onClick={() => {
                  soundFx.playClickSound();
                  onNavigateTab('tools');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 font-medium transition-colors"
              >
                Disk Temizliğini Aç
              </button>
              <button 
                onClick={() => {
                  soundFx.playClickSound();
                  onNavigateTab('fps');
                }}
                className="px-2.5 py-1 rounded-lg bg-white/[0.04] hover:bg-white/[0.08] text-slate-200 border border-white/10 font-medium transition-colors"
              >
                10 Sn FPS Testi Yap
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
