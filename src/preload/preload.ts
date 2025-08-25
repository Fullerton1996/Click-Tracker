import { contextBridge, ipcRenderer } from 'electron';

export interface ElectronAPI {
  // Click tracking
  startClickTracking: () => Promise<boolean>;
  stopClickTracking: () => Promise<boolean>;
  onSystemClick: (callback: (clickData: any) => void) => () => void;
  
  // App utilities
  getAppVersion: () => Promise<string>;
  minimizeToTray: () => Promise<boolean>;
  showWindow: () => Promise<boolean>;
  
  // Platform info
  platform: string;
  isElectron: boolean;
}

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
const electronAPI: ElectronAPI = {
  startClickTracking: () => ipcRenderer.invoke('start-click-tracking'),
  stopClickTracking: () => ipcRenderer.invoke('stop-click-tracking'),
  onSystemClick: (callback: (clickData: any) => void) => {
    const subscription = (_event: any, clickData: any) => callback(clickData);
    ipcRenderer.on('system-click', subscription);
    
    // Return unsubscribe function
    return () => {
      ipcRenderer.removeListener('system-click', subscription);
    };
  },
  
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  minimizeToTray: () => ipcRenderer.invoke('minimize-to-tray'),
  showWindow: () => ipcRenderer.invoke('show-window'),
  
  platform: process.platform,
  isElectron: true,
};

contextBridge.exposeInMainWorld('electronAPI', electronAPI);