export type TabType = 
  | 'dashboard' 
  | 'analysis' 
  | 'boost' 
  | 'nvidia'
  | 'games' 
  | 'fps' 
  | 'tools' 
  | 'backups' 
  | 'settings';

export type AccentColor = 'red' | 'blue' | 'purple' | 'green' | 'gold';

export interface AppBranding {
  brandName: string;
  brandSuffix: string;
  slogan: string;
  logoIcon: 'zap' | 'crown' | 'flame' | 'shield' | 'cpu' | 'target' | 'gamepad';
  announcementText: string;
  whatsappNumber: string;
  whatsappMessage: string;
  discordUrl: string;
}

export interface AdminKeyItem {
  id: string;
  key: string;
  tier: LicenseTier;
  tierLabel: string;
  durationDays: number;
  customerNote: string;
  boundHwid: string | null;
  boundAt?: number;
  createdAt: number;
  expiresAt?: number;
  isSuspended: boolean;
}

export interface PackagePlanInfo {
  id: LicenseTier;
  title: string;
  tagline: string;
  badge: string;
  price?: string;
  highlightColor: string;
  features: string[];
  restrictedFeatures: string[];
  popular?: boolean;
}

export interface NvidiaConfig {
  vibrance: number; // 0 to 100
  blackEqualizer: number; // 0 to 100
  sharpening: number; // 0.0 to 1.0
  contrast: number; // 100 to 140
  gamma: number; // 0.8 to 1.2
  lowLatencyMode: 'off' | 'on' | 'ultra';
  reflexMode: 'off' | 'on' | 'on_boost';
  maxFps: number; // 0 = unlimited
  powerMode: 'optimal' | 'adaptive' | 'prefer_maximum_performance';
  textureQuality: 'quality' | 'performance' | 'high_performance';
  threadedOptimization: boolean;
  shaderCacheCleaned: boolean;
  shaderCacheCleanedSizeGB: number;
  shaderCacheSize: 'default' | '10gb' | 'unlimited';
  appliedProfile?: string;
}

export interface SystemMetrics {
  cpu: {
    model: string;
    cores: number;
    usagePercent: number;
    temperatureC: number;
    clockSpeedGHz: number;
    history: number[];
  };
  gpu: {
    model: string;
    usagePercent: number;
    temperatureC: number;
    vramUsedGB: number;
    vramTotalGB: number;
    history: number[];
  };
  ram: {
    totalGB: number;
    usedGB: number;
    freeGB: number;
    usagePercent: number;
    speedMHz: number;
    history: number[];
  };
  disk: {
    driveLetter: string;
    totalGB: number;
    usedGB: number;
    freeGB: number;
    cleanableGB: number;
    usagePercent: number;
  };
  overallHealthScore: number;
  categoryScores: {
    cpu: number;
    ram: number;
    gpu: number;
    disk: number;
    startup: number;
    windowsSettings: number;
  };
}

export interface OptimizationItem {
  id: string;
  category: 'cpu' | 'ram' | 'disk' | 'system' | 'gaming' | 'network';
  name: string;
  description: string;
  whatItDoes: string;
  rollbackInfo: string;
  enabled: boolean;
  applied: boolean;
  riskLevel: 'safe' | 'moderate';
  impact: 'Yüksek' | 'Orta' | 'Düşük';
  requiredTier?: LicenseTier;
}

export interface BackupItem {
  id: string;
  timestamp: string;
  title: string;
  description: string;
  optimizationCount: number;
  restored: boolean;
  affectedSettings: string[];
}

export interface GameProfile {
  id: string;
  gameId: string;
  highPriority: boolean;
  closeBackgroundApps: boolean;
  gameMode: boolean;
  ultimatePowerPlan: boolean;
  cleanRamOnLaunch: boolean;
  autoApply: boolean;
}

export interface GameItem {
  id: string;
  name: string;
  platform: 'Steam' | 'Epic Games' | 'Riot Games' | 'Xbox' | 'Ubisoft' | 'Custom';
  installDrive: string;
  path: string;
  sizeGB: number;
  profile: GameProfile;
  lastPlayed?: string;
  icon?: string;
  steamAppId?: number;
  imageUrl?: string;
}

export interface FpsRecord {
  id: string;
  gameName: string;
  beforeFps: number;
  afterFps: number;
  gainFps: number;
  gainPercent: number;
  date: string;
}

export type LicenseTier = 'free' | 'trial' | 'starter' | 'pro' | 'ultimate';

export interface LicenseState {
  isLicensed: boolean;
  key: string;
  licenseType: 'none' | 'trial' | '1day' | '7days' | '30days' | '365days' | 'lifetime';
  tier: LicenseTier;
  tierLabel: string;
  hwid: string;
  expiresAt: number; // timestamp
  remainingHours: number;
  remainingMinutes: number;
  isTrial: boolean;
  isExpired: boolean;
  isOwnerMasterMode?: boolean; // Owner bypass
}

export interface AppSettings {
  accentColor: AccentColor;
  autoBoostOnGameLaunch: boolean;
  startWithWindows: boolean;
  enableNotifications: boolean;
  enableSoundEffects: boolean;
  enableCustomCursor: boolean;
  temperatureAlertThreshold: number;
  ramAlertThreshold: number;
  language: 'tr' | 'en';
}

export interface SmartNotification {
  id: string;
  type: 'info' | 'warning' | 'success' | 'alert';
  title: string;
  message: string;
  timestamp: string;
  actionText?: string;
  onAction?: () => void;
}
