import React from 'react';
import AnimatedGradient from './AnimatedGradient';

interface ClickTrackerProps {
  name: string;
  clicks: number;
  clickGoal: number;
}

const ClickTracker: React.FC<ClickTrackerProps> = ({ name, clicks, clickGoal }) => {
  const progressPercentage = clickGoal > 0 ? Math.min((clicks / clickGoal) * 100, 100) : 0;

  return (
    <div className="flex flex-col items-start justify-center text-left p-0 md:p-8 w-full max-w-md">
      <h1 className="text-3xl font-light text-brand-text-secondary">
        Hey <span className="font-medium text-brand-text-primary">{name}</span>,
      </h1>
      <p className="text-3xl font-light text-brand-text-secondary mb-6">let's track those clicks!</p>
      
      <div className="relative w-full h-48 md:h-64 bg-brand-surface mb-6 overflow-hidden rounded-lg">
        <AnimatedGradient isInteractive={false} />
      </div>

      <div className="w-full">
        <div className="flex justify-between items-center text-sm text-brand-text-secondary mb-2">
          <span>Progress to next break</span>
          <span>{clicks.toLocaleString()} / {clickGoal.toLocaleString()}</span>
        </div>
        <div className="w-full bg-brand-surface h-1.5">
          <div
            className="bg-brand-text-primary h-1.5 transition-all duration-300 ease-out"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
      </div>
    </div>
  );
};

export default ClickTracker;