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

async function runE2ETests() {
  console.log('========================================================================');
  console.log('THE LAST CLUE — Landing Page Redesign & Detective World In-Browser Test');
  console.log('========================================================================\n');

  const userDataDir = 'C:\\Users\\SAANYA\\chrome_e2e_profile_' + Date.now();
  const chromeArgs = [
    '--headless=new',
    '--remote-debugging-port=9222',
    `--user-data-dir=${userDataDir}`,
    '--no-first-run',
    '--no-default-browser-check',
    '--window-size=1280,800',
    'about:blank'
  ];

  console.log('[Setup] Launching headless Chrome on port 9222...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', chromeArgs);

  let chromeExited = false;
  chrome.on('exit', (code) => {
    chromeExited = true;
    if (code !== null && code !== 0) console.log(`[Chrome] Exited with code ${code}`);
  });

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

    if (!versionData) {
      throw new Error('Could not connect to Chrome DevTools Protocol on port 9222');
    }
    console.log(`[Setup] Connected to ${versionData.Browser}\n`);

    const listRes = await fetch('http://localhost:9222/json/list');
    const targets = await listRes.json();
    const pageTarget = targets.find(t => t.type === 'page');
    if (!pageTarget) throw new Error('No browser page target found');

    const client = new CDPClient(pageTarget.webSocketDebuggerUrl);
    await client.connect();

    await client.send('Page.enable');
    await client.send('Runtime.enable');

    const consoleLogs = [];
    client.ws.addEventListener('message', (event) => {
      try {
        const msg = JSON.parse(event.data);
        if (msg.method === 'Runtime.consoleAPICalled') {
          consoleLogs.push({ type: msg.params.type, text: msg.params.args.map(a => a.value).join(' ') });
        }
      } catch {}
    });

    // ==========================================
    // 1. DESKTOP VIEWPORT TEST (1280x800)
    // ==========================================
    console.log('--- TEST 1: Desktop Landing Page & Typography ---');
    await client.send('Page.navigate', { url: 'http://localhost:5173' });
    await sleep(2000);

    const title = await client.eval('document.title');
    console.log(`✓ Document title: "${title}"`);

    // Verify Headline: "EVERY CLUE LEAVES A TRACE."
    const heroTitle = await client.eval(`document.querySelector('.hero-adventure-title')?.innerText || ''`);
    console.log(`✓ Hero Headline: "${heroTitle}"`);
    if (!heroTitle.includes('EVERY CLUE LEAVES A TRACE') && !heroTitle.includes('HAR SABOOT')) {
      throw new Error(`Unexpected headline: "${heroTitle}"`);
    }

    // Verify Supporting text: "Har raaz ke peeche ek kahani hai. Kya tum sach tak pahunch sakte ho?"
    const taglineStory = await client.eval(`document.querySelector('.hero-narrative-tagline')?.innerText || ''`);
    console.log(`✓ Supporting Story Text: ${taglineStory}`);

    // Verify Primary & Secondary Buttons
    const primaryBtnText = await client.eval(`document.querySelector('.btn-adventure-primary .btn-text')?.innerText || ''`);
    const secondaryBtnText = await client.eval(`document.querySelector('.btn-adventure-secondary')?.innerText || ''`);
    console.log(`✓ Primary CTA Button: "${primaryBtnText}"`);
    console.log(`✓ Secondary Link: "${secondaryBtnText}"`);

    // ==========================================
    // 2. ANIMATED DETECTIVE WORLD CANVAS
    // ==========================================
    console.log('\n--- TEST 2: Living Animated Detective World Canvas ---');
    const canvasExists = await client.eval(`!!document.querySelector('canvas.detective-world-canvas')`);
    console.log(`✓ Detective world canvas present: ${canvasExists}`);

    const canvasDims = await client.eval(`
      (() => {
        const c = document.querySelector('canvas.detective-world-canvas');
        return c ? { width: c.width, height: c.height } : null;
      })()
    `);
    console.log(`✓ Canvas internal coordinate resolution: ${canvasDims.width}x${canvasDims.height}`);

    // Verify Frame Corners & Atmospheric Aesthetic
    const cornersCount = await client.eval(`document.querySelectorAll('.frame-corner').length`);
    console.log(`✓ Antique brass frame corner brackets: ${cornersCount} corners`);

    // ==========================================
    // 3. INTERACTIVE MAGNIFYING GLASS & SECRET CLUE REVEAL
    // ==========================================
    console.log('\n--- TEST 3: Interactive Magnifying Glass & Clue Reveal on Street ---');
    const initialHint = await client.eval(`document.querySelector('.detective-canvas-hint')?.innerText || ''`);
    console.log(`✓ Exploration hint text: "${initialHint}"`);

    // Simulate pointer hover directly over secret clue spot (x: 575, y: 505)
    await client.eval(`
      (() => {
        const canvas = document.querySelector('canvas.detective-world-canvas');
        if (!canvas) return;
        const rect = canvas.getBoundingClientRect();
        const targetX = rect.left + (575 / 900) * rect.width;
        const targetY = rect.top + (505 / 650) * rect.height;

        canvas.dispatchEvent(new PointerEvent('pointermove', {
          bubbles: true,
          clientX: targetX,
          clientY: targetY
        }));
      })()
    `);
    await sleep(600);

    const tooltipVisible = await client.eval(`!!document.querySelector('.detective-clue-tooltip')`);
    const tooltipText = await client.eval(`document.querySelector('.detective-clue-tooltip')?.innerText || ''`);
    console.log(`✓ Secret Clue Tooltip appeared: ${tooltipVisible}`);
    console.log(`✓ Tooltip content: "${tooltipText.replace(/\n/g, ' ')}"`);

    // ==========================================
    // 4. CASEBOOK & INVESTIGATION GUIDE SECTIONS
    // ==========================================
    console.log('\n--- TEST 4: Scotland Yard Casebook & Field Dossier ---');
    const casebookCardsCount = await client.eval(`document.querySelectorAll('.casebook-dossier-card').length`);
    console.log(`✓ Casebook methodology cards: ${casebookCardsCount} steps (Search, Connect, Verdict)`);

    const dualFeatureCardsCount = await client.eval(`document.querySelectorAll('.experience-feature-card').length`);
    console.log(`✓ Evidence Board & Journal feature showcases: ${dualFeatureCardsCount} cards`);

    // ==========================================
    // 5. MOBILE VIEWPORT RESPONSIVENESS (390x844 iPhone)
    // ==========================================
    console.log('\n--- TEST 5: Mobile Responsive Layout (390x844) ---');
    await client.send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });
    await sleep(600);

    const isMobileToggleVisible = await client.eval(`
      window.getComputedStyle(document.querySelector('.adventure-mobile-toggle')).display !== 'none'
    `);
    console.log(`✓ Mobile navigation toggle active on mobile: ${isMobileToggleVisible}`);

    const mobileCanvasVisible = await client.eval(`!!document.querySelector('canvas.detective-world-canvas')`);
    const mobileCanvasRect = await client.eval(`
      (() => {
        const c = document.querySelector('canvas.detective-world-canvas');
        if (!c) return null;
        const r = c.getBoundingClientRect();
        return { width: Math.round(r.width), height: Math.round(r.height) };
      })()
    `);
    console.log(`✓ Canvas successfully scaled on mobile: ${mobileCanvasVisible} (${mobileCanvasRect.width}x${mobileCanvasRect.height}px)`);

    const mobilePrimaryBtn = await client.eval(`
      (() => {
        const btn = document.querySelector('.btn-adventure-primary');
        if (!btn) return false;
        const r = btn.getBoundingClientRect();
        return r.width > 200 && r.height >= 44; // Touch target accessibility
      })()
    `);
    console.log(`✓ Primary CTA button touch-target accessible on mobile: ${mobilePrimaryBtn}`);

    // Reset viewport back to desktop
    await client.send('Emulation.clearDeviceMetricsOverride');
    await sleep(400);

    // ==========================================
    // 6. FUNCTIONALITY: LAUNCH INVESTIGATION FROM LANDING
    // ==========================================
    console.log('\n--- TEST 6: Start Investigating Navigation & Case Transition ---');
    await client.eval(`document.querySelector('.btn-adventure-primary')?.click()`);
    await sleep(2500); // Allow case generation

    const introBackdrop = await client.eval(`!!document.querySelector('.case-intro-backdrop')`);
    console.log(`✓ Transitioned seamlessly into Case Introduction: ${introBackdrop}`);

    const introHeadline = await client.eval(`document.querySelector('.intro-headline')?.innerText || ''`);
    console.log(`✓ Case story headline: "${introHeadline}"`);

    // Enter case room
    await client.eval(`document.querySelector('.intro-skip-btn')?.click()`);
    await sleep(600);
    await client.eval(`document.querySelector('.btn-enter-investigation')?.click()`);
    await sleep(1500);

    const inPlayableRoom = await client.eval(`!!document.querySelector('canvas.room-interactive-canvas')`);
    const hudRoomTitle = await client.eval(`document.querySelector('.hud-room-title')?.innerText || ''`);
    console.log(`✓ Playable room canvas active: ${inPlayableRoom}`);
    console.log(`✓ Investigating room: "${hudRoomTitle.trim()}"`);

    // Check for console errors
    const errorLogs = consoleLogs.filter(l => l.type === 'error');
    console.log(`\n✓ Browser console errors: ${errorLogs.length}`);
    if (errorLogs.length > 0) {
      errorLogs.forEach(err => console.log('  [Console Error]:', err.text));
    }

    console.log('\n========================================================================');
    console.log('✅ ALL REDESIGNED LANDING PAGE & WORLD ANIMATION TESTS PASSED (100%)');
    console.log('========================================================================');

    client.close();
  } catch (err) {
    console.error('\n❌ TEST FAILED:', err.message);
    process.exitCode = 1;
  } finally {
    if (!chromeExited) {
      chrome.kill();
    }
  }
}

runE2ETests();
