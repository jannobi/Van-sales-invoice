const { autoUpdater } = require('electron-updater');
const { dialog } = require('electron');

function setupAutoUpdater(mainWindow) {
  autoUpdater.on('checking-for-update', () => {
    console.log('Checking for updates...');
  });

  autoUpdater.on('update-available', (info) => {
    console.log('Update available:', info);
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Available',
      message: 'A new version is available. Downloading now...',
      buttons: ['OK']
    });
  });

  autoUpdater.on('update-not-available', () => {
    console.log('No updates available');
  });

  autoUpdater.on('error', (err) => {
    console.error('Update error:', err);
  });

  autoUpdater.on('update-downloaded', (info) => {
    console.log('Update downloaded:', info);
    dialog.showMessageBox({
      type: 'info',
      title: 'Update Ready',
      message: 'Update downloaded. Restart now to install?',
      buttons: ['Restart Now', 'Later']
    }).then((result) => {
      if (result.response === 0) {
        autoUpdater.quitAndInstall();
      }
    });
  });

  // Check for updates
  autoUpdater.checkForUpdatesAndNotify();

  // Check every hour
  setInterval(() => {
    autoUpdater.checkForUpdatesAndNotify();
  }, 3600000);
}

module.exports = { setupAutoUpdater };
