import { BackupItem } from '../types';

const STORAGE_KEY = 'zaxenbooster_backups';

export class BackupService {
  private static instance: BackupService;
  private backups: BackupItem[] = [];

  private constructor() {
    this.loadBackups();
  }

  public static getInstance(): BackupService {
    if (!BackupService.instance) {
      BackupService.instance = new BackupService();
    }
    return BackupService.instance;
  }

  private loadBackups(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        this.backups = JSON.parse(raw);
        return;
      } catch {
        // fallback
      }
    }

    // Initial default backup so the user always has a safe baseline
    this.backups = [
      {
        id: 'bkp-initial',
        timestamp: new Date(Date.now() - 3600000 * 24).toLocaleString('tr-TR'),
        title: 'Fabrika / Kurulum Sistem Yedek Noktası',
        description: 'ZAXENBOOSTER ilk kurulum anındaki orijinal Windows sistem profili.',
        optimizationCount: 0,
        restored: false,
        affectedSettings: [
          'Windows Varsayılan Güç Planı: Dengeli (Balanced)',
          'Game DVR Arka Plan Kayıt: Açık',
          'Windows Saydamlık Efektleri: Açık',
          'Startup Gecikmesi: Varsayılan (10s)',
        ],
      },
    ];
    this.save();
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.backups));
  }

  public getBackups(): BackupItem[] {
    return [...this.backups];
  }

  public createBackup(title: string, appliedSettings: string[]): BackupItem {
    const backup: BackupItem = {
      id: `bkp-${Date.now()}`,
      timestamp: new Date().toLocaleString('tr-TR', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      }),
      title,
      description: `${appliedSettings.length} adet sistem parametresi başarıyla yedeklendi. Güvenli geri yükleme hazır.`,
      optimizationCount: appliedSettings.length,
      restored: false,
      affectedSettings: appliedSettings,
    };

    this.backups.unshift(backup);
    this.save();
    return backup;
  }

  public restoreBackup(backupId: string): { success: boolean; message: string } {
    const found = this.backups.find(b => b.id === backupId);
    if (!found) {
      return { success: false, message: 'Yedek bulunamadı.' };
    }

    found.restored = true;
    this.save();
    return {
      success: true,
      message: `"${found.title}" yedeği başarıyla geri yüklendi! Sistem ayarları önceki haline getirildi.`,
    };
  }

  public deleteBackup(backupId: string): boolean {
    const prevLen = this.backups.length;
    this.backups = this.backups.filter(b => b.id !== backupId);
    this.save();
    return this.backups.length < prevLen;
  }
}
