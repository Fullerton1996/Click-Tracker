const { app, BrowserWindow, ipcMain } = require('electron');
const path = require('path');
const isDev = require('electron-is-dev');

let mainWindow;
let clickCount = 0;

// Global click tracking setup based on OS
const setupGlobalClickTracking = () => {
  if (process.platform === 'win32') {
    // Windows implementation
    const { trackWindowsClicks } = require('./native/windows-clicks');
    trackWindowsClicks(() => {
      clickCount++;
      mainWindow?.webContents.send('click-detected', clickCount);
    });
  } else if (process.platform === 'darwin') {
    // macOS implementation
    const { trackMacOSClicks } = require('./native/macos-clicks');
    trackMacOSClicks(() => {
      clickCount++;
      mainWindow?.webContents.send('click-detected', clickCount);
    });
  } else {
    // Linux implementation
    const { trackLinuxClicks } = require('./native/linux-clicks');
    trackLinuxClicks(() => {
      clickCount++;
      mainWindow?.webContents.send('click-detected', clickCount);
    });
  }
};

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 900,
    height: 680,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  mainWindow.loadURL(
    isDev
      ? 'http://localhost:3000'
      : `file://${path.join(__dirname, '../build/index.html')}`
  );

  mainWindow.on('closed', () => {
    mainWindow = null;
  });

  setupGlobalClickTracking();
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC handlers
ipcMain.handle('get-click-count', () => clickCount);
ipcMain.handle('reset-click-count', () => {
  clickCount = 0;
  return clickCount;
});
