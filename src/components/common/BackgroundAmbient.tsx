import React, { useEffect, useRef } from 'react';

interface FloatingLightOrb {
  x: number;
  y: number;
  radius: number;
  baseRadius: number;
  colorInner: string;
  colorOuter: string;
  vx: number;
  vy: number;
  phase: number;
  speed: number;
  baseAlpha: number;
}

export const BackgroundAmbient: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // ZAXEN Signature Aurora Orbs (Smooth drifting gradient clouds)
    const orbs: FloatingLightOrb[] = [
      {
        x: width * 0.8,
        y: height * 0.2,
        radius: 380,
        baseRadius: 380,
        colorInner: '225, 29, 72', // ZAXEN Crimson
        colorOuter: '159, 18, 57',
        vx: 0.35,
        vy: 0.25,
        phase: 0,
        speed: 0.0008,
        baseAlpha: 0.14,
      },
      {
        x: width * 0.2,
        y: height * 0.75,
        radius: 420,
        baseRadius: 420,
        colorInner: '190, 18, 60', // Deep Carmine
        colorOuter: '136, 19, 55',
        vx: -0.28,
        vy: -0.22,
        phase: Math.PI / 2,
        speed: 0.0006,
        baseAlpha: 0.12,
      },
      {
        x: width * 0.5,
        y: height * 0.45,
        radius: 320,
        baseRadius: 320,
        colorInner: '255, 42, 95', // Neon Scarlet Flare
        colorOuter: '190, 24, 93',
        vx: 0.2,
        vy: -0.3,
        phase: Math.PI,
        speed: 0.0011,
        baseAlpha: 0.09,
      },
      {
        x: width * 0.9,
        y: height * 0.85,
        radius: 350,
        baseRadius: 350,
        colorInner: '159, 18, 57', // Deep Ember
        colorOuter: '76, 5, 25',
        vx: -0.32,
        vy: 0.18,
        phase: (3 * Math.PI) / 2,
        speed: 0.0007,
        baseAlpha: 0.11,
      },
    ];

    // Delicate floating embers / telemetry particles
    const particleCount = 36;
    const particles = Array.from({ length: particleCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      vx: (Math.random() - 0.5) * 0.35,
      vy: -Math.random() * 0.45 - 0.1, // Gently drifting upward
      radius: Math.random() * 1.8 + 0.8,
      alpha: Math.random() * 0.3 + 0.1,
      pulseSpeed: Math.random() * 0.02 + 0.01,
      phase: Math.random() * Math.PI * 2,
    }));

    let time = 0;

    const render = () => {
      time += 1;
      ctx.clearRect(0, 0, width, height);

      // 1. Dark obsidian base fill
      ctx.fillStyle = '#08090d';
      ctx.fillRect(0, 0, width, height);

      // 2. Draw smoothly drifting ZAXEN Crimson-Black Aurora Light Clouds
      orbs.forEach(orb => {
        // Organic Lissajous & Sine floating motion
        const currentX = orb.x + Math.sin(time * orb.speed + orb.phase) * (width * 0.12);
        const currentY = orb.y + Math.cos(time * orb.speed * 1.3 + orb.phase) * (height * 0.1);
        
        // Dynamic breathing opacity & radius pulse
        const breath = Math.sin(time * 0.0015 + orb.phase);
        const dynamicAlpha = orb.baseAlpha + breath * 0.04;
        const currentRadius = orb.baseRadius + breath * 40;

        const radialGrad = ctx.createRadialGradient(
          currentX,
          currentY,
          0,
          currentX,
          currentY,
          currentRadius
        );

        radialGrad.addColorStop(0, `rgba(${orb.colorInner}, ${dynamicAlpha})`);
        radialGrad.addColorStop(0.35, `rgba(${orb.colorOuter}, ${dynamicAlpha * 0.6})`);
        radialGrad.addColorStop(0.7, `rgba(18, 4, 10, ${dynamicAlpha * 0.2})`);
        radialGrad.addColorStop(1, 'rgba(8, 9, 13, 0)');

        ctx.fillStyle = radialGrad;
        ctx.fillRect(0, 0, width, height);
      });

      // 3. Subtle angled light beam / laser refraction sweep
      const sweepPhase = (time * 0.0004) % 1;
      const sweepX = width * sweepPhase * 1.6 - width * 0.3;
      const beamGrad = ctx.createLinearGradient(
        sweepX,
        0,
        sweepX + width * 0.35,
        height
      );
      beamGrad.addColorStop(0, 'rgba(225, 29, 72, 0)');
      beamGrad.addColorStop(0.5, 'rgba(225, 29, 72, 0.025)');
      beamGrad.addColorStop(1, 'rgba(225, 29, 72, 0)');

      ctx.fillStyle = beamGrad;
      ctx.fillRect(0, 0, width, height);

      // 4. Update & render soft embers with subtle glow blur
      particles.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;
        p.phase += p.pulseSpeed;

        // Wrap around smoothly
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < -20) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }

        const dynamicPAlpha = Math.max(0.04, p.alpha + Math.sin(p.phase) * 0.12);

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 71, 112, ${dynamicPAlpha})`;
        ctx.shadowColor = 'rgba(225, 29, 72, 0.8)';
        ctx.shadowBlur = 8;
        ctx.fill();
        ctx.shadowBlur = 0;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
      {/* Canvas with smooth hardware acceleration and subtle blur diffusion */}
      <canvas
        ref={canvasRef}
        className="w-full h-full filter blur-[18px] opacity-90 scale-105"
      />
      {/* Vignette overlay to anchor the obsidian gaming perimeter */}
      <div 
        className="absolute inset-0 pointer-events-none"
        style={{
          background: 'radial-gradient(circle at 50% 50%, transparent 40%, rgba(6, 7, 10, 0.75) 100%)'
        }}
      />
    </div>
  );
};
