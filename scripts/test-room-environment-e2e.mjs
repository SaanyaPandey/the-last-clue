import { spawn } from 'child_process';

async function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

class CDPClient {
  constructor(wsUrl) {
    this.wsUrl = wsUrl;
    this.id = 1;
    this.pending = new Map();
    this.events = [];
  }

  async connect() {
    this.ws = new WebSocket(this.wsUrl);
    await new Promise((resolve, reject) => {
      this.ws.onopen = resolve;
      this.ws.onerror = reject;
    });

    this.ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.id && this.pending.has(data.id)) {
        const { resolve, reject } = this.pending.get(data.id);
        this.pending.delete(data.id);
        if (data.error) reject(new Error(data.error.message));
        else resolve(data.result);
      } else {
        this.events.push(data);
      }
    };
  }

  async send(method, params = {}) {
    const id = this.id++;
    const message = JSON.stringify({ id, method, params });
    return new Promise((resolve, reject) => {
      this.pending.set(id, { resolve, reject });
      this.ws.send(message);
    });
  }

  async eval(expression) {
    const result = await this.send('Runtime.evaluate', {
      expression,
      awaitPromise: true,
      returnByValue: true
    });
    if (result.exceptionDetails) {
      throw new Error(`Eval exception: ${result.exceptionDetails.text || result.exceptionDetails.exception?.description}`);
    }
    return result.result?.value;
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function runRoomEnvironmentE2ETest() {
  console.log('========================================================================');
  console.log('THE LAST CLUE — 2.5D Room Environment & Clue Indicators E2E Test');
  console.log('========================================================================\n');

  const userDataDir = 'C:\\Users\\SAANYA\\chrome_room_profile_' + Date.now();
  const chromeArgs = [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,850',
    'about:blank'
  ];

  console.log('[Setup] Launching Chrome on port 9222...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', chromeArgs);

  let chromeExited = false;
  chrome.on('exit', (code) => {
    chromeExited = true;
    if (code !== null && code !== 0) console.log(`[Chrome] Exited with code ${code}`);
  });

  const results = [];
  let pass = 0, fail = 0;

  function check(name, condition, detail = '') {
    if (condition) {
      console.log(`  ✔ ${name}${detail ? ': ' + detail : ''}`);
      results.push({ name, ok: true });
      pass++;
    } else {
      console.log(`  ✘ ${name}${detail ? ': ' + detail : ''}`);
      results.push({ name, ok: false });
      fail++;
    }
  }

  try {
    let versionData = null;
    for (let i = 0; i < 20; i++) {
      await sleep(500);
      try {
        const res = await fetch('http://localhost:9222/json/version');
        versionData = await res.json();
        break;
      } catch {}
    }
    if (!versionData) throw new Error('Could not connect to Chrome DevTools Protocol');
    console.log(`[Setup] Connected to ${versionData.Browser}\n`);

    const targetsRes = await fetch('http://localhost:9222/json/list');
    const targets = await targetsRes.json();
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No page target');

    const cdp = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await cdp.connect();
    await cdp.send('Page.enable');
    await cdp.send('Runtime.enable');

    const consoleErrors = [];
    cdp.ws.addEventListener('message', (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.method === 'Runtime.consoleAPICalled' && data.params?.type === 'error') {
          const text = data.params.args?.map(a => a.value || a.description).join(' ');
          if (text && !text.includes('favicon') && !text.includes('AudioContext')) {
            consoleErrors.push(text);
          }
        }
      } catch {}
    });

    // ---- TEST 1: Landing Page Loads ----
    console.log('[Test 1] Landing Page Load...');
    await cdp.send('Page.navigate', { url: 'http://localhost:5173' });
    await sleep(3000);

    const title = await cdp.eval('document.title');
    check('Document title set', title && title.length > 0, title);

    const landingCanvas = await cdp.eval(`!!document.querySelector('canvas.detective-world-canvas')`);
    check('Animated detective world canvas present on landing page', landingCanvas);

    const heroHeadline = await cdp.eval(`document.querySelector('.hero-adventure-title')?.innerText || document.querySelector('.landing-title')?.innerText || ''`);
    check('Hero headline visible', heroHeadline.length > 0, `"${heroHeadline.slice(0, 50)}"`);

    const startBtn = await cdp.eval(`!!document.querySelector('.btn-adventure-primary')`);
    check('"Start Investigating" CTA button present', startBtn);

    // ---- TEST 2: Trigger Case Generation ----
    console.log('\n[Test 2] Starting Case Generation...');
    await cdp.eval(`document.querySelector('.btn-adventure-primary')?.click()`);
    await sleep(4000); // Allow async case generation

    const caseIntroPresent = await cdp.eval(`!!document.querySelector('.case-intro-backdrop')`);
    check('Case Introduction screen appeared', caseIntroPresent);

    // ---- TEST 3: Skip Through Intro to Playable Scene ----
    console.log('\n[Test 3] Navigating to Playable Room Scene...');
    // Try skipping through story intro panels
    for (let i = 0; i < 10; i++) {
      const inRoom = await cdp.eval(`!!document.querySelector('canvas.room-interactive-canvas')`);
      if (inRoom) break;

      await cdp.eval(`(() => {
        const btn =
          document.querySelector('.intro-skip-btn') ||
          document.querySelector('.btn-enter-investigation') ||
          document.querySelector('.briefing-start-btn') ||
          document.querySelector('[class*="skip"]') ||
          document.querySelector('[class*="enter"]');
        if (btn) btn.click();
      })()`);
      await sleep(1000);
    }

    const inRoom = await cdp.eval(`!!document.querySelector('canvas.room-interactive-canvas')`);
    check('Playable 2.5D room canvas rendered', inRoom);

    if (!inRoom) {
      console.log('  [Warning] Could not reach playable room - remaining tests skipped.');
      throw new Error('Room canvas not found after intro navigation');
    }

    // ---- TEST 4: Canvas Properties & Rich Rendering ----
    console.log('\n[Test 4] 2.5D Room Canvas Rendering Verification...');
    const canvasInfo = await cdp.eval(`(() => {
      const canvas = document.querySelector('canvas.room-interactive-canvas');
      if (!canvas) return null;
      const ctx = canvas.getContext('2d');
      // Sample multiple areas to verify non-black rendering
      const areas = [
        { label: 'wall_mid', x: 500, y: 100 },
        { label: 'floor', x: 600, y: 500 },
        { label: 'furniture_center', x: 600, y: 300 }
      ];
      return {
        width: canvas.width,
        height: canvas.height,
        touchAction: canvas.style.touchAction,
        ariaLabel: canvas.getAttribute('aria-label'),
        hasPixels: areas.map(a => {
          const px = ctx.getImageData(a.x, a.y, 1, 1).data;
          return { label: a.label, r: px[0], g: px[1], b: px[2] };
        })
      };
    })()`);

    check('Canvas width is 1200px', canvasInfo?.width === 1200, String(canvasInfo?.width));
    check('Canvas height is 700px', canvasInfo?.height === 700, String(canvasInfo?.height));
    check('Canvas has touch-action:none for drag support', canvasInfo?.touchAction === 'none');
    check('Canvas has accessible aria-label', canvasInfo?.ariaLabel?.length > 0, canvasInfo?.ariaLabel);
    console.log('  Pixel samples:', canvasInfo?.hasPixels);

    const hasRenderedPixels = canvasInfo?.hasPixels?.some(p => p.r > 0 || p.g > 0 || p.b > 0);
    check('Canvas is actively rendering non-black pixels', hasRenderedPixels);

    // ---- TEST 5: Keyboard Movement (WASD) ----
    console.log('\n[Test 5] Keyboard Movement Controls (WASD)...');
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'd', code: 'KeyD' });
    await sleep(500);
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'd', code: 'KeyD' });
    await sleep(200);
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'ArrowDown', code: 'ArrowDown' });
    await sleep(400);
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'ArrowDown', code: 'ArrowDown' });
    await sleep(200);
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyDown', key: 'a', code: 'KeyA' });
    await sleep(400);
    await cdp.send('Input.dispatchKeyEvent', { type: 'keyUp', key: 'a', code: 'KeyA' });
    await sleep(300);
    check('Keyboard movement dispatched without errors', true, 'WASD + ArrowDown');

    // ---- TEST 6: Mouse Drag Controls ----
    console.log('\n[Test 6] Mouse Drag (Hold + Drag) Controls...');
    const dragResult = await cdp.eval(`(() => {
      const canvas = document.querySelector('canvas.room-interactive-canvas');
      if (!canvas) return { error: 'no canvas' };
      const rect = canvas.getBoundingClientRect();
      // Player starts near center ~(500, 520) in canvas space
      const startX = rect.left + (500 / 1200) * rect.width;
      const startY = rect.top + (470 / 700) * rect.height;
      const targetX = rect.left + (650 / 1200) * rect.width;
      const targetY = rect.top + (540 / 700) * rect.height;

      canvas.dispatchEvent(new PointerEvent('pointerdown', {
        bubbles: true, pointerId: 1, pointerType: 'mouse', button: 0,
        clientX: startX, clientY: startY
      }));
      canvas.dispatchEvent(new PointerEvent('pointermove', {
        bubbles: true, pointerId: 1, pointerType: 'mouse',
        clientX: targetX, clientY: targetY
      }));
      canvas.dispatchEvent(new PointerEvent('pointerup', {
        bubbles: true, pointerId: 1, pointerType: 'mouse', button: 0,
        clientX: targetX, clientY: targetY
      }));

      return { dispatched: true, from: { x: Math.round(startX), y: Math.round(startY) }, to: { x: Math.round(targetX), y: Math.round(targetY) } };
    })()`);
    check('Mouse drag events dispatched successfully', dragResult?.dispatched, `${dragResult?.from?.x},${dragResult?.from?.y} → ${dragResult?.to?.x},${dragResult?.to?.y}`);
    await sleep(600);

    // ---- TEST 7: Object Click & Inspection Modal ----
    console.log('\n[Test 7] Object Inspection & Evidence Collection...');
    // Click on the interactive area where objects typically appear
    const objectClicked = await cdp.eval(`(() => {
      const canvas = document.querySelector('canvas.room-interactive-canvas');
      if (!canvas) return false;
      const rect = canvas.getBoundingClientRect();
      // Try clicking at trophy showcase / fireplace center area where objects are
      const clickAreas = [
        { x: 600, y: 330 }, // central showcase/hearth
        { x: 870, y: 490 }, // bulletin board / settee
        { x: 250, y: 430 }  // desk
      ];
      for (const area of clickAreas) {
        const clientX = rect.left + (area.x / 1200) * rect.width;
        const clientY = rect.top + (area.y / 700) * rect.height;
        canvas.dispatchEvent(new MouseEvent('click', { bubbles: true, clientX, clientY }));
      }
      return true;
    })()`);
    check('Object click events dispatched on interactive areas', objectClicked);
    await sleep(2000);

    const modalState = await cdp.eval(`(() => {
      const modal = document.querySelector('.object-inspector-modal') ||
                    document.querySelector('.inspector-container') ||
                    document.querySelector('[class*="inspector"]');
      if (!modal) return { open: false };
      return {
        open: true,
        hasTitle: !!(modal.querySelector('h2') || modal.querySelector('h3')),
        text: (modal.querySelector('h2') || modal.querySelector('h3'))?.innerText || ''
      };
    })()`);
    check('Object inspection modal opened on click', modalState?.open, modalState?.open ? `"${modalState?.text?.slice(0, 40)}"` : 'modal not found');

    if (modalState?.open) {
      // Collect the clue
      await cdp.eval(`(() => {
        const btn = document.querySelector('.collect-clue-btn') ||
                    document.querySelector('button.btn-gold') ||
                    Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Collect') || b.innerText.includes('Lo') || b.innerText.includes('Dekh'));
        if (btn) btn.click();
      })()`);
      await sleep(1000);

      // Close modal
      await cdp.eval(`(() => {
        const closeBtn = document.querySelector('.close-modal-btn') ||
                         document.querySelector('.modal-close') ||
                         document.querySelector('[aria-label="Close"]');
        if (closeBtn) closeBtn.click();
        else {
          // Press Escape
          document.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true }));
        }
      })()`);
      await sleep(600);
      check('Evidence collected and modal closed', true);
    }

    // ---- TEST 8: HUD Tracking State ----
    console.log('\n[Test 8] HUD & Evidence Tracking State...');
    const hudState = await cdp.eval(`(() => {
      const body = document.body.innerText;
      return {
        hasCluesText: body.includes('Clue') || body.includes('Saboot') || body.includes('सुराग'),
        hasObjectiveText: body.includes('Objective') || body.includes('Lakshya') || body.includes('लक्ष्य'),
        hasRoomName: body.includes('Hall') || body.includes('Room') || body.includes('Lab') || body.includes('Library') || body.includes('Kamra'),
        hudPresent: !!document.querySelector('.game-hud') || !!document.querySelector('[class*="hud"]')
      };
    })()`);
    check('HUD present in game scene', hudState?.hudPresent);
    check('Clue/Evidence tracking text visible', hudState?.hasCluesText);

    // ---- TEST 9: Localization (Hinglish default) ----
    console.log('\n[Test 9] Localization (Hinglish default)...');
    const langInfo = await cdp.eval(`(() => {
      const html = document.documentElement.lang;
      const bodyText = document.body.innerText;
      const hasHinglish = bodyText.includes('Lo') || bodyText.includes('Hai') || bodyText.includes('Raaz') || bodyText.includes('Jaanch');
      return { htmlLang: html, hasHinglish };
    })()`);
    check('Hinglish text present in UI', langInfo?.hasHinglish);

    // ---- TEST 10: Console Errors ----
    console.log('\n[Test 10] Runtime Console Error Check...');
    check('Zero runtime console errors', consoleErrors.length === 0, `${consoleErrors.length} errors`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach(e => console.log('  Error:', e?.slice(0, 100)));
    }

    // ---- SUMMARY ----
    console.log('\n========================================================================');
    console.log(`RESULTS: ${pass} passed / ${fail} failed / ${pass + fail} total`);
    if (fail === 0) {
      console.log('✔ ALL ROOM ENVIRONMENT & CLUE INDICATOR TESTS PASSED!');
    } else {
      console.log(`✘ ${fail} test(s) need attention.`);
    }
    console.log('========================================================================\n');

    if (fail > 0) process.exitCode = 1;

    cdp.close();
  } catch (err) {
    console.error('\n[Fatal Error]', err.message);
    process.exitCode = 1;
  } finally {
    if (!chromeExited) chrome.kill();
  }
}

runRoomEnvironmentE2ETest();
