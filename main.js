
const { app, BrowserWindow } = require('electron');
const path = require('path');
const url = require('url');
const fs = require('fs');

// Check if we're in development or production
const isDev = !app.isPackaged;

function createWindow() {
  const win = new BrowserWindow({
    width: 1000,
    height: 700,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js')
    }
  });

  // In development, use Vite's dev server
  if (isDev) {
    win.loadURL('http://localhost:5173/');
    win.webContents.openDevTools(); // Open DevTools in development
  } else {
    // In production, load from the dist directory
    win.loadFile(path.join(__dirname, 'dist', 'index.html'));
  }
  
  win.setMenuBarVisibility(false);
}

app.whenReady().then(() => {
  createWindow();
  app.on('activate', function() {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', function() {
  if (process.platform !== 'darwin') app.quit();
});
