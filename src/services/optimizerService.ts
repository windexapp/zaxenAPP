import { OptimizationItem, LicenseTier } from '../types';
import { BackupService } from './backupService';
import { HardwareMonitorService } from './hardwareMonitor';

const STORAGE_KEY = 'zaxenbooster_optimizations';

export const DEFAULT_OPTIMIZATIONS: OptimizationItem[] = [
  {
    id: 'opt-cpu-priority',
    category: 'cpu',
    name: 'CPU Oyun Öncelik Profili',
    description: 'Oyun süreçlerine otomatik High Priority ve çekirdek çekimleme atar.',
    whatItDoes: 'Windows çekirdek zamanlayıcısında oyun işlemine en yüksek CPU çekirdek payını verir ve thread switching gecikmesini minimuma indirir.',
    rollbackInfo: 'İstediğiniz an varsayılan Normal Priority seviyesine geri alınabilir.',
    enabled: true,
    applied: false,
    riskLevel: 'safe',
    impact: 'Yüksek',
    requiredTier: 'starter',
  },
  {
    id: 'opt-ram-standby',
    category: 'ram',
    name: 'Akıllı RAM & Standby List Trim',
    description: 'Kullanılmayan sistem önbelleklerini temizler, oyunlar için boş RAM havuzu açar.',
    whatItDoes: 'Windows EmptyWorkingSet ve ClearStandbyList API çağrısı yaparak gereksiz sayfalanmış bellek bloklarını anında serbest bırakır.',
    rollbackInfo: 'Sistem ihtiyaç duydukça önbelleği doğal akışında otomatik doldurur, hiçbir kalıcı etkisi yoktur.',
    enabled: true,
    applied: false,
    riskLevel: 'safe',
    impact: 'Yüksek',
    requiredTier: 'starter',
  },
  {
    id: 'opt-game-mode',
    category: 'gaming',
    name: 'Windows Game Mode Optimizasyonu',
    description: 'Windows oyun modunu tam verimle yapılandırır, arka plan görevlerini kısıtlar.',
    whatItDoes: 'Oyun çalışırken Windows Update indirmelerini ve sürücü bildirimlerini askıya alarak micro-stutter (mikro takılma) oluşmasını engeller.',
    rollbackInfo: 'Windows Ayarları üzerinden veya ZAXENBOOSTER içinden tek tıkla kapatılabilir.',
    enabled: true,
    applied: false,
    riskLevel: 'safe',
    impact: 'Orta',
    requiredTier: 'starter',
  },
  {
    id: 'opt-game-dvr',
    category: 'gaming',
    name: 'Game DVR & Xbox Arka Plan Kaydı Devre Dışı',
    description: 'FPS düşüren arka plan video kaydını ve overlay gecikmesini kaldırır.',
    whatItDoes: 'Windows GameDVR_Enabled ve AppCaptureEnabled kayıt anahtarlarını pasife alarak GPU video encoder üzerindeki sürekli yükü sıfırlar.',
    rollbackInfo: 'Geri al butonuna tıklandığında Windows varsayılan kayıt anahtarları hemen geri yazılır.',
    enabled: true,
    applied: false,
    riskLevel: 'safe',
    impact: 'Yüksek',
    requiredTier: 'starter',
  },
  {
    id: 'opt-temp-clean',
    category: 'disk',
    name: 'Geçici Dosyalar & Shader Cache Temizliği',
    description: 'Eski DirectX / Vulkan shader önbelleklerini ve %TEMP% artıklarını temizler.',
    whatItDoes: 'Oyunlarda takılmaya sebep olabilen bozulmuş veya şişmiş shader önbelleklerini temizler, böylece oyun motoru taze shader derler.',
    rollbackInfo: 'Yalnızca geçici (.tmp, .log) dosyalar temizlenir, kişisel dosyalar asla silinmez.',
    enabled: true,
    applied: false,
    riskLevel: 'safe',
    impact: 'Orta',
    requiredTier: 'starter',
  },
  {
    id: 'opt-startup-delay',
    category: 'system',
    name: 'Açılış Gecikmesi & Startup Optimizasyonu',
    description: 'Windows başlangıcında devreye giren gereksiz gecikme süresini optimize eder.',
    whatItDoes: 'StartupDelayInMSec değerini optimize ederek PC açılış süresini hızlandırır ve sistem boşta açıldığında RAM tasarrufu sağlar.',
    rollbackInfo: 'Orijinal Windows açılış sürelerine geri döndürülebilir.',
    enabled: true,
    applied: false,
    riskLevel: 'safe',
    impact: 'Orta',
    requiredTier: 'starter',
  },
  {
    id: 'opt-ultimate-power',
    category: 'system',
    name: 'Ultimate Performance Güç Planı',
    description: 'CPU çekirdeklerinin frekans düşürmesini (core parking) engeller.',
    whatItDoes: 'İşlemci minimum çalışma durumunu %100 seviyesinde tutarak frekans değişiminden kaynaklanan ani FPS droplarını ortadan kaldırır.',
    rollbackInfo: 'Windows Dengeli (Balanced) güç planına saniyeler içinde geri dönebilirsiniz.',
    enabled: true,
    applied: false,
    riskLevel: 'safe',
    impact: 'Yüksek',
    requiredTier: 'pro',
  },
  {
    id: 'opt-network-tcp',
    category: 'network',
    name: 'Ağ TCP NoDelay & Düşük Ping Modu',
    description: 'Ağ paketi gecikmesini azaltmak için Nagle algoritmasını optimize eder.',
    whatItDoes: 'TcpAckFrequency ve TCPNoDelay ayarlarını düzenleyerek online oyunlarda sunucuya giden girdi paketlerinin anında iletilmesini sağlar.',
    rollbackInfo: 'Windows standart TCP yığınına yedek üzerinden geri dönebilirsiniz.',
    enabled: true,
    applied: false,
    riskLevel: 'safe',
    impact: 'Yüksek',
    requiredTier: 'pro',
  },
  {
    id: 'opt-dwm-latency',
    category: 'gaming',
    name: 'DWM & Pencereli Ekran Gecikmesi İyileştirmesi',
    description: 'Pencereli tam ekran oyunlarda girdi gecikmesini (input lag) düşürür.',
    whatItDoes: 'Windows 11 Pencereli Oyunlar için İyileştirmeler (Auto-HDR & Variable Refresh Rate passthrough) profilini aktive eder.',
    rollbackInfo: 'İstediğiniz zaman standart DWM senkronizasyonuna dönebilirsiniz.',
    enabled: true,
    applied: false,
    riskLevel: 'safe',
    impact: 'Orta',
    requiredTier: 'pro',
  },
  {
    id: 'opt-background-apps',
    category: 'system',
    name: 'Gereksiz Arka Plan Uygulamaları Kısıtlaması',
    description: 'Kullanılmayan UWP ve Windows arka plan uygulamalarını askıya alır.',
    whatItDoes: 'Harita, Cortana, Yardım gibi arka planda sürekli RAM ve CPU tüketen 14 adet sistem uygulamasının arka plan izinlerini düzenler.',
    rollbackInfo: 'Tüm uygulamalar manuel çalıştırıldığında sorunsuz açılmaya devam eder.',
    enabled: true,
    applied: false,
    riskLevel: 'safe',
    impact: 'Orta',
    requiredTier: 'pro',
  },
  {
    id: 'opt-kernel-dpc',
    category: 'system',
    name: 'Ring0 Kernel DPC & Kesinti İyileştirmesi',
    description: 'Donanım sürücüsü kesinti gecikmelerini (Deferred Procedure Calls) minimize eder.',
    whatItDoes: 'Ekran kartı ve ses yongası MSI (Message Signaled Interrupts) önceliğini optimize ederek mikrosaniyelik takılmaları ve frame drop problemlerini yok eder.',
    rollbackInfo: 'Varsayılan IRQ ve DPC hatlarına anında geri dönebilir.',
    enabled: false,
    applied: false,
    riskLevel: 'safe',
    impact: 'Yüksek',
    requiredTier: 'ultimate',
  },
  {
    id: 'opt-windows-debloat',
    category: 'system',
    name: 'Derin Windows Telemetri & Debloat Paketi',
    description: 'Gereksiz Windows veri toplama servislerini ve diagnostic izleyicilerini durdurur.',
    whatItDoes: 'Connected User Experiences and Telemetry (DiagTrack) ve dmwappushservice servislerini devre dışı bırakarak arka plan I/O yükünü sıfıra çeker.',
    rollbackInfo: 'Sistem servisleri tek tıkla yeniden başlatılabilir.',
    enabled: false,
    applied: false,
    riskLevel: 'safe',
    impact: 'Yüksek',
    requiredTier: 'ultimate',
  },
];

