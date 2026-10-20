import React, { useRef, useEffect, useCallback } from 'react';
import { soundEngine } from './SoundEngine';

/**
 * RoomEngine Component
 * High-performance 2.5D canvas spatial environment renderer.
 * Features:
 * - Real-time perspective drawing of Manor Drawing Room & Grand Library
 * - Animated fireplace flames with dynamic lighting flicker
 * - Window rain streaks & floating dust motes
 * - Detective avatar with 8-way movement, walking animation, and floor shadow
 * - Obstacle collisions and floor boundary restrictions
 * - Responsive click-to-move and WASD/Arrow key controls
 * - Robust object hit-testing and auto-walk interaction
 * - Zero React state thrashing during render loop
 */
export default function RoomEngine({
  roomType = 'drawing_room', // 'drawing_room' | 'library'
  initialPos = { x: 500, y: 520, facing: 'down' },
  interactiveObjects = [],
  examinedObjectIds = new Set(),
  onObjectClick,
  onObjectProximityChange
}) {
  const canvasRef = useRef(null);
  const keysPressed = useRef({});
  const playerPosRef = useRef({ x: initialPos.x, y: initialPos.y, facing: initialPos.facing || 'down' });
  const targetPosRef = useRef(null); // Click-to-move destination
  const pendingActionRef = useRef(null); // Object to interact with upon arrival
  const lastProximityIdRef = useRef(null); // Tracks proximity to prevent re-render loops
  const animFrameId = useRef(null);
  const particles = useRef([]);
  const rainDrops = useRef([]);
  const embers = useRef([]);
  const flameTime = useRef(0);
  const footstepCooldown = useRef(0);
  const lightningCooldown = useRef(450); // Countdown until next lightning flash
  const lightningFlashIntensity = useRef(0);
  const roomEntryAlpha = useRef(1); // Cinematic room entry transition

  // Sync player position and trigger smooth room fade when room changes
  useEffect(() => {
    playerPosRef.current = { x: initialPos.x, y: initialPos.y, facing: initialPos.facing || 'down' };
    targetPosRef.current = null;
    pendingActionRef.current = null;
    lastProximityIdRef.current = null;
    roomEntryAlpha.current = 0; // Fade in from black
  }, [roomType, initialPos.x, initialPos.y, initialPos.facing]);

  // Initialize room particles (dust motes, rain, and fireplace embers)
  useEffect(() => {
    particles.current = Array.from({ length: 36 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 700,
      size: Math.random() * 2 + 0.6,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.25 - 0.1,
      alpha: Math.random() * 0.4 + 0.15
    }));

    rainDrops.current = Array.from({ length: 48 }, () => ({
      x: Math.random() * 260,
      y: Math.random() * 280,
      len: Math.random() * 14 + 10,
      speed: Math.random() * 5 + 8,
      alpha: Math.random() * 0.35 + 0.25
    }));

    embers.current = Array.from({ length: 18 }, () => ({
      x: 580 + (Math.random() - 0.5) * 80,
      y: 310 + Math.random() * 20,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -(Math.random() * 1.2 + 0.8),
      life: Math.random() * 40 + 10,
      maxLife: 50
    }));
  }, [roomType]);

  // Keyboard Event Listeners for WASD and Arrow keys
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();
      if (['w', 'a', 's', 'd', 'arrowup', 'arrowleft', 'arrowdown', 'arrowright'].includes(key)) {
        e.preventDefault();
        keysPressed.current[key] = true;
        targetPosRef.current = null;
        pendingActionRef.current = null;
      }
    };

    const handleKeyUp = (e) => {
      const key = e.key.toLowerCase();
      if (keysPressed.current[key]) {
        keysPressed.current[key] = false;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, []);

  // Room Collision Boundaries & Furniture Obstacles
  const isPositionValid = useCallback((x, y, room) => {
    const minX = 75;
    const maxX = 1125;
    const minY = 330;
    const maxY = 660;

    if (x < minX || x > maxX || y < minY || y > maxY) {
      return false;
    }

    const obstacles = room === 'drawing_room'
      ? [
          { x1: 490, y1: 290, x2: 710, y2: 365 }, // Fireplace hearth
          { x1: 140, y1: 395, x2: 370, y2: 485 }, // Mahogany desk
          { x1: 750, y1: 440, x2: 990, y2: 545 }, // Velvet Settee & side table
          { x1: 50, y1: 290, x2: 135, y2: 430 }   // Left architectural column
        ]
      : [
          { x1: 430, y1: 400, x2: 770, y2: 515 }, // Library Reading Table
          { x1: 130, y1: 310, x2: 320, y2: 420 }, // Display curio cabinet
          { x1: 820, y1: 290, x2: 900, y2: 380 }, // Grandfather clock
          { x1: 930, y1: 470, x2: 1060, y2: 570 } // Armchair
        ];

    for (const ob of obstacles) {
      if (x >= ob.x1 && x <= ob.x2 && y >= ob.y1 && y <= ob.y2) {
        return false;
      }
    }

    return true;
  }, []);

  // Check if coordinates hit an interactive object's physical hit area
  const findClickedObject = useCallback((clickX, clickY) => {
    for (const obj of interactiveObjects) {
      if (obj.hitBox) {
        const { x1, y1, x2, y2 } = obj.hitBox;
        if (clickX >= x1 && clickX <= x2 && clickY >= y1 && clickY <= y2) {
          return obj;
        }
      }
      const radius = obj.hitRadius || 68;
      const dist = Math.hypot(obj.x - clickX, obj.y - clickY);
      if (dist <= radius) {
        return obj;
      }
    }
    return null;
  }, [interactiveObjects]);

  // ==========================================
  // MAIN ANIMATION & RENDER LOOP
  // ==========================================
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let walkCycle = 0;

    const render = () => {
      flameTime.current += 0.05;

      // Handle room entry fade
      if (roomEntryAlpha.current < 1) {
        roomEntryAlpha.current = Math.min(1, roomEntryAlpha.current + 0.05);
      }

      // Handle distant lightning flash timing
      lightningCooldown.current -= 1;
      if (lightningCooldown.current <= 0) {
        // Trigger a new lightning flash
        lightningFlashIntensity.current = 1.0;
        // Schedule next lightning flash in 500-900 frames (~8-15 seconds)
        lightningCooldown.current = Math.floor(Math.random() * 400 + 500);
      }
      if (lightningFlashIntensity.current > 0) {
        // Natural double flicker decay
        lightningFlashIntensity.current = Math.max(0, lightningFlashIntensity.current - 0.065);
      }

      let { x: posX, y: posY, facing } = playerPosRef.current;
      let isMoving = false;

      // 1. Process Movement Inputs (Keyboard)
      let moveX = 0;
      let moveY = 0;
      const speed = 3.8;

      if (keysPressed.current['w'] || keysPressed.current['arrowup']) moveY -= speed;
      if (keysPressed.current['s'] || keysPressed.current['arrowdown']) moveY += speed;
      if (keysPressed.current['a'] || keysPressed.current['arrowleft']) moveX -= speed;
      if (keysPressed.current['d'] || keysPressed.current['arrowright']) moveX += speed;

      // 2. Process Click-to-Move & Auto-Walk
      if (targetPosRef.current) {
        const dx = targetPosRef.current.x - posX;
        const dy = targetPosRef.current.y - posY;
        const dist = Math.hypot(dx, dy);

        if (dist > 6) {
          moveX = (dx / dist) * speed;
          moveY = (dy / dist) * speed;
        } else {
          targetPosRef.current = null;
          if (pendingActionRef.current) {
            const actionObj = pendingActionRef.current;
            pendingActionRef.current = null;
            onObjectClick(actionObj);
          }
        }
      }

      // 3. Velocity & Sliding Collision
      if (moveX !== 0 || moveY !== 0) {
        isMoving = true;
        walkCycle += 0.22;

        if (Math.abs(moveX) > Math.abs(moveY)) {
          facing = moveX > 0 ? 'right' : 'left';
        } else {
          facing = moveY > 0 ? 'down' : 'up';
        }

        const nextX = posX + moveX;
        const nextY = posY + moveY;

        if (isPositionValid(nextX, posY, roomType)) posX = nextX;
        if (isPositionValid(posX, nextY, roomType)) posY = nextY;

        playerPosRef.current = { x: posX, y: posY, facing };

        footstepCooldown.current -= 1;
        if (footstepCooldown.current <= 0) {
          soundEngine.playFootstep();
          footstepCooldown.current = 18;
        }
      } else {
        isMoving = false;
        walkCycle = 0;
      }

      // 4. Proximity Detection
      let nearestObj = null;
      let minDistance = 100;

      for (const obj of interactiveObjects) {
        const dist = Math.hypot(obj.x - posX, obj.y - posY);
        if (dist < minDistance) {
          minDistance = dist;
          nearestObj = obj;
        }
      }

      const nearestId = nearestObj ? nearestObj.id : null;
      if (nearestId !== lastProximityIdRef.current) {
        lastProximityIdRef.current = nearestId;
        onObjectProximityChange(nearestObj);
      }

      // ==========================================
      // 5. CANVAS DRAWING
      // ==========================================
      const W = canvas.width;
      const H = canvas.height;
      const wallH = 340;

      ctx.clearRect(0, 0, W, H);

      // --- A. BACK WALL: VICTORIAN WAINSCOTING & DAMASK WALLPAPER ---
      const wallGrad = ctx.createLinearGradient(0, 0, 0, wallH);
      if (roomType === 'drawing_room') {
        wallGrad.addColorStop(0, '#0a0d13');
        wallGrad.addColorStop(0.6, '#131924');
        wallGrad.addColorStop(1, '#18212e');
      } else {
        wallGrad.addColorStop(0, '#090d14');
        wallGrad.addColorStop(0.6, '#111722');
        wallGrad.addColorStop(1, '#15202c');
      }
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, W, wallH);

      // Wainscoting Dado Rail & Panels (Lower Wall)
      const dadoY = wallH - 120;
      ctx.fillStyle = '#221610'; // Dark Polished Mahogany
      ctx.fillRect(0, dadoY, W, 120);

      // Dado rail molding
      ctx.fillStyle = '#3a2318';
      ctx.fillRect(0, dadoY - 4, W, 6);
      ctx.fillStyle = '#4f3020';
      ctx.fillRect(0, dadoY - 6, W, 2);

      // Wainscot recessed wood panels
      for (let px = 40; px < W - 40; px += 105) {
        // Skip behind fireplace
        if (roomType === 'drawing_room' && px >= 480 && px <= 680) continue;
        ctx.fillStyle = '#1b120d';
        ctx.fillRect(px, dadoY + 12, 85, 84);
        ctx.strokeStyle = 'rgba(212, 163, 89, 0.12)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 4, dadoY + 16, 77, 76);
      }

      // Baseboard trim at bottom of wall
      ctx.fillStyle = '#170e0a';
      ctx.fillRect(0, wallH - 24, W, 24);
      ctx.fillStyle = '#382216';
      ctx.fillRect(0, wallH - 24, W, 4);

      // Damask wallpaper vertical subtle stripe pattern on upper wall
      ctx.strokeStyle = 'rgba(212, 163, 89, 0.035)';
      ctx.lineWidth = 1;
      for (let x = 30; x < W; x += 60) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, dadoY - 6);
        ctx.stroke();
      }

      // Brass Wall Sconces with soft gas lamp glow (Drawing Room)
      if (roomType === 'drawing_room') {
        const sconces = [380, 820];
        sconces.forEach((sx) => {
          const sy = 160;
          // Brass fixture
          ctx.fillStyle = '#a67c3b';
          ctx.fillRect(sx - 3, sy, 6, 20);
          ctx.beginPath();
          ctx.arc(sx, sy + 4, 6, 0, Math.PI * 2);
          ctx.fill();

          // Frosted glass shade
          ctx.fillStyle = '#fcecc8';
          ctx.beginPath();
          ctx.ellipse(sx, sy - 8, 8, 12, 0, 0, Math.PI * 2);
          ctx.fill();

          // Warm radiant sconce glow
          const sconceGlow = ctx.createRadialGradient(sx, sy - 8, 2, sx, sy - 8, 55);
          sconceGlow.addColorStop(0, 'rgba(240, 185, 100, 0.28)');
          sconceGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = sconceGlow;
          ctx.beginPath();
          ctx.arc(sx, sy - 8, 55, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // --- B. FLOOR (Herringbone Oak Hardwood & Ornate Carpets) ---
      const floorGrad = ctx.createLinearGradient(0, wallH, 0, H);
      floorGrad.addColorStop(0, '#1c1510');
      floorGrad.addColorStop(0.5, '#140f0c');
      floorGrad.addColorStop(1, '#0e0b09');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, wallH, W, H - wallH);

      // Floor plank lines
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.lineWidth = 1;
      for (let y = wallH; y < H; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // Carpets
      if (roomType === 'drawing_room') {
        ctx.save();
        // Persian Wool Carpet with Shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(355, 425, 490, 200);

        // Rich Burgundy Main Rug
        ctx.fillStyle = '#4e111a';
        ctx.fillRect(360, 420, 480, 195);

        // Intricate Amber Gold Borders & Corner Guard
        ctx.strokeStyle = '#b8893d';
        ctx.lineWidth = 4;
        ctx.strokeRect(368, 428, 464, 179);
        ctx.lineWidth = 1.5;
        ctx.strokeStyle = '#6b1825';
        ctx.strokeRect(375, 435, 450, 165);
        ctx.strokeStyle = 'rgba(212, 163, 89, 0.45)';
        ctx.strokeRect(380, 440, 440, 155);

        // Center Medallion
        ctx.fillStyle = 'rgba(212, 163, 89, 0.18)';
        ctx.beginPath();
        ctx.ellipse(600, 517, 90, 50, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d4a359';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Carpet fringed ends
        ctx.fillStyle = '#d4cbb8';
        for (let fx = 362; fx <= 838; fx += 8) {
          ctx.fillRect(fx, 417, 3, 3);
          ctx.fillRect(fx, 615, 3, 3);
        }
        ctx.restore();
      } else {
        // Grand Library Teal Velvet Runner
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(375, 395, 450, 230);
        ctx.fillStyle = '#162930';
        ctx.fillRect(380, 390, 440, 225);
        ctx.strokeStyle = '#a67c3b';
        ctx.lineWidth = 2.5;
        ctx.strokeRect(388, 398, 424, 209);
        ctx.restore();
      }

      // --- C. GOTHIC WINDOW & WEATHER EFFECTS (RAIN + LIGHTNING) ---
      const winX = roomType === 'drawing_room' ? 240 : 180;
      const winY = 55;
      const winW = 160;
      const winH = 225;

      ctx.save();
      // Arched Gothic top clipping path
      ctx.beginPath();
      ctx.moveTo(winX, winY + 45);
      ctx.quadraticCurveTo(winX + winW / 2, winY - 15, winX + winW, winY + 45);
      ctx.lineTo(winX + winW, winY + winH);
      ctx.lineTo(winX, winY + winH);
      ctx.closePath();
      ctx.clip();

      // Stormy Night Sky with Dynamic Lightning Flash
      const skyGrad = ctx.createLinearGradient(winX, winY, winX, winY + winH);
      const flash = lightningFlashIntensity.current;
      if (flash > 0) {
        skyGrad.addColorStop(0, `rgba(180, 205, 235, ${0.4 + flash * 0.6})`);
        skyGrad.addColorStop(0.5, `rgba(120, 155, 195, ${0.3 + flash * 0.5})`);
        skyGrad.addColorStop(1, `rgba(40, 65, 100, ${0.2 + flash * 0.4})`);
      } else {
        skyGrad.addColorStop(0, '#03050a');
        skyGrad.addColorStop(0.6, '#080f1b');
        skyGrad.addColorStop(1, '#0e1828');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(winX, winY - 20, winW, winH + 30);

      // Rain animation streaks
      ctx.strokeStyle = flash > 0 ? 'rgba(230, 245, 255, 0.7)' : 'rgba(180, 210, 240, 0.35)';
      ctx.lineWidth = 1.2;
      for (const drop of rainDrops.current) {
        drop.y += drop.speed;
        if (drop.y > winH) {
          drop.y = -drop.len;
          drop.x = Math.random() * winW;
        }
        ctx.beginPath();
        ctx.moveTo(winX + drop.x, winY + drop.y);
        ctx.lineTo(winX + drop.x - 3, winY + drop.y + drop.len);
        ctx.stroke();
      }
      ctx.restore();

      // Stone Window Frame, Stone Sill & Leaded Mullions
      ctx.strokeStyle = '#2d1d13';
      ctx.lineWidth = 8;
      ctx.strokeRect(winX - 2, winY + 30, winW + 4, winH - 28);
      // Stone Sill
      ctx.fillStyle = '#3a2519';
      ctx.fillRect(winX - 8, winY + winH - 2, winW + 16, 14);
      // Dark leaded mullion bars
      ctx.strokeStyle = '#18100b';
      ctx.lineWidth = 3;
      ctx.beginPath();
      ctx.moveTo(winX + winW / 2, winY + 20);
      ctx.lineTo(winX + winW / 2, winY + winH);
      ctx.moveTo(winX, winY + winH / 2);
      ctx.lineTo(winX + winW, winY + winH / 2);
      ctx.moveTo(winX, winY + (winH * 0.75));
      ctx.lineTo(winX + winW, winY + (winH * 0.75));
      ctx.stroke();

      // Lightning beam cast on the room floor during flash
      if (flash > 0.05) {
        ctx.save();
        ctx.fillStyle = `rgba(180, 215, 250, ${flash * 0.12})`;
        ctx.beginPath();
        ctx.moveTo(winX, wallH);
        ctx.lineTo(winX + winW, wallH);
        ctx.lineTo(winX + winW + 140, H);
        ctx.lineTo(winX - 60, H);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // --- D. DRAWING ROOM SPECIFIC STRUCTURES ---
      if (roomType === 'drawing_room') {
        // 1. Grand Limestone Carved Fireplace (Center)
        const fpX = 520;
        const fpY = 165;
        const fpW = 160;
        const fpH = 175;

        // Cast shadow behind hearth
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(fpX - 24, fpY, fpW + 48, fpH);

        // Limestone Mantel Surround
        ctx.fillStyle = '#2b211d';
        ctx.fillRect(fpX - 16, fpY, fpW + 32, fpH);
        // Molded mantelpiece top shelf
        ctx.fillStyle = '#4a3229';
        ctx.fillRect(fpX - 28, fpY, fpW + 56, 18);
        ctx.fillStyle = '#614135';
        ctx.fillRect(fpX - 28, fpY, fpW + 56, 4);

        // Firebox chamber (black soot interior)
        ctx.fillStyle = '#080606';
        ctx.fillRect(fpX + 16, fpY + 34, fpW - 32, fpH - 34);

        // Hearthstone floor apron
        ctx.fillStyle = '#221915';
        ctx.fillRect(fpX - 8, wallH - 8, fpW + 16, 32);
        ctx.strokeStyle = '#3e2a22';
        ctx.strokeRect(fpX - 8, wallH - 8, fpW + 16, 32);

        // Dynamic Hearth Light Flicker & Ember Bed
        const flicker = Math.sin(flameTime.current * 12) * 0.15 + Math.cos(flameTime.current * 19) * 0.1;
        const fireBaseX = fpX + fpW / 2;
        const fireBaseY = fpY + fpH - 4;

        // Dynamic Firelight Cast on Floor & Wall Surfaces
        const flameGlow = ctx.createRadialGradient(
          fireBaseX, fireBaseY, 15,
          fireBaseX, fireBaseY, 320 + flicker * 60
        );
        flameGlow.addColorStop(0, 'rgba(255, 145, 45, 0.42)');
        flameGlow.addColorStop(0.3, 'rgba(225, 105, 25, 0.22)');
        flameGlow.addColorStop(0.7, 'rgba(165, 60, 20, 0.06)');
        flameGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = flameGlow;
        ctx.fillRect(fireBaseX - 350, fireBaseY - 280, 700, 560);

        // Burning Fireplace Logs & Coal Grate
        ctx.fillStyle = '#1c120c';
        ctx.fillRect(fireBaseX - 35, fireBaseY - 10, 70, 10);
        // Brass fire dogs
        ctx.fillStyle = '#a67c3b';
        ctx.fillRect(fireBaseX - 36, fireBaseY - 14, 6, 14);
        ctx.fillRect(fireBaseX + 30, fireBaseY - 14, 6, 14);

        // Multi-layered animated flames
        // Outer Orange Flame
        ctx.fillStyle = '#e85d04';
        ctx.beginPath();
        ctx.moveTo(fireBaseX - 30, fireBaseY);
        ctx.quadraticCurveTo(fireBaseX - 16, fireBaseY - 45 + flicker * 15, fireBaseX - 4, fireBaseY - 65 + flicker * 18);
        ctx.quadraticCurveTo(fireBaseX + 8, fireBaseY - 42 + flicker * 12, fireBaseX + 30, fireBaseY);
        ctx.fill();

        // Mid Amber Flame
        ctx.fillStyle = '#f77f00';
        ctx.beginPath();
        ctx.moveTo(fireBaseX - 22, fireBaseY);
        ctx.quadraticCurveTo(fireBaseX - 8, fireBaseY - 38 + flicker * 10, fireBaseX + 2, fireBaseY - 52 + flicker * 12);
        ctx.quadraticCurveTo(fireBaseX + 12, fireBaseY - 30 + flicker * 8, fireBaseX + 22, fireBaseY);
        ctx.fill();

        // Inner White-Yellow Flame Core
        ctx.fillStyle = '#ffdf78';
        ctx.beginPath();
        ctx.moveTo(fireBaseX - 12, fireBaseY);
        ctx.quadraticCurveTo(fireBaseX - 3, fireBaseY - 24 + flicker * 6, fireBaseX + 1, fireBaseY - 32 + flicker * 8);
        ctx.quadraticCurveTo(fireBaseX + 5, fireBaseY - 18 + flicker * 4, fireBaseX + 12, fireBaseY);
        ctx.fill();

        // Floating fireplace ember particles rising upward
        for (const emb of embers.current) {
          emb.x += emb.speedX;
          emb.y += emb.speedY;
          emb.life += 1;
          if (emb.life > emb.maxLife || emb.y < fpY + 20) {
            emb.x = fireBaseX + (Math.random() - 0.5) * 50;
            emb.y = fireBaseY - 10;
            emb.life = 0;
          }
          const embAlpha = 1 - (emb.life / emb.maxLife);
          ctx.fillStyle = `rgba(255, 170, 50, ${embAlpha * 0.8})`;
          ctx.beginPath();
          ctx.arc(emb.x, emb.y, emb.size, 0, Math.PI * 2);
          ctx.fill();
        }

        // 2. Oil Portrait of Lord Harrington above Fireplace
        const portX = 548;
        const portY = 60;
        // Gilded Ornate Baroque Frame
        ctx.fillStyle = '#b8893d';
        ctx.fillRect(portX - 6, portY - 6, 112, 94);
        ctx.fillStyle = '#8f6828';
        ctx.strokeRect(portX - 4, portY - 4, 108, 90);
        // Dark Canvas Background
        ctx.fillStyle = '#141010';
        ctx.fillRect(portX, portY, 100, 82);
        // Moody Silhouette of Lord Harrington
        ctx.fillStyle = '#0c0a0a';
        ctx.beginPath();
        ctx.arc(portX + 50, portY + 32, 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(portX + 25, portY + 48, 50, 32);
        // White Victorian cravat neckpiece
        ctx.fillStyle = '#dedad2';
        ctx.beginPath();
        ctx.moveTo(portX + 46, portY + 46);
        ctx.lineTo(portX + 54, portY + 46);
        ctx.lineTo(portX + 50, portY + 54);
        ctx.fill();
        // Brass Nameplate
        ctx.fillStyle = '#d4a359';
        ctx.fillRect(portX + 26, portY + 76, 48, 8);
        ctx.fillStyle = '#111';
        ctx.fillRect(portX + 30, portY + 79, 40, 2);

        // 3. Roll-Top Mahogany Writing Desk (Left)
        const deskX = 160;
        const deskY = 410;
        ctx.save();
        // Cast shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(deskX + 8, deskY + 68, 194, 20);

        // Desk body
        ctx.fillStyle = '#331c13';
        ctx.fillRect(deskX, deskY, 190, 78);
        // Slanted Roll-Top Tambour Cover
        ctx.fillStyle = '#42251a';
        ctx.fillRect(deskX - 4, deskY - 14, 198, 24);
        ctx.fillStyle = '#593424';
        ctx.fillRect(deskX - 6, deskY - 18, 202, 6);

        // Inlaid green leather writing surface
        ctx.fillStyle = '#1c3326';
        ctx.fillRect(deskX + 16, deskY + 12, 158, 22);

        // Desk Drawers & Brass Handles
        ctx.strokeStyle = '#22120b';
        ctx.lineWidth = 2;
        ctx.strokeRect(deskX + 12, deskY + 38, 72, 18);
        ctx.strokeRect(deskX + 12, deskY + 58, 72, 18);
        ctx.strokeRect(deskX + 106, deskY + 38, 72, 18);
        ctx.strokeRect(deskX + 106, deskY + 58, 72, 18);

        // Brass drawer bail handles
        ctx.fillStyle = '#d4a359';
        ctx.fillRect(deskX + 42, deskY + 45, 12, 4);
        ctx.fillRect(deskX + 42, deskY + 65, 12, 4);
        ctx.fillRect(deskX + 136, deskY + 45, 12, 4);
        ctx.fillRect(deskX + 136, deskY + 65, 12, 4);

        // Banker's Reading Lamp with Green Glass Hood
        ctx.fillStyle = '#1d5e3c'; // Emerald glass shade
        ctx.fillRect(deskX + 22, deskY - 32, 34, 12);
        ctx.fillStyle = '#d4a359'; // Brass stand
        ctx.fillRect(deskX + 37, deskY - 20, 4, 14);
        ctx.beginPath();
        ctx.ellipse(deskX + 39, deskY - 6, 9, 4, 0, 0, Math.PI * 2);
        ctx.fill();

        // Gentle downward pool of light on the desk
        const deskLampGlow = ctx.createRadialGradient(deskX + 39, deskY - 22, 6, deskX + 39, deskY + 14, 52);
        deskLampGlow.addColorStop(0, 'rgba(255, 230, 150, 0.32)');
        deskLampGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = deskLampGlow;
        ctx.beginPath();
        ctx.arc(deskX + 39, deskY + 10, 52, 0, Math.PI * 2);
        ctx.fill();

        // Quill & Inkwell
        ctx.fillStyle = '#1a1a1a';
        ctx.fillRect(deskX + 155, deskY - 8, 8, 8);
        ctx.strokeStyle = '#e6ded2';
        ctx.lineWidth = 1.5;
        ctx.beginPath();
        ctx.moveTo(deskX + 159, deskY - 8);
        ctx.lineTo(deskX + 170, deskY - 24);
        ctx.stroke();
        ctx.restore();

        // 4. Velvet Chesterfield Settee & Side Table (Right)
        const sofaX = 780;
        const sofaY = 450;
        ctx.save();
        // Cast shadow
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(sofaX + 6, sofaY + 70, 184, 25);

        // Chesterfield Backrest & Rolled Arms
        ctx.fillStyle = '#40111a';
        ctx.fillRect(sofaX, sofaY, 176, 46);
        // Seat cushion
        ctx.fillStyle = '#591624';
        ctx.fillRect(sofaX - 4, sofaY + 34, 184, 38);

        // Deep button-tufting diamond highlights
        ctx.fillStyle = '#26080e';
        const tufts = [
          { x: sofaX + 35, y: sofaY + 18 },
          { x: sofaX + 70, y: sofaY + 18 },
          { x: sofaX + 105, y: sofaY + 18 },
          { x: sofaX + 140, y: sofaY + 18 },
          { x: sofaX + 52, y: sofaY + 30 },
          { x: sofaX + 87, y: sofaY + 30 },
          { x: sofaX + 122, y: sofaY + 30 }
        ];
        tufts.forEach(t => {
          ctx.beginPath();
          ctx.arc(t.x, t.y, 2.5, 0, Math.PI * 2);
          ctx.fill();
        });

        // Carved walnut legs
        ctx.fillStyle = '#22140e';
        ctx.fillRect(sofaX + 4, sofaY + 72, 8, 12);
        ctx.fillRect(sofaX + 164, sofaY + 72, 8, 12);

        // Antique Side Table & Silver Tray
        const tblX = sofaX - 48;
        const tblY = sofaY + 16;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
        ctx.fillRect(tblX + 4, tblY + 38, 36, 12);
        ctx.fillStyle = '#2b1a13';
        ctx.fillRect(tblX, tblY, 38, 44);
        ctx.fillStyle = '#44291e';
        ctx.fillRect(tblX - 3, tblY - 3, 44, 7);

        // Silver salver tray & faceted beverage goblet
        ctx.fillStyle = '#b0b8c4';
        ctx.fillRect(tblX + 8, tblY - 5, 22, 3);
        ctx.fillStyle = '#e2e7ed';
        ctx.fillRect(tblX + 15, tblY - 17, 8, 12);
        ctx.fillRect(tblX + 18, tblY - 5, 2, 4);
        ctx.restore();

        // 5. Heavy Double Doorway to Grand Library (Right Wall)
        const doorX = 1040;
        const doorY = 160;
        ctx.fillStyle = '#21130d';
        ctx.fillRect(doorX, doorY, 90, 180);
        ctx.strokeStyle = '#3e2418';
        ctx.lineWidth = 4;
        ctx.strokeRect(doorX, doorY, 90, 180);
        ctx.strokeRect(doorX + 8, doorY + 12, 34, 156);
        ctx.strokeRect(doorX + 48, doorY + 12, 34, 156);
        // Brass Knob & Keyhole Plate
        ctx.fillStyle = '#d4a359';
        ctx.fillRect(doorX + 42, doorY + 90, 8, 16);
        ctx.beginPath();
        ctx.arc(doorX + 46, doorY + 94, 4, 0, Math.PI * 2);
        ctx.fill();

      } else {
        // --- E. GRAND LIBRARY SPECIFIC STRUCTURES ---
        // Towering Multi-Tier Dark Oak Bookcases along back wall
        ctx.fillStyle = '#221711';
        ctx.fillRect(55, 45, 410, wallH - 55);
        ctx.fillRect(715, 45, 350, wallH - 55);

        // Gothic Arched Cornice along top
        ctx.fillStyle = '#352217';
        ctx.fillRect(50, 38, 420, 14);
        ctx.fillRect(710, 38, 360, 14);

        // Leather-bound book spines with gold band detailing
        const bookTones = ['#731c2b', '#1b4a50', '#a87938', '#2d452d', '#3d2b20', '#592036'];
        for (let row = 68; row < wallH - 65; row += 42) {
          ctx.fillStyle = '#3a251a';
          ctx.fillRect(55, row, 410, 6);
          ctx.fillRect(715, row, 350, 6);

          // Left Bookcase Section
          for (let bx = 65; bx < 455; bx += 14) {
            const hVar = ((bx * 7) % 8);
            ctx.fillStyle = bookTones[(bx + row) % bookTones.length];
            ctx.fillRect(bx, row - 30 + hVar, 11, 30 - hVar);
            // Gold spine band
            ctx.fillStyle = 'rgba(212, 163, 89, 0.45)';
            ctx.fillRect(bx, row - 22 + hVar, 11, 2);
            ctx.fillRect(bx, row - 12 + hVar, 11, 2);
          }

          // Right Bookcase Section
          for (let bx = 725; bx < 1055; bx += 14) {
            const hVar = ((bx * 11) % 8);
            ctx.fillStyle = bookTones[(bx + row) % bookTones.length];
            ctx.fillRect(bx, row - 30 + hVar, 11, 30 - hVar);
            ctx.fillStyle = 'rgba(212, 163, 89, 0.45)';
            ctx.fillRect(bx, row - 22 + hVar, 11, 2);
            ctx.fillRect(bx, row - 12 + hVar, 11, 2);
          }
        }

        // Brass Rolling Ladder leaning against shelving
        const ladderX = 410;
        ctx.save();
        ctx.strokeStyle = '#b8893d';
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(ladderX, 48);
        ctx.lineTo(ladderX + 28, wallH + 45);
        ctx.moveTo(ladderX + 24, 48);
        ctx.lineTo(ladderX + 52, wallH + 45);
        ctx.stroke();
        // Rungs
        for (let ry = 75; ry < wallH + 30; ry += 28) {
          const rx = ladderX + ((ry - 48) / (wallH + 45 - 48)) * 28;
          ctx.beginPath();
          ctx.moveTo(rx, ry);
          ctx.lineTo(rx + 24, ry);
          ctx.stroke();
        }
        ctx.restore();

        // Curator's Reading Table (Center)
        const tblX = 460;
        const tblY = 415;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(tblX + 10, tblY + 72, 280, 25);
        ctx.fillStyle = '#2b1b12';
        ctx.fillRect(tblX, tblY, 275, 82);

        // Green Baize Cloth Inlay
        ctx.fillStyle = '#163323';
        ctx.fillRect(tblX + 14, tblY + 8, 247, 66);
        ctx.strokeStyle = '#a67c3b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tblX + 14, tblY + 8, 247, 66);

        // Open Leather-bound Folio / Ledger
        ctx.fillStyle = '#f4eedb';
        ctx.fillRect(tblX + 90, tblY + 20, 95, 42);
        ctx.fillStyle = '#422416';
        ctx.fillRect(tblX + 86, tblY + 18, 103, 4);
        ctx.strokeStyle = '#aba191';
        ctx.lineWidth = 1;
        // Handwritten lines
        for (let ly = tblY + 26; ly < tblY + 56; ly += 6) {
          ctx.beginPath();
          ctx.moveTo(tblX + 94, ly);
          ctx.lineTo(tblX + 135, ly);
          ctx.moveTo(tblX + 142, ly);
          ctx.lineTo(tblX + 180, ly);
          ctx.stroke();
        }

        // Brass Magnifying Glass on Desk
        ctx.strokeStyle = '#d4a359';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(tblX + 210, tblY + 36, 10, 0, Math.PI * 2);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(tblX + 217, tblY + 43);
        ctx.lineTo(tblX + 228, tblY + 54);
        ctx.stroke();

        // Table Gooseneck Lamp
        ctx.fillStyle = '#2a6b48';
        ctx.fillRect(tblX + 35, tblY + 22, 24, 10);
        ctx.fillStyle = '#d4a359';
        ctx.fillRect(tblX + 45, tblY + 32, 4, 14);
        ctx.restore();

        // Grandfather Clock with Harmonic Swinging Pendulum (Right)
        const clkX = 840;
        const clkY = 175;
        ctx.save();
        // Clock walnut case
        ctx.fillStyle = '#2e1c12';
        ctx.fillRect(clkX, clkY, 58, 170);
        ctx.fillStyle = '#472c1c';
        ctx.fillRect(clkX - 4, clkY - 6, 66, 12);
        ctx.fillRect(clkX - 4, clkY + 164, 66, 10);

        // Clock Dial Face
        ctx.fillStyle = '#f2ebd9';
        ctx.beginPath();
        ctx.arc(clkX + 29, clkY + 34, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b8893d';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Hands & Hour Markers
        ctx.fillStyle = '#111';
        ctx.fillRect(clkX + 28, clkY + 22, 2, 12); // Minute hand
        ctx.fillRect(clkX + 28, clkY + 33, 9, 2);  // Hour hand

        // Glass Pendulum Window & Harmonic Brass Pendulum
        ctx.fillStyle = '#0a0705';
        ctx.fillRect(clkX + 12, clkY + 68, 34, 88);
        ctx.strokeStyle = '#613e28';
        ctx.lineWidth = 2;
        ctx.strokeRect(clkX + 12, clkY + 68, 34, 88);

        // Swinging Pendulum (oscillation with flameTime)
        const swingAngle = Math.sin(flameTime.current * 2.2) * 9;
        const pendPivotX = clkX + 29;
        const pendPivotY = clkY + 74;
        const pendBobX = pendPivotX + swingAngle;
        const pendBobY = clkY + 134;

        ctx.strokeStyle = '#d4a359';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(pendPivotX, pendPivotY);
        ctx.lineTo(pendBobX, pendBobY);
        ctx.stroke();
        // Brass bob
        ctx.fillStyle = '#e6b86e';
        ctx.beginPath();
        ctx.arc(pendBobX, pendBobY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Doorway leading back to Drawing Room (Left Wall)
        const doorX = 65;
        const doorY = 160;
        ctx.fillStyle = '#21130d';
        ctx.fillRect(doorX, doorY, 80, 180);
        ctx.strokeStyle = '#3e2418';
        ctx.lineWidth = 4;
        ctx.strokeRect(doorX, doorY, 80, 180);
        ctx.fillStyle = '#d4a359';
        ctx.beginPath();
        ctx.arc(doorX + 68, doorY + 95, 5, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- F. HANDCRAFTED VICTORIAN RETICLES & INSPECTION SEALS ---
      for (const obj of interactiveObjects) {
        const isExamined = examinedObjectIds.has(obj.id);
        const distToPlayer = Math.hypot(obj.x - posX, obj.y - posY);
        const isNear = distToPlayer < 100;

        ctx.save();
        const pulse = Math.sin(flameTime.current * 4) * 2.5;

        if (isExamined) {
          // Desaturated Antique Teal Archival Seal
          ctx.strokeStyle = '#72cbcf';
          ctx.lineWidth = 2;
          ctx.fillStyle = 'rgba(46, 107, 114, 0.35)';
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, 16, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Wax seal ring notches
          ctx.strokeStyle = 'rgba(114, 203, 207, 0.45)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, 20, 0, Math.PI * 2);
          ctx.stroke();

          // Checkmark
          ctx.fillStyle = '#a8e6e8';
          ctx.font = 'bold 13px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✓', obj.x, obj.y);

        } else if (isNear) {
          // Approaching: Concentric Brass Compass Reticle with Cardinal Ticks
          const radius = 22 + pulse;
          ctx.strokeStyle = '#e6b86e';
          ctx.lineWidth = 2;
          ctx.fillStyle = 'rgba(212, 163, 89, 0.28)';
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, radius, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Cardinal compass ticks
          ctx.strokeStyle = '#ffdf88';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(obj.x, obj.y - radius - 4);
          ctx.lineTo(obj.x, obj.y - radius + 3);
          ctx.moveTo(obj.x, obj.y + radius - 3);
          ctx.lineTo(obj.x, obj.y + radius + 4);
          ctx.moveTo(obj.x - radius - 4, obj.y);
          ctx.lineTo(obj.x - radius + 3, obj.y);
          ctx.moveTo(obj.x + radius - 3, obj.y);
          ctx.lineTo(obj.x + radius + 4, obj.y);
          ctx.stroke();

          // Center Star
          ctx.fillStyle = '#ffeaad';
          ctx.font = '12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✦', obj.x, obj.y);

          // Vintage Engraved Tooltip Banner
          ctx.fillStyle = '#0a0d13';
          ctx.strokeStyle = '#d4a359';
          ctx.lineWidth = 1;
          const label = `[E] ${obj.title}`;
          const textW = ctx.measureText(label).width + 24;
          ctx.fillRect(obj.x - textW / 2, obj.y - 44, textW, 24);
          ctx.strokeRect(obj.x - textW / 2, obj.y - 44, textW, 24);

          ctx.fillStyle = '#f5efe6';
          ctx.font = 'bold 11px monospace';
          ctx.fillText(label, obj.x, obj.y - 32);

        } else {
          // Distant Ambient Marker (Restrained Brass Dot)
          ctx.strokeStyle = 'rgba(212, 163, 89, 0.4)';
          ctx.fillStyle = 'rgba(212, 163, 89, 0.12)';
          ctx.lineWidth = 1.5;
          ctx.beginPath();
          ctx.arc(obj.x, obj.y, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#d4a359';
          ctx.font = '10px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✦', obj.x, obj.y);
        }
        ctx.restore();
      }

      // --- G. DETECTIVE AVATAR (Handcrafted Victorian Silhouette) ---
      ctx.save();
      // Elliptical Floor Shadow with Depth
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(posX, posY + 4, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      const walkOffset = isMoving ? Math.sin(walkCycle) * 3 : 0;
      const detY = posY - 48 + walkOffset;

      // Shoes & Trousers
      ctx.fillStyle = '#101217';
      if (isMoving) {
        const legSwing = Math.sin(walkCycle) * 5;
        ctx.fillRect(posX - 7 + legSwing, posY - 10, 5, 12);
        ctx.fillRect(posX + 2 - legSwing, posY - 10, 5, 12);
      } else {
        ctx.fillRect(posX - 6, posY - 10, 5, 12);
        ctx.fillRect(posX + 2, posY - 10, 5, 12);
      }

      // Heavy Charcoal Wool Trenchcoat Silhouette
      ctx.fillStyle = '#23201d';
      ctx.beginPath();
      ctx.moveTo(posX - 10, detY + 16);
      ctx.lineTo(posX + 10, detY + 16);
      // Coat flare
      const coatSway = isMoving ? Math.sin(walkCycle) * 2 : 0;
      ctx.lineTo(posX + 14 + coatSway, detY + 44);
      ctx.lineTo(posX - 14 + coatSway, detY + 44);
      ctx.closePath();
      ctx.fill();

      // Trenchcoat Lapels & Center Seam
      ctx.fillStyle = '#1a1815';
      ctx.beginPath();
      ctx.moveTo(posX - 6, detY + 16);
      ctx.lineTo(posX, detY + 30);
      ctx.lineTo(posX + 6, detY + 16);
      ctx.fill();

      // Belt with Brass Buckle
      ctx.fillStyle = '#171512';
      ctx.fillRect(posX - 12, detY + 29, 24, 4);
      ctx.fillStyle = '#b8893d';
      ctx.fillRect(posX - 2, detY + 29, 4, 4);

      // Sleeves
      ctx.fillStyle = '#23201d';
      ctx.fillRect(posX - 13, detY + 18, 5, 18);
      ctx.fillRect(posX + 8, detY + 18, 5, 18);

      // Head & Classic Detective Fedora
      ctx.fillStyle = '#ecd2b9';
      ctx.beginPath();
      ctx.arc(posX, detY + 8, 8, 0, Math.PI * 2);
      ctx.fill();

      // Fedora Felt & Burgundy Ribbon Band
      ctx.fillStyle = '#161311';
      ctx.fillRect(posX - 15, detY + 3, 30, 4); // Wide Brim
      ctx.fillRect(posX - 9, detY - 6, 18, 10); // Crown
      ctx.fillStyle = '#7a1f31'; // Burgundy Silk Hatband
      ctx.fillRect(posX - 9, detY + 1, 18, 2);

      // Subtle directional look
      if (facing === 'left') {
        ctx.fillStyle = '#110f0d';
        ctx.fillRect(posX - 8, detY - 2, 4, 3);
      } else if (facing === 'right') {
        ctx.fillStyle = '#110f0d';
        ctx.fillRect(posX + 4, detY - 2, 4, 3);
      }
      ctx.restore();

      // --- H. AMBIENT DUST MOTES (Warm Amber Drift) ---
      ctx.fillStyle = 'rgba(230, 184, 110, 0.3)';
      for (const p of particles.current) {
        p.x += p.speedX;
        p.y += p.speedY;
        if (p.x < 0) p.x = W;
        if (p.x > W) p.x = 0;
        if (p.y < 0) p.y = H;
        if (p.y > H) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
      }

      // --- I. CINEMATIC VIGNETTE & ROOM ENTRY FADE ---
      const vigGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 0.7);
      vigGrad.addColorStop(0, 'transparent');
      vigGrad.addColorStop(1, 'rgba(3, 5, 8, 0.7)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, W, H);

      // Smooth room entry transition fade
      if (roomEntryAlpha.current < 1) {
        ctx.fillStyle = `rgba(5, 7, 10, ${1 - roomEntryAlpha.current})`;
        ctx.fillRect(0, 0, W, H);
      }

      animFrameId.current = requestAnimationFrame(render);
    };

    animFrameId.current = requestAnimationFrame(render);

    return () => {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [roomType, interactiveObjects, examinedObjectIds, onObjectClick, onObjectProximityChange, isPositionValid]);

  // Click on Canvas: Walk or Click Object
  const handleCanvasClick = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.clientX) * scaleX;
    const clickY = (e.clientY - rect.clientY) * scaleY;

    // 1. Check if clicked on an interactive object or its vicinity
    const clickedObj = findClickedObject(clickX, clickY);

    if (clickedObj) {
      const { x: posX, y: posY } = playerPosRef.current;
      const dist = Math.hypot(clickedObj.x - posX, clickedObj.y - posY);

      if (dist < 110) {
        onObjectClick(clickedObj);
      } else {
        const walkTarget = clickedObj.walkTo || {
          x: clickedObj.x,
          y: Math.min(640, Math.max(360, clickedObj.y + 40))
        };
        targetPosRef.current = walkTarget;
        pendingActionRef.current = clickedObj;
      }
      return;
    }

    // 2. Otherwise: Click-to-Move destination within room floor bounds
    const minX = 75;
    const maxX = 1125;
    const minY = 330;
    const maxY = 660;

    const clampedX = Math.max(minX, Math.min(maxX, clickX));
    const clampedY = Math.max(minY, Math.min(maxY, clickY));

    if (isPositionValid(clampedX, clampedY, roomType)) {
      targetPosRef.current = { x: clampedX, y: clampedY };
      pendingActionRef.current = null;
    }
  };

  return (
    <div className="room-canvas-container">
      <canvas
        ref={canvasRef}
        width={1200}
        height={700}
        className="room-interactive-canvas"
        onClick={handleCanvasClick}
        aria-label={`Interactive 2.5D view of ${roomType === 'drawing_room' ? 'Gilded Drawing Room' : 'Grand Library'}`}
      />
    </div>
  );
}
