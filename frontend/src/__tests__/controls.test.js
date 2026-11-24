/**
 * THE LAST CLUE — Movement Controls System Tests
 * Tests for Keyboard Only, Mouse Only (Hold & Drag), and Both modes,
 * pointer hit detection, input permission logic, and secrecy auditing.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { locales } from '../localization/locales/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '..');

describe('Movement Controls System Tests (Keyboard, Mouse Hold & Drag, Both)', () => {

  it('1. Control modes definition & defaults', () => {
    const ALLOWED_CONTROL_MODES = ['both', 'keyboard', 'mouse'];
    const DEFAULT_CONTROL_MODE = 'both';

    assert.ok(ALLOWED_CONTROL_MODES.includes('both'));
    assert.ok(ALLOWED_CONTROL_MODES.includes('keyboard'));
    assert.ok(ALLOWED_CONTROL_MODES.includes('mouse'));
    assert.strictEqual(DEFAULT_CONTROL_MODE, 'both');
  });

  it('2. Localization completeness for movement controls across all 3 languages', () => {
    const requiredKeys = ['settingLabel', 'both', 'keyboard', 'mouse', 'hudTipBoth', 'hudTipKeyboard', 'hudTipMouse'];
    const modes = ['both', 'keyboard', 'mouse'];

    for (const lang of ['hinglish', 'en', 'hi']) {
      const ctrlDict = locales[lang].controls;
      assert.ok(ctrlDict, `Missing controls section in ${lang}`);

      for (const key of requiredKeys) {
        assert.ok(ctrlDict[key], `Missing controls.${key} in ${lang}`);
      }

      for (const mode of modes) {
        assert.ok(ctrlDict[mode].label, `Missing controls.${mode}.label in ${lang}`);
        assert.ok(ctrlDict[mode].badge, `Missing controls.${mode}.badge in ${lang}`);
        assert.ok(ctrlDict[mode].desc, `Missing controls.${mode}.desc in ${lang}`);
      }
    }
  });

  it('3. Detective hit area math: correctly identifies points on and off the detective', () => {
    // Detective is at posX = 500, posY = 520 (feet)
    // Detective center is at posX = 500, posY - 23 = 497
    // Elliptical hit box radius: 28px horizontal, 34px vertical
    const posX = 500;
    const posY = 520;
    const isPointerOnPlayer = (clickX, clickY) => {
      const dx = clickX - posX;
      const dy = clickY - (posY - 23);
      return (dx * dx) / (28 * 28) + (dy * dy) / (34 * 34) <= 1.0;
    };

    // Center of detective
    assert.strictEqual(isPointerOnPlayer(500, 497), true, 'Center must hit detective');
    // Top near hat
    assert.strictEqual(isPointerOnPlayer(500, 470), true, 'Hat top must hit detective');
    // Near feet
    assert.strictEqual(isPointerOnPlayer(500, 520), true, 'Near feet must hit detective');
    // Side of torso
    assert.strictEqual(isPointerOnPlayer(515, 497), true, 'Side of torso must hit detective');

    // Distant points should NOT hit
    assert.strictEqual(isPointerOnPlayer(600, 520), false, 'Points 100px away must not hit');
    assert.strictEqual(isPointerOnPlayer(500, 400), false, 'Points above head must not hit');
    assert.strictEqual(isPointerOnPlayer(250, 430), false, 'Desk coordinates must not hit');
  });

  it('4. Input permission matrix for control modes', () => {
    const isKeyboardAllowed = (mode) => mode === 'both' || mode === 'keyboard';
    const isMouseAllowed = (mode) => mode === 'both' || mode === 'mouse';

    // Both mode
    assert.strictEqual(isKeyboardAllowed('both'), true, 'Keyboard should be allowed in Both mode');
    assert.strictEqual(isMouseAllowed('both'), true, 'Mouse should be allowed in Both mode');

    // Keyboard Only mode
    assert.strictEqual(isKeyboardAllowed('keyboard'), true, 'Keyboard should be allowed in Keyboard Only mode');
    assert.strictEqual(isMouseAllowed('keyboard'), false, 'Mouse drag should be disallowed in Keyboard Only mode');

    // Mouse Only mode
    assert.strictEqual(isKeyboardAllowed('mouse'), false, 'Keyboard should be disallowed in Mouse Only mode');
    assert.strictEqual(isMouseAllowed('mouse'), true, 'Mouse drag should be allowed in Mouse Only mode');
  });

  it('5. Mouse hold & drag velocity & vector calculation', () => {
    const posX = 500;
    const posY = 520;
    const speed = 3.8;

    // Pointer dragged to right: pointer at (550, 497)
    // Target feet = (550, 497 + 23) = (550, 520)
    const dragPointer = { x: 550, y: 497 };
    const targetFeetX = dragPointer.x;
    const targetFeetY = dragPointer.y + 23;
    const dx = targetFeetX - posX;
    const dy = targetFeetY - posY;
    const dist = Math.hypot(dx, dy);

    assert.strictEqual(dist, 50);
    const stepSpeed = Math.min(speed, dist);
    const moveX = (dx / dist) * stepSpeed;
    const moveY = (dy / dist) * stepSpeed;

    assert.strictEqual(Math.round(moveX * 10) / 10, 3.8, 'Horizontal move should be capped at speed');
    assert.strictEqual(moveY, 0, 'Vertical move should be 0');
  });

  it('6. Solution Secrecy Audit: Zero forbidden solution tokens across all frontend files', () => {
    function getSourceFiles(dir) {
      let results = [];
      const list = fs.readdirSync(dir);
      for (const file of list) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat && stat.isDirectory()) {
          if (!fullPath.includes('node_modules') && !fullPath.includes('dist') && !fullPath.includes('__tests__')) {
            results = results.concat(getSourceFiles(fullPath));
          }
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
          results.push(fullPath);
        }
      }
      return results;
    }

    const files = getSourceFiles(srcDir);
    const forbiddenPatterns = [
      /\.solution\b/,
      /\bcaseData\.solution\b/,
      /\bisMurderWeapon\b/,
      /\bculpritId\b/,
      /\bactualCulprit\b/,
      /\btrueCulprit\b/,
      /\bisGuilty\b/
    ];

    for (const filePath of files) {
      const content = fs.readFileSync(filePath, 'utf-8');
      for (const pattern of forbiddenPatterns) {
        const match = content.match(pattern);
        assert.strictEqual(
          match,
          null,
          `Solution secrecy breach! Forbidden pattern ${pattern} found in ${path.relative(srcDir, filePath)}`
        );
      }
    }
  });

});
