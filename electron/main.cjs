const { app, BrowserWindow, shell } = require('electron');
const path = require('path');

function createWindow() {
  const win = new BrowserWindow({
    width: 1100,
    height: 820,
    minWidth: 750,
    minHeight: 550,
    backgroundColor: '#0a0812',
    autoHideMenuBar: true,
    title: 'Stremio Addon Manager',
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      sandbox: true,
    },
  });

  if (app.isPackaged || process.env.NODE_ENV === 'production') {
    win.loadFile(path.join(__dirname, '../dist/index.html'));
  } else {
    win.loadURL(process.env.VITE_DEV_SERVER_URL || 'http://localhost:5173');
  }

  // Intercept new window requests to open in user's default external browser
  win.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith('http:') || url.startsWith('https:')) {
      shell.openExternal(url);
    }
    return { action: 'deny' };
  });
}

app.whenReady().then(() => {
  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});
