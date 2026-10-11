import { AppBranding } from '../types';

const STORAGE_KEY = 'zaxenbooster_branding';

export const DEFAULT_BRANDING: AppBranding = {
  brandName: 'ZAXEN',
  brandSuffix: 'BOOSTER',
  slogan: 'Windows PC & Gaming Optimizer Pro',
  logoIcon: 'zap',
  announcementText: '🔥 ZAXEN v1.4.0 Espor Sürümü: NVIDIA Reflex & Steam Entegrasyonu Yayında!',
  whatsappNumber: '+90 532 000 00 00',
  whatsappMessage: 'Merhaba ZAXEN Destek ekibi, lisans veya oyun optimizasyonu hakkında bilgi almak istiyorum.',
  discordUrl: 'https://discord.gg/zaxenbooster',
};

type BrandingListener = (branding: AppBranding) => void;

class BrandingService {
  private static instance: BrandingService;
  private branding: AppBranding;
  private listeners: Set<BrandingListener> = new Set();

  private constructor() {
    this.branding = this.load();
  }

  public static getInstance(): BrandingService {
    if (!BrandingService.instance) {
      BrandingService.instance = new BrandingService();
    }
    return BrandingService.instance;
  }

  private load(): AppBranding {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_BRANDING, ...JSON.parse(raw) };
      }
    } catch {
      // fallback
    }
    return { ...DEFAULT_BRANDING };
  }

  public getBranding(): AppBranding {
    return { ...this.branding };
  }

  public updateBranding(updates: Partial<AppBranding>): AppBranding {
    this.branding = { ...this.branding, ...updates };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.branding));
    } catch {
      // ignore
    }
    this.notify();
    return { ...this.branding };
  }

  public resetToDefault(): AppBranding {
    this.branding = { ...DEFAULT_BRANDING };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.branding));
    } catch {
      // ignore
    }
    this.notify();
    return { ...this.branding };
  }

  public subscribe(listener: BrandingListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => {
      try {
        l(this.branding);
      } catch {
        // ignore
      }
    });
  }
}

export const brandingService = BrandingService.getInstance();
