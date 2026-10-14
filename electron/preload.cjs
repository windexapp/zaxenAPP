// ZAXEN BOOSTER - Preload Bridge (Güvenli IPC Köprüsü)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('desktopApi', {
  isDesktop: true,
  platform: process.platform,
  getHwid: () => ipcRenderer.invoke('desktop:get-hwid'),
  getSystemSpecs: () => ipcRenderer.invoke('desktop:get-system-specs'),
  checkAdmin: () => ipcRenderer.invoke('desktop:check-admin'),
  executeCommand: (cmd) => ipcRenderer.invoke('desktop:exec-command', cmd),
  cleanRam: () => ipcRenderer.invoke('desktop:clean-ram'),
  writeRegistry: (options) => ipcRenderer.invoke('desktop:write-registry', options),
});
