import React, { useEffect, useRef } from 'react';

// CyberParticles Component: Renders Dynamic Ambient Canvas Background
// Supports Vibrant Dark Cyberpunk & Rich Light Ambient Particle Effects
export const CyberParticles = ({ theme, soundPlaying }) => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationFrameId;

    const resizeCanvas = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    // Mouse Tracking for Interactive Particle Magnet/Repulsion
    const mouse = { x: -1000, y: -1000, active: false };
    const handleMouseMove = (e) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };
    const handleMouseLeave = () => {
      mouse.active = false;
    };
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Dynamic Color Palettes for High-Contrast Visibility
    const darkPalette = ['#06b6d4', '#38bdf8', '#8b5cf6', '#c084fc', '#ec4899', '#10b981'];
    const lightPalette = ['#0284c7', '#2563eb', '#7c3aed', '#d946ef', '#0891b2', '#1d4ed8'];

    // Particle Array Initialization
    const particleCount = 55;
    const particles = Array.from({ length: particleCount }, () => {
      const darkColor = darkPalette[Math.floor(Math.random() * darkPalette.length)];
      const lightColor = lightPalette[Math.floor(Math.random() * lightPalette.length)];

      return {
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        radius: Math.random() * 2.2 + 1.2,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        pulsePhase: Math.random() * Math.PI * 2,
        pulseSpeed: 0.015 + Math.random() * 0.025,
        baseAlpha: Math.random() * 0.4 + 0.45, // 0.45 to 0.85 opacity
        darkColor,
        lightColor,
      };
    });

    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isLight = theme === 'light' || document.documentElement.classList.contains('light');

      // 1. Particle Motion & Render Loop
      particles.forEach((p) => {
        p.pulsePhase += p.pulseSpeed;
        const speedMult = soundPlaying ? 1.5 : 1.0;

        // Interactive Mouse Influence
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          const maxDist = 160;
          if (dist < maxDist) {
            const force = (1 - dist / maxDist) * 0.6;
            p.x -= (dx / dist) * force;
            p.y -= (dy / dist) * force;
          }
        }

        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        // Wrap Around Viewport Borders
        if (p.x < -20) p.x = canvas.width + 20;
        if (p.x > canvas.width + 20) p.x = -20;
        if (p.y < -20) p.y = canvas.height + 20;
        if (p.y > canvas.height + 20) p.y = -20;

        // Twinkle / Pulse Opacity
        const pulseFactor = 0.75 + 0.25 * Math.sin(p.pulsePhase);
        const currentAlpha = p.baseAlpha * pulseFactor;
        const particleColor = isLight ? p.lightColor : p.darkColor;

        ctx.save();
        ctx.globalAlpha = isLight ? Math.min(1, currentAlpha * 0.95) : currentAlpha;

        // Glowing Aura Shadow for Larger Particles
        if (p.radius > 2.0) {
          ctx.shadowColor = particleColor;
          ctx.shadowBlur = isLight ? 10 : 14;
        }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = particleColor;
        ctx.fill();
        ctx.restore();
      });

      // 2. Constellation Connecting Lines
      const connectDist = 160;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const p1 = particles[i];
          const p2 = particles[j];
          const dx = p1.x - p2.x;
          const dy = p1.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < connectDist) {
            const lineFactor = 1 - dist / connectDist;
            const lineAlpha = lineFactor * (isLight ? 0.32 : 0.22);
            const lineStroke = isLight ? p1.lightColor : p1.darkColor;

            ctx.save();
            ctx.globalAlpha = lineAlpha;
            ctx.beginPath();
            ctx.moveTo(p1.x, p1.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = lineStroke;
            ctx.lineWidth = lineFactor * 1.3;
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
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, [theme, soundPlaying]);

  const isLight = theme === 'light';

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Canvas Layer for Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Cybernetic Digital Grid (Visually distinct in both Dark & Light Modes) */}
      <div
        className="absolute inset-0 pointer-events-none transition-opacity duration-500"
        style={{
          opacity: isLight ? 0.35 : 0.45,
          backgroundImage: isLight
            ? `
              linear-gradient(to right, rgba(2, 132, 199, 0.08) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(2, 132, 199, 0.08) 1px, transparent 1px)
            `
            : `
              linear-gradient(to right, rgba(6, 182, 212, 0.07) 1px, transparent 1px),
              linear-gradient(to bottom, rgba(6, 182, 212, 0.07) 1px, transparent 1px)
            `,
          backgroundSize: '4rem 4rem',
        }}
      />

      {/* Futuristic Sweeping Laser Beam Scanline */}
      <div
        className={`absolute inset-x-0 h-[2px] pointer-events-none filter blur-[1px] animate-cyber-scan ${
          isLight
            ? 'bg-gradient-to-r from-transparent via-cyan-600/70 to-transparent'
            : 'bg-gradient-to-r from-transparent via-cyan-400/70 to-transparent'
        }`}
      />
    </div>
  );
};
