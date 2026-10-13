import { AdminKeyItem, LicenseTier } from '../types';
import { PackagePlanInfo, DEFAULT_PACKAGE_PLANS } from '../constants/packagePlans';

const ADMIN_USERNAME = 'ZAXENBABA';
const ADMIN_PASSWORD_HASH = 'Babam.1234';

const STORAGE_KEYS_KEY = 'zaxenbooster_admin_keys';
const STORAGE_PACKAGES_KEY = 'zaxenbooster_package_plans';
const STORAGE_ADMIN_SESSION_KEY = 'zaxenbooster_admin_session';

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

class AdminService {
  private static instance: AdminService;
  private keys: AdminKeyItem[] = [];
  private packagePlans: PackagePlanInfo[] = [];

  private constructor() {
    this.loadKeys();
    this.loadPackages();
  }

  public static getInstance(): AdminService {
    if (!AdminService.instance) {
      AdminService.instance = new AdminService();
    }
    return AdminService.instance;
  }

  // Admin authentication
  public verifyCredentials(username: string, password: string):boolean {
    return username.trim() === ADMIN_USERNAME && password === ADMIN_PASSWORD_HASH;
  }

  public setAdminLoggedIn(isLoggedIn: boolean): void {
    if (isLoggedIn) {
      sessionStorage.setItem(STORAGE_ADMIN_SESSION_KEY, 'active');
    } else {
      sessionStorage.removeItem(STORAGE_ADMIN_SESSION_KEY);
    }
  }

  public isAdminLoggedIn(): boolean {
    return sessionStorage.getItem(STORAGE_ADMIN_SESSION_KEY) === 'active';
  }

  // Key Management
  private loadKeys(): void {
    try {
      const raw = localStorage.getItem(STORAGE_KEYS_KEY);
      if (raw) {
        this.keys = JSON.parse(raw);
        return;
      }
    } catch {
      // fallback
    }

    // Seed with realistic initial keys for demo/convenience
    this.keys = [
      {
        id: 'key-init-1',
        key: 'ZXN-PRO-A89K2M4N-512E',
        tier: 'pro',
        tierLabel: 'ZAXEN Pro Gamer',
        durationDays: 30,
        customerNote: 'VIP Müşteri #1 (CS2 Espor)',
        boundHwid: 'ZXN-HWID-A4F2-81B9',
        boundAt: Date.now() - 86400000 * 3,
        createdAt: Date.now() - 86400000 * 5,
        expiresAt: Date.now() + 86400000 * 27,
        isSuspended: false,
      },
      {
        id: 'key-init-2',
        key: 'ZXN-ULT-X7Q9W3P1-90FD',
        tier: 'ultimate',
        tierLabel: 'ZAXEN Ultimate VIP',
        durationDays: 365,
        customerNote: 'Yıllık Turnuva Lisansı',
        boundHwid: null, // Boşta, ilk giren cihaza kilitlenecek!
        createdAt: Date.now() - 86400000,
        isSuspended: false,
      },
      {
        id: 'key-init-3',
        key: 'ZXN-START-B4C8D2E1-72A0',
        tier: 'starter',
        tierLabel: 'ZAXEN Starter Core',
        durationDays: 7,
        customerNote: 'Deneme Alıcısı (Valorant)',
        boundHwid: null,
        createdAt: Date.now() - 3600000 * 4,
        isSuspended: false,
      }
    ];
    this.saveKeys();
  }

  private saveKeys(): void {
    try {
      localStorage.setItem(STORAGE_KEYS_KEY, JSON.stringify(this.keys));
    } catch {
      // ignore
    }
  }

  public getKeys(): AdminKeyItem[] {
    return [...this.keys];
  }

