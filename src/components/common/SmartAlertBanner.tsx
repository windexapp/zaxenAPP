import React from 'react';
import { AlertTriangle, Sparkles, X, Flame } from 'lucide-react';
import { SystemMetrics } from '../../types';

interface SmartAlertBannerProps {
  metrics: SystemMetrics;
  onQuickCleanRam: () => void;
}

export const SmartAlertBanner: React.FC<SmartAlertBannerProps> = ({
  metrics,
  onQuickCleanRam,
}) => {
  const [dismissedRam, setDismissedRam] = React.useState(false);
  const [dismissedTemp, setDismissedTemp] = React.useState(false);

  const isHighRam = metrics.ram.usagePercent >= 82 && !dismissedRam;
  const isHighTemp = (metrics.cpu.temperatureC >= 80 || metrics.gpu.temperatureC >= 82) && !dismissedTemp;

  if (!isHighRam && !isHighTemp) return null;

  return (
    <div className="space-y-2 mb-4">
      {isHighRam && (
        <div className="p-3 bg-amber-950/50 border border-amber-800/80 rounded-xl text-xs text-amber-200 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <AlertTriangle className="w-4 h-4 text-amber-400 shrink-0" />
            <span>
              <strong>RAM Kullanımı Yüksek (%{metrics.ram.usagePercent}):</strong> Rekabetçi oyun öncesi boş bellek havuzu açmak için tek tıkla RAM temizliği yapabilirsiniz.
            </span>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onQuickCleanRam}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-600 text-black font-bold text-[11px] rounded-lg transition-colors flex items-center gap-1.5"
            >
              <Sparkles className="w-3 h-3" />
              <span>RAM Temizle</span>
            </button>
            <button
              onClick={() => setDismissedRam(true)}
              className="p-1 text-amber-400 hover:text-white rounded"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}

      {isHighTemp && (
        <div className="p-3 bg-rose-950/60 border border-rose-800 rounded-xl text-xs text-rose-200 flex items-center justify-between gap-3 animate-in fade-in">
          <div className="flex items-center gap-2.5">
            <Flame className="w-4 h-4 text-rose-400 shrink-0" />
            <span>
              <strong>⚠ Yüksek Sıcaklık Uyarısı:</strong> Donanım sıcaklığı {Math.max(metrics.cpu.temperatureC, metrics.gpu.temperatureC)}°C seviyesine ulaştı. Kasa fan profillerini kontrol edin.
            </span>
          </div>
          <button
            onClick={() => setDismissedTemp(true)}
            className="p-1 text-rose-400 hover:text-white rounded"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}
    </div>
  );
};
