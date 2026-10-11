export interface CleanableCategory {
  id: string;
  name: string;
  pathDesc: string;
  sizeMB: number;
  selected: boolean;
  isSafe: boolean;
  description: string;
}

export const INITIAL_DISK_CATEGORIES: CleanableCategory[] = [
  {
    id: 'user-temp',
    name: 'Kullanıcı Geçici Dosyaları (%TEMP%)',
    pathDesc: 'C:\\Users\\...\\AppData\\Local\\Temp',
    sizeMB: 7420,
    selected: true,
    isSafe: true,
    description: 'Kapanan programların geride bıraktığı silinmeye uygun geçici veriler.',
  },
  {
    id: 'win-temp',
    name: 'Windows Sistem Temp & Log Dosyaları',
    pathDesc: 'C:\\Windows\\Temp ve Sistem Logları',
    sizeMB: 3180,
    selected: true,
    isSafe: true,
    description: 'Eski kurulum kayıtları ve Windows geçici çalışma dosyaları.',
  },
  {
    id: 'shader-cache',
    name: 'DirectX & GPU Shader Önbelleği',
    pathDesc: 'D3DSCache & NV_Cache / AMD',
    sizeMB: 2850,
    selected: true,
    isSafe: true,
    description: 'Eski oyunlardan kalan veya bozulmuş grafik gölgelendirici önbellekleri.',
  },
  {
    id: 'thumb-cache',
    name: 'Windows Küçük Resim (Thumbnail) Önbelleği',
    pathDesc: 'Explorer thumbcache_*.db',
    sizeMB: 1940,
    selected: true,
    isSafe: true,
    description: 'Dosya gezgini önizleme resimleri. Silindiğinde gerektiğinde tekrar üretilir.',
  },
  {
    id: 'delivery-opt',
    name: 'Windows Teslim İyileştirme Dosyaları',
    pathDesc: 'Delivery Optimization Cache',
    sizeMB: 2240,
    selected: true,
    isSafe: true,
    description: 'Güncellemeler için yerel ağda paylaşılan indirme önbelleği.',
  },
  {
    id: 'crash-dumps',
    name: 'Eski Bellek Döküm Dosyaları (Crash Dumps)',
    pathDesc: 'C:\\Windows\\Minidump & MEMORY.DMP',
    sizeMB: 840,
    selected: true,
    isSafe: true,
    description: 'Eski sistem çökme analiz dökümleri.',
  },
];
