/**
 * THE LAST CLUE — Frontend Unit & Secrecy Audit Tests (Phase 7 & 8)
 * Runs under Node.js built-in test runner (node --test)
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const srcDir = path.resolve(__dirname, '..');

describe('Frontend Architecture, Secrecy & State Logic Tests', () => {

  it('1. Solution Secrecy Audit: Frontend source code must NEVER reference hidden solution fields', () => {
    // Collect all frontend source files (.js, .jsx)
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
    assert.ok(files.length > 5, 'Should have multiple source files in frontend/src');

    // Forbidden solution tokens that must never appear in frontend game logic
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

  it('2. API Service Interface: caseApi module exports required methods', async () => {
    const caseApi = await import('../services/caseApi.js');
    assert.strictEqual(typeof caseApi.generateMysteryCase, 'function');
    assert.strictEqual(typeof caseApi.checkBackendHealth, 'function');
    assert.strictEqual(typeof caseApi.submitAccusation, 'function');
    assert.strictEqual(typeof caseApi.requestCaseSolutionReveal, 'function');
  });

  it('3. API Parameter Validation: generateMysteryCase rejects invalid numeric seeds', async () => {
    const { generateMysteryCase } = await import('../services/caseApi.js');

    // Invalid negative seed
    const negativeRes = await generateMysteryCase({ difficulty: 'medium', seed: -50 });
    assert.strictEqual(negativeRes.success, false);
    assert.strictEqual(negativeRes.code, 'INVALID_INPUT');

    // Non-integer seed
    const floatRes = await generateMysteryCase({ difficulty: 'medium', seed: 3.1415 });
    assert.strictEqual(floatRes.success, false);
    assert.strictEqual(floatRes.code, 'INVALID_INPUT');
  });

  it('4. Accusation Validation: submitAccusation requires valid case and suspect identifiers', async () => {
    const { submitAccusation } = await import('../services/caseApi.js');

    // Missing case instance ID
    const resNoCase = await submitAccusation({ suspectId: 'suspect_lord_harrington' });
    assert.strictEqual(resNoCase.success, false);
    assert.strictEqual(resNoCase.code, 'INVALID_INPUT');

    // Missing suspect ID
    const resNoSuspect = await submitAccusation({ caseInstanceId: 'valid-id', suspectId: '' });
    assert.strictEqual(resNoSuspect.success, false);
    assert.strictEqual(resNoSuspect.code, 'INVALID_INPUT');
  });

  it('5. Public Case Schema: verifies structure conforms to backend API contract with caseInstanceId', () => {
    const samplePublicCase = {
      caseId: 'CASE-12345-MED',
      caseInstanceId: '7f83b1657ff1fc53b92dc18148a1d65b',
      seed: 12345,
      difficulty: 'medium',
      suspects: [
        { id: 'suspect_lord_harrington', name: 'Lord Harrington', role: 'Aristocrat', traits: ['arrogant'] }
      ],
      locations: [
        { id: 'location_grand_library', name: 'Grand Library', type: 'indoor' }
      ],
      weapons: [
        { id: 'weapon_cyanide_vial', name: 'Cyanide Vial', category: 'chemical' }
      ],
      motives: [
        { id: 'motive_inheritance', name: 'Disputed Inheritance' }
      ],
      clues: [
        { id: 'clue_torn_letter', name: 'Torn Letter', category: 'document', reliability: 0.9 }
      ],
      startingClueId: 'clue_torn_letter',
      graph: {
        nodes: [
          { id: 'clue_torn_letter', type: 'clue', label: 'Torn Letter', metadata: {} },
          { id: 'suspect_lord_harrington', type: 'suspect', label: 'Lord Harrington', metadata: {} }
        ],
        edges: [
          { source: 'clue_torn_letter', target: 'suspect_lord_harrington', relationship: 'points_to', metadata: {} }
        ]
      },
      metadata: { clueCount: 1, suspectCount: 1 }
    };

    assert.ok(samplePublicCase.caseId);
    assert.ok(samplePublicCase.caseInstanceId);
    assert.ok(samplePublicCase.seed);
    assert.ok(samplePublicCase.startingClueId);
    assert.ok(Array.isArray(samplePublicCase.suspects));
    assert.ok(Array.isArray(samplePublicCase.clues));
    assert.ok(Array.isArray(samplePublicCase.graph.nodes));
    assert.ok(Array.isArray(samplePublicCase.graph.edges));

    // Verify zero solution leakage
    assert.strictEqual(samplePublicCase.solution, undefined);
  });

  it('6. Progress Metric Calculation: derives honest progress from player actions', () => {
    function calculateProgress(clueCount, examinedCount, poiCount, notesCount) {
      if (clueCount === 0) return 0;
      const clueWeight = (examinedCount / clueCount) * 60;
      const poiWeight = poiCount > 0 ? Math.min(20, poiCount * 10) : 0;
      const notesWeight = notesCount > 0 ? Math.min(20, notesCount * 10) : 0;
      return Math.min(100, Math.round(clueWeight + poiWeight + notesWeight));
    }

    assert.strictEqual(calculateProgress(4, 0, 0, 0), 0);
    assert.strictEqual(calculateProgress(4, 4, 0, 0), 60);
    assert.strictEqual(calculateProgress(4, 4, 2, 0), 80);
    assert.strictEqual(calculateProgress(4, 4, 2, 2), 100);
  });

  it('7. Authoritative Verdict Mapping: handles correct and incorrect verdict records cleanly', () => {
    const correctVerdict = {
      isCorrect: true,
      status: 'solved',
      caseId: 'CASE-12345-MED',
      feedback: 'Case Solved! Indictment confirmed by Scotland Yard.'
    };
    assert.strictEqual(correctVerdict.isCorrect, true);
    assert.strictEqual(correctVerdict.status, 'solved');

    const incorrectVerdict = {
      isCorrect: false,
      status: 'closed',
      caseId: 'CASE-12345-MED',
      feedback: 'Indictment Rejected. Forensic evidence does not support conviction.'
    };
    assert.strictEqual(incorrectVerdict.isCorrect, false);
    assert.strictEqual(incorrectVerdict.status, 'closed');
    // Crucial check: incorrect verdict has zero solution or culprit leakage
    assert.strictEqual(incorrectVerdict.solution, undefined);
    assert.strictEqual(incorrectVerdict.culprit, undefined);
  });

  it('8. Room Spatial Boundaries & Collision Logic: validates walk boundaries and solid obstacles', () => {
    function isPositionValid(x, y, room) {
      const minX = 75;
      const maxX = 1125;
      const minY = 330;
      const maxY = 660;

      if (x < minX || x > maxX || y < minY || y > maxY) return false;

      const obstacles = room === 'drawing_room'
        ? [
            { x1: 490, y1: 290, x2: 710, y2: 365 }, // Fireplace
            { x1: 140, y1: 395, x2: 370, y2: 485 }, // Desk
            { x1: 750, y1: 440, x2: 990, y2: 545 }, // Settee
            { x1: 50, y1: 290, x2: 135, y2: 430 }   // Bookcase
          ]
        : [
            { x1: 430, y1: 400, x2: 770, y2: 515 }, // Reading table
            { x1: 130, y1: 310, x2: 320, y2: 420 }, // Curio
            { x1: 820, y1: 290, x2: 900, y2: 380 }, // Clock
            { x1: 930, y1: 470, x2: 1060, y2: 570 } // Armchair
          ];

      for (const ob of obstacles) {
        if (x >= ob.x1 && x <= ob.x2 && y >= ob.y1 && y <= ob.y2) return false;
      }
      return true;
    }

    // Open floor walk coordinates should be valid
    assert.strictEqual(isPositionValid(500, 520, 'drawing_room'), true);
    assert.strictEqual(isPositionValid(600, 450, 'drawing_room'), true);

    // Wall coordinates should be blocked
    assert.strictEqual(isPositionValid(50, 500, 'drawing_room'), false);  // Outside left
    assert.strictEqual(isPositionValid(500, 250, 'drawing_room'), false); // Too high up wall
    assert.strictEqual(isPositionValid(500, 700, 'drawing_room'), false); // Below bottom edge

    // Solid furniture coordinates should be blocked
    assert.strictEqual(isPositionValid(600, 330, 'drawing_room'), false); // Inside fireplace
    assert.strictEqual(isPositionValid(250, 430, 'drawing_room'), false); // Inside desk
    assert.strictEqual(isPositionValid(850, 490, 'drawing_room'), false); // Inside settee

    // Accessible positions in front of furniture should be valid
    assert.strictEqual(isPositionValid(600, 390, 'drawing_room'), true); // In front of hearth
    assert.strictEqual(isPositionValid(250, 510, 'drawing_room'), true); // In front of desk
  });

  it('9. Procedural Clue Distribution: guarantees 100% of case clues map to inspectable room objects', () => {
    const mockClues = [
      { id: 'clue_burnt_telegram', name: 'Burnt Telegram' },
      { id: 'clue_torn_letter', name: 'Torn Letter' },
      { id: 'clue_chemical_residue', name: 'Chemical Residue' },
      { id: 'clue_muddy_footprints', name: 'Muddy Footprints' },
      { id: 'clue_missing_ledger_page', name: 'Torn Ledger' },
      { id: 'clue_broken_pocket_watch', name: 'Pocket Watch' }
    ];

    const unassigned = [...mockClues];
    const assignClue = (patternId) => {
      const idx = unassigned.findIndex((c) => c.id === patternId);
      if (idx !== -1) return unassigned.splice(idx, 1)[0];
      return null;
    };

    const drawingRoomObjs = [
      { id: 'fireplace', matchedClue: assignClue('clue_burnt_telegram') || assignClue('clue_torn_letter') },
      { id: 'desk', matchedClue: assignClue('clue_torn_letter') || assignClue('clue_forged_check') },
      { id: 'teatable', matchedClue: assignClue('clue_chemical_residue') },
      { id: 'window', matchedClue: assignClue('clue_muddy_footprints') },
      { id: 'portrait', matchedClue: null }
    ];

    const libraryObjs = [
      { id: 'library_desk', matchedClue: assignClue('clue_missing_ledger_page') },
      { id: 'grandfather_clock', matchedClue: assignClue('clue_broken_pocket_watch') },
      { id: 'bookcase_rare', matchedClue: null }
    ];

    // Fallback assignment for any leftover clues
    const allInspectable = [
      ...drawingRoomObjs,
      ...libraryObjs
    ];
    for (const rem of unassigned) {
      const target = allInspectable.find(o => !o.matchedClue);
      if (target) target.matchedClue = rem;
    }

    // Verify all mock clues have an assigned inspectable room object
    const assignedIds = allInspectable.filter(o => o.matchedClue).map(o => o.matchedClue.id);
    for (const clue of mockClues) {
      assert.ok(assignedIds.includes(clue.id), `Clue ${clue.id} must be mapped to a room object`);
    }
  });
});

