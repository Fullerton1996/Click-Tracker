import { useState, useEffect, useCallback } from 'react';

export interface ClickData {
  timestamp: number;
  x: number;
  y: number;
  button: 'left' | 'right' | 'middle';
}

export const useElectronClickTracking = () => {
  const [isTracking, setIsTracking] = useState(false);
  const [isElectron, setIsElectron] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    // Check if we're running in Electron
    setIsElectron(!!window.electronAPI);
  }, []);

  const startTracking = useCallback(async () => {
    if (!window.electronAPI) {
      console.warn('Electron API not available');
      return false;
    }

    try {
      const result = await window.electronAPI.startClickTracking();
      setIsTracking(result);
      return result;
    } catch (error) {
      console.error('Failed to start click tracking:', error);
      return false;
    }
  }, []);

  const stopTracking = useCallback(async () => {
    if (!window.electronAPI) {
      console.warn('Electron API not available');
      return false;
    }

    try {
      const result = await window.electronAPI.stopClickTracking();
      setIsTracking(!result);
      return result;
    } catch (error) {
      console.error('Failed to stop click tracking:', error);
      return false;
    }
  }, []);

  const onSystemClick = useCallback((callback: (clickData: ClickData) => void) => {
    if (!window.electronAPI) {
      console.warn('Electron API not available');
      return () => {};
    }

    return window.electronAPI.onSystemClick(callback);
  }, []);

  const incrementClickCount = useCallback(() => {
    setClickCount(prev => prev + 1);
  }, []);

  const resetClickCount = useCallback(() => {
    setClickCount(0);
  }, []);

  return {
    isElectron,
    isTracking,
    clickCount,
    startTracking,
    stopTracking,
    onSystemClick,
    incrementClickCount,
    resetClickCount,
  };
};