import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useElectronClickTracking } from './hooks/useElectronClickTracking';
import { Settings } from './types';
import ClickTracker from './components/ClickTracker';
import SettingsModal from './components/SettingsModal';
import BreakOverlay from './components/BreakOverlay';
import SettingsIcon from './components/icons/SettingsIcon';

const App: React.FC = () => {
  const [settings, setSettings] = useLocalStorage<Settings>('clicker-settings', {
    name: 'Friend',
    clickGoal: 1000,
  });
  const [clicks, setClicks] = useState<number>(0);
  const [isBreakActive, setIsBreakActive] = useState<boolean>(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState<boolean>(false);

  const {
    isElectron,
    isTracking,
    startTracking,
    stopTracking,
    onSystemClick,
  } = useElectronClickTracking();

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
  };
  
  const handleAppClick = useCallback(() => {
    if (!isBreakActive && !isElectron) {
      // Only handle clicks manually if not in Electron (web version)
      setClicks(prev => prev + 1);
    }
  }, [isBreakActive, isElectron]);

  // Set up system-wide click tracking in Electron
  useEffect(() => {
    if (!isElectron) return;

    const unsubscribe = onSystemClick((clickData) => {
      if (!isBreakActive) {
        setClicks(prev => prev + 1);
      }
    });

    // Start tracking when component mounts
    startTracking();

    return () => {
      unsubscribe();
      stopTracking();
    };
  }, [isElectron, isBreakActive, onSystemClick, startTracking, stopTracking]);

  useEffect(() => {
    if (clicks >= settings.clickGoal) {
      setIsBreakActive(true);
    }
  }, [clicks, settings.clickGoal]);

  const handleEndBreak = () => {
    setIsBreakActive(false);
    setClicks(0);
  };

  return (
    <div className="bg-brand-bg text-brand-text-primary min-h-screen w-full flex items-center justify-center select-none" onClick={handleAppClick}>
      <div className="w-full h-full min-h-screen relative flex items-center justify-center p-4 md:p-8">
        {!isBreakActive && (
          <ClickTracker
            name={settings.name}
            clicks={clicks}
            clickGoal={settings.clickGoal}
          />
        )}

        {isBreakActive && <BreakOverlay onEndBreak={handleEndBreak} />}

        {!isBreakActive && (
          <button
            onClick={() => setIsSettingsOpen(true)}
            className="absolute top-6 right-6 p-2 rounded-full text-brand-text-primary bg-transparent hover:bg-brand-surface transition-colors"
            aria-label="Open settings"
          >
            <SettingsIcon />
          </button>
        )}

        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSettingsSave}
          currentSettings={settings}
        />
        
        {!isElectron && (
          <div className="absolute bottom-4 text-center text-brand-text-secondary text-xs px-4">
            <p className="font-medium text-sm mb-1">Disclaimer</p>
            <p>This is a web application and can only track clicks made <span className="font-semibold text-brand-text-primary">inside this window</span>. It does not track clicks system-wide.</p>
          </div>
        )}

        {isElectron && (
          <div className="absolute bottom-4 text-center text-brand-text-secondary text-xs px-4">
            <p className="font-medium text-sm mb-1">System-wide Tracking</p>
            <p>
              <span className={`inline-block w-2 h-2 rounded-full mr-2 ${isTracking ? 'bg-green-500' : 'bg-red-500'}`}></span>
              {isTracking ? 'Tracking clicks across all applications' : 'Click tracking inactive'}
            </p>
            <p className="text-xs mt-1 opacity-75">Press Ctrl+Shift+C to toggle window visibility</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default App;