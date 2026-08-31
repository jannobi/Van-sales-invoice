const {app, BrowserWindow, Menu, shell} = require('electron');
const path = require('path');

let mainWindow;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    minWidth: 1024,
    minHeight: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false
    },
    icon: path.join(__dirname, '../assets/icon.png'),
    show: false,
    backgroundColor: '#ffffff'
  });

  mainWindow.loadURL('https://your-web-app-url.com');

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.maximize();
  });

  const template = [
    {
      label: 'File',
      submenu: [
        {label: 'New Invoice', accelerator: 'CmdOrCtrl+N'},
        {label: 'New Party', accelerator: 'CmdOrCtrl+P'},
        {type: 'separator'},
        {label: 'Print', accelerator: 'CmdOrCtrl+Shift+P'},
        {type: 'separator'},
        {role: 'quit', label: 'Exit'}
      ]
    },
    {
      label: 'View',
      submenu: [
        {role: 'reload', label: 'Refresh'},
        {role: 'forceReload', label: 'Hard Refresh'},
        {role: 'toggleDevTools'},
        {type: 'separator'},
        {role: 'resetZoom'},
        {role: 'zoomIn'},
        {role: 'zoomOut'}
      ]
    },
    {
      label: 'Reports',
      submenu: [
        {label: 'Sales Report'},
        {label: 'Collection Report'},
        {label: 'Stock Report'},
        {label: 'Expense Report'}
      ]
    },
    {
      label: 'Settings',
      submenu: [
        {label: 'Company Settings'},
        {label: 'Print Settings'},
        {label: 'Language & Currency'}
      ]
    },
    {
      label: 'Help',
      submenu: [
        {label: 'About'},
        {type: 'separator'},
        {label: 'Check for Updates'}
      ]
    }
  ];

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);
}

app.whenReady().then(createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
