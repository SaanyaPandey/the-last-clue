import { describe, it } from 'node:test';
import assert from 'node:assert';
import { CASE_THEMES, getCaseTheme, getThematicRoomObjects } from '../game/caseThemes.js';
import { locales } from '../localization/locales/index.js';

describe('Story-Driven Case Themes & Objectives System', () => {
  it('1. Defines 4 unique age-appropriate, non-violent mystery themes', () => {
    const expectedKeys = ['trophy', 'science', 'treasure', 'library'];
    assert.deepStrictEqual(Object.keys(CASE_THEMES), expectedKeys);

    for (const key of expectedKeys) {
      const theme = CASE_THEMES[key];
      assert.strictEqual(theme.key, key);
      assert.ok(theme.titleKey, `${key} must have a titleKey`);
      assert.ok(theme.taglineKey, `${key} must have a taglineKey`);
      assert.ok(theme.locationNameKey, `${key} must have a locationNameKey`);
      assert.ok(theme.complainantKey, `${key} must have a complainantKey`);
      assert.ok(theme.timeKey, `${key} must have a timeKey`);
      assert.ok(theme.missionKey, `${key} must have a missionKey`);
      assert.ok(theme.primaryRoom, `${key} must have a primary room`);
      assert.ok(theme.secondaryRoom, `${key} must have a secondary room`);
      assert.ok(theme.rooms[theme.primaryRoom], `${key} must define primary room config`);
      assert.ok(theme.rooms[theme.secondaryRoom], `${key} must define secondary room config`);
    }
  });

  it('2. Determines case theme deterministically from seed', () => {
    const themeA = getCaseTheme(12345);
    const themeB = getCaseTheme(12345);
    assert.strictEqual(themeA.key, themeB.key);

    // Preferred theme override
    const explicitTrophy = getCaseTheme(99999, 'trophy');
    assert.strictEqual(explicitTrophy.key, 'trophy');

    const explicitScience = getCaseTheme(99999, 'science');
    assert.strictEqual(explicitScience.key, 'science');

    // Default fallback when seed is null/undefined
    const defaultTheme = getCaseTheme(null);
    assert.strictEqual(defaultTheme.key, 'trophy');
  });

  it('3. Generates thematic room objects matching the case theme and clues', () => {
    const mockClues = [
      { id: 'clue_torn_letter', name: 'Torn Letter', description: 'A torn message' },
      { id: 'clue_muddy_footprints', name: 'Muddy Tracks', description: 'Fresh footprints' },
      { id: 'clue_broken_pocket_watch', name: 'Broken Pocket Watch', description: 'Stopped at 4:15' }
    ];

    const trophyRooms = getThematicRoomObjects('trophy', mockClues);
    assert.ok(trophyRooms.school_hall, 'school_hall must exist');
    assert.ok(trophyRooms.school_library, 'school_library must exist');

    // Verify presence of interactive objects & door
    const hallObjs = trophyRooms.school_hall;
    const door = hallObjs.find(o => o.isDoor);
    assert.ok(door, 'door must exist in primary room');
    assert.strictEqual(door.targetRoom, 'school_library');

    const decorative = hallObjs.find(o => o.isDecorative);
    assert.ok(decorative, 'decorative object must exist for believable environment');
  });

  it('4. Provides complete localization dictionaries in Hinglish, English, and Hindi', () => {
    const localeList = [
      { name: 'hinglish', dict: locales.hinglish },
      { name: 'en', dict: locales.en },
      { name: 'hi', dict: locales.hi }
    ];

    for (const { name, dict } of localeList) {
      assert.ok(dict.caseIntro, `caseIntro missing in ${name}`);
      assert.ok(dict.caseIntro.skipBtn, `skipBtn missing in ${name}`);
      assert.ok(dict.caseIntro.startBriefingBtn, `startBriefingBtn missing in ${name}`);
      assert.ok(dict.caseIntro.step1Badge, `step1Badge missing in ${name}`);
      assert.ok(dict.caseIntro.step5Badge, `step5Badge missing in ${name}`);

      assert.ok(dict.briefing, `briefing missing in ${name}`);
      assert.ok(dict.briefing.enterInvestigationBtn, `enterInvestigationBtn missing in ${name}`);
      assert.ok(dict.briefing.missionLabel, `missionLabel missing in ${name}`);

      assert.ok(dict.objectives, `objectives missing in ${name}`);
      assert.ok(dict.objectives.step1Title, `step1Title missing in ${name}`);
      assert.ok(dict.objectives.step5Title, `step5Title missing in ${name}`);

      assert.ok(dict.hints, `hints missing in ${name}`);
      assert.ok(dict.hints.tier1Badge, `tier1Badge missing in ${name}`);
      assert.ok(dict.hints.tier3Badge, `tier3Badge missing in ${name}`);

      assert.ok(dict.caseThemes, `caseThemes missing in ${name}`);
      assert.ok(dict.caseThemes.trophy.title, `trophy title missing in ${name}`);
      assert.ok(dict.caseThemes.science.title, `science title missing in ${name}`);
      assert.ok(dict.caseThemes.treasure.title, `treasure title missing in ${name}`);
      assert.ok(dict.caseThemes.library.title, `library title missing in ${name}`);
    }
  });

  it('5. Guarantees zero solution secrecy tokens in frontend mystery logic', () => {
    // Check that caseThemes does not embed actualCulprit, isGuilty, or solution references
    const serializedThemes = JSON.stringify(CASE_THEMES);
    assert.ok(!serializedThemes.includes('actualCulprit'), 'Must not contain actualCulprit');
    assert.ok(!serializedThemes.includes('isGuilty'), 'Must not contain isGuilty');
    assert.ok(!serializedThemes.includes('culpritId'), 'Must not contain culpritId');
    assert.ok(!serializedThemes.includes('.solution'), 'Must not contain .solution');
  });
});
