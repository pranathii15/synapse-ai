import React, { useEffect, useRef, useState } from 'react';

interface Illustration {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  type: string;
  size: number;
  scale: number;
  rotation: number;
  opacity: number;
  parallaxFactor: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  baseAlpha: number;
  alpha: number;
}

export default function AmbientBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mouseRef = useRef({ x: -1000, y: -1000, active: false });
  const [reducedMotion, setReducedMotion] = useState(false);

  // Set up screen-size awareness and prefers-reduced-motion detection
  useEffect(() => {
    const motionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReducedMotion(motionQuery.matches);
    
    const handleMotionChange = (e: MediaQueryListEvent) => {
      setReducedMotion(e.matches);
    };
    motionQuery.addEventListener('change', handleMotionChange);
    return () => motionQuery.removeEventListener('change', handleMotionChange);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Reposition and scale canvas properly on window resizing
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
      initializeElements();
    };

    window.addEventListener('resize', handleResize);

    // Track mouse coordinates globally
    const handleMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY, active: true };
    };

    const handleMouseLeave = () => {
      mouseRef.current = { x: -1000, y: -1000, active: false };
    };

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseleave', handleMouseLeave);

    // Defined set of illustration types to generate
    const types = [
      'laptop',
      'monitor',
      'chip',
      'network',
      'cloud',
      'document',
      'database',
      'shield',
      'globe',
      'calendar',
      'chat',
      'folder',
      'analytics',
      'arrows'
    ];

    let illustrations: Illustration[] = [];
    let particles: Particle[] = [];

    const initializeElements = () => {
      illustrations = [];
      particles = [];

      // Avoid creating too many items on mobile for performance
      const isMobile = width < 768;
      const illustrationCount = isMobile ? 8 : 16;
      const particleCount = isMobile ? 20 : 45;

      // Seed illustrations across spaced-out virtual zones to avoid clustering
      const cols = isMobile ? 3 : 4;
      const rows = isMobile ? 3 : 4;
      const colWidth = width / cols;
      const rowHeight = height / rows;

      let id = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (illustrations.length >= illustrationCount) break;

          // Introduce randomness within the sector grid cell
          const baseX = colWidth * c + colWidth * 0.1 + Math.random() * (colWidth * 0.8);
          const baseY = rowHeight * r + rowHeight * 0.1 + Math.random() * (rowHeight * 0.8);

          // Randomize type, size, parallax speeds
          const type = types[Math.floor(Math.random() * types.length)];
          const size = Math.floor(Math.random() * 15) + 38; // 38px to 53px base size
          const parallaxFactor = 0.015 + Math.random() * 0.035;

          illustrations.push({
            id: id++,
            x: baseX,
            y: baseY,
            baseX,
            baseY,
            type,
            size,
            scale: 1.0,
            rotation: (Math.random() - 0.5) * 0.15, // random soft initial rotation
            opacity: 0.04 + Math.random() * 0.03, // subtle base opacity (4% to 7%)
            parallaxFactor
          });
        }
      }

      // Seed elegant floating particles
      for (let i = 0; i < particleCount; i++) {
        const colors = [
          'rgba(255, 255, 255, ', // White
          'rgba(35, 57, 91, ',   // Deep Navy #23395B
          'rgba(79, 124, 172, ',  // Indigo #4F7CAC
          'rgba(203, 213, 225, '  // Silver/Slate #CBD5E1
        ];
        const color = colors[Math.floor(Math.random() * colors.length)];
        const size = 1.0 + Math.random() * 2.2;
        const vx = (Math.random() - 0.5) * 0.25;
        const vy = (Math.random() - 0.5) * 0.25;

        particles.push({
          x: Math.random() * width,
          y: Math.random() * height,
          vx,
          vy,
          size,
          color,
          baseAlpha: 0.10 + Math.random() * 0.20,
          alpha: 0.15
        });
      }
    };

    initializeElements();

    // Custom functions to draw each of the line-art vector illustrations
    const drawIllustration = (ctx: CanvasRenderingContext2D, type: string, size: number) => {
      const w = size;
      const h = size * 0.8;

      ctx.lineWidth = 1.25;

      switch (type) {
        case 'laptop':
          ctx.beginPath();
          ctx.rect(-w / 2, -h / 2, w, h * 0.72); // screen
          ctx.moveTo(-w / 2 - 8, h / 2 - 2);
          ctx.lineTo(w / 2 + 8, h / 2 - 2); // base bottom
          ctx.lineTo(w / 2 + 5, h / 2 + 2);
          ctx.lineTo(-w / 2 - 5, h / 2 + 2);
          ctx.closePath();
          ctx.stroke();
          break;

        case 'monitor':
          ctx.beginPath();
          ctx.rect(-w / 2, -h / 2, w, h * 0.75); // screen
          ctx.moveTo(-8, h / 2 - 2);
          ctx.lineTo(-12, h / 2 + 5); // stand
          ctx.lineTo(12, h / 2 + 5);
          ctx.lineTo(8, h / 2 - 2);
          ctx.stroke();
          break;

        case 'chip':
          ctx.beginPath();
          ctx.rect(-w / 2, -h / 2, w, w); // body
          // pins sticking out on all 4 sides
          for (let offset = -w / 2 + 8; offset <= w / 2 - 8; offset += 8) {
            ctx.moveTo(offset, -h / 2); ctx.lineTo(offset, -h / 2 - 3);
            ctx.moveTo(offset, h / 2); ctx.lineTo(offset, h / 2 + 3);
            ctx.moveTo(-w / 2, offset); ctx.lineTo(-w / 2 - 3, offset);
            ctx.moveTo(w / 2, offset); ctx.lineTo(w / 2 + 3, offset);
          }
          ctx.rect(-w / 4, -w / 4, w / 2, w / 2); // inner core
          ctx.stroke();
          break;

        case 'network':
          // 4 connected dots representing machine learning graph nodes
          ctx.beginPath();
          ctx.arc(-w / 3, -h / 3, 3, 0, Math.PI * 2);
          ctx.arc(w / 3, -h / 3, 3, 0, Math.PI * 2);
          ctx.arc(-w / 6, h / 3, 3, 0, Math.PI * 2);
          ctx.arc(w / 3, h / 4, 3, 0, Math.PI * 2);
          // Connecting wires
          ctx.moveTo(-w / 3 + 3, -h / 3); ctx.lineTo(w / 3 - 3, -h / 3);
          ctx.moveTo(-w / 3, -h / 3 + 3); ctx.lineTo(-w / 6, h / 3 - 3);
          ctx.moveTo(w / 3, -h / 3 + 3); ctx.lineTo(-w / 6, h / 3 - 3);
          ctx.moveTo(-w / 6 + 3, h / 3); ctx.lineTo(w / 3 - 3, h / 4);
          ctx.stroke();
          break;

        case 'cloud':
          ctx.beginPath();
          ctx.arc(-8, 3, 7, Math.PI * 0.5, Math.PI * 1.5);
          ctx.arc(1, -4, 9, Math.PI * 1.0, Math.PI * 2.0);
          ctx.arc(9, 3, 7, Math.PI * 1.5, Math.PI * 2.5);
          ctx.lineTo(-8, 10);
          ctx.closePath();
          ctx.stroke();
          break;

        case 'document':
          ctx.beginPath();
          ctx.rect(-w / 2, -h / 2, w, h);
          // folded top-right dogear corner
          ctx.moveTo(w / 2 - 8, -h / 2);
          ctx.lineTo(w / 2 - 8, -h / 2 + 8);
          ctx.lineTo(w / 2, -h / 2 + 8);
          // text lines
          ctx.moveTo(-w / 2 + 5, -h / 2 + 15); ctx.lineTo(w / 2 - 5, -h / 2 + 15);
          ctx.moveTo(-w / 2 + 5, -h / 2 + 23); ctx.lineTo(w / 2 - 5, -h / 2 + 23);
          ctx.moveTo(-w / 2 + 5, -h / 2 + 31); ctx.lineTo(w / 2 - 10, -h / 2 + 31);
          ctx.stroke();
          break;

        case 'database':
          // Cylinders stack
          for (let level = -1; level <= 1; level++) {
            const dy = level * 12;
            ctx.beginPath();
            ctx.ellipse(0, dy, w / 2, 4, 0, 0, Math.PI * 2);
            ctx.stroke();
            ctx.beginPath();
            ctx.moveTo(-w / 2, dy);
            ctx.lineTo(-w / 2, dy + 6);
            ctx.ellipse(0, dy + 6, w / 2, 4, 0, 0, Math.PI);
            ctx.lineTo(w / 2, dy);
            ctx.stroke();
          }
          break;

        case 'shield':
          ctx.beginPath();
          ctx.moveTo(0, -h / 2);
          ctx.quadraticCurveTo(w / 2, -h / 2, w / 2, -3);
          ctx.quadraticCurveTo(w / 2, h / 2 - 8, 0, h / 2);
          ctx.quadraticCurveTo(-w / 2, h / 2 - 8, -w / 2, -3);
          ctx.quadraticCurveTo(-w / 2, -h / 2, 0, -h / 2);
          ctx.closePath();
          ctx.stroke();
          // vertical dividing security panel line
          ctx.beginPath();
          ctx.moveTo(0, -h / 2 + 6);
          ctx.lineTo(0, h / 2 - 6);
          ctx.stroke();
          break;

        case 'globe':
          ctx.beginPath();
          ctx.arc(0, 0, w / 2, 0, Math.PI * 2);
          ctx.stroke();
          ctx.beginPath();
          ctx.ellipse(0, 0, w / 4, w / 2, 0, 0, Math.PI * 2);
          ctx.ellipse(0, 0, w / 2, w / 4, 0, 0, Math.PI * 2);
          ctx.stroke();
          break;

        case 'calendar':
          ctx.beginPath();
          ctx.rect(-w / 2, -h / 2, w, h);
          // header line
          ctx.moveTo(-w / 2, -h / 2 + 8);
          ctx.lineTo(w / 2, -h / 2 + 8);
          // Binder loop pins
          ctx.moveTo(-w / 4, -h / 2); ctx.lineTo(-w / 4, -h / 2 - 3);
          ctx.moveTo(w / 4, -h / 2); ctx.lineTo(w / 4, -h / 2 - 3);
          // tiny grid representational points
          for (let gx = -w / 2 + 8; gx <= w / 2 - 8; gx += 8) {
            for (let gy = -h / 2 + 14; gy <= h / 2 - 4; gy += 8) {
              ctx.moveTo(gx, gy);
              ctx.arc(gx, gy, 0.5, 0, Math.PI * 2);
            }
          }
          ctx.stroke();
          break;

        case 'chat':
          ctx.beginPath();
          // Main bubble rectangle
          ctx.rect(-w / 2, -h / 2, w, h * 0.75);
          // Chat bubble pointer arrow
          ctx.moveTo(-w / 4, h * 0.25);
          ctx.lineTo(-w / 4 - 5, h * 0.25 + 6);
          ctx.lineTo(-w / 4 + 3, h * 0.25);
          ctx.stroke();
          break;

        case 'folder':
          ctx.beginPath();
          ctx.moveTo(-w / 2, -h / 2);
          ctx.lineTo(-w / 4, -h / 2);
          ctx.lineTo(-w / 6, -h / 2 + 4);
          ctx.lineTo(w / 2, -h / 2 + 4);
          ctx.lineTo(w / 2, h / 2);
          ctx.lineTo(-w / 2, h / 2);
          ctx.closePath();
          ctx.stroke();
          break;

        case 'analytics':
          // Axes
          ctx.beginPath();
          ctx.moveTo(-w / 2, -h / 2);
          ctx.lineTo(-w / 2, h / 2);
          ctx.lineTo(w / 2, h / 2);
          ctx.stroke();
          // Columns
          ctx.rect(-w / 2 + 4, h / 2, 4, -12);
          ctx.rect(-w / 2 + 11, h / 2, 4, -22);
          ctx.rect(-w / 2 + 18, h / 2, 4, -15);
          ctx.rect(-w / 2 + 25, h / 2, 4, -28);
          ctx.stroke();
          break;

        case 'arrows':
          // Two curves looping representing flow
          ctx.beginPath();
          ctx.arc(-6, 0, 8, Math.PI * 0.5, Math.PI * 1.5);
          ctx.stroke();
          ctx.beginPath();
          ctx.arc(6, 0, 8, Math.PI * 1.5, Math.PI * 0.5);
          ctx.stroke();
          // Left arrowhead
          ctx.beginPath();
          ctx.moveTo(-6, 8); ctx.lineTo(-10, 5);
          ctx.moveTo(-6, 8); ctx.lineTo(-2, 5);
          // Right arrowhead
          ctx.moveTo(6, -8); ctx.lineTo(10, -5);
          ctx.moveTo(6, -8); ctx.lineTo(2, -5);
          ctx.stroke();
          break;

        default:
          ctx.beginPath();
          ctx.rect(-w/2, -h/2, w, h);
          ctx.stroke();
          break;
      }
    };

    // Frame rendering loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // 1. Mouse Spotlight Ambient Glow layer
      const mouse = mouseRef.current;
      if (mouse.active && !reducedMotion) {
        const gradient = ctx.createRadialGradient(
          mouse.x,
          mouse.y,
          0,
          mouse.x,
          mouse.y,
          240
        );
        gradient.addColorStop(0, 'rgba(79, 124, 172, 0.045)'); // extremely soft indigo glow
        gradient.addColorStop(0.5, 'rgba(79, 124, 172, 0.012)');
        gradient.addColorStop(1, 'rgba(79, 124, 172, 0)');
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, width, height);
      }

      // 2. Render & connect particles (Constellation Network effect)
      ctx.lineWidth = 0.5;
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Motion physics updates
        if (!reducedMotion) {
          p.x += p.vx;
          p.y += p.vy;

          // Boundary bounce with padding to prevent snapping
          if (p.x < 0 || p.x > width) p.vx *= -1;
          if (p.y < 0 || p.y > height) p.vy *= -1;
        }

        // Spotlight proximity calculation
        let alphaMultiplier = 1.0;
        let scaleMultiplier = 1.0;
        if (mouse.active && !reducedMotion) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 240) {
            const ratio = 1 - dist / 240;
            alphaMultiplier = 1.0 + ratio * 2.8; // make particles much more visible inside the spotlight
            scaleMultiplier = 1.0 + ratio * 0.45;
          }
        }

        p.alpha = p.baseAlpha * alphaMultiplier;
        if (p.alpha > 0.65) p.alpha = 0.65; // cap to keep background gentle

        // Draw particle dot
        ctx.fillStyle = `${p.color}${p.alpha})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size * scaleMultiplier, 0, Math.PI * 2);
        ctx.fill();

        // Constellation lines: link nearby particles
        if (!reducedMotion) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            const dx = p.x - p2.x;
            const dy = p.y - p2.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // Connect if close
            if (dist < 85) {
              const proximityFactor = 1 - dist / 85;
              const lineAlpha = 0.04 * proximityFactor * ((p.alpha + p2.alpha) / 2);
              ctx.strokeStyle = `rgba(79, 124, 172, ${lineAlpha})`;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);
              ctx.stroke();
            }
          }
        }
      }

      // 3. Render spaced illustrations (Laptop, cloud, database, etc.)
      for (let i = 0; i < illustrations.length; i++) {
        const item = illustrations[i];

        let targetScale = 1.0;
        let targetOpacity = 0.04;
        let targetRotation = 0.0;
        let offsetX = 0;
        let offsetY = 0;

        // Apply mouse interaction, spotlight glow, scale, and subtle parallax
        if (mouse.active && !reducedMotion) {
          const dx = mouse.x - item.baseX;
          const dy = mouse.y - item.baseY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 240) {
            const proximity = 1 - dist / 240; // 0.0 to 1.0
            
            targetOpacity = 0.04 + proximity * 0.18; // swell to ~22% opacity
            targetScale = 1.0 + proximity * 0.08; // scale up slightly as requested (1.0 to 1.08)
            targetRotation = proximity * 0.06; // rotate by up to ~3.5 degrees (0.06 rad)
            
            // Subtly attract toward or slide with mouse (subtle depth parallax)
            offsetX = -dx * proximity * item.parallaxFactor * 0.65;
            offsetY = -dy * proximity * item.parallaxFactor * 0.65;
          }
        }

        // Apply smooth ease interpolations
        const ease = 0.08; // smooth feedback speed
        item.scale += (targetScale - item.scale) * ease;
        item.opacity += (targetOpacity - item.opacity) * ease;
        item.rotation += (targetRotation - item.rotation) * ease;

        // Apply slow ambient idle drift when mouse is away
        let idleX = 0;
        let idleY = 0;
        if (!reducedMotion) {
          const time = Date.now() * 0.0006 + item.id * 100;
          idleX = Math.sin(time) * 4; // slow 4px floating drift
          idleY = Math.cos(time * 0.8) * 3;
        }

        item.x = item.baseX + offsetX + idleX;
        item.y = item.baseY + offsetY + idleY;

        // Set rendering context state
        ctx.save();
        ctx.translate(item.x, item.y);
        ctx.rotate(item.rotation);
        ctx.scale(item.scale, item.scale);

        // Navy/Indigo strokes
        ctx.strokeStyle = `rgba(35, 57, 91, ${item.opacity})`;
        
        // Add subtle shadow glow on hover
        if (item.opacity > 0.08 && !reducedMotion) {
          ctx.shadowColor = 'rgba(79, 124, 172, 0.15)';
          ctx.shadowBlur = 8;
        } else {
          ctx.shadowBlur = 0;
        }

        drawIllustration(ctx, item.type, item.size);
        ctx.restore();
      }

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseleave', handleMouseLeave);
    };
  }, [reducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 w-full h-full pointer-events-none z-0"
      style={{ mixBlendMode: 'multiply' }}
    />
  );
}
