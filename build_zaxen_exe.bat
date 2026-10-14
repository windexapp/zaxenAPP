@echo off
chcp 65001 >nul
title ZAXEN BOOSTER - TEK TIKLA .EXE DERLEYİCİ
color 0b
cls

:: Calisma dizinini .bat dosyasinin bulundugu klasore sabitle (Yonetici calistirmalari icin sarttir)
cd /d "%~dp0"

echo ================================================================
echo           ⚡ ZAXEN BOOSTER - WINDOWS .EXE URETICISI ⚡
echo ================================================================
echo.
echo Bu sihirbaz Zaxen Booster'i tek tikla bagimsiz bir
echo Windows masaustu .EXE (ZaxenBooster.exe) uygulamasina donusturur.
echo.
echo [1/4] Calisma dizini ve Node.js kontrol ediliyor...
echo [*] Konum: %cd%

if not exist "package.json" (
    color 0c
    echo.
    echo [HATA] package.json dosyasi bulunamadi!
    echo Lutfen bu .bat dosyasini Zaxen Booster proje klasorunun icinde calistirin.
    echo.
    pause
    exit /b 1
)

where node >nul 2>nul
if %errorlevel% neq 0 (
    color 0c
    echo.
    echo [HATA] Bilgisayarinizda Node.js kurulu degil!
    echo Lutfen https://nodejs.org adresinden Node.js (LTS surumunu) indirip kurun.
    echo Kurulum bittikten sonra bu dosyayi tekrar calistirin.
    echo.
    pause
    exit /b 1
)

echo [✓] Node.js tespit edildi!
echo.
echo [2/4] Proje bagimliliklari kuruluyor (npm install)...
call npm install --no-audit --no-fund
if %errorlevel% neq 0 (
    color 0e
    echo [UYARI] npm install bazi uyarilar verdi, derleme devam ediyor...
)

echo.
echo [3/4] Frontend arayuzu optimize edilip derleniyor (npm run build)...
call npm run build
if %errorlevel% neq 0 (
    color 0c
    echo.
    echo [HATA] Vite build basarisiz oldu! Kodlarda syntax hatasi olabilir.
    echo.
    pause
    exit /b 1
)

echo [✓] Web paketi basariyla derlendi (dist klasoru olusturuldu).
echo.
echo [4/4] Windows .EXE olusturuluyor (Electron Portable)...
echo Lutfen bekleyin, bu islem ilk calistirmada 1-2 dakika surebilir...
call npx --yes electron-builder --win portable

echo.
echo ================================================================
if exist "release\*.exe" (
    color 0a
    echo  [BASARILI] ZAXEN BOOSTER .EXE BASARIYLA OLUSTURULDU!
    echo.
    echo  Dosyaniz "release" klasorunun icine kaydedildi.
    echo  Musterilerinize dogrudan bu .exe dosyasini gonderebilirsiniz!
    echo ================================================================
    explorer release
) else (
    echo [BILGI] Derleme tamamlandi. Lutfen "release" klasorunu kontrol edin.
)
echo.
pause
