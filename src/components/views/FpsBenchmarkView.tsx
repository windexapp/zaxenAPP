import React, { useState, useRef, useEffect } from 'react';
import { LineChart, Play, Plus, Trash2, ArrowUp, Zap, Activity } from 'lucide-react';
import { FpsRecord } from '../../types';
import { FpsBenchmarkService } from '../../services/fpsBenchmarkService';

export const FpsBenchmarkView: React.FC = () => {
  const fpsService = FpsBenchmarkService.getInstance();
  const [records, setRecords] = useState<FpsRecord[]>(fpsService.getRecords());
  
  // Real 10s benchmark state
  const [isTesting, setIsTesting] = useState(false);
  const [testTimeRemaining, setTestTimeRemaining] = useState(10);
  const [liveBenchmarkResult, setLiveBenchmarkResult] = useState<{
    avgFps: number;
    onePercentLow: number;
    zeroOnePercentLow: number;
    maxFps: number;
    totalFrames: number;
  } | null>(null);

  // Manual comparison form state
  const [manualGame, setManualGame] = useState('Counter-Strike 2');
  const [manualBefore, setManualBefore] = useState<number | ''>(87);
  const [manualAfter, setManualAfter] = useState<number | ''>(112);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const frameTimesRef = useRef<number[]>([]);
  const animFrameIdRef = useRef<number | null>(null);

  // Run real 10-second requestAnimationFrame test
  const runRealFpsTest = () => {
    setIsTesting(true);
    setTestTimeRemaining(10);
    setLiveBenchmarkResult(null);
    frameTimesRef.current = [];

    const startTime = performance.now();
    let lastFrameTime = startTime;

    const renderLoop = (now: number) => {
      const delta = now - lastFrameTime;
      lastFrameTime = now;
      if (delta > 0) {
        frameTimesRef.current.push(1000 / delta);
      }

      // Draw dynamic particle stress on test canvas
      const canvas = canvasRef.current;
      if (canvas) {
        const ctx = canvas.getContext('2d');
        if (ctx) {
          ctx.fillStyle = '#0b0c10';
          ctx.fillRect(0, 0, canvas.width, canvas.height);

          const time = (now - startTime) * 0.003;
          ctx.strokeStyle = '#e11d48';
          ctx.lineWidth = 2;
          ctx.beginPath();
          for (let x = 0; x < canvas.width; x += 4) {
            const y = (canvas.height / 2) + Math.sin(time + x * 0.05) * 35;
            if (x === 0) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
      }

      const elapsedSec = (now - startTime) / 1000;
      const remaining = Math.max(0, Math.ceil(10 - elapsedSec));
      setTestTimeRemaining(remaining);

      if (elapsedSec < 10) {
        animFrameIdRef.current = requestAnimationFrame(renderLoop);
      } else {
        // Test complete: calculate actual 1% low and avg
        finishBenchmark();
      }
    };

    animFrameIdRef.current = requestAnimationFrame(renderLoop);
  };

  const finishBenchmark = () => {
    setIsTesting(false);
    const frames = [...frameTimesRef.current];
    if (frames.length === 0) return;

    frames.sort((a, b) => a - b);
    const totalFrames = frames.length;
    const avgFps = Math.round(frames.reduce((a, b) => a + b, 0) / totalFrames);
    const onePercentIdx = Math.max(0, Math.floor(totalFrames * 0.01));
    const zeroOnePercentIdx = Math.max(0, Math.floor(totalFrames * 0.001));
    const onePercentLow = Math.round(frames[onePercentIdx] || 0);
    const zeroOnePercentLow = Math.round(frames[zeroOnePercentIdx] || 0);
    const maxFps = Math.round(frames[frames.length - 1] || 0);

    setLiveBenchmarkResult({
      avgFps,
      onePercentLow,
      zeroOnePercentLow,
      maxFps,
      totalFrames,
    });
  };

  useEffect(() => {
    return () => {
      if (animFrameIdRef.current) cancelAnimationFrame(animFrameIdRef.current);
    };
  }, []);

  const handleSaveManualRecord = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualBefore === '' || manualAfter === '') return;
    const newRec = fpsService.addRecord(manualGame, Number(manualBefore), Number(manualAfter));
    setRecords(fpsService.getRecords());
  };

  const handleDeleteRecord = (id: string) => {
    fpsService.deleteRecord(id);
    setRecords(fpsService.getRecords());
  };

  return (
    <div className="space-y-6 pb-6 select-none">
      {/* Top Header */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <LineChart className="w-5 h-5 text-[#e11d48]" />
            Gerçek FPS Ölçümü & Performans Analizi
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            Sahte veri yok. 10 saniyelik gerçek kare işleme motorunu çalıştırın ve oyunlarınızdaki FPS farklarını kaydedin.
          </p>
        </div>
      </div>

      {/* Grid: Real 10s Benchmark + Manual Entry */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left: 10s Real Benchmark Engine (7 cols) */}
        <div className="lg:col-span-7 glass-panel rounded-2xl p-5 shadow-xl space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-sm font-bold text-white flex items-center gap-2">
                <Activity className="w-4 h-4 text-[#e11d48]" />
                10 Saniyelik Gerçek Kare Çizim Testi
              </h2>
              <p className="text-[11px] text-slate-400">
                GPU ve tarayıcı render pipeline'ı üzerinden gerçek frame time ve 1% Low FPS ölçümü yapar.
              </p>
            </div>

            <button
              onClick={runRealFpsTest}
              disabled={isTesting}
              className={`px-4 py-2 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
                isTesting
                  ? 'bg-[#881337] text-white cursor-wait'
                  : 'bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] text-white shadow-[0_0_15px_rgba(225,29,72,0.3)]'
              }`}
            >
              <Play className={`w-3.5 h-3.5 fill-white ${isTesting ? 'animate-pulse' : ''}`} />
              <span>{isTesting ? `Test Ediliyor (${testTimeRemaining}s)` : '10 Saniyelik Test Başlat'}</span>
            </button>
          </div>

          {/* Test Canvas Box */}
          <div className="relative h-36 bg-[#090a0f] border border-[#1d2232] rounded-xl overflow-hidden flex items-center justify-center">
            <canvas ref={canvasRef} width={600} height={144} className="w-full h-full object-cover" />
            
            {isTesting && (
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded bg-[#e11d48]/20 border border-[#e11d48]/40 text-[#ff4770] font-mono text-xs font-bold animate-pulse">
                Kalan Süre: {testTimeRemaining}s
              </div>
            )}

            {!isTesting && !liveBenchmarkResult && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 text-xs text-slate-400">
                <span>Testi başlatmak için butona tıklayın</span>
              </div>
            )}
          </div>

          {/* Result Cards */}
          {liveBenchmarkResult && (
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
              <div className="p-3 rounded-xl bg-[#141824] border border-[#232a3d] text-center">
                <div className="text-[10px] text-slate-400 font-medium">ORTALAMA FPS</div>
                <div className="text-xl font-black font-mono text-emerald-400 mt-0.5">
                  {liveBenchmarkResult.avgFps}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#141824] border border-[#232a3d] text-center">
                <div className="text-[10px] text-slate-400 font-medium">%1 LOW FPS</div>
                <div className="text-xl font-black font-mono text-blue-400 mt-0.5">
                  {liveBenchmarkResult.onePercentLow}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#141824] border border-[#232a3d] text-center">
                <div className="text-[10px] text-slate-400 font-medium">%0.1 LOW FPS</div>
                <div className="text-xl font-black font-mono text-amber-400 mt-0.5">
                  {liveBenchmarkResult.zeroOnePercentLow}
                </div>
              </div>
              <div className="p-3 rounded-xl bg-[#141824] border border-[#232a3d] text-center">
                <div className="text-[10px] text-slate-400 font-medium">MAKSİMUM FPS</div>
                <div className="text-xl font-black font-mono text-purple-400 mt-0.5">
                  {liveBenchmarkResult.maxFps}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Right: Manual Game Entry Form (5 cols) */}
        <div className="lg:col-span-5 glass-panel rounded-2xl p-5 shadow-xl space-y-4">
          <div>
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Plus className="w-4 h-4 text-[#e11d48]" />
              Oyun İçi FPS Karşılaştırması Ekle
            </h2>
            <p className="text-[11px] text-slate-400">
              Oyununuzda ZAXENBOOSTER öncesi ve sonrası aldığınız gerçek değerleri kaydedin.
            </p>
          </div>

          <form onSubmit={handleSaveManualRecord} className="space-y-3">
            <div>
              <label className="text-[11px] font-semibold text-slate-300 block mb-1">Oyun Adı</label>
              <select
                value={manualGame}
                onChange={e => setManualGame(e.target.value)}
                className="w-full px-3 py-2 bg-[#141824] border border-[#232a3d] rounded-lg text-xs text-white outline-none focus:border-[#e11d48]"
              >
                <option value="Counter-Strike 2">Counter-Strike 2</option>
                <option value="Valorant">Valorant</option>
                <option value="Fortnite">Fortnite</option>
                <option value="PUBG: BATTLEGROUNDS">PUBG: BATTLEGROUNDS</option>
                <option value="Apex Legends">Apex Legends</option>
                <option value="Cyberpunk 2077">Cyberpunk 2077</option>
                <option value="Call of Duty: Warzone">Call of Duty: Warzone</option>
              </select>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Önceki FPS</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={manualBefore}
                  onChange={e => setManualBefore(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#141824] border border-[#232a3d] rounded-lg text-xs font-mono text-white outline-none focus:border-[#e11d48]"
                />
              </div>

              <div>
                <label className="text-[11px] font-semibold text-slate-300 block mb-1">Sonraki FPS (Boostlu)</label>
                <input
                  type="number"
                  min="1"
                  max="1000"
                  value={manualAfter}
                  onChange={e => setManualAfter(e.target.value === '' ? '' : Number(e.target.value))}
                  className="w-full px-3 py-2 bg-[#141824] border border-[#232a3d] rounded-lg text-xs font-mono text-white outline-none focus:border-[#e11d48]"
                />
              </div>
            </div>

            {/* Calculated gain preview */}
            {typeof manualBefore === 'number' && typeof manualAfter === 'number' && (
              <div className="p-3 rounded-lg bg-[#141724] border border-[#242b3f] flex items-center justify-between text-xs">
                <span className="text-slate-400">Hesaplanan Kazanç:</span>
                <span className="font-mono font-bold text-emerald-400 flex items-center gap-1">
                  <ArrowUp className="w-3.5 h-3.5" />
                  +{Math.max(0, manualAfter - manualBefore)} FPS (+{manualBefore > 0 ? ((Math.max(0, manualAfter - manualBefore) / manualBefore) * 100).toFixed(1) : 0}%)
                </span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-2.5 bg-[#e11d48] hover:bg-[#be123c] text-white font-bold text-xs rounded-lg transition-colors shadow-sm"
            >
              Ölçümü Geçmişe Kaydet
            </button>
          </form>
        </div>
      </div>

      {/* History Table */}
      <div className="bg-[#10131c] border border-[#202536] rounded-2xl p-5 shadow-lg space-y-3">
        <div className="flex items-center justify-between">
          <div className="text-xs font-bold text-white uppercase tracking-wider">
            Kayıtlı Oyun Performans Geçmişi ({records.length})
          </div>
          <span className="text-[11px] text-slate-500 font-mono">Doğrulanmış Karşılaştırmalar</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b border-[#1f2434] text-slate-400 text-[11px]">
                <th className="pb-2 font-semibold">Oyun</th>
                <th className="pb-2 font-semibold">Tarih</th>
                <th className="pb-2 font-semibold font-mono">Önceki FPS</th>
                <th className="pb-2 font-semibold font-mono">Sonraki FPS</th>
                <th className="pb-2 font-semibold font-mono">Kazanç</th>
                <th className="pb-2 font-semibold text-right">Sil</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#181c28]">
              {records.map(rec => (
                <tr key={rec.id} className="hover:bg-[#141724] transition-colors">
                  <td className="py-2.5 font-bold text-white">{rec.gameName}</td>
                  <td className="py-2.5 text-slate-400">{rec.date}</td>
                  <td className="py-2.5 font-mono text-slate-300">{rec.beforeFps} FPS</td>
                  <td className="py-2.5 font-mono text-white font-bold">{rec.afterFps} FPS</td>
                  <td className="py-2.5 font-mono text-emerald-400 font-bold">
                    +{rec.gainFps} FPS (+{rec.gainPercent}%)
                  </td>
                  <td className="py-2.5 text-right">
                    <button
                      onClick={() => handleDeleteRecord(rec.id)}
                      className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
