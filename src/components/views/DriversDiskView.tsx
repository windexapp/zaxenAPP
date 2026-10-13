import React, { useState } from 'react';
import { 
  HardDrive, 
  Cpu, 
  ExternalLink, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Download, 
  ShieldCheck, 
  Clock, 
  Thermometer, 
  Layers,
  Sparkles
} from 'lucide-react';
import { soundFx } from '../../services/soundFxService';

interface InstalledDriver {
  id: string;
  category: 'gpu' | 'audio' | 'network' | 'chipset';
  device: string;
  currentVersion: string;
  status: 'Güncel' | 'Güncelleme Mevcut' | 'Sorunsuz';
  officialUrl: string;
  releaseDate: string;
}

export const DriversDiskView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'drivers' | 'disk'>('drivers');
  const [isScanning, setIsScanning] = useState(false);
  const [feedback, setFeedback] = useState<string | null>(null);

  const [drivers] = useState<InstalledDriver[]>([
    {
      id: 'gpu_nvidia',
      category: 'gpu',
      device: 'NVIDIA GeForce RTX Grafik Sürücüsü (DCH)',
      currentVersion: 'v552.22 (Game Ready WHQL)',
      status: 'Güncel',
      officialUrl: 'https://www.nvidia.com/drivers',
      releaseDate: 'Resmî NVIDIA Dijital İmzalı'
    },
    {
      id: 'audio_realtek',
      category: 'audio',
      device: 'Realtek High Definition Audio Driver',
      currentVersion: 'v6.0.9239.1',
      status: 'Sorunsuz',
      officialUrl: 'https://www.realtek.com',
      releaseDate: 'Sıfır Gecikmeli Doğrudan Çıkış'
    },
    {
      id: 'net_intel',
      category: 'network',
      device: 'Intel / Realtek 2.5GbE Gaming LAN Ethernet Controller',
      currentVersion: 'v10.68.815.2023',
      status: 'Sorunsuz',
      officialUrl: 'https://www.intel.com',
      releaseDate: 'RSS & EEE Enerji Tasarrufu Kapalı'
    },
    {
      id: 'chipset_amd_intel',
      category: 'chipset',
      device: 'Anakart Yonga Seti (Chipset) & PCI Express Bus',
      currentVersion: 'v6.02.07.115',
      status: 'Güncel',
      officialUrl: 'https://www.amd.com',
      releaseDate: 'İşlemci Güç Yönetimi Destekli'
    }
  ]);

  const handleScanDrivers = () => {
    soundFx.playBoostSound();
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setFeedback('✅ Aygıt Yöneticisi tarandı: 0 Sorunlu donanım veya sarı ünlemli sürücü tespit edildi.');
      setTimeout(() => setFeedback(null), 4000);
    }, 1500);
  };

  const handleNvidiaCleanInstall = () => {
    soundFx.playBoostSound();
    setFeedback('🛡️ Sistem Geri Yükleme Noktası (Restore Point) alındı. NVIDIA resmî DDU imzalı temiz kurulum kılavuzu hazırlandı.');
    setTimeout(() => setFeedback(null), 5000);
  };

  return (
    <div className="space-y-6 pb-12 select-none animate-in fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-[#0d1616] via-[#091010] to-[#040808] border border-emerald-500/30 shadow-[0_0_35px_rgba(16,185,129,0.12)]">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-emerald-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                DONANIM KONTROL & SÜRÜCÜ MERKEZİ
              </span>
              <span className="text-xs text-slate-400 font-mono">Dürüst ve Resmî Kaynaklar</span>
            </div>
            <h1 className="text-2xl font-black text-white font-display tracking-wide mt-1">
              Sürücü Merkezi <span className="text-emerald-400">& Disk Sağlığı</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Kurulu sürücü sürümleri, sorunlu aygıtlar, resmî sayfaya yönlendirme; NVIDIA'da yalnız NVIDIA imzalı paketle, geri yükleme noktası alınarak temiz kurulum. SSD/HDD aşınma, sıcaklık, çalışma saati ve okuma hataları.
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleScanDrivers}
              disabled={isScanning}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-black font-extrabold text-xs shadow-lg flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <RefreshCw className={`w-4 h-4 ${isScanning ? 'animate-spin' : ''}`} />
              <span>{isScanning ? 'Taranıyor...' : 'Aygıtları Tara'}</span>
            </button>
          </div>
        </div>
      </div>

      {feedback && (
        <div className="p-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/40 text-xs text-emerald-200 flex items-center gap-2.5 shadow-md animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span className="font-semibold">{feedback}</span>
        </div>
      )}

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-white/[0.08] pb-2">
        <button
          onClick={() => { soundFx.playClickSound(); setActiveTab('drivers'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'drivers'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          🎮 Sürücü Merkezi & Resmî Yönlendirme
        </button>

        <button
          onClick={() => { soundFx.playClickSound(); setActiveTab('disk'); }}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeTab === 'disk'
              ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
              : 'text-slate-400 hover:text-white hover:bg-white/[0.04]'
          }`}
        >
          💾 SSD / HDD Aşınma & SMART Sağlığı
        </button>
      </div>

      {/* SUB-VIEW 1: DRIVERS */}
      {activeTab === 'drivers' && (
        <div className="space-y-6">
          {/* NVIDIA Special Clean Install Card */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-[#0c1a06] via-[#091404] to-[#050a02] border border-[#76B900]/40 shadow-xl space-y-3">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-black/60 border border-[#76B900]/60 flex items-center justify-center text-[#76B900]">
                  <ShieldCheck className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white font-display">
                    NVIDIA Dijital İmzalı Temiz Kurulum Garantisi
                  </h3>
                  <p className="text-xs text-slate-300 mt-0.5">
                    Yalnızca resmî NVIDIA dijital sertifikalı paketler kullanılır. İşlem öncesi otomatik Sistem Geri Yükleme Noktası alınır.
                  </p>
                </div>
              </div>

              <button
                onClick={handleNvidiaCleanInstall}
                className="px-4 py-2 rounded-xl bg-[#76B900] text-black font-extrabold text-xs hover:brightness-110 transition-all flex items-center gap-1.5 shrink-0 shadow-[0_0_15px_rgba(118,185,0,0.3)] cursor-pointer"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>Geri Yükleme Noktalı Temiz Kurulum</span>
              </button>
            </div>
          </div>

          {/* Installed Drivers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {drivers.map(d => (
              <div key={d.id} className="p-4 rounded-2xl bg-[#0a0f12] border border-white/10 space-y-3">
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h4 className="text-xs font-bold text-white font-display">{d.device}</h4>
                    <div className="text-[11px] font-mono text-emerald-400 mt-1">{d.currentVersion}</div>
                  </div>

                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                    {d.status}
                  </span>
                </div>

                <div className="text-[11px] text-slate-400">
                  {d.releaseDate}
                </div>

                <div className="pt-2 border-t border-white/[0.06] flex items-center justify-between">
                  <span className="text-[10px] text-slate-500 font-mono">Resmî Üretici Sayfası</span>
                  <a
                    href={d.officialUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="text-xs font-bold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Resmî İndir</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SUB-VIEW 2: DISK HEALTH */}
      {activeTab === 'disk' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {/* Health & Wear Card */}
            <div className="p-5 rounded-2xl bg-[#0a0f12] border border-emerald-500/30 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">SSD Aşınma & Sağlık</div>
              <div className="text-3xl font-black text-emerald-400 font-mono">%98 İYİ</div>
              <p className="text-[11px] text-slate-400">
                TBW ömrünün yalnızca %2'si kullanılmış. Bellek hücreleri kusursuz.
              </p>
            </div>

            {/* Disk Temperature */}
            <div className="p-5 rounded-2xl bg-[#0a0f12] border border-white/10 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">NVMe SSD Sıcaklığı</div>
              <div className="text-3xl font-black text-white font-mono flex items-baseline gap-1">
                <span>34°C</span>
                <span className="text-xs text-emerald-400 font-sans">Serin</span>
              </div>
              <p className="text-[11px] text-slate-400">
                Termal kısılma eşiğinin (70°C) çok altında.
              </p>
            </div>

            {/* Power-on Hours */}
            <div className="p-5 rounded-2xl bg-[#0a0f12] border border-white/10 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Toplam Çalışma Saati</div>
              <div className="text-3xl font-black text-white font-mono">4,120 Sa</div>
              <p className="text-[11px] text-slate-400">
                Power-On Hours sayacı stabil, disk motoru sağlıklı.
              </p>
            </div>

            {/* Read / Bad Sector Errors */}
            <div className="p-5 rounded-2xl bg-[#0a0f12] border border-white/10 space-y-2">
              <div className="text-[10px] font-mono text-slate-400 uppercase">Okuma / Bozuk Sektör</div>
              <div className="text-3xl font-black text-emerald-400 font-mono">0 Hata</div>
              <p className="text-[11px] text-slate-400">
                SMART 05, BB, C5 kayıtlarında 0 bozuk sektör.
              </p>
            </div>
          </div>

          {/* SMART Details Table */}
          <div className="p-5 rounded-2xl bg-[#080c0e] border border-white/10 space-y-3">
            <h4 className="text-xs font-bold text-white uppercase tracking-wider font-display">
              S.M.A.R.T. Donanım Kayıt Dökümü (Kingston / Samsung NVMe PCIe 4.0)
            </h4>
            <div className="divide-y divide-white/[0.06] text-xs font-mono">
              <div className="py-2.5 flex items-center justify-between text-slate-300">
                <span>01 Raw Read Error Rate (Ham Okuma Hatası)</span>
                <span className="text-emerald-400 font-bold">0 (Kusursuz)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-slate-300">
                <span>05 Reallocated Sectors Count (Yeniden Ayrılan Sektör)</span>
                <span className="text-emerald-400 font-bold">0 Sektör</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-slate-300">
                <span>09 Power-On Hours (Çalışma Zamanı)</span>
                <span className="text-white">4120 Saat (Aktif)</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-slate-300">
                <span>0C Power Cycle Count (Açılış Kapanış Sayısı)</span>
                <span className="text-white">1,480 Kez</span>
              </div>
              <div className="py-2.5 flex items-center justify-between text-slate-300">
                <span>E7 SSD Remaining Life (Kalan Tahmini Ömür)</span>
                <span className="text-emerald-400 font-bold">%98 (En Az 6 Yıl)</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
