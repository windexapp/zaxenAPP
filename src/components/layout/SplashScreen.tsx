import React, { useState, useEffect } from 'react';
import { Zap, ShieldCheck } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState('Sistem donanım katmanı başlatılıyor...');
  const [isFadingOut, setIsFadingOut] = useState(false);

  useEffect(() => {
    const steps = [
      { at: 15, text: 'DirectX 12 & GPU Pipeline Algılanıyor...' },
      { at: 40, text: 'Windows 11 Çekirdek Zamanlayıcısı İnceleniyor...' },
      { at: 65, text: 'Standby Bellek & Standart Güç Profili Doğrulanıyor...' },
      { at: 85, text: 'ZAXEN Ultra Gecikme Önleme Motoru Hazırlanıyor...' },
      { at: 100, text: 'Sistem Hazır! ZAXENBOOSTER Açılıyor...' },
    ];

    const timer = setInterval(() => {
      setProgress(prev => {
        const next = prev + 3;
        const matched = steps.find(s => next >= s.at && prev < s.at);
        if (matched) {
          setCurrentStep(matched.text);
        }

        if (next >= 100) {
          clearInterval(timer);
          setTimeout(() => {
            setIsFadingOut(true);
            setTimeout(() => {
              onComplete();
            }, 500);
          }, 300);
          return 100;
        }
        return next;
      });
    }, 45);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex flex-col items-center justify-center bg-[#07080b] select-none transition-opacity duration-500 overflow-hidden px-4 ${
        isFadingOut ? 'opacity-0 pointer-events-none' : 'opacity-100'
      }`}
    >
      {/* Background Energy Glows */}
      <div className="absolute w-[500px] h-[500px] bg-[#e11d48]/15 rounded-full blur-[120px] pointer-events-none animate-pulse"></div>
      <div className="absolute w-[300px] h-[300px] bg-[#9f1239]/20 rounded-full blur-[80px] pointer-events-none"></div>

      {/* Skip button in top right */}
      <button
        onClick={onComplete}
        className="absolute top-4 right-4 sm:top-6 sm:right-6 px-3.5 py-1.5 rounded-lg bg-[#141724]/80 hover:bg-[#1f2438] text-slate-400 hover:text-white text-xs font-mono border border-[#23293c] transition-colors z-20"
      >
        Geç (Skip) →
      </button>

      {/* Center Branding Animation */}
      <div className="relative flex flex-col items-center text-center space-y-5 sm:space-y-6 w-full max-w-sm sm:max-w-md px-2 sm:px-4 z-10 overflow-hidden">
        {/* Emblem with spinning cyber ring */}
        <div className="relative w-20 h-20 sm:w-24 sm:h-24 flex items-center justify-center shrink-0">
          <div className="absolute inset-0 rounded-2xl border-2 border-dashed border-[#e11d48]/40 animate-[spin_8s_linear_infinite]"></div>
          <div className="absolute inset-2 rounded-xl bg-gradient-to-tr from-[#9f1239]/30 to-[#e11d48]/20 border border-[#e11d48]/50 shadow-[0_0_30px_rgba(225,29,72,0.5)]"></div>
          
          <div className="relative w-12 h-12 sm:w-14 sm:h-14 rounded-xl bg-gradient-to-br from-[#e11d48] to-[#9f1239] flex items-center justify-center shadow-[0_0_25px_rgba(225,29,72,0.8)] border border-[#ff4d73]/60 transform hover:scale-105 transition-transform">
            <Zap className="w-7 h-7 sm:w-8 sm:h-8 text-white fill-white" />
          </div>
        </div>

        {/* Brand Typography with Neon Sheen - Fully Responsive & Overflow-Safe */}
        <div className="space-y-1.5 w-full max-w-full">
          <div className="flex items-center justify-center gap-1.5 sm:gap-2 font-display text-center flex-wrap sm:flex-nowrap">
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wide sm:tracking-wider text-white drop-shadow-[0_2px_10px_rgba(255,255,255,0.2)]">
              ZAXEN
            </span>
            <span className="text-2xl sm:text-3xl md:text-4xl font-black tracking-wide sm:tracking-wider text-[#e11d48] drop-shadow-[0_0_20px_rgba(225,29,72,0.8)]">
              BOOSTER
            </span>
          </div>
          <div className="text-[10px] sm:text-[11px] font-mono tracking-wider sm:tracking-widest text-slate-400 uppercase truncate max-w-full">
            Windows PC & Gaming Optimizer Pro
          </div>
        </div>

        {/* Progress Bar & Status Text */}
        <div className="w-full space-y-2 pt-1 max-w-xs sm:max-w-sm">
          <div className="w-full h-1.5 bg-[#141724] border border-[#23293c] rounded-full overflow-hidden p-0.5">
            <div
              className="h-full bg-gradient-to-r from-[#e11d48] via-[#ff2a5f] to-[#e11d48] rounded-full transition-all duration-75 shadow-[0_0_12px_rgba(225,29,72,0.8)]"
              style={{ width: `${progress}%` }}
            ></div>
          </div>

          <div className="flex items-center justify-between text-[10px] sm:text-[11px] font-mono text-slate-400 gap-2">
            <span className="truncate max-w-[190px] sm:max-w-[240px]">{currentStep}</span>
            <span className="text-[#ff4d73] font-bold shrink-0">%{progress}</span>
          </div>
        </div>

        {/* Bottom certification pill */}
        <div className="pt-2 flex items-center justify-center text-center gap-1.5 text-[9px] sm:text-[10px] text-slate-500 font-mono max-w-full px-2">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
          <span className="truncate">Güvenli Sistem Yedekleme ve Optimizasyon Protokolü</span>
        </div>
      </div>
    </div>
  );
};
