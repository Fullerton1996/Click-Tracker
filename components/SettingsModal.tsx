import React, { useState, useEffect } from 'react';
import { Settings } from '../types';
import CloseIcon from './icons/CloseIcon';

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (settings: Settings) => void;
  currentSettings: Settings;
}

const SettingsModal: React.FC<SettingsModalProps> = ({ isOpen, onClose, onSave, currentSettings }) => {
  const [name, setName] = useState(currentSettings.name);
  const [clickGoal, setClickGoal] = useState(currentSettings.clickGoal);

  useEffect(() => {
    setName(currentSettings.name);
    setClickGoal(currentSettings.clickGoal);
  }, [currentSettings, isOpen]);

  if (!isOpen) {
    return null;
  }

  const handleSave = () => {
    onSave({ name, clickGoal: Number(clickGoal) });
  };

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-brand-surface rounded-lg shadow-2xl w-full max-w-sm m-4 p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-normal text-brand-text-primary">Settings</h2>
          <button onClick={onClose} className="p-2 -m-2 rounded-full hover:bg-brand-border/50 text-brand-text-secondary hover:text-brand-text-primary">
            <CloseIcon />
          </button>
        </div>

        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-normal text-brand-text-secondary mb-2">
              Your Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-brand-surface border-b-2 border-brand-border text-brand-text-primary rounded-none p-3 focus:outline-none focus:border-b-2 focus:border-brand-primary transition-colors"
              placeholder="e.g., Alex"
            />
          </div>
          <div>
            <label htmlFor="clickGoal" className="block text-sm font-normal text-brand-text-secondary mb-2">
              Clicks Before Break
            </label>
            <input
              type="number"
              id="clickGoal"
              value={clickGoal}
              onChange={(e) => setClickGoal(Number(e.target.value))}
              className="w-full bg-brand-surface border-b-2 border-brand-border text-brand-text-primary rounded-none p-3 focus:outline-none focus:border-b-2 focus:border-brand-primary transition-colors"
              min="100"
              step="100"
            />
          </div>
        </div>

        <div className="mt-8">
          <button
            onClick={handleSave}
            className="w-full bg-brand-primary text-white font-medium py-3 px-4 rounded-md hover:bg-brand-interactive-primary transition-colors"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
};

export default SettingsModal;