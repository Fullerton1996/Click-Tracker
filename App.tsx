import React, { useState, useEffect, useCallback } from 'react';
import { useLocalStorage } from './hooks/useLocalStorage';
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

  const handleSettingsSave = (newSettings: Settings) => {
    setSettings(newSettings);
    setIsSettingsOpen(false);
  };
  
  const handleAppClick = useCallback(() => {
    if (!isBreakActive) {
      setClicks(prev => prev + 1);
    }
  }, [isBreakActive]);

  useEffect(() => {
    if (clicks >= settings.clickGoal && !isBreakActive) {
      setIsBreakActive(true);
    }
  }, [clicks, settings.clickGoal, isBreakActive]);

  const handleEndBreak = () => {
    setIsBreakActive(false);
    setClicks(0);
  };

  return (
    <div className="bg-brand-bg text-brand-text-primary min-h-screen w-full flex items-center justify-center select-none overflow-hidden relative">
      <div 
        className="w-full h-full min-h-screen flex items-center justify-center p-4 md:p-8" 
        onClick={isBreakActive ? undefined : handleAppClick}
      >
        {isBreakActive ? (
          <BreakOverlay onEndBreak={handleEndBreak} />
        ) : (
          <>
            <ClickTracker
              name={settings.name}
              clicks={clicks}
              clickGoal={settings.clickGoal}
            />
            <button
                onClick={() => setIsSettingsOpen(true)}
                className="absolute top-6 right-6 p-2 rounded-full text-brand-text-primary bg-transparent hover:bg-brand-surface/50 transition-colors"
                aria-label="Open settings"
            >
                <SettingsIcon />
            </button>
          </>
        )}
        <SettingsModal
          isOpen={isSettingsOpen}
          onClose={() => setIsSettingsOpen(false)}
          onSave={handleSettingsSave}
          currentSettings={settings}
        />
      </div>
    </div>
  );
};

export default App;