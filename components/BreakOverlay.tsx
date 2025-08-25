import React, { useState, useEffect } from 'react';

interface BreakOverlayProps {
  onEndBreak: () => void;
}

const FIFTEEN_MINUTES = 15 * 60;

const BreakOverlay: React.FC<BreakOverlayProps> = ({ onEndBreak }) => {
  const [timeLeft, setTimeLeft] = useState(FIFTEEN_MINUTES);
  const [isHovering, setIsHovering] = useState(true);

  useEffect(() => {
    if (timeLeft <= 0) {
      onEndBreak();
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prevTime => prevTime - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, onEndBreak]);

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${String(minutes).padStart(2, '0')}:${String(remainingSeconds).padStart(2, '0')}`;
  };

  return (
    <div className="absolute inset-0 w-full h-full flex flex-col items-center justify-center bg-black/70 z-10 backdrop-blur-lg animate-fade-in">
      <div className="absolute inset-0 w-full h-full overflow-hidden z-0">
        <video
          className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full -translate-x-1/2 -translate-y-1/2 object-cover opacity-10"
          src="/videos/relaxing-video.mp4"
          autoPlay
          muted
          loop
          playsInline
        >
        </video>
      </div>
      
      <div 
        className={`relative z-10 text-center p-8 rounded-lg max-w-lg w-full flex flex-col items-center transition-all duration-500 ease-in-out ${isHovering ? 'bg-brand-surface shadow-xl justify-between' : 'bg-transparent shadow-none justify-center'}`}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        style={{ minHeight: '300px' }} // Give container a consistent height for smooth transition
      >
        <div className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${isHovering ? 'max-h-40 opacity-100' : 'max-h-0 opacity-0'}`}>
          <h2 className="text-3xl font-medium text-brand-text-primary mb-2">Time for a break!</h2>
        </div>
        
        <div className={`w-full transition-all duration-500 ease-in-out ${isHovering ? 'translate-y-0' : '-translate-y-1/2'}`}>
            <p className="text-7xl font-mono font-bold text-brand-text-primary my-6 tabular-nums">{formatTime(timeLeft)}</p>
        </div>
        
        <div className={`w-full transition-all duration-300 ease-in-out overflow-hidden ${isHovering ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
          <div className="flex flex-col sm:flex-row sm:justify-center items-center gap-4">
              <a 
                href="https://open.spotify.com/playlist/37i9dQZF1DWZeKCadgRdKQ"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center bg-brand-interactive-spotify text-white font-medium py-3 px-6 rounded-lg hover:bg-brand-interactive-spotify-hover transition-colors w-full sm:w-48"
              >
                Listen on Spotify
              </a>
              
              <button
                onClick={onEndBreak}
                className="inline-flex items-center justify-center bg-brand-primary text-white font-medium py-3 px-6 rounded-lg hover:bg-brand-interactive-primary transition-colors w-full sm:w-48"
              >
                End Break Now
              </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BreakOverlay;