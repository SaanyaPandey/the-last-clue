import React, { useRef, useEffect, useState, useCallback } from 'react';
import { soundEngine } from '../game/SoundEngine';
import { useLanguage } from '../localization/LanguageContext';

/**
 * DetectiveWorldCanvas Component
 * Handcrafted 2D animated detective scene:
 * - Gothic Victorian manor exterior at midnight in the rain
 * - Silhouettes moving behind warm glowing arched windows
 * - Ornate flickering gas streetlamp casting volumetric light
 * - Human-like walking detective with swaying trenchcoat, fedora, and glowing lantern
 * - Footsteps and dynamic rotating shadow on wet cobblestones
 * - Drifting atmospheric fog ribbons & rain streaks
 * - Interactive pointer magnifying glass that reveals a secret clue beneath the lamp
 */
export default function DetectiveWorldCanvas({ onDiscoverClue, discoveredCount = 0 }) {
  const { t } = useLanguage();
  const canvasRef = useRef(null);
  const mousePosRef = useRef({ x: -1000, y: -1000, isHovering: false });
  const [clueRevealed, setClueRevealed] = useState(false);
  const clueFoundAudioTriggered = useRef(false);

  // Secret clue coordinates in canvas space (near base of lamppost)
  const CLUE_COORDS = { x: 575, y: 505, radius: 65 };

  // Handle pointer tracking over the canvas
  const handlePointerMove = useCallback((e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;
    const x = (e.clientX - rect.left) * scaleX;
    const y = (e.clientY - rect.top) * scaleY;
    mousePosRef.current = { x, y, isHovering: true };

    // Check proximity to secret clue
    const dist = Math.hypot(x - CLUE_COORDS.x, y - CLUE_COORDS.y);
    if (dist <= CLUE_COORDS.radius) {
      if (!clueRevealed) {
        setClueRevealed(true);
        if (!clueFoundAudioTriggered.current) {
          clueFoundAudioTriggered.current = true;
          soundEngine.playClueFound();
          if (onDiscoverClue) onDiscoverClue();
        }
      }
    }
  }, [clueRevealed, onDiscoverClue]);

  const handlePointerLeave = useCallback(() => {
    mousePosRef.current = { x: -1000, y: -1000, isHovering: false };
  }, []);

  const handleClick = useCallback(() => {
    const { x, y } = mousePosRef.current;
    const dist = Math.hypot(x - CLUE_COORDS.x, y - CLUE_COORDS.y);
    if (dist <= CLUE_COORDS.radius * 1.5) {
      soundEngine.playInspect();
      setClueRevealed(true);
      if (onDiscoverClue) onDiscoverClue();
    }
  }, [onDiscoverClue]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Detect user's reduced-motion preference
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    let animId = null;
    let time = 0;
    const footprints = []; // Array of { x, y, angle, alpha }

    // Raindrop particles
    const rain = Array.from({ length: 90 }, () => ({
      x: Math.random() * 950,
      y: Math.random() * 650,
      len: Math.random() * 14 + 10,
      speed: Math.random() * 4 + 7,
      alpha: Math.random() * 0.35 + 0.15
    }));

    // Fog banks
    const fog = [
      { x: 0, y: 520, speed: 0.35, size: 280, alpha: 0.12 },
      { x: 300, y: 550, speed: 0.22, size: 340, alpha: 0.15 },
      { x: 650, y: 530, speed: 0.28, size: 300, alpha: 0.14 }
    ];

    // Detective walking path state
    let detX = 120;
    const detY = 515;
    let detSpeed = 1.05;
    let detFacing = 1; // 1 = right, -1 = left
    let walkPhase = 0;
    let pauseTimer = 0;

    const render = () => {
      if (!prefersReducedMotion) {
        time += 0.035;
      }

      const W = canvas.width;
      const H = canvas.height;
      ctx.clearRect(0, 0, W, H);

      // ----------------------------------------------------
      // 1. SKY & FULL MOON
      // ----------------------------------------------------
      const skyGrad = ctx.createLinearGradient(0, 0, 0, 420);
      skyGrad.addColorStop(0, '#04070c');
      skyGrad.addColorStop(0.5, '#0a1019');
      skyGrad.addColorStop(1, '#141d2a');
      ctx.fillStyle = skyGrad;
      ctx.fillRect(0, 0, W, H);

      // Silver Full Moon
      const moonX = 720;
      const moonY = 110;
      const moonR = 42;

      // Moon Outer Atmospheric Glow
      const moonGlow = ctx.createRadialGradient(moonX, moonY, moonR * 0.5, moonX, moonY, 180);
      moonGlow.addColorStop(0, 'rgba(215, 230, 245, 0.32)');
      moonGlow.addColorStop(0.4, 'rgba(160, 190, 220, 0.12)');
      moonGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = moonGlow;
      ctx.beginPath();
      ctx.arc(moonX, moonY, 180, 0, Math.PI * 2);
      ctx.fill();

      // Moon Disk
      ctx.fillStyle = '#eaf0f8';
      ctx.beginPath();
      ctx.arc(moonX, moonY, moonR, 0, Math.PI * 2);
      ctx.fill();

      // Subtle Moon Craters
      ctx.fillStyle = 'rgba(175, 195, 215, 0.28)';
      ctx.beginPath();
      ctx.arc(moonX - 12, moonY - 10, 11, 0, Math.PI * 2);
      ctx.arc(moonX + 14, moonY + 8, 9, 0, Math.PI * 2);
      ctx.arc(moonX - 5, moonY + 16, 7, 0, Math.PI * 2);
      ctx.fill();

      // Drifting Moon Clouds
      ctx.fillStyle = 'rgba(10, 16, 26, 0.65)';
      ctx.beginPath();
      const cOffset = Math.sin(time * 0.4) * 20;
      ctx.ellipse(moonX - 30 + cOffset, moonY + 18, 75, 18, -0.05, 0, Math.PI * 2);
      ctx.ellipse(moonX + 40 - cOffset, moonY - 14, 60, 14, 0.05, 0, Math.PI * 2);
      ctx.fill();

      // ----------------------------------------------------
      // 2. DISTANT SILHOUETTED OLD-TOWN SKYLINE
      // ----------------------------------------------------
      ctx.fillStyle = '#090d14';
      ctx.beginPath();
      ctx.moveTo(0, 360);
      ctx.lineTo(60, 360);
      ctx.lineTo(80, 290); // Gabled roof
      ctx.lineTo(120, 320);
      ctx.lineTo(150, 270); // Tower
      ctx.lineTo(170, 270);
      ctx.lineTo(170, 340);
      ctx.lineTo(240, 340);
      ctx.lineTo(260, 300);
      ctx.lineTo(310, 340);
      ctx.lineTo(350, 240); // Gothic Spire
      ctx.lineTo(355, 210);
      ctx.lineTo(360, 240);
      ctx.lineTo(410, 350);
      ctx.lineTo(480, 350);
      ctx.lineTo(520, 290);
      ctx.lineTo(560, 330);
      ctx.lineTo(620, 310);
      ctx.lineTo(670, 340);
      ctx.lineTo(W, 340);
      ctx.lineTo(W, 460);
      ctx.lineTo(0, 460);
      ctx.closePath();
      ctx.fill();

      // ----------------------------------------------------
      // 3. BLACKWOOD MANOR FACADE (Midground Architecture)
      // ----------------------------------------------------
      const manorLeft = 140;
      const manorWidth = 620;
      const wallH = 430;

      // Dark Aged Victorian Brick Wall
      const brickGrad = ctx.createLinearGradient(manorLeft, 120, manorLeft, wallH);
      brickGrad.addColorStop(0, '#121822');
      brickGrad.addColorStop(0.5, '#18202d');
      brickGrad.addColorStop(1, '#1b1f28');
      ctx.fillStyle = brickGrad;
      ctx.fillRect(manorLeft, 140, manorWidth, wallH - 140);

      // Cornice & Roofline Trim
      ctx.fillStyle = '#0e131b';
      ctx.fillRect(manorLeft - 10, 134, manorWidth + 20, 14);
      ctx.fillStyle = '#222936';
      ctx.fillRect(manorLeft - 8, 134, manorWidth + 16, 4);

      // Stone Pilaster Columns on Manor Corners
      ctx.fillStyle = '#1e2634';
      ctx.fillRect(manorLeft, 148, 22, wallH - 148);
      ctx.fillRect(manorLeft + manorWidth - 22, 148, 22, wallH - 148);

      // Subtle horizontal stone stringcourse moldings
      ctx.fillStyle = '#161c26';
      ctx.fillRect(manorLeft, 260, manorWidth, 6);
      ctx.fillRect(manorLeft, 380, manorWidth, 6);

      // ----------------------------------------------------
      // 4. ARCHED WINDOWS & MOVING SILHOUETTES
      // ----------------------------------------------------
      const windows = [
        { id: 'w1', x: 210, y: 175, w: 68, h: 74, color: '#f5c66b', isLit: true },  // 2nd floor left (animated silhouette)
        { id: 'w2', x: 340, y: 175, w: 68, h: 74, color: '#4a6785', isLit: false }, // 2nd floor mid
        { id: 'w3', x: 470, y: 175, w: 68, h: 74, color: '#e8aa52', isLit: true },  // 2nd floor right (study lamp)
        { id: 'w4', x: 210, y: 290, w: 68, h: 78, color: '#d99742', isLit: true },  // 1st floor left (pendulum clock)
        { id: 'w5', x: 470, y: 290, w: 68, h: 78, color: '#314457', isLit: false }  // 1st floor right
      ];

      windows.forEach((win) => {
        // Window Stone Surround
        ctx.fillStyle = '#121720';
        ctx.beginPath();
        ctx.arc(win.x + win.w / 2, win.y + win.w / 2, win.w / 2 + 5, Math.PI, 0);
        ctx.rect(win.x - 5, win.y + win.w / 2, win.w + 10, win.h - win.w / 2 + 5);
        ctx.fill();

        // Stone Sill
        ctx.fillStyle = '#222b3a';
        ctx.fillRect(win.x - 8, win.y + win.h, win.w + 16, 7);

        // Window Interior Pane
        ctx.save();
        ctx.beginPath();
        ctx.arc(win.x + win.w / 2, win.y + win.w / 2, win.w / 2, Math.PI, 0);
        ctx.rect(win.x, win.y + win.w / 2, win.w, win.h - win.w / 2);
        ctx.clip();

        if (win.isLit) {
          // Warm glowing interior with subtle flame flicker
          const flicker = Math.sin(time * 3 + win.x) * 0.08;
          const winGrad = ctx.createRadialGradient(win.x + win.w / 2, win.y + win.h / 2, 8, win.x + win.w / 2, win.y + win.h / 2, win.w);
          winGrad.addColorStop(0, win.color);
          winGrad.addColorStop(1, 'rgba(80, 45, 20, 0.85)');
          ctx.fillStyle = winGrad;
          ctx.globalAlpha = 0.85 + flicker;
          ctx.fillRect(win.x, win.y, win.w, win.h);
          ctx.globalAlpha = 1.0;

          // WINDOW 1: MYSTERIOUS SILHOUETTE WALKING PAST
          if (win.id === 'w1') {
            // Silhouette paces back and forth every ~10 seconds
            const silPos = Math.sin(time * 0.6) * 22;
            ctx.fillStyle = '#110c08'; // Dark shadow
            // Silhouette head
            ctx.beginPath();
            ctx.arc(win.x + win.w / 2 + silPos, win.y + 32, 9, 0, Math.PI * 2);
            ctx.fill();
            // Silhouette shoulders and coat
            ctx.beginPath();
            ctx.ellipse(win.x + win.w / 2 + silPos, win.y + 54, 16, 18, 0, 0, Math.PI * 2);
            ctx.fill();
            // Candle / candlestick held
            ctx.fillStyle = '#ffd685';
            ctx.beginPath();
            ctx.arc(win.x + win.w / 2 + silPos + 12, win.y + 42, 3, 0, Math.PI * 2);
            ctx.fill();
          }

          // WINDOW 4: GRANDFATHER CLOCK SWINGING PENDULUM
          if (win.id === 'w4') {
            const swing = Math.sin(time * 2.2) * 12;
            ctx.fillStyle = '#1a100a';
            // Clock frame silhouette
            ctx.fillRect(win.x + 22, win.y + 16, 24, 56);
            ctx.strokeStyle = '#ffd685';
            ctx.lineWidth = 1.5;
            // Swinging pendulum
            ctx.beginPath();
            ctx.moveTo(win.x + 34, win.y + 32);
            ctx.lineTo(win.x + 34 + swing, win.y + 62);
            ctx.stroke();
            ctx.fillStyle = '#ffd685';
            ctx.beginPath();
            ctx.arc(win.x + 34 + swing, win.y + 62, 4, 0, Math.PI * 2);
            ctx.fill();
          }

        } else {
          // Dark night pane with rain reflection
          ctx.fillStyle = '#080c14';
          ctx.fillRect(win.x, win.y, win.w, win.h);
        }

        // Leaded Window Mullion Bars
        ctx.strokeStyle = '#121720';
        ctx.lineWidth = 3;
        ctx.beginPath();
        // Vertical mullion
        ctx.moveTo(win.x + win.w / 2, win.y);
        ctx.lineTo(win.x + win.w / 2, win.y + win.h);
        // Horizontal transoms
        ctx.moveTo(win.x, win.y + win.w / 2);
        ctx.lineTo(win.x + win.w, win.y + win.w / 2);
        ctx.moveTo(win.x, win.y + win.h * 0.7);
        ctx.lineTo(win.x + win.w, win.y + win.h * 0.7);
        ctx.stroke();

        ctx.restore();
      });

      // Grand Arched Oak Entrance Door (Center-right of manor)
      const doorX = 330;
      const doorY = 280;
      const doorW = 86;
      const doorH = 150;
      ctx.fillStyle = '#0e121a';
      ctx.beginPath();
      ctx.arc(doorX + doorW / 2, doorY + doorW / 2, doorW / 2 + 6, Math.PI, 0);
      ctx.rect(doorX - 6, doorY + doorW / 2, doorW + 12, doorH - doorW / 2);
      ctx.fill();

      // Oak Panels
      ctx.fillStyle = '#2b1a12';
      ctx.beginPath();
      ctx.arc(doorX + doorW / 2, doorY + doorW / 2, doorW / 2, Math.PI, 0);
      ctx.rect(doorX, doorY + doorW / 2, doorW, doorH - doorW / 2);
      ctx.fill();
      ctx.strokeStyle = '#3e261a';
      ctx.lineWidth = 2;
      ctx.strokeRect(doorX + 8, doorY + 52, doorW / 2 - 12, 40);
      ctx.strokeRect(doorX + doorW / 2 + 4, doorY + 52, doorW / 2 - 12, 40);
      ctx.strokeRect(doorX + 8, doorY + 98, doorW / 2 - 12, 44);
      ctx.strokeRect(doorX + doorW / 2 + 4, doorY + 98, doorW / 2 - 12, 44);

      // Brass lion door knocker
      ctx.fillStyle = '#d4a359';
      ctx.beginPath();
      ctx.arc(doorX + doorW / 2, doorY + 74, 5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#d4a359';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(doorX + doorW / 2, doorY + 80, 6, 0, Math.PI);
      ctx.stroke();

      // Stone Entrance Steps
      ctx.fillStyle = '#1c2432';
      ctx.fillRect(doorX - 18, 430, doorW + 36, 12);
      ctx.fillStyle = '#181e28';
      ctx.fillRect(doorX - 26, 442, doorW + 52, 12);

      // ----------------------------------------------------
      // 5. WET COBBLESTONE STREET & PUDDLE REFLECTIONS
      // ----------------------------------------------------
      const streetY = 440;
      const streetH = H - streetY;
      const groundGrad = ctx.createLinearGradient(0, streetY, 0, H);
      groundGrad.addColorStop(0, '#10141c');
      groundGrad.addColorStop(0.4, '#141a24');
      groundGrad.addColorStop(1, '#0b0e14');
      ctx.fillStyle = groundGrad;
      ctx.fillRect(0, streetY, W, streetH);

      // Cobblestone horizontal joint lines with perspective
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 1.2;
      for (let y = streetY; y < H; y += 18) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Vertical staggered stone dividers
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.035)';
      ctx.lineWidth = 1;
      let row = 0;
      for (let y = streetY; y < H; y += 18) {
        const offset = (row % 2) * 16;
        for (let x = offset; x < W; x += 32) {
          ctx.beginPath();
          ctx.moveTo(x, y);
          ctx.lineTo(x, y + 18);
          ctx.stroke();
        }
        row++;
      }

      // Wet Puddle 1: Reflecting Lamp Light (near x: 575)
      ctx.save();
      ctx.fillStyle = 'rgba(212, 163, 89, 0.16)';
      ctx.beginPath();
      ctx.ellipse(560, 520, 85, 22, -0.05, 0, Math.PI * 2);
      ctx.fill();
      // Puddle ripple
      const ripRadius = (time * 15) % 35;
      ctx.strokeStyle = 'rgba(212, 163, 89, 0.25)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.ellipse(560, 520, ripRadius, ripRadius * 0.32, 0, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Wet Puddle 2: Reflecting Moon Light (near x: 280)
      ctx.save();
      ctx.fillStyle = 'rgba(160, 195, 230, 0.1)';
      ctx.beginPath();
      ctx.ellipse(260, 570, 70, 18, 0.08, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // ----------------------------------------------------
      // 6. GAS STREETLAMP & VOLUMETRIC LIGHT CONE
      // ----------------------------------------------------
      const lampX = 580;
      const lampHeadY = 320;
      const lampBaseY = 530;

      // Volumetric Warm Light Beam on the Street
      const flicker = Math.sin(time * 11) * 0.1 + Math.cos(time * 19) * 0.06;
      const coneGrad = ctx.createRadialGradient(lampX, lampHeadY + 20, 15, lampX, lampHeadY + 90, 220 + flicker * 25);
      coneGrad.addColorStop(0, 'rgba(245, 195, 105, 0.55)');
      coneGrad.addColorStop(0.3, 'rgba(225, 165, 75, 0.28)');
      coneGrad.addColorStop(0.7, 'rgba(180, 120, 45, 0.08)');
      coneGrad.addColorStop(1, 'transparent');

      ctx.save();
      ctx.fillStyle = coneGrad;
      ctx.beginPath();
      ctx.moveTo(lampX - 16, lampHeadY + 25);
      ctx.lineTo(lampX + 16, lampHeadY + 25);
      ctx.lineTo(lampX + 180, H - 40);
      ctx.lineTo(lampX - 180, H - 40);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // Ornate Cast-Iron Lamppost Structure
      ctx.fillStyle = '#131822';
      // Pole
      ctx.fillRect(lampX - 5, lampHeadY + 45, 10, lampBaseY - (lampHeadY + 45));
      // Ring moldings
      ctx.fillRect(lampX - 8, lampHeadY + 55, 16, 6);
      ctx.fillRect(lampX - 7, lampBaseY - 45, 14, 6);
      // Flared base
      ctx.beginPath();
      ctx.moveTo(lampX - 16, lampBaseY);
      ctx.lineTo(lampX + 16, lampBaseY);
      ctx.lineTo(lampX + 6, lampBaseY - 35);
      ctx.lineTo(lampX - 6, lampBaseY - 35);
      ctx.closePath();
      ctx.fill();

      // Lamp Crossbar (ladder rest)
      ctx.fillRect(lampX - 22, lampHeadY + 52, 44, 4);

      // Glass Lantern Housing
      ctx.fillStyle = '#111620';
      ctx.fillRect(lampX - 18, lampHeadY + 38, 36, 6);
      ctx.fillRect(lampX - 14, lampHeadY - 4, 28, 8); // Top cap
      ctx.beginPath();
      ctx.moveTo(lampX, lampHeadY - 14);
      ctx.lineTo(lampX + 5, lampHeadY - 4);
      ctx.lineTo(lampX - 5, lampHeadY - 4);
      ctx.fill();

      // Glass frame outline
      ctx.strokeStyle = '#222938';
      ctx.lineWidth = 2.5;
      ctx.strokeRect(lampX - 16, lampHeadY + 4, 32, 34);

      // Glowing Gas Flame inside
      ctx.fillStyle = '#fff4db';
      ctx.beginPath();
      ctx.arc(lampX, lampHeadY + 22, 6, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = '#ffb338';
      ctx.beginPath();
      ctx.arc(lampX, lampHeadY + 22, 11, 0, Math.PI * 2);
      ctx.fill();

      // ----------------------------------------------------
      // 7. SECRET EVIDENCE CLUE (Under the streetlamp)
      // ----------------------------------------------------
      // Draw faint clue on ground (brightens when revealed or inspected)
      ctx.save();
      if (clueRevealed) {
        // Glowing Footprint with sports track tread
        ctx.fillStyle = 'rgba(212, 163, 89, 0.85)';
        ctx.beginPath();
        ctx.ellipse(CLUE_COORDS.x - 10, CLUE_COORDS.y, 14, 6, -0.2, 0, Math.PI * 2);
        ctx.fill();
        ctx.beginPath();
        ctx.ellipse(CLUE_COORDS.x - 18, CLUE_COORDS.y + 1, 6, 5, -0.2, 0, Math.PI * 2);
        ctx.fill();

        // Dropped Antique Silver Cufflink / Brass Key
        ctx.fillStyle = '#fce4a6';
        ctx.beginPath();
        ctx.arc(CLUE_COORDS.x + 12, CLUE_COORDS.y - 4, 5, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d4a359';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(CLUE_COORDS.x + 17, CLUE_COORDS.y - 4);
        ctx.lineTo(CLUE_COORDS.x + 28, CLUE_COORDS.y - 4);
        ctx.lineTo(CLUE_COORDS.x + 28, CLUE_COORDS.y);
        ctx.stroke();

        // Radiant Sparkle Ring
        const sparkle = Math.sin(time * 6) * 3;
        ctx.strokeStyle = '#fce4a6';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(CLUE_COORDS.x + 5, CLUE_COORDS.y - 2, 22 + sparkle, 0, Math.PI * 2);
        ctx.stroke();

        // Clue Star Icon
        ctx.fillStyle = '#ffdf78';
        ctx.font = 'bold 13px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('✦', CLUE_COORDS.x + 5, CLUE_COORDS.y - 22);

      } else {
        // Subtle ambient glint on wet ground to entice investigation
        const glint = Math.sin(time * 4) * 0.35 + 0.35;
        ctx.fillStyle = `rgba(212, 163, 89, ${glint})`;
        ctx.beginPath();
        ctx.arc(CLUE_COORDS.x + 8, CLUE_COORDS.y - 4, 3, 0, Math.PI * 2);
        ctx.fill();
      }
      ctx.restore();

      // ----------------------------------------------------
      // 8. THE WALKING DETECTIVE CHARACTER (Silhouette / Chiaroscuro)
      // ----------------------------------------------------
      if (!prefersReducedMotion) {
        // Detective walks left-to-right, pauses under the lamp, then continues
        if (pauseTimer > 0) {
          pauseTimer -= 1;
        } else {
          detX += detSpeed * detFacing;
          walkPhase += 0.16;

          // Check if detective reaches lamp area to briefly inspect (around x = 520)
          if (detFacing === 1 && Math.abs(detX - 520) < 3 && Math.random() < 0.6) {
            pauseTimer = 90; // Pause for ~2.5 seconds under the lamp
          }

          // Boundary bounce or loop
          if (detX > W + 80) {
            detX = -60;
            detFacing = 1;
          } else if (detX < -80) {
            detX = W + 60;
            detFacing = -1;
          }

          // Record wet footsteps
          if (Math.sin(walkPhase) > 0.85 && Math.random() < 0.3) {
            footprints.push({
              x: detX + (Math.random() - 0.5) * 6,
              y: detY + 36,
              alpha: 0.55
            });
            if (footprints.length > 24) footprints.shift();
          }
        }
      }

      // Draw fading footsteps
      footprints.forEach((fp) => {
        fp.alpha -= 0.002;
        if (fp.alpha > 0) {
          ctx.fillStyle = `rgba(0, 0, 0, ${fp.alpha * 0.6})`;
          ctx.beginPath();
          ctx.ellipse(fp.x, fp.y, 6, 2.5, 0, 0, Math.PI * 2);
          ctx.fill();
        }
      });

      // Detective dynamic shadow (rotates away from streetlamp)
      const distToLamp = detX - lampX;
      const shadowLength = Math.min(95, Math.abs(distToLamp) * 0.5 + 20);
      const shadowDir = distToLamp < 0 ? -1 : 1;

      ctx.save();
      ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
      ctx.beginPath();
      ctx.ellipse(detX + shadowDir * shadowLength * 0.45, detY + 38, shadowLength * 0.5, 7, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();

      // Draw Detective Character Figure
      ctx.save();
      ctx.translate(detX, detY);
      ctx.scale(detFacing, 1); // Flip horizontally when walking backwards

      const isWalking = pauseTimer <= 0;
      const legStride = isWalking ? Math.sin(walkPhase) * 14 : 0;
      const coatSwing = isWalking ? Math.cos(walkPhase) * 7 : 0;
      const torsoBob = isWalking ? Math.abs(Math.sin(walkPhase * 2)) * 2 : 0;

      // --- Left & Right Legs ---
      ctx.strokeStyle = '#10141d';
      ctx.lineWidth = 6;
      ctx.lineCap = 'round';

      // Back leg
      ctx.beginPath();
      ctx.moveTo(-2, 12 - torsoBob);
      ctx.lineTo(-4 - legStride * 0.75, 26);
      ctx.lineTo(-6 - legStride, 38);
      ctx.stroke();

      // Front leg
      ctx.strokeStyle = '#181f2a';
      ctx.beginPath();
      ctx.moveTo(3, 12 - torsoBob);
      ctx.lineTo(4 + legStride * 0.75, 26);
      ctx.lineTo(5 + legStride, 38);
      ctx.stroke();

      // Shoes
      ctx.fillStyle = '#0a0d13';
      ctx.fillRect(-8 - legStride, 36, 9, 4);
      ctx.fillRect(4 + legStride, 36, 9, 4);

      // --- Flowing Trenchcoat Body & Tails ---
      ctx.fillStyle = '#1c2432';
      // Trenchcoat skirt/tails with sway
      ctx.beginPath();
      ctx.moveTo(-9, -2 - torsoBob);
      ctx.lineTo(10, -2 - torsoBob);
      ctx.lineTo(13 + legStride * 0.2, 22);
      ctx.lineTo(-14 - coatSwing, 24);
      ctx.closePath();
      ctx.fill();

      // Torso & Buttoned Double-Breasted Lapels
      ctx.fillStyle = '#222c3c';
      ctx.fillRect(-8, -24 - torsoBob, 17, 24);
      // Belt
      ctx.fillStyle = '#141a24';
      ctx.fillRect(-9, -2 - torsoBob, 19, 4);
      ctx.fillStyle = '#d4a359'; // Belt brass buckle
      ctx.fillRect(-2, -3 - torsoBob, 5, 6);

      // Collar turned up
      ctx.fillStyle = '#2a3547';
      ctx.beginPath();
      ctx.moveTo(-8, -24 - torsoBob);
      ctx.lineTo(-11, -30 - torsoBob);
      ctx.lineTo(-3, -24 - torsoBob);
      ctx.fill();
      ctx.beginPath();
      ctx.moveTo(8, -24 - torsoBob);
      ctx.lineTo(11, -30 - torsoBob);
      ctx.lineTo(3, -24 - torsoBob);
      ctx.fill();

      // --- Head & Classic Detective Fedora Hat ---
      // Head
      ctx.fillStyle = '#e8cfb0'; // Warm skin silhouette highlight
      ctx.beginPath();
      ctx.arc(1, -31 - torsoBob, 6, 0, Math.PI * 2);
      ctx.fill();

      // Fedora Hat
      ctx.fillStyle = '#141a24';
      // Curved Hat Brim
      ctx.beginPath();
      ctx.ellipse(2, -35 - torsoBob, 15, 3.5, 0.08, 0, Math.PI * 2);
      ctx.fill();
      // Hat Crown (creased top)
      ctx.fillRect(-5, -45 - torsoBob, 13, 11);
      ctx.fillStyle = '#0e1218';
      ctx.fillRect(-6, -37 - torsoBob, 15, 3); // Hat band
      ctx.fillStyle = '#d4a359'; // Subtle band buckle
      ctx.fillRect(4, -37 - torsoBob, 2, 3);

      // --- Left Arm & Glowing Storm Lantern ---
      // Arm holding lantern forward
      ctx.strokeStyle = '#222c3c';
      ctx.lineWidth = 5;
      ctx.beginPath();
      ctx.moveTo(6, -18 - torsoBob);
      ctx.lineTo(16, -10 - torsoBob);
      ctx.lineTo(22, -14 - torsoBob);
      ctx.stroke();

      // Brass Hurricane Lantern
      const lntX = 23;
      const lntY = -12 - torsoBob;
      // Handle
      ctx.strokeStyle = '#d4a359';
      ctx.lineWidth = 1.5;
      ctx.beginPath();
      ctx.arc(lntX, lntY - 6, 5, Math.PI, 0);
      ctx.stroke();
      // Lantern cap and base
      ctx.fillStyle = '#8b6932';
      ctx.fillRect(lntX - 4, lntY - 6, 8, 3);
      ctx.fillRect(lntX - 4, lntY + 8, 8, 3);
      // Glass body
      ctx.fillStyle = '#ffe9b3';
      ctx.fillRect(lntX - 3, lntY - 3, 6, 11);

      // Lantern Forward Light Cast
      const lntGlow = ctx.createRadialGradient(lntX, lntY + 2, 2, lntX + 16, lntY + 12, 65);
      lntGlow.addColorStop(0, 'rgba(255, 220, 140, 0.45)');
      lntGlow.addColorStop(0.5, 'rgba(225, 160, 60, 0.15)');
      lntGlow.addColorStop(1, 'transparent');
      ctx.fillStyle = lntGlow;
      ctx.beginPath();
      ctx.arc(lntX + 16, lntY + 12, 65, 0, Math.PI * 2);
      ctx.fill();

      ctx.restore();

      // ----------------------------------------------------
      // 9. ROLLING GROUND FOG RIBBONS
      // ----------------------------------------------------
      fog.forEach((f) => {
        if (!prefersReducedMotion) {
          f.x += f.speed;
          if (f.x > W + f.size) f.x = -f.size;
        }

        const fogGrad = ctx.createRadialGradient(f.x, f.y, 20, f.x, f.y, f.size);
        fogGrad.addColorStop(0, `rgba(215, 230, 245, ${f.alpha})`);
        fogGrad.addColorStop(0.5, `rgba(180, 205, 230, ${f.alpha * 0.5})`);
        fogGrad.addColorStop(1, 'transparent');
        ctx.fillStyle = fogGrad;
        ctx.beginPath();
        ctx.ellipse(f.x, f.y, f.size, 38, 0, 0, Math.PI * 2);
        ctx.fill();
      });

      // ----------------------------------------------------
      // 10. SUBTLE SLANTED RAIN STREAKS
      // ----------------------------------------------------
      ctx.strokeStyle = 'rgba(200, 225, 255, 0.28)';
      ctx.lineWidth = 1.1;
      rain.forEach((r) => {
        if (!prefersReducedMotion) {
          r.y += r.speed;
          r.x -= 1.2;
          if (r.y > H) {
            r.y = -r.len;
            r.x = Math.random() * (W + 60);
          }
        }
        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x - 3, r.y + r.len);
        ctx.stroke();
      });

      // ----------------------------------------------------
      // 11. INTERACTIVE POINTER MAGNIFYING GLASS
      // ----------------------------------------------------
      const { x: mX, y: mY, isHovering } = mousePosRef.current;
      if (isHovering && mX > 0 && mY > 0) {
        ctx.save();
        const distToSecret = Math.hypot(mX - CLUE_COORDS.x, mY - CLUE_COORDS.y);
        const isNearClue = distToSecret <= CLUE_COORDS.radius;

        // Lens Glass Highlight / Optical Ring
        ctx.strokeStyle = isNearClue ? '#ffd685' : '#d4a359';
        ctx.lineWidth = isNearClue ? 3.5 : 2.5;
        ctx.fillStyle = isNearClue ? 'rgba(212, 163, 89, 0.2)' : 'rgba(255, 255, 255, 0.06)';

        ctx.beginPath();
        ctx.arc(mX, mY, 28, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();

        // Lens Glare Arc
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.arc(mX, mY, 23, -Math.PI * 0.7, -Math.PI * 0.2);
        ctx.stroke();

        // Brass Handle
        ctx.strokeStyle = '#8b6932';
        ctx.lineWidth = 4;
        ctx.lineCap = 'round';
        ctx.beginPath();
        ctx.moveTo(mX + 20, mY + 20);
        ctx.lineTo(mX + 38, mY + 38);
        ctx.stroke();

        // Crosshair reticle
        ctx.strokeStyle = isNearClue ? '#ffeaad' : 'rgba(212, 163, 89, 0.4)';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(mX - 8, mY);
        ctx.lineTo(mX + 8, mY);
        ctx.moveTo(mX, mY - 8);
        ctx.lineTo(mX, mY + 8);
        ctx.stroke();

        ctx.restore();
      }

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      if (animId) cancelAnimationFrame(animId);
    };
  }, [clueRevealed]);

  return (
    <div className="detective-world-container" role="img" aria-label="Animated Detective World: Victorian London Street at Night">
      <canvas
        ref={canvasRef}
        width={900}
        height={650}
        className="detective-world-canvas"
        onPointerMove={handlePointerMove}
        onPointerLeave={handlePointerLeave}
        onClick={handleClick}
      />

      {/* Secret Clue Interactive Discovery Tooltip */}
      {clueRevealed && (
        <div className="detective-clue-tooltip animate-scale-up" role="status">
          <span className="clue-sparkle-icon" aria-hidden="true">✦</span>
          <div className="clue-tooltip-text">
            <span>{t('hero.secretClueFound')}</span>
          </div>
        </div>
      )}

      {/* Subtle Exploration Hint */}
      {!clueRevealed && (
        <div className="detective-canvas-hint font-mono">
          <span>{t('hero.exploreWorldTip')}</span>
        </div>
      )}
    </div>
  );
}
