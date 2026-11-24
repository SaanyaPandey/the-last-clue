import React, { useRef, useEffect, useCallback } from 'react';
import { soundEngine } from './SoundEngine';
import { useLanguage } from '../localization/LanguageContext';

/**
 * THE LAST CLUE — 2.5D Handcrafted Illustrated Room Engine
 *
 * Immersive Victorian detective adventure aesthetic:
 * - Rich hand-painted environments with organic shapes, wood grain, moldings, and depth.
 * - Distinct environments for each case theme:
 *   * Heritage Manor Study / Drawing Room
 *   * School Trophy Hall & Principal's Office
 *   * Junior Science Laboratory & Chem Demo Bench
 *   * Exhibition Hall & Participant Vault
 *   * Grand Library & Rare Manuscript Archives
 * - Detective character with proper human proportions, tailored trenchcoat, fedora,
 *   natural walking stride, idle breathing, and directional lantern/glass lighting.
 * - Elegant detective-themed clue indicators:
 *   * Ornate brass magnifying glass badge with clue count (e.g. [ 🔍 1 Clue ] / [ 🔍 1 Saboot ])
 *   * Hover / approach warm volumetric spotlight and [E] Examine prompt
 *   * Antique emerald archival seal with checkmark ([ ✓ Completed ] / [ ✓ Dekh Liya ])
 *   * Directional passageway plaque for doors
 * - Full controls preservation: WASD / Arrow keys, click-to-move, pointer drag with golden tether.
 */
