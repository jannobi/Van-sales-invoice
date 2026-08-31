const { ipcMain, dialog, shell } = require('electron');
const QRCode = require('qrcode');
const fs = require('fs');
const path = require('path');

function setupIpcHandlers(mainWindow) {
  // Generate QR Code
  ipcMain.handle('generate-qr', async (event, data) => {
    try {
      const qrData = JSON.stringify({
        companyId: data.companyId,
        userId: data.userId,
        token: data.token,
        timestamp: Date.now()
      });
      const qrCode = await QRCode.toDataURL(qrData);
      return qrCode;
    } catch (error) {
      console.error('QR Generation Error:', error);
      return null;
    }
  });

  // Save file dialog
  ipcMain.handle('save-file', async (event, { content, filename, type }) => {
    const { filePath } = await dialog.showSaveDialog({
      defaultPath: filename,
      filters: [
        { name: 'PDF', extensions: ['pdf'] },
        { name: 'All Files', extensions: ['*'] }
      ]
    });

    if (filePath) {
      fs.writeFileSync(filePath, content);
      return filePath;
    }
    return null;
  });

  // Open external link
  ipcMain.handle('open-external', async (event, url) => {
    await shell.openExternal(url);
  });

  // Print
  ipcMain.handle('print', async () => {
    mainWindow.webContents.print();
  });

  // Get app version
  ipcMain.handle('get-version', () => {
    return require('../package.json').version;
  });

  // Minimize window
  ipcMain.handle('minimize-window', () => {
    mainWindow.minimize();
  });

  // Maximize window
  ipcMain.handle('maximize-window', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.unmaximize();
    } else {
      mainWindow.maximize();
    }
  });

  // Close window
  ipcMain.handle('close-window', () => {
    mainWindow.close();
  });
}

module.exports = { setupIpcHandlers };
