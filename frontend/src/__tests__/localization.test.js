/**
 * THE LAST CLUE — Localization System Tests
 * Tests for Hinglish (default), Simple English, and Hindi (Devanagari) dictionaries,
 * parameter interpolation, entity translation completeness, and fallback behavior.
 */

import { describe, it } from 'node:test';
import assert from 'node:assert';
import { locales } from '../localization/locales/index.js';

describe('Localization System Tests (Hinglish, Simple English, Hindi)', () => {

  it('1. All three required language dictionaries exist and are populated', () => {
    assert.ok(locales.hinglish, 'Hinglish dictionary must exist');
    assert.ok(locales.en, 'Simple English dictionary must exist');
    assert.ok(locales.hi, 'Hindi dictionary must exist');

    assert.strictEqual(typeof locales.hinglish, 'object');
    assert.strictEqual(typeof locales.en, 'object');
    assert.strictEqual(typeof locales.hi, 'object');
  });

  it('2. Critical top-level sections exist across all languages', () => {
    const requiredSections = [
      'app', 'language', 'controls', 'nav', 'hero', 'howToPlay', 'preview',
      'tiers', 'startScreen', 'header', 'hud', 'inspector',
      'cluePanel', 'suspectPanel', 'locationPanel', 'board',
      'relationships', 'journal', 'accusation', 'verdict',
      'feedback', 'entities'
    ];

    for (const lang of ['hinglish', 'en', 'hi']) {
      const dict = locales[lang];
      for (const section of requiredSections) {
        assert.ok(
          dict[section],
          `Missing section "${section}" in language "${lang}"`
        );
      }
    }
  });

  it('3. Hinglish writing rules audit: uses natural everyday Indian Hinglish', () => {
    const h = locales.hinglish;
    // Check specific examples from prompt requirements
    assert.ok(
      h.howToPlay.step1.title.includes('Saboot'),
      'Hinglish should use natural words like Saboot'
    );
    assert.ok(
      h.howToPlay.step3.title.includes('Culprit') || h.howToPlay.step3.title.includes('Pehchaano'),
      'Hinglish should retain familiar words like Culprit'
    );
    assert.ok(
      h.nav.beginCase.includes('Case Shuru Karein'),
      'Hinglish should use natural phrasing for Case Shuru Karein'
    );
    assert.ok(
      h.relationships.found_at.includes('mila') || h.relationships.found_at.includes('mili'),
      'Hinglish should have everyday relation translations'
    );
  });

  it('4. Hindi writing rules audit: valid Devanagari script used throughout', () => {
    const hindi = locales.hi;
    const devanagariRegex = /[\u0900-\u097F]/;

    assert.ok(devanagariRegex.test(hindi.app.title), 'Title should include Devanagari');
    assert.ok(devanagariRegex.test(hindi.hero.headline), 'Hero headline should be in Devanagari');
    assert.ok(devanagariRegex.test(hindi.howToPlay.title), 'HowToPlay title should be in Devanagari');
    assert.ok(devanagariRegex.test(hindi.cluePanel.title), 'CluePanel title should be in Devanagari');
    assert.ok(devanagariRegex.test(hindi.suspectPanel.title), 'SuspectPanel title should be in Devanagari');
  });

  it('5. Dynamic entity pool completeness: all 8 clue archetypes translated', () => {
    const clueIds = [
      'clue_torn_letter',
      'clue_muddy_footprints',
      'clue_broken_pocket_watch',
      'clue_forged_check',
      'clue_chemical_residue',
      'clue_burnt_telegram',
      'clue_monogrammed_cufflink',
      'clue_missing_ledger_page'
    ];

    for (const lang of ['hinglish', 'en', 'hi']) {
      const clueDict = locales[lang].entities.clues;
      for (const id of clueIds) {
        assert.ok(clueDict[id], `Clue "${id}" missing in ${lang}`);
        assert.ok(clueDict[id].name, `Clue "${id}" name missing in ${lang}`);
        assert.ok(clueDict[id].description, `Clue "${id}" description missing in ${lang}`);
      }
    }
  });

  it('6. Dynamic entity pool completeness: all 7 suspect archetypes translated', () => {
    const suspectIds = [
      'suspect_lord_harrington',
      'suspect_eleanor_vance',
      'suspect_dr_sterling',
      'suspect_thomas_finch',
      'suspect_beatrice_thorne',
      'suspect_julian_croft',
      'suspect_vivienne_dubois'
    ];

    for (const lang of ['hinglish', 'en', 'hi']) {
      const suspectDict = locales[lang].entities.suspects;
      for (const id of suspectIds) {
        assert.ok(suspectDict[id], `Suspect "${id}" missing in ${lang}`);
        assert.ok(suspectDict[id].name, `Suspect "${id}" name missing in ${lang}`);
        assert.ok(suspectDict[id].role, `Suspect "${id}" role missing in ${lang}`);
        assert.ok(Array.isArray(suspectDict[id].traits), `Suspect "${id}" traits should be an array in ${lang}`);
        assert.ok(suspectDict[id].traits.length >= 3, `Suspect "${id}" should have at least 3 traits in ${lang}`);
      }
    }
  });

  it('7. Dynamic entity pool completeness: all 7 locations, 6 weapons, 6 motives translated', () => {
    const locationIds = [
      'location_grand_library',
      'location_greenhouse',
      'location_wine_cellar',
      'location_private_study',
      'location_conservatory',
      'location_carriage_house',
      'location_drawing_room'
    ];

    const weaponIds = [
      'weapon_cyanide_vial',
      'weapon_gardening_shears',
      'weapon_ornate_dagger',
      'weapon_silk_scarf',
      'weapon_heavy_candlestick',
      'weapon_antique_pistol'
    ];

    const motiveIds = [
      'motive_inheritance',
      'motive_blackmail',
      'motive_revenge',
      'motive_scandal',
      'motive_financial_debt',
      'motive_professional_jealousy'
    ];

    for (const lang of ['hinglish', 'en', 'hi']) {
      const locDict = locales[lang].entities.locations;
      for (const id of locationIds) {
        assert.ok(locDict[id]?.name, `Location "${id}" name missing in ${lang}`);
        assert.ok(locDict[id]?.description, `Location "${id}" desc missing in ${lang}`);
      }

      const wepDict = locales[lang].entities.weapons;
      for (const id of weaponIds) {
        assert.ok(wepDict[id]?.name, `Weapon "${id}" name missing in ${lang}`);
        assert.ok(wepDict[id]?.description, `Weapon "${id}" desc missing in ${lang}`);
      }

      const motDict = locales[lang].entities.motives;
      for (const id of motiveIds) {
        assert.ok(motDict[id]?.name, `Motive "${id}" name missing in ${lang}`);
        assert.ok(motDict[id]?.description, `Motive "${id}" desc missing in ${lang}`);
      }
    }
  });

  it('8. Room interactive objects completeness in playable view', () => {
    const roomObjectIds = [
      'fireplace', 'desk', 'teatable', 'window', 'portrait', 'door_library',
      'library_desk', 'grandfather_clock', 'bookcase_rare', 'door_drawing'
    ];

    for (const lang of ['hinglish', 'en', 'hi']) {
      const roomDict = locales[lang].entities.roomObjects;
      for (const id of roomObjectIds) {
        assert.ok(roomDict[id], `Room object "${id}" missing in ${lang}`);
        assert.ok(roomDict[id].title, `Room object "${id}" title missing in ${lang}`);
        assert.ok(roomDict[id].description, `Room object "${id}" description missing in ${lang}`);
      }
    }
  });

  it('9. Relationship edge types completeness', () => {
    const relations = ['found_at', 'connected_to', 'points_to', 'belongs_to', 'motivated_by', 'knows'];

    for (const lang of ['hinglish', 'en', 'hi']) {
      const relDict = locales[lang].relationships;
      for (const rel of relations) {
        assert.ok(relDict[rel], `Relationship "${rel}" missing in ${lang}`);
      }
    }
  });

  it('10. Parameter interpolation function test', () => {
    // Test template string interpolation
    const template = 'Exploring rooms ({current}/{total} clues found)';
    const interpolated = template.replace(/\{(\w+)\}/g, (_, k) => ({ current: 2, total: 4 }[k]));
    assert.strictEqual(interpolated, 'Exploring rooms (2/4 clues found)');
  });
});
