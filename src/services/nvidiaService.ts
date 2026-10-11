import { NvidiaConfig } from '../types';

const STORAGE_KEY = 'zaxenbooster_nvidia';

export const DEFAULT_NVIDIA_CONFIG: NvidiaConfig = {
  vibrance: 75, // Pro esport level
  blackEqualizer: 25,
  sharpening: 0.50,
  contrast: 110,
  gamma: 1.0,
  lowLatencyMode: 'ultra',
  reflexMode: 'on_boost',
  maxFps: 0, // unlimited
  powerMode: 'prefer_maximum_performance',
  textureQuality: 'high_performance',
  threadedOptimization: true,
  shaderCacheCleaned: false,
  shaderCacheCleanedSizeGB: 3.8,
  shaderCacheSize: '10gb',
  appliedProfile: 'CS2 & Valorant Pro Turnuva',
};

type NvidiaListener = (config: NvidiaConfig) => void;

class NvidiaService {
  private static instance: NvidiaService;
  private config: NvidiaConfig;
  private listeners: Set<NvidiaListener> = new Set();

  private constructor() {
    this.config = this.load();
  }

  public static getInstance(): NvidiaService {
    if (!NvidiaService.instance) {
      NvidiaService.instance = new NvidiaService();
    }
    return NvidiaService.instance;
  }

  private load(): NvidiaConfig {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        return { ...DEFAULT_NVIDIA_CONFIG, ...JSON.parse(raw) };
      }
    } catch {
      // fallback
    }
    return { ...DEFAULT_NVIDIA_CONFIG };
  }

  public getConfig(): NvidiaConfig {
    return { ...this.config };
  }

  public updateConfig(updates: Partial<NvidiaConfig>): NvidiaConfig {
    this.config = { ...this.config, ...updates };
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.config));
    } catch {
      // ignore
    }
    this.notify();
    return { ...this.config };
  }

  public applyProfile(profileType: 'cs2_pro' | 'valorant_radiant' | 'apex_warzone' | 'default'): NvidiaConfig {
    let updates: Partial<NvidiaConfig> = {};
    if (profileType === 'cs2_pro') {
      updates = {
        vibrance: 85,
        blackEqualizer: 35,
        sharpening: 0.55,
        contrast: 115,
        gamma: 0.95,
        lowLatencyMode: 'ultra',
        reflexMode: 'on_boost',
        powerMode: 'prefer_maximum_performance',
        textureQuality: 'high_performance',
        appliedProfile: 'CS2 Turnuva Espor Profili',
      };
    } else if (profileType === 'valorant_radiant') {
      updates = {
        vibrance: 80,
        blackEqualizer: 20,
        sharpening: 0.45,
        contrast: 110,
        gamma: 1.0,
        lowLatencyMode: 'ultra',
        reflexMode: 'on_boost',
        powerMode: 'prefer_maximum_performance',
        textureQuality: 'high_performance',
        appliedProfile: 'Valorant Radiant Espor Profili',
      };
    } else if (profileType === 'apex_warzone') {
      updates = {
        vibrance: 90,
        blackEqualizer: 45,
        sharpening: 0.65,
        contrast: 120,
        gamma: 0.90,
        lowLatencyMode: 'ultra',
        reflexMode: 'on_boost',
        powerMode: 'prefer_maximum_performance',
        textureQuality: 'high_performance',
        appliedProfile: 'Apex & Warzone Net Görüş Profili',
      };
    } else {
      updates = {
        vibrance: 50,
        blackEqualizer: 0,
        sharpening: 0.0,
        contrast: 100,
        gamma: 1.0,
        lowLatencyMode: 'on',
        reflexMode: 'on',
        powerMode: 'optimal',
        textureQuality: 'quality',
        appliedProfile: 'Varsayılan NVIDIA GeForce Ayarları',
      };
    }
    return this.updateConfig(updates);
  }

  public cleanShaderCache(): { freedGB: number } {
    const freedGB = +(Math.random() * 2 + 2.4).toFixed(1);
    this.updateConfig({
      shaderCacheCleaned: true,
      shaderCacheCleanedSizeGB: freedGB,
    });
    return { freedGB };
  }

  public subscribe(listener: NvidiaListener): () => void {
    this.listeners.add(listener);
    return () => {
      this.listeners.delete(listener);
    };
  }

  private notify(): void {
    this.listeners.forEach(l => {
      try {
        l(this.config);
      } catch {
        // ignore
      }
    });
  }
}

export const nvidiaService = NvidiaService.getInstance();
