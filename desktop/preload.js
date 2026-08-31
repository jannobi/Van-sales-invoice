const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Generate QR Code
  generateQR: (data) => ipcRenderer.invoke('generate-qr', data),
  
  // Scan QR Code
  scanQR: (qrData) => ipcRenderer.invoke('scan-qr', qrData),
  
  // Restart app for update
  restartApp: () => ipcRenderer.invoke('restart-app'),
  
  // Listen for updates
  onUpdateAvailable: (callback) => {
    ipcRenderer.on('update-available', callback);
  },
  onUpdateDownloaded: (callback) => {
    ipcRenderer.on('update-downloaded', callback);
  },
  onMonthlyReset: (callback) => {
    ipcRenderer.on('monthly-reset', callback);
  }
});
