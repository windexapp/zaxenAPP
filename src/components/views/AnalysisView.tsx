import React, { useState } from 'react';
import { Search, CheckCircle2, AlertTriangle, AlertCircle, Sparkles, RefreshCw, ShieldCheck } from 'lucide-react';
import { INITIAL_ANALYSIS_ITEMS, AnalysisItem } from '../../services/analyzerService';
import { soundFx } from '../../services/soundFxService';

export const AnalysisView: React.FC = () => {
  const [items, setItems] = useState<AnalysisItem[]>(INITIAL_ANALYSIS_ITEMS);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [activeFilter, setActiveFilter] = useState<'all' | 'optimizable' | 'warning' | 'good'>('all');
  const [fixedMessage, setFixedMessage] = useState<string | null>(null);

  const runSystemScan = () => {
    soundFx.playBoostSound();
    setIsScanning(true);
    setScanProgress(0);

    const interval = setInterval(() => {
      setScanProgress(prev => {
        if (prev >= 100) {
          clearInterval(interval);
          setIsScanning(false);
          soundFx.playCleanSound();
          return 100;
        }
        return prev + 15;
      });
    }, 180);
  };

  const handleFixItem = (id: string) => {
    soundFx.playClickSound();
    setItems(prev => prev.map(item => {
      if (item.id === id) {
        setFixedMessage(`"${item.name}" başarıyla optimize edildi.`);
        return {
          ...item,
          status: 'good',
          statusLabel: 'İyi (Optimize Edildi)',
          fixed: true,
        };
      }
      return item;
    }));
  };

  const handleFixAll = () => {
    soundFx.playCleanSound();
    setItems(prev => prev.map(item => ({
      ...item,
      status: 'good',
      statusLabel: 'İyi (Optimize Edildi)',
      fixed: true,
    })));
    setFixedMessage('Tüm tespit edilen potansiyel gecikme kaynakları başarıyla giderildi!');
  };

  const filteredItems = items.filter(item => {
    if (activeFilter === 'all') return true;
    return item.status === activeFilter;
  });

  const optimizableCount = items.filter(i => i.status === 'optimizable').length;
  const warningCount = items.filter(i => i.status === 'warning').length;
  const goodCount = items.filter(i => i.status === 'good').length;

  return (
    <div className="space-y-6 pb-6 select-none">
      {/* Scan Control Header */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <Search className="w-5 h-5 text-rose-500" />
            Sistem Derinlemesine Analiz & Teşhis
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Windows ayarları, başlangıç uygulamaları, geçici dosyalar ve oyun gecikme kaynaklarını denetleyin.
          </p>
        </div>

        <div className="flex items-center gap-3 w-full md:w-auto">
          {optimizableCount > 0 && (
            <button
              onClick={handleFixAll}
              className="px-4 py-2.5 bg-gradient-to-r from-rose-600 to-rose-700 hover:from-rose-500 hover:to-rose-600 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2 transform active:scale-95"
            >
              <Sparkles className="w-4 h-4" />
              <span>Hepsini Optimize Et ({optimizableCount + warningCount})</span>
            </button>
          )}

          <button
            onClick={runSystemScan}
            disabled={isScanning}
            className={`px-4 py-2.5 rounded-xl border text-xs font-semibold flex items-center gap-2 transition-colors backdrop-blur-md ${
              isScanning
                ? 'bg-white/[0.04] border-white/10 text-slate-400 cursor-wait'
                : 'bg-white/[0.04] hover:bg-white/[0.08] border-white/10 text-white'
            }`}
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isScanning ? 'animate-spin text-rose-400' : ''}`} />
            <span>{isScanning ? `Taranıyor (%${scanProgress})` : 'Sistemi Yeniden Tara'}</span>
          </button>
        </div>
      </div>

      {/* Fix feedback notice */}
      {fixedMessage && (
        <div className="p-3.5 rounded-2xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center justify-between animate-in fade-in backdrop-blur-md">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{fixedMessage}</span>
          </div>
          <button onClick={() => setFixedMessage(null)} className="underline text-[11px]">Kapat</button>
        </div>
      )}

      {/* Scanning progress bar if active */}
      {isScanning && (
        <div className="bg-[#0e111a]/80 border border-white/[0.08] p-4 rounded-2xl space-y-2 animate-in fade-in backdrop-blur-xl">
          <div className="flex justify-between text-xs">
            <span className="text-slate-200 font-semibold">Windows Kayıt Defteri ve Hizmetler Analiz Ediliyor...</span>
            <span className="font-mono text-rose-400 font-bold">%{scanProgress}</span>
          </div>
          <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-rose-500 to-red-400 rounded-full transition-all duration-200"
              style={{ width: `${scanProgress}%` }}
            ></div>
          </div>
        </div>
      )}

      {/* Filter Tabs & Quick Counters */}
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 p-1 bg-white/[0.03] border border-white/[0.08] rounded-xl backdrop-blur-md">
          <button
            onClick={() => { soundFx.playClickSound(); setActiveFilter('all'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
              activeFilter === 'all' ? 'bg-white/10 text-white' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            Tümü ({items.length})
          </button>
          <button
            onClick={() => { soundFx.playClickSound(); setActiveFilter('optimizable'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeFilter === 'optimizable' ? 'bg-rose-950/60 text-rose-300 border border-rose-800/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-rose-500"></span>
            Optimize Edilebilir ({optimizableCount})
          </button>
          <button
            onClick={() => { soundFx.playClickSound(); setActiveFilter('warning'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeFilter === 'warning' ? 'bg-amber-950/60 text-amber-300 border border-amber-800/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-amber-500"></span>
            Dikkat ({warningCount})
          </button>
          <button
            onClick={() => { soundFx.playClickSound(); setActiveFilter('good'); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors flex items-center gap-1.5 ${
              activeFilter === 'good' ? 'bg-emerald-950/60 text-emerald-300 border border-emerald-800/40' : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <span className="w-2 h-2 rounded-full bg-emerald-500"></span>
            İyi Durumda ({goodCount})
          </button>
        </div>

        <div className="text-xs text-slate-500 font-mono">
          {items.length} Sistem Parametresi Denetlendi
        </div>
      </div>

      {/* Results List */}
      <div className="space-y-2.5">
        {filteredItems.map(item => {
          let badgeColor = 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
          let StatusIcon = CheckCircle2;

          if (item.status === 'optimizable') {
            badgeColor = 'bg-rose-500/10 text-rose-400 border-rose-500/30';
            StatusIcon = AlertCircle;
          } else if (item.status === 'warning') {
            badgeColor = 'bg-amber-500/10 text-amber-400 border-amber-500/30';
            StatusIcon = AlertTriangle;
          }

          return (
            <div
              key={item.id}
              className="p-4 rounded-2xl bg-[#0e111a]/60 border border-white/[0.08] hover:border-white/20 transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 backdrop-blur-md"
            >
              <div className="space-y-1 max-w-2xl">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                    {item.category}
                  </span>
                  <span className="text-slate-600">·</span>
                  <span className="text-xs font-bold text-white">{item.name}</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">{item.detail}</p>
              </div>

              <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                <span className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold border flex items-center gap-1.5 ${badgeColor}`}>
                  <StatusIcon className="w-3.5 h-3.5" />
                  <span>{item.statusLabel}</span>
                </span>

                {item.actionLabel && !item.fixed && (
                  <button
                    onClick={() => handleFixItem(item.id)}
                    className="px-3.5 py-1.5 bg-white/[0.05] hover:bg-white/[0.1] text-slate-200 border border-white/10 text-xs font-semibold rounded-xl transition-colors backdrop-blur-md"
                  >
                    {item.actionLabel}
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
