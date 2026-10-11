import { LicenseState, LicenseTier, OptimizationItem } from '../types';
import { adminService } from './adminService';

const STORAGE_KEY = 'zaxenbooster_license';
const TRIAL_CODE = 'zaxen1';
const OWNER_SECRET_CODES = ['zaxenboss', 'zxn-master-owner', 'zx-dev-9999', 'zaxenadmin'];

// Secret salt for key signing
const KEY_SALT = 0x5A7E;

function calculateChecksum(segment: string, typeCode: string): string {
  let hash = KEY_SALT;
  const combined = `${typeCode}-${segment}-ZAXENBOOSTER`;
  for (let i = 0; i < combined.length; i++) {
    hash = ((hash << 5) - hash) + combined.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 0xFFFF).toString(16).padStart(4, '0').toUpperCase();
}

export function getSystemHWID(): string {
  let storedHwid = localStorage.getItem('zaxenbooster_hwid');
  if (!storedHwid) {
    const nav = typeof window !== 'undefined' ? window.navigator : ({} as any);
    const screen = typeof window !== 'undefined' ? window.screen : ({} as any);
    const raw = `${nav.userAgent || ''}-${nav.hardwareConcurrency || 8}-${screen.width || 1920}x${screen.height || 1080}-${nav.language || 'tr'}`;
    
    let hash = 0;
    for (let i = 0; i < raw.length; i++) {
      const char = raw.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash |= 0;
    }
    const hex = Math.abs(hash).toString(16).padStart(8, '0').toUpperCase();
    storedHwid = `ZXN-HWID-${hex.slice(0, 4)}-${hex.slice(4, 8)}`;
    localStorage.setItem('zaxenbooster_hwid', storedHwid);
  }
  return storedHwid;
}

export function loadLicense(): LicenseState {
  const hwid = getSystemHWID();
  const raw = localStorage.getItem(STORAGE_KEY);
  
  if (!raw) {
    return {
      isLicensed: false,
      key: '',
      licenseType: 'none',
      tier: 'free',
      tierLabel: 'Ücretsiz / Kısıtlı',
      hwid,
      expiresAt: 0,
      remainingHours: 0,
      remainingMinutes: 0,
      isTrial: false,
      isExpired: false,
      isOwnerMasterMode: false,
    };
  }

  try {
    const data = JSON.parse(raw);
    const now = Date.now();
    const diffMs = data.expiresAt - now;

    // If owner mode is active, always keep ultimate tier and unlimited time
    if (data.isOwnerMasterMode) {
      return {
        ...data,
        hwid,
        isLicensed: true,
        tier: data.tier || 'ultimate',
        tierLabel: data.tierLabel || 'Geliştirici / Sahip Modu (Tam Yetki)',
        isExpired: false,
        remainingHours: 9999,
        remainingMinutes: 59,
      };
    }
    
    if (diffMs <= 0 && data.expiresAt > 0) {
      return {
        ...data,
        hwid,
        isExpired: true,
        tier: 'free',
        tierLabel: 'Süresi Doldu (Kısıtlı Mod)',
        remainingHours: 0,
        remainingMinutes: 0,
      };
    }

    const totalMinutes = Math.floor(diffMs / (1000 * 60));
    const remainingHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return {
      ...data,
      hwid,
      isExpired: false,
      remainingHours,
      remainingMinutes,
    };
  } catch {
    return {
      isLicensed: false,
      key: '',
      licenseType: 'none',
      tier: 'free',
      tierLabel: 'Ücretsiz / Kısıtlı',
      hwid,
      expiresAt: 0,
      remainingHours: 0,
      remainingMinutes: 0,
      isTrial: false,
      isExpired: false,
      isOwnerMasterMode: false,
    };
  }
}

