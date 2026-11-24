/**
 * THE LAST CLUE — Hinglish Localization Dictionary
 * Everyday Indian Hinglish for school children & beginner players.
 * Natural, friendly, and easy to understand while preserving detective tone.
 */

export const hinglish = {
  // App & Common
  app: {
    title: 'THE LAST CLUE',
    tagline: '"Har saboot ek nishan chhodta hai."',
    classified: 'KHUFIYA',
    scotlandYardArchive: 'POLICE ARCHIVE',
    dsaBadge: '100% PUZZLE ENGINE',
    version: 'Version 1.0',
    loading: 'Loading ho raha hai...',
    error: 'Kuch gadbad ho gayi',
    back: 'Peeche',
    cancel: 'Cancel',
    close: 'Band Karein',
    retry: 'Dobara Koshish Karein',
    confirm: 'Confirm Karein',
    save: 'Save Karein',
    search: 'Dhoondo',
    all: 'Sabhi',
    none: 'Koi nahi',
    or: 'ya'
  },

  // Language Selector
  language: {
    selectLanguage: 'Bhasha Chunein (Language)',
    hinglish: 'Hinglish (Hindi + English)',
    english: 'Simple English',
    hindi: 'हिन्दी (Hindi)'
  },

  // Movement Controls Settings & HUD Tips
  controls: {
    settingLabel: 'Chalne Ka Tareeqa (Controls)',
    both: {
      label: 'Both (Keyboard + Mouse)',
      badge: 'BOTH',
      desc: 'WASD keys ya mouse se drag karke chalo'
    },
    keyboard: {
      label: 'Sirf Keyboard (WASD)',
      badge: 'KEYBOARD',
      desc: 'W, A, S, D ya Arrow keys se chalo'
    },
    mouse: {
      label: 'Sirf Mouse (Hold & Drag)',
      badge: 'MOUSE',
      desc: 'Detective par click karke kheecho'
    },
    hudTipBoth: 'Chalne ke liye: WASD / Arrow keys use karein ya Detective ko pakad kar drag karein. Dekhne ke liye: [E]',
    hudTipKeyboard: 'Chalne ke liye: WASD / Arrow keys use karein. Dekhne ke liye: [E]',
    hudTipMouse: 'Chalne ke liye: Detective ko click karke drag karein. Dekhne ke liye: [E]',
    dragToMove: 'Chalne ke liye drag karein',
    switchControlsTitle: 'Movement Controls Badlein'
  },

  // Case Themes
  caseThemes: {
    trophy: {
      title: 'School Sports Trophy Ka Gayab Hona',
      tagline: 'Annual Championship Trophy aadhi raat ko showcase se gayab ho gayi!',
      locationName: "St. Jude's Academy — Trophy Hall & Library",
      complainant: 'Principal Sharma & Sports Coach Verma',
      incidentTime: 'Kal raat 8:30 PM (Sports Practice ke baad)',
      mission: 'Pata lagao ki school ki Golden Trophy kisne gayab ki aur woh kahan chhupayi gayi.',
      rooms: {
        school_hall: "Principal's Trophy Hall",
        school_library: 'School Library & Records Room'
      },
      doors: {
        to_library: 'School Library Ki Taraf Jao →',
        to_hall: 'Trophy Hall Ki Taraf Wapas Jao →'
      }
    },
    science: {
      title: 'Science Project Ki Chori Ka Raaz',
      tagline: 'Science Exhibition ka prize-winning robot model lab se chori ho gaya!',
      locationName: 'Junior Science Lab & Exhibition Hall',
      complainant: 'Science Teacher Mrs. Roy & Student Council',
      incidentTime: 'Aadhi raat 11:00 PM (Storm ke dauran)',
      mission: 'Pata lagao ki science project kisne churaya aur lab mein kaunsa saboot chhoda gaya.',
      rooms: {
        science_lab: 'Junior Science Laboratory',
        exhibition_hall: 'Science Exhibition Hall'
      },
      doors: {
        to_exhibition: 'Exhibition Hall Ki Taraf Jao →',
        to_lab: 'Science Lab Ki Taraf Wapas Jao →'
      }
    },
    treasure: {
      title: 'Purani Haweli Ke Khazane Ka Raaz',
      tagline: 'Haweli ke secret vault se purana heere ka haar aur dastavez gayab hain!',
      locationName: 'Blackwood Heritage Study & Secret Vault',
      complainant: 'Manor Caretaker & Heritage Trust',
      incidentTime: 'Aadhi raat 12:00 AM',
      mission: 'Pata lagao ki secret vault ka tala kisne khola aur khazana kahan le jaya gaya.',
      rooms: {
        manor_study: 'Heritage Manor Study',
        secret_vault: 'Secret Heritage Vault'
      },
      doors: {
        to_vault: 'Secret Vault Ki Taraf Jao →',
        to_study: 'Study Room Ki Taraf Wapas Jao →'
      }
    },
    library: {
      title: 'Whispering Library Ki Gayab Kitaab',
      tagline: 'Purani library se 200 saal purani illuminated golden book achanak gayab ho gayi!',
      locationName: 'Central Heritage Library & Rare Archives',
      complainant: 'Head Librarian Mr. Sen',
      incidentTime: 'Shaam 7:00 PM (Library closing ke waqt)',
      mission: 'Pata lagao ki rare book kisne nikali aur uske panna todne ki kya wajah thi.',
      rooms: {
        reading_hall: "Curator's Reading Hall",
        rare_archives: 'Rare Manuscript Archives'
      },
      doors: {
        to_archives: 'Rare Archives Ki Taraf Jao →',
        to_reading: 'Reading Hall Ki Taraf Wapas Jao →'
      }
    }
  },

  // Case Introduction 5-Panel Cinematic Story
  caseIntro: {
    skipBtn: 'Skip Intro',
    nextBtn: 'Aage Dekhein',
    prevBtn: 'Peeche',
    startBriefingBtn: 'Detective Briefing Kholo',
    keyFactLabel: 'Ahem Jankari',
    step1Badge: 'KAHANI KA SHURUAT',
    step2Badge: 'GHATNA KI JAGAH',
    step3Badge: 'GHATNA KA WAQT',
    step4Badge: 'REPORT KISNE KI',
    step5Badge: 'TAFTEESH KI WAJAH',
    whatHappenedQuestion: '1. Aakhir Hua Kya Tha?',
    whereQuestion: '2. Yeh Ghatna Kahan Hui?',
    whenQuestion: '3. Yeh Kis Waqt Hua?',
    whoReportedQuestion: '4. Iski Report Kisne Ki?',
    whyInvestigateQuestion: '5. Tafteesh Kyun Zaroori Hai?',
    trophy: {
      whatHeadline: 'School Ki Sabse Keemti Trophy Gayab Ho Gayi!',
      whatDesc: 'St. Jude’s Academy ki annual championship trophy kal raat locked glass cabinet se gayab ho gayi. Lock toota hua hai aur velvet cushion par ajeeb scratches hain.',
      whatHighlight: 'Lock toota hua hai aur paas mein ek mitti ka nishan chhoota hai.',
      whereHeadline: 'Principal Ka Trophy Hall & Library',
      whereDesc: 'Ghatna Main School Building ke Trophy Hall mein hui, jo school library se juda hua hai. Aas-paas mud track clay aur footprints bikhre hain.',
      whereHighlight: 'Do hi kamron ka rasta hai: Trophy Hall aur Record Library.',
      whenHeadline: 'Kal Raat Toofan Ke Dauran (8:30 PM)',
      whenDesc: 'Annual sports day ki practice khatam hone ke baad, aadhi raat ko tez baarish ho rahi thi. Security guard ne achanak ek parchhai bhagte hue dekhi.',
      whenHighlight: 'Ghatna theek practice khatam hone ke baad 8:30 PM par hui.',
      whoHeadline: 'Principal Sharma & Coach Verma Ne Bulaya',
      whoDesc: 'Subah jab school khula toh Principal Sharma ne cabinet khaali dekha aur turant hume call kiya. Unhone kaha ki yeh kisi andar ke shaks ka kaam lagta hai.',
      whoHighlight: 'Principal ne kaha: "Humein kisi innocent student par shak nahi karna, sach dhoondo."',
      whyHeadline: 'Ceremony Mein Sirf 2 Ghante Baki Hain!',
      whyDesc: 'Annual Championship Ceremony theek do ghante mein shuru hone wali hai. Agar asli saboot se chor nahi pakda gaya, toh galat shaks par ilzaam lag jayega!',
      whyHighlight: 'Lead detective ban kar sabhi saboot jama karo aur asli culprit ko pakdo!'
    },
    science: {
      whatHeadline: 'First Prize Science Model Gayab Ho Gaya!',
      whatDesc: 'Junior Science Fair ka sabse smart robotics project kal raat exhibition lab se achanak gayab ho gaya! Project podium khaali pada hai.',
      whatHighlight: 'Lab bench par chemical solvent ka daag aur ek phata hua blueprint mila hai.',
      whereHeadline: 'Junior Science Lab & Exhibition Hall',
      whereDesc: 'Lab room ground floor par hai jismein chemical benches, chalkboard aur locked cabinets hain. Khidki bahar garden mein khulti hai.',
      whereHighlight: 'Exhibition Hall aur Science Lab aapas mein double doors se jude hain.',
      whenHeadline: 'Kal Raat Aadhi Raat (11:00 PM)',
      whenDesc: 'Storm ke waqt jab bijli chali gayi thi, kisi ne master key use karke lab ka darwaza khola aur project le kar nikal gaya.',
      whenHighlight: 'Deewar par lagi ghadi theek 11:00 PM par ruk gayi thi.',
      whoHeadline: 'Science Teacher Mrs. Roy Ne Report Kiya',
      whoDesc: 'Mrs. Roy subah lab aayi toh experiment bench par toote hue flasks aur tooti ghadi mili. Unhone Scotland Yard aur humare detective unit ko turant bulaya.',
      whoHighlight: 'Mrs. Roy ne kaha: "Project ke blueprint ke bina use chalana mushkil hai."',
      whyHeadline: 'Judges Ki Team 1 Ghante Mein Aa Rahi Hai!',
      whyDesc: 'Science fair ki prize ceremony shuru hone wali hai. Humein har saboot ko jod kar chor ko dhoondna hai taaki student ka hard work bach sake!',
      whyHighlight: 'Lab mein bikhre chemicals aur notes se asli culprit tak pahuncho!'
    },
    treasure: {
      whatHeadline: 'Purana Khazana Aur Dastavez Chori Ho Gaye!',
      whatDesc: 'Heritage Manor ke secret safe se purana heere ka haar aur zameen ke ahem dastavez gayab hain. Safe ka password sirf 3 logon ko pata tha!',
      whatHighlight: 'Safe ke peeche ek burnt telegram aur silver cufflink mila hai.',
      whereHeadline: 'Heritage Manor Study & Secret Vault',
      whereDesc: 'Haweli ke purane study room ke parde ke peeche ek secret vault chhupta hai. Har kone mein purani cheezein aur suraagh bikhre hain.',
      whereHighlight: 'Study Room se Secret Vault ka hidden darwaza khulta hai.',
      whenHeadline: 'Aadhi Raat 12:00 AM Ki Barbaadi',
      whenDesc: 'Haweli mein jab sab so rahe the, kisi ne library ke raste aakar study ka darwaza khola aur safe khali kar diya.',
      whenHighlight: 'Grandfather clock ke swinging pendulum ke paas toota hua kanch mila.',
      whoHeadline: 'Haweli Ke Caretaker Ne Inform Kiya',
      whoDesc: 'Subah study room ka darwaza ajar (khula) mila. Caretaker ne dekha ki safe khula hai aur oil portrait tedha latka hai.',
      whoHighlight: 'Haweli ke 4 ahem mehmaan aur staff shaq ke ghere mein hain.',
      whyHeadline: 'Chor Haweli Chhod Kar Bhaagne Wala Hai!',
      whyDesc: 'Train station se aakhri gaadi nikalne se pehle humein asli culprit ko pakadna hoga, warna khazana hamesha ke liye gayab ho jayega!',
      whyHighlight: 'Har saboot ko evidence board par jodo aur asli culprit ko pehchaano!'
    },
    library: {
      whatHeadline: '200 Saal Purani Golden Book Gayab!',
      whatDesc: 'City Central Library ki sabse purani handmade manuscript achanak display case se gayab ho gayi. Is kitaab mein sheher ke ahem raaz darj the.',
      whatHighlight: 'Display table par syahi (ink) ka daag aur ek chhota blade mila hai.',
      whereHeadline: 'Curator Reading Room & Rare Archives',
      whereDesc: 'Ghatna library ke upper reading wing mein hui jahan purani almariyan aur rolling ladder lagi hain.',
      whereHighlight: 'Sirf library members ko is private archive mein aane ki permission thi.',
      whenHeadline: 'Library Band Hone Ke Theek Pehle (7:00 PM)',
      whenDesc: 'Librarian jab register lock kar rahe the, unhone kisi ko tezi se stairs se utarte hue dekha.',
      whenHighlight: 'Register ledger ka aakhri page phata hua mila hai.',
      whoHeadline: 'Head Librarian Mr. Sen Ne Shikayat Ki',
      whoDesc: 'Mr. Sen ne police aur humare detective department ko turant call karke bulaya.',
      whoHighlight: 'Mr. Sen: "Yeh kitaab sheher ki dharohar hai, ise dhoondna zaroori hai."',
      whyHeadline: 'Manuscript Ko Damage Hone Se Bachana Hai!',
      whyDesc: 'Kitaab ke panne bahut naazuk hain. Agar jaldi nahi dhoonda gaya toh chor use bech dega ya destroy kar dega!',
      whyHighlight: 'Sabhi suspects ke bayanaat match karo aur sach samne lao!'
    }
  },

  // Detective Briefing Dossier
  briefing: {
    officialDossierTag: 'SCOTLAND YARD • CASE DOSSIER',
    missionLabel: 'MISSION OBJECTIVE (AHEM MAQASAD)',
    incidentLocation: 'GHATNA KI JAGAH:',
    incidentTime: 'GHATNA KA WAQT:',
    reportedBy: 'REPORT KISNE KI:',
    startingLead: 'PEHLA SURAAGH (STARTING CLUE):',
    initialSearch: 'Kamre mein chhupe saboot dhoondo',
    suspectLineupTitle: 'SHAKKI LOGON KI LIST (SUSPECTS)',
    suspectLineupSubtitle: 'In sabhi logon ke paas us waqt wahan aane ka mauka tha',
    rewatchStory: 'Kahani Dobara Dekhein',
    enterInvestigationBtn: '🔎 Kamre Mein Dakhil Hon (Enter Investigation)',
    viewBriefingBtn: 'Briefing File',
    headerBadge: 'Briefing'
  },

  // Investigation Milestones
  objectives: {
    stepTag: 'STEP',
    checklistTitle: 'TAFTEESH KA CHECKLIST (PROGRESS)',
    step1Title: 'Crime scene ki talashi lo aur pehla saboot inspect karo',
    step1Desc: 'Kamre mein ghoomkar highlighting objects par click karo aur suraagh jama karo.',
    step2Title: 'Baqi sabooton ko dhyan se dhoondo ({current}/{total} mile)',
    step2Desc: 'Doosre kamre mein jakar check karo ki chor ne wahan kya chhoda hai.',
    step3Title: 'Diary mein Suspects ke bayanaat review karo',
    step3Desc: 'Har suspect ke motive aur alibi ko padho, ahem suspect ko Person of Interest (POI) mark karo.',
    step4Title: 'Evidence Board [B] par sabooton ki kadiyan jodo',
    step4Desc: 'Dekho kaunsa suspect kis saboot aur kis kamre se jud raha hai.',
    step5Title: 'Asli Culprit par aakhri ilzaam lagao [A]',
    step5Desc: 'Pakke saboot ke saath court mein apna verdict file karo.'
  },

  // Progressive Hint System
  hints: {
    title: 'Suraagh (Hint)',
    modalTitle: 'DETECTIVE HINT SYSTEM (SURAAGH)',
    modalSubtitle: 'Progressive guidance bina solution leak kiye',
    tier1Badge: 'HINT 1 • LOCATION GUIDE',
    tier1Title: 'Kahan Dhoondhein?',
    tier2Badge: 'HINT 2 • CLUE FOCUS',
    tier2Title: 'Kaunsa Saboot Ahem Hai?',
    tier3Badge: 'HINT 3 • DEDUCTION HELPER',
    tier3Title: 'Kadiyan Kaise Jodein?',
    lockedNotice: 'Pehle pichhla hint unlock karein',
    hintsUsedLabel: 'Hints Used',
    unlockNextBtn: 'Agla Hint Kholo',
    resumeInvestigationBtn: 'Investigation Jaari Rakhein',
    hintBtn: '💡 Hint',
    openBtn: '💡 Suraagh [H]',
    trophy: {
      tier1Search: 'Abhi bhi {count} ahem saboot chhupe hain. Trophy cabinet aur library ke record desk ko dhyan se check karo!',
      tier1AllFound: 'Aapne kamre ke saare saboot dhoond liye hain! Ab suspects ke bayanaat aur alibi compare karo.',
      tier2Focus: 'Saboot "{clueName}" par dhyan do. Dekho kaunsa suspect sports track ya garden se hokar aaya tha.',
      tier2Default: 'Mitti ke nishan aur phate hue kagaz match karo: kis suspect ka juton ka nishan wahan tha?',
      tier3Deduction: 'Evidence Board kholo. Jis suspect ke paas trophy hall ka access tha aur jiske motive mein sports jealousy ya attendance issue tha, use select karo.'
    },
    science: {
      tier1Search: 'Lab bench aur project podium ke paas {count} saboot baaki hain. Unpar magnifier use karo!',
      tier1AllFound: 'Saare laboratory clues mil chuke hain. Ab Evidence Pinboard [B] khol kar unhe jodo.',
      tier2Focus: 'Chemical residue aur blueprint ke tukde ko check karo: kis suspect ke paas lab chemicals ki access thi?',
      tier2Default: 'Blackboard par bana formula aur drop hua gear dhyan se dekho.',
      tier3Deduction: 'Check karo ki kis suspect ne project submit karne ke waqt competition se dar kar model chhupaya tha.'
    },
    treasure: {
      tier1Search: 'Desk aur grandfather clock ke chamber mein abhi {count} suraagh bikhre hain.',
      tier1AllFound: 'Saare heritage artifacts inspect ho chuke hain. Ab suspects ki diary padhein.',
      tier2Focus: 'Torn telegram aur burnt check par dhyan do: kis suspect par karz tha ya inheritance chahiye thi?',
      tier2Default: 'Cufflink aur pocket watch ke time ko note karo.',
      tier3Deduction: 'Sirf wahi suspect culprit ho sakta hai jo aadhi raat ko safe ke paas maujood tha aur jiska hathiyar match ho raha ho.'
    },
    library: {
      tier1Search: 'Library ke rare archives mein {count} aur documents chhupe hain. Almariyon ko check karo!',
      tier1AllFound: 'Library ke saare suraagh mil gaye. Ab Evidence Board check karo.',
      tier2Focus: 'Register ke kate hue panne aur blade mark ko dekho.',
      tier2Default: 'Rare book ke cover par ungliyon ke nishan dhyan se dekho.',
      tier3Deduction: 'Librarian ke bayanat aur suspects ke entry time ko compare karke aakhri faisla lo.'
    }
  },

  // Navigation
  nav: {
    howToPlay: 'Kaise Khelein',
    experience: 'Game Features',
    methodology: 'Rules & Levels',
    beginCase: 'Case Shuru Karein →',
    crimeScene: 'Crime Scene Room',
    evidenceBoard: 'Evidence Board',
    clues: 'Saboot (Clues)',
    suspects: 'Shakki Log (Suspects)',
    locations: 'Haweli & Hathiyar',
    journal: 'Detective Diary'
  },

  // Landing Page Hero
  hero: {
    caseBadge: 'CASE FILE #4092-B • SCOTLAND YARD',
    headline: 'EVERY CLUE LEAVES A TRACE.',
    headlineHinglish: 'HAR SABOOT EK NISHAN CHHODTA HAI.',
    supportingStory: 'Har raaz ke peeche ek kahani hai. Kya tum sach tak pahunch sakte ho?',
    subhead: 'Blackwood Manor mein aadhi raat ko ek mysterious crime hua. Ek sachhe Detective ki tarah sabhi sabooton ko dhyan se dekho, unka aapas ka connection jodo, aur asli culprit ko pehchaano!',
    beginBtn: '🔎 START INVESTIGATING',
    methodologyBtn: '📜 Discover the Mystery →',
    startInvestigating: '🔎 START INVESTIGATING',
    discoverMystery: '📜 Discover the Mystery →',
    secretClueFound: '✦ Suraagh mila! Lamppost ke paas ek purana chandi ka button mila',
    exploreWorldTip: '🔍 Street par magnifying glass ghumao aur suraagh dhoondo',
    specs: {
      logic: {
        title: 'SMART LOGIC',
        desc: 'Har case ek solid puzzle ki tarah banta hai, jismein sirf ek hi asli culprit hota hai'
      },
      graph: {
        title: 'CONNECTING GRAPH',
        desc: 'Saboot aur suspects aapas mein judkar ek khoji rasta banate hain'
      },
      fair: {
        title: '100% FAIR PUZZLE',
        desc: 'Bina kisi AI ke, har baar ek naya aur fair case generate hota hai'
      }
    }
  },

  // How to play (3 steps)
  howToPlay: {
    protocolBadge: 'INVESTIGATION RULES',
    title: 'CASE SOLVE KARNE KE 3 EASY STEPS',
    subtitle: 'Ek hoshiyaar detective ki tarah case ko step-by-step solve karo.',
    step1: {
      num: '01',
      title: 'Sabooton Ko Dhyan Se Dekho',
      desc: 'Kamre mein ghoomkar aag ki raakh, phate hue khat, tooti ghadi aur mitti ke nishaan dhoondo. Har case mein ek pehla suraagh milta hai.',
      tag: 'SABOOT KI KHOJ'
    },
    step2: {
      num: '02',
      title: 'Kadiyon Ko Aapas Mein Jodo',
      desc: 'Evidence Board kholo. Dekho kaunsa suspect kis kamre mein gaya tha, kiske paas kaunsa hathiyar tha, aur kiski baat jhoothi lag rahi hai.',
      tag: 'KADI SE KADI'
    },
    step3: {
      num: '03',
      title: 'Asli Culprit Ko Pehchaano',
      desc: 'Jab saare saboot match ho jayein, tab Court mein apna verdict do. Police check karegi ki aapka shak sahi hai ya galat!',
      tag: 'ASLI FAISLA'
    }
  },

  // Case Experience Preview
  preview: {
    systemBadge: 'WORKSPACE OVERVIEW',
    title: 'DETECTIVE KA TOOLBOX',
    subtitle: 'Yeh saare tools aapko sachai tak pahunchane mein madad karenge.',
    boardTitle: 'Evidence Pinboard (Saboot Board)',
    boardDesc: 'Ek interactive board jahan saboot, kamre, hathiyar aur suspects aapas mein jude dikhte hain. Ek click par jaano kaun kisse juda hai.',
    featuresList: [
      'Alag-alag rang ke cards: Suspects, Clues, Rooms aur Weapons ke liye',
      'Kadiyan dikhane wali lines: "Kahan mila", "Kiska hai", "Kyun kiya"',
      'Aasan list view: Agar graph complex lage toh seedhi list dekho'
    ],
    journalTitle: 'Suspect Profiles & Diary',
    journalDesc: 'Har suspect ki aadat, unke secret motives aur unka pichhla record padho. Jisko sabse zyada shakki maano, use "Person of Interest (POI)" mark karo.',
    journalFeaturesList: [
      'Person of Interest (POI) flag: Khaas shakkiyon ko alag se mark karo',
      'Detective Notes: Har saboot par apni personal notes likho',
      'Progress Meter: Track karo ki aapne kitna investigation poora kar liya'
    ]
  },

  // Complexity Tiers
  tiers: {
    badge: 'DIFFICULTY LEVELS',
    title: 'APNI PASAND KA LEVEL CHUNEN',
    subtitle: 'Naye detectives ke liye easy, aur experienced dimaag ke liye hard mode.',
    easy: {
      badge: 'EASY (BEGINNER)',
      title: '3 Suspects • 3 Clues',
      desc: 'Shuruat karne ke liye best! Kam suspects, seedhe saboot aur sirf 1 bhatkane wala jhootha lead.'
    },
    medium: {
      badge: 'MEDIUM (STANDARD)',
      title: '4 Suspects • 4 Clues',
      desc: 'Classic detective mystery! 2 jhoothe leads jo aapka dhyan bhatkane ki koshish karenge. Dhyan se socho.'
    },
    hard: {
      badge: 'HARD (MASTER DETECTIVE)',
      title: '5 Suspects • 6 Clues',
      desc: 'Dimagi challenge! 3 bhatkane wale jhoothe leads aur uljhi hui kahani. Sirf pakke saboot par vishwas karo.'
    }
  },

  // Start Screen / Live Case Launch
  startScreen: {
    dispatchBadge: 'DISPATCH TERMINAL',
    title: 'NAYA CASE SHURU KAREIN',
    subtitle: 'Neeche settings select karo aur apni investigation start karo.',
    briefing: 'Blackwood Manor mein aadhi raat ko ek mysterious crime hua. Ameer maalik ki laash mili hai. Poore ghar mein saboot bikhre hain aur har shaks par shak hai. Aapko ek lead detective ban kar kamron ki talashi leni hai, saboot jama karne hain aur asli culprit ko pakadna hai.',
    selectComplexity: 'Case Ka Level Chunein:',
    seedLabel: 'Case Code / Seed (Optional):',
    seedPlaceholder: 'jaise 12345 (Random case ke liye khaali chhodo)',
    seedHint: 'Har number se ek alag case banta hai. Doston ke saath same number share karke dekho kaun pehle solve karta hai!',
    randomizeBtn: '🎲 Random Code',
    clearBtn: 'Clear',
    startBtn: '🔎 Case File Kholo Aur Investigation Shuru Karo',
    loadingBtn: 'Case File Khul Rahi Hai...',
    fieldManualToggle: 'DETECTIVE RULES BOOK',
    hideManual: '▲ Band Karein',
    viewManual: '▼ Rules Padhein',
    steps: [
      'Pehle Suraagh Par Dhyan Do: Har case ek initial lead se start hota hai.',
      'Kamre Mein Ghumo: W, A, S, D ya Arrow keys se detective ko chalao aur [E] daba kar cheezein check karo.',
      'Evidence Board Dekho: [B] daba kar dekho kaunsa saboot kis shaks se jud raha hai.',
      'Indictment / Aarop Lagao: [A] daba kar us shaks ko chuno jis par sabse pakka saboot ho.'
    ]
  },

  // Case Header
  header: {
    progress: 'Tafteesh Progress',
    newCase: 'Naya Case',
    newCaseTitle: 'Ek naya case generate karo',
    archive: 'Main Menu',
    archiveTitle: 'Start screen par wapas jao',
    fileAccusation: 'Culprit Pakdo (Accuse)',
    fileAccusationTitle: 'Asli culprit par aakhri ilzaam lagao',
    caseActive: 'CASE-ACTIVE',
    seed: 'CODE'
  },

  // Game Viewport & HUD
  hud: {
    objectiveLabel: 'MISSION OBJECTIVE',
    evidenceLabel: 'SABOOT:',
    solvabilityLabel: 'PROGRESS:',
    journalBtn: 'Diary',
    boardBtn: 'Board',
    suspectsBtn: 'Suspects',
    accuseBtn: 'Culprit Batayein',
    muteSound: 'Awaaz Band Karein',
    unmuteSound: 'Awaaz Chalu Karein',
    passageway: 'RASTA / DARWAZA',
    forensicExam: 'SABOOT KI JANCH',
    passThroughDoor: 'Darwaze se andar jao →',
    examineObject: 'Cheez ko dhyan se dekho [E] →',
    objectives: {
      initialDrawingRoom: 'Crime scene mein ghoomkar saboot dhoondo. Objects par click karke chhupe saboot nikalo.',
      exploringRooms: 'Baqi kamron ki talashi lo ({current}/{total} saboot mil gaye). Agle kamre mein jaane ke liye darwaza use karo.',
      allCluesFound: 'Saare saboot mil gaye! Evidence Board [B] mein saboot jodo ya Culprit ko pakdo [A].'
    },
    controlsTip: 'Chalne ke liye WASD / Arrow Keys use karo. Cheezon ko dekhne ke liye [E] dabao.'
  },

  // Object Inspector Modal
  inspector: {
    dossierBadge: 'OBJECT DOSSIER',
    closeAria: 'Inspector band karein',
    examiningArtifact: 'BARIKEE SE JANCH HO RAHI HAI...',
    evidenceRecorded: 'SABOOT MIL GAYA',
    scotlandYard: 'SCOTLAND YARD',
    archivalSecured: 'RECORDED',
    observationLabel: 'DETECTIVE KI NAZAR',
    irregularityDetected: '⚠ KUCH SHAKKI CHEEZ DIKHI HAI',
    evidenceIdentified: '✦ PAKKA SABOOT MIL GAYA!',
    promptText: 'Is jagah ko dhyan se check karne par koi zaroori saboot mil sakta hai.',
    actionInspecting: 'Powder aur Magnifying Glass se check ho raha hai...',
    actionSearchDefault: 'Cheezon ko dhyan se dekho aur saboot dhoondo',
    reliability: 'RELIABILITY',
    statusFiled: 'STATUS: DIARY AUR EVIDENCE BOARD MEIN SAVE HO GAYA',
    noEvidenceNote: 'YAHAN KOI SHAKKI SABOOT NAHI MILA.',
    hotkeyTip: '[ESC] DABAYEIN YA BAHAR CLICK KARKE WAPAS JAYEIN',
    resumeBtn: 'Investigation Jaari Rakhein'
  },

  // Clue Panel
  cluePanel: {
    title: 'SABOOT AUR DASTAWEZ (CLUES)',
    subtitle: 'Crime scene se mile physical saboot aur kagazaat.',
    filterAll: 'Saare Saboot',
    filterUnexamined: 'Bina Dekhe',
    filterExamined: 'Dekhe Gaye',
    initialLead: '★ PEHLA SURAAGH',
    reliability: 'Vishwasniyata (Reliability):',
    examinedBadge: '✓ DEKH LIYA',
    unexaminedBadge: 'DEKHNA BAAKI',
    observationLabel: 'DETECTIVE KI PERSONAL NOTE:',
    notesPlaceholder: 'Is saboot ke baare mein apna shak ya vichar yahan likhein...',
    markExamined: 'Dekh Liya (Mark as Examined)',
    markUnexamined: 'Dobara Check Karein',
    viewOnBoard: '🕸️ Board Par Dekho',
    emptyFilter: 'Is filter mein koi saboot nahi hai.'
  },

  // Suspect Panel
  suspectPanel: {
    title: 'SHAKKI LOGON KI LIST (SUSPECTS)',
    subtitle: 'Ghatna ke waqt Blackwood Manor mein maujood log.',
    filterAll: 'Saare Suspects',
    filterPoi: 'Khaas Shakki (POIs)',
    poiRibbon: '★ KHAAS SHAKKI (POI)',
    traitsLabel: 'Swabhav (Traits):',
    accessLabel: 'Kahan Ja Sakte The:',
    weaponsLabel: 'Kaunse Hathiyar Use Kar Sakte The:',
    motivesLabel: 'Ghatna Ki Wajah (Motive):',
    markPoi: '☆ POI Mark Karein',
    unmarkPoi: '★ POI Hatayein',
    viewOnBoard: '🕸️ Board',
    accuseBtn: '⚖️ Culprit Batayein',
    emptyFilter: 'Filhal koi suspect Person of Interest nahi hai.'
  },

  // Location & Weapons Panel
  locationPanel: {
    title: 'HAWELI, HATHIYAR AUR MOTIVES',
    subtitle: 'Blackwood Manor ke kamre, mile hue hathiyar aur crime ki wajah.',
    tabRooms: 'Haweli Ke Kamre',
    tabWeapons: 'Baramad Hathiyar',
    tabMotives: 'Crime Ki Wajah (Motives)',
    compatibleWeapons: 'Yahan Use Ho Sakne Wale Hathiyar:',
    viewOnBoard: '🕸️ Evidence Board Par Dekho'
  },

  // Evidence Board
  board: {
    title: 'EVIDENCE PINBOARD',
    subtitle: 'Saboot, kamron aur suspects ka aapas ka rishta samjhein.',
    toggleCanvas: 'Pinboard View',
    toggleList: 'List View',
    resetView: 'Reset Zoom',
    zoomIn: 'Zoom +',
    zoomOut: 'Zoom -',
    filterAll: 'Sabhi Nodes',
    filterSuspects: 'Suspects',
    filterClues: 'Clues',
    filterRooms: 'Rooms',
    filterWeapons: 'Weapons',
    connectedEvidence: 'JUDI HUI KADIYAN',
    startingLead: '★ PEHLA SURAAGH',
    closeDrawer: 'Band Karein',
    connectionsCount: 'connections',
    listTitle: 'CONNECTED EVIDENCE REPOSITORY',
    nodesLabel: 'Items',
    edgesLabel: 'Kadiyan',
    emptyStateHint: 'Crime scene mein cheezein dekho — board par chuppe connections dheere dheere saamne aayenge.',
    types: {
      suspect: 'SUSPECT',
      clue: 'SABOOT',
      location: 'KAMRA',
      weapon: 'HATHIYAR',
      evidence: 'HATHIYAR',
      motive: 'WAJAH'
    }
  },

  // Relationship Edge Labels
  relationships: {
    found_at: 'mila tha yahan',
    connected_to: 'juda hua hai',
    points_to: 'ishara karta hai',
    belongs_to: 'iska hai',
    motivated_by: 'wajah thi',
    knows: 'jaanta hai',
    linked: 'juda hai'
  },

  // Investigation Journal
  journal: {
    title: 'DETECTIVE FIELD DIARY',
    subtitle: 'Tafteesh ka official record, aapke vichar aur case progress.',
    caseCompletion: 'CASE COMPLETE:',
    caseFileLabel: 'CASE FILE',
    reportedBy: 'Report Kiya',
    currentObjective: 'ABHI KA LAKSHYA',
    objectiveStart: 'Crime scene mein ghoomein aur highlighted cheezein dekhein — pehla suraagh dhoondein.',
    objectiveExploring: 'Dhoondha jaari rakhein — aapne {total} mein se {found} clue dhoondhe hain. Doosre kamre mein bhi dekhein!',
    objectiveAllClues: 'Saare clue mil gaye! Evidence Board [B] kholein aur Suspect profiles dekhein.',
    objectiveHasPoi: 'Aapne {name} ko main shakki banaya hai. Board dekhein, phir Accusation [A] file karein.',
    hypothesisTitle: 'DETECTIVE KI THEORIES AUR FIELD NOTES',
    hypothesisDesc: 'Kisko mauka mila tha, kiske paas hathiyar tha aur kaun jhooth bol raha hai — yahan note karein.',
    hypothesisPlaceholder: 'Apni overall case theory yahan likhein: Kaun guilty ho sakta hai aur kyun...',
    logTitle: 'CLUE NOTES LOG',
    noNotes: 'Abhi tak kisi clue par note nahi likhi gayi hai. Clues panel mein jakar notes likhein.',
    unresolvedTitle: 'ANSULJE SAWAAL',
    metricsTitle: 'INVESTIGATION METRICS',
    statExamined: 'Dekhe Gaye',
    statPending: 'Baqi Clues',
    statPois: 'POIs',
    inspectionProgress: 'Saboot Dekhne Ka Progress:',
    poiTitle: 'KHAAS SHAKKI (POIs)',
    noPois: 'Abhi tak kisi suspect ko Person of Interest mark nahi kiya gaya hai.',
    suspectsLabel: 'SAARE SUSPECTS',
    questions: {
      trophy: {
        q1: 'Sports practice ke baad Trophy Hall mein kaun tha?',
        q2: 'Attendance register ka panna kisne aur kyun phaada?',
        q3: 'Khidki ki silll par keechad ke nishan kiske joote ke hain?'
      },
      science: {
        q1: 'Exhibition se pehli raat lab mein kaun ghusa tha?',
        q2: 'Chemical residue kis cheez ka hai aur woh kiske paas tha?',
        q3: 'Blackboard se blueprint ka tukda kisne kyun phaada?'
      },
      treasure: {
        q1: 'Estate malik ke alawa tijoree ka code aur kaun jaanta tha?',
        q2: 'Jale hue telegram mein kya likha tha?',
        q3: 'Aadhi raat ko bagicha mein taaze joote ke nishan kyun the?'
      },
      library: {
        q1: 'Manuscript ko akhri baar kis authorized insaan ne haath lagaya tha?',
        q2: 'Visitor register ka panna itni safai se kyun kaata gaya?',
        q3: 'Almaari ke andar chemical residue kis baat ka ishara deta hai?'
      }
    }
  },

  // Accusation Modal
  accusation: {
    badge: 'COURT PROCEEDINGS',
    title: 'ASLI CULPRIT KO ARREST KARWAO',
    subtitle: 'Sabooton ke aadhar par bataiye ki asli mujrim kaun hai.',
    selectPrompt: 'Suspects ki list mein se Culprit chunein:',
    selectedBadge: '✓ CHUNA GAYA',
    rationaleLabel: 'Aapko aisa kyun lagta hai? (Optional Reasoning):',
    rationalePlaceholder: 'Bataiye kaunsa saboot is suspect ko crime scene se jodta hai...',
    cancelBtn: 'Cancel',
    reviewBtn: 'Faisla Confirm Karein →',
    confirmTitle: 'CHARGES CONFIRM KAREIN',
    confirmPrompt: 'Aap inke khilaaf murder charges file karne ja rahe hain:',
    statementRecorded: 'Aapka Bayan (Statement):',
    backBtn: '← Wapas',
    submitBtn: 'Faisla Submit Karein (Send to Police)',
    verifying: 'Scotland Yard se verify ho raha hai...'
  },

  // Accusation Result / Verdict Screen
  verdict: {
    victoryBadge: 'CASE SOLVED • CULPRIT PAKDA GAYA!',
    victoryTitle: 'SHAABASH DETECTIVE! MUJRIM PAKDA GAYA',
    victoryFeedback: 'Police ne aapke sabooton ko bilkul sahi paya! Pakke sabooton ke aage mujrim ne apna gunaah qabool kar liya hai. Aapne case solve kar liya!',
    defeatBadge: 'ILZAAM KHARIJ • GALAT SHAK',
    defeatTitle: 'SABOOT KAFI NAHI THE',
    defeatFeedback: 'Afsos Detective, aapka shak galat nikla. Saboot is shaks ke khilaaf nahi the. Asli mujrim andhere mein bach nikla.',
    caseRef: 'CASE CODE:',
    seed: 'PRNG CODE:',
    accused: 'AAROPIT SHAKS:',
    status: 'VERDICT STATUS:',
    statusSolved: 'SOLVED (HAL HO GAYA)',
    statusClosed: 'CLOSED (BAND HO GAYA)',
    statementRecorded: 'DETECTIVE KA RECORDED BAYAN:',
    unsealBtn: '🔓 Asli Sachai Dekhein (Post-Game Reveal)',
    unsealingBtn: 'Secret File Khul Rahi Hai...',
    unsealedBadge: 'SCOTLAND YARD KI ASLI FILE',
    authoritativeTruth: 'ASLI SACH',
    perpetratorTitle: 'ASLI MUJRIM:',
    crimeScene: 'CRIME SCENE (KAMRA):',
    murderWeapon: 'HATHIYAR:',
    criminalMotive: 'CRIME KI WAJAH:',
    reviewBoardBtn: 'Evidence Board Dobara Dekho',
    newCaseBtn: 'Naya Case Khelein'
  },

  // Loading, Errors, Empty States
  feedback: {
    generatingTitle: 'CASE BAN RAHA HAI...',
    generatingDesc: 'Crime scene banaya ja raha hai, saboot chupaye ja rahe hain aur check kiya ja raha hai ki puzzle 100% solvable ho...',
    generatingBadge: 'SMART PUZZLE ENGINE RUNNING',
    errorTitle: 'DOSSIER NAHI MIL SAKA',
    errorDefault: 'Server se connect karne mein kuch problem aayi.',
    retryBtn: 'Dobara Koshish Karein',
    returnMenuBtn: 'Main Menu Par Jao',
    interruptedTitle: 'SYSTEM INTERRUPTED',
    interruptedDesc: 'Game screen load karte waqt achanak koi error aa gayi:',
    restartBtn: 'Game Restart Karein'
  },

  // Dynamic Case Pool Entities (Clues, Suspects, Rooms, Weapons, Motives)
  entities: {
    "suspects": {
      "suspect_coach_verma": {
        "name": "Coach Vikram Verma",
        "role": "Head Athletics Coach",
        "traits": [
          "competitive",
          "sakht",
          "record bachane wala"
        ]
      },
      "suspect_rohan_mehta": {
        "name": "Rohan Mehta",
        "role": "Star Sprinter & Rival Captain",
        "traits": [
          "ambitious",
          "jaldbaz",
          "pressure mein"
        ]
      },
      "suspect_mrs_roy": {
        "name": "Mrs. Ananya Roy",
        "role": "Attendance Coordinator",
        "traits": [
          "meticulous",
          "pareshaan",
          "rules follow karne wali"
        ]
      },
      "suspect_ram_singh": {
        "name": "Ram Singh",
        "role": "Night Chowkidar",
        "traits": [
          "chowkanna",
          "thaka hua",
          "karzdaar"
        ]
      },
      "suspect_sameer_sen": {
        "name": "Sameer Sen",
        "role": "Student Council President",
        "traits": [
          "diplomatic",
          "perfectionist",
          "stressed"
        ]
      },
      "suspect_priya_sharma": {
        "name": "Priya Sharma",
        "role": "Sports Club Secretary",
        "traits": [
          "resourceful",
          "defensive",
          "chupchap"
        ]
      },
      "suspect_aniket_das": {
        "name": "Aniket Das",
        "role": "Junior Runner & Helper",
        "traits": [
          "shaant",
          "naraz",
          "nervous"
        ]
      },
      "suspect_dr_homi_sen": {
        "name": "Prof. Homi Sen",
        "role": "Chief Science Fair Judge",
        "traits": [
          "authoritative",
          "shakki",
          "raaz chupane wala"
        ]
      },
      "suspect_kabir_sen": {
        "name": "Kabir Sen",
        "role": "Robotics Competitor",
        "traits": [
          "genius",
          "jealous",
          "laparwah"
        ]
      },
      "suspect_ananya_ray": {
        "name": "Ananya Ray",
        "role": "Senior Lab Assistant",
        "traits": [
          "methodical",
          "disgruntled",
          "overworked"
        ]
      },
      "suspect_neha_gupta": {
        "name": "Neha Gupta",
        "role": "Lab Sponsor & Scout",
        "traits": [
          "calculating",
          "commercial",
          "tez dimaag"
        ]
      },
      "suspect_dev_sharma": {
        "name": "Dev Sharma",
        "role": "Drone Project Competitor",
        "traits": [
          "proud",
          "competitive",
          "gussail"
        ]
      },
      "suspect_dr_rita_sen": {
        "name": "Dr. Rita Sen",
        "role": "Senior Chemistry Teacher",
        "traits": [
          "protective",
          "fastidious",
          "ghabrayi hui"
        ]
      },
      "suspect_arjun_nair": {
        "name": "Arjun Nair",
        "role": "Lab Peon & Night Custodian",
        "traits": [
          "practical",
          "indifferent",
          "karzdaar"
        ]
      },
      "suspect_lord_harrington": {
        "name": "Lord Arthur Harrington",
        "role": "Haveli Ka Waris",
        "traits": [
          "ghamandi",
          "raazdaar",
          "karz mein dooba"
        ]
      },
      "suspect_eleanor_vance": {
        "name": "Eleanor Vance",
        "role": "Niece & Heiress",
        "traits": [
          "chalaak",
          "shaant",
          "resourceful"
        ]
      },
      "suspect_julian_croft": {
        "name": "Julian Croft",
        "role": "Antique Dealer",
        "traits": [
          "dilkash",
          "dhokhebaaz",
          "jugadu"
        ]
      },
      "suspect_thomas_finch": {
        "name": "Thomas Finch",
        "role": "Head Gardener",
        "traits": [
          "gussail",
          "naraz",
          "taakatwar"
        ]
      },
      "suspect_beatrice_thorne": {
        "name": "Beatrice Thorne",
        "role": "30 Saal Purani Housekeeper",
        "traits": [
          "wafadaar",
          "khamosh",
          "saare raaz jaanti hai"
        ]
      },
      "suspect_dr_sterling": {
        "name": "Dr. Arthur Sterling",
        "role": "Family Doctor & Trustee",
        "traits": [
          "careful",
          "nervous",
          "observant"
        ]
      },
      "suspect_vivienne_dubois": {
        "name": "Vivienne Dubois",
        "role": "Guest Singer",
        "traits": [
          "dramebaaz",
          "jazbaati",
          "unpredictable"
        ]
      },
      "suspect_curator_sen": {
        "name": "Mr. Alok Sen",
        "role": "Head Curator & Scholar",
        "traits": [
          "vidwaan",
          "proud",
          "protective"
        ]
      },
      "suspect_natasha_vance": {
        "name": "Natasha Vance",
        "role": "Art Restorer & Expert",
        "traits": [
          "meticulous",
          "raazdaar",
          "paise ki tangi"
        ]
      },
      "suspect_victor_vance": {
        "name": "Victor Vance",
        "role": "Private Art Collector",
        "traits": [
          "ameer",
          "junooni",
          "ghamandi"
        ]
      },
      "suspect_ashok_kumar": {
        "name": "Ashok Kumar",
        "role": "Night Security Guard",
        "traits": [
          "chowkanna",
          "thaka hua",
          "lalaachi"
        ]
      },
      "suspect_maya_lin": {
        "name": "Dr. Maya Lin",
        "role": "Visiting Manuscript Scholar",
        "traits": [
          "brilliant",
          "obsessive",
          "besabri"
        ]
      },
      "suspect_alistair_finch": {
        "name": "Alistair Finch",
        "role": "Auction Appraiser",
        "traits": [
          "shrewd",
          "shakki",
          "calculating"
        ]
      },
      "suspect_suresh_rao": {
        "name": "Suresh Rao",
        "role": "Museum Freight Custodian",
        "traits": [
          "khamosh",
          "asantoosht",
          "practical"
        ]
      }
    },
    "clues": {
      "clue_cctv_footage": {
        "name": "CCTV Security Footage (8:27 PM)",
        "category": "surveillance",
        "description": "Camera recording jismein sports shoes pehne ek shaks 8:27 PM par showcase kholta dikh raha hai."
      },
      "clue_torn_attendance_sheet": {
        "name": "Phata Hua Sports Attendance Register",
        "category": "document",
        "description": "Evening practice hours ke hisse se phada gaya official register ka ek panna."
      },
      "clue_sports_track_clay": {
        "name": "Running Track Ki Laal Mitti Ke Nishan",
        "category": "forensic",
        "description": "Trophy room ke darwaze par track ki laal mitti ke taaza jooton ke nishan."
      },
      "clue_dropped_locker_token": {
        "name": "Pavilion Locker Token #7 (Brass)",
        "category": "personal",
        "description": "Showcase bench ke neeche gira hua Locker #7 ka peetal ka token."
      },
      "clue_scratched_display_lock": {
        "name": "Khurocha Hua Showcase Ka Lock",
        "category": "forensic",
        "description": "Brass lock par taaza kharoch ke nishan jo dikhate hain ki ise tool se toda gaya."
      },
      "clue_torn_team_ribbon": {
        "name": "Laal Team Ribbon Ka Tukda",
        "category": "personal",
        "description": "Showcase ke kabze mein atka hua sunheri kinare wala laal satin ribbon."
      },
      "clue_circuit_schematic_scrap": {
        "name": "Circuit Diagram Ka Phata Hua Tukda",
        "category": "document",
        "description": "Blueprint paper ka phata kona jismein robot ke controller ka circuit bana hai."
      },
      "clue_chemical_solvent_odor": {
        "name": "Chemical Flux Solvent Ka Residue",
        "category": "chemical",
        "description": "Lab slate bench par gira hua tezz chemical solvent jisse serial number mitaya gaya."
      },
      "clue_shattered_sensor_glass": {
        "name": "Toota Hua Optical Sensor Lens",
        "category": "forensic",
        "description": "Infrared sensor ka toota glass jismein ungliyon ke halkey nishan bache hain."
      },
      "clue_lab_access_card": {
        "name": "Digital Badge Swipe Log (10:48 PM)",
        "category": "surveillance",
        "description": "Power cut se theek pehle smart lock par card swipe ka access record."
      },
      "clue_soldering_iron_burn": {
        "name": "Workbench Par Jala Hua Gol Nishan",
        "category": "forensic",
        "description": "Lakdi ki table ke kinare par garam soldering pen se bana taaza jala nishan."
      },
      "clue_muddy_gravel_prints": {
        "name": "Bahar Ki Mitti Aur Bajri Ke Nishan",
        "category": "forensic",
        "description": "Emergency khidki ke paas bagiche ki geeli bajri aur mitti ke nishan."
      },
      "clue_charred_telegram": {
        "name": "Aadha Jala Hua Midnight Telegram",
        "category": "document",
        "description": "Angithi mein mila message: \"Subah ki express train se pehle kaam niptao. Title deed register nahi honi chahiye.\""
      },
      "clue_monogrammed_cufflink": {
        "name": "Chandi Ka Engraved Shirt Cufflink",
        "category": "personal",
        "description": "Armchair ki gaddi ki darar mein gira hua chandi ka antique button."
      },
      "clue_muddy_herringbone_prints": {
        "name": "Mitti Ke Herringbone Boot Marks",
        "category": "forensic",
        "description": "Study room ki khidki par 10 number ke herringbone pattern wale jooton ke nishan."
      },
      "clue_forced_vault_dial": {
        "name": "Tijori Ke Dial Par Kharoch Ke Nishan",
        "category": "forensic",
        "description": "Iron safe ke dial par taaza scratches jo dikhate hain ki ise lever se ghumaaya gaya."
      },
      "clue_sliced_ledger_page": {
        "name": "Hisaab Diary Ka Blade Se Kata Panna",
        "category": "document",
        "description": "Aadhi raat ke payments wala panna jo blade se kaat kar gayab kiya gaya."
      },
      "clue_broken_pocket_watch": {
        "name": "Giri Hui Tooti Gold Pocket Watch",
        "category": "timeline",
        "description": "Pendulum clock ke peeche mili gold ghadi jiski sui 12:04 AM par ruki hui hai."
      },
      "clue_razor_canvas_edge": {
        "name": "Blade Se Kata Hua Canvas Ka Kinara",
        "category": "forensic",
        "description": "Sone ke frame ke kinare canvas ko surgical blade se kaatne ke saaf fibers."
      },
      "clue_forged_curator_stamp": {
        "name": "Nakli Archival Curator Stamp",
        "category": "document",
        "description": "Register par modern jaldi sookhne wali ink se lagayi gayi farzi stamp."
      },
      "clue_dropped_cotton_glove": {
        "name": "Art Handling Ka Safed Cotton Dastana",
        "category": "personal",
        "description": "Reading lamp ke paas gira safed dastana jispar frame ke sone ke kan lage hain."
      },
      "clue_visitor_log_blade_cut": {
        "name": "Logbook Se Kati Hui Visitor Entry",
        "category": "document",
        "description": "Shaam 6:45 PM wali visitor entry ko blade se kaat kar gayab kiya gaya hai."
      },
      "clue_uv_varnish_traces": {
        "name": "UV Fluorescent Varnish Ka Nishan",
        "category": "chemical",
        "description": "Table par laga chemical jo UV light ke neeche bright violet chamakta hai."
      },
      "clue_courtyard_window_mud": {
        "name": "Khidki Par Courtyard Mitti Ke Prints",
        "category": "forensic",
        "description": "Archive window sill par bagiche ki geeli mitti aur chamde ke jooton ke nishan."
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
