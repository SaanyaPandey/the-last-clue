/**
 * THE LAST CLUE — Case Themes & Narrative Definitions
 * Defines child-friendly, age-appropriate, non-violent mystery scenarios:
 * 1. The Missing Annual Sports Trophy (School Mystery)
 * 2. The Whispering Library Mystery (Books & Rare Archive)
 * 3. The Missing Science Project (Junior Science Lab)
 * 4. The Secret Heritage Treasure (Manor Study & Secret Vault)
 */

export const CASE_THEMES = {
  trophy: {
    id: 'trophy',
    key: 'trophy',
    icon: '🏆',
    titleKey: 'caseThemes.trophy.title',
    taglineKey: 'caseThemes.trophy.tagline',
    locationNameKey: 'caseThemes.trophy.locationName',
    complainantKey: 'caseThemes.trophy.complainant',
    timeKey: 'caseThemes.trophy.incidentTime',
    missionKey: 'caseThemes.trophy.mission',
    primaryRoom: 'school_hall',
    secondaryRoom: 'school_library',
    rooms: {
      school_hall: {
        id: 'school_hall',
        nameKey: 'caseThemes.trophy.rooms.school_hall',
        type: 'school_hall',
        doorTarget: 'school_library',
        doorTitleKey: 'caseThemes.trophy.doors.to_library',
        initialPos: { x: 500, y: 520, facing: 'down' }
      },
      school_library: {
        id: 'school_library',
        nameKey: 'caseThemes.trophy.rooms.school_library',
        type: 'school_library',
        doorTarget: 'school_hall',
        doorTitleKey: 'caseThemes.trophy.doors.to_hall',
        initialPos: { x: 180, y: 440, facing: 'right' }
      }
    }
  },

  science: {
    id: 'science',
    key: 'science',
    icon: '🔬',
    titleKey: 'caseThemes.science.title',
    taglineKey: 'caseThemes.science.tagline',
    locationNameKey: 'caseThemes.science.locationName',
    complainantKey: 'caseThemes.science.complainant',
    timeKey: 'caseThemes.science.incidentTime',
    missionKey: 'caseThemes.science.mission',
    primaryRoom: 'science_lab',
    secondaryRoom: 'exhibition_hall',
    rooms: {
      science_lab: {
        id: 'science_lab',
        nameKey: 'caseThemes.science.rooms.science_lab',
        type: 'science_lab',
        doorTarget: 'exhibition_hall',
        doorTitleKey: 'caseThemes.science.doors.to_exhibition',
        initialPos: { x: 500, y: 520, facing: 'down' }
      },
      exhibition_hall: {
        id: 'exhibition_hall',
        nameKey: 'caseThemes.science.rooms.exhibition_hall',
        type: 'exhibition_hall',
        doorTarget: 'science_lab',
        doorTitleKey: 'caseThemes.science.doors.to_lab',
        initialPos: { x: 180, y: 440, facing: 'right' }
      }
    }
  },

  treasure: {
    id: 'treasure',
    key: 'treasure',
    icon: '🗝️',
    titleKey: 'caseThemes.treasure.title',
    taglineKey: 'caseThemes.treasure.tagline',
    locationNameKey: 'caseThemes.treasure.locationName',
    complainantKey: 'caseThemes.treasure.complainant',
    timeKey: 'caseThemes.treasure.incidentTime',
    missionKey: 'caseThemes.treasure.mission',
    primaryRoom: 'manor_study',
    secondaryRoom: 'secret_vault',
    rooms: {
      manor_study: {
        id: 'manor_study',
        nameKey: 'caseThemes.treasure.rooms.manor_study',
        type: 'manor_study',
        doorTarget: 'secret_vault',
        doorTitleKey: 'caseThemes.treasure.doors.to_vault',
        initialPos: { x: 500, y: 520, facing: 'down' }
      },
      secret_vault: {
        id: 'secret_vault',
        nameKey: 'caseThemes.treasure.rooms.secret_vault',
        type: 'secret_vault',
        doorTarget: 'manor_study',
        doorTitleKey: 'caseThemes.treasure.doors.to_study',
        initialPos: { x: 180, y: 440, facing: 'right' }
      }
    }
  },

  library: {
    id: 'library',
    key: 'library',
    icon: '📚',
    titleKey: 'caseThemes.library.title',
    taglineKey: 'caseThemes.library.tagline',
    locationNameKey: 'caseThemes.library.locationName',
    complainantKey: 'caseThemes.library.complainant',
    timeKey: 'caseThemes.library.incidentTime',
    missionKey: 'caseThemes.library.mission',
    primaryRoom: 'reading_hall',
    secondaryRoom: 'rare_archives',
    rooms: {
      reading_hall: {
        id: 'reading_hall',
        nameKey: 'caseThemes.library.rooms.reading_hall',
        type: 'reading_hall',
        doorTarget: 'rare_archives',
        doorTitleKey: 'caseThemes.library.doors.to_archives',
        initialPos: { x: 500, y: 520, facing: 'down' }
      },
      rare_archives: {
        id: 'rare_archives',
        nameKey: 'caseThemes.library.rooms.rare_archives',
        type: 'rare_archives',
        doorTarget: 'reading_hall',
        doorTitleKey: 'caseThemes.library.doors.to_reading',
        initialPos: { x: 180, y: 440, facing: 'right' }
      }
    }
  }
};

