import React, { useEffect, useRef } from 'react';

interface CyberParticlesProps {
  theme: string;
  soundPlaying: boolean;
}

interface Particle {
  x: number;
  y: number;
  radius: number;
  vx: number;
  vy: number;
  pulsePhase: number;
  pulseSpeed: number;
  baseAlpha: number;
  darkColor: string;
  lightColor: string;
  shape: 'circle' | 'square' | 'ring' | 'cross';
}

export const CyberParticles: React.FC<CyberParticlesProps> = ({ theme, soundPlaying }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;
    let animationFrameId: number;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas, { passive: true });
    window.addEventListener('orientationchange', resizeCanvas, { passive: true });

    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    window.addEventListener('mouseleave', handleMouseLeave, { passive: true });

    const darkPalette = ['#00f0ff', '#ff0055', '#ffb700', '#00ff9d', '#b026ff', '#38bdf8'];
    const lightPalette = ['#0284c7', '#2563eb', '#059669', '#d97706', '#7c3aed'];

    const isMobile = window.innerWidth < 768;
    const particleCount = isMobile ? 8 : 65;


    const particles: Particle[] = Array.from({ length: particleCount }, () => {
      const darkColor = darkPalette[Math.floor(Math.random() * darkPalette.length)];
      const lightColor = lightPalette[Math.floor(Math.random() * lightPalette.length)];
      const r = Math.random() * 2.2 + 1.2;
      const shapes: ('circle' | 'square' | 'ring' | 'cross')[] = ['circle', 'circle', 'ring', 'square', 'cross'];

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: r,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.025,
        baseAlpha: Math.random() * 0.45 + 0.25,
        darkColor,
        lightColor,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      };
    });

    let frameCount = 0;

    const render = () => {
      frameCount++;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isLight = theme === 'light' || document.documentElement.classList.contains('light');

      particles.forEach((p) => {
        p.pulsePhase += p.pulseSpeed;
        const speedMult = soundPlaying ? 1.6 : 1.0;

        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 200;
          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 0.85;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        const soundPulse = soundPlaying ? 0.3 * Math.sin(frameCount * 0.1 + p.pulsePhase) : 0;
        const pulseFactor = 0.8 + 0.2 * Math.sin(p.pulsePhase) + soundPulse;
        const currentAlpha = Math.min(0.95, Math.max(0.15, p.baseAlpha * pulseFactor));
        const particleColor = isLight ? p.lightColor : p.darkColor;

        ctx.save();
        ctx.globalAlpha = isLight ? Math.min(0.45, currentAlpha * 0.5) : currentAlpha;

        if (p.radius > 1.8 && !isMobile) {
          ctx.shadowColor = particleColor;
          ctx.shadowBlur = isLight ? 4 : 10;
        }

        ctx.fillStyle = particleColor;
        ctx.strokeStyle = particleColor;

        if (p.shape === 'circle') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * (soundPlaying ? 1.3 : 1.0), 0, Math.PI * 2);
          ctx.fill();
        } else if (p.shape === 'ring') {
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.radius * 1.5, 0, Math.PI * 2);
          ctx.lineWidth = 1;
          ctx.stroke();
        } else if (p.shape === 'cross') {
          const len = p.radius * 1.6;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.moveTo(p.x - len, p.y);
          ctx.lineTo(p.x + len, p.y);
          ctx.moveTo(p.x, p.y - len);
          ctx.lineTo(p.x, p.y + len);
          ctx.stroke();
        } else {
          ctx.fillRect(p.x - p.radius, p.y - p.radius, p.radius * 2, p.radius * 2);
        }
        ctx.restore();
      });

      // Draw Sci-Fi Laser Grid Telemetry Connectors
      const connectDist = soundPlaying ? 170 : 135;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            const lineFactor = 1 - dist / connectDist;
            const lineAlpha = lineFactor * (isLight ? 0.12 : 0.22);
            const lineStroke = isLight ? p1.lightColor : p1.darkColor;

            ctx.save();
            ctx.globalAlpha = lineAlpha;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineStroke;
            ctx.lineWidth = lineFactor * 1.1;
            ctx.stroke();
            ctx.restore();
          }
        }
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      window.removeEventListener('orientationchange', resizeCanvas);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, soundPlaying]);

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />
      {/* Sci-Fi Tactical Grid Overlay */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500 opacity-20"
        style={{
          backgroundImage: isLight
            ? `radial-gradient(#0284c7 1px, transparent 1px), linear-gradient(to right, rgba(2, 132, 199, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(2, 132, 199, 0.08) 1px, transparent 1px)`
            : `radial-gradient(#00f0ff 1px, transparent 1px), linear-gradient(to right, rgba(0, 240, 255, 0.08) 1px, transparent 1px), linear-gradient(to bottom, rgba(0, 240, 255, 0.08) 1px, transparent 1px)`,
          backgroundSize: '40px 40px, 40px 40px, 40px 40px',
        }}
      />
      {/* Holographic Laser Beam Scan Line */}
      <div
        className={`absolute inset-x-0 h-[2px] pointer-events-none filter blur-[1px] animate-cyber-scan ${
          isLight
            ? 'bg-gradient-to-r from-transparent via-sky-500 to-transparent'
            : 'bg-gradient-to-r from-transparent via-cyan-400 to-transparent'
        }`}
      />
    </div>
  );
};

export default CyberParticles;
