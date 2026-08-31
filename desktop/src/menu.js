const { Menu, shell } = require('electron');

const isMac = process.platform === 'darwin';

const template = [
  ...(isMac ? [{
    label: 'Van Sales Invoice',
    submenu: [
      { role: 'about' },
      { type: 'separator' },
      { role: 'services' },
      { type: 'separator' },
      { role: 'hide' },
      { role: 'hideothers' },
      { role: 'unhide' },
      { type: 'separator' },
      { role: 'quit' }
    ]
  }] : []),
  {
    label: 'File',
    submenu: [
      {
        label: 'New Invoice',
        accelerator: 'CmdOrCtrl+N',
        click: () => {
          // Trigger new invoice
          mainWindow.webContents.send('menu-action', { action: 'new-invoice' });
        }
      },
      {
        label: 'New Party',
        accelerator: 'CmdOrCtrl+P',
        click: () => {
          mainWindow.webContents.send('menu-action', { action: 'new-party' });
        }
      },
      { type: 'separator' },
      {
        label: 'Print',
        accelerator: 'CmdOrCtrl+P',
        click: () => {
          mainWindow.webContents.print();
        }
      },
      { type: 'separator' },
      isMac ? { role: 'close' } : { role: 'quit' }
    ]
  },
  {
    label: 'Edit',
    submenu: [
      { role: 'undo' },
      { role: 'redo' },
      { type: 'separator' },
      { role: 'cut' },
      { role: 'copy' },
      { role: 'paste' },
      ...(isMac ? [
        { role: 'pasteAndMatchStyle' },
        { role: 'delete' },
        { role: 'selectAll' },
        { type: 'separator' },
        {
          label: 'Speech',
          submenu: [
            { role: 'startSpeaking' },
            { role: 'stopSpeaking' }
          ]
        }
      ] : [
        { role: 'delete' },
        { type: 'separator' },
        { role: 'selectAll' }
      ])
    ]
  },
  {
    label: 'View',
    submenu: [
      { role: 'reload' },
      { role: 'forceReload' },
      { role: 'toggleDevTools' },
      { type: 'separator' },
      { role: 'resetZoom' },
      { role: 'zoomIn' },
      { role: 'zoomOut' },
      { type: 'separator' },
      { role: 'togglefullscreen' }
    ]
  },
  {
    label: 'Window',
    submenu: [
      { role: 'minimize' },
      { role: 'zoom' },
      ...(isMac ? [
        { type: 'separator' },
        { role: 'front' },
        { type: 'separator' },
        { role: 'window' }
      ] : [
        { role: 'close' }
      ])
    ]
  },
  {
    label: 'Help',
    submenu: [
      {
        label: 'Documentation',
        click: async () => {
          await shell.openExternal('https://github.com/jannobi/Van-sales-invoice');
        }
      },
      {
        label: 'Report Issue',
        click: async () => {
          await shell.openExternal('https://github.com/jannobi/Van-sales-invoice/issues');
        }
      }
    ]
  }
];

module.exports = template;