  public generateKey(params: {
    tier: LicenseTier;
    durationDays: number;
    customerNote: string;
  }): AdminKeyItem {
    let typeCode = 'PRO';
    if (params.tier === 'starter') {
      typeCode = params.durationDays === 7 ? '7D' : 'START';
    } else if (params.tier === 'pro') {
      typeCode = params.durationDays === 90 ? '90D' : 'PRO';
    } else if (params.tier === 'ultimate') {
      typeCode = params.durationDays >= 3650 ? 'LIFE' : params.durationDays >= 365 ? 'VIP' : 'ULT';
    } else if (params.tier === 'trial') {
      typeCode = '1D';
    }

    const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
    let payload = '';
    for (let i = 0; i < 8; i++) {
      payload += chars.charAt(Math.floor(Math.random() * chars.length));
    }

    const checksum = calculateChecksum(payload, typeCode);
    const generatedCode = `ZXN-${typeCode}-${payload}-${checksum}`;

    const tierLabels: Record<LicenseTier, string> = {
      free: 'Ücretsiz',
      trial: 'ZAXEN 1 Günlük Deneme',
      starter: 'ZAXEN Starter Core',
      pro: 'ZAXEN Pro Gamer',
      ultimate: 'ZAXEN Ultimate VIP',
    };

    const newKey: AdminKeyItem = {
      id: `key-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
      key: generatedCode,
      tier: params.tier,
      tierLabel: tierLabels[params.tier] || 'ZAXEN Lisans',
      durationDays: params.durationDays,
      customerNote: params.customerNote.trim() || 'Müşteri Lisansı',
      boundHwid: null, // Initially unbound - locks to first device
      createdAt: Date.now(),
      isSuspended: false,
    };

    this.keys.unshift(newKey);
    this.saveKeys();
    return newKey;
  }

  public resetKeyHwid(keyId: string): boolean {
    const item = this.keys.find(k => k.id === keyId || k.key === keyId);
    if (item) {
      item.boundHwid = null;
      item.boundAt = undefined;
      this.saveKeys();
      return true;
    }
    return false;
  }

  public toggleSuspendKey(keyId: string): boolean {
    const item = this.keys.find(k => k.id === keyId || k.key === keyId);
    if (item) {
      item.isSuspended = !item.isSuspended;
      this.saveKeys();
      return true;
    }
    return false;
  }

  public addDaysToKey(keyId: string, daysToAdd: number): boolean {
    const item = this.keys.find(k => k.id === keyId || k.key === keyId);
    if (item) {
      item.durationDays += daysToAdd;
      if (item.expiresAt) {
        item.expiresAt += daysToAdd * 86400000;
      }
      this.saveKeys();
      return true;
    }
    return false;
  }

  public deleteKey(keyId: string): boolean {
    const idx = this.keys.findIndex(k => k.id === keyId || k.key === keyId);
    if (idx !== -1) {
      this.keys.splice(idx, 1);
      this.saveKeys();
      return true;
    }
    return false;
  }

  public findKeyByCode(code: string): AdminKeyItem | undefined {
    const clean = code.trim().toUpperCase();
    return this.keys.find(k => k.key.toUpperCase() === clean);
  }

  public bindKeyToHwid(keyItem: AdminKeyItem, hwid: string): void {
    keyItem.boundHwid = hwid;
    keyItem.boundAt = Date.now();
    keyItem.expiresAt = Date.now() + keyItem.durationDays * 86400000;
    this.saveKeys();
  }

  // Package Plans Management
  private loadPackages(): void {
    try {
      const raw = localStorage.getItem(STORAGE_PACKAGES_KEY);
      if (raw) {
        this.packagePlans = JSON.parse(raw);
        return;
      }
    } catch {
      // fallback
    }
    this.packagePlans = JSON.parse(JSON.stringify(DEFAULT_PACKAGE_PLANS));
    this.savePackages();
  }

  private savePackages(): void {
    try {
      localStorage.setItem(STORAGE_PACKAGES_KEY, JSON.stringify(this.packagePlans));
    } catch {
      // ignore
    }
  }

  public getPackagePlans(): PackagePlanInfo[] {
    return [...this.packagePlans];
  }

  public updatePackagePlan(updatedPlan: PackagePlanInfo): void {
    const idx = this.packagePlans.findIndex(p => p.id === updatedPlan.id);
    if (idx !== -1) {
      this.packagePlans[idx] = updatedPlan;
      this.savePackages();
    }
  }

  public resetPackagePlans(): PackagePlanInfo[] {
    this.packagePlans = JSON.parse(JSON.stringify(DEFAULT_PACKAGE_PLANS));
    this.savePackages();
    return [...this.packagePlans];
  }
}

export const adminService = AdminService.getInstance();
