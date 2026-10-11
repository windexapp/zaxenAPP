export type AnalysisStatus = 'good' | 'warning' | 'optimizable';

export interface AnalysisItem {
  id: string;
  category: 'Başlangıç' | 'Arka Plan' | 'Depolama' | 'Windows Ayarları' | 'Donanım';
  name: string;
  detail: string;
  status: AnalysisStatus;
  statusLabel: string;
  actionLabel?: string;
  fixed: boolean;
}

export const INITIAL_ANALYSIS_ITEMS: AnalysisItem[] = [
  {
    id: 'an-game-dvr',
    category: 'Windows Ayarları',
    name: 'Xbox Game DVR Arka Plan Video Kaydı',
    detail: 'Oyun esnasında sürekli arka planda GPU encoder kullanarak FPS düşürüyor.',
    status: 'optimizable',
    statusLabel: 'Optimize edilebilir',
    actionLabel: 'Kapat',
    fixed: false,
  },
  {
    id: 'an-power-plan',
    category: 'Windows Ayarları',
    name: 'Windows Güç Planı',
    detail: 'Şu anki plan: "Dengeli". İşlemci çekirdekleri oyun ortasında uyku moduna geçebilir.',
    status: 'warning',
    statusLabel: 'Dikkat',
    actionLabel: 'Ultimate Moda Al',
    fixed: false,
  },
  {
    id: 'an-game-mode',
    category: 'Windows Ayarları',
    name: 'Windows 11 Game Mode Durumu',
    detail: 'Oyun modu aktif değil veya arka plan bildirimleri kısıtlanmamış.',
    status: 'optimizable',
    statusLabel: 'Optimize edilebilir',
    actionLabel: 'Etkinleştir',
    fixed: false,
  },
  {
    id: 'an-startup-skype',
    category: 'Başlangıç',
    name: 'Skype & Teams Otomatik Başlatma',
    detail: 'Açılışta otomatik çalışıyor ve boşta 380 MB bellek işgal ediyor.',
    status: 'optimizable',
    statusLabel: 'Optimize edilebilir',
    actionLabel: 'Devre dışı bırak',
    fixed: false,
  },
  {
    id: 'an-startup-spotify',
    category: 'Başlangıç',
    name: 'Spotify Web Helper & Discord Startup',
    detail: 'Bilgisayar açılışında arka planda başlatılıyor.',
    status: 'warning',
    statusLabel: 'Dikkat',
    actionLabel: 'Devre dışı bırak',
    fixed: false,
  },
  {
    id: 'an-temp-files',
    category: 'Depolama',
    name: 'Sistem Geçici ve Shader Dosyaları',
    detail: 'Diskte 18.4 GB temizlenebilir geçici dosya ve eski önbellek birikmiş.',
    status: 'optimizable',
    statusLabel: 'Optimize edilebilir',
    actionLabel: 'Temizle',
    fixed: false,
  },
  {
    id: 'an-ram-usage',
    category: 'Donanım',
    name: 'Boşta RAM Tüketim Oranı',
    detail: 'Boşta bellek kullanımı normalin üzerinde. Standby list temizliği önerilir.',
    status: 'warning',
    statusLabel: 'Dikkat',
    actionLabel: 'RAM Boşalt',
    fixed: false,
  },
  {
    id: 'an-cpu-core',
    category: 'Donanım',
    name: 'CPU Çekirdek Park Etme (Core Parking)',
    detail: 'Tüm CPU çekirdekleri aktif tutuluyor ve performans profiline hazır.',
    status: 'good',
    statusLabel: 'İyi',
    fixed: true,
  },
  {
    id: 'an-disk-health',
    category: 'Depolama',
    name: 'NVMe SSD TRIM & Dosya Bütünlüğü',
    detail: 'C: sürücüsü sağlıklı çalışıyor, TRIM protokolü etkin.',
    status: 'good',
    statusLabel: 'İyi',
    fixed: true,
  },
  {
    id: 'an-antivirus',
    category: 'Windows Ayarları',
    name: 'Windows Güvenlik ve Defender Koruması',
    detail: 'Gerçek zamanlı koruma devrede, sistem güvenliği tam.',
    status: 'good',
    statusLabel: 'İyi (Dokunulmadı)',
    fixed: true,
  },
];
