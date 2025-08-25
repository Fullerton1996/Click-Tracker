import React, { useRef, useEffect } from 'react';

const colors = ['#a8c5ff', '#b2e5c1', '#d1c4e9', '#ffe0b2']; // Soft Blue, Mint Green, Lavender, Pale Orange

// Utility to convert HEX to HSL, which is easier to animate
function hexToHsl(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');
  const bigint = parseInt(hex, 16);
  let r = (bigint >> 16) & 255;
  let g = (bigint >> 8) & 255;
  let b = bigint & 255;

  r /= 255;
  g /= 255;
  b /= 255;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);

  let h = 0, s = 0, l = (max + min) / 2;

  if (max !== min) {
    const d = max - min;
    s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
    switch (max) {
      case r: h = (g - b) / d + (g < b ? 6 : 0); break;
      case g: h = (b - r) / d + 2; break;
      case b: h = (r - g) / d + 4; break;
    }
    h /= 6;
  }

  return [h * 360, s * 100, l * 100];
}

class MovingBlob {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  angle: number;
  speed: number;
  amplitudeX: number;
  amplitudeY: number;
  canvasWidth: number;
  canvasHeight: number;
  
  h: number; // Hue
  s: number; // Saturation
  l: number; // Lightness
  hueShiftSpeed: number;

  constructor(width: number, height: number, colorHex: string) {
    this.canvasWidth = width;
    this.canvasHeight = height;
    
    this.baseX = Math.random() * width;
    this.baseY = Math.random() * height;
    this.x = this.baseX;
    this.y = this.baseY;

    this.radius = Math.random() * (Math.min(width, height) / 2.5) + (Math.min(width, height) / 3);
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.005 + 0.002; // Slower, more natural speed
    this.amplitudeX = Math.random() * (width / 4) + (width / 8);
    this.amplitudeY = Math.random() * (height / 4) + (height / 8);
    
    const [h, s, l] = hexToHsl(colorHex);
    this.h = h;
    this.s = s;
    this.l = l;
    this.hueShiftSpeed = (Math.random() - 0.5) * 0.2; // Slower, more subtle hue shift
  }

  update() {
    this.angle += this.speed;
    // Use sine/cosine for smooth, orbital movement
    this.x = this.baseX + Math.sin(this.angle) * this.amplitudeX;
    this.y = this.baseY + Math.cos(this.angle) * this.amplitudeY;

    // Cycle hue for color animation
    this.h = (this.h + this.hueShiftSpeed);
    if (this.h > 360) this.h -= 360;
    if (this.h < 0) this.h += 360;
  }

  draw(ctx: CanvasRenderingContext2D) {
    ctx.beginPath();
    ctx.fillStyle = `hsl(${this.h}, ${this.s}%, ${this.l}%)`;
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
  }
}

const AnimatedGradient: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const blobs = useRef<MovingBlob[]>([]);
  const dimensions = useRef({ width: 0, height: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const setCanvasDimensions = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        ctx.scale(dpr, dpr);
        dimensions.current = { width: rect.width, height: rect.height };
    };

    setCanvasDimensions();
    
    blobs.current = colors.map(color => new MovingBlob(dimensions.current.width, dimensions.current.height, color));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.filter = 'blur(120px)'; // Increased blur for a softer, more blended effect
      
      blobs.current.forEach(blob => {
        blob.update();
        blob.draw(ctx);
      });

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();
    
    const resizeObserver = new ResizeObserver(() => {
        const prevWidth = dimensions.current.width;
        const prevHeight = dimensions.current.height;
        
        setCanvasDimensions();
        
        const newWidth = dimensions.current.width;
        const newHeight = dimensions.current.height;
        
        const scaleX = prevWidth > 0 ? newWidth / prevWidth : 1;
        const scaleY = prevHeight > 0 ? newHeight / prevHeight : 1;
        
        // Scale blob properties on resize to prevent jarring jumps
        blobs.current.forEach(b => {
            b.canvasWidth = newWidth;
            b.canvasHeight = newHeight;
            b.baseX *= scaleX;
            b.baseY *= scaleY;
            b.amplitudeX *= scaleX;
            b.amplitudeY *= scaleY;
            b.radius *= Math.min(scaleX, scaleY);
        });
    });
    
    resizeObserver.observe(canvas);

    return () => {
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default AnimatedGradient;