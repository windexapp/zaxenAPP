import React, { useState } from 'react';
import { RotateCcw, ShieldCheck, CheckCircle2, History, AlertTriangle, Trash2 } from 'lucide-react';
import { BackupItem } from '../../types';
import { BackupService } from '../../services/backupService';
import { OptimizerService } from '../../services/optimizerService';

export const BackupRestoreView: React.FC = () => {
  const backupService = BackupService.getInstance();
  const optimizerService = OptimizerService.getInstance();
  const [backups, setBackups] = useState<BackupItem[]>(backupService.getBackups());
  const [selectedBackup, setSelectedBackup] = useState<BackupItem | null>(backups[0] || null);
  const [restoreFeedback, setRestoreFeedback] = useState<string | null>(null);

  const handleRestore = async (backupId: string) => {
    const res = backupService.restoreBackup(backupId);
    if (res.success) {
      await optimizerService.revertAll();
      setBackups(backupService.getBackups());
      setRestoreFeedback(res.message);
      setTimeout(() => setRestoreFeedback(null), 5000);
    }
  };

  const handleDelete = (backupId: string) => {
    backupService.deleteBackup(backupId);
    const updated = backupService.getBackups();
    setBackups(updated);
    if (selectedBackup?.id === backupId) {
      setSelectedBackup(updated[0] || null);
    }
  };

  return (
    <div className="space-y-6 pb-6 select-none">
      {/* Top Header */}
      <div className="glass-panel rounded-2xl p-5 shadow-xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-extrabold text-white flex items-center gap-2 font-display">
            <RotateCcw className="w-5 h-5 text-[#e11d48]" />
            Sistem Geri Yükleme & Yedek Noktaları
          </h1>
          <p className="text-xs text-slate-400 mt-0.5">
            ZAXENBOOSTER her optimizasyondan önce otomatik anlık görüntü kaydeder. İstediğiniz an tek tıkla geri alın.
          </p>
        </div>

        <div className="flex items-center gap-2 text-xs text-emerald-400 font-semibold bg-emerald-950/40 border border-emerald-800/60 px-3 py-2 rounded-xl">
          <ShieldCheck className="w-4 h-4" />
          <span>Sistem Geri Alma Güvencesi Aktif</span>
        </div>
      </div>

      {restoreFeedback && (
        <div className="p-3.5 rounded-xl bg-emerald-950/40 border border-emerald-800 text-xs text-emerald-300 flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{restoreFeedback}</span>
        </div>
      )}

      {/* Grid: Backup History List + Selected Backup Inspector */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Backup Snapshots (5 cols) */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-2">
            Kayıtlı Yedek Noktaları ({backups.length})
          </div>

          <div className="space-y-2">
            {backups.map(b => {
              const isSelected = selectedBackup?.id === b.id;
              return (
                <div
                  key={b.id}
                  onClick={() => setSelectedBackup(b)}
                  className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'glass-panel border-[#e11d48]/60 shadow-[0_0_15px_rgba(225,29,72,0.15)]'
                      : 'bg-white/[0.03] border-white/10 hover:border-white/20'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div>
                      <h3 className="text-xs font-bold text-white font-tech">{b.title}</h3>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{b.timestamp}</div>
                    </div>
                    {b.restored ? (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                        Geri Yüklendi
                      </span>
                    ) : (
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-300">
                        Hazır
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right Column: Selected Backup Details & Restore Button (7 cols) */}
        <div className="lg:col-span-7">
          {selectedBackup ? (
            <div className="glass-panel rounded-2xl p-5 shadow-xl space-y-5">
              <div className="flex items-start justify-between pb-4 border-b border-[#1c2130]">
                <div>
                  <h2 className="text-base font-bold text-white">{selectedBackup.title}</h2>
                  <p className="text-xs text-slate-400 mt-0.5">{selectedBackup.description}</p>
                </div>
                <div className="text-right">
                  <span className="text-[10px] font-mono text-slate-500 block">Kayıt Tarihi:</span>
                  <span className="text-xs font-mono text-slate-300">{selectedBackup.timestamp}</span>
                </div>
              </div>

              {/* Affected parameters */}
              <div className="space-y-2">
                <div className="text-xs font-bold text-slate-300 uppercase tracking-wider">
                  Yedeklenen Windows Sistem Parametreleri ({selectedBackup.affectedSettings.length})
                </div>

                <div className="space-y-1.5 max-h-56 overflow-y-auto pr-1">
                  {selectedBackup.affectedSettings.map((setting, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-lg bg-[#141824] border border-[#22283a] text-xs text-slate-300 flex items-center justify-between"
                    >
                      <span>{setting}</span>
                      <span className="text-[10px] font-mono text-emerald-400">Yedeklendi</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-4 border-t border-[#1c2130]">
                <button
                  onClick={() => handleDelete(selectedBackup.id)}
                  className="px-3 py-2 bg-[#171b26] hover:bg-rose-950/40 text-slate-400 hover:text-rose-300 text-xs rounded-lg transition-colors flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Yedeği Sil</span>
                </button>

                <button
                  onClick={() => handleRestore(selectedBackup.id)}
                  className="px-6 py-2.5 bg-gradient-to-r from-[#e11d48] to-[#be123c] hover:from-[#f43f5e] hover:to-[#e11d48] text-white text-xs font-bold rounded-xl transition-all shadow-[0_0_15px_rgba(225,29,72,0.3)] flex items-center gap-2"
                >
                  <RotateCcw className="w-4 h-4" />
                  <span>DEĞİŞİKLİKLERİ GERİ AL</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center text-xs text-slate-500">
              Görüntülemek için soldan bir sistem yedeği seçin.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
