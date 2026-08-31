const { app, BrowserWindow, ipcMain, Tray, Menu, shell } = require('electron');
const path = require('path');
const { autoUpdater } = require('electron-updater');
const QRCode = require('qrcode');
const fs = require('fs');
const cron = require('node-cron');

let mainWindow;
let tray;

// Create the browser window
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    },
    icon: path.join(__dirname, 'assets/icon.png'),
    frame: true,
    titleBarStyle: 'default'
  });

  // Load the app
  if (process.env.NODE_ENV === 'development') {
    mainWindow.loadURL('http://localhost:3000');
    mainWindow.webContents.openDevTools();
  } else {
    mainWindow.loadFile(path.join(__dirname, '../frontend/dist/index.html'));
  }

  // Create tray
  createTray();

  // Handle window close
  mainWindow.on('close', (event) => {
    if (!app.isQuitting) {
      event.preventDefault();
      mainWindow.hide();
    }
    return false;
  });

  // Auto updater
  autoUpdater.checkForUpdatesAndNotify();
}

// Create system tray
function createTray() {
  tray = new Tray(path.join(__dirname, 'assets/tray-icon.png'));
  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Show App',
      click: () => {
        mainWindow.show();
      }
    },
    {
      label: 'Quit',
      click: () => {
        app.isQuitting = true;
        app.quit();
      }
    }
  ]);
  tray.setToolTip('Van Sales Invoice');
  tray.setContextMenu(contextMenu);
  tray.on('click', () => {
    mainWindow.isVisible() ? mainWindow.hide() : mainWindow.show();
  });
}

// QR Code Login Generator
ipcMain.handle('generate-qr', async (event, data) => {
  try {
    const qrData = JSON.stringify({
      companyId: data.companyId,
      userId: data.userId,
      timestamp: Date.now(),
      token: data.token
    });
    const qrCode = await QRCode.toDataURL(qrData);
    return qrCode;
  } catch (error) {
    console.error('QR Generation Error:', error);
    return null;
  }
});

// QR Scan Login
ipcMain.handle('scan-qr', async (event, qrData) => {
  try {
    const parsed = JSON.parse(qrData);
    // Validate QR data
    if (parsed.timestamp && Date.now() - parsed.timestamp < 60000) {
      return {
        success: true,
        user: parsed
      };
    }
    return {
      success: false,
      message: 'QR code expired'
    };
  } catch (error) {
    return {
      success: false,
      message: 'Invalid QR code'
    };
  }
});

// Database sync cron job (Monthly reset)
cron.schedule('0 0 1 * *', () => {
  // Reset monthly sales
  mainWindow.webContents.send('monthly-reset', {
    message: 'Monthly sales reset completed'
  });
});

// Auto updater events
autoUpdater.on('update-available', () => {
  mainWindow.webContents.send('update-available');
});

autoUpdater.on('update-downloaded', () => {
  mainWindow.webContents.send('update-downloaded');
});

ipcMain.handle('restart-app', () => {
  autoUpdater.quitAndInstall();
});

// App ready
app.whenReady().then(() => {
  createWindow();
});

// Quit when all windows are closed
app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});
