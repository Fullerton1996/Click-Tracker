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
    
    this.baseX = width / 2 + (Math.random() - 0.5) * (width / 2.5);
    this.baseY = height / 2 + (Math.random() - 0.5) * (height / 2.5);
    this.x = this.baseX;
    this.y = this.baseY;

    this.radius = Math.random() * (Math.min(width, height) / 5) + (Math.min(width, height) / 6);
    this.angle = Math.random() * Math.PI * 2;
    this.speed = Math.random() * 0.003 + 0.001;

    this.amplitudeX = Math.random() * (width / 5);
    this.amplitudeY = Math.random() * (height / 5);
    
    const [h, s, l] = hexToHsl(colorHex);
    this.h = h;
    this.s = s;
    this.l = l;
    this.hueShiftSpeed = (Math.random() - 0.5) * 0.5;
  }

  update() {
    this.angle += this.speed;
    this.x = this.baseX + Math.sin(this.angle) * this.amplitudeX;
    this.y = this.baseY + Math.cos(this.angle) * this.amplitudeY;

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

interface AnimatedGradientProps {
  isInteractive?: boolean;
}

const AnimatedGradient: React.FC<AnimatedGradientProps> = ({ isInteractive = false }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameId = useRef<number | undefined>(undefined);
  const blobs = useRef<MovingBlob[]>([]);
  const dimensions = useRef({ width: 0, height: 0 });
  const grainPattern = useRef<CanvasPattern | null>(null);
  const mousePos = useRef<{ x: number | null, y: number | null }>({ x: null, y: null });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const handleMouseMove = (event: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      mousePos.current = {
        x: (event.clientX - rect.left) * dpr,
        y: (event.clientY - rect.top) * dpr
      };
    };

    const handleMouseLeave = () => {
      mousePos.current = { x: null, y: null };
    };

    if (isInteractive) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseleave', handleMouseLeave);
    }

    const createGrain = () => {
      const grainCanvas = document.createElement('canvas');
      const grainCtx = grainCanvas.getContext('2d');
      if (grainCtx) {
          const grainSize = 150;
          grainCanvas.width = grainSize;
          grainCanvas.height = grainSize;
          const imageData = grainCtx.createImageData(grainSize, grainSize);
          const data = imageData.data;
          for (let i = 0; i < data.length; i += 4) {
              const value = Math.random() * 60;
              data[i] = value;
              data[i + 1] = value;
              data[i + 2] = value;
              data[i + 3] = 20; // Subtle alpha
          }
          grainCtx.putImageData(imageData, 0, 0);
          grainPattern.current = ctx.createPattern(grainCanvas, 'repeat');
      }
    };

    const setCanvasDimensions = () => {
        const dpr = window.devicePixelRatio || 1;
        const rect = canvas.getBoundingClientRect();
        canvas.width = rect.width * dpr;
        canvas.height = rect.height * dpr;
        // No ctx.scale() needed as we work in scaled coordinates
        dimensions.current = { width: canvas.width, height: canvas.height };
    };

    setCanvasDimensions();
    createGrain();
    
    blobs.current = colors.map(color => new MovingBlob(dimensions.current.width, dimensions.current.height, color));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      
      ctx.filter = 'blur(120px)';
      
      blobs.current.forEach((blob, index) => {
        if (isInteractive && index === 0) {
            const targetX = mousePos.current.x ?? blob.baseX;
            const targetY = mousePos.current.y ?? blob.baseY;
            
            blob.x += (targetX - blob.x) * 0.05; // Easing for smooth follow
            blob.y += (targetY - blob.y) * 0.05;

            blob.h = (blob.h + blob.hueShiftSpeed);
            if (blob.h > 360) blob.h -= 360;
            if (blob.h < 0) blob.h += 360;
        } else {
            blob.update();
        }
        blob.draw(ctx);
      });

      ctx.filter = 'none';
      if (grainPattern.current) {
        ctx.globalAlpha = 0.08;
        ctx.fillStyle = grainPattern.current;
        ctx.fillRect(0, 0, dimensions.current.width, dimensions.current.height);
        ctx.globalAlpha = 1.0;
      }

      animationFrameId.current = requestAnimationFrame(animate);
    };

    animate();
    
    const resizeObserver = new ResizeObserver(() => {
        setCanvasDimensions();
        blobs.current = colors.map(color => new MovingBlob(dimensions.current.width, dimensions.current.height, color));
    });
    
    resizeObserver.observe(canvas);

    return () => {
      if(animationFrameId.current) {
        cancelAnimationFrame(animationFrameId.current);
      }
      if (isInteractive) {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseleave', handleMouseLeave);
      }
      resizeObserver.disconnect();
    };
  }, [isInteractive]);

  return <canvas ref={canvasRef} className="w-full h-full" />;
};

export default AnimatedGradient;