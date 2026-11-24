/**
 * THE LAST CLUE — Simple English Localization Dictionary
 * Clear, engaging, and simplified English designed for school children & beginners.
 * Free of confusing jargon and archaisms.
 */

export const en = {
  // App & Common
  app: {
    title: 'THE LAST CLUE',
    tagline: '"Every clue leaves a trace."',
    classified: 'CONFIDENTIAL',
    scotlandYardArchive: 'POLICE ARCHIVE',
    dsaBadge: '100% PUZZLE LOGIC',
    version: 'Version 1.0',
    loading: 'Loading investigation...',
    error: 'Something went wrong',
    back: 'Back',
    cancel: 'Cancel',
    close: 'Close',
    retry: 'Try Again',
    confirm: 'Confirm',
    save: 'Save',
    search: 'Search',
    all: 'All',
    none: 'None',
    or: 'or'
  },

  // Language Selector
  language: {
    selectLanguage: 'Select Language',
    hinglish: 'Hinglish (Hindi + English)',
    english: 'Simple English',
    hindi: 'हिन्दी (Hindi)'
  },

  // Movement Controls Settings & HUD Tips
  controls: {
    settingLabel: 'Movement Controls',
    both: {
      label: 'Both (Keyboard + Mouse)',
      badge: 'BOTH',
      desc: 'Use WASD / Arrow keys or click & drag detective'
    },
    keyboard: {
      label: 'Keyboard Only',
      badge: 'KEYBOARD',
      desc: 'Use W, A, S, D or Arrow keys to move'
    },
    mouse: {
      label: 'Mouse Only (Hold & Drag)',
      badge: 'MOUSE',
      desc: 'Click & hold detective to drag and move'
    },
    hudTipBoth: 'Move: WASD / Arrow keys or click & drag detective. Examine: [E]',
    hudTipKeyboard: 'Move: WASD / Arrow keys. Examine: [E]',
    hudTipMouse: 'Move: Click & drag detective. Examine: [E]',
    dragToMove: 'Click & drag detective to move',
    switchControlsTitle: 'Change Movement Controls'
  },

  // Case Themes
  caseThemes: {
    trophy: {
      title: 'The Missing Annual Sports Trophy',
      tagline: 'The Championship Trophy has vanished from the locked showcase overnight!',
      locationName: "St. Jude's Academy — Trophy Hall & Library",
      complainant: 'Principal Sharma & Sports Coach Verma',
      incidentTime: 'Yesterday 8:30 PM (After sports practice)',
      mission: 'Discover who took the Golden Trophy from the showcase and where it was hidden.',
      rooms: {
        school_hall: "Principal's Trophy Hall",
        school_library: 'School Library & Records Room'
      },
      doors: {
        to_library: 'Enter School Library →',
        to_hall: 'Return to Trophy Hall →'
      }
    },
    science: {
      title: 'The Missing Science Fair Project',
      tagline: 'The prize-winning robotics prototype vanished from the lab overnight!',
      locationName: 'Junior Science Lab & Exhibition Hall',
      complainant: 'Science Teacher Mrs. Roy & Student Council',
      incidentTime: 'Late Night 11:00 PM (During the storm)',
      mission: 'Investigate who took the science fair project and what clues were left in the lab.',
      rooms: {
        science_lab: 'Junior Science Laboratory',
        exhibition_hall: 'Science Exhibition Hall'
      },
      doors: {
        to_exhibition: 'Enter Exhibition Hall →',
        to_lab: 'Return to Science Lab →'
      }
    },
    treasure: {
      title: 'The Secret Heritage Treasure Mystery',
      tagline: 'An antique diamond heirloom and historical deed have disappeared from the vault!',
      locationName: 'Blackwood Heritage Study & Secret Vault',
      complainant: 'Estate Caretaker & Heritage Trust',
      incidentTime: 'Midnight 12:00 AM',
      mission: 'Find out who opened the secret vault and where the heirloom was moved.',
      rooms: {
        manor_study: 'Heritage Manor Study',
        secret_vault: 'Secret Heritage Vault'
      },
      doors: {
        to_vault: 'Enter Secret Vault →',
        to_study: 'Return to Manor Study →'
      }
    },
    library: {
      title: 'The Whispering Library Mystery',
      tagline: 'A 200-year-old illuminated manuscript vanished from the curator’s table!',
      locationName: 'Central Heritage Library & Rare Archives',
      complainant: 'Head Librarian Mr. Sen',
      incidentTime: 'Evening 7:00 PM (Library closing time)',
      mission: 'Discover who took the rare illuminated manuscript and examine why its pages were torn.',
      rooms: {
        reading_hall: "Curator's Reading Hall",
        rare_archives: 'Rare Manuscript Archives'
      },
      doors: {
        to_archives: 'Enter Rare Archives →',
        to_reading: 'Return to Reading Hall →'
      }
    }
  },

  // Case Introduction 5-Panel Cinematic Story
  caseIntro: {
    skipBtn: 'Skip Intro',
    nextBtn: 'Next',
    prevBtn: 'Previous',
    startBriefingBtn: 'Open Detective Briefing',
    keyFactLabel: 'Key Fact',
    step1Badge: 'STORY INTRODUCTION',
    step2Badge: 'INCIDENT LOCATION',
    step3Badge: 'INCIDENT TIMELINE',
    step4Badge: 'WHO REPORTED IT',
    step5Badge: 'WHY INVESTIGATE',
    whatHappenedQuestion: '1. What Happened?',
    whereQuestion: '2. Where Did It Happen?',
    whenQuestion: '3. When Did It Happen?',
    whoReportedQuestion: '4. Who Reported It?',
    whyInvestigateQuestion: '5. Why Does It Need Investigation?',
    trophy: {
      whatHeadline: 'The School’s Most Prized Trophy Has Vanished!',
      whatDesc: 'St. Jude’s Academy’s annual championship trophy disappeared from the locked glass cabinet last night. The lock has been forced open and the velvet cushion scratched.',
      whatHighlight: 'The lock was pried open and muddy clay marks lead to the corridor.',
      whereHeadline: 'Principal’s Trophy Hall & School Library',
      whereDesc: 'The incident took place inside the main Trophy Hall, adjoining the quiet school library. Track clay and boot prints are scattered near the entrance.',
      whereHighlight: 'Only two rooms connect to this wing: the Trophy Hall and the Library.',
      whenHeadline: 'Last Night During the Storm (8:30 PM)',
      whenDesc: 'Right after sports day practice ended in heavy rain, the night guard spotted a shadowy figure moving near the trophy room window.',
      whenHighlight: 'The incident occurred right after practice ended at 8:30 PM.',
      whoHeadline: 'Reported by Principal Sharma & Coach Verma',
      whoDesc: 'Principal Sharma discovered the empty showcase first thing in the morning and contacted our detective unit immediately.',
      whoHighlight: 'Principal Sharma stated: "We cannot accuse innocent students; we need real proof."',
      whyHeadline: 'The Championship Ceremony Starts in 2 Hours!',
      whyDesc: 'The award ceremony starts in just two hours. If we do not uncover the truth with solid evidence, suspicion will unfairly fall on innocent people!',
      whyHighlight: 'Step into the scene, collect real clues, and identify the true culprit!'
    },
    science: {
      whatHeadline: 'The First-Prize Robot Project Was Stolen!',
      whatDesc: 'The winning robotics prototype from the Junior Science Fair vanished from the locked lab overnight! The exhibition podium now sits empty.',
      whatHighlight: 'A solvent stain and a torn blueprint fragment were left behind.',
      whereHeadline: 'Junior Science Lab & Exhibition Hall',
      whereDesc: 'The lab contains chemical benches, chalkboards, and locked glass cabinets, opening directly into the school exhibition hall.',
      whereHighlight: 'Double doors link the science preparation lab with the exhibition hall.',
      whenHeadline: 'Late Night During the Storm (11:00 PM)',
      whenDesc: 'During a sudden storm power outage, someone used a master key to enter the lab and take the model.',
      whenHighlight: 'The lab wall clock stopped at exactly 11:00 PM.',
      whoHeadline: 'Reported by Science Teacher Mrs. Roy',
      whoDesc: 'Mrs. Roy found dropped flasks and a broken watch on the floor this morning, immediately alerting our investigation bureau.',
      whoHighlight: 'Mrs. Roy: "Without the blueprint schematics, the prototype cannot be run safely."',
      whyHeadline: 'The Judging Panel Arrives in 1 Hour!',
      whyDesc: 'The final judging ceremony is about to begin. We must connect the clues to recover the project and ensure fair recognition for the students!',
      whyHighlight: 'Analyze the chemical trace and fragments to find the culprit!'
    },
    treasure: {
      whatHeadline: 'Historical Heirloom & Title Deed Stolen!',
      whatDesc: 'A precious diamond heirloom and estate deed vanished from the hidden study wall safe overnight. Only three people knew the vault combination!',
      whatHighlight: 'A burnt telegram fragment and monogrammed cufflink were found near the hearth.',
      whereHeadline: 'Heritage Manor Study & Secret Vault',
      whereDesc: 'Behind a heavy tapestry in the historic study lies the entrance to the stone vault, filled with archival records and antiques.',
      whereHighlight: 'A concealed doorway connects the private study with the secret vault.',
      whenHeadline: 'Midnight 12:00 AM Under Cover of Rain',
      whenDesc: 'While the manor slept, an intruder slipped through the gallery and opened the wall safe.',
      whenHighlight: 'Glass fragments were found near the pendulum grandfather clock.',
      whoHeadline: 'Reported by the Manor Caretaker',
      whoDesc: 'The caretaker found the study door ajar and the oil portrait tilted askew early this morning.',
      whoHighlight: 'Four key residents and guests had opportunity that night.',
      whyHeadline: 'The Suspect Plans to Flee on the Morning Train!',
      whyDesc: 'We have limited time before the express train leaves the station. We must inspect the scene and identify the culprit before the heirloom is lost!',
      whyHighlight: 'Examine each clue on the Pinboard and make the rightful accusation!'
    },
    library: {
      whatHeadline: 'A 200-Year-Old Golden Manuscript Is Missing!',
      whatDesc: 'The library’s rarest medieval illuminated book vanished from the curator’s display table overnight. The volume contains irreplaceable city history.',
      whatHighlight: 'An ink stain and blade marks were discovered on the reading table.',
      whereHeadline: 'Curator Reading Room & Rare Archives',
      whereDesc: 'The private upper wing of the Central Library features towering dark oak bookcases, rolling ladders, and ledger desks.',
      whereHighlight: 'Only authorized library patrons had access to the private archives.',
      whenHeadline: 'Just Before Library Closing Time (7:00 PM)',
      whenDesc: 'As staff prepared to lock the gates, someone was seen hurrying down the back spiral staircase.',
      whenHighlight: 'A crucial page from the visitor ledger was sliced away.',
      whoHeadline: 'Reported by Head Librarian Mr. Sen',
      whoDesc: 'Mr. Sen immediately secured the building and requested an authoritative detective investigation.',
      whoHighlight: 'Mr. Sen: "The manuscript is our heritage; its delicate pages must be preserved."',
      whyHeadline: 'The Delicate Manuscript Must Be Protected!',
      whyDesc: 'Its fragile parchment cannot survive harsh conditions. We must follow the clues and resolve the case before harm comes to the archive!',
      whyHighlight: 'Compare suspect statements to uncover who hid the book!'
    }
  },

  // Detective Briefing Dossier
  briefing: {
    officialDossierTag: 'SCOTLAND YARD • CASE DOSSIER',
    missionLabel: 'MISSION OBJECTIVE',
    incidentLocation: 'INCIDENT LOCATION:',
    incidentTime: 'INCIDENT TIME:',
    reportedBy: 'REPORTED BY:',
    startingLead: 'INITIAL LEAD (STARTING CLUE):',
    initialSearch: 'Search the scene for initial clues',
    suspectLineupTitle: 'SUSPECT LINEUP',
    suspectLineupSubtitle: 'All individuals with opportunity to access the location',
    rewatchStory: 'Rewatch Story Panels',
    enterInvestigationBtn: '🔎 Enter Investigation',
    viewBriefingBtn: 'Briefing Dossier',
    headerBadge: 'Briefing'
  },

  // Investigation Milestones
  objectives: {
    stepTag: 'STEP',
    checklistTitle: 'INVESTIGATION PROGRESS CHECKLIST',
    step1Title: 'Search the scene & examine your first clue',
    step1Desc: 'Walk through the room, click highlighted objects, and collect forensic traces.',
    step2Title: 'Uncover remaining clues ({current}/{total} found)',
    step2Desc: 'Explore the secondary room to find where the culprit left further traces.',
    step3Title: 'Review suspect profiles & alibis in the Journal',
    step3Desc: 'Read motives and mark suspicious individuals as Persons of Interest (POI).',
    step4Title: 'Connect the evidence on the Pinboard [B]',
    step4Desc: 'See how clues, rooms, and suspect statements link together.',
    step5Title: 'Identify the culprit & submit your verdict [A]',
    step5Desc: 'Deliver your final accusation supported by concrete evidence.'
  },

  // Progressive Hint System
  hints: {
    title: 'Detective Hint',
    modalTitle: 'DETECTIVE HINT SYSTEM',
    modalSubtitle: 'Progressive guidance without spoiling the solution',
    tier1Badge: 'HINT 1 • LOCATION GUIDE',
    tier1Title: 'Where to Search?',
    tier2Badge: 'HINT 2 • CLUE FOCUS',
    tier2Title: 'Which Clue Matters?',
    tier3Badge: 'HINT 3 • DEDUCTION HELPER',
    tier3Title: 'How to Connect the Dots?',
    lockedNotice: 'Unlock the previous hint first',
    hintsUsedLabel: 'Hints Used',
    unlockNextBtn: 'Unlock Next Hint',
    resumeInvestigationBtn: 'Resume Investigation',
    hintBtn: '💡 Hint',
    openBtn: '💡 Hint [H]',
    trophy: {
      tier1Search: 'There are still {count} unexamined clues. Check the trophy showcase and the library records desk carefully!',
      tier1AllFound: 'You have found all available clues! Now review suspect alibis and compare statements.',
      tier2Focus: 'Pay close attention to "{clueName}". Notice which suspect was seen near the track clay or garden path.',
      tier2Default: 'Compare muddy boot prints and torn paper fragments to suspect access locations.',
      tier3Deduction: 'Open the Evidence Board. Check which suspect had access to the trophy hall and had a reason related to sports rivalry or attendance.'
    },
    science: {
      tier1Search: 'Search the demonstration bench and project podium where {count} clues remain hidden.',
      tier1AllFound: 'All laboratory clues have been secured! Open the Evidence Pinboard [B] to map connections.',
      tier2Focus: 'Examine the chemical residue and blueprint scrap: who had authorized access to the preparation bench?',
      tier2Default: 'Notice the blackboard formulas and the dropped mechanical component.',
      tier3Deduction: 'Check which suspect had the motive to prevent the project from competing in the finals.'
    },
    treasure: {
      tier1Search: 'Inspect the writing desk and grandfather clock chamber where {count} traces are waiting.',
      tier1AllFound: 'All heritage artifacts have been inspected! Read through the suspect statements.',
      tier2Focus: 'Focus on the burnt telegram and check receipt: which suspect was struggling with debt or inheritance claims?',
      tier2Default: 'Note the dropped cufflink and the time indicated on the broken watch.',
      tier3Deduction: 'Only a suspect with verified access to the safe at midnight and matching weapon traits could be responsible.'
    },
    library: {
      tier1Search: 'Check the archives and catalog shelves where {count} additional documents are kept.',
      tier1AllFound: 'All library clues have been recorded! Check the Pinboard to cross-reference.',
      tier2Focus: 'Examine the excised ledger page and blade markings on the desk.',
      tier2Default: 'Notice the fingerprints on the rare manuscript cover.',
      tier3Deduction: 'Compare the librarian’s timetable with the suspects’ recorded departure times to deduce the culprit.'
    }
  },

  // Navigation
  nav: {
    howToPlay: 'How to Play',
    experience: 'Game Features',
    methodology: 'Rules & Levels',
    beginCase: 'Begin Case →',
    crimeScene: 'Crime Scene Room',
    evidenceBoard: 'Evidence Board',
    clues: 'Clues & Evidence',
    suspects: 'Suspect Profiles',
    locations: 'Rooms & Weapons',
    journal: 'Detective Notebook'
  },

  // Landing Page Hero
  hero: {
    caseBadge: 'CASE FILE #4092-B • SCOTLAND YARD',
    headline: 'EVERY CLUE LEAVES A TRACE.',
    headlineHinglish: 'EVERY CLUE LEAVES A TRACE.',
    supportingStory: 'Behind every secret lies a story. Can you uncover the truth?',
    subhead: 'Midnight at Blackwood Manor. A locked chamber, a missing heirloom, and a house full of suspects. Step into the shoes of a classic detective, examine the forensic traces, and deduce the real culprit!',
    beginBtn: '🔎 START INVESTIGATING',
    methodologyBtn: '📜 Discover the Mystery →',
    startInvestigating: '🔎 START INVESTIGATING',
    discoverMystery: '📜 Discover the Mystery →',
    secretClueFound: '✦ Clue Uncovered! Monogrammed silver cufflink found beneath the gas lamp',
    exploreWorldTip: '🔍 Move magnifying glass over the street to uncover hidden evidence',
    specs: {
      logic: {
        title: 'CLEVER LOGIC',
        desc: 'Every mystery is a fair puzzle with exactly one true culprit'
      },
      graph: {
        title: 'CONNECTED CLUES',
        desc: 'Trace connecting paths between suspects, rooms, and weapons'
      },
      fair: {
        title: '100% FAIR MYSTERY',
        desc: 'Fresh, solvable mysteries created without any random guessing'
      }
    }
  },

  // How to play (3 steps)
  howToPlay: {
    protocolBadge: 'INVESTIGATION RULES',
    title: '3 EASY STEPS TO SOLVE THE CRIME',
    subtitle: 'Follow the detective method to crack every procedural case.',
    step1: {
      num: '01',
      title: 'Examine the Clues',
      desc: 'Explore the room to discover fireplace ashes, torn blackmail letters, broken clocks, and muddy footprints. Every case starts with one clear lead.',
      tag: 'SEARCH FOR CLUES'
    },
    step2: {
      num: '02',
      title: 'Connect the Evidence',
      desc: 'Open the Evidence Board. Check which suspect was in which room, who had access to the weapon, and whose alibi does not make sense.',
      tag: 'CONNECT THE DOTS'
    },
    step3: {
      num: '03',
      title: 'Identify the Culprit',
      desc: 'When the clues match up, submit your charge to the police. They will verify whether your deduction caught the real culprit!',
      tag: 'FINAL VERDICT'
    }
  },

  // Case Experience Preview
  preview: {
    systemBadge: 'WORKSPACE OVERVIEW',
    title: "THE DETECTIVE'S WORKSPACE",
    subtitle: 'Everything you need to crack the mystery is right at your fingertips.',
    boardTitle: 'Evidence Pinboard',
    boardDesc: 'An interactive board linking suspects, rooms, weapons, and clues together with red string. Click any item to see how it connects to the case.',
    featuresList: [
      'Color-coded tokens: Suspects, Clues, Rooms, and Weapons',
      'Relationship lines: "Found at", "Belongs to", "Motivated by"',
      'Clear list view: Easily switch from graph to list anytime'
    ],
    journalTitle: 'Suspect Profiles & Journal',
    journalDesc: 'Read suspect traits, background history, and possible motives. Mark the most suspicious person as a "Person of Interest (POI)".',
    journalFeaturesList: [
      'Person of Interest (POI) flag: Highlight top suspects without declaring guilt',
      'Detective notes: Type your own personal clues and observations',
      'Progress meter: Track how much of the case you have investigated'
    ]
  },

  // Complexity Tiers
  tiers: {
    badge: 'DIFFICULTY LEVELS',
    title: 'CHOOSE YOUR CHALLENGE',
    subtitle: 'Great for beginners, or pick harder levels for a deeper puzzle.',
    easy: {
      badge: 'EASY (BEGINNER)',
      title: '3 Suspects • 3 Clues',
      desc: 'Perfect for beginners! Fewer suspects, direct clues, and only 1 misleading red herring.'
    },
    medium: {
      badge: 'MEDIUM (STANDARD)',
      title: '4 Suspects • 4 Clues',
      desc: 'The classic detective mystery! 2 misleading clues to test your detective skills.'
    },
    hard: {
      badge: 'HARD (MASTER DETECTIVE)',
      title: '5 Suspects • 6 Clues',
      desc: 'A real brain teaser! 3 misleading clues and a tangled web of secrets. Trust only solid proof.'
    }
  },

  // Start Screen / Live Case Launch
  startScreen: {
    dispatchBadge: 'DISPATCH TERMINAL',
    title: 'START A NEW CASE',
    subtitle: 'Set up your case options below and begin your investigation.',
    briefing: 'Midnight at Blackwood Manor. The wealthy owner is dead, and everyone in the house has a secret. As the lead detective, walk through the manor, inspect physical clues, question suspect profiles, and identify the single true culprit.',
    selectComplexity: 'Select Case Difficulty:',
    seedLabel: 'Case Code / Seed (Optional):',
    seedPlaceholder: 'e.g. 12345 (Leave empty for random case)',
    seedHint: 'Every number creates a unique case. Share the same number with friends to see who solves it first!',
    randomizeBtn: '🎲 Random Code',
    clearBtn: 'Clear',
    startBtn: '🔎 Open Case File & Begin Investigation',
    loadingBtn: 'Opening Case File...',
    fieldManualToggle: "DETECTIVE'S FIELD MANUAL",
    hideManual: '▲ Hide Instructions',
    viewManual: '▼ View Instructions',
    steps: [
      'Check the Starting Clue: Every case begins with one verified starting lead.',
      'Walk Around Rooms: Use WASD or Arrow keys to walk, and press [E] to examine nearby objects.',
      'Check Evidence Board: Press [B] to see how clues connect to suspects and rooms.',
      'File an Accusation: Press [A] when you are ready to name the culprit.'
    ]
  },

  // Case Header
  header: {
    progress: 'Progress',
    newCase: 'New Case',
    newCaseTitle: 'Generate a new mystery case',
    archive: 'Main Menu',
    archiveTitle: 'Return to start screen',
    fileAccusation: 'Accuse Culprit',
    fileAccusationTitle: 'Name the culprit and file charges',
    caseActive: 'CASE-ACTIVE',
    seed: 'CODE'
  },

  // Game Viewport & HUD
  hud: {
    objectiveLabel: 'MISSION OBJECTIVE',
    evidenceLabel: 'CLUES:',
    solvabilityLabel: 'PROGRESS:',
    journalBtn: 'Journal',
    boardBtn: 'Board',
    suspectsBtn: 'Suspects',
    accuseBtn: 'Accuse',
    muteSound: 'Mute Sound',
    unmuteSound: 'Unmute Sound',
    passageway: 'DOORWAY',
    forensicExam: 'EXAMINE OBJECT',
    passThroughDoor: 'Pass Through Doorway →',
    examineObject: 'Examine Object [E] →',
    objectives: {
      initialDrawingRoom: 'Walk through the crime scene and search for clues. Click on highlighted objects to uncover hidden evidence.',
      exploringRooms: 'Explore the manor rooms ({current}/{total} clues found). Walk through doors to move between rooms.',
      allCluesFound: 'All clues collected! Check the Evidence Board [B] or file an Accusation [A].'
    },
    controlsTip: 'Move with WASD or Arrow Keys. Press [E] to examine objects.'
  },

  // Object Inspector Modal
  inspector: {
    dossierBadge: 'OBJECT DOSSIER',
    closeAria: 'Close inspector',
    examiningArtifact: 'EXAMINING OBJECT CAREFULLY...',
    evidenceRecorded: 'EVIDENCE RECORDED',
    scotlandYard: 'SCOTLAND YARD',
    archivalSecured: 'SECURED',
    observationLabel: "DETECTIVE'S OBSERVATION",
    irregularityDetected: '⚠ SUSPICIOUS OBJECT DETECTED',
    evidenceIdentified: '✦ SOLID CLUE DISCOVERED!',
    promptText: 'A careful physical examination may uncover vital clues linked to the crime.',
    actionInspecting: 'Applying powders and magnifying glass...',
    actionSearchDefault: 'Search and secure evidence',
    reliability: 'RELIABILITY',
    statusFiled: 'STATUS: SAVED IN JOURNAL & EVIDENCE BOARD',
    noEvidenceNote: 'NO CRIME CLUES DETECTED ON THIS OBJECT.',
    hotkeyTip: 'PRESS [ESC] OR CLICK OUTSIDE TO RETURN',
    resumeBtn: 'Resume Investigation'
  },

  // Clue Panel
  cluePanel: {
    title: 'EVIDENCE & CLUES ARCHIVE',
    subtitle: 'Physical items and documents recovered from the crime scene.',
    filterAll: 'All Clues',
    filterUnexamined: 'Unexamined',
    filterExamined: 'Examined',
    initialLead: '★ INITIAL LEAD',
    reliability: 'Reliability:',
    examinedBadge: '✓ EXAMINED',
    unexaminedBadge: 'UNEXAMINED',
    observationLabel: "DETECTIVE'S OBSERVATION NOTE:",
    notesPlaceholder: 'Record your deductions or theories about this clue...',
    markExamined: 'Mark as Examined',
    markUnexamined: 'Mark Unexamined',
    viewOnBoard: '🕸️ View on Board',
    emptyFilter: 'No clues match the selected filter.'
  },

  // Suspect Panel
  suspectPanel: {
    title: 'SUSPECT DOSSIERS',
    subtitle: 'Individuals present at Blackwood Manor during the crime.',
    filterAll: 'All Suspects',
    filterPoi: 'Persons of Interest (POIs)',
    poiRibbon: '★ PERSON OF INTEREST',
    traitsLabel: 'Personality Traits:',
    accessLabel: 'Rooms They Could Access:',
    weaponsLabel: 'Weapons They Could Use:',
    motivesLabel: 'Possible Motives:',
    markPoi: '☆ Mark as POI',
    unmarkPoi: '★ Unmark POI',
    viewOnBoard: '🕸️ Board',
    accuseBtn: '⚖️ Accuse',
    emptyFilter: 'No suspects currently marked as Person of Interest.'
  },

  // Location & Weapons Panel
  locationPanel: {
    title: 'ESTATE ROOMS & WEAPONS',
    subtitle: 'Rooms of Blackwood Manor, recovered implements, and possible motives.',
    tabRooms: 'Manor Rooms',
    tabWeapons: 'Recovered Weapons',
    tabMotives: 'Possible Motives',
    compatibleWeapons: 'Weapons That Could Be Used Here:',
    viewOnBoard: '🕸️ View on Evidence Board'
  },

  // Evidence Board
  board: {
    title: 'EVIDENCE PINBOARD',
    subtitle: 'Understand how clues, rooms, weapons, and suspects connect together.',
    toggleCanvas: 'Pinboard View',
    toggleList: 'List View',
    resetView: 'Reset View',
    zoomIn: 'Zoom +',
    zoomOut: 'Zoom -',
    filterAll: 'All Nodes',
    filterSuspects: 'Suspects',
    filterClues: 'Clues',
    filterRooms: 'Rooms',
    filterWeapons: 'Weapons',
    connectedEvidence: 'CONNECTED EVIDENCE',
    startingLead: '★ INITIAL LEAD',
    closeDrawer: 'Close',
    connectionsCount: 'connections',
    listTitle: 'CONNECTED EVIDENCE REPOSITORY',
    nodesLabel: 'Items',
    edgesLabel: 'Connections',
    emptyStateHint: 'Examine objects in the crime scene to reveal hidden connections on this pinboard.',
    types: {
      suspect: 'SUSPECT',
      clue: 'CLUE',
      location: 'ROOM',
      weapon: 'WEAPON',
      evidence: 'WEAPON',
      motive: 'MOTIVE'
    }
  },

  // Relationship Edge Labels
  relationships: {
    found_at: 'found at',
    connected_to: 'connected to',
    points_to: 'points to',
    belongs_to: 'belongs to',
    motivated_by: 'motivated by',
    knows: 'knows',
    linked: 'linked'
  },

  // Investigation Journal
  journal: {
    title: 'DETECTIVE NOTEBOOK & LOG',
    subtitle: 'Official field record of examined clues, motives, and deductions.',
    caseCompletion: 'CASE COMPLETION:',
    caseFileLabel: 'CASE FILE',
    reportedBy: 'Reported By',
    currentObjective: 'CURRENT OBJECTIVE',
    objectiveStart: 'Walk through the crime scene and examine highlighted objects to find your first clue.',
    objectiveExploring: 'Keep searching — you have found {found} of {total} clues. Explore the second room too!',
    objectiveAllClues: 'All clues collected! Open the Evidence Board [B] to connect them, then check Suspect profiles.',
    objectiveHasPoi: 'You have flagged {name} as a Person of Interest. Review the Evidence Board, then file your Accusation [A].',
    hypothesisTitle: "DETECTIVE'S WORKING HYPOTHESIS",
    hypothesisDesc: 'Record your deductions about who had the chance, the weapon, and the motive.',
    hypothesisPlaceholder: 'Type your main theory here: Who is guilty and what evidence proves it...',
    logTitle: 'CLUE NOTES LOG',
    noNotes: 'No clue notes written yet. Open the Clues panel to write deductions.',
    unresolvedTitle: 'UNRESOLVED QUESTIONS',
    metricsTitle: 'INVESTIGATION METRICS',
    statExamined: 'Examined',
    statPending: 'Pending',
    statPois: 'POIs',
    inspectionProgress: 'Evidence Inspection Progress:',
    poiTitle: 'PERSONS OF INTEREST (POIs)',
    noPois: 'No suspects currently flagged as primary persons of interest.',
    suspectsLabel: 'ALL SUSPECTS',
    questions: {
      trophy: {
        q1: 'Who had access to the Trophy Room after sports practice ended?',
        q2: 'Why was the attendance ledger page torn out?',
        q3: 'Who left muddy boot marks on the courtyard window sill?'
      },
      science: {
        q1: 'Who accessed the lab the night before the exhibition?',
        q2: 'What was the chemical residue from, and who had that substance?',
        q3: 'Why was the blueprint torn away from the chalkboard?'
      },
      treasure: {
        q1: 'Who knew the wall safe combination besides the estate owner?',
        q2: 'What was written in the charred telegram fragment?',
        q3: 'Why were the garden boot marks so fresh at midnight?'
      },
      library: {
        q1: 'Who was the last authorized person to handle the manuscript?',
        q2: 'Why was the visitor ledger page sliced out so cleanly?',
        q3: 'What does the chemical residue inside the cabinet indicate?'
      }
    }
  },

  // Accusation Modal
  accusation: {
    badge: 'JUDICIAL PROCEEDINGS',
    title: 'NAME THE CULPRIT',
    subtitle: 'Based on your evidence, name the person solely responsible for the crime.',
    selectPrompt: 'Choose the Culprit from the Suspects:',
    selectedBadge: '✓ SELECTED',
    rationaleLabel: 'Why are they guilty? (Optional Statement):',
    rationalePlaceholder: 'Explain the evidence linking this suspect to the crime...',
    cancelBtn: 'Cancel',
    reviewBtn: 'Review Accusation →',
    confirmTitle: 'CONFIRM YOUR CHARGES',
    confirmPrompt: 'You are about to submit official murder charges against:',
    statementRecorded: 'Your Detective Statement:',
    backBtn: '← Back',
    submitBtn: 'Submit Charge to Inspector',
    verifying: 'Verifying with Scotland Yard...'
  },

  // Accusation Result / Verdict Screen
  verdict: {
    victoryBadge: 'CASE SOLVED • GUILTY VERDICT CONFIRMED',
    victoryTitle: 'PERPETRATOR CONVICTED!',
    victoryFeedback: 'Great job Detective! Scotland Yard verified your deduction. Faced with solid proof, the culprit confessed to the crime. You solved the mystery!',
    defeatBadge: 'INDICTMENT REJECTED • WRONG SUSPECT',
    defeatTitle: 'INSUFFICIENT EVIDENCE',
    defeatFeedback: 'Unfortunately Detective, the evidence does not match this suspect. The real culprit has escaped into the shadows.',
    caseRef: 'CASE CODE:',
    seed: 'PRNG CODE:',
    accused: 'ACCUSED SUSPECT:',
    status: 'VERDICT STATUS:',
    statusSolved: 'SOLVED',
    statusClosed: 'CLOSED',
    statementRecorded: "DETECTIVE'S RECORDED STATEMENT:",
    unsealBtn: '🔓 Unseal Confidential Dossier (Post-Game Reveal)',
    unsealingBtn: 'Opening Confidential Dossier...',
    unsealedBadge: 'SCOTLAND YARD FINDINGS',
    authoritativeTruth: 'THE FULL TRUTH',
    perpetratorTitle: 'TRUE CULPRIT:',
    crimeScene: 'CRIME SCENE:',
    murderWeapon: 'MURDER WEAPON:',
    criminalMotive: 'CRIMINAL MOTIVE:',
    reviewBoardBtn: 'Review Evidence Board',
    newCaseBtn: 'Investigate New Case'
  },

  // Loading, Errors, Empty States
  feedback: {
    generatingTitle: 'INVESTIGATION IN PROGRESS',
    generatingDesc: 'Creating crime scene graph, hiding forensic clues, and verifying unique solvability...',
    generatingBadge: 'EXECUTING PROCEDURAL CSP ENGINE',
    errorTitle: 'UNABLE TO RETRIEVE DOSSIER',
    errorDefault: 'An unexpected communication error occurred with the server.',
    retryBtn: 'Retry Request',
    returnMenuBtn: 'Return to Menu',
    interruptedTitle: 'INVESTIGATION SYSTEM INTERRUPTED',
    interruptedDesc: 'An unexpected error occurred while loading the crime scene workspace:',
    restartBtn: 'Restart Investigation'
  },

  // Dynamic Case Pool Entities
  entities: {
    "suspects": {
      "suspect_coach_verma": {
        "name": "Coach Vikram Verma",
        "role": "Senior Athletics Director & Coach",
        "traits": [
          "competitive",
          "strict",
          "protective of record"
        ]
      },
      "suspect_rohan_mehta": {
        "name": "Rohan Mehta",
        "role": "Star Sprinter & Rival Team Captain",
        "traits": [
          "ambitious",
          "impulsive",
          "under pressure"
        ]
      },
      "suspect_mrs_roy": {
        "name": "Mrs. Ananya Roy",
        "role": "Academic Coordinator & Attendance In-Charge",
        "traits": [
          "meticulous",
          "anxious",
          "rule follower"
        ]
      },
      "suspect_ram_singh": {
        "name": "Ram Singh",
        "role": "Night Campus Watchman",
        "traits": [
          "observant",
          "weary",
          "in debt"
        ]
      },
      "suspect_sameer_sen": {
        "name": "Sameer Sen",
        "role": "Student Council President & Event Organizer",
        "traits": [
          "diplomatic",
          "perfectionist",
          "stressed"
        ]
      },
      "suspect_priya_sharma": {
        "name": "Priya Sharma",
        "role": "Sports Club Secretary & Equipment Manager",
        "traits": [
          "resourceful",
          "defensive",
          "quiet"
        ]
      },
      "suspect_aniket_das": {
        "name": "Aniket Das",
        "role": "Junior Reserve Runner & Equipment Helper",
        "traits": [
          "quiet",
          "resentful",
          "nervous"
        ]
      },
      "suspect_dr_homi_sen": {
        "name": "Prof. Homi Sen",
        "role": "Chief Science Fair Judge & Department Dean",
        "traits": [
          "authoritative",
          "skeptical",
          "secretive"
        ]
      },
      "suspect_kabir_sen": {
        "name": "Kabir Sen",
        "role": "Rival Robotics Contestant",
        "traits": [
          "genius",
          "jealous",
          "reckless"
        ]
      },
      "suspect_ananya_ray": {
        "name": "Ananya Ray",
        "role": "Senior Laboratory Research Assistant",
        "traits": [
          "methodical",
          "disgruntled",
          "overworked"
        ]
      },
      "suspect_neha_gupta": {
        "name": "Neha Gupta",
        "role": "Electronics Lab Sponsor & Venture Scout",
        "traits": [
          "calculating",
          "commercial",
          "shrewd"
        ]
      },
      "suspect_dev_sharma": {
        "name": "Dev Sharma",
        "role": "Autonomous Drone Competitor",
        "traits": [
          "proud",
          "competitive",
          "volatile"
        ]
      },
      "suspect_dr_rita_sen": {
        "name": "Dr. Rita Sen",
        "role": "Senior Chemistry Demonstrator",
        "traits": [
          "protective",
          "fastidious",
          "nervous"
        ]
      },
      "suspect_arjun_nair": {
        "name": "Arjun Nair",
        "role": "Lab Technician & Night Custodian",
        "traits": [
          "practical",
          "indifferent",
          "in debt"
        ]
      },
      "suspect_lord_harrington": {
        "name": "Lord Arthur Harrington",
        "role": "Aristocratic Estate Heir",
        "traits": [
          "arrogant",
          "secretive",
          "heavily indebted"
        ]
      },
      "suspect_eleanor_vance": {
        "name": "Eleanor Vance",
        "role": "Distant Heiress & Antiquarian",
        "traits": [
          "calculating",
          "poised",
          "resourceful"
        ]
      },
      "suspect_julian_croft": {
        "name": "Julian Croft",
        "role": "Shrewd Antique Broker & Dealer",
        "traits": [
          "charming",
          "dishonest",
          "conniving"
        ]
      },
      "suspect_thomas_finch": {
        "name": "Thomas Finch",
        "role": "Head Grounds-Keeper & Blacksmith",
        "traits": [
          "gruff",
          "resentful",
          "strong"
        ]
      },
      "suspect_beatrice_thorne": {
        "name": "Beatrice Thorne",
        "role": "Estate Housekeeper of 30 Years",
        "traits": [
          "loyal",
          "silent",
          "all-knowing"
        ]
      },
      "suspect_dr_sterling": {
        "name": "Dr. Arthur Sterling",
        "role": "Family Physician & Trustee",
        "traits": [
          "meticulous",
          "nervous",
          "observant"
        ]
      },
      "suspect_vivienne_dubois": {
        "name": "Vivienne Dubois",
        "role": "Visiting French Opera Singer & Guest",
        "traits": [
          "dramatic",
          "extravagant",
          "observant"
        ]
      },
      "suspect_curator_sen": {
        "name": "Mr. Alok Sen",
        "role": "Head Museum Curator & Archival Scholar",
        "traits": [
          "scholarly",
          "proud",
          "protective"
        ]
      },
      "suspect_natasha_vance": {
        "name": "Natasha Vance",
        "role": "Master Art Conservator & Restorer",
        "traits": [
          "meticulous",
          "secretive",
          "financially strained"
        ]
      },
      "suspect_victor_vance": {
        "name": "Victor Vance",
        "role": "Private Collector & Art Patron",
        "traits": [
          "wealthy",
          "obsessive",
          "arrogant"
        ]
      },
      "suspect_ashok_kumar": {
        "name": "Ashok Kumar",
        "role": "Night Museum Security Warden",
        "traits": [
          "observant",
          "weary",
          "bribable"
        ]
      },
      "suspect_maya_lin": {
        "name": "Dr. Maya Lin",
        "role": "Visiting Medieval Manuscript Specialist",
        "traits": [
          "brilliant",
          "obsessive",
          "impatient"
        ]
      },
      "suspect_alistair_finch": {
        "name": "Alistair Finch",
        "role": "Auction House Appraiser & Evaluator",
        "traits": [
          "shrewd",
          "cynical",
          "calculating"
        ]
      },
      "suspect_suresh_rao": {
        "name": "Suresh Rao",
        "role": "Museum Facilities & Freight Custodian",
        "traits": [
          "quiet",
          "resentful",
          "practical"
        ]
      }
    },
    "clues": {
      "clue_cctv_footage": {
        "name": "CCTV Security Tape (8:27 PM)",
        "category": "surveillance",
        "description": "Security camera footage showing a shadowy figure in running shoes unbolting the showcase at 8:27 PM."
      },
      "clue_torn_attendance_sheet": {
        "name": "Torn Sports Attendance Register",
        "category": "document",
        "description": "A page torn out of the official attendance binder right across the evening practice hours."
      },
      "clue_sports_track_clay": {
        "name": "Red Athletic Track Clay Prints",
        "category": "forensic",
        "description": "Distinct red clay athletic track mud impressions stamped across the trophy room entrance."
      },
      "clue_dropped_locker_token": {
        "name": "Metal Equipment Locker Token #7",
        "category": "personal item",
        "description": "A stamped brass token for Pavilion Locker #7 dropped beneath the trophy showcase bench."
      },
      "clue_scratched_display_lock": {
        "name": "Scraped Showcase Lock Cylinder",
        "category": "forensic",
        "description": "Fresh metal scratch marks on the brass showcase lock showing it was pried with a flat tool."
      },
      "clue_torn_team_ribbon": {
        "name": "Crimson Team Ribbon Corner",
        "category": "personal item",
        "description": "A scrap of gold-fringed crimson satin ribbon caught in the display cabinet hinge."
      },
      "clue_circuit_schematic_scrap": {
        "name": "Torn Circuit Schematic Scrap",
        "category": "document",
        "description": "A torn corner of blueprint paper showing circuit diagrams for the robot’s controller board."
      },
      "clue_chemical_solvent_odor": {
        "name": "Chemical Flux Solvent Residue",
        "category": "chemical",
        "description": "Pungent soldering flux and solvent residue swabbed from the demonstration slate bench."
      },
      "clue_shattered_sensor_glass": {
        "name": "Shattered Optical Sensor Lens",
        "category": "forensic",
        "description": "A cracked infrared sensor lens with trace fingerprint dust on its casing."
      },
      "clue_lab_access_card": {
        "name": "Electronic Badge Log (10:48 PM)",
        "category": "surveillance",
        "description": "Access terminal record logging a card swipe right before the lab power circuit tripped."
      },
      "clue_soldering_iron_burn": {
        "name": "Workbench Solder Scorch Mark",
        "category": "forensic",
        "description": "A fresh circular heat burn branded into the wooden edge of the participant workbench."
      },
      "clue_muddy_gravel_prints": {
        "name": "Courtyard Gravel Boot Impressions",
        "category": "forensic",
        "description": "Wet pea-gravel and courtyard mud impressions stamped near the emergency laboratory window."
      },
      "clue_charred_telegram": {
        "name": "Charred Midnight Telegram",
        "category": "document",
        "description": "Half-burnt telegram in hearth ashes: \"Act before morning express train. Title deed must not be registered.\""
      },
      "clue_monogrammed_cufflink": {
        "name": "Engraved Silver Cufflink",
        "category": "personal item",
        "description": "Antique silver shirt cufflink engraved with initials dropped in the wingback settee seam."
      },
      "clue_muddy_herringbone_prints": {
        "name": "Muddy Herringbone Boot Impressions",
        "category": "forensic",
        "description": "Distinctive size 10 herringbone boot impressions stamped into stone dust on the garden window sill."
      },
      "clue_forced_vault_dial": {
        "name": "Scratched Iron Safe Dial",
        "category": "forensic",
        "description": "Fresh scratch marks on the vault dial notches proving the combination was forced with a lever."
      },
      "clue_sliced_ledger_page": {
        "name": "Excised Estate Ledger Sheet",
        "category": "document",
        "description": "A razor-sliced account ledger page detailing midnight payments excised from the binding."
      },
      "clue_broken_pocket_watch": {
        "name": "Impact-Shattered Pocket Watch",
        "category": "chronological",
        "description": "Gold pocket watch with hands frozen at 12:04 AM discovered behind the pendulum clock housing."
      },
      "clue_razor_canvas_edge": {
        "name": "Surgically Sliced Canvas Fringe",
        "category": "forensic",
        "description": "Clean razor cut fibers along the gilded frame edge proving professional excision."
      },
      "clue_forged_curator_stamp": {
        "name": "Forged Archival Release Stamp",
        "category": "document",
        "description": "An ink verification stamp on the archive register using modern quick-drying non-archival ink."
      },
      "clue_dropped_cotton_glove": {
        "name": "White Art Handling Cotton Glove",
        "category": "personal item",
        "description": "A white conservator glove dropped near the reading lamp with traces of frame gilding."
      },
      "clue_visitor_log_blade_cut": {
        "name": "Excised Visitor Sign-In Row",
        "category": "document",
        "description": "The visitor register for 6:45 PM cleanly sliced away with a razor blade."
      },
      "clue_uv_varnish_traces": {
        "name": "Fluorescent Varnish Chemical Residue",
        "category": "chemical",
        "description": "Chemical varnish residue swabbed from the desk glowing bright violet under ultraviolet inspection."
      },
      "clue_courtyard_window_mud": {
        "name": "Courtyard Flagstone Footwear Prints",
        "category": "forensic",
        "description": "Damp courtyard garden soil and leather shoe impressions on the archive window sill."
      },
      "clue_torn_letter": {
        "name": "Torn Blackmail Note",
        "category": "document",
        "description": "A burnt paper scrap demanding money in exchange for keeping quiet."
      },
      "clue_muddy_footprints": {
        "name": "Muddy Boot Prints",
        "category": "forensic",
        "description": "Size 10 boots covered in clay mud, leading away from the room."
      },
      "clue_forged_check": {
        "name": "Fake Bank Cheque",
        "category": "document",
        "description": "A forged cheque imitating the estate owner’s signature."
      },
      "clue_chemical_residue": {
        "name": "Bitter White Powder (Residue)",
        "category": "forensic",
        "description": "White powder traces on a glass rim, testing positive for poisonous cyanide."
      },
      "clue_burnt_telegram": {
        "name": "Half-Burnt Message",
        "category": "document",
        "description": "A telegram sent three days ago: \"Deal compromised. Act immediately before dawn.\""
      },
      "clue_missing_ledger_page": {
        "name": "Torn Account Book Page",
        "category": "document",
        "description": "Page 44 neatly sliced out of the accounts book with a sharp blade."
      }
    },
    "locations": {
      "location_trophy_hall": {
        "name": "Principal's Trophy Hall",
        "type": "indoor ceremonial",
        "description": "Polished teak floors, glass showcase cabinets, founders honor rolls, and sports shields."
      },
      "location_school_library": {
        "name": "School Library & Records Room",
        "type": "indoor study",
        "description": "Quiet study tables, tall bookshelves holding bound school yearbooks, and archival filing cabinets."
      },
      "location_sports_pavilion": {
        "name": "Sports Pavilion & Locker Wing",
        "type": "sports facility",
        "description": "Benches lined with team gear, athletic track shoe cubbies, metal lockers, and chalkboards."
      },
      "location_academy_corridor": {
        "name": "Academy Main Hallway & Quadrangle",
        "type": "hallway",
        "description": "Long arched corridor displaying bulletin boards, club rosters, and CCTV junction boxes."
      },
      "location_science_lab": {
        "name": "Junior Science Laboratory",
        "type": "laboratory",
        "description": "Slate chemical demonstration benches, Bunsen burners, circuit testing kits, and formula chalkboards."
      },
      "location_exhibition_hall": {
        "name": "Science Exhibition Gallery",
        "type": "gallery",
        "description": "Illuminated display stands, blue ribbon banners, participant lockers, and spotlighted podiums."
      },
      "location_prep_room": {
        "name": "Chemical & Component Preparation Room",
        "type": "secure storage",
        "description": "Reinforced ventilation cabinets, locked optics lockers, acid containers, and soldering stations."
      },
      "location_sensor_booth": {
        "name": "Robotics Sensor Calibration Booth",
        "type": "testing facility",
        "description": "Infrared calibration screens, diagnostic oscilloscopes, and anti-static workbench mats."
      },
      "location_manor_study": {
        "name": "Heritage Manor Study",
        "type": "study room",
        "description": "Carved stone fireplace, roll-top mahogany desk, wingback leather chairs, and oil ancestor portraits."
      },
      "location_secret_vault": {
        "name": "Concealed Stone Vault",
        "type": "vault",
        "description": "Concealed room behind study tapestry housing heavy iron safe, grandfather clock, and legal folios."
      },
      "location_manor_gardens": {
        "name": "Rear Stone Garden Terrace",
        "type": "garden",
        "description": "Moonlit flagstone paths, marble urns, and muddy garden beds leading to the study window."
      },
      "location_greenhouse": {
        "name": "Victorian Glass Conservatory",
        "type": "glass conservatory",
        "description": "Wrought-iron glasshouse containing exotic orchids, iron work tables, and gardening tools."
      },
      "location_reading_hall": {
        "name": "Curator's Gallery Reading Hall",
        "type": "museum gallery",
        "description": "High vaulted ceilings, illuminated display pedestals, mahogany reading tables, and tall leaded windows."
      },
      "location_rare_archives": {
        "name": "Climate-Controlled Rare Archives",
        "type": "secure archive",
        "description": "Locked glass preservation cases, humidity monitors, cataloguing desks, and grandfather pendulum clocks."
      },
      "location_restoration_lab": {
        "name": "Art Conservation Studio",
        "type": "restoration studio",
        "description": "Solvent racks, easels holding master canvas stretchers, magnifying inspection lamps, and drying racks."
      },
      "location_private_gallery": {
        "name": "Private Benefactor Viewing Room",
        "type": "viewing room",
        "description": "Velvet roped partitions, spotlighted gilded frames, and catalog folios for VIP collectors."
      },
      "location_grand_library": {
        "name": "Grand Library",
        "type": "indoor room",
        "description": "Tall wooden bookcases, antique Persian rugs, and quiet reading nooks."
      },
      "location_wine_cellar": {
        "name": "Underground Wine Cellar",
        "type": "cellar",
        "description": "Cold stone arches holding vintage wine barrels and dusty bottles."
      },
      "location_private_study": {
        "name": "Lord’s Private Study",
        "type": "secure room",
        "description": "Heavy wooden desk, wall safe hidden behind an oil painting, and locked drawers."
      },
      "location_conservatory": {
        "name": "Glass Conservatory",
        "type": "glass room",
        "description": "Marble statues, wicker chairs, and full garden views."
      },
      "location_carriage_house": {
        "name": "Carriage House (Garage)",
        "type": "outbuilding",
        "description": "Smell of straw, motor oil, leather harnesses, and discarded iron tools."
      },
      "location_drawing_room": {
        "name": "Gilded Drawing Room",
        "type": "living room",
        "description": "Red velvet settees, marble fireplace, and tea service on a silver tray."
      }
    },
    "weapons": {
      "weapon_display_lever": {
        "name": "Hardened Display Pry Tool",
        "category": "tool",
        "subType": "mechanical lever",
        "description": "A flat steel pry tool with paint scrape residue matching the trophy showcase frame."
      },
      "weapon_duplicate_key": {
        "name": "Duplicate Brass Master Key",
        "category": "key",
        "subType": "access tool",
        "description": "A freshly ground duplicate brass key cut to open academy display cases and library files."
      },
      "weapon_locker_pry_bar": {
        "name": "Equipment Locker Crowbar",
        "category": "tool",
        "subType": "physical",
        "description": "A miniature iron crowbar taken from the groundkeeper equipment shed."
      },
      "weapon_track_spike": {
        "name": "Sharpened Track Shoe Spike",
        "category": "improvised",
        "subType": "athletic gear",
        "description": "A tungsten running spike detached from sprint footwear, used to tamper with window latches."
      },
      "weapon_whistle_decoy": {
        "name": "Coach Timer Whistle",
        "category": "sound decoy",
        "subType": "misdirection",
        "description": "A metallic pea-whistle used to fake the conclusion of practice and lure the guard away."
      },
      "weapon_precision_cutters": {
        "name": "Precision Wire Cutters",
        "category": "tool",
        "subType": "electronics",
        "description": "Diagonal cutters with carbon steel blades used to slice robot wiring bundles clean."
      },
      "weapon_soldering_pen": {
        "name": "Heavy-Duty Soldering Pen",
        "category": "thermal tool",
        "subType": "electronics",
        "description": "High-temperature soldering pen used to desolder the micro-controller chip."
      },
      "weapon_override_dongle": {
        "name": "USB Security Override Dongle",
        "category": "electronic bypass",
        "subType": "digital tool",
        "description": "A flash dongle loaded with firmware designed to bypass lab smart locks."
      },
      "weapon_acid_solvent": {
        "name": "Chemical Flux Solvent Bottle",
        "category": "chemical",
        "subType": "liquid",
        "description": "Volatile cleaning chemical used to erase printed circuit board serial numbers."
      },
      "weapon_multimeter_probe": {
        "name": "Sharpened Multimeter Probe",
        "category": "diagnostic tool",
        "subType": "electronics",
        "description": "A pointed electrical test probe with copper residue used to short-circuit display relays."
      },
      "weapon_antique_pistol": {
        "name": "Flintlock Estate Pistol",
        "category": "firearm",
        "subType": "vintage",
        "description": "An engraved silver flintlock pistol removed from the trophy case above the fireplace."
      },
      "weapon_ornate_dagger": {
        "name": "Gilded Heraldic Letter Dagger",
        "category": "sharp",
        "subType": "stabbing",
        "description": "A damascened steel letter dagger with emerald pommel used to pry the desk lock."
      },
      "weapon_heavy_candlestick": {
        "name": "Solid Brass Candlestick",
        "category": "blunt",
        "subType": "improvised",
        "description": "A heavy Georgian three-branch brass candle stand found overturned near the hearth."
      },
      "weapon_silk_scarf": {
        "name": "Monogrammed Parisian Silk Scarf",
        "category": "cloth",
        "subType": "restraint",
        "description": "A deep indigo Parisian silk scarf smelling of cologne, dropped during the break-in."
      },
      "weapon_iron_chisel": {
        "name": "Masonry Iron Safe Chisel",
        "category": "tool",
        "subType": "mechanical",
        "description": "A forged steel mason’s chisel bearing scratches from forcing the safe door hinges."
      },
      "weapon_palette_knife": {
        "name": "Conservator's Razor Palette Blade",
        "category": "blade",
        "subType": "fine cutting",
        "description": "An ultra-fine flexible surgical steel palette blade used to slice canvas from its stretcher."
      },
      "weapon_diamond_glass_cutter": {
        "name": "Diamond-Tipped Glass Scribe",
        "category": "tool",
        "subType": "glass cutting",
        "description": "A handheld brass glass cutter with a diamond point used to bypass display vitrines silently."
      },
      "weapon_duplicate_archive_key": {
        "name": "Duplicate Archival Gate Key",
        "category": "key",
        "subType": "access",
        "description": "A duplicate iron skeleton key fitted to the archival security gate."
      },
      "weapon_chloroform_cloth": {
        "name": "Solvent-Soaked Velvet Pad",
        "category": "chemical",
        "subType": "vapor",
        "description": "A velvet cleaning pad soaked in fast-acting aesthetic solvent used to incapacitate guards."
      },
      "weapon_uv_lamp": {
        "name": "Ultraviolet Inspection Torch",
        "category": "optical tool",
        "subType": "fluorescence",
        "description": "A portable 365nm UV torch used to inspect archival watermark fluorescence in darkness."
      },
      "weapon_cyanide_vial": {
        "name": "Cyanide Poison Bottle",
        "category": "poison",
        "subType": "chemical",
        "description": "A miniature amber glass bottle with a skull mark, smelling faintly of bitter almonds."
      },
      "weapon_gardening_shears": {
        "name": "Heavy Gardening Shears",
        "category": "sharp",
        "subType": "physical",
        "description": "Iron pruning shears with sharp blades and weathered wooden handles."
      }
    },
    "motives": {
      "motive_championship_rivalry": {
        "name": "Inter-School Sports Rivalry",
        "description": "Desperate desire to prevent St. Jude’s from winning the centenary championship banner."
      },
      "motive_disqualification_coverup": {
        "name": "Disqualification Cover-Up",
        "description": "Hiding a forged sports attendance register that would disqualify the lead athlete."
      },
      "motive_trophy_resale": {
        "name": "Selling Antique Gold Trophy",
        "description": "Scheme to sell the solid gold centerpiece of the trophy to an illegal metal dealer."
      },
      "motive_captaincy_jealousy": {
        "name": "Bitterness Over Team Captaincy",
        "description": "Deep resentment over being stripped of the team captain badge on sports eve."
      },
      "motive_falsified_grade_scandal": {
        "name": "Falsified Academic Eligibility",
        "description": "Panic over audit sheets showing athletic grades were inflated before the championship."
      },
      "motive_intellectual_theft": {
        "name": "Algorithm & Code Theft",
        "description": "Intent to steal the autonomous navigation algorithm for a commercial startup."
      },
      "motive_sabotage_rival": {
        "name": "Sabotaging First Prize",
        "description": "Desperation to prevent the winning prototype from taking the university scholarship."
      },
      "motive_corporate_espionage": {
        "name": "Corporate Trade Espionage",
        "description": "Selling proprietary sensor schematics to an external technology manufacturer."
      },
      "motive_scholarship_desperation": {
        "name": "Scholarship Desperation",
        "description": "Pressure to secure the exclusive national science fellowship at any cost."
      },
      "motive_patent_preemption": {
        "name": "Patent Preemption",
        "description": "Filing a patent on the motor drive before the student inventor could publicly demonstrate it."
      },
      "motive_inheritance": {
        "name": "Disputed Estate Will",
        "description": "Desperation to secure the original deed before the revised will could be registered."
      },
      "motive_financial_debt": {
        "name": "Crushing Gaming Debts",
        "description": "Imminent threat of bankruptcy and debtor’s prison driving a desperate heirloom theft."
      },
      "motive_blackmail": {
        "name": "Silencing Blackmail Threats",
        "description": "Recovering incriminating telegrams and promissory notes locked inside the manor safe."
      },
      "motive_ancient_scandal": {
        "name": "Suppressing Family Scandal",
        "description": "Hiding historic adoption documents proving the claimant has no rightful lineage."
      },
      "motive_resale_abroad": {
        "name": "Smuggling Heirloom Abroad",
        "description": "Secret arrangement with a continental collector to smuggle the diamond brooch overseas."
      },
      "motive_forgery_swap": {
        "name": "Masterpiece Forgery Swap",
        "description": "Swapping the illuminated manuscript with an aged counterfeit before the morning exhibition."
      },
      "motive_black_market_art": {
        "name": "Black Market Private Contract",
        "description": "A millions-worth commission from a private collector to smuggle the national treasure."
      },
      "motive_insurance_fraud": {
        "name": "Exhibition Insurance Payout",
        "description": "A staged theft to trigger a fraudulent multi-million pound insurance policy payout."
      },
      "motive_scholarly_prestige": {
        "name": "Exclusive Translation Monopoly",
        "description": "Desire to possess the only surviving ancient codex to secure permanent academic fame."
      },
      "motive_restitution_conflict": {
        "name": "Secret Heritage Restitution",
        "description": "An ideological plot to return the manuscript to its original ancestral order."
      },
      "motive_revenge": {
        "name": "Old Revenge",
        "description": "Payback for a past betrayal covered up many years ago."
      },
      "motive_scandal": {
        "name": "Hiding a Ruinous Scandal",
        "description": "Silencing the one witness who possessed indisputable proof of wrong-doing."
      },
      "motive_professional_jealousy": {
        "name": "Professional Jealousy",
        "description": "Bitter envy over stolen credit, forged credentials, and ruined reputations."
      }
    },
    "roomObjects": {
      "trophy_cabinet": {
        "title": "Trophy Display Cabinet",
        "roomName": "Principal's Trophy Hall",
        "description": "A polished glass display case with brass fittings and velvet lining.",
        "detailObservation": "The glass panel has fresh pry tool marks. The golden centenary trophy is missing from its pedestal.",
        "actionLabel": "Inspect the scratched lock and velvet base"
      },
      "cctv_monitor": {
        "title": "CCTV Security Desk",
        "roomName": "Principal's Trophy Hall",
        "description": "A security desk with twin CRT monitors and a video cassette deck.",
        "detailObservation": "Tape loop 3 is blinking yellow. The 8:27 PM surveillance segment was ejected and left half-inserted.",
        "actionLabel": "Examine tape slot and rewind controls"
      },
      "principal_desk": {
        "title": "Principal's Oak Desk",
        "roomName": "Principal's Trophy Hall",
        "description": "An authoritative oak desk with leather blotter, brass desk lamp, and files.",
        "detailObservation": "The confidential athletics drawer is pulled out. A ripped section of the sports attendance book lies beside it.",
        "actionLabel": "Inspect attendance register and papers"
      },
      "sports_locker": {
        "title": "Equipment & Trophy Locker",
        "roomName": "Principal's Trophy Hall",
        "description": "A row of olive-green vented metal athletic lockers.",
        "detailObservation": "Locker #7 stands slightly ajar. On the floor below rests a dropped metal token and muddy clay shoe prints.",
        "actionLabel": "Search inside locker and floor area"
      },
      "record_shelf": {
        "title": "School Yearbooks & Record Shelves",
        "roomName": "School Records Archive",
        "description": "Tall wooden bookshelves storing historical yearbooks, sports badges, and certificates.",
        "detailObservation": "A gold-fringed crimson satin ribbon is caught between the spines of the 1998 track annals.",
        "actionLabel": "Inspect book spines and ribbon scrap"
      },
      "science_bench": {
        "title": "Chemical Demonstration Bench",
        "roomName": "Junior Science Lab",
        "description": "Black slate lab bench fitted with gas nozzles, test-tube racks, and beakers.",
        "detailObservation": "A pungent chemical solvent puddle remains un-evaporated beside the Bunsen ring stand.",
        "actionLabel": "Swab solvent and check beaker marks"
      },
      "circuit_table": {
        "title": "Electronics & Soldering Table",
        "roomName": "Junior Science Lab",
        "description": "An anti-static workbench with soldering iron, oscilloscopes, and circuit boards.",
        "detailObservation": "A fresh solder scorch mark brands the wooden bench lip. Sliced copper wire snippets are scattered below.",
        "actionLabel": "Examine scorch mark and circuit wire"
      },
      "fume_hood": {
        "title": "Ventilated Chemical Fume Hood",
        "roomName": "Junior Science Lab",
        "description": "Glass-shielded fume chamber designed for safe volatile chemical handling.",
        "detailObservation": "An empty bottle of flux solvent sits tipped over against the back wall.",
        "actionLabel": "Inspect chemical bottle label"
      },
      "exhibition_podium": {
        "title": "First-Prize Exhibition Podium",
        "roomName": "Exhibition Gallery",
        "description": "A spotlighted circular podium covered in blue velvet with a championship ribbon.",
        "detailObservation": "The autonomous robot prototype is missing. Shattered fragments of an optical sensor lens lie on the velvet.",
        "actionLabel": "Collect sensor fragments from podium"
      },
      "prototype_case": {
        "title": "Smart Electronic Display Case",
        "roomName": "Exhibition Gallery",
        "description": "An acrylic display vitrine with an electronic RFID badge lock.",
        "detailObservation": "The digital badge scanner shows an authorized swipe at 10:48 PM right before the power cut.",
        "actionLabel": "Check digital access logs"
      },
      "fireplace": {
        "title": "Stone Hearth & Fireplace",
        "roomName": "Heritage Manor Study",
        "description": "A carved stone fireplace with crackling flames warming the whole room.",
        "detailObservation": "Logs burn steadily. Inside the gray hearth ashes, a piece of unburnt paper seems to have survived the heat.",
        "actionLabel": "Sift through the fireplace ashes"
      },
      "desk": {
        "title": "Mahogany Writing Desk",
        "roomName": "Heritage Manor Study",
        "description": "An elegant roll-top desk with brass drawer handles, notepad, and pen.",
        "detailObservation": "The center drawer has been forced open with a blade. Several papers were shoved into the bottom corner in a rush.",
        "actionLabel": "Search the secret drawer compartment"
      },
      "teatable": {
        "title": "Wingback Armchair & Tea Table",
        "roomName": "Heritage Manor Study",
        "description": "Deep crimson velvet armchairs surrounding an antique side table with silver tray.",
        "detailObservation": "A silver monogrammed cufflink is caught inside the deep seat seam of the armchair.",
        "actionLabel": "Search under cushion and tea tray"
      },
      "window": {
        "title": "Large Stone-Mullioned Window",
        "roomName": "Heritage Manor Study",
        "description": "Tall diamond-paned leaded windows looking out over the storm-swept terrace.",
        "detailObservation": "Heavy rain streaks down the glass. On the exterior stone sill, herringbone boot impressions are clearly visible.",
        "actionLabel": "Inspect sill for forensic prints"
      },
      "portrait": {
        "title": "Portrait of Lord Harrington",
        "roomName": "Heritage Manor Study",
        "description": "An oil painting of the manor’s ancestor in an ornate gold-gilded frame.",
        "detailObservation": "The canvas hangs tilted. Behind it, the stone wall reveals the concealed dial of an iron safe.",
        "actionLabel": "Inspect safe dial and wall opening"
      },
      "door_library": {
        "title": "Heavy Carved Oak Doorway",
        "roomName": "Heritage Manor Study",
        "description": "Double oak doors opening through to the adjoining wing."
      },
      "library_desk": {
        "title": "Archival Vault Desk",
        "roomName": "Concealed Stone Vault",
        "description": "A sturdy iron-banded desk stacked with leather account folios and estate deeds.",
        "detailObservation": "An accounts ledger lies open with page 44 excised cleanly with a razor.",
        "actionLabel": "Examine ledger and cut page edges"
      },
      "grandfather_clock": {
        "title": "Antique Grandfather Clock",
        "roomName": "Concealed Stone Vault",
        "description": "A tall walnut wood clock chiming every hour with a deep brass bell.",
        "detailObservation": "Behind the glass pendulum door, an impact-shattered pocket watch stopped at 12:04 AM was hidden.",
        "actionLabel": "Inspect clock base and pendulum area"
      },
      "bookcase_rare": {
        "title": "Iron-Barred Archive Shelves",
        "roomName": "Concealed Stone Vault",
        "description": "Reinforced shelves holding century-old parchment rolls and locked deed boxes.",
        "detailObservation": "A brass deed cylinder has been opened and left empty with scrape marks on the clasp.",
        "actionLabel": "Inspect deed cylinder and adjacent boxes"
      },
      "door_drawing": {
        "title": "Return Doorway",
        "roomName": "Concealed Stone Vault",
        "description": "Return through the concealed doorway to the main room."
      },
      "curator_desk": {
        "title": "Curator's Mahogany Study Table",
        "roomName": "Curator's Gallery Reading Hall",
        "description": "A wide reading desk equipped with magnifying lamp, cotton gloves, and reference catalogues.",
        "detailObservation": "A white art-handling glove rests crumpled beside an open ledger with sliced visitor entries.",
        "actionLabel": "Examine glove and ledger page"
      },
      "rare_manuscript_table": {
        "title": "Illuminated Manuscript Display Table",
        "roomName": "Curator's Gallery Reading Hall",
        "description": "A temperature-stabilized display table beneath a protective UV-filtered glass hood.",
        "detailObservation": "The 200-year-old manuscript is gone. Razor fibers of sliced binding canvas cling to the mounting frame.",
        "actionLabel": "Collect canvas fibers and examine frame"
      },
      "exhibition_case": {
        "title": "Rare Antiques Vitrine",
        "roomName": "Curator's Gallery Reading Hall",
        "description": "A freestanding glass case housing medieval wax seals and illuminated folios.",
        "detailObservation": "A fine diamond scribe line is scored along the lower edge of the vitrine glass.",
        "actionLabel": "Inspect glass cut and lock"
      },
      "archival_stacks": {
        "title": "Climate-Controlled Archival Stacks",
        "roomName": "Rare Archives Room",
        "description": "High floor-to-ceiling metal shelving storing rare manuscripts in archival Solander boxes.",
        "detailObservation": "Solander box #42 sits empty. A violet-fluorescing chemical varnish residue coats the shelf rim.",
        "actionLabel": "Scan shelf with UV inspection lamp"
      },
      "reading_desk": {
        "title": "Archivist Verification Desk",
        "roomName": "Rare Archives Room",
        "description": "A quiet verification station with ink pads, embossing presses, and provenance files.",
        "detailObservation": "A freshly stamped release slip bears a counterfeit curator signature with rapid-drying modern ink.",
        "actionLabel": "Compare release stamp and signature"
      }
    }
  }
};
