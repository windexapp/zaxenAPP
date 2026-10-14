# Zaxen Booster - Tam Entegre Yerel Windows Optimizasyon Uygulama Planı

Bu plan, kullanıcının satın aldığında hiçbir ek `.bat` veya harici konsol dosyası çalıştırmasına gerek kalmadan, doğrudan tek tıkla çalışan ticari bir espor optimizasyon yazılımı (Hone, Process Lasso, QuickCPU kalitesinde) elde etmesini sağlar.

---

## 1. Kullanıcı Arayüzü & Pencere Sadeleştirmesi
- **Pencere Kontrol Butonlarının Kaldırılması:**
  - `src/components/layout/TitleBar.tsx` içerisindeki sahte küçültme, büyütme ve kapatma butonları (`Minus`, `Square`, `X`) tamamen kaldırılacak.
  - Özel koyu espor başlık çubuğu tasarımı korunacak; marka logosu, HUD modu ve admin kontrol erişimi sade ve derli toplu kalacak.
- **Harici .BAT İndirme / Çalıştırma Butonlarının Temizlenmesi:**
  - Ayar Kataloğu ve diğer görünümlerdeki ".BAT İndir" gibi harici yönlendirmeler kaldırılacak; her işlem doğrudan uygulama içinde arka planda sessizce yürütülecek.

---

## 2. %100 Yerel ve Sessiz Arka Plan Yürütme Motoru (Zero-BAT İlkesi)
- **Doğrudan Windows Entegrasyonu (`systemExecutorService.ts` & `electron/main.cjs`):**
  - Müşteri uygulamayı açıp herhangi bir ayara tıkladığında, arka planda hiçbir CMD veya PowerShell siyah penceresi açılmadan, komut doğrudan Windows Kayıt Defteri'ne (Registry), Güç Yöneticisi'ne (`powercfg`) ve Sistem Hizmetleri'ne (`services.msc`) yazılacak.
  - **Sessiz Yeşil Onay Rozeti:** Ayar açıldığında ekranda dikkat dağıtıcı uyarı kutuları yerine, ayar kartında anında parlak espor yeşili **"● PC'de Aktif"** onay rozeti yanacak.
- **Yönetici Hakları Sabitlemesi (`package.json`):**
  - `requestedExecutionLevel: "requireAdministrator"` ayarı ile derlenen `.exe` doğrudan tam Windows yetkisiyle açılacak; yetki hatası yaşanmayacak.

---

## 3. Gerçek Donanım Algılama ve Otomatik Senkronizasyon
- **Kullanıcının Gerçek PC Özellikleri:**
  - Uygulama açıldığı anda Windows CIM / WMI motoru çalışacak.
  - Kullanıcının kendi **İşlemcisi (Intel / AMD modeli)**, **Ekran Kartı (NVIDIA / AMD modeli ve VRAM)**, **RAM miktarı (16GB, 32GB vb.)**, **C: Disk boyutu/boş alanı**, **Anakartı** ve **BIOS sürümü** Dashboard, BIOS Rehberi ve Sürücü Merkezi'ne otomatik yazılacak.
  - Yapay veya varsayılan (RTX 4080 / i7) hiçbir sahte veri kalmayacak.

---

## 4. Tüm Ayarların ve Oyun Profillerinin Yerel Olarak Çalıştırılması
- **Ayar Kataloğu (600+):**
  - CPU Core Unparking, Ultimate Performance Güç Planı, HPET, HAGS, TCP NoDelay, Network Throttling, MarkC 1:1 Mouse, FilterKeys, Telemetri ve Win11 optimizasyonları tek tıkla arka planda işlenecek.
- **Oyun Profilleri (CS2, Valorant, FiveM vb.):**
  - Oyun için "PC Önceliğini Yaz" veya "Boost ile Başlat" denildiğinde Windows `Image File Execution Options` (IFEO) kayıt defterine doğrudan yüksek CPU önceliği ve MMCSS zamanlayıcısı yazılacak.
- **RAM Temizliği:**
  - `desktopApi.cleanRam()` ile Windows `EmptyWorkingSet` çağrılarak kullanılmayan bellek fiziksel olarak hemen serbest bırakılacak.

---

## Doğrulama ve Test
1. `npm run build` ve `tsc --noEmit` ile TypeScript kontrolü.
2. `compile_applet` ile sıfır hata derleme doğrulaması.
3. Arayüzün derli toplu, profesyonel ve ticari satışa hazır hale getirilmesi.