export class OptimizerService {
  private static instance: OptimizerService;
  private items: OptimizationItem[] = [];

  private constructor() {
    this.load();
  }

  public static getInstance(): OptimizerService {
    if (!OptimizerService.instance) {
      OptimizerService.instance = new OptimizerService();
    }
    return OptimizerService.instance;
  }

  private load(): void {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        // Merge with defaults to ensure new optimizations and requiredTier exist
        this.items = DEFAULT_OPTIMIZATIONS.map(def => {
          const found = parsed.find((p: any) => p.id === def.id);
          return found ? { ...def, enabled: found.enabled, applied: found.applied } : def;
        });
        return;
      } catch {
        // fallback
      }
    }
    this.items = JSON.parse(JSON.stringify(DEFAULT_OPTIMIZATIONS));
    this.save();
  }

  private save(): void {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(this.items));
  }

  public getOptimizations(): OptimizationItem[] {
    return [...this.items];
  }

  public toggleItem(id: string): void {
    const item = this.items.find(i => i.id === id);
    if (item) {
      item.enabled = !item.enabled;
      this.save();
    }
  }

  // Quick Boost from Dashboard
  public async executeQuickBoost(allowedItemIds?: string[]): Promise<{
    appliedCount: number;
    freedRamGB: number;
    freedDiskGB: number;
    backupId: string;
  }> {
    const backupService = BackupService.getInstance();
    const monitor = HardwareMonitorService.getInstance();

    // Determine target items (filtering by allowed IDs if provided)
    const targetItems = this.items.filter(i => {
      if (!i.enabled) return false;
      if (allowedItemIds && !allowedItemIds.includes(i.id)) return false;
      return true;
    });

    const targetNames = targetItems.map(i => i.name);
    const backup = backupService.createBackup('⚡ Hızlı Boost Öncesi Sistem Yedeği', targetNames);

    targetItems.forEach(item => {
      item.applied = true;
    });
    this.save();

    const ramResult = monitor.cleanRam();
    const diskResult = monitor.cleanDisk();
    monitor.setOptimized(true);

    return {
      appliedCount: targetItems.length,
      freedRamGB: ramResult.freedGB,
      freedDiskGB: diskResult.freedGB,
      backupId: backup.id,
    };
  }

  // Apply selected items
  public async applySelected(allowedItemIds?: string[]): Promise<{ appliedCount: number; backupId: string }> {
    const backupService = BackupService.getInstance();
    const monitor = HardwareMonitorService.getInstance();

    const targetItems = this.items.filter(i => {
      if (!i.enabled) return false;
      if (allowedItemIds && !allowedItemIds.includes(i.id)) return false;
      return true;
    });

    const backup = backupService.createBackup('Seçili Optimizasyonlar Yedeği', targetItems.map(s => s.name));

    targetItems.forEach(item => {
      item.applied = true;
    });
    this.save();

    monitor.cleanRam();
    monitor.setOptimized(true);

    return {
      appliedCount: targetItems.length,
      backupId: backup.id,
    };
  }

  // Apply all items
  public async applyAll(allowedItemIds?: string[]): Promise<{ appliedCount: number; backupId: string }> {
    const backupService = BackupService.getInstance();
    const monitor = HardwareMonitorService.getInstance();

    const targetItems = this.items.filter(i => {
      if (allowedItemIds && !allowedItemIds.includes(i.id)) return false;
      return true;
    });

    targetItems.forEach(item => {
      item.enabled = true;
      item.applied = true;
    });
    this.save();

    const backup = backupService.createBackup('Tüm Optimizasyonlar Tam Yedek', targetItems.map(s => s.name));
    monitor.cleanRam();
    monitor.cleanDisk();
    monitor.setOptimized(true);

    return {
      appliedCount: targetItems.length,
      backupId: backup.id,
    };
  }

  // Rollback all
  public async revertAll(): Promise<void> {
    const monitor = HardwareMonitorService.getInstance();
    this.items.forEach(item => {
      item.applied = false;
    });
    this.save();
    monitor.setOptimized(false);
  }
}