export default function RoomEngine({
  roomType = 'drawing_room',
  initialPos = { x: 500, y: 520, facing: 'down' },
  interactiveObjects = [],
  examinedObjectIds = new Set(),
  controlMode = 'both', // 'both' | 'keyboard' | 'mouse'
  onObjectClick,
  onObjectProximityChange
}) {
  const canvasRef = useRef(null);
  const keysPressed = useRef({});
  const playerPosRef = useRef({ x: initialPos.x, y: initialPos.y, facing: initialPos.facing || 'down' });
  const targetPosRef = useRef(null);
  const pendingActionRef = useRef(null);
  const lastProximityIdRef = useRef(null);
  const isDraggingPlayerRef = useRef(false);
  const activePointerIdRef = useRef(null);
  const dragPointerPosRef = useRef(null);
  const isHoveringPlayerRef = useRef(false);
  const justFinishedDragRef = useRef(false);
  const lastDragEndTimeRef = useRef(0);
  const animFrameId = useRef(null);
  const particles = useRef([]);
  const rainDrops = useRef([]);
  const embers = useRef([]);
  const flameTime = useRef(0);
  const footstepCooldown = useRef(0);
  const lightningCooldown = useRef(420);
  const lightningFlashIntensity = useRef(0);
  const roomEntryAlpha = useRef(1);

  const { language } = useLanguage() || { language: 'hinglish' };

  // Sync player position & trigger room entry fade on room change
  useEffect(() => {
    playerPosRef.current = { x: initialPos.x, y: initialPos.y, facing: initialPos.facing || 'down' };
    targetPosRef.current = null;
    pendingActionRef.current = null;
    lastProximityIdRef.current = null;
    isDraggingPlayerRef.current = false;
    activePointerIdRef.current = null;
    dragPointerPosRef.current = null;
    isHoveringPlayerRef.current = false;
    roomEntryAlpha.current = 0;
  }, [roomType, initialPos.x, initialPos.y, initialPos.facing]);

  // Window blur listener to safely cancel drag and clear pressed keys
  useEffect(() => {
    const handleBlur = () => {
      isDraggingPlayerRef.current = false;
      activePointerIdRef.current = null;
      dragPointerPosRef.current = null;
      keysPressed.current = {};
      if (canvasRef.current) {
        canvasRef.current.style.cursor = 'default';
      }
    };

    window.addEventListener('blur', handleBlur);
    return () => window.removeEventListener('blur', handleBlur);
  }, []);

  // Initialize room atmospheric particles (dust motes, rain, and fireplace embers)
  useEffect(() => {
    particles.current = Array.from({ length: 42 }, () => ({
      x: Math.random() * 1200,
      y: Math.random() * 700,
      size: Math.random() * 2.2 + 0.8,
      speedX: (Math.random() - 0.5) * 0.35,
      speedY: (Math.random() - 0.5) * 0.25 - 0.1,
      alpha: Math.random() * 0.45 + 0.15
    }));

    rainDrops.current = Array.from({ length: 55 }, () => ({
      x: Math.random() * 280,
      y: Math.random() * 300,
      len: Math.random() * 15 + 10,
      speed: Math.random() * 5 + 8,
      alpha: Math.random() * 0.4 + 0.25
    }));

    embers.current = Array.from({ length: 24 }, () => ({
      x: 580 + (Math.random() - 0.5) * 80,
      y: 310 + Math.random() * 20,
      size: Math.random() * 2 + 1,
      speedX: (Math.random() - 0.5) * 0.8,
      speedY: -(Math.random() * 1.3 + 0.8),
      life: Math.random() * 45 + 10,
      maxLife: 55
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

    const isSecondary =
      room === 'library' ||
      room === 'school_library' ||
      room === 'exhibition_hall' ||
      room === 'secret_vault' ||
      room === 'rare_archives';

    const obstacles = !isSecondary
      ? [
        { x1: 480, y1: 290, x2: 720, y2: 370 }, // Center showcase / hearth / workbench
        { x1: 140, y1: 395, x2: 370, y2: 490 }, // Left desk / chalkboard
        { x1: 740, y1: 440, x2: 990, y2: 550 }, // Right table / settee / cabinet
        { x1: 50, y1: 290, x2: 135, y2: 430 }   // Left column / cabinet
      ]
      : [
        { x1: 430, y1: 390, x2: 770, y2: 520 }, // Center table / podium
        { x1: 130, y1: 300, x2: 320, y2: 430 }, // Left filing / storage cabinet
        { x1: 820, y1: 270, x2: 940, y2: 390 }, // Clock / display
        { x1: 930, y1: 470, x2: 1060, y2: 570 } // Right locker / shelf
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

  // Check if pointer coordinates hit the detective character avatar
  const isPointerOnPlayer = useCallback((clickX, clickY) => {
    const { x: posX, y: posY } = playerPosRef.current;
    const dx = clickX - posX;
    const dy = clickY - (posY - 26);
    return (dx * dx) / (52 * 52) + (dy * dy) / (64 * 64) <= 1.0;
  }, []);

  // Calculate unexamined clue count for an object
  const getObjectClueCount = useCallback((obj) => {
    if (obj.isDoor) return 0;
    if (examinedObjectIds.has(obj.id)) return 0;
    if (Array.isArray(obj.clues) && obj.clues.length > 0) {
      return obj.clues.length;
    }
    if (obj.matchedClue) return 1;
    return 0;
  }, [examinedObjectIds]);

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
        lightningFlashIntensity.current = 1.0;
        lightningCooldown.current = Math.floor(Math.random() * 400 + 480);
      }
      if (lightningFlashIntensity.current > 0) {
        lightningFlashIntensity.current = Math.max(0, lightningFlashIntensity.current - 0.06);
      }

      let { x: posX, y: posY, facing } = playerPosRef.current;
      let isMoving = false;

      // 1. Process Movement Inputs (Keyboard)
      let moveX = 0;
      let moveY = 0;
      const speed = 3.8;

      const allowKeyboard = controlMode === 'both' || controlMode === 'keyboard';
      if (allowKeyboard) {
        if (keysPressed.current['w'] || keysPressed.current['arrowup']) moveY -= speed;
        if (keysPressed.current['s'] || keysPressed.current['arrowdown']) moveY += speed;
        if (keysPressed.current['a'] || keysPressed.current['arrowleft']) moveX -= speed;
        if (keysPressed.current['d'] || keysPressed.current['arrowright']) moveX += speed;
      }

      // 2. Process Mouse Hold & Drag Movement
      const allowMouse = controlMode === 'both' || controlMode === 'mouse';
      if (allowMouse && isDraggingPlayerRef.current && dragPointerPosRef.current) {
        const targetFeetX = dragPointerPosRef.current.x;
        const targetFeetY = dragPointerPosRef.current.y;
        const dx = targetFeetX - posX;
        const dy = targetFeetY - posY;
        const dist = Math.hypot(dx, dy);

        if (dist > 8) {
          const stepSpeed = Math.min(speed * 1.25, Math.max(2.5, dist * 0.15));
          moveX = (dx / dist) * Math.min(speed, stepSpeed);
          moveY = (dy / dist) * Math.min(speed, stepSpeed);
        } else {
          moveX = 0;
          moveY = 0;
        }
      } else if (!isDraggingPlayerRef.current && targetPosRef.current) {
        // 3. Process Click-to-Move
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

      // 4. Velocity & Sliding Collision
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

      // 5. Proximity Detection
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
      // CANVAS RENDERING
      // ==========================================
      const W = canvas.width;
      const H = canvas.height;
      const wallH = 340;

      ctx.clearRect(0, 0, W, H);

      // Room Category Identification
      const isSchoolHall = roomType === 'school_hall' || roomType === 'trophy_hall';
      const isScienceLab = roomType === 'science_lab' || roomType === 'laboratory';
      const isExhibition = roomType === 'exhibition_hall' || roomType === 'secret_vault';
      const isLibraryWing = roomType === 'library' || roomType === 'school_library' || roomType === 'rare_archives' || roomType === 'reading_hall';
      const isDrawingRoom = roomType === 'drawing_room' || roomType === 'manor_study' || roomType === 'private_study' || (!isSchoolHall && !isScienceLab && !isExhibition && !isLibraryWing);

      // ----------------------------------------------------
      // SECTION A: BACK WALL WITH RICH THEMATIC ARCHITECTURE
      // ----------------------------------------------------
      const wallGrad = ctx.createLinearGradient(0, 0, 0, wallH);
      if (isDrawingRoom) {
        wallGrad.addColorStop(0, '#0c0f16');
        wallGrad.addColorStop(0.5, '#161c28');
        wallGrad.addColorStop(1, '#1b2331');
      } else if (isSchoolHall) {
        wallGrad.addColorStop(0, '#100e0b');
        wallGrad.addColorStop(0.5, '#1e1a14');
        wallGrad.addColorStop(1, '#292219');
      } else if (isScienceLab) {
        wallGrad.addColorStop(0, '#0a0e14');
        wallGrad.addColorStop(0.5, '#131b24');
        wallGrad.addColorStop(1, '#182430');
      } else if (isExhibition) {
        wallGrad.addColorStop(0, '#0a0d14');
        wallGrad.addColorStop(0.5, '#141822');
        wallGrad.addColorStop(1, '#1a202c');
      } else {
        // Library Wing
        wallGrad.addColorStop(0, '#0a0b10');
        wallGrad.addColorStop(0.5, '#14161f');
        wallGrad.addColorStop(1, '#1a1c27');
      }
      ctx.fillStyle = wallGrad;
      ctx.fillRect(0, 0, W, wallH);

      // Victorian Molded Cornice at top of wall
      ctx.fillStyle = '#080604';
      ctx.fillRect(0, 0, W, 14);
      ctx.fillStyle = '#2d1b11';
      ctx.fillRect(0, 14, W, 8);
      ctx.fillStyle = '#422819';
      ctx.fillRect(0, 22, W, 4);

      // Upper Wall Wallpaper / Architectural Treatment
      if (isDrawingRoom) {
        // Victorian Damask vertical stripe & subtle diamond stencil
        ctx.strokeStyle = 'rgba(212, 163, 89, 0.04)';
        ctx.lineWidth = 1.5;
        for (let x = 30; x < W; x += 50) {
          ctx.beginPath();
          ctx.moveTo(x, 26);
          ctx.lineTo(x, wallH - 120);
          ctx.stroke();

          // Small decorative diamond medallion
          for (let y = 60; y < wallH - 130; y += 70) {
            ctx.fillStyle = 'rgba(212, 163, 89, 0.025)';
            ctx.beginPath();
            ctx.moveTo(x, y - 8);
            ctx.lineTo(x + 6, y);
            ctx.lineTo(x, y + 8);
            ctx.lineTo(x - 6, y);
            ctx.closePath();
            ctx.fill();
          }
        }
      } else if (isScienceLab) {
        // Ceramic Subway Tiles on upper-mid wall
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.03)';
        ctx.lineWidth = 1;
        for (let y = 70; y < wallH - 110; y += 22) {
          ctx.beginPath();
          ctx.moveTo(0, y);
          ctx.lineTo(W, y);
          ctx.stroke();
        }
        for (let x = 20; x < W; x += 44) {
          for (let y = 70; y < wallH - 110; y += 44) {
            ctx.beginPath();
            ctx.moveTo(x, y);
            ctx.lineTo(x, y + 22);
            ctx.moveTo(x + 22, y + 22);
            ctx.lineTo(x + 22, y + 44);
            ctx.stroke();
          }
        }
      }

      // Molded Wainscoting / Dado Rail (Lower 120px of wall)
      const dadoY = wallH - 120;
      const dadoWood = isScienceLab ? '#1c222b' : '#22150e';
      ctx.fillStyle = dadoWood;
      ctx.fillRect(0, dadoY, W, 120);

      // Upper carved Dado Rail molding with shadow
      ctx.fillStyle = isScienceLab ? '#2f3b49' : '#3d2518';
      ctx.fillRect(0, dadoY - 4, W, 6);
      ctx.fillStyle = isScienceLab ? '#435467' : '#573422';
      ctx.fillRect(0, dadoY - 7, W, 3);
      ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
      ctx.fillRect(0, dadoY + 2, W, 3);

      // Recessed Wainscot Boiserie Wood Panels
      for (let px = 40; px < W - 40; px += 105) {
        // Skip behind central fireplace or trophy showcase
        if (isDrawingRoom && px >= 480 && px <= 680) continue;
        if (isSchoolHall && px >= 470 && px <= 690) continue;

        ctx.fillStyle = isScienceLab ? '#141920' : '#170e09';
        ctx.fillRect(px, dadoY + 12, 85, 84);

        // Chamfered bevel inner shadow
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 2, dadoY + 14, 81, 80);

        // Delicate inner brass/wood molding
        ctx.strokeStyle = isScienceLab ? 'rgba(74, 98, 122, 0.35)' : 'rgba(212, 163, 89, 0.18)';
        ctx.lineWidth = 1;
        ctx.strokeRect(px + 6, dadoY + 18, 73, 72);
      }

      // Baseboard Plinth at bottom of wall
      ctx.fillStyle = isScienceLab ? '#11151a' : '#140c08';
      ctx.fillRect(0, wallH - 24, W, 24);
      ctx.fillStyle = isScienceLab ? '#28323e' : '#331d12';
      ctx.fillRect(0, wallH - 24, W, 4);

      // Brass Wall Sconces with warm radiant gas light (Drawing Room)
      if (isDrawingRoom) {
        const sconcePositions = [380, 820];
        sconcePositions.forEach((sx) => {
          const sy = 160;
          // Cast wall shadow
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.beginPath();
          ctx.arc(sx, sy + 18, 14, 0, Math.PI * 2);
          ctx.fill();

          // Brass carved fixture
          ctx.fillStyle = '#b8893d';
          ctx.fillRect(sx - 3, sy, 6, 22);
          ctx.beginPath();
          ctx.arc(sx, sy + 5, 7, 0, Math.PI * 2);
          ctx.fill();

          // Frosted glass flame shade
          ctx.fillStyle = '#fcecc8';
          ctx.beginPath();
          ctx.ellipse(sx, sy - 9, 9, 13, 0, 0, Math.PI * 2);
          ctx.fill();

          // Sconce radiant warm aura
          const sconceGlow = ctx.createRadialGradient(sx, sy - 9, 2, sx, sy - 9, 65);
          sconceGlow.addColorStop(0, 'rgba(255, 195, 110, 0.35)');
          sconceGlow.addColorStop(0.5, 'rgba(230, 140, 50, 0.12)');
          sconceGlow.addColorStop(1, 'transparent');
          ctx.fillStyle = sconceGlow;
          ctx.beginPath();
          ctx.arc(sx, sy - 9, 65, 0, Math.PI * 2);
          ctx.fill();
        });
      }

      // ----------------------------------------------------
      // SECTION B: PERSPECTIVE FLOORING & LUXURIOUS CARPETS
      // ----------------------------------------------------
      const floorGrad = ctx.createLinearGradient(0, wallH, 0, H);
      floorGrad.addColorStop(0, '#1c1510');
      floorGrad.addColorStop(0.4, '#150f0c');
      floorGrad.addColorStop(1, '#0e0b08');
      ctx.fillStyle = floorGrad;
      ctx.fillRect(0, wallH, W, H - wallH);

      // Polished Oak Floor Planks with Satin Sheen & Perspective Grain
      ctx.strokeStyle = 'rgba(0, 0, 0, 0.45)';
      ctx.lineWidth = 1;
      for (let y = wallH; y < H; y += 36) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();

        // Staggered vertical plank joints
        const rowIdx = Math.floor((y - wallH) / 36);
        const shift = (rowIdx % 3) * 60;
        for (let jx = shift; jx < W; jx += 180) {
          ctx.beginPath();
          ctx.moveTo(jx, y);
          ctx.lineTo(jx, y + 36);
          ctx.stroke();
        }
      }

      // Carpets / Rugs per room style
      if (isDrawingRoom) {
        // Antique Persian Silk Medallion Rug
        ctx.save();
        // Deep drop shadow on floor
        ctx.fillStyle = 'rgba(0, 0, 0, 0.55)';
        ctx.fillRect(352, 423, 496, 204);

        // Rich Burgundy Field
        ctx.fillStyle = '#4a1019';
        ctx.fillRect(358, 418, 484, 198);

        // Intricate Gold Bullion & Indigo Arabesque Borders
        ctx.strokeStyle = '#b8893d';
        ctx.lineWidth = 4;
        ctx.strokeRect(366, 426, 468, 182);

        ctx.strokeStyle = '#1d2a44';
        ctx.lineWidth = 2;
        ctx.strokeRect(373, 433, 454, 168);

        ctx.strokeStyle = 'rgba(212, 163, 89, 0.45)';
        ctx.lineWidth = 1;
        ctx.strokeRect(378, 438, 444, 158);

        // Central Persian Floral Medallion
        ctx.fillStyle = 'rgba(212, 163, 89, 0.16)';
        ctx.beginPath();
        ctx.ellipse(600, 517, 95, 52, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#d4a359';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Four Corner Spandrel Motifs
        const corners = [
          [380, 440], [820, 440], [380, 594], [820, 594]
        ];
        ctx.fillStyle = 'rgba(212, 163, 89, 0.2)';
        corners.forEach(([cx, cy]) => {
          ctx.beginPath();
          ctx.arc(cx, cy, 18, 0, Math.PI * 2);
          ctx.fill();
        });

        // Fringed rug tassels along left and right ends
        ctx.fillStyle = '#dcd4c3';
        for (let fy = 422; fy <= 612; fy += 6) {
          ctx.fillRect(355, fy, 4, 2);
          ctx.fillRect(841, fy, 4, 2);
        }
        ctx.restore();

      } else if (isLibraryWing) {
        // Deep Emerald / Teal Runner
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(375, 395, 450, 230);
        ctx.fillStyle = '#11252b';
        ctx.fillRect(380, 390, 440, 225);
        ctx.strokeStyle = '#a67c3b';
        ctx.lineWidth = 3;
        ctx.strokeRect(388, 398, 424, 209);
        ctx.strokeStyle = 'rgba(212, 163, 89, 0.35)';
        ctx.lineWidth = 1;
        ctx.strokeRect(394, 404, 412, 197);
        ctx.restore();
      }

      // ----------------------------------------------------
      // SECTION C: ARCHED GOTHIC WINDOW & WEATHER EFFECTS
      // ----------------------------------------------------
      const winX = isDrawingRoom ? 240 : 180;
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
        skyGrad.addColorStop(0, `rgba(195, 220, 255, ${0.45 + flash * 0.55})`);
        skyGrad.addColorStop(0.5, `rgba(135, 170, 215, ${0.35 + flash * 0.45})`);
        skyGrad.addColorStop(1, `rgba(50, 75, 120, ${0.25 + flash * 0.35})`);
      } else {
        skyGrad.addColorStop(0, '#03050a');
        skyGrad.addColorStop(0.6, '#080f1b');
        skyGrad.addColorStop(1, '#0e1828');
      }
      ctx.fillStyle = skyGrad;
      ctx.fillRect(winX, winY - 20, winW, winH + 30);

      // Rain animation streaks
      ctx.strokeStyle = flash > 0 ? 'rgba(235, 248, 255, 0.75)' : 'rgba(180, 215, 245, 0.35)';
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

      // Carved Stone Window Surround & Mullions
      ctx.strokeStyle = '#2d1d13';
      ctx.lineWidth = 8;
      ctx.strokeRect(winX - 2, winY + 30, winW + 4, winH - 28);

      // Stone Sill
      ctx.fillStyle = '#3a2519';
      ctx.fillRect(winX - 8, winY + winH - 2, winW + 16, 14);

      // Leaded Diamond / Cathedral Mullion Bars
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

      // Velvet Draperies flanking the window with tie-backs
      ctx.save();
      const drapeColor = isDrawingRoom ? '#5c1420' : '#1a2f38';
      // Left curtain
      ctx.fillStyle = drapeColor;
      ctx.beginPath();
      ctx.moveTo(winX - 12, winY + 10);
      ctx.lineTo(winX + 22, winY + 14);
      ctx.quadraticCurveTo(winX + 4, winY + winH / 2, winX + 18, winY + winH);
      ctx.lineTo(winX - 16, winY + winH);
      ctx.closePath();
      ctx.fill();

      // Right curtain
      ctx.beginPath();
      ctx.moveTo(winX + winW - 22, winY + 14);
      ctx.lineTo(winX + winW + 12, winY + 10);
      ctx.lineTo(winX + winW + 16, winY + winH);
      ctx.quadraticCurveTo(winX + winW - 4, winY + winH / 2, winX + winW - 18, winY + winH);
      ctx.closePath();
      ctx.fill();

      // Golden tieback tassels
      ctx.fillStyle = '#d4a359';
      ctx.fillRect(winX - 2, winY + winH * 0.55, 12, 4);
      ctx.fillRect(winX + winW - 10, winY + winH * 0.55, 12, 4);
      ctx.restore();

      // Lightning beam cast across the room floor during flash
      if (flash > 0.05) {
        ctx.save();
        ctx.fillStyle = `rgba(190, 220, 255, ${flash * 0.15})`;
        ctx.beginPath();
        ctx.moveTo(winX, wallH);
        ctx.lineTo(winX + winW, wallH);
        ctx.lineTo(winX + winW + 150, H);
        ctx.lineTo(winX - 70, H);
        ctx.closePath();
        ctx.fill();
        ctx.restore();
      }

      // ----------------------------------------------------
      // SECTION D: RICH HANDCRAFTED FURNITURE PER ROOM THEME
      // ----------------------------------------------------

      // --- D1. SCHOOL TROPHY HALL & PRINCIPAL'S OFFICE ---
      if (isSchoolHall) {
        // 1. Central Glass Trophy Showcase
        const shX = 500;
        const shY = 165;
        const shW = 200;
        const shH = 175;

        // Shadow behind showcase
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(shX - 10, shY, shW + 20, shH);

        // Carved Mahogany Frame with Chamfered Corners
        ctx.fillStyle = '#281a11';
        ctx.fillRect(shX, shY, shW, shH);
        ctx.strokeStyle = '#8a6527';
        ctx.lineWidth = 4;
        ctx.strokeRect(shX, shY, shW, shH);

        // Deep crimson velvet backing
        ctx.fillStyle = '#4c111a';
        ctx.fillRect(shX + 8, shY + 8, shW - 16, shH - 16);

        // Glass shelves
        ctx.fillStyle = 'rgba(210, 235, 255, 0.28)';
        ctx.fillRect(shX + 12, shY + 65, shW - 24, 4);
        ctx.fillRect(shX + 12, shY + 115, shW - 24, 4);

        // Golden Championship Trophy on Velvet Pedestal
        const tcX = shX + shW / 2;
        const tcY = shY + 95;
        ctx.fillStyle = '#f3c45d';
        ctx.beginPath();
        ctx.moveTo(tcX - 22, tcY - 30);
        ctx.lineTo(tcX + 22, tcY - 30);
        ctx.quadraticCurveTo(tcX + 18, tcY + 5, tcX, tcY + 12);
        ctx.quadraticCurveTo(tcX - 18, tcY + 5, tcX - 22, tcY - 30);
        ctx.fill();
        ctx.strokeStyle = '#d49826';
        ctx.lineWidth = 2;
        ctx.stroke();

        // Trophy handles
        ctx.beginPath();
        ctx.arc(tcX - 22, tcY - 14, 10, Math.PI * 0.5, Math.PI * 1.5);
        ctx.arc(tcX + 22, tcY - 14, 10, Math.PI * 1.5, Math.PI * 0.5);
        ctx.stroke();

        // Trophy base with brass nameplate
        ctx.fillStyle = '#1c1510';
        ctx.fillRect(tcX - 16, tcY + 14, 32, 12);
        ctx.fillStyle = '#d4a359';
        ctx.fillRect(tcX - 12, tcY + 18, 24, 4);

        // Silver Athletic Shields on lower shelf
        ctx.fillStyle = '#cbd5e1';
        ctx.beginPath();
        ctx.arc(shX + 45, shY + 138, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#94a3b8';
        ctx.stroke();

        // Glass highlight reflection streak
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.28)';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        ctx.moveTo(shX + 18, shY + 12);
        ctx.lineTo(shX + 75, shY + shH - 18);
        ctx.stroke();

        // 2. Principal's Executive Oak Desk (Left)
        const deskX = 160;
        const deskY = 410;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(deskX + 6, deskY + 68, 194, 20);
        ctx.fillStyle = '#321c13';
        ctx.fillRect(deskX, deskY, 190, 78);
        ctx.fillStyle = '#45271a';
        ctx.fillRect(deskX - 4, deskY - 10, 198, 16);

        // Forest Green leather blotter with gold tooling
        ctx.fillStyle = '#183824';
        ctx.fillRect(deskX + 18, deskY + 8, 154, 26);
        ctx.strokeStyle = '#b8893d';
        ctx.lineWidth = 1;
        ctx.strokeRect(deskX + 20, deskY + 10, 150, 22);

        // Attendance ledger
        ctx.fillStyle = '#f4ecd8';
        ctx.fillRect(deskX + 58, deskY + 14, 48, 18);
        ctx.strokeStyle = '#8a6527';
        ctx.strokeRect(deskX + 58, deskY + 14, 48, 18);

        // Brass Bell & Inkstand
        ctx.fillStyle = '#d4a359';
        ctx.beginPath();
        ctx.arc(deskX + 132, deskY + 20, 6, 0, Math.PI * 2);
        ctx.fill();

        // 3. Sports Bulletin Board (Right)
        const bbX = 770;
        const bbY = 430;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(bbX + 6, bbY + 70, 190, 20);

        // Walnut Frame
        ctx.fillStyle = '#543622';
        ctx.fillRect(bbX, bbY, 185, 76);
        // Rich textured cork
        ctx.fillStyle = '#9e734a';
        ctx.fillRect(bbX + 8, bbY + 8, 169, 60);

        // Layered notices
        ctx.fillStyle = '#f7f4ed';
        ctx.fillRect(bbX + 18, bbY + 16, 32, 22);
        ctx.fillRect(bbX + 62, bbY + 18, 36, 26);
        ctx.fillRect(bbX + 110, bbY + 14, 40, 20);

        // Championship Ribbons (Blue & Red with gold tassels)
        ctx.fillStyle = '#1e40af';
        ctx.fillRect(bbX + 24, bbY + 42, 10, 20);
        ctx.fillStyle = '#b91c1c';
        ctx.fillRect(bbX + 68, bbY + 46, 10, 20);

        // Doorway to School Library (Right Wall)
        const doorX = 1040;
        const doorY = 160;
        ctx.fillStyle = '#21130d';
        ctx.fillRect(doorX, doorY, 90, 180);
        ctx.strokeStyle = '#3e2418';
        ctx.lineWidth = 4;
        ctx.strokeRect(doorX, doorY, 90, 180);
        ctx.strokeRect(doorX + 8, doorY + 12, 34, 156);
        ctx.strokeRect(doorX + 48, doorY + 12, 34, 156);
        ctx.fillStyle = '#d4a359';
        ctx.beginPath();
        ctx.arc(doorX + 46, doorY + 94, 5, 0, Math.PI * 2);
        ctx.fill();

        // --- D2. JUNIOR SCIENCE LAB ARCHITECTURE ---
      } else if (isScienceLab) {
        // 1. Central Chemistry Slate Demonstration Bench
        const bX = 500;
        const bY = 175;
        const bW = 200;
        const bH = 165;

        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(bX - 8, bY, bW + 16, bH);

        // Slate stone top & steel enameled cabinetry
        ctx.fillStyle = '#232933';
        ctx.fillRect(bX, bY, bW, bH);
        ctx.fillStyle = '#374151';
        ctx.fillRect(bX - 6, bY - 8, bW + 12, 16);

        // Bunsen Burner & Animated Blue Flame Core
        const burnerX = bX + 40;
        const burnerY = bY + 10;
        ctx.fillStyle = '#9ca3af';
        ctx.fillRect(burnerX - 5, burnerY - 14, 10, 14);
        ctx.fillStyle = '#4b5563';
        ctx.fillRect(burnerX - 12, burnerY, 24, 6);

        const flicker = Math.sin(flameTime.current * 14) * 3;
        // Inner intense blue flame cone
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.moveTo(burnerX - 5, burnerY - 14);
        ctx.quadraticCurveTo(burnerX, burnerY - 34 + flicker, burnerX + 5, burnerY - 14);
        ctx.fill();

        // Outer amber flame tip
        ctx.fillStyle = 'rgba(251, 191, 36, 0.75)';
        ctx.beginPath();
        ctx.moveTo(burnerX - 3, burnerY - 14);
        ctx.quadraticCurveTo(burnerX, burnerY - 26 + flicker, burnerX + 3, burnerY - 14);
        ctx.fill();

        // Chemical Erlenmeyer Flask with Glowing Turquoise Solution
        const flX = bX + 100;
        const flY = bY + 6;
        ctx.fillStyle = '#06b6d4';
        ctx.beginPath();
        ctx.moveTo(flX - 14, flY);
        ctx.lineTo(flX + 14, flY);
        ctx.lineTo(flX + 5, flY - 24);
        ctx.lineTo(flX - 5, flY - 24);
        ctx.closePath();
        ctx.fill();
        ctx.strokeStyle = '#e0f2fe';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Copper Condenser Coil
        ctx.strokeStyle = '#d97706';
        ctx.lineWidth = 2.5;
        ctx.beginPath();
        for (let cy = 0; cy < 16; cy += 4) {
          ctx.arc(bX + 155, bY - 8 + cy, 7, 0, Math.PI);
        }
        ctx.stroke();

        // 2. Project Formula Blackboard (Left)
        const bbX = 160;
        const bbY = 410;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(bbX + 6, bbY + 68, 194, 20);
        ctx.fillStyle = '#3f2e20';
        ctx.fillRect(bbX, bbY, 190, 78);
        ctx.fillStyle = '#1e3025';
        ctx.fillRect(bbX + 8, bbY + 8, 174, 62);

        // Chalk diagram formulas
        ctx.strokeStyle = '#e2e8f0';
        ctx.lineWidth = 1;
        ctx.strokeRect(bbX + 20, bbY + 20, 28, 20);
        ctx.beginPath();
        ctx.moveTo(bbX + 48, bbY + 30);
        ctx.lineTo(bbX + 75, bbY + 30);
        ctx.moveTo(bbX + 85, bbY + 20);
        ctx.lineTo(bbX + 120, bbY + 45);
        ctx.stroke();

        ctx.fillStyle = '#cbd5e1';
        ctx.font = '9px monospace';
        ctx.fillText('E = mc²', bbX + 130, bbY + 32);

        // 3. Component Specimen Cabinet (Right)
        const cabX = 770;
        const cabY = 430;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(cabX + 6, cabY + 70, 190, 20);
        ctx.fillStyle = '#1f2937';
        ctx.fillRect(cabX, cabY, 185, 76);
        ctx.strokeStyle = '#4b5563';
        ctx.lineWidth = 3;
        ctx.strokeRect(cabX, cabY, 185, 76);
        ctx.fillStyle = 'rgba(147, 197, 253, 0.3)';
        ctx.fillRect(cabX + 10, cabY + 24, 165, 4);
        ctx.fillRect(cabX + 10, cabY + 48, 165, 4);

        // Door to Exhibition Hall (Right Wall)
        const doorX = 1040;
        const doorY = 160;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(doorX, doorY, 90, 180);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.strokeRect(doorX, doorY, 90, 180);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(doorX + 46, doorY + 94, 5, 0, Math.PI * 2);
        ctx.fill();

        // --- D3. EXHIBITION HALL & SECRET VAULT ---
      } else if (isExhibition) {
        // Dramatic Spotlight Beam descending onto podium
        ctx.save();
        const beamGrad = ctx.createLinearGradient(600, 0, 600, 520);
        beamGrad.addColorStop(0, 'rgba(255, 235, 180, 0.32)');
        beamGrad.addColorStop(1, 'rgba(255, 235, 180, 0.02)');
        ctx.fillStyle = beamGrad;
        ctx.beginPath();
        ctx.moveTo(560, 0);
        ctx.lineTo(640, 0);
        ctx.lineTo(740, 500);
        ctx.lineTo(460, 500);
        ctx.closePath();
        ctx.fill();
        ctx.restore();

        // Central First-Prize Project Podium
        const podX = 490;
        const podY = 415;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(podX + 8, podY + 74, 224, 22);
        ctx.fillStyle = '#1c1917';
        ctx.fillRect(podX, podY, 220, 80);
        ctx.fillStyle = '#44403c';
        ctx.fillRect(podX - 6, podY - 6, 232, 14);

        // Royal Blue Silk Display Runner with Gold Fringe
        ctx.fillStyle = '#1e3a8a';
        ctx.fillRect(podX + 24, podY + 8, 172, 64);
        ctx.strokeStyle = '#fbbf24';
        ctx.lineWidth = 2;
        ctx.strokeRect(podX + 24, podY + 8, 172, 64);

        // Golden Award Ribbon Rosette
        ctx.fillStyle = '#f59e0b';
        ctx.beginPath();
        ctx.arc(podX + 110, podY + 36, 14, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#78350f';
        ctx.lineWidth = 1.5;
        ctx.stroke();

        // Participant Equipment Locker #4 (Left)
        const lkX = 160;
        const lkY = 320;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(lkX + 6, lkY + 110, 118, 16);
        ctx.fillStyle = '#334155';
        ctx.fillRect(lkX, lkY, 110, 120);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 3;
        ctx.strokeRect(lkX, lkY, 110, 120);

        // Locker ventilation louvers
        ctx.fillStyle = '#1e293b';
        for (let ly = lkY + 16; ly < lkY + 44; ly += 6) {
          ctx.fillRect(lkX + 20, ly, 70, 2);
        }

        // Stamped locker number #4
        ctx.fillStyle = '#f8fafc';
        ctx.font = 'bold 12px monospace';
        ctx.fillText('#4', lkX + 50, lkY + 68);

        // Doorway leading back to Science Lab / Manor (Left Wall)
        const doorX = 65;
        const doorY = 160;
        ctx.fillStyle = '#1e293b';
        ctx.fillRect(doorX, doorY, 80, 180);
        ctx.strokeStyle = '#475569';
        ctx.lineWidth = 4;
        ctx.strokeRect(doorX, doorY, 80, 180);
        ctx.fillStyle = '#38bdf8';
        ctx.beginPath();
        ctx.arc(doorX + 68, doorY + 95, 5, 0, Math.PI * 2);
        ctx.fill();

        // --- D4. CLASSIC VICTORIAN DRAWING ROOM & MANOR STUDY ---
      } else if (isDrawingRoom) {
        // 1. Grand Limestone Carved Fireplace (Center)
        const fpX = 520;
        const fpY = 165;
        const fpW = 160;
        const fpH = 175;

        // Shadow behind hearth
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(fpX - 24, fpY, fpW + 48, fpH);

        // Limestone Mantel Surround with Beveled Cornices
        ctx.fillStyle = '#2b211d';
        ctx.fillRect(fpX - 16, fpY, fpW + 32, fpH);
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
        ctx.fillStyle = '#a67c3b';
        ctx.fillRect(fireBaseX - 36, fireBaseY - 14, 6, 14);
        ctx.fillRect(fireBaseX + 30, fireBaseY - 14, 6, 14);

        // Animated flames
        ctx.fillStyle = '#e85d04';
        ctx.beginPath();
        ctx.moveTo(fireBaseX - 30, fireBaseY);
        ctx.quadraticCurveTo(fireBaseX - 16, fireBaseY - 45 + flicker * 15, fireBaseX - 4, fireBaseY - 65 + flicker * 18);
        ctx.quadraticCurveTo(fireBaseX + 8, fireBaseY - 42 + flicker * 12, fireBaseX + 30, fireBaseY);
        ctx.fill();

        ctx.fillStyle = '#f77f00';
        ctx.beginPath();
        ctx.moveTo(fireBaseX - 22, fireBaseY);
        ctx.quadraticCurveTo(fireBaseX - 8, fireBaseY - 38 + flicker * 10, fireBaseX + 2, fireBaseY - 52 + flicker * 12);
        ctx.quadraticCurveTo(fireBaseX + 12, fireBaseY - 30 + flicker * 8, fireBaseX + 22, fireBaseY);
        ctx.fill();

        ctx.fillStyle = '#ffdf78';
        ctx.beginPath();
        ctx.moveTo(fireBaseX - 12, fireBaseY);
        ctx.quadraticCurveTo(fireBaseX - 3, fireBaseY - 24 + flicker * 6, fireBaseX + 1, fireBaseY - 32 + flicker * 8);
        ctx.quadraticCurveTo(fireBaseX + 5, fireBaseY - 18 + flicker * 4, fireBaseX + 12, fireBaseY);
        ctx.fill();

        // 2. Oil Portrait of Lord Harrington above Fireplace
        const portX = 548;
        const portY = 60;
        ctx.fillStyle = '#b8893d';
        ctx.fillRect(portX - 6, portY - 6, 112, 94);
        ctx.fillStyle = '#8f6828';
        ctx.strokeRect(portX - 4, portY - 4, 108, 90);
        ctx.fillStyle = '#141010';
        ctx.fillRect(portX, portY, 100, 82);
        ctx.fillStyle = '#0c0a0a';
        ctx.beginPath();
        ctx.arc(portX + 50, portY + 32, 17, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillRect(portX + 25, portY + 48, 50, 32);
        ctx.fillStyle = '#dedad2';
        ctx.beginPath();
        ctx.moveTo(portX + 46, portY + 46);
        ctx.lineTo(portX + 54, portY + 46);
        ctx.lineTo(portX + 50, portY + 54);
        ctx.fill();
        ctx.fillStyle = '#d4a359';
        ctx.fillRect(portX + 26, portY + 76, 48, 8);

        // 3. Roll-Top Mahogany Writing Desk (Left)
        const deskX = 160;
        const deskY = 410;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(deskX + 8, deskY + 68, 194, 20);
        ctx.fillStyle = '#331c13';
        ctx.fillRect(deskX, deskY, 190, 78);
        ctx.fillStyle = '#42251a';
        ctx.fillRect(deskX - 4, deskY - 14, 198, 24);
        ctx.fillStyle = '#1c3326';
        ctx.fillRect(deskX + 16, deskY + 12, 158, 22);

        // Banker's Lamp with warm green shade
        ctx.fillStyle = '#1d5e3c';
        ctx.fillRect(deskX + 22, deskY - 32, 34, 12);
        ctx.fillStyle = '#d4a359';
        ctx.fillRect(deskX + 37, deskY - 20, 4, 14);

        // Banker's lamp soft green light pool
        const lampGlow = ctx.createRadialGradient(deskX + 39, deskY - 20, 4, deskX + 39, deskY - 10, 48);
        lampGlow.addColorStop(0, 'rgba(167, 243, 208, 0.45)');
        lampGlow.addColorStop(1, 'transparent');
        ctx.fillStyle = lampGlow;
        ctx.beginPath();
        ctx.arc(deskX + 39, deskY - 10, 48, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // 4. Velvet Chesterfield Settee & Side Table (Right)
        const sofaX = 780;
        const sofaY = 450;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
        ctx.fillRect(sofaX + 6, sofaY + 70, 184, 25);
        ctx.fillStyle = '#40111a';
        ctx.fillRect(sofaX, sofaY, 176, 46);
        ctx.fillStyle = '#591624';
        ctx.fillRect(sofaX - 4, sofaY + 34, 184, 38);

        // Side table with silver tea tray
        const tblX = sofaX - 48;
        const tblY = sofaY + 16;
        ctx.fillStyle = '#2b1a13';
        ctx.fillRect(tblX, tblY, 38, 44);
        ctx.fillStyle = '#b0b8c4';
        ctx.fillRect(tblX + 8, tblY - 5, 22, 3);
        ctx.restore();

        // Doorway on Right Wall
        const doorX = 1040;
        const doorY = 160;
        ctx.fillStyle = '#21130d';
        ctx.fillRect(doorX, doorY, 90, 180);
        ctx.strokeStyle = '#3e2418';
        ctx.lineWidth = 4;
        ctx.strokeRect(doorX, doorY, 90, 180);
        ctx.strokeRect(doorX + 8, doorY + 12, 34, 156);
        ctx.strokeRect(doorX + 48, doorY + 12, 34, 156);
        ctx.fillStyle = '#d4a359';
        ctx.beginPath();
        ctx.arc(doorX + 46, doorY + 94, 5, 0, Math.PI * 2);
        ctx.fill();

        // --- D5. LIBRARY WING & RARE ARCHIVES ---
      } else {
        // Towering Multi-Tier Dark Oak Bookcases along back wall
        ctx.fillStyle = '#221711';
        ctx.fillRect(55, 45, 410, wallH - 55);
        ctx.fillRect(715, 45, 350, wallH - 55);

        ctx.fillStyle = '#352217';
        ctx.fillRect(50, 38, 420, 14);
        ctx.fillRect(710, 38, 360, 14);

        const bookTones = ['#731c2b', '#1b4a50', '#a87938', '#2d452d', '#3d2b20', '#592036'];
        for (let row = 68; row < wallH - 65; row += 42) {
          ctx.fillStyle = '#3a251a';
          ctx.fillRect(55, row, 410, 6);
          ctx.fillRect(715, row, 350, 6);

          for (let bx = 65; bx < 455; bx += 14) {
            const hVar = ((bx * 7) % 8);
            ctx.fillStyle = bookTones[(bx + row) % bookTones.length];
            ctx.fillRect(bx, row - 30 + hVar, 11, 30 - hVar);
            ctx.fillStyle = 'rgba(212, 163, 89, 0.45)';
            ctx.fillRect(bx, row - 22 + hVar, 11, 2);
            ctx.fillRect(bx, row - 12 + hVar, 11, 2);
          }

          for (let bx = 725; bx < 1055; bx += 14) {
            const hVar = ((bx * 11) % 8);
            ctx.fillStyle = bookTones[(bx + row) % bookTones.length];
            ctx.fillRect(bx, row - 30 + hVar, 11, 30 - hVar);
            ctx.fillStyle = 'rgba(212, 163, 89, 0.45)';
            ctx.fillRect(bx, row - 22 + hVar, 11, 2);
            ctx.fillRect(bx, row - 12 + hVar, 11, 2);
          }
        }

        // Brass Rolling Ladder
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
        ctx.restore();

        // Curator's Reading Table (Center)
        const tblX = 460;
        const tblY = 415;
        ctx.save();
        ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.fillRect(tblX + 10, tblY + 72, 280, 25);
        ctx.fillStyle = '#2b1b12';
        ctx.fillRect(tblX, tblY, 275, 82);
        ctx.fillStyle = '#163323';
        ctx.fillRect(tblX + 14, tblY + 8, 247, 66);
        ctx.strokeStyle = '#a67c3b';
        ctx.lineWidth = 1.5;
        ctx.strokeRect(tblX + 14, tblY + 8, 247, 66);

        // Open Leather-bound Ledger
        ctx.fillStyle = '#f4eedb';
        ctx.fillRect(tblX + 90, tblY + 20, 95, 42);
        ctx.fillStyle = '#422416';
        ctx.fillRect(tblX + 86, tblY + 18, 103, 4);

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
        ctx.restore();

        // Grandfather Clock with Swinging Harmonic Pendulum (Right)
        const clkX = 840;
        const clkY = 175;
        ctx.save();
        ctx.fillStyle = '#2e1c12';
        ctx.fillRect(clkX, clkY, 58, 170);
        ctx.fillStyle = '#f2ebd9';
        ctx.beginPath();
        ctx.arc(clkX + 29, clkY + 34, 18, 0, Math.PI * 2);
        ctx.fill();
        ctx.strokeStyle = '#b8893d';
        ctx.lineWidth = 2;
        ctx.stroke();

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
        ctx.fillStyle = '#e6b86e';
        ctx.beginPath();
        ctx.arc(pendBobX, pendBobY, 7, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();

        // Doorway leading back (Left Wall)
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

      // ----------------------------------------------------
      // SECTION E: ELEGANT DETECTIVE-THEMED CLUE INDICATORS
      // ----------------------------------------------------
      for (const obj of interactiveObjects) {
        const isExamined = examinedObjectIds.has(obj.id);
        const distToPlayer = Math.hypot(obj.x - posX, obj.y - posY);
        const isNear = distToPlayer < 105;
        const clueCount = getObjectClueCount(obj);

        ctx.save();
        const pulse = Math.sin(flameTime.current * 3.5) * 2;
        const floatBob = Math.sin(flameTime.current * 2.8 + obj.x * 0.04) * 3.5;
        const badgeY = obj.y + floatBob;

        // --- E1. DOORWAY TRANSITION MARKER ---
        if (obj.isDoor) {
          // Arched Brass Passageway Plaque
          ctx.save();
          if (isNear) {
            // Radiant doorway golden highlight
            ctx.fillStyle = 'rgba(212, 163, 89, 0.18)';
            ctx.beginPath();
            ctx.arc(obj.x, obj.y, 34 + pulse, 0, Math.PI * 2);
            ctx.fill();
          }

          // Passage banner badge
          const doorLabel = language === 'hi' ? `➔ ${obj.title || 'द्वार'}` :
            language === 'hinglish' ? `➔ ${obj.title || 'Rasta'}` :
              `➔ ${obj.title || 'Passageway'}`;
          ctx.font = 'bold 11px "Nirmala UI", "Segoe UI", sans-serif';
          const badgeW = ctx.measureText(doorLabel).width + 24;

          // Engraved brass plaque
          ctx.fillStyle = '#16110c';
          ctx.strokeStyle = isNear ? '#f5c97a' : '#b8893d';
          ctx.lineWidth = isNear ? 2 : 1.5;
          ctx.beginPath();
          ctx.roundRect(obj.x - badgeW / 2, badgeY - 14, badgeW, 28, 6);
          ctx.fill();
          ctx.stroke();

          // Door label text
          ctx.fillStyle = isNear ? '#ffdf88' : '#e6b86e';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText(doorLabel, obj.x, badgeY);

          if (isNear) {
            // Tooltip prompt below badge
            const promptText = language === 'hi' ? '[E] प्रवेश करें' :
              language === 'hinglish' ? '[E] Andar Jao' :
                '[E] Enter';
            ctx.font = 'bold 9px monospace';
            ctx.fillStyle = '#ffffff';
            ctx.fillText(promptText, obj.x, badgeY + 22);
          }
          ctx.restore();

          // --- E2. EXAMINED OBJECT (ANTIQUE EMERALD ARCHIVAL SEAL) ---
        } else if (isExamined) {
          ctx.save();
          // Subtle soft floor shadow beneath seal
          ctx.fillStyle = 'rgba(0, 0, 0, 0.35)';
          ctx.beginPath();
          ctx.ellipse(obj.x, obj.y + 8, 16, 6, 0, 0, Math.PI * 2);
          ctx.fill();

          // Antique Emerald Wax Archival Seal
          ctx.strokeStyle = '#2dd4bf';
          ctx.lineWidth = 1.8;
          ctx.fillStyle = 'rgba(19, 78, 74, 0.85)';
          ctx.beginPath();
          ctx.arc(obj.x, badgeY, 14, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();

          // Inner ring
          ctx.strokeStyle = 'rgba(45, 212, 191, 0.45)';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(obj.x, badgeY, 11, 0, Math.PI * 2);
          ctx.stroke();

          // Checkmark
          ctx.fillStyle = '#5eead4';
          ctx.font = 'bold 12px sans-serif';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('✓', obj.x, badgeY);

          // Small discrete completed badge on hover / approach
          if (isNear) {
            const completedText = language === 'hi' ? '✓ जांच पूरी' :
              language === 'hinglish' ? '✓ Dekh Liya' :
                '✓ Completed';
            ctx.font = 'bold 10px "Nirmala UI", "Segoe UI", sans-serif';
            const compW = ctx.measureText(completedText).width + 16;
            ctx.fillStyle = '#0a1715';
            ctx.strokeStyle = '#2dd4bf';
            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.roundRect(obj.x - compW / 2, badgeY - 30, compW, 18, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#5eead4';
            ctx.fillText(completedText, obj.x, badgeY - 21);
          }
          ctx.restore();

          // --- E3. ACTIVE CLUE LOCATION (ORNATE BRASS MAGNIFYING GLASS & COUNT) ---
        } else {
          ctx.save();

          // Proximity Floor Spotlight
          if (isNear) {
            const spotGrad = ctx.createRadialGradient(obj.x, obj.y + 12, 8, obj.x, obj.y + 12, 85);
            spotGrad.addColorStop(0, 'rgba(245, 158, 11, 0.28)');
            spotGrad.addColorStop(0.6, 'rgba(217, 119, 6, 0.12)');
            spotGrad.addColorStop(1, 'transparent');
            ctx.fillStyle = spotGrad;
            ctx.beginPath();
            ctx.ellipse(obj.x, obj.y + 12, 85, 38, 0, 0, Math.PI * 2);
            ctx.fill();
          }

          // Subtle floor drop shadow under badge
          ctx.fillStyle = 'rgba(0, 0, 0, 0.4)';
          ctx.beginPath();
          ctx.ellipse(obj.x, obj.y + 12, 14, 5, 0, 0, Math.PI * 2);
          ctx.fill();

          // Handcrafted Brass Magnifying Glass Icon
          const mgX = obj.x - (clueCount > 0 ? 34 : 0);
          const mgY = badgeY;
          const mgRadius = 11 + (isNear ? pulse * 0.4 : 0);

          // Glass lens with subtle tinted glint
          ctx.fillStyle = 'rgba(191, 219, 254, 0.35)';
          ctx.beginPath();
          ctx.arc(mgX, mgY, mgRadius, 0, Math.PI * 2);
          ctx.fill();

          // Brass rim
          ctx.strokeStyle = isNear ? '#fde047' : '#d4a359';
          ctx.lineWidth = 2.2;
          ctx.stroke();

          // Diagonal glint across lens
          ctx.strokeStyle = 'rgba(255, 255, 255, 0.7)';
          ctx.lineWidth = 1.2;
          ctx.beginPath();
          ctx.moveTo(mgX - mgRadius * 0.5, mgY - mgRadius * 0.5);
          ctx.lineTo(mgX + mgRadius * 0.3, mgY + mgRadius * 0.3);
          ctx.stroke();

          // Brass handle angled at 45 degrees
          ctx.strokeStyle = isNear ? '#ca8a04' : '#854d0e';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.moveTo(mgX + mgRadius * 0.7, mgY + mgRadius * 0.7);
          ctx.lineTo(mgX + mgRadius * 1.5, mgY + mgRadius * 1.5);
          ctx.stroke();

          // Clue Count Tag Pill
          if (clueCount > 0) {
            const countLabel = language === 'hi' ? `${clueCount} सुराग` :
              language === 'hinglish' ? `${clueCount} Saboot` :
                `${clueCount} Clue${clueCount > 1 ? 's' : ''}`;

            ctx.font = 'bold 10px "Nirmala UI", "Segoe UI", sans-serif';
            const pillW = ctx.measureText(countLabel).width + 16;
            const pillX = mgX + mgRadius + 10;

            // Engraved pill background
            ctx.fillStyle = '#171107';
            ctx.strokeStyle = isNear ? '#f5c97a' : '#b8893d';
            ctx.lineWidth = 1.4;
            ctx.beginPath();
            ctx.roundRect(pillX, mgY - 10, pillW, 20, 10);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = isNear ? '#ffeaad' : '#fef08a';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(countLabel, pillX + pillW / 2, mgY);
          }

          // Approaches / Hovered: Floating Tooltip Banner with [E] Key
          if (isNear) {
            const examinePrompt = language === 'hi' ? `[E] ${obj.title} (जांचें)` :
              language === 'hinglish' ? `[E] ${obj.title} (Talashi Lo)` :
                `[E] ${obj.title}`;

            ctx.font = 'bold 11px "Nirmala UI", "Segoe UI", monospace';
            const tooltipW = ctx.measureText(examinePrompt).width + 24;
            const tooltipY = badgeY - 26;

            ctx.fillStyle = '#0a0d13';
            ctx.strokeStyle = '#d4a359';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.roundRect(obj.x - tooltipW / 2, tooltipY - 12, tooltipW, 24, 4);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffdf88';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(examinePrompt, obj.x, tooltipY);
          }
          ctx.restore();
        }
        ctx.restore();
      }

      // ----------------------------------------------------
      // SECTION F: DETECTIVE AVATAR (PROPORTIONED ILLUSTRATION)
      // ----------------------------------------------------
      ctx.save();

      // Draggable selection highlight / reticle
      const isMouseDraggable = controlMode !== 'keyboard';
      if (isMouseDraggable) {
        ctx.save();
        if (isDraggingPlayerRef.current) {
          // Active drag golden dashed reticle
          ctx.strokeStyle = '#d4a359';
          ctx.lineWidth = 2;
          ctx.setLineDash([5, 4]);
          ctx.lineDashOffset = -flameTime.current * 8;
          ctx.beginPath();
          ctx.ellipse(posX, posY + 4, 25, 11, 0, 0, Math.PI * 2);
          ctx.stroke();

          ctx.fillStyle = 'rgba(212, 163, 89, 0.22)';
          ctx.beginPath();
          ctx.ellipse(posX, posY + 4, 23, 10, 0, 0, Math.PI * 2);
          ctx.fill();

          // Golden directional tether to pointer position
          if (dragPointerPosRef.current) {
            const ptrX = dragPointerPosRef.current.x;
            const ptrY = dragPointerPosRef.current.y;
            ctx.strokeStyle = 'rgba(212, 163, 89, 0.75)';
            ctx.lineWidth = 2;
            ctx.setLineDash([6, 5]);
            ctx.beginPath();
            ctx.moveTo(posX, posY - 23);
            ctx.lineTo(ptrX, ptrY);
            ctx.stroke();

            // Destination pointer target reticle
            ctx.setLineDash([]);
            ctx.fillStyle = 'rgba(212, 163, 89, 0.3)';
            ctx.strokeStyle = '#f5c97a';
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.arc(ptrX, ptrY, 12, 0, Math.PI * 2);
            ctx.fill();
            ctx.stroke();

            ctx.fillStyle = '#ffdf88';
            ctx.beginPath();
            ctx.arc(ptrX, ptrY, 3, 0, Math.PI * 2);
            ctx.fill();
          }
        } else if (isHoveringPlayerRef.current) {
          // Subtle hover ring when mouse is over detective
          ctx.strokeStyle = 'rgba(212, 163, 89, 0.85)';
          ctx.lineWidth = 1.5;
          ctx.setLineDash([4, 4]);
          ctx.beginPath();
          ctx.ellipse(posX, posY + 4, 24, 10, 0, 0, Math.PI * 2);
          ctx.stroke();

          const detHeadY = posY - 54;
          ctx.fillStyle = '#0a0d13';
          ctx.strokeStyle = '#d4a359';
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.roundRect(posX - 25, detHeadY - 26, 50, 18, 4);
          ctx.fill();
          ctx.stroke();

          ctx.fillStyle = '#f5efe6';
          ctx.font = 'bold 9px "Nirmala UI", "Segoe UI", monospace';
          ctx.textAlign = 'center';
          ctx.textBaseline = 'middle';
          ctx.fillText('DRAG ✥', posX, detHeadY - 17);
        } else if (controlMode === 'mouse') {
          ctx.strokeStyle = 'rgba(212, 163, 89, 0.35)';
          ctx.lineWidth = 1;
          ctx.setLineDash([3, 4]);
          ctx.beginPath();
          ctx.ellipse(posX, posY + 4, 22, 9, 0, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      }

      // 1. Realistic Multi-Layer Soft Drop Shadow
      ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
      ctx.beginPath();
      ctx.ellipse(posX, posY + 4, 18, 7, 0, 0, Math.PI * 2);
      ctx.fill();

      // Idle breathing offset & walking bob
      const idleBreathing = !isMoving ? Math.sin(flameTime.current * 2.5) * 1.2 : 0;
      const walkBob = isMoving ? Math.sin(walkCycle * 2) * 2.2 : 0;
      const detY = posY - 52 + idleBreathing + walkBob;

      // 2. Directional Lantern / Glass Warm Forward Beam
      ctx.save();
      const beamAngle = facing === 'left' ? Math.PI :
        facing === 'right' ? 0 :
          facing === 'up' ? -Math.PI / 2 :
            Math.PI / 2;
      const lanternX = facing === 'left' ? posX - 16 :
        facing === 'right' ? posX + 16 :
          posX;
      const lanternY = detY + 30;

      const lanternCone = ctx.createRadialGradient(lanternX, lanternY, 4, lanternX, lanternY, 75);
      lanternCone.addColorStop(0, 'rgba(255, 230, 150, 0.28)');
      lanternCone.addColorStop(0.5, 'rgba(245, 180, 80, 0.12)');
      lanternCone.addColorStop(1, 'transparent');
      ctx.fillStyle = lanternCone;
      ctx.beginPath();
      ctx.arc(lanternX, lanternY, 75, beamAngle - 0.6, beamAngle + 0.6);
      ctx.lineTo(lanternX, lanternY);
      ctx.closePath();
      ctx.fill();
      ctx.restore();

      // 3. Polished Leather Boots & Stride Animation
      ctx.fillStyle = '#0f1115';
      if (isMoving) {
        const legSwing = Math.sin(walkCycle) * 6;
        // Left boot
        ctx.fillRect(posX - 7 + legSwing, posY - 12, 5, 14);
        // Right boot
        ctx.fillRect(posX + 2 - legSwing, posY - 12, 5, 14);
        // Boot heels
        ctx.fillStyle = '#1c1712';
        ctx.fillRect(posX - 7 + legSwing, posY - 2, 6, 4);
        ctx.fillRect(posX + 2 - legSwing, posY - 2, 6, 4);
      } else {
        // Natural standing stance
        ctx.fillRect(posX - 7, posY - 12, 5, 14);
        ctx.fillRect(posX + 2, posY - 12, 5, 14);
        ctx.fillStyle = '#1c1712';
        ctx.fillRect(posX - 7, posY - 2, 6, 4);
        ctx.fillRect(posX + 2, posY - 2, 6, 4);
      }

      // 4. Tailored Charcoal Wool Trenchcoat Silhouette
      const coatSway = isMoving ? Math.sin(walkCycle) * 3 : 0;
      ctx.fillStyle = '#221f1d';
      ctx.beginPath();
      ctx.moveTo(posX - 11, detY + 16);
      ctx.lineTo(posX + 11, detY + 16);
      // Coat flare
      ctx.lineTo(posX + 15 + coatSway, detY + 46);
      ctx.lineTo(posX - 15 + coatSway, detY + 46);
      ctx.closePath();
      ctx.fill();

      // Peaked Trenchcoat Lapels & Center Seam
      ctx.fillStyle = '#191715';
      ctx.beginPath();
      ctx.moveTo(posX - 7, detY + 16);
      ctx.lineTo(posX, detY + 31);
      ctx.lineTo(posX + 7, detY + 16);
      ctx.fill();

      // Double-breasted brass buttons
      ctx.fillStyle = '#b8893d';
      ctx.fillRect(posX - 4, detY + 22, 2, 2);
      ctx.fillRect(posX + 2, detY + 22, 2, 2);
      ctx.fillRect(posX - 4, detY + 27, 2, 2);
      ctx.fillRect(posX + 2, detY + 27, 2, 2);

      // Belt with Brass Buckle
      ctx.fillStyle = '#151311';
      ctx.fillRect(posX - 13, detY + 31, 26, 4);
      ctx.fillStyle = '#c59a4c';
      ctx.fillRect(posX - 3, detY + 31, 6, 4);

      // Sleeves & Hand Holding Vintage Lantern/Glass
      ctx.fillStyle = '#221f1d';
      if (facing === 'left') {
        ctx.fillRect(posX - 14, detY + 18, 5, 18);
        // Hand & Brass glass
        ctx.fillStyle = '#ecd2b9';
        ctx.fillRect(posX - 16, detY + 33, 4, 4);
        ctx.fillStyle = '#d4a359';
        ctx.beginPath();
        ctx.arc(posX - 18, detY + 34, 4, 0, Math.PI * 2);
        ctx.stroke();
      } else if (facing === 'right') {
        ctx.fillRect(posX + 9, detY + 18, 5, 18);
        ctx.fillStyle = '#ecd2b9';
        ctx.fillRect(posX + 12, detY + 33, 4, 4);
        ctx.fillStyle = '#d4a359';
        ctx.beginPath();
        ctx.arc(posX + 16, detY + 34, 4, 0, Math.PI * 2);
        ctx.stroke();
      } else {
        ctx.fillRect(posX - 14, detY + 18, 5, 18);
        ctx.fillRect(posX + 9, detY + 18, 5, 18);
      }

      // 5. Head & Classic Detective Fedora
      ctx.fillStyle = '#ecd2b9';
      ctx.beginPath();
      ctx.arc(posX, detY + 8, 8, 0, Math.PI * 2);
      ctx.fill();

      // Fedora Felt & Burgundy Silk Hatband
      ctx.fillStyle = '#151311';
      // Wide curved brim
      ctx.beginPath();
      ctx.ellipse(posX, detY + 5, 16, 4, 0, 0, Math.PI * 2);
      ctx.fill();
      // Creased pinched crown
      ctx.fillRect(posX - 9, detY - 6, 18, 10);

      // Burgundy silk hatband ribbon
      ctx.fillStyle = '#7a1f31';
      ctx.fillRect(posX - 9, detY + 1, 18, 2.5);

      // Subtle directional gaze
      if (facing === 'left') {
        ctx.fillStyle = '#0f0e0c';
        ctx.fillRect(posX - 8, detY - 1, 4, 3);
      } else if (facing === 'right') {
        ctx.fillStyle = '#0f0e0c';
        ctx.fillRect(posX + 4, detY - 1, 4, 3);
      }
      ctx.restore();

      // ----------------------------------------------------
      // SECTION G: AMBIENT DUST MOTES & FIREPLACE EMBERS
      // ----------------------------------------------------
      // Amber Floating Dust Motes
      ctx.fillStyle = 'rgba(230, 184, 110, 0.32)';
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

      // Rising Fireplace Embers (Drawing Room)
      if (isDrawingRoom) {
        for (const em of embers.current) {
          em.x += em.speedX;
          em.y += em.speedY;
          em.life += 1;
          if (em.life > em.maxLife) {
            em.x = 580 + (Math.random() - 0.5) * 70;
            em.y = 310 + Math.random() * 15;
            em.life = 0;
          }
          const alpha = 1 - em.life / em.maxLife;
          ctx.fillStyle = `rgba(255, 140, 40, ${alpha * 0.75})`;
          ctx.beginPath();
          ctx.arc(em.x, em.y, em.size, 0, Math.PI * 2);
          ctx.fill();
        }
      }

      // ----------------------------------------------------
      // SECTION H: CINEMATIC VIGNETTE & ROOM ENTRY FADE
      // ----------------------------------------------------
      const vigGrad = ctx.createRadialGradient(W / 2, H / 2, W * 0.35, W / 2, H / 2, W * 0.72);
      vigGrad.addColorStop(0, 'transparent');
      vigGrad.addColorStop(1, 'rgba(3, 5, 8, 0.72)');
      ctx.fillStyle = vigGrad;
      ctx.fillRect(0, 0, W, H);

      // Room entry smooth fade-in
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
  }, [
    roomType,
    interactiveObjects,
    examinedObjectIds,
    controlMode,
    language,
    onObjectClick,
    onObjectProximityChange,
    isPositionValid,
    getObjectClueCount
  ]);

  // Pointer Down: Initiate detective drag if clicked directly on detective
  const handlePointerDown = (e) => {
    if (e.pointerType === 'mouse' && e.button !== 0) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    const allowMouse = controlMode === 'both' || controlMode === 'mouse';
    if (allowMouse && isPointerOnPlayer(canvasX, canvasY)) {
      e.preventDefault();
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // Safe fallback
      }
      isDraggingPlayerRef.current = true;
      activePointerIdRef.current = e.pointerId;
      dragPointerPosRef.current = { x: canvasX, y: canvasY };
      targetPosRef.current = null;
      pendingActionRef.current = null;
      canvas.style.cursor = 'grabbing';

      const onGlobalMove = (ge) => {
        if (!isDraggingPlayerRef.current || ge.pointerId !== activePointerIdRef.current) return;
        const curCanvas = canvasRef.current;
        if (!curCanvas) return;
        const curRect = curCanvas.getBoundingClientRect();
        const sX = curCanvas.width / curRect.width;
        const sY = curCanvas.height / curRect.height;
        dragPointerPosRef.current = {
          x: (ge.clientX - curRect.left) * sX,
          y: (ge.clientY - curRect.top) * sY
        };
      };

      const onGlobalUp = (ge) => {
        if (ge.pointerId === activePointerIdRef.current || isDraggingPlayerRef.current) {
          window.removeEventListener('pointermove', onGlobalMove);
          window.removeEventListener('pointerup', onGlobalUp);
          window.removeEventListener('pointercancel', onGlobalUp);
          handlePointerUp(ge);
        }
      };

      window.addEventListener('pointermove', onGlobalMove);
      window.addEventListener('pointerup', onGlobalUp);
      window.addEventListener('pointercancel', onGlobalUp);
    }
  };

  // Pointer Move: Update drag coordinates and hover state
  const handlePointerMove = (e) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const canvasX = (e.clientX - rect.left) * scaleX;
    const canvasY = (e.clientY - rect.top) * scaleY;

    const allowMouse = controlMode === 'both' || controlMode === 'mouse';

    if (isDraggingPlayerRef.current && e.pointerId === activePointerIdRef.current) {
      dragPointerPosRef.current = { x: canvasX, y: canvasY };
      canvas.style.cursor = 'grabbing';
      return;
    }

    // Hover state over detective
    const isOver = allowMouse && isPointerOnPlayer(canvasX, canvasY);
    isHoveringPlayerRef.current = isOver;

    if (isOver) {
      canvas.style.cursor = 'grab';
    } else {
      const hoveredObj = findClickedObject(canvasX, canvasY);
      canvas.style.cursor = hoveredObj ? 'pointer' : 'default';
    }
  };

  // Pointer Up & Cancel: Safely release capture and stop dragging
  const handlePointerUp = (e) => {
    const canvas = canvasRef.current;
    if (activePointerIdRef.current === e.pointerId || isDraggingPlayerRef.current) {
      if (canvas) {
        try {
          canvas.releasePointerCapture(e.pointerId);
        } catch {
          // Safe fallback
        }
      }
      if (isDraggingPlayerRef.current) {
        lastDragEndTimeRef.current = Date.now();
        justFinishedDragRef.current = true;
        setTimeout(() => {
          justFinishedDragRef.current = false;
        }, 350);
      }
      isDraggingPlayerRef.current = false;
      activePointerIdRef.current = null;
      dragPointerPosRef.current = null;
      if (canvas) {
        canvas.style.cursor = 'default';
      }
    }
  };

  const handlePointerCancel = (e) => {
    handlePointerUp(e);
  };

  // Click on Canvas: Walk or Click Object
  const handleCanvasClick = (e) => {
    if (justFinishedDragRef.current || (Date.now() - lastDragEndTimeRef.current < 350)) {
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    const clickX = (e.clientX - rect.left) * scaleX;
    const clickY = (e.clientY - rect.top) * scaleY;

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
        style={{ touchAction: 'none' }}
        onClick={handleCanvasClick}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerCancel}
        aria-label={`Interactive 2.5D detective scene: ${roomType.replace(/_/g, ' ')}`}
      />
    </div>
  );
}
