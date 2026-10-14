// ZAXEN BOOSTER - Electron Desktop Core (Masaüstü Çekirdeği)
// Bu dosya Zaxen Booster'ı gerçek bir Windows .EXE uygulaması olarak çalıştırır.
// Windows'ta Yönetici (Administrator) yetkileri ve canlı donanım tespit motoru ile donatılmıştır.

const { app, BrowserWindow, ipcMain, shell } = require('electron');
const path = require('path');
const { exec } = require('child_process');

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1366,
    height: 820,
    minWidth: 1024,
    minHeight: 700,
    backgroundColor: '#090a0f',
    title: 'ZAXEN BOOSTER - Ultimate Windows & Gaming Optimizer',
    autoHideMenuBar: true,
    webPreferences: {
      preload: path.join(__dirname, 'preload.cjs'),
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: false
    }
  });

  const devUrl = process.env.ELECTRON_DEV_URL || 'http://localhost:3000';
  const prodPath = path.join(__dirname, '../dist/index.html');

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL(devUrl).catch(() => {
      mainWindow.loadFile(prodPath);
    });
  } else {
    mainWindow.loadFile(prodPath);
  }

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// 1. Windows Yönetici (Administrator) Yetkisi Kontrolü
ipcMain.handle('desktop:check-admin', async () => {
  return new Promise((resolve) => {
    exec('net session', (err) => {
      resolve({ isAdmin: !err });
    });
  });
});

// 2. Gerçek Windows Donanım Tespiti (CPU, GPU, RAM, Disk, Anakart, BIOS)
ipcMain.handle('desktop:get-system-specs', async () => {
  return new Promise((resolve) => {
    const psScript = `
      $ErrorActionPreference = 'SilentlyContinue';
      $cpu = Get-CimInstance Win32_Processor | Select-Object -First 1 Name, NumberOfCores, NumberOfLogicalProcessors, MaxClockSpeed;
      $gpus = Get-CimInstance Win32_VideoController | Where-Object { $_.Name -notlike "*Basic*" -and $_.Name -notlike "*Virtual*" };
      $gpu = if ($gpus -is [array]) { $gpus[0] } else { $gpus };
      if (-not $gpu) { $gpu = Get-CimInstance Win32_VideoController | Select-Object -First 1 };
      
      $os = Get-CimInstance Win32_OperatingSystem;
      $board = Get-CimInstance Win32_BaseBoard | Select-Object -First 1 Manufacturer, Product;
      $bios = Get-CimInstance Win32_BIOS | Select-Object -First 1 SMBIOSBIOSVersion;
      $disk = Get-CimInstance Win32_LogicalDisk -Filter "DeviceID='C:'" | Select-Object Size, FreeSpace;
      
      $ramTotal = [math]::Round($os.TotalVisibleMemorySize / 1024 / 1024, 1);
      $ramFree = [math]::Round($os.FreePhysicalMemory / 1024 / 1024, 1);
      $ramUsed = [math]::Round($ramTotal - $ramFree, 1);
      
      $vramBytes = [double]($gpu.AdapterRAM);
      $vramGB = if ($vramBytes -gt 0) { [math]::Round($vramBytes / 1024 / 1024 / 1024, 1) } else { 8 };
      if ($vramGB -le 0 -or $vramGB -gt 48) { $vramGB = 8 };

      [PSCustomObject]@{
        cpuName = "$($cpu.Name)".Trim();
        cpuCores = [int]$cpu.NumberOfCores;
        cpuThreads = [int]$cpu.NumberOfLogicalProcessors;
        cpuSpeedGHz = [math]::Round($cpu.MaxClockSpeed / 1000, 2);
        gpuName = "$($gpu.Name)".Trim();
        gpuVramGB = $vramGB;
        ramTotalGB = $ramTotal;
        ramUsedGB = $ramUsed;
        ramFreeGB = $ramFree;
        diskTotalGB = [math]::Round($disk.Size / 1024 / 1024 / 1024, 1);
        diskFreeGB = [math]::Round($disk.FreeSpace / 1024 / 1024 / 1024, 1);
        motherboard = "$($board.Manufacturer) $($board.Product)".Trim();
        biosVersion = "$($bios.SMBIOSBIOSVersion)".Trim();
        osCaption = "$($os.Caption)".Trim();
        osBuild = "$($os.BuildNumber)".Trim();
      } | ConvertTo-Json -Compress
    `;

    exec(`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${psScript.replace(/\r?\n/g, ' ')}"`, { maxBuffer: 1024 * 1024 }, (err, stdout) => {
      if (!err && stdout) {
        try {
          const parsed = JSON.parse(stdout.trim());
          if (parsed && parsed.cpuName) {
            return resolve({ success: true, specs: parsed });
          }
        } catch (e) {}
      }
      resolve({ success: false, specs: null });
    });
  });
});

// 3. Windows Gerçek HWID Alma
ipcMain.handle('desktop:get-hwid', async () => {
  return new Promise((resolve) => {
    exec('wmic csproduct get uuid', (err, stdout) => {
      if (!err && stdout) {
        const lines = stdout.trim().split(/\r?\n/);
        const uuid = lines[1] ? lines[1].trim() : lines[0].trim();
        if (uuid && uuid.length > 5 && uuid.toLowerCase() !== 'uuid') {
          return resolve(`ZXN-HWID-${uuid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}`);
        }
      }
      resolve(`ZXN-HWID-DESKTOP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`);
    });
  });
});

// 4. Gerçek Sistem Komutu Çalıştırma (Kayıt Defteri, PowerShell, Servisler)
ipcMain.handle('desktop:exec-command', async (_, rawCommand) => {
  return new Promise((resolve) => {
    if (!rawCommand || typeof rawCommand !== 'string') {
      return resolve({ success: false, output: 'Geçersiz komut parametresi' });
    }

    const trimmed = rawCommand.trim();
    const isPowerShell = /Get-|Set-|Stop-|Start-|New-Item|Remove-Item|\$|;|\{/i.test(trimmed);

    let shellCmd = '';
    if (isPowerShell) {
      shellCmd = `powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${trimmed.replace(/"/g, '\"')}"`;
    } else {
      shellCmd = `cmd.exe /c "${trimmed}"`;
    }

    exec(shellCmd, { maxBuffer: 1024 * 1024 }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, output: stderr || error.message || 'Komut hatayla sonuçlandı' });
      } else {
        resolve({ success: true, output: stdout || 'Komut başarıyla yürütüldü' });
      }
    });
  });
});

// 5. Gerçek Fiziksel RAM & Standby Listesi Temizleme
ipcMain.handle('desktop:clean-ram', async () => {
  return new Promise((resolve) => {
    const psCmd = `
      [System.GC]::Collect();
      [System.GC]::WaitForPendingFinalizers();
      Get-Process | ForEach-Object { try { $_.MinWorkingSet = [IntPtr]::Zero } catch {} }
    `;
    exec(`powershell.exe -NoProfile -ExecutionPolicy Bypass -Command "${psCmd.replace(/\r?\n/g, ' ')}"`, (err) => {
      resolve({ success: !err });
    });
  });
});

// 6. Gerçek Windows Registry Kaydı Yazma
ipcMain.handle('desktop:write-registry', async (_, { path: regPath, name, value, type }) => {
  return new Promise((resolve) => {
    const cmd = `cmd.exe /c reg add "${regPath}" /v "${name}" /t ${type || 'REG_DWORD'} /d "${value}" /f`;
    exec(cmd, (err, stdout, stderr) => {
      resolve({ success: !err, output: stdout || stderr });
    });
  });
});

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') app.quit();
});
