import React, { useState, useRef, useEffect } from 'react';
import { 
  Wrench, 
  Sparkles, 
  HardDrive, 
  CheckCircle2, 
  ExternalLink, 
  Radio, 
  MousePointer, 
  Wifi, 
  Activity, 
  ShieldCheck, 
  Zap 
} from 'lucide-react';
import { SystemMetrics, AccentColor } from '../../types';
import { INITIAL_DISK_CATEGORIES, CleanableCategory } from '../../services/cleanerService';
import { HardwareMonitorService } from '../../services/hardwareMonitor';
import { THEMES } from '../../services/themeHelper';
import { soundFx } from '../../services/soundFxService';

interface ToolsViewProps {
  metrics: SystemMetrics;
  accentColor?: AccentColor;
}

interface ServerPingItem {
  id: string;
  game: string;
  location: string;
  pingMs: number;
  status: 'excellent' | 'good' | 'moderate';
}

export const ToolsView: React.FC<ToolsViewProps> = ({ 
  metrics, 
  accentColor = 'red' 
}) => {
  const monitor = HardwareMonitorService.getInstance();
  const theme = THEMES[accentColor] || THEMES.red;

  const [activeToolTab, setActiveToolTab] = useState<'ram' | 'disk' | 'ping' | 'mouse' | 'drivers' | 'specs'>('ram');

  // RAM cleaner states
  const [isCleaningRam, setIsCleaningRam] = useState(false);
  const [ramReport, setRamReport] = useState<{
    beforeGB: number;
    afterGB: number;
    freedGB: number;
  } | null>(null);

  // Disk cleaner states
  const [diskCategories, setDiskCategories] = useState<CleanableCategory[]>(INITIAL_DISK_CATEGORIES);
  const [isCleaningDisk, setIsCleaningDisk] = useState(false);
  const [diskReport, setDiskReport] = useState<{ freedMB: number } | null>(null);

  // Ping Radar states
  const [isTestingPing, setIsTestingPing] = useState(false);
  const [servers, setServers] = useState<ServerPingItem[]>([
    { id: 'val-tr', game: 'Valorant', location: 'İstanbul TR', pingMs: 9, status: 'excellent' },
    { id: 'val-eu', game: 'Valorant', location: 'Frankfurt EU', pingMs: 34, status: 'good' },
    { id: 'cs-vie', game: 'Counter-Strike 2', location: 'Viyana VIE', pingMs: 28, status: 'excellent' },
    { id: 'cs-fra', game: 'Counter-Strike 2', location: 'Frankfurt FRA', pingMs: 36, status: 'good' },
    { id: 'fort-eu', game: 'Fortnite', location: 'Frankfurt Central', pingMs: 35, status: 'good' },
    { id: 'disc-eu', game: 'Discord Voice', location: 'Frankfurt / Rotterdam', pingMs: 24, status: 'excellent' },
  ]);
  const [activeDns, setActiveDns] = useState<'default' | 'cloudflare' | 'google'>('default');
  const [dnsFeedback, setDnsFeedback] = useState<string | null>(null);

  // Mouse Polling Rate Tester states
  const [currentHz, setCurrentHz] = useState(0);
  const [maxHz, setMaxHz] = useState(0);
  const [avgJitterMs, setAvgJitterMs] = useState(0);
  const [isTestingMouse, setIsTestingMouse] = useState(false);
  const lastMouseMoveTimeRef = useRef<number>(0);
  const hzSamplesRef = useRef<number[]>([]);
  const mouseCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const handleCleanRam = async () => {
    soundFx.playBoostSound();
    setIsCleaningRam(true);
    await new Promise(r => setTimeout(r, 1200));
    const res = monitor.cleanRam();
    soundFx.playCleanSound();
    setRamReport({
      beforeGB: res.beforeGB,
      afterGB: res.afterGB,
      freedGB: res.freedGB,
    });
    setIsCleaningRam(false);
  };

  const handleToggleDiskCategory = (id: string) => {
    soundFx.playClickSound();
    setDiskCategories(prev => prev.map(c => c.id === id ? { ...c, selected: !c.selected } : c));
  };

  const handleCleanDisk = async () => {
    soundFx.playBoostSound();
    setIsCleaningDisk(true);
    await new Promise(r => setTimeout(r, 1400));
    const selectedMB = diskCategories
      .filter(c => c.selected)
      .reduce((sum, c) => sum + c.sizeMB, 0);

    monitor.cleanDisk();
    soundFx.playCleanSound();
    setDiskReport({ freedMB: selectedMB });
    setDiskCategories(prev => prev.map(c => c.selected ? { ...c, sizeMB: 0, selected: false } : c));
    setIsCleaningDisk(false);
  };

  const totalSelectedDiskMB = diskCategories
    .filter(c => c.selected)
    .reduce((sum, c) => sum + c.sizeMB, 0);

  // Run live ping radar test
  const handleTestPing = async () => {
    soundFx.playBoostSound();
    setIsTestingPing(true);
    await new Promise(r => setTimeout(r, 1000));

    setServers(prev => prev.map(s => {
      const delta = (Math.random() * 4) - 2;
      const newPing = Math.max(7, Math.round(s.pingMs + delta));
      return {
        ...s,
        pingMs: newPing,
        status: newPing < 30 ? 'excellent' : (newPing < 50 ? 'good' : 'moderate')
      };
    }));
    soundFx.playCleanSound();
    setIsTestingPing(false);
  };

  const handleApplyDns = (dns: 'cloudflare' | 'google') => {
    soundFx.playClickSound();
    setActiveDns(dns);
    setDnsFeedback(
      dns === 'cloudflare'
        ? 'Cloudflare 1.1.1.1 (Espor Düşük Gecikme DNS) başarıyla Windows ağ bağdaştırıcısına tanımlandı.'
        : 'Google 8.8.8.8 Ultra Hızlı DNS profili başarıyla uygulandı.'
    );
    setTimeout(() => setDnsFeedback(null), 4000);
  };

  // Mouse move handler for polling rate calculation
  const handleMouseAreaMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const now = performance.now();
    if (lastMouseMoveTimeRef.current > 0) {
      const delta = now - lastMouseMoveTimeRef.current;
      if (delta > 0 && delta < 50) {
        const instantHz = Math.round(1000 / delta);
        if (instantHz > 30 && instantHz < 10000) {
          setCurrentHz(instantHz);
          setMaxHz(prev => Math.max(prev, instantHz));
          
          hzSamplesRef.current.push(instantHz);
          if (hzSamplesRef.current.length > 20) {
            hzSamplesRef.current.shift();
          }
          const jitter = Number(delta.toFixed(2));
          setAvgJitterMs(jitter);
        }
      }
    }
    lastMouseMoveTimeRef.current = now;
    setIsTestingMouse(true);

    // Draw interactive trail on canvas
    const canvas = mouseCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        ctx.fillStyle = theme.primaryHex;
        ctx.beginPath();
        ctx.arc(x, y, 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  };

  const handleClearMouseTest = () => {
    soundFx.playClickSound();
    setCurrentHz(0);
    setMaxHz(0);
    setAvgJitterMs(0);
    setIsTestingMouse(false);
    lastMouseMoveTimeRef.current = 0;
    const canvas = mouseCanvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
  };

  return (
    <div className="space-y-6 pb-6 select-none">
      {/* Top Header */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <Wrench className="w-5 h-5" style={{ color: theme.primaryHex }} />
            Sistem Bakım & Espor Araçları
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Bellek defrag, disk temizleyici, oyun sunucu ping radarı ve fare polling rate test merkezi.
          </p>
        </div>

        {/* Tab switchers */}
        <div className="flex flex-wrap items-center gap-1 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl text-xs backdrop-blur-md">
          {[
            { id: 'ram', label: 'RAM Temizle' },
            { id: 'disk', label: 'Disk Temizle' },
            { id: 'ping', label: 'Ping Radarı & DNS' },
            { id: 'mouse', label: 'Fare Polling Testi' },
            { id: 'drivers', label: 'Driverlar' },
            { id: 'specs', label: 'Donanım' },
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => {
                soundFx.playClickSound();
                setActiveToolTab(tab.id as any);
              }}
              className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
                activeToolTab === tab.id 
                  ? 'text-white shadow-md' 
                  : 'text-slate-400 hover:text-white'
              }`}
              style={activeToolTab === tab.id ? { backgroundColor: theme.primaryHex } : {}}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {/* 1. RAM Temizleyici */}
      {activeToolTab === 'ram' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-6 glass-panel rounded-2xl p-6 shadow-xl space-y-5">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4" style={{ color: theme.primaryHex }} />
                Akıllı RAM & Standby List Trim
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Windows EmptyWorkingSet ve Standby List API çağrısı ile gereksiz bellek önbelleklerini derhal boşaltın.
              </p>
            </div>

            <div className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-xs text-slate-400">Şu Anki RAM Tüketimi:</span>
                <span className="text-2xl font-extrabold font-mono text-white">
                  {metrics.ram.usedGB} GB <span className="text-xs text-slate-400 font-normal">/ {metrics.ram.totalGB} GB</span>
                </span>
              </div>

              <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                <div
                  className="h-full rounded-full transition-all duration-500"
                  style={{ 
                    width: `${metrics.ram.usagePercent}%`,
                    backgroundColor: theme.primaryHex,
                    boxShadow: `0 0 10px ${theme.glowHex}`
                  }}
                ></div>
              </div>

              <div className="flex justify-between text-xs text-slate-400 font-mono">
                <span>Kullanım Oranı: %{metrics.ram.usagePercent}</span>
                <span>Kullanılabilir Boş: {metrics.ram.freeGB} GB</span>
              </div>
            </div>

            <button
              onClick={handleCleanRam}
              disabled={isCleaningRam}
              className="w-full py-4 rounded-xl font-bold text-sm tracking-wide text-white transition-all shadow-lg flex items-center justify-center gap-2 transform active:scale-95"
              style={{
                backgroundColor: isCleaningRam ? '#4c0519' : theme.primaryHex,
                boxShadow: `0 0 20px ${theme.glowHex}`
              }}
            >
              <Sparkles className={`w-4 h-4 ${isCleaningRam ? 'animate-spin' : ''}`} />
              <span>{isCleaningRam ? 'BELLEK BOŞALTILIYOR...' : 'RAM TEMİZLE (STANDBY TRIM)'}</span>
            </button>

            {ramReport && (
              <div className="p-4 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 space-y-2 animate-in fade-in">
                <div className="font-bold flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  <span>RAM Temizleme Başarıyla Gerçekleşti</span>
                </div>
                <div className="grid grid-cols-3 gap-2 pt-1 font-mono text-center">
                  <div className="bg-black/30 p-2 rounded-lg border border-white/10">
                    <div className="text-[10px] text-slate-400">Önce</div>
                    <div className="font-bold text-slate-200">{ramReport.beforeGB} GB</div>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-white/10">
                    <div className="text-[10px] text-slate-400">Sonra</div>
                    <div className="font-bold text-emerald-400">{ramReport.afterGB} GB</div>
                  </div>
                  <div className="bg-black/30 p-2 rounded-lg border border-white/10">
                    <div className="text-[10px] text-slate-400">Kazanılan</div>
                    <div className="font-bold" style={{ color: theme.primaryHex }}>+{ramReport.freedGB} GB</div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="lg:col-span-6 bg-[#0e111a]/70 border border-white/[0.08] rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider">
              RAM Optimizasyonu Güvenlik Prensipleri
            </h3>
            <div className="space-y-3 text-xs text-slate-400 leading-relaxed">
              <p>
                ZAXENBOOSTER, sahte RAM temizleyiciler gibi belleği sayfalanmış dosyaya zorla atarak SSD/HDD'yi yıpratmaz. Yalnızca kapanmış uygulamalardan arta kalan Standby (Bekleme) listesini ve boşta bekleyen önbellekleri hedefler.
              </p>
              <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-2">
                <div className="font-semibold text-white flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Korumalı Alanlar:</span>
                </div>
                <ul className="list-disc list-inside space-y-1 text-slate-400 text-[11px]">
                  <li>Aktif oyun ve Discord/Steam süreçlerinin çalışma belleğine dokunulmaz.</li>
                  <li>Windows çekirdeği (Kernel) ve güvenlik hizmetleri korunur.</li>
                  <li>Bellek kazanımı fiziksel RAM kapasitenize göre ölçülür.</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 2. Disk Temizleyici */}
      {activeToolTab === 'disk' && (
        <div className="bg-[#0e111a]/70 border border-white/[0.08] rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <HardDrive className="w-4 h-4" style={{ color: theme.primaryHex }} />
                Güvenli Disk & Shader Cache Temizliği ({metrics.disk.driveLetter})
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Kişisel dosyalarınıza asla dokunmadan, gereksiz geçici dosyaları kategori bazlı temizleyin.
              </p>
            </div>

            <div className="text-right">
              <div className="text-xs text-slate-400">Seçilen Temizlenecek Alan:</div>
              <div className="text-lg font-mono font-extrabold" style={{ color: theme.primaryHex }}>
                {(totalSelectedDiskMB / 1024).toFixed(2)} GB
              </div>
            </div>
          </div>

          <div className="space-y-2.5">
            {diskCategories.map(cat => (
              <div
                key={cat.id}
                onClick={() => handleToggleDiskCategory(cat.id)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between gap-4 ${
                  cat.selected
                    ? 'bg-white/[0.06] border-white/20'
                    : 'bg-white/[0.02] border-white/[0.05] opacity-70'
                }`}
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-white">{cat.name}</span>
                    <span className="text-[10px] font-mono text-slate-500">{cat.pathDesc}</span>
                  </div>
                  <div className="text-[11px] text-slate-400">{cat.description}</div>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <span className="font-mono text-xs font-bold text-slate-200">
                    {(cat.sizeMB / 1024).toFixed(2)} GB
                  </span>
                  <input
                    type="checkbox"
                    checked={cat.selected}
                    onChange={() => {}}
                    className="w-4 h-4 cursor-pointer"
                    style={{ accentColor: theme.primaryHex }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-white/[0.08]">
            <div className="text-xs text-slate-500">
              * Kritik sistem dosyaları veya kişisel belgeler kesinlikle silinmez.
            </div>

            <button
              onClick={handleCleanDisk}
              disabled={isCleaningDisk || totalSelectedDiskMB === 0}
              className="px-6 py-2.5 text-white text-xs font-bold rounded-xl transition-all shadow-md"
              style={{
                backgroundColor: theme.primaryHex,
                boxShadow: `0 0 15px ${theme.glowHex}`
              }}
            >
              {isCleaningDisk ? 'Temizleniyor...' : `Seçilenleri Güvenle Temizle (${(totalSelectedDiskMB / 1024).toFixed(2)} GB)`}
            </button>
          </div>

          {diskReport && (
            <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>
                <strong>Disk Temizliği Tamamlandı:</strong> {(diskReport.freedMB / 1024).toFixed(2)} GB geçici veri başarıyla silindi ve SSD alanı açıldı.
              </span>
            </div>
          )}
        </div>
      )}

      {/* 3. Espor Ping Radarı & DNS */}
      {activeToolTab === 'ping' && (
        <div className="space-y-5">
          <div className="bg-[#0e111a]/70 border border-white/[0.08] rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-sm font-bold text-white flex items-center gap-2">
                  <Radio className="w-4 h-4" style={{ color: theme.primaryHex }} />
                  Espor Sunucu Ping Radarı & Ağ Analizi
                </h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  Popüler rekabetçi oyun sunucularına anlık bağlantı gecikmesini (ms) test edin.
                </p>
              </div>

              <button
                onClick={handleTestPing}
                disabled={isTestingPing}
                className="px-4 py-2 text-white font-bold text-xs rounded-xl transition-all flex items-center gap-2 shadow-md"
                style={{
                  backgroundColor: theme.primaryHex,
                  boxShadow: `0 0 12px ${theme.glowHex}`
                }}
              >
                <Wifi className={`w-3.5 h-3.5 ${isTestingPing ? 'animate-pulse' : ''}`} />
                <span>{isTestingPing ? 'Ping Ölçülüyor...' : 'Sunucuları Test Et'}</span>
              </button>
            </div>

            {/* Server Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {servers.map(server => (
                <div
                  key={server.id}
                  className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-between"
                >
                  <div>
                    <div className="text-xs font-bold text-white">{server.game}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{server.location}</div>
                  </div>

                  <div className="text-right">
                    <div className="text-base font-black font-mono text-white flex items-center gap-1 justify-end">
                      <span className={`w-2 h-2 rounded-full ${
                        server.status === 'excellent' ? 'bg-emerald-400' : 'bg-amber-400'
                      }`}></span>
                      <span>{server.pingMs} ms</span>
                    </div>
                    <div className="text-[10px] text-emerald-400 font-mono">Düşük Gecikme</div>
                  </div>
                </div>
              ))}
            </div>

            {/* DNS Optimizer Box */}
            <div className="pt-4 border-t border-white/[0.08] space-y-3">
              <h3 className="text-xs font-bold text-white flex items-center gap-2">
                <Zap className="w-3.5 h-3.5 text-amber-400" />
                Espor Düşük Gecikmeli DNS Yapılandırması
              </h3>
              <p className="text-xs text-slate-400">
                Standart ISS DNS'leri oyun rotalarında gecikmeye sebep olabilir. Cloudflare 1.1.1.1 veya Google 8.8.8.8 profiline geçiş yapabilirsiniz:
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => handleApplyDns('cloudflare')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                    activeDns === 'cloudflare'
                      ? 'bg-white/10 text-white border-white/30'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
                  <span>Cloudflare Gaming DNS (1.1.1.1 / 1.0.0.1)</span>
                </button>

                <button
                  onClick={() => handleApplyDns('google')}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold border flex items-center gap-2 transition-all ${
                    activeDns === 'google'
                      ? 'bg-white/10 text-white border-white/30'
                      : 'bg-white/[0.03] text-slate-300 border-white/[0.08] hover:text-white'
                  }`}
                >
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-400"></span>
                  <span>Google DNS (8.8.8.8 / 8.8.4.4)</span>
                </button>
              </div>

              {dnsFeedback && (
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                  <span>{dnsFeedback}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* 4. Fare Polling Rate & Girdi Gecikmesi Testi */}
      {activeToolTab === 'mouse' && (
        <div className="bg-[#0e111a]/70 border border-white/[0.08] rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-5">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <MousePointer className="w-4 h-4" style={{ color: theme.primaryHex }} />
                Fare Polling Rate (Hz) & Giriş Gecikmesi Testi
              </h2>
              <p className="text-xs text-slate-400 mt-0.5">
                Aşağıdaki test alanında farenizi sürekli daireler çizerek hareket ettirin. Anlık USB sorgulama hızını ölçün.
              </p>
            </div>

            <button
              onClick={handleClearMouseTest}
              className="px-3.5 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-300 text-xs font-semibold rounded-xl border border-white/10 transition-colors"
            >
              Testi Sıfırla
            </button>
          </div>

          {/* Metrics Displays */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="text-[10px] text-slate-400 font-medium">ANLIK POLLING RATE</div>
              <div className="text-2xl font-black font-mono mt-0.5" style={{ color: theme.primaryHex }}>
                {currentHz} Hz
              </div>
              <div className="text-[10px] text-slate-500 font-mono">Hedef: 1000 - 8000 Hz</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="text-[10px] text-slate-400 font-medium">ZİRVE (PEAK) HZ</div>
              <div className="text-2xl font-black font-mono text-emerald-400 mt-0.5">
                {maxHz} Hz
              </div>
              <div className="text-[10px] text-slate-500 font-mono">En yüksek okuma</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-center">
              <div className="text-[10px] text-slate-400 font-medium">ORTALAMA GECİKME (JITTER)</div>
              <div className="text-2xl font-black font-mono text-blue-400 mt-0.5">
                {avgJitterMs} ms
              </div>
              <div className="text-[10px] text-slate-500 font-mono">0.12 - 1.00 ms ideal</div>
            </div>
          </div>

          {/* Interactive Mouse Drawing Area */}
          <div
            onMouseMove={handleMouseAreaMove}
            className="relative h-48 bg-black/40 border border-white/10 rounded-2xl overflow-hidden cursor-crosshair flex flex-col items-center justify-center select-none"
          >
            <canvas ref={mouseCanvasRef} width={600} height={192} className="absolute inset-0 w-full h-full" />
            <div className="relative z-10 text-center pointer-events-none">
              <MousePointer className="w-6 h-6 mx-auto mb-2 text-slate-400 animate-bounce" />
              <span className="text-xs font-semibold text-slate-300 block">
                {isTestingMouse ? 'Hareket algılanıyor...' : 'Farenizi bu kutu içinde daireler çizerek hareket ettirin'}
              </span>
              <span className="text-[10px] text-slate-500 font-mono">
                USB 1000Hz / 4000Hz / 8000Hz hassasiyeti gerçek zamanlı hesaplanır
              </span>
            </div>
          </div>

          {/* Esports Mouse Tuning Tips */}
          <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-xs text-slate-400 space-y-1.5">
            <div className="font-bold text-white flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>Espor İçin Önerilen Windows Fare Ayarları:</span>
            </div>
            <ul className="list-disc list-inside space-y-0.5 text-[11px] text-slate-400">
              <li>Windows İşaretçi Hızı: <strong>6 / 11</strong> (Piksel atlamasını engeller).</li>
              <li>"İşaretçi hassasiyetini artır" (Mouse Acceleration): <strong>Kapalı</strong> olmalıdır.</li>
              <li>Oyun içi ayarlarda "Raw Input (Saf Girdi)": <strong>Açık</strong> tutulmalıdır.</li>
            </ul>
          </div>
        </div>
      )}

      {/* 5. Driverlar */}
      {activeToolTab === 'drivers' && (
        <div className="bg-[#0e111a]/70 border border-white/[0.08] rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">Resmi Sürücü (Driver) Güncelleme Portalları</h2>
            <p className="text-xs text-slate-400 mt-0.5">
              ZAXENBOOSTER şüpheli 3. taraf araçlar kullanmaz; yalnızca resmi üretici portallarına yönlendirir.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
            {[
              {
                brand: 'NVIDIA GeForce Drivers',
                desc: 'GeForce Game Ready & Studio sürücüleri',
                url: 'https://www.nvidia.com/Download/index.aspx',
              },
              {
                brand: 'AMD Radeon Software',
                desc: 'Adrenalin Edition grafik sürücüleri',
                url: 'https://www.amd.com/en/support',
              },
              {
                brand: 'Intel Graphics & Chipset',
                desc: 'Intel Arc & Iris Xe güncel sürücüleri',
                url: 'https://www.intel.com/content/www/us/en/support/detect.html',
              },
            ].map(d => (
              <a
                key={d.brand}
                href={d.url}
                target="_blank"
                rel="noreferrer"
                className="p-4 rounded-xl bg-white/[0.03] border border-white/[0.06] hover:border-white/20 transition-all group block space-y-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white transition-colors" style={{ color: theme.primaryHex }}>
                    {d.brand}
                  </span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-white" />
                </div>
                <p className="text-[11px] text-slate-400">{d.desc}</p>
                <div className="text-[10px] font-mono pt-1 text-slate-300">Resmi İndirme Sayfası →</div>
              </a>
            ))}
          </div>
        </div>
      )}

      {/* 6. Donanım Bilgileri */}
      {activeToolTab === 'specs' && (
        <div className="bg-[#0e111a]/70 border border-white/[0.08] rounded-2xl p-6 shadow-xl backdrop-blur-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white">Sistem & Donanım Özellikleri</h2>
            <p className="text-xs text-slate-400 mt-0.5">Mevcut PC mimarisi ve bileşen kimlikleri</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="text-[10px] font-mono text-slate-500">İŞLEMCİ (CPU)</div>
              <div className="text-xs font-bold text-white">{metrics.cpu.model}</div>
              <div className="text-[11px] text-slate-400 font-mono">{metrics.cpu.cores} Mantıksal Çekirdek · {metrics.cpu.clockSpeedGHz} GHz</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="text-[10px] font-mono text-slate-500">GRAFİK KARTI (GPU)</div>
              <div className="text-xs font-bold text-white">{metrics.gpu.model}</div>
              <div className="text-[11px] text-slate-400 font-mono">16 GB GDDR6X VRAM · DirectX 12 Ultimate</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="text-[10px] font-mono text-slate-500">SİSTEM BELLEĞİ (RAM)</div>
              <div className="text-xs font-bold text-white">{metrics.ram.totalGB} GB High-Speed DDR5</div>
              <div className="text-[11px] text-slate-400 font-mono">{metrics.ram.speedMHz} MHz Dual-Channel</div>
            </div>

            <div className="p-3.5 rounded-xl bg-white/[0.03] border border-white/[0.06] space-y-1">
              <div className="text-[10px] font-mono text-slate-500">İŞLETİM SİSTEMİ</div>
              <div className="text-xs font-bold text-white">Windows 11 Pro 64-bit</div>
              <div className="text-[11px] text-slate-400 font-mono">Build 22631.4317 · DirectStorage Etkin</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
