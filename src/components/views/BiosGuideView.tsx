import React, { useState } from 'react';
import { 
  Cpu, 
  Layers, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  HelpCircle, 
  Flame, 
  Info,
  ChevronRight,
  ExternalLink,
  BookOpen
} from 'lucide-react';
import { soundFx } from '../../services/soundFxService';

export const BiosGuideView: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<'xmp' | 'resize_bar' | 'undervolt' | 'cmos_reset'>('xmp');

  return (
    <div className="space-y-6 pb-12 select-none animate-in fade-in">
      {/* Top Banner */}
      <div className="relative overflow-hidden rounded-2xl p-6 bg-gradient-to-r from-[#17130a] via-[#100d06] to-[#080602] border border-amber-500/30 shadow-[0_0_35px_rgba(245,158,11,0.12)]">
        <div className="absolute -right-8 -top-8 w-44 h-44 rounded-full bg-amber-500/10 blur-3xl pointer-events-none"></div>
        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                PRO PLATFORM REHBERİ
              </span>
              <span className="text-xs text-slate-400 font-mono">Sıfır Riskli Kılavuzluk</span>
            </div>
            <h1 className="text-2xl font-black text-white font-display tracking-wide mt-1">
              BIOS & RAM Rehberi <span className="text-amber-400">(Pro)</span>
            </h1>
            <p className="text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              Anakart, BIOS sürümü ve RAM kiti algılanır; bellek profili, işlemci ve bellek ayarları gibi platforma özel adımlar risk düzeyi ve geri dönüş yöntemiyle anlatılır. <b className="text-amber-300">Zaxen Booster BIOS'a asla doğrudan yazmaz; anakartınıza özel güvenli kılavuzluk sağlar.</b>
            </p>
          </div>

          <div className="px-4 py-2.5 rounded-2xl bg-black/60 border border-amber-500/30 flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="text-[10px] text-slate-400 font-mono">Güvenlik İlkesi:</div>
              <div className="text-xs font-bold text-white font-mono">
                ROM Yazımı Yapılmaz
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Detected Hardware Spec Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Motherboard & BIOS */}
        <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/10 space-y-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Algılanan Anakart</div>
          <div className="text-base font-bold text-white font-display">ASUS / MSI Gaming Pro (DDR5 / DDR4)</div>
          <div className="text-xs font-mono text-amber-400">BIOS Sürümü: v1802 (AGESA 1.1.0.0 Güncel)</div>
          <p className="text-[11px] text-slate-400">
            UEFI modu aktif, Secure Boot ve TPM 2.0 açık.
          </p>
        </div>

        {/* RAM Kit Spec */}
        <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/10 space-y-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase">Algılanan RAM Kiti</div>
          <div className="text-base font-bold text-white font-display">32 GB (2x16GB) Dual Channel</div>
          <div className="text-xs font-mono text-emerald-400">XMP / EXPO: Profil 1 Aktif (6000MHz CL30)</div>
          <p className="text-[11px] text-slate-400">
            Yuvalar: DIMM_A2 ve DIMM_B2 (Önerilen Çift Kanal Yuvaları).
          </p>
        </div>

        {/* CPU Platform */}
        <div className="p-4 rounded-2xl bg-[#0d1017] border border-white/10 space-y-2">
          <div className="text-[10px] font-mono text-slate-400 uppercase">İşlemci Platformu</div>
          <div className="text-base font-bold text-white font-display">Espor Yüksek Performans Mimarisi</div>
          <div className="text-xs font-mono text-cyan-400">Re-Size BAR: Açık (GPU Direct VRAM)</div>
          <p className="text-[11px] text-slate-400">
            PBO Curve Optimizer: Stabil (-20 All Cores).
          </p>
        </div>
      </div>

      {/* Interactive Step-by-Step Guides */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Topics Navigation */}
        <div className="lg:col-span-4 space-y-2">
          <button
            onClick={() => { soundFx.playClickSound(); setSelectedTopic('xmp'); }}
            className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
              selectedTopic === 'xmp'
                ? 'bg-amber-500/20 text-white border-amber-500/50 shadow-md'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/5 hover:bg-white/[0.06]'
            }`}
          >
            <div>
              <div className="text-xs font-bold font-display">1. XMP / EXPO Bellek Profili Açma</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Risk Düzeyi: Sıfır (Üretici Garantili)</div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => { soundFx.playClickSound(); setSelectedTopic('resize_bar'); }}
            className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
              selectedTopic === 'resize_bar'
                ? 'bg-amber-500/20 text-white border-amber-500/50 shadow-md'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/5 hover:bg-white/[0.06]'
            }`}
          >
            <div>
              <div className="text-xs font-bold font-display">2. Re-Size BAR / SAM Aktif Etme</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Risk Düzeyi: Güvenli (+%8 FPS)</div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => { soundFx.playClickSound(); setSelectedTopic('undervolt'); }}
            className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
              selectedTopic === 'undervolt'
                ? 'bg-amber-500/20 text-white border-amber-500/50 shadow-md'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/5 hover:bg-white/[0.06]'
            }`}
          >
            <div>
              <div className="text-xs font-bold font-display">3. CPU Curve Optimizer & Voltaj Ayarı</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Risk Düzeyi: Düşük / İleri Düzey</div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>

          <button
            onClick={() => { soundFx.playClickSound(); setSelectedTopic('cmos_reset'); }}
            className={`w-full p-3.5 rounded-xl text-left border transition-all flex items-center justify-between ${
              selectedTopic === 'cmos_reset'
                ? 'bg-amber-500/20 text-white border-amber-500/50 shadow-md'
                : 'bg-white/[0.03] text-slate-400 hover:text-white border-white/5 hover:bg-white/[0.06]'
            }`}
          >
            <div>
              <div className="text-xs font-bold font-display">4. Geri Dönüş: CMOS Reset Rehberi</div>
              <div className="text-[10px] text-slate-400 font-mono mt-0.5">Hayat Kurtaran Acil Dönüş</div>
            </div>
            <ChevronRight className="w-4 h-4 text-amber-400" />
          </button>
        </div>

        {/* Right Details Panel */}
        <div className="lg:col-span-8 p-6 rounded-2xl bg-[#0a0d14] border border-white/10 space-y-4">
          {selectedTopic === 'xmp' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white font-display">
                  XMP (Intel) / EXPO (AMD) Bellek Profilini Açma
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Risk: Sıfır (Güvenli)
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Kutudan yeni çıkan RAM'ler varsayılan olarak 2133MHz veya 4800MHz hızında çalışır. RAM'inizin vadedilen 3600MHz / 6000MHz hızına ulaşması için BIOS'tan XMP veya EXPO profilini açmanız şarttır. Bu işlem oyun içi %1 ve %0.1 düşük FPS takılmalarını tamamen yok eder.
              </p>

              <div className="space-y-2 text-xs font-mono text-slate-300 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="font-bold text-amber-400 mb-1">Adım Adım Nasıl Yapılır?</div>
                <div>1. Bilgisayarı yeniden başlatın ve ekrana görüntü gelirken <span className="text-white font-bold">DEL</span> veya <span className="text-white font-bold">F2</span> tuşuna art arda basın.</div>
                <div>2. ASUS'ta <span className="text-cyan-300">"Ai Overclock Tuner"</span> veya MSI'da <span className="text-cyan-300">"A-XMP / EXPO"</span> butonunu bulun.</div>
                <div>3. Ayarı <span className="text-emerald-400">"Profile 1"</span> olarak seçin.</div>
                <div>4. <span className="text-white font-bold">F10</span> tuşuna basıp "Save Changes & Reset" diyerek kaydedip çıkın.</div>
              </div>
            </div>
          )}

          {selectedTopic === 'resize_bar' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white font-display">
                  Re-Size BAR (Smart Access Memory) Aktif Etme
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  Risk: Sıfır (Güvenli)
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                İşlemcinin ekran kartı belleğine (VRAM) 256MB küçük bloklar yerine aynı anda tüm VRAM'e doğrudan erişmesini sağlar. CS2, Cyberpunk ve Fortnite gibi oyunlarda ortalama %5-%12 net FPS artışı sağlar.
              </p>

              <div className="space-y-2 text-xs font-mono text-slate-300 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="font-bold text-amber-400 mb-1">BIOS Ayar Konumu:</div>
                <div>1. BIOS &gt; Advanced &gt; <span className="text-cyan-300">PCI Subsystem Settings</span> menüsüne gidin.</div>
                <div>2. <span className="text-white">"Above 4G Decoding"</span> ayarını <span className="text-emerald-400">ENABLED</span> yapın.</div>
                <div>3. Altında beliren <span className="text-white">"Re-Size BAR Support"</span> ayarını <span className="text-emerald-400">AUTO / ENABLED</span> yapın.</div>
                <div>4. F10 tuşuna basıp kaydedin.</div>
              </div>
            </div>
          )}

          {selectedTopic === 'undervolt' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white font-display">
                  İşlemci Curve Optimizer & Sıcaklık Düşürme
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40">
                  Risk: Düşük / Test Gerekli
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Modern işlemciler (Ryzen 7000/9000, Intel 13/14. Nesil) fabrikasyon olarak gereğinden fazla voltaj çeker. Curve Optimizer ile voltajı hafifçe düşürmek (undervolt), işlemcinin daha az ısınmasını ve daha yüksek saat hızlarına (Boost Clock) çıkmasını sağlar.
              </p>

              <div className="space-y-2 text-xs font-mono text-slate-300 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="font-bold text-amber-400 mb-1">Önerilen Başlangıç Değerleri:</div>
                <div>• AMD Ryzen: Precision Boost Overdrive &gt; Curve Optimizer &gt; <span className="text-cyan-300">All Cores: Negative 15 veya 20</span>.</div>
                <div>• Intel: CPU Core Voltage Offset &gt; <span className="text-cyan-300">-0.050V (-50mV)</span>.</div>
                <div>• Test: Zaxen Booster "Sağlık Testi" 60 saniyelik CPU stresini çalıştırarak kararlılığı doğrulayın.</div>
              </div>
            </div>
          )}

          {selectedTopic === 'cmos_reset' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <h3 className="text-base font-bold text-white font-display">
                  Geri Dönüş: CMOS Reset (BIOS Sıfırlama)
                </h3>
                <span className="text-xs font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  %100 Fabrika Ayarlarına Dönüş
                </span>
              </div>

              <p className="text-xs text-slate-300 leading-relaxed">
                Yanlış bir RAM gecikmesi girdiğinizde veya sistem açılmadığında asla korkmayın. CMOS Reset işlemi anakartı ilk aldığınız günkü fabrika ayarlarına 10 saniyede geri döndürür.
              </p>

              <div className="space-y-2 text-xs font-mono text-slate-300 bg-black/40 p-4 rounded-xl border border-white/5">
                <div className="font-bold text-emerald-400 mb-1">Geri Dönüş Yöntemleri:</div>
                <div>1. <span className="text-white font-bold">Clear CMOS Butonu:</span> Anakart arkasında (I/O paneli) buton varsa bilgisayar kapalıyken 5 saniye basılı tutun.</div>
                <div>2. <span className="text-white font-bold">Pil Çıkarma:</span> Bilgisayarın fişini çekin, anakart üzerindeki yuvarlak para pili (CR2032) çıkarıp 1 dakika bekleyin ve geri takın.</div>
                <div>3. Anakartınız ilk açılışta güvenli varsayılan hızlarla açılacaktır.</div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
