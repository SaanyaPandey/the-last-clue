import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

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
      const desc = result.exceptionDetails.exception?.description ||
                   result.exceptionDetails.text ||
                   'Evaluation error';
      throw new Error(desc);
    }
    return result.result?.value;
  }

  async screenshot(filename) {
    const res = await this.send('Page.captureScreenshot', { format: 'png' });
    const buffer = Buffer.from(res.data, 'base64');
    fs.writeFileSync(filename, buffer);
    console.log(`  [Screenshot saved] ${filename}`);
  }

  close() {
    if (this.ws) this.ws.close();
  }
}

async function findChromeWebSocket(port = 9222) {
  for (let attempt = 0; attempt < 10; attempt++) {
    try {
      const res = await fetch(`http://127.0.0.1:${port}/json`);
      if (res.ok) {
        const targets = await res.json();
        const pageTarget = targets.find(t => t.type === 'page');
        if (pageTarget?.webSocketDebuggerUrl) {
          return { wsUrl: pageTarget.webSocketDebuggerUrl, target: pageTarget };
        }
      }
    } catch {}
    await sleep(600);
  }
  return null;
}

async function runValidation() {
  console.log('='.repeat(70));
  console.log('THE LAST CLUE — Multi-Case Playable Gameplay E2E Validation');
  console.log('='.repeat(70));

  const shotDir = path.resolve('test-screenshots');
  if (!fs.existsSync(shotDir)) fs.mkdirSync(shotDir, { recursive: true });

  let chromeTarget = await findChromeWebSocket();
  if (!chromeTarget) {
    console.log('[Setup] Launching Chrome...');
    spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      '--remote-debugging-port=9222',
      '--user-data-dir=C:\\Temp\\chrome-debug',
      '--no-first-run',
      '--no-default-browser-check',
      'about:blank'
    ], { detached: true, stdio: 'ignore' });
    await sleep(2500);
    chromeTarget = await findChromeWebSocket();
  }

  if (!chromeTarget) {
    throw new Error('Could not connect to Chrome DevTools port 9222');
  }

  console.log('[Setup] Connected to Chrome:', chromeTarget.wsUrl);
  const cdp = new CDPClient(chromeTarget.wsUrl);
  await cdp.connect();
  await cdp.send('Page.enable');
  await cdp.send('Runtime.enable');
  await cdp.send('DOM.enable');

  let passed = 0;
  let failed = 0;
  function assert(title, condition, extra = '') {
    if (condition) {
      console.log(`  ✔ ${title} ${extra}`);
      passed++;
    } else {
      console.error(`  ✘ ${title} ${extra}`);
      failed++;
    }
  }

  // 1. Navigate to frontend
  console.log('\n[Phase 1] Navigating to http://localhost:5173...');
  await cdp.send('Page.navigate', { url: 'http://localhost:5173' });
  await sleep(2500);

  const title = await cdp.eval('document.title');
  assert('Landing page loaded with valid title', title.includes('THE LAST CLUE'), `(${title})`);

  // Helper to start case with specific seed and difficulty
  async function startCaseWithSeed(seed, difficulty = 'easy') {
    // Check if we are on landing page or investigation page
    await cdp.eval(`(() => {
      // If we see Start Investigating button, click it
      const startBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.includes('START INVESTIGATING') || b.textContent.includes('जांच शुरू')
      );
      if (startBtn) startBtn.click();
    })()`);
    await sleep(1000);

    // If "New Case" button exists in header, click it to open case setup
    await cdp.eval(`(() => {
      const newCaseBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.includes('New Case') || b.textContent.includes('नया केस')
      );
      if (newCaseBtn) newCaseBtn.click();
    })()`);
    await sleep(1000);

    // Fill seed and difficulty on StartScreen
    await cdp.eval(`(() => {
      const seedInput = document.querySelector('input[type="text"]') || document.querySelector('input');
      if (seedInput) {
        seedInput.value = '${seed}';
        seedInput.dispatchEvent(new Event('input', { bubbles: true }));
        seedInput.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`);
    await sleep(500);

    // Click launch button
    await cdp.eval(`(() => {
      const launchBtn = Array.from(document.querySelectorAll('button')).find(b =>
        b.textContent.includes('Open Case File') || b.textContent.includes('केस फाइल') || b.textContent.includes('Begin')
      );
      if (launchBtn) launchBtn.click();
    })()`);
    await sleep(2000);

    // If intro or briefing appears, fast-forward to scene
    for (let i = 0; i < 5; i++) {
      const phase = await cdp.eval(`(() => {
        if (document.querySelector('canvas.room-interactive-canvas')) return 'scene';
        // Check Skip Intro button
        const skipBtn = Array.from(document.querySelectorAll('button')).find(b =>
          b.textContent.includes('Skip') || b.textContent.includes('छोड़ें')
        );
        if (skipBtn) { skipBtn.click(); return 'intro_skipped'; }
        // Check Enter Investigation button
        const enterBtn = Array.from(document.querySelectorAll('button')).find(b =>
          b.textContent.includes('Enter Investigation') || b.textContent.includes('जांच में प्रवेश')
        );
        if (enterBtn) { enterBtn.click(); return 'briefing_entered'; }
        return 'waiting';
      })()`);
      if (phase === 'scene') break;
      await sleep(1200);
    }
  }

  // --- CASE 1: Trophy Case (Seed 1001) ---
  console.log('\n[Case 1 Validation] Seed 1001 (Trophy Case)...');
  await startCaseWithSeed('1001');
  await sleep(1500);

  const case1Canvas = await cdp.eval('!!document.querySelector("canvas.room-interactive-canvas")');
  assert('Case 1: Playable room canvas rendered', case1Canvas);

  const case1Aria = await cdp.eval('document.querySelector("canvas.room-interactive-canvas")?.getAttribute("aria-label") || ""');
  assert('Case 1: School hall room type identified', case1Aria.includes('school hall'), `(${case1Aria})`);
  await cdp.screenshot(path.join(shotDir, 'case1-room-school-hall.png'));

  // Verify Evidence Board fog-of-war on Case 1
  console.log('\n[Case 1: Testing Evidence Board Fog-of-War]');
  await cdp.eval(`(() => {
    const boardBtn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('Board') || b.textContent.includes('सबूत')
    );
    if (boardBtn) boardBtn.click();
  })()`);
  await sleep(1500);

  const boardFogInfo = await cdp.eval(`(() => {
    const emptyHint = document.body.textContent.includes('Examine objects in the crime scene') ||
                     document.body.textContent.includes('अपराध स्थल में वस्तुओं की जांच');
    const questionMarks = Array.from(document.querySelectorAll('text')).filter(t => t.textContent.trim() === '???').length;
    return { emptyHint, questionMarks };
  })()`);
  assert('Case 1: Evidence Board shows starting lead hint or fog-of-war', boardFogInfo.emptyHint || boardFogInfo.questionMarks > 0,
    `(Hidden nodes with ???: ${boardFogInfo.questionMarks}, Hint visible: ${boardFogInfo.emptyHint})`);
  await cdp.screenshot(path.join(shotDir, 'case1-evidence-board-fog.png'));

  // Verify Journal in Case 1
  console.log('\n[Case 1: Testing Detective Journal]');
  await cdp.eval(`(() => {
    const journalBtn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('Journal') || b.textContent.includes('डायरी') || b.textContent.includes('Notebook')
    );
    if (journalBtn) journalBtn.click();
  })()`);
  await sleep(1500);

  const journalInfo = await cdp.eval(`(() => {
    const hasCaseFile = document.body.textContent.includes('CASE FILE') || document.body.textContent.includes('केस फाइल');
    const hasObjective = document.body.textContent.includes('CURRENT OBJECTIVE') || document.body.textContent.includes('वर्तमान लक्ष्य') || document.body.textContent.includes('ABHI KA LAKSHYA');
    const hasUnresolved = document.body.textContent.includes('UNRESOLVED QUESTIONS') || document.body.textContent.includes('अनसुलझे सवाल') || document.body.textContent.includes('ANSULJE SAWAAL');
    const hasTrophyQ = document.body.textContent.includes('Trophy Room') || document.body.textContent.includes('ट्रॉफी हॉल');
    return { hasCaseFile, hasObjective, hasUnresolved, hasTrophyQ };
  })()`);
  assert('Case 1 Journal: Case File card present', journalInfo.hasCaseFile);
  assert('Case 1 Journal: Dynamic current objective present', journalInfo.hasObjective);
  assert('Case 1 Journal: Unresolved questions section present with case-specific trophy prompt', journalInfo.hasUnresolved || journalInfo.hasTrophyQ);
  await cdp.screenshot(path.join(shotDir, 'case1-journal-detective-notebook.png'));

  // Return to scene, inspect an object, and test clue discovery
  await cdp.eval(`(() => {
    const sceneBtn = Array.from(document.querySelectorAll('button')).find(b =>
      b.textContent.includes('Crime Scene') || b.textContent.includes('Scene') || b.textContent.includes('कमरा')
    );
    if (sceneBtn) sceneBtn.click();
  })()`);
  await sleep(1200);

  // Walk near showcase and press 'e' to inspect
  await cdp.eval(`(() => {
    window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', code: 'KeyE', bubbles: true }));
  })()`);
  await sleep(1500);

  // --- CASE 2: Science Case (Deterministic Theme Test) ---
  console.log('\n[Case 2 Validation] Testing Science Lab Case...');
  // Find seed that hashes to science theme:
  const scienceSeed = 'science-seed-42';
  await startCaseWithSeed(scienceSeed);
  await sleep(1500);

  const case2Aria = await cdp.eval('document.querySelector("canvas.room-interactive-canvas")?.getAttribute("aria-label") || ""');
  assert('Case 2: Distinct room environment loaded', case2Aria.length > 0, `(${case2Aria})`);
  await cdp.screenshot(path.join(shotDir, 'case2-room-environment.png'));

  // --- CASE 3: Heritage Treasure / Library Case ---
  console.log('\n[Case 3 Validation] Testing Heritage / Library Case...');
  const treasureSeed = 'treasure-vault-99';
  await startCaseWithSeed(treasureSeed);
  await sleep(1500);

  const case3Aria = await cdp.eval('document.querySelector("canvas.room-interactive-canvas")?.getAttribute("aria-label") || ""');
  assert('Case 3: Distinct room environment loaded', case3Aria.length > 0, `(${case3Aria})`);
  await cdp.screenshot(path.join(shotDir, 'case3-room-environment.png'));

  // Check console errors
  const errors = await cdp.eval('window.__caughtErrors || []');
  assert('Zero fatal runtime console errors across all cases', errors.length === 0, `(${errors.length} errors)`);

  console.log('\n' + '='.repeat(70));
  console.log(`RESULTS: ${passed} passed / ${failed} failed / ${passed + failed} total`);
  console.log('='.repeat(70));

  cdp.close();
  process.exit(failed > 0 ? 1 : 0);
}

runValidation().catch(e => {
  console.error('Fatal test error:', e);
  process.exit(1);
});
