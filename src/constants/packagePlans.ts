import { LicenseTier, PackagePlanInfo } from '../types';

export type { PackagePlanInfo };

export const DEFAULT_PACKAGE_PLANS: PackagePlanInfo[] = [
  {
    id: 'trial',
    title: 'Deneme Paketi',
    tagline: '1 Günlük Hızlı Test (zaxen1 kodu)',
    badge: '24 SAAT',
    price: 'Ücretsiz (1 Gün)',
    highlightColor: '#3b82f6',
    features: [
      'Temel CPU ve RAM Optimizasyonları',
      'Windows Game Mode ve Standby RAM Temizliği',
      '1 Adet Özel Oyun Profili',
      'Gerçek Zamanlı Donanım Sıcaklık Takibi',
      'Otomatik Güvenli Ayar Geri Alma Yedeği'
    ],
    restrictedFeatures: [
      'Gelişmiş Ağ TCP NoDelay / Düşük Ping Modu',
      'Timer Resolution ve Ring0 Gecikme Ayarları',
      'Sınırsız Oyun Kütüphane Profilleri'
    ]
  },
  {
    id: 'starter',
    title: 'Starter Core',
    tagline: 'Günlük Oyuncular ve Standart PC Hızlandırma',
    badge: 'BAŞLANGIÇ',
    price: '99 ₺ / Ay',
    highlightColor: '#10b981',
    features: [
      'Tüm Standart CPU / GPU / RAM Optimizasyonları',
      'Geçici Dosya & Shader Önbellek Temizliği',
      '3 Adet Oyun Profili Entegrasyonu',
      'Akıllı RAM Uyarı Sistemi',
      'Geri Alma & Sistem Geri Yükleme Noktası'
    ],
    restrictedFeatures: [
      'Agresif Düşük Ping (TCP NoDelay) Motoru',
      'Ring0 Çekirdek DPC & Interrupt İyileştirmesi',
      'Espor Radar & Otomatik RAM Döngüsü'
    ]
  },
  {
    id: 'pro',
    title: 'Pro Gamer',
    tagline: 'Rekabetçi FPS Oyuncuları İçin Maksimum Akıcılık',
    badge: 'EN POPÜLER',
    price: '199 ₺ / Ay',
    highlightColor: '#e11d48',
    popular: true,
    features: [
      'Starter Kapsamındaki Tüm Özellikler',
      'Ağ TCP NoDelay & Minimum Ping Optimizasyonu',
      'DWM Pencereli Gecikme Önleme Modu',
      'Sınırsız Oyun Profili ve Otomatik Algılama',
      '0.5ms Timer Resolution & Yüksek Frekans Kilidi',
      'Arka Plan Uygulamaları Tam Askıya Alma'
    ],
    restrictedFeatures: [
      'Ring0 Kernel DPC & Derin Windows Debloater'
    ]
  },
  {
    id: 'ultimate',
    title: 'Ultimate Elite VIP',
    tagline: 'Sıfır Kısıtlama, Donanım Seviyesi DPC & Kernel Optimizasyonu',
    badge: 'SINIRSIZ VIP',
    price: '349 ₺ / Ömür Boyu',
    highlightColor: '#f59e0b',
    features: [
      'TÜM SİSTEM VE OYUN OPTİMİZASYONLARI AÇIK',
      'Ring0 Kernel DPC & Donanım Kesinti İyileştirmesi',
      'Windows Derin Telemetri & Hizmet Debloater',
      'VIP Altın & Kırmızı Arayüz / Özel Tema Erişimi',
      'Sınırsız Oyun ve FPS Karşılaştırma Arşivi',
      'Ömür Boyu Güncelleme & Öncelikli Destek'
    ],
    restrictedFeatures: []
  }
];
