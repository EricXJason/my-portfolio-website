import React, { useEffect, useRef } from 'react';

// CyberParticles Component: Renders Dynamic Ambient Canvas Background
// Supports Dark Neon Starfield & Light Aurora Ambient Mesh Pattern
export const CyberParticles = ({ soundPlaying }) => {
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

    // Particle Array Initialization (Restrained & Elegant)
    const particleCount = 22;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.5 + 0.8,
      baseVx: (Math.random() - 0.5) * 0.25,
      baseVy: (Math.random() - 0.5) * 0.25,
      vx: (Math.random() - 0.5) * 0.25,
      vy: (Math.random() - 0.5) * 0.25,
      alpha: Math.random() * 0.3 + 0.1,
      color: Math.random() > 0.5 ? '#06b6d4' : '#8b5cf6',
    }));

    let step = 0;

    const render = () => {
      step += 0.015;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      const isLight = document.documentElement.classList.contains('light');

      // Particle Motion Loop
      particles.forEach((p) => {
        const speedMult = soundPlaying ? 1.4 : 1.0;
        p.x += p.vx * speedMult;
        p.y += p.vy * speedMult;

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Render Subtle Particle Dots
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = isLight ? 'rgba(2, 132, 199, 0.2)' : p.color;
        ctx.globalAlpha = isLight ? 0.25 : p.alpha;
        ctx.fill();
      });

      // Subtle Constellation Lines
      ctx.globalAlpha = isLight ? 0.06 : 0.03;
      for (let i = 0; i < particleCount; i++) {
        for (let j = i + 1; j < particleCount; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = isLight ? '#0284c7' : '#06b6d4';
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', resizeCanvas);
      cancelAnimationFrame(animationFrameId);
    };
  }, [soundPlaying]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
      {/* Canvas Layer for Particles */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full" />

      {/* Cybernetic Digital Grid (Dark Mode Overlay) */}
      <div
        className="absolute inset-0 dark:opacity-40 light:opacity-0 transition-opacity duration-500 pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(6, 182, 212, 0.05) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(6, 182, 212, 0.05) 1px, transparent 1px)
          `,
          backgroundSize: '4rem 4rem',
        }}
      />

      {/* Futuristic Sweeping Laser Beam (New Media Scanline Effect) */}
      <div className="absolute inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent animate-cyber-scan pointer-events-none filter blur-[1px]" />

      {/* Light Mode Aurora Gradient Mesh Background */}
      <div className="light-aurora-bg absolute inset-0 opacity-0 transition-opacity duration-500 pointer-events-none" />
    </div>
  );
};