export function activateLicenseKey(inputKey: string): { success: boolean; message: string; license?: LicenseState } {
  const cleanInput = inputKey.trim();
  const lowerInput = cleanInput.toLowerCase();
  const cleanKey = cleanInput.toUpperCase();
  const hwid = getSystemHWID();
  const now = Date.now();

  // 1. Secret Developer / Owner Master Mode
  if (OWNER_SECRET_CODES.includes(lowerInput)) {
    const license: LicenseState = {
      isLicensed: true,
      key: 'ZAXEN-OWNER-MASTER-PASS',
      licenseType: 'lifetime',
      tier: 'ultimate',
      tierLabel: 'Geliştirici / Sahip Modu (Sınırsız VIP)',
      hwid,
      expiresAt: now + 3650 * 24 * 60 * 60 * 1000,
      remainingHours: 87600,
      remainingMinutes: 0,
      isTrial: false,
      isExpired: false,
      isOwnerMasterMode: true,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
    return {
      success: true,
      message: 'Hoş geldin ZAXEN Sahibi! Master Geliştirici Modu aktif edildi; tüm optimizasyon kısıtlamaları kaldırıldı.',
      license,
    };
  }

  // 2. Official Trial Code ('zaxen1')
  if (lowerInput === TRIAL_CODE) {
    const trialDurationMs = 24 * 60 * 60 * 1000;
    const expiresAt = now + trialDurationMs;
    const license: LicenseState = {
      isLicensed: true,
      key: 'TRIAL-24H-ZAXEN1',
      licenseType: 'trial',
      tier: 'trial',
      tierLabel: '1 Günlük Deneme Paketi',
      hwid,
      expiresAt,
      remainingHours: 23,
      remainingMinutes: 59,
      isTrial: true,
      isExpired: false,
      isOwnerMasterMode: false,
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
    return {
      success: true,
      message: '1 Günlük ZAXENBOOSTER Deneme Paketi başarıyla tanımlandı! Temel ve oyun modu optimizasyonları açıldı.',
      license,
    };
  }

  // 3. Check Admin-Generated Database Keys & Single-PC HWID Lock
  const adminKey = adminService.findKeyByCode(cleanKey);
  if (adminKey) {
    if (adminKey.isSuspended) {
      return {
        success: false,
        message: '⛔ Bu lisans anahtarı yönetici tarafından dondurulmuş / askıya alınmıştır!',
      };
    }

    // HWID Device Lock Check (Tek PC Koruması)
    if (adminKey.boundHwid && adminKey.boundHwid !== hwid) {
      return {
        success: false,
        message: `⛔ CİHAZ KİLİDİ HATASI: Bu lisans anahtarı başka bir bilgisayara (HWID: ${adminKey.boundHwid.slice(0, 16)}...) kilitlidir! Farklı bir PC'de çalışmaz. Her lisans sadece tek bir bilgisayar içindir. Yeni bir PC'ye geçiş yaptıysanız ZAXEN Yönetimi ile iletişime geçip HWID kilidini sıfırlatınız.`,
      };
    }

    // First time activation on this PC -> Bind to this HWID!
    if (!adminKey.boundHwid) {
      adminService.bindKeyToHwid(adminKey, hwid);
    }

    const durationMs = adminKey.durationDays * 24 * 60 * 60 * 1000;
    const expiresAt = now + durationMs;
    const licenseType: LicenseState['licenseType'] = 
      adminKey.durationDays >= 3650 ? 'lifetime' :
      adminKey.durationDays >= 365 ? '365days' :
      adminKey.durationDays >= 30 ? '30days' :
      adminKey.durationDays >= 7 ? '7days' : '1day';

    const license: LicenseState = {
      isLicensed: true,
      key: cleanKey,
      licenseType,
      tier: adminKey.tier,
      tierLabel: adminKey.tierLabel,
      hwid,
      expiresAt,
      remainingHours: adminKey.durationDays * 24,
      remainingMinutes: 0,
      isTrial: false,
      isExpired: false,
      isOwnerMasterMode: false,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
    return {
      success: true,
      message: `✅ Başarılı! ${adminKey.tierLabel} anahtarı bu bilgisayara (HWID: ${hwid.slice(0, 14)}...) özel olarak kilitlendi ve aktif edildi.`,
      license,
    };
  }

  // 4. Cryptographically Signed Customer Keys
  const parts = cleanKey.split('-');
  if (parts.length === 4 && (parts[0] === 'ZXN' || parts[0] === 'ZX')) {
    const typeCode = parts[1];
    const payload = parts[2];
    const userChecksum = parts[3];

    const expectedChecksum = calculateChecksum(payload, typeCode);
    if (userChecksum !== expectedChecksum) {
      return {
        success: false,
        message: 'Geçersiz veya sahte lisans anahtarı! Dijital imza doğrulanamadı.',
      };
    }

    let days = 30;
    let type: LicenseState['licenseType'] = '30days';
    let tier: LicenseTier = 'pro';
    let tierLabel = 'ZAXEN Pro Gamer Paketi';

    if (typeCode === '1D' || typeCode === 'START' || typeCode === 'BASIC') {
      days = typeCode === '1D' ? 1 : 30;
      type = '30days';
      tier = 'starter';
      tierLabel = 'ZAXEN Starter Core Paketi';
    } else if (typeCode === '7D') {
      days = 7;
      type = '7days';
      tier = 'starter';
      tierLabel = 'ZAXEN Starter (7 Günlük)';
    } else if (typeCode === '30D' || typeCode === 'PRO') {
      days = 30;
      type = '30days';
      tier = 'pro';
      tierLabel = 'ZAXEN Pro Gamer (30 Günlük)';
    } else if (typeCode === '90D') {
      days = 90;
      type = '30days';
      tier = 'pro';
      tierLabel = 'ZAXEN Pro Gamer (90 Günlük)';
    } else if (typeCode === '365D' || typeCode === 'ULT' || typeCode === 'VIP') {
      days = 365;
      type = '365days';
      tier = 'ultimate';
      tierLabel = 'ZAXEN Ultimate VIP (1 Yıllık)';
    } else if (typeCode === 'LIFE') {
      days = 3650;
      type = 'lifetime';
      tier = 'ultimate';
      tierLabel = 'ZAXEN Ultimate VIP (Ömür Boyu)';
    }

    // Auto-register and lock to this device in adminService
    const createdKeyItem = adminService.generateKey({
      tier,
      durationDays: days,
      customerNote: 'Otomatik İmzalı Key',
    });
    adminService.bindKeyToHwid(createdKeyItem, hwid);

    const durationMs = days * 24 * 60 * 60 * 1000;
    const expiresAt = now + durationMs;
    const license: LicenseState = {
      isLicensed: true,
      key: cleanKey,
      licenseType: type,
      tier,
      tierLabel,
      hwid,
      expiresAt,
      remainingHours: days * 24,
      remainingMinutes: 0,
      isTrial: false,
      isExpired: false,
      isOwnerMasterMode: false,
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(license));
    return {
      success: true,
      message: `✅ ${tierLabel} başarıyla doğrulandı ve bu bilgisayara (HWID) kilitlenerek tanımlandı!`,
      license,
    };
  }

  return {
    success: false,
    message: 'Geçersiz anahtar formatı. Satın aldığınız ZAXEN lisans anahtarını veya "zaxen1" deneme kodunu girin.',
  };
}

// Generate valid customer keys for the owner to give out
export function generateCustomerKey(tier: 'starter' | 'pro' | 'ultimate', durationDays: number = 30): string {
  let typeCode = 'PRO';
  if (tier === 'starter') {
    typeCode = durationDays === 7 ? '7D' : 'START';
  } else if (tier === 'pro') {
    typeCode = durationDays === 90 ? '90D' : 'PRO';
  } else if (tier === 'ultimate') {
    typeCode = durationDays > 365 ? 'LIFE' : 'ULT';
  }

  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let payload = '';
  for (let i = 0; i < 8; i++) {
    payload += chars.charAt(Math.floor(Math.random() * chars.length));
  }

  const checksum = calculateChecksum(payload, typeCode);
  return `ZXN-${typeCode}-${payload}-${checksum}`;
}

// Developer test switch: Allows the owner to test customer tiers
export function setSimulatedTier(targetTier: LicenseTier): LicenseState {
  const current = loadLicense();
  const tierLabels: Record<LicenseTier, string> = {
    free: 'Ücretsiz / Kısıtlı Mod',
    trial: '1 Günlük Deneme Paketi (zaxen1)',
    starter: 'Starter Core Paketi (Müşteri)',
    pro: 'Pro Gamer Paketi (Müşteri)',
    ultimate: 'Ultimate VIP Paketi (Sınırsız)',
  };

  const updated: LicenseState = {
    ...current,
    tier: targetTier,
    tierLabel: tierLabels[targetTier],
    isLicensed: targetTier !== 'free',
    isExpired: targetTier === 'free',
  };

  localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  return updated;
}

// Feature access checker based on package tier
export function checkOptimizationItemAccess(item: OptimizationItem, state: LicenseState): { 
  allowed: boolean; 
  requiredTierLabel: string;
  badgeText: string;
} {
  // 1. Owner Master Mode has ZERO restrictions!
  if (state.isOwnerMasterMode) {
    return { allowed: true, requiredTierLabel: 'Sahip / Master', badgeText: 'Sahip Açık' };
  }

  // 2. Determine required tier from item
  const required = item.requiredTier || 'starter';

  const tierRank: Record<LicenseTier, number> = {
    free: 0,
    trial: 1,
    starter: 1,
    pro: 2,
    ultimate: 3,
  };

  const reqRank: Record<LicenseTier, number> = {
    free: 0,
    trial: 1,
    starter: 1,
    pro: 2,
    ultimate: 3,
  };

  const currentRank = tierRank[state.tier] || 0;
  const neededRank = reqRank[required] || 1;

  if (currentRank < neededRank) {
    const label = required === 'ultimate' ? 'Ultimate VIP' : required === 'pro' ? 'Pro Gamer' : 'Starter';
    return {
      allowed: false,
      requiredTierLabel: label,
      badgeText: `${label.toUpperCase()} GEREKTİRİR`,
    };
  }

  return {
    allowed: true,
    requiredTierLabel: 'Erişilebilir',
    badgeText: 'Dahil',
  };
}

// Feature level checker
export function checkFeatureAccess(feature: 'boost' | 'advanced_tweaks' | 'unlimited_games' | 'esports_radar' | 'custom_themes' | 'deep_kernel', state: LicenseState): { allowed: boolean; minTier: string } {
  if (state.isOwnerMasterMode) return { allowed: true, minTier: 'Sahip / Master' };

  const tierRank: Record<LicenseTier, number> = {
    free: 0,
    trial: 1,
    starter: 1,
    pro: 2,
    ultimate: 3,
  };

  const currentRank = tierRank[state.tier] || 0;

  switch (feature) {
    case 'boost':
      return { allowed: currentRank >= 1, minTier: 'Starter veya Deneme' };
    case 'advanced_tweaks':
    case 'unlimited_games':
    case 'esports_radar':
      return { allowed: currentRank >= 2, minTier: 'Pro Gamer' };
    case 'custom_themes':
      return { allowed: currentRank >= 2, minTier: 'Pro Gamer' };
    case 'deep_kernel':
      return { allowed: currentRank >= 3, minTier: 'Ultimate VIP' };
    default:
      return { allowed: true, minTier: 'Free' };
  }
}

import { DEFAULT_PACKAGE_PLANS } from '../constants/packagePlans';
import type { PackagePlanInfo } from '../types';
export type { PackagePlanInfo };
export { DEFAULT_PACKAGE_PLANS as PACKAGE_PLANS };

export function getLivePackagePlans(): PackagePlanInfo[] {
  return adminService.getPackagePlans();
}
