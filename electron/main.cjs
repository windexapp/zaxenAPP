// ZAXEN BOOSTER - Electron Desktop Core
// Bu dosya Zaxen Booster'ı gerçek bir Windows .EXE uygulaması olarak çalıştırır.
// Windows'ta Yönetici (Administrator) yetkileriyle donatılmıştır.

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

  // Geliştirme modu veya derlenmiş üretim dist/index.html kontrolü
  const devUrl = process.env.ELECTRON_DEV_URL || 'http://localhost:3000';
  const prodPath = path.join(__dirname, '../dist/index.html');

  if (process.env.NODE_ENV === 'development' || !app.isPackaged) {
    mainWindow.loadURL(devUrl).catch(() => {
      mainWindow.loadFile(prodPath);
    });
  } else {
    mainWindow.loadFile(prodPath);
  }

  // Dış bağlantıları varsayılan tarayıcıda aç
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });
}

// Windows'ta gerçek Donanım HWID (Motherboard Serial + CPU ID) alma
ipcMain.handle('desktop:get-hwid', async () => {
  return new Promise((resolve) => {
    exec('wmic csproduct get uuid', (err, stdout) => {
      if (!err && stdout) {
        const lines = stdout.trim().split('\r\n');
        const uuid = lines[1] ? lines[1].trim() : lines[0].trim();
        if (uuid && uuid.length > 5) {
          return resolve(`ZXN-HWID-${uuid.replace(/[^a-zA-Z0-9]/g, '').slice(0, 8).toUpperCase()}`);
        }
      }
      // Yedek HWID
      resolve(`ZXN-HWID-DESKTOP-${Math.random().toString(36).slice(2, 10).toUpperCase()}`);
    });
  });
});

// Gerçek Sistem Komutu Çalıştırma (PowerShell / CMD)
ipcMain.handle('desktop:exec-command', async (_, command) => {
  return new Promise((resolve) => {
    exec(command, { shell: 'powershell.exe' }, (error, stdout, stderr) => {
      if (error) {
        resolve({ success: false, output: stderr || error.message });
      } else {
        resolve({ success: true, output: stdout });
      }
    });
  });
});

// Gerçek RAM Temizleme
ipcMain.handle('desktop:clean-ram', async () => {
  return new Promise((resolve) => {
    const psCmd = `
      [System.GC]::Collect();
      [System.GC]::WaitForPendingFinalizers();
      Get-Process | ForEach-Object { try { $_.MinWorkingSet = [IntPtr]::Zero } catch {} }
    `;
    exec(`powershell -NoProfile -Command "${psCmd.replace(/\n/g, ' ')}"`, (err) => {
      resolve({ success: !err });
    });
  });
});

// Gerçek Windows Registry Ayarı Yazma
ipcMain.handle('desktop:write-registry', async (_, { path: regPath, name, value, type }) => {
  return new Promise((resolve) => {
    const cmd = `reg add "${regPath}" /v "${name}" /t ${type || 'REG_DWORD'} /d "${value}" /f`;
    exec(cmd, (err) => {
      resolve({ success: !err });
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
