import React, { useState, useEffect } from 'react';
import { 
  X, 
  Lock, 
  KeyRound, 
  ShieldCheck, 
  Copy, 
  Check, 
  RotateCcw, 
  Trash2, 
  Plus, 
  Layers, 
  Palette, 
  MessageSquare, 
  Smartphone, 
  LogOut, 
  Sliders, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  Zap,
  Crown,
  Flame,
  Shield,
  Cpu,
  Target,
  Gamepad2,
  ExternalLink
} from 'lucide-react';
import { adminService } from '../../services/adminService';
import { brandingService } from '../../services/brandingService';
import { AdminKeyItem, LicenseTier, AppBranding } from '../../types';
import { PackagePlanInfo } from '../../services/licensingService';
import { soundFx } from '../../services/soundFxService';

interface AdminPanelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onBrandingUpdated?: () => void;
}

export const AdminPanelModal: React.FC<AdminPanelModalProps> = ({
  isOpen,
  onClose,
  onBrandingUpdated
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => adminService.isAdminLoggedIn());
  const [username, setUsername] = useState('zaxen001');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);

  // Tabs
  const [activeTab, setActiveTab] = useState<'keys' | 'packages' | 'branding' | 'security'>('keys');

  // Keys state
  const [keys, setKeys] = useState<AdminKeyItem[]>([]);
  const [genTier, setGenTier] = useState<LicenseTier>('pro');
  const [genDays, setGenDays] = useState<number>(30);
  const [customerNote, setCustomerNote] = useState('');
  const [justGeneratedKey, setJustGeneratedKey] = useState<string | null>(null);
  const [copiedKeyId, setCopiedKeyId] = useState<string | null>(null);

  // Packages state
  const [packages, setPackages] = useState<PackagePlanInfo[]>([]);
  const [editingPackage, setEditingPackage] = useState<PackagePlanInfo | null>(null);

  // Branding state
  const [branding, setBranding] = useState<AppBranding>(() => brandingService.getBranding());
  const [brandingSaved, setBrandingSaved] = useState(false);

  // Feedback notification
  const [feedback, setFeedback] = useState<string | null>(null);

  useEffect(() => {
    if (isAuthenticated) {
      setKeys(adminService.getKeys());
      setPackages(adminService.getPackagePlans());
      setBranding(brandingService.getBranding());
    }
  }, [isAuthenticated]);

  if (!isOpen) return null;

  const showNotification = (msg: string) => {
    setFeedback(msg);
    setTimeout(() => setFeedback(null), 3500);
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    soundFx.playClickSound();
    if (adminService.verifyCredentials(username, password)) {
      adminService.setAdminLoggedIn(true);
      setIsAuthenticated(true);
      setLoginError(null);
      soundFx.playBoostSound();
    } else {
      setLoginError('Hatalı kullanıcı adı veya şifre! (Admin: zaxen001 / 12344321Ll)');
    }
  };

  const handleLogout = () => {
    soundFx.playClickSound();
    adminService.setAdminLoggedIn(false);
    setIsAuthenticated(false);
    setPassword('');
  };

  // Key operations
  const handleGenerateKey = () => {
    soundFx.playBoostSound();
    const newKey = adminService.generateKey({
      tier: genTier,
      durationDays: genDays,
      customerNote: customerNote.trim() || 'Müşteri Lisansı',
    });
    setKeys(adminService.getKeys());
    setJustGeneratedKey(newKey.key);
    setCustomerNote('');
    showNotification(`✅ Yeni Lisans Anahtarı (${newKey.key}) başarıyla üretildi!`);
  };

  const handleCopyKey = (keyString: string, id: string) => {
    soundFx.playClickSound();
    navigator.clipboard?.writeText(keyString);
    setCopiedKeyId(id);
    setTimeout(() => setCopiedKeyId(null), 2000);
  };

  const handleResetHwid = (keyId: string) => {
    soundFx.playClickSound();
    if (adminService.resetKeyHwid(keyId)) {
      setKeys(adminService.getKeys());
      showNotification('🔓 HWID Kilidi başarıyla sıfırlandı! Anahtar artık müşterinin yeni bilgisayarına kilitlenebilir.');
    }
  };

  const handleToggleSuspend = (keyId: string) => {
    soundFx.playClickSound();
    adminService.toggleSuspendKey(keyId);
    setKeys(adminService.getKeys());
  };

  const handleAddDays = (keyId: string, days: number) => {
    soundFx.playClickSound();
    adminService.addDaysToKey(keyId, days);
    setKeys(adminService.getKeys());
    showNotification(`➕ Anahtara +${days} gün eklendi!`);
  };

  const handleDeleteKey = (keyId: string) => {
    soundFx.playClickSound();
    if (confirm('Bu lisans anahtarını silmek istediğinize emin misiniz?')) {
      adminService.deleteKey(keyId);
      setKeys(adminService.getKeys());
      showNotification('🗑️ Lisans anahtarı silindi.');
    }
  };

  // Package operations
  const handleSavePackage = (updated: PackagePlanInfo) => {
    soundFx.playClickSound();
    adminService.updatePackagePlan(updated);
    setPackages(adminService.getPackagePlans());
    setEditingPackage(null);
    showNotification(`✅ "${updated.title}" paketi başarıyla güncellendi!`);
  };

  // Branding operations
  const handleSaveBranding = () => {
    soundFx.playBoostSound();
    brandingService.updateBranding(branding);
    setBrandingSaved(true);
    if (onBrandingUpdated) onBrandingUpdated();
    showNotification('💾 Site logosu, başlık, slogan ve destek bağlantıları kaydedildi!');
    setTimeout(() => setBrandingSaved(false), 2500);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl animate-in fade-in select-none">
      <div className="relative w-full max-w-5xl max-h-[92vh] flex flex-col bg-[#090b10] border border-amber-500/40 rounded-3xl shadow-[0_0_60px_rgba(245,158,11,0.2)] overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 border-b border-white/[0.08] flex items-center justify-between bg-gradient-to-r from-amber-950/30 via-transparent to-transparent">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.3)] shrink-0">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                  MASTER KONTROL
                </span>
                <span className="text-xs text-slate-400 font-mono">zaxen001 Root Access</span>
              </div>
              <h2 className="text-lg font-black text-white font-display tracking-wide">
                ZAXEN BOOSTER <span className="text-amber-400">Yönetici Paneli</span>
              </h2>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {isAuthenticated && (
              <button
                onClick={handleLogout}
                className="px-3 py-1.5 rounded-xl bg-white/[0.05] hover:bg-rose-500/20 text-slate-300 hover:text-rose-300 border border-white/10 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                title="Çıkış Yap"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Çıkış</span>
              </button>
            )}
            <button
              onClick={onClose}
              className="w-9 h-9 rounded-xl bg-white/[0.05] hover:bg-white/10 text-slate-400 hover:text-white border border-white/10 flex items-center justify-center transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Global Feedback Banner */}
        {feedback && (
          <div className="px-5 py-2.5 bg-amber-500/15 border-b border-amber-500/30 text-xs text-amber-200 flex items-center gap-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-amber-400 shrink-0" />
            <span className="font-semibold">{feedback}</span>
          </div>
        )}

        {/* Body Content */}
        {!isAuthenticated ? (
          /* LOGIN FORM */
          <div className="p-8 sm:p-12 flex flex-col items-center justify-center max-w-md mx-auto text-center space-y-6">
            <div className="w-16 h-16 rounded-3xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 shadow-[0_0_25px_rgba(245,158,11,0.25)]">
              <Lock className="w-8 h-8" />
            </div>

            <div>
              <h3 className="text-xl font-bold text-white font-display">Yönetici Girişi</h3>
              <p className="text-xs text-slate-400 mt-1">
                Lisans üretimi, paket ve site ayarlarını yönetmek için admin bilgilerinizi girin.
              </p>
            </div>

            {loginError && (
              <div className="w-full p-3 rounded-xl bg-rose-500/20 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2 text-left">
                <AlertTriangle className="w-4 h-4 shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <form onSubmit={handleLogin} className="w-full space-y-3.5">
              <div className="text-left space-y-1">
                <label className="text-xs font-mono text-slate-400">Kullanıcı Adı:</label>
                <input
                  type="text"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
                  placeholder="zaxen001"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <div className="text-left space-y-1">
                <label className="text-xs font-mono text-slate-400">Şifre:</label>
                <input
                  type="password"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  placeholder="••••••••••"
                  required
                  className="w-full px-4 py-2.5 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono text-xs focus:outline-none focus:border-amber-400"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black font-extrabold text-xs shadow-lg transition-all"
              >
                Giriş Yap ve Yönetim Masasını Aç
              </button>
            </form>

            <div className="text-[11px] text-slate-500 font-mono">
              Varsayılan Bilgiler: zaxen001 / 12344321Ll
            </div>
          </div>
        ) : (
          /* AUTHENTICATED ADMIN DASHBOARD */
          <div className="flex-1 flex flex-col min-h-0 overflow-hidden">
            {/* Nav Tabs */}
            <div className="px-5 pt-3 border-b border-white/[0.08] flex items-center gap-2 overflow-x-auto bg-black/40">
              <button
                onClick={() => { soundFx.playClickSound(); setActiveTab('keys'); }}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-display flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'keys'
                    ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <KeyRound className="w-4 h-4" />
                <span>Lisans & Key Yönetimi (HWID Koruması)</span>
                <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-white/10 text-white font-mono">{keys.length}</span>
              </button>

              <button
                onClick={() => { soundFx.playClickSound(); setActiveTab('packages'); }}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-display flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'packages'
                    ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Layers className="w-4 h-4" />
                <span>Paket & Üyelik Ayarları</span>
              </button>

              <button
                onClick={() => { soundFx.playClickSound(); setActiveTab('branding'); }}
                className={`px-4 py-2.5 rounded-t-xl text-xs font-bold font-display flex items-center gap-2 transition-all border-b-2 whitespace-nowrap ${
                  activeTab === 'branding'
                    ? 'border-amber-400 text-amber-400 bg-amber-500/10'
                    : 'border-transparent text-slate-400 hover:text-slate-200'
                }`}
              >
                <Palette className="w-4 h-4" />
                <span>Site Logo & İletişim Ayarları</span>
              </button>
            </div>

            {/* Tab Body */}
            <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">

              {/* TAB 1: KEYS & HWID */}
              {activeTab === 'keys' && (
                <div className="space-y-6">
                  {/* Key Generator Card */}
                  <div className="p-5 rounded-2xl bg-[#0e121a] border border-amber-500/30 shadow-lg space-y-4">
                    <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                      <div className="flex items-center gap-2">
                        <KeyRound className="w-4 h-4 text-amber-400" />
                        <h3 className="text-xs font-bold text-white uppercase tracking-wider font-display">
                          Yeni Lisans Anahtarı Üret (Tek Kişi / Tek PC Kilitli)
                        </h3>
                      </div>
                      <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded border border-emerald-500/30">
                        🔒 Donanım HWID Kilidi Aktif
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      {/* Tier */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400">Paket Seç:</label>
                        <select
                          value={genTier}
                          onChange={e => setGenTier(e.target.value as LicenseTier)}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                        >
                          <option value="starter" className="bg-[#0f1117]">Starter Core</option>
                          <option value="pro" className="bg-[#0f1117]">Pro Gamer (Popüler)</option>
                          <option value="ultimate" className="bg-[#0f1117]">Ultimate VIP</option>
                          <option value="trial" className="bg-[#0f1117]">1 Günlük Deneme</option>
                        </select>
                      </div>

                      {/* Duration */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400">Süre (Gün):</label>
                        <select
                          value={genDays}
                          onChange={e => setGenDays(Number(e.target.value))}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs font-semibold focus:outline-none focus:border-amber-400"
                        >
                          <option value={1} className="bg-[#0f1117]">1 Gün</option>
                          <option value={7} className="bg-[#0f1117]">7 Gün (Haftalık)</option>
                          <option value={30} className="bg-[#0f1117]">30 Gün (Aylık)</option>
                          <option value={90} className="bg-[#0f1117]">90 Gün (3 Aylık)</option>
                          <option value={365} className="bg-[#0f1117]">365 Gün (Yıllık)</option>
                          <option value={3650} className="bg-[#0f1117]">Ömür Boyu (Lifetime)</option>
                        </select>
                      </div>

                      {/* Note */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400">Müşteri Notu / İsim:</label>
                        <input
                          type="text"
                          value={customerNote}
                          onChange={e => setCustomerNote(e.target.value)}
                          placeholder="Örn: Ahmet - Discord"
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:outline-none focus:border-amber-400"
                        />
                      </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
                      <p className="text-[11px] text-slate-400 max-w-lg">
                        ⚠️ <strong className="text-slate-300">Tek Kişi Kuralı:</strong> Üretilen anahtar müşteriye verildiğinde, anahtarı girdiği ilk bilgisayarın HWID numarasına kilitlenir. Başka bir PC'de girilirse uygulama izin vermez.
                      </p>

                      <button
                        onClick={handleGenerateKey}
                        className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg transition-all flex items-center gap-2 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Anahtar Üret</span>
                      </button>
                    </div>

                    {justGeneratedKey && (
                      <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/40 flex items-center justify-between text-xs animate-in fade-in">
                        <div className="flex items-center gap-2">
                          <span className="text-amber-400 font-bold">Yeni Anahtarınız:</span>
                          <span className="font-mono font-black text-white text-sm tracking-wider select-all">
                            {justGeneratedKey}
                          </span>
                        </div>
                        <button
                          onClick={() => handleCopyKey(justGeneratedKey, 'just-gen')}
                          className="px-3 py-1 rounded-lg bg-amber-500 text-black font-bold text-xs flex items-center gap-1.5 hover:bg-amber-400 transition-colors"
                        >
                          {copiedKeyId === 'just-gen' ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                          <span>{copiedKeyId === 'just-gen' ? 'Kopyalandı' : 'Kopyala'}</span>
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Keys Table */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between text-xs font-bold text-slate-300">
                      <span>Mevcut Lisans Veritabanı ({keys.length})</span>
                      <span className="text-slate-500 font-mono text-[11px]">Format: ZXN-[TIER]-[PAYLOAD]-[CHECKSUM]</span>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-white/[0.08] bg-[#0a0c12]">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-white/[0.04] text-[10px] font-mono text-slate-400 uppercase tracking-wider border-b border-white/[0.08]">
                          <tr>
                            <th className="p-3">Lisans Kodu</th>
                            <th className="p-3">Paket & Süre</th>
                            <th className="p-3">Müşteri Notu</th>
                            <th className="p-3">Kilitli HWID (Tek PC)</th>
                            <th className="p-3">Durum</th>
                            <th className="p-3 text-right">İşlemler</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-white/[0.04]">
                          {keys.map(k => (
                            <tr key={k.id} className="hover:bg-white/[0.02] transition-colors">
                              <td className="p-3">
                                <div className="font-mono font-bold text-white tracking-wider flex items-center gap-2">
                                  <span>{k.key}</span>
                                  <button
                                    onClick={() => handleCopyKey(k.key, k.id)}
                                    className="text-slate-400 hover:text-amber-400 transition-colors"
                                    title="Kodu Kopyala"
                                  >
                                    {copiedKeyId === k.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                                  </button>
                                </div>
                              </td>
                              <td className="p-3">
                                <span className="font-semibold text-slate-200">{k.tierLabel}</span>
                                <div className="text-[10px] text-slate-400 font-mono">{k.durationDays} Gün</div>
                              </td>
                              <td className="p-3 text-slate-300 font-mono text-[11px]">
                                {k.customerNote || '-'}
                              </td>
                              <td className="p-3">
                                {k.boundHwid ? (
                                  <div className="space-y-0.5">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1 w-max">
                                      <span>🔒 {k.boundHwid}</span>
                                    </span>
                                    <div className="text-[9px] text-slate-500 font-mono">Sadece bu PC'de çalışır</div>
                                  </div>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-500/20 text-blue-300 border border-blue-500/30">
                                    🔓 Henüz Kullanılmadı (Boşta)
                                  </span>
                                )}
                              </td>
                              <td className="p-3">
                                {k.isSuspended ? (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-rose-500/20 text-rose-300 border border-rose-500/30">
                                    Askıya Alındı
                                  </span>
                                ) : (
                                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                                    Aktif
                                  </span>
                                )}
                              </td>
                              <td className="p-3 text-right">
                                <div className="flex items-center justify-end gap-1.5">
                                  {/* Reset HWID button */}
                                  {k.boundHwid && (
                                    <button
                                      onClick={() => handleResetHwid(k.id)}
                                      className="px-2 py-1 rounded-lg bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-[10px] font-bold transition-colors"
                                      title="Cihaz Kilidini Sıfırla (Müşteri yeni PC'ye geçebilsin)"
                                    >
                                      🔓 HWID Sıfırla
                                    </button>
                                  )}

                                  {/* Add 30 Days */}
                                  <button
                                    onClick={() => handleAddDays(k.id, 30)}
                                    className="px-2 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 text-slate-300 text-[10px] font-bold border border-white/10 transition-colors"
                                    title="+30 Gün Süre Ekle"
                                  >
                                    +30G
                                  </button>

                                  {/* Toggle Suspend */}
                                  <button
                                    onClick={() => handleToggleSuspend(k.id)}
                                    className="px-2 py-1 rounded-lg bg-white/[0.05] hover:bg-white/10 text-slate-300 text-[10px] font-bold border border-white/10 transition-colors"
                                    title={k.isSuspended ? 'Aktifleştir' : 'Askıya Al'}
                                  >
                                    {k.isSuspended ? 'Aç' : 'Durdur'}
                                  </button>

                                  {/* Delete */}
                                  <button
                                    onClick={() => handleDeleteKey(k.id)}
                                    className="p-1 rounded-lg bg-rose-500/10 hover:bg-rose-500/20 text-rose-400 border border-rose-500/20 transition-colors"
                                    title="Sil"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: PACKAGES & TIERS */}
              {activeTab === 'packages' && (
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="text-sm font-bold text-white font-display">Paket ve Üyelik Düzenleyici</h3>
                      <p className="text-xs text-slate-400">
                        Kullanıcıların satın alabileceği paketlerin isimlerini, fiyatlarını ve özelliklerini buradan değiştirin.
                      </p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {packages.map(pkg => (
                      <div 
                        key={pkg.id} 
                        className="p-5 rounded-2xl bg-[#0e111a] border border-white/10 hover:border-amber-400/40 transition-all space-y-4 shadow-lg"
                      >
                        <div className="flex items-center justify-between pb-3 border-b border-white/[0.08]">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-sm font-extrabold text-white">{pkg.title}</span>
                              <span 
                                className="px-2 py-0.5 rounded text-[10px] font-mono font-bold"
                                style={{ backgroundColor: `${pkg.highlightColor}25`, color: pkg.highlightColor }}
                              >
                                {pkg.badge}
                              </span>
                            </div>
                            <div className="text-[11px] text-slate-400 mt-0.5">{pkg.tagline}</div>
                          </div>

                          <button
                            onClick={() => setEditingPackage({ ...pkg })}
                            className="px-3 py-1.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-bold transition-colors"
                          >
                            Düzenle
                          </button>
                        </div>

                        {/* Price & Features */}
                        <div className="space-y-2 text-xs">
                          <div className="flex items-center justify-between text-slate-300">
                            <span className="font-mono text-slate-400">Fiyat:</span>
                            <span className="font-bold text-white font-mono">{pkg.price || 'Özel Fiyat'}</span>
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            <strong className="text-slate-300">Dahil Özellikler ({pkg.features.length}):</strong>
                            <ul className="list-disc list-inside mt-1 space-y-0.5 text-slate-400 text-[10px]">
                              {pkg.features.slice(0, 3).map((f, i) => (
                                <li key={i} className="truncate">{f}</li>
                              ))}
                              {pkg.features.length > 3 && (
                                <li className="text-amber-400 font-mono">+{pkg.features.length - 3} özellik daha...</li>
                              )}
                            </ul>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Edit Package Modal Dialog */}
                  {editingPackage && (
                    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
                      <div className="w-full max-w-lg p-6 rounded-2xl bg-[#0d1017] border border-amber-400/50 shadow-2xl space-y-4">
                        <div className="flex items-center justify-between pb-3 border-b border-white/10">
                          <h4 className="text-sm font-bold text-white font-display">
                            Paket Düzenle: {editingPackage.title}
                          </h4>
                          <button onClick={() => setEditingPackage(null)} className="text-slate-400 hover:text-white">
                            <X className="w-4 h-4" />
                          </button>
                        </div>

                        <div className="space-y-3 text-xs">
                          <div className="space-y-1">
                            <label className="text-slate-400 font-mono">Paket Başlığı:</label>
                            <input
                              type="text"
                              value={editingPackage.title}
                              onChange={e => setEditingPackage({ ...editingPackage, title: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-semibold"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-400 font-mono">Fiyat Metni (₺/Ay veya Ücretsiz):</label>
                            <input
                              type="text"
                              value={editingPackage.price || ''}
                              onChange={e => setEditingPackage({ ...editingPackage, price: e.target.value })}
                              placeholder="Örn: 129 ₺ / Ay"
                              className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-400 font-mono">Rozet / Badge Metni:</label>
                            <input
                              type="text"
                              value={editingPackage.badge}
                              onChange={e => setEditingPackage({ ...editingPackage, badge: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white"
                            />
                          </div>

                          <div className="space-y-1">
                            <label className="text-slate-400 font-mono">Slogan / Açıklama:</label>
                            <input
                              type="text"
                              value={editingPackage.tagline}
                              onChange={e => setEditingPackage({ ...editingPackage, tagline: e.target.value })}
                              className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white"
                            />
                          </div>
                        </div>

                        <div className="flex items-center justify-end gap-2 pt-2 border-t border-white/10">
                          <button
                            onClick={() => setEditingPackage(null)}
                            className="px-4 py-2 rounded-xl bg-white/[0.05] text-slate-300 text-xs font-semibold"
                          >
                            İptal
                          </button>
                          <button
                            onClick={() => handleSavePackage(editingPackage)}
                            className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold"
                          >
                            Kaydet
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 3: BRANDING & CONTACT */}
              {activeTab === 'branding' && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-sm font-bold text-white font-display">Logo, Marka & Destek İletişim Ayarları</h3>
                    <p className="text-xs text-slate-400">
                      Uygulamanın logosunu, ana başlığını, sloganını, WhatsApp ve Discord destek hatlarını buradan tek tıkla değiştirebilirsiniz.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                    {/* Left: Brand Identity */}
                    <div className="p-5 rounded-2xl bg-[#0e111a] border border-white/10 space-y-4">
                      <div className="text-xs font-bold text-amber-400 uppercase tracking-wider font-mono">
                        Marka & Logo Görünümü
                      </div>

                      {/* Logo Icon Picker */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-300 font-semibold">Logo İkonu:</label>
                        <div className="grid grid-cols-4 gap-2">
                          {[
                            { id: 'zap', label: 'Şimşek', icon: <Zap className="w-4 h-4" /> },
                            { id: 'crown', label: 'Taç', icon: <Crown className="w-4 h-4" /> },
                            { id: 'flame', label: 'Alev', icon: <Flame className="w-4 h-4" /> },
                            { id: 'shield', label: 'Kalkan', icon: <Shield className="w-4 h-4" /> },
                            { id: 'cpu', label: 'Çip', icon: <Cpu className="w-4 h-4" /> },
                            { id: 'target', label: 'Nişangah', icon: <Target className="w-4 h-4" /> },
                            { id: 'gamepad', label: 'Gamepad', icon: <Gamepad2 className="w-4 h-4" /> },
                          ].map(item => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setBranding({ ...branding, logoIcon: item.id as any })}
                              className={`p-2 rounded-xl border flex flex-col items-center gap-1 text-[11px] font-semibold transition-all ${
                                branding.logoIcon === item.id
                                  ? 'bg-amber-500/20 border-amber-400 text-amber-300 shadow-[0_0_12px_rgba(245,158,11,0.3)]'
                                  : 'bg-white/[0.04] border-white/10 text-slate-400 hover:text-slate-200'
                              }`}
                            >
                              {item.icon}
                              <span>{item.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Brand Title */}
                      <div className="grid grid-cols-2 gap-3">
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-slate-400">Marka Adı:</label>
                          <input
                            type="text"
                            value={branding.brandName}
                            onChange={e => setBranding({ ...branding, brandName: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-extrabold text-xs"
                          />
                        </div>
                        <div className="space-y-1">
                          <label className="text-[11px] font-mono text-slate-400">Vurgu Metni:</label>
                          <input
                            type="text"
                            value={branding.brandSuffix}
                            onChange={e => setBranding({ ...branding, brandSuffix: e.target.value })}
                            className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-amber-400 font-extrabold text-xs"
                          />
                        </div>
                      </div>

                      {/* Slogan */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400">Slogan / Alt Başlık:</label>
                        <input
                          type="text"
                          value={branding.slogan}
                          onChange={e => setBranding({ ...branding, slogan: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs"
                        />
                      </div>

                      {/* Announcement Ticker */}
                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400">Üst Duyuru / Ticker Metni:</label>
                        <input
                          type="text"
                          value={branding.announcementText}
                          onChange={e => setBranding({ ...branding, announcementText: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs"
                        />
                      </div>
                    </div>

                    {/* Right: Contact & Support */}
                    <div className="p-5 rounded-2xl bg-[#0e111a] border border-white/10 space-y-4">
                      <div className="text-xs font-bold text-emerald-400 uppercase tracking-wider font-mono flex items-center gap-2">
                        <span>WhatsApp & Discord Destek Hatları</span>
                      </div>

                      {/* WhatsApp */}
                      <div className="space-y-1.5">
                        <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                          WhatsApp Destek Telefon Numarası:
                        </label>
                        <input
                          type="text"
                          value={branding.whatsappNumber}
                          onChange={e => setBranding({ ...branding, whatsappNumber: e.target.value })}
                          placeholder="+90 532 000 00 00"
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono text-xs focus:border-emerald-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[11px] font-mono text-slate-400">WhatsApp Karşılama Mesajı:</label>
                        <textarea
                          rows={2}
                          value={branding.whatsappMessage}
                          onChange={e => setBranding({ ...branding, whatsappMessage: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white text-xs focus:border-emerald-400"
                        />
                      </div>

                      {/* Discord */}
                      <div className="space-y-1.5 pt-2 border-t border-white/[0.08]">
                        <label className="text-xs text-slate-300 font-semibold flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-indigo-400"></span>
                          Discord Sunucu Davet Bağlantısı:
                        </label>
                        <input
                          type="text"
                          value={branding.discordUrl}
                          onChange={e => setBranding({ ...branding, discordUrl: e.target.value })}
                          placeholder="https://discord.gg/zaxenbooster"
                          className="w-full px-3 py-2 rounded-xl bg-white/[0.05] border border-white/10 text-white font-mono text-xs focus:border-indigo-400"
                        />
                      </div>

                      {/* Live Preview of Support Buttons */}
                      <div className="p-3 rounded-xl bg-black/40 border border-white/10 space-y-2">
                        <div className="text-[10px] text-slate-400 font-mono">Önizleme Butonları:</div>
                        <div className="flex gap-2">
                          <a
                            href={`https://wa.me/${branding.whatsappNumber.replace(/[^0-9]/g, '')}?text=${encodeURIComponent(branding.whatsappMessage)}`}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-1.5 px-3 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <span>WhatsApp Destek</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>

                          <a
                            href={branding.discordUrl}
                            target="_blank"
                            rel="noreferrer"
                            className="flex-1 py-1.5 px-3 rounded-lg bg-indigo-500/20 hover:bg-indigo-500/30 text-indigo-300 border border-indigo-500/40 text-[11px] font-bold flex items-center justify-center gap-1.5 transition-colors"
                          >
                            <span>Discord Topluluk</span>
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="flex items-center justify-end pt-4 border-t border-white/[0.08]">
                    <button
                      onClick={handleSaveBranding}
                      className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg transition-all flex items-center gap-2"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>{brandingSaved ? 'Kaydedildi!' : 'Değişiklikleri Canlı Kaydet'}</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
