const { globalShortcut } = require('electron');

function registerShortcuts(mainWindow) {
  // Ctrl+Shift+I - Open Dev Tools
  globalShortcut.register('CommandOrControl+Shift+I', () => {
    mainWindow.webContents.toggleDevTools();
  });

  // Ctrl+Shift+R - Reload
  globalShortcut.register('CommandOrControl+Shift+R', () => {
    mainWindow.reload();
  });

  // Ctrl+N - New Invoice
  globalShortcut.register('CommandOrControl+N', () => {
    mainWindow.webContents.send('menu-action', { action: 'new-invoice' });
  });

  // Ctrl+P - Print
  globalShortcut.register('CommandOrControl+P', () => {
    mainWindow.webContents.print();
  });

  // Ctrl+F - Fullscreen
  globalShortcut.register('F11', () => {
    mainWindow.setFullScreen(!mainWindow.isFullScreen());
  });
}

function unregisterShortcuts() {
  globalShortcut.unregisterAll();
}

module.exports = { registerShortcuts, unregisterShortcuts };