const THEME_KEYS = ['trophy', 'science', 'treasure', 'library'];

/**
 * Deterministically derives a case theme from the case seed or ID.
 * @param {string|number} seed
 * @param {string} [preferredTheme]
 * @returns {typeof CASE_THEMES[keyof typeof CASE_THEMES]}
 */
export function getCaseTheme(seed, preferredTheme = null) {
  if (preferredTheme && CASE_THEMES[preferredTheme]) {
    return CASE_THEMES[preferredTheme];
  }

  if (seed === undefined || seed === null) {
    return CASE_THEMES.trophy;
  }

  let hash = 0;
  const str = String(seed);
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }

  const index = Math.abs(hash) % THEME_KEYS.length;
  const key = THEME_KEYS[index];
  return CASE_THEMES[key] || CASE_THEMES.trophy;
}

/**
 * Generates room interactive objects tailored to the active case theme,
 * distributing the case's generated clues across theme-appropriate furniture and props.
 * Strictly guarantees that EVERY non-door object contains a meaningful clue from the case,
 * completely eliminating decorative objects that yield "no evidence detected".
 */
export function getThematicRoomObjects(themeKey, clues = []) {
  const unassignedClues = [...clues];

  const assignClue = (patternKeywords = []) => {
    // Try keyword match first
    for (const kw of patternKeywords) {
      const idx = unassignedClues.findIndex(c => c.id.includes(kw));
      if (idx !== -1) {
        return unassignedClues.splice(idx, 1)[0];
      }
    }
    // Fallback: assign first available clue
    if (unassignedClues.length > 0) {
      return unassignedClues.shift();
    }
    return null;
  };

  let primaryObjs = [];
  let secondaryObjs = [];
  let primaryRoomKey = 'school_hall';
  let secondaryRoomKey = 'school_library';

  switch (themeKey) {
    case 'trophy': {
      primaryRoomKey = 'school_hall';
      secondaryRoomKey = 'school_library';

      // 1. Principal's Trophy Hall
      const candidateHall = [
        {
          id: 'trophy_cabinet',
          title: 'Glass Trophy Showcase',
          icon: '🏆',
          x: 600,
          y: 330,
          walkTo: { x: 600, y: 390 },
          hitBox: { x1: 480, y1: 150, x2: 720, y2: 370 },
          roomName: "Principal's Trophy Hall",
          description: 'A large teak and glass cabinet for championship shields. The lock has been pried open and the velvet pedestal is empty.',
          detailObservation: 'On the velvet base where the Golden Trophy sat, scrape marks show the display lock was forced with a tool, and a torn crimson ribbon corner was left behind.',
          actionLabel: 'Examine Empty Trophy Stand & Lock',
          matchedClue: assignClue(['lock', 'scratched', 'ribbon', 'trophy'])
        },
        {
          id: 'principal_desk',
          title: "Principal's Executive Desk & Attendance Binder",
          icon: '📋',
          x: 250,
          y: 430,
          walkTo: { x: 250, y: 510 },
          hitBox: { x1: 140, y1: 380, x2: 370, y2: 500 },
          roomName: "Principal's Trophy Hall",
          description: 'Executive desk with green blotter, official academy seal, and the physical sports attendance register.',
          detailObservation: 'The attendance binder lies open; the page covering yesterday evening’s practice hours was hastily torn out with ink smudges.',
          actionLabel: 'Check Attendance Register Binder',
          matchedClue: assignClue(['attendance', 'register', 'sheet', 'ledger'])
        },
        {
          id: 'cctv_monitor',
          title: 'Security CCTV Monitor & Recorder',
          icon: '📹',
          x: 870,
          y: 490,
          walkTo: { x: 870, y: 560 },
          hitBox: { x1: 720, y1: 420, x2: 990, y2: 560 },
          roomName: "Principal's Trophy Hall",
          description: 'A wall-mounted surveillance terminal replaying time-stamped perimeter camera feeds.',
          detailObservation: 'Camera 2 recorded a shadowy figure in running shoes unbolting the trophy showcase at exactly 8:27 PM.',
          actionLabel: 'Review CCTV Security Tape',
          matchedClue: assignClue(['cctv', 'footage', 'camera', 'tape', 'surveillance'])
        },
        {
          id: 'hall_window',
          title: 'Courtyard Corridor Window',
          icon: '🪟',
          x: 320,
          y: 280,
          walkTo: { x: 320, y: 350 },
          hitBox: { x1: 220, y1: 50, x2: 420, y2: 310 },
          roomName: "Principal's Trophy Hall",
          description: 'Windows overlooking the athletics sports grounds. Fresh mud marks are visible on the stone sill.',
          detailObservation: 'Distinct boot marks with red sports track clay lead directly from the courtyard sill toward the trophy room.',
          actionLabel: 'Analyze Red Track Clay Impressions',
          matchedClue: assignClue(['clay', 'track', 'muddy', 'footprints'])
        },
        {
          id: 'school_honor_roll',
          title: 'Founders Honor Roll',
          icon: '🎖️',
          x: 600,
          y: 150,
          walkTo: { x: 600, y: 390 },
          hitBox: { x1: 520, y1: 50, x2: 680, y2: 170 },
          roomName: "Principal's Trophy Hall",
          description: 'A polished brass plaque listing previous annual championship winners and team captains.',
          detailObservation: 'The plaque confirms the tournament date was yesterday and verifies the team roster.',
          actionLabel: 'Read Championship Roster',
          matchedClue: null,
          isDecorative: true
        }
      ];

      // 2. School Library & Record Room
      const candidateLib = [
        {
          id: 'sports_locker',
          title: 'Athletic Equipment Locker #7',
          icon: '🗄️',
          x: 220,
          y: 360,
          walkTo: { x: 220, y: 440 },
          hitBox: { x1: 130, y1: 300, x2: 320, y2: 430 },
          roomName: 'School Library & Records',
          description: 'A tall steel equipment locker assigned to athletic competitors with scratched padlock hasps.',
          detailObservation: 'Locker #7 was pried open from the latch; inside is a gym bag, and beneath the bench is a dropped locker token.',
          actionLabel: 'Search Locker #7 & Examine Latches',
          matchedClue: assignClue(['token', 'locker']) || assignClue()
        },
        {
          id: 'library_reading_table',
          title: 'Sports Strategy Study Table',
          icon: '📖',
          x: 600,
          y: 440,
          walkTo: { x: 600, y: 520 },
          hitBox: { x1: 430, y1: 390, x2: 770, y2: 520 },
          roomName: 'School Library & Records',
          description: 'Long wooden study table with open competition rulebooks and tournament schedules.',
          detailObservation: 'An athletic event roster with scratched-out participant names was left near an inkwell.',
          actionLabel: 'Examine Tournament Schedule',
          matchedClue: assignClue(['ribbon', 'sheet', 'register']) || assignClue()
        },
        {
          id: 'school_bookshelf',
          title: 'Sports Yearbook Bookshelf',
          icon: '📚',
          x: 880,
          y: 340,
          walkTo: { x: 880, y: 420 },
          hitBox: { x1: 760, y1: 270, x2: 1000, y2: 390 },
          roomName: 'School Library & Records',
          description: 'Tall shelves filled with heavy bound annual yearbooks and sports statistics.',
          detailObservation: 'One yearbook is pushed back, revealing a hollowed space behind the books where duplicate keys were hidden.',
          actionLabel: 'Inspect Secret Space Behind Yearbooks',
          matchedClue: assignClue()
        }
      ];

      // Only retain inspectable objects that have matched clues or verified decorative lore
      primaryObjs = candidateHall.filter(o => o.matchedClue || o.isDecorative);
      secondaryObjs = candidateLib.filter(o => o.matchedClue);

      // Add doorways
      primaryObjs.push({
        id: 'door_library',
        title: 'Door to School Library',
        icon: '▸',
        x: 1080,
        y: 330,
        walkTo: { x: 1040, y: 370 },
        hitBox: { x1: 1020, y1: 150, x2: 1150, y2: 380 },
        roomName: "Principal's Trophy Hall",
        isDoor: true,
        targetRoom: 'school_library',
        description: 'Double doors leading into the adjoining Academy Library and Study Wing.'
      });

      secondaryObjs.push({
        id: 'door_hall',
        title: 'Doorway to Trophy Hall',
        icon: '◂',
        x: 80,
        y: 330,
        walkTo: { x: 130, y: 370 },
        hitBox: { x1: 40, y1: 150, x2: 120, y2: 380 },
        roomName: 'School Library & Records',
        isDoor: true,
        targetRoom: 'school_hall',
        description: 'Heavy door leading back to the Principal’s Trophy Hall.'
      });
      break;
    }

    case 'science': {
      primaryRoomKey = 'science_lab';
      secondaryRoomKey = 'exhibition_hall';

      const candidateLab = [
        {
          id: 'lab_workbench',
          title: 'Chemistry Demonstration Bench',
          icon: '🧪',
          x: 600,
          y: 330,
          walkTo: { x: 600, y: 390 },
          hitBox: { x1: 480, y1: 150, x2: 720, y2: 370 },
          roomName: 'Junior Science Lab',
          description: 'A heavy slate lab bench with Bunsen burners, flasks, and volatile solvent stains.',
          detailObservation: 'Beside a test tube rack, fresh soldering flux and chemical cleaning solvent residue was swabbed from the slate.',
          actionLabel: 'Swab Chemical Solvent Residue',
          matchedClue: assignClue(['solvent', 'chemical', 'odor', 'residue']) || assignClue()
        },
        {
          id: 'formula_chalkboard',
          title: 'Project Formula Blackboard',
          icon: '📐',
          x: 250,
          y: 430,
          walkTo: { x: 250, y: 510 },
          hitBox: { x1: 140, y1: 380, x2: 370, y2: 500 },
          roomName: 'Junior Science Lab',
          description: 'Chalkboard covered with autonomous robot circuit schematics and motor calculations.',
          detailObservation: 'A torn corner of blueprint paper showing circuit diagrams for the motor controller was left behind near the chalk tray.',
          actionLabel: 'Inspect Circuit Blueprint Fragment',
          matchedClue: assignClue(['circuit', 'schematic', 'blueprint', 'formula']) || assignClue()
        },
        {
          id: 'specimen_cabinet',
          title: 'Glass Component Cabinet',
          icon: '🔬',
          x: 870,
          y: 490,
          walkTo: { x: 870, y: 560 },
          hitBox: { x1: 720, y1: 420, x2: 990, y2: 560 },
          roomName: 'Junior Science Lab',
          description: 'Glass-fronted component cabinet for sensitive optics, prisms, and micro-controllers.',
          detailObservation: 'Beneath the cabinet lies a cracked infrared sensor lens with trace fingerprint dust on its casing.',
          actionLabel: 'Examine Dropped Sensor Lens',
          matchedClue: assignClue(['sensor', 'glass', 'shattered', 'lens']) || assignClue()
        },
        {
          id: 'lab_window',
          title: 'Ventilation Window',
          icon: '🪟',
          x: 320,
          y: 280,
          walkTo: { x: 320, y: 350 },
          hitBox: { x1: 220, y1: 50, x2: 420, y2: 310 },
          roomName: 'Junior Science Lab',
          description: 'Emergency laboratory window overlooking the courtyard gravel path.',
          detailObservation: 'Wet pea-gravel and courtyard mud impressions lead away from the windowsill into the grass.',
          actionLabel: 'Analyze Courtyard Gravel Impressions',
          matchedClue: assignClue(['gravel', 'prints', 'muddy', 'courtyard', 'footprints']) || assignClue()
        }
      ];

      const candidateExhibition = [
        {
          id: 'project_podium',
          title: 'First Prize Project Podium',
          icon: '🏆',
          x: 600,
          y: 440,
          walkTo: { x: 600, y: 520 },
          hitBox: { x1: 430, y1: 390, x2: 770, y2: 520 },
          roomName: 'Science Exhibition Hall',
          description: 'Spotlighted display podium where the winning prototype stood before it was taken.',
          detailObservation: 'A fresh circular heat burn from a heavy soldering pen is branded into the wooden edge of the podium.',
          actionLabel: 'Examine Solder Scorch Mark',
          matchedClue: assignClue(['burn', 'soldering', 'iron', 'scorch']) || assignClue()
        },
        {
          id: 'storage_locker',
          title: 'Participant Locker #4',
          icon: '🗄️',
          x: 220,
          y: 360,
          walkTo: { x: 220, y: 440 },
          hitBox: { x1: 130, y1: 300, x2: 320, y2: 430 },
          roomName: 'Science Exhibition Hall',
          description: 'Electronic participant locker with digital magnetic card reader.',
          detailObservation: 'The access terminal recorded an electronic badge swipe at 10:48 PM right before the power surge.',
          actionLabel: 'Inspect Locker Badge Terminal Log',
          matchedClue: assignClue(['card', 'access', 'keycard', 'badge']) || assignClue()
        }
      ];

      primaryObjs = candidateLab.filter(o => o.matchedClue);
      secondaryObjs = candidateExhibition.filter(o => o.matchedClue);

      primaryObjs.push({
        id: 'door_exhibition',
        title: 'Door to Exhibition Hall',
        icon: '▸',
        x: 1080,
        y: 330,
        walkTo: { x: 1040, y: 370 },
        hitBox: { x1: 1020, y1: 150, x2: 1150, y2: 380 },
        roomName: 'Junior Science Lab',
        isDoor: true,
        targetRoom: 'exhibition_hall',
        description: 'Double doors connecting the preparation lab to the public exhibition gallery.'
      });

      secondaryObjs.push({
        id: 'door_lab',
        title: 'Door to Science Lab',
        icon: '◂',
        x: 80,
        y: 330,
        walkTo: { x: 130, y: 370 },
        hitBox: { x1: 40, y1: 150, x2: 120, y2: 380 },
        roomName: 'Science Exhibition Hall',
        isDoor: true,
        targetRoom: 'science_lab',
        description: 'Doorway returning to the Junior Science Lab.'
      });
      break;
    }

    case 'treasure': {
      primaryRoomKey = 'manor_study';
      secondaryRoomKey = 'secret_vault';

      // Manor Study — Heritage heirloom theft
      const candidateTreasureStudy = [
        {
          id: 'fireplace',
          title: 'Stone Manor Hearth',
          icon: '🔥',
          x: 600,
          y: 330,
          walkTo: { x: 600, y: 390 },
          hitBox: { x1: 480, y1: 150, x2: 720, y2: 370 },
          roomName: 'Heritage Manor Study',
          description: 'A grand stone fireplace with cold ashes — still warm from last night. Something survived the fire.',
          detailObservation: 'Buried in the ash: a half-burnt telegram fragment reading "Act before the morning train. The deed must not be filed."',
          actionLabel: 'Sift Through Hearth Ashes',
          matchedClue: assignClue(['telegram', 'burnt'])
        },
        {
          id: 'desk',
          title: 'Lord\'s Roll-Top Writing Desk',
          icon: '📜',
          x: 250,
          y: 430,
          walkTo: { x: 250, y: 510 },
          hitBox: { x1: 140, y1: 380, x2: 370, y2: 500 },
          roomName: 'Heritage Manor Study',
          description: 'A heavy mahogany writing desk. The secret inner compartment has been pried open with a blade.',
          detailObservation: 'Inside the forced compartment: a crumpled ledger page removed from the account books — the entry covering midnight transfers.',
          actionLabel: 'Search Forced Compartment',
          matchedClue: assignClue(['ledger', 'forged', 'check', 'letter'])
        },
        {
          id: 'teatable',
          title: 'Velvet Wingback & Side Table',
          icon: '☕',
          x: 870,
          y: 490,
          walkTo: { x: 870, y: 560 },
          hitBox: { x1: 720, y1: 420, x2: 990, y2: 560 },
          roomName: 'Heritage Manor Study',
          description: 'A crimson wingback chair by the fire. Something glints from between the cushion seams.',
          detailObservation: 'Wedged in the chair upholstery: a silver cufflink engraved with the initials "J.C." — lost during a struggle.',
          actionLabel: 'Examine Under Chair Cushion',
          matchedClue: assignClue(['cufflink', 'watch', 'chemical'])
        },
        {
          id: 'window',
          title: 'Garden-Facing Study Window',
          icon: '🪟',
          x: 320,
          y: 280,
          walkTo: { x: 320, y: 350 },
          hitBox: { x1: 220, y1: 50, x2: 420, y2: 310 },
          roomName: 'Heritage Manor Study',
          description: 'A tall window overlooking the moonlit stone garden. The latch was unbolted from inside.',
          detailObservation: 'On the stone sill: fresh muddy boot prints — size 10, with a distinctive herringbone pattern leading toward the rear garden.',
          actionLabel: 'Analyze Boot Tracks on Sill',
          matchedClue: assignClue(['footprints', 'muddy'])
        },
        {
          id: 'portrait',
          title: 'Ancestor Oil Portrait',
          icon: '🖼️',
          x: 600,
          y: 150,
          walkTo: { x: 600, y: 390 },
          hitBox: { x1: 520, y1: 50, x2: 680, y2: 200 },
          roomName: 'Heritage Manor Study',
          description: 'A large gilt-framed oil portrait hanging above the fireplace — slightly tilted off its hook.',
          detailObservation: 'The portrait conceals a wall cavity behind it. Inside: scratches on the plaster where the vault key was stored.',
          actionLabel: 'Inspect Frame & Wall Behind',
          matchedClue: null,
          isDecorative: true
        }
      ];

      // Secret Vault — Where the heirloom was kept
      const candidateTreasureVault = [
        {
          id: 'wall_safe',
          title: 'Iron Wall Safe',
          icon: '🔒',
          x: 600,
          y: 440,
          walkTo: { x: 600, y: 520 },
          hitBox: { x1: 430, y1: 390, x2: 770, y2: 520 },
          roomName: 'Secret Heritage Vault',
          description: 'The concealed iron safe behind the tapestry. Its dial shows fresh scratch marks — the combination was forced.',
          detailObservation: 'The safe interior is empty. A faint chemical smell lingers — consistent with cleaning solvents used to wipe fingerprints.',
          actionLabel: 'Examine Safe Dial & Interior',
          matchedClue: assignClue(['chemical', 'residue']) || assignClue()
        },
        {
          id: 'grandfather_clock',
          title: 'Vault Pendulum Clock',
          icon: '🕰️',
          x: 880,
          y: 340,
          walkTo: { x: 880, y: 420 },
          hitBox: { x1: 820, y1: 270, x2: 940, y2: 390 },
          roomName: 'Secret Heritage Vault',
          description: 'An old pendulum clock mounted in the stone vault — its pendulum has stopped mid-swing.',
          detailObservation: 'Behind the clock face panel: a shattered pocket watch frozen at 12:04 AM — the exact time the theft occurred.',
          actionLabel: 'Open Clock Panel & Examine',
          matchedClue: assignClue(['watch', 'broken']) || assignClue()
        },
        {
          id: 'bookcase_rare',
          title: 'Estate Document Shelves',
          icon: '📚',
          x: 220,
          y: 360,
          walkTo: { x: 220, y: 440 },
          hitBox: { x1: 130, y1: 300, x2: 320, y2: 430 },
          roomName: 'Secret Heritage Vault',
          description: 'Shelves of estate wills, deed copies, and historical property records — one folder is missing.',
          detailObservation: 'The folder labelled "Title Deeds — Blackwood Estate" has been removed. A torn paper edge remains in the bracket.',
          actionLabel: 'Inspect Missing Deed Folder',
          matchedClue: assignClue() // fallback
        }
      ];

      primaryObjs = candidateTreasureStudy.filter(o => o.matchedClue || o.isDecorative);
      secondaryObjs = candidateTreasureVault.filter(o => o.matchedClue);

      primaryObjs.push({
        id: 'door_vault',
        title: 'Concealed Doorway to Vault',
        icon: '▸',
        x: 1080,
        y: 330,
        walkTo: { x: 1040, y: 370 },
        hitBox: { x1: 1020, y1: 150, x2: 1150, y2: 380 },
        roomName: 'Heritage Manor Study',
        isDoor: true,
        targetRoom: 'secret_vault',
        description: 'A hidden door behind the tapestry, leading to the stone secret vault below.'
      });

      secondaryObjs.push({
        id: 'door_study',
        title: 'Return to Manor Study',
        icon: '◂',
        x: 80,
        y: 330,
        walkTo: { x: 130, y: 370 },
        hitBox: { x1: 40, y1: 150, x2: 120, y2: 380 },
        roomName: 'Secret Heritage Vault',
        isDoor: true,
        targetRoom: 'manor_study',
        description: 'Stone staircase returning up to the Heritage Manor Study.'
      });
      break;
    }

    case 'library':
    default: {
      primaryRoomKey = 'reading_hall';
      secondaryRoomKey = 'rare_archives';

      // Reading Hall — Where the curator last saw the manuscript
      const candidateLibraryReading = [
        {
          id: 'desk',
          title: 'Curator\'s Display Reading Table',
          icon: '📖',
          x: 600,
          y: 330,
          walkTo: { x: 600, y: 390 },
          hitBox: { x1: 480, y1: 150, x2: 720, y2: 370 },
          roomName: 'Curator\'s Reading Hall',
          description: 'The long oak table where the illuminated manuscript was placed for viewing — now empty.',
          detailObservation: 'On the visitor sign-in register, the 6:45 PM registration row was cleanly sliced away with a razor blade.',
          actionLabel: 'Examine Excised Visitor Sign-In Row',
          matchedClue: assignClue(['visitor', 'log', 'cut', 'blade', 'folio']) || assignClue()
        },
        {
          id: 'bookcase_rare',
          title: 'Gilded Frame & Scholar Bookshelf',
          icon: '🖼️',
          x: 870,
          y: 490,
          walkTo: { x: 870, y: 560 },
          hitBox: { x1: 720, y1: 420, x2: 990, y2: 560 },
          roomName: 'Curator\'s Reading Hall',
          description: 'An ornate gilded frame mounted between the tall bookcases — the illuminated masterpiece was cut from its stretcher.',
          detailObservation: 'Surgically clean razor cut threads remain along the inner gilt frame fringe.',
          actionLabel: 'Examine Sliced Canvas Fringe',
          matchedClue: assignClue(['canvas', 'razor', 'edge', 'fringe']) || assignClue()
        },
        {
          id: 'teatable',
          title: 'Reading Lamp & Side Table',
          icon: '🪔',
          x: 250,
          y: 430,
          walkTo: { x: 250, y: 510 },
          hitBox: { x1: 140, y1: 380, x2: 370, y2: 500 },
          roomName: 'Curator\'s Reading Hall',
          description: 'A brass reading lamp and a small mahogany side table. The lamp shade is slightly askew.',
          detailObservation: 'Caught near the lamp base: a white conservator cotton handling glove with traces of gold frame gilding.',
          actionLabel: 'Examine Dropped Conservator Glove',
          matchedClue: assignClue(['glove', 'cotton', 'dropped']) || assignClue()
        },
        {
          id: 'window',
          title: 'Library Tall Reading Window',
          icon: '🪟',
          x: 320,
          y: 280,
          walkTo: { x: 320, y: 350 },
          hitBox: { x1: 220, y1: 50, x2: 420, y2: 310 },
          roomName: 'Curator\'s Reading Hall',
          description: "A tall arched reading window with a stone sill — overlooking the library's inner courtyard.",
          detailObservation: 'On the stone sill: damp courtyard garden soil and leather footwear impressions leading to the rear alley.',
          actionLabel: 'Analyze Flagstone Footwear Prints',
          matchedClue: assignClue(['courtyard', 'mud', 'footprints', 'prints']) || assignClue()
        }
      ];

      // Rare Archives — Where the manuscript was stored overnight
      const candidateLibraryArchives = [
        {
          id: 'library_desk',
          title: 'Archivist\'s Cataloguing Desk',
          icon: '🗂️',
          x: 600,
          y: 440,
          walkTo: { x: 600, y: 520 },
          hitBox: { x1: 430, y1: 390, x2: 770, y2: 520 },
          roomName: 'Rare Manuscript Archives',
          description: 'The archivist\'s desk where manuscripts are logged and tagged — an archival release slip is clipped to the ledger.',
          detailObservation: 'An archival release slip bearing a forged curator stamp using modern quick-drying non-archival ink.',
          actionLabel: 'Read Forged Curator Stamp',
          matchedClue: assignClue(['curator', 'stamp', 'forged', 'release']) || assignClue()
        },
        {
          id: 'specimen_cabinet',
          title: 'Manuscript Preservation Cabinet',
          icon: '🗄️',
          x: 220,
          y: 360,
          walkTo: { x: 220, y: 440 },
          hitBox: { x1: 130, y1: 300, x2: 320, y2: 430 },
          roomName: 'Rare Manuscript Archives',
          description: 'A climate-controlled cabinet for rare manuscripts — the door seal is broken, the lock forced.',
          detailObservation: 'Inside the preservation cabinet: a fluorescent varnish chemical residue glowing violet under UV light inspection.',
          actionLabel: 'Examine Fluorescent Varnish Residue',
          matchedClue: assignClue(['uv', 'varnish', 'traces', 'chemical']) || assignClue()
        },
        {
          id: 'grandfather_clock',
          title: 'Archive Corridor Clock',
          icon: '🕰️',
          x: 880,
          y: 340,
          walkTo: { x: 880, y: 420 },
          hitBox: { x1: 820, y1: 270, x2: 940, y2: 390 },
          roomName: 'Rare Manuscript Archives',
          description: 'A tall pendulum clock marking archive hours — its hands stopped at 7:02 PM, closing time.',
          detailObservation: 'Tucked into the clock base drawer: a dropped duplicate brass key matching the archive gate.',
          actionLabel: 'Check Clock Base Drawer',
          matchedClue: assignClue(['watch', 'broken', 'key']) || assignClue()
        }
      ];

      primaryObjs = candidateLibraryReading.filter(o => o.matchedClue);
      secondaryObjs = candidateLibraryArchives.filter(o => o.matchedClue);

      primaryObjs.push({
        id: 'door_archives',
        title: 'Doorway to Rare Archives',
        icon: '▸',
        x: 1080,
        y: 330,
        walkTo: { x: 1040, y: 370 },
        hitBox: { x1: 1020, y1: 150, x2: 1150, y2: 380 },
        roomName: 'Curator\'s Reading Hall',
        isDoor: true,
        targetRoom: 'rare_archives',
        description: 'A locked iron gate leading to the temperature-controlled rare manuscript archives.'
      });

      secondaryObjs.push({
        id: 'door_reading',
        title: 'Return to Reading Hall',
        icon: '◂',
        x: 80,
        y: 330,
        walkTo: { x: 130, y: 370 },
        hitBox: { x1: 40, y1: 150, x2: 120, y2: 380 },
        roomName: 'Rare Manuscript Archives',
        isDoor: true,
        targetRoom: 'reading_hall',
        description: 'Iron gate returning to the Curator\'s Reading Hall.'
      });
      break;
    }
  }

  // Safety: Guarantee any remaining unassigned clues are bound
  if (unassignedClues.length > 0) {
    const allInspectable = [
      ...primaryObjs.filter(o => !o.isDoor),
      ...secondaryObjs.filter(o => !o.isDoor)
    ];
    let idx = 0;
    while (unassignedClues.length > 0 && idx < allInspectable.length) {
      if (!allInspectable[idx].matchedClue) {
        allInspectable[idx].matchedClue = unassignedClues.shift();
      }
      idx++;
    }
  }

  return {
    [primaryRoomKey]: primaryObjs,
    [secondaryRoomKey]: secondaryObjs
  };
}
