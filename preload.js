// Preload script
const { contextBridge } = require('electron');

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld(
  'electron', 
  {
    // Add any required IPC methods here if needed
    // Example: send: (channel, data) => ipcRenderer.send(channel, data)
  }
);
