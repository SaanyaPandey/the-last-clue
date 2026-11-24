/**
 * THE LAST CLUE — Thematic Data Pools for Procedural Generation
 * 
 * Defines 4 distinct, immersive, non-violent mystery themes:
 * 1. trophy   - School Annual Sports Trophy Theft (St. Jude's Academy)
 * 2. science  - Science Fair Prototype Theft (Junior Science Exhibition)
 * 3. treasure - Heritage Manor Heirloom Mystery (Blackwood Manor Study & Vault)
 * 4. library  - Museum Masterpiece & Rare Archives Mystery (Central Art Museum)
 * 
 * Each theme satisfies all CSP constraints:
 * - >= 7 suspects with distinct roles, traits, accessLocations, and affiliatedWeapons
 * - >= 4 thematic locations with compatibleWeapons
 * - >= 5 thematic tools/methods (weapons)
 * - >= 5 thematic motives
 * - >= 6 narrative forensic clues
 */

const THEMATIC_POOLS = {
  // =========================================================================
  // 1. SCHOOL TROPHY THEFT (St. Jude's Academy)
  // =========================================================================
  trophy: {
    suspects: [
      {
        id: 'suspect_coach_verma',
        name: 'Coach Vikram Verma',
        role: 'Senior Athletics Director & Coach',
        traits: ['competitive', 'strict', 'protective_of_record'],
        possibleMotives: ['motive_championship_rivalry', 'motive_disqualification_coverup', 'motive_trophy_resale'],
        accessLocations: ['location_trophy_hall', 'location_sports_pavilion', 'location_school_library'],
        affiliatedWeapons: ['weapon_duplicate_key', 'weapon_whistle_decoy', 'weapon_display_lever']
      },
      {
        id: 'suspect_rohan_mehta',
        name: 'Rohan Mehta',
        role: 'Star Sprinter & Rival Team Captain',
        traits: ['ambitious', 'impulsive', 'under_pressure'],
        possibleMotives: ['motive_championship_rivalry', 'motive_captaincy_jealousy', 'motive_disqualification_coverup'],
        accessLocations: ['location_trophy_hall', 'location_sports_pavilion', 'location_academy_corridor'],
        affiliatedWeapons: ['weapon_display_lever', 'weapon_track_spike', 'weapon_locker_pry_bar']
      },
      {
        id: 'suspect_mrs_roy',
        name: 'Mrs. Ananya Roy',
        role: 'Academic Coordinator & Attendance In-Charge',
        traits: ['meticulous', 'anxious', 'rule_follower'],
        possibleMotives: ['motive_disqualification_coverup', 'motive_falsified_grade_scandal', 'motive_captaincy_jealousy'],
        accessLocations: ['location_trophy_hall', 'location_school_library', 'location_academy_corridor'],
        affiliatedWeapons: ['weapon_duplicate_key', 'weapon_whistle_decoy']
      },
      {
        id: 'suspect_ram_singh',
        name: 'Ram Singh',
        role: 'Night Campus Watchman',
        traits: ['observant', 'weary', 'in_debt'],
        possibleMotives: ['motive_trophy_resale', 'motive_blackmail_protection', 'motive_disqualification_coverup'],
        accessLocations: ['location_trophy_hall', 'location_sports_pavilion', 'location_school_library'],
        affiliatedWeapons: ['weapon_duplicate_key', 'weapon_display_lever', 'weapon_locker_pry_bar']
      },
      {
        id: 'suspect_sameer_sen',
        name: 'Sameer Sen',
        role: 'Student Council President & Event Organizer',
        traits: ['diplomatic', 'perfectionist', 'stressed'],
        possibleMotives: ['motive_captaincy_jealousy', 'motive_championship_rivalry', 'motive_falsified_grade_scandal'],
        accessLocations: ['location_trophy_hall', 'location_school_library', 'location_academy_corridor'],
        affiliatedWeapons: ['weapon_duplicate_key', 'weapon_display_lever']
      },
      {
        id: 'suspect_priya_sharma',
        name: 'Priya Sharma',
        role: 'Sports Club Secretary & Equipment Manager',
        traits: ['resourceful', 'defensive', 'quiet'],
        possibleMotives: ['motive_captaincy_jealousy', 'motive_disqualification_coverup', 'motive_trophy_resale'],
        accessLocations: ['location_sports_pavilion', 'location_trophy_hall', 'location_academy_corridor'],
        affiliatedWeapons: ['weapon_locker_pry_bar', 'weapon_track_spike', 'weapon_display_lever']
      },
      {
        id: 'suspect_aniket_das',
        name: 'Aniket Das',
        role: 'Junior Reserve Runner & Equipment Helper',
        traits: ['quiet', 'resentful', 'nervous'],
        possibleMotives: ['motive_captaincy_jealousy', 'motive_trophy_resale', 'motive_championship_rivalry'],
        accessLocations: ['location_sports_pavilion', 'location_academy_corridor', 'location_trophy_hall'],
        affiliatedWeapons: ['weapon_track_spike', 'weapon_locker_pry_bar']
      }
    ],

    locations: [
      {
        id: 'location_trophy_hall',
        name: "Principal's Trophy Hall",
        type: 'indoor_ceremonial',
        description: 'Polished teak floors, glass showcase cabinets, founders honor rolls, and sports shields.',
        compatibleWeapons: ['weapon_display_lever', 'weapon_duplicate_key', 'weapon_locker_pry_bar']
      },
      {
        id: 'location_school_library',
        name: 'School Library & Records Room',
        type: 'indoor_study',
        description: 'Quiet study tables, tall bookshelves holding bound school yearbooks, and archival filing cabinets.',
        compatibleWeapons: ['weapon_duplicate_key', 'weapon_whistle_decoy', 'weapon_display_lever']
      },
      {
        id: 'location_sports_pavilion',
        name: 'Sports Pavilion & Locker Wing',
        type: 'semi_outdoor_sports',
        description: 'Benches lined with team gear, athletic track shoe cubbies, metal lockers, and chalkboards.',
        compatibleWeapons: ['weapon_locker_pry_bar', 'weapon_track_spike', 'weapon_whistle_decoy']
      },
      {
        id: 'location_academy_corridor',
        name: 'Academy Main Hallway & Quadrangle',
        type: 'indoor_hallway',
        description: 'Long arched corridor displaying bulletin boards, club rosters, and CCTV junction boxes.',
        compatibleWeapons: ['weapon_whistle_decoy', 'weapon_track_spike', 'weapon_duplicate_key']
      }
    ],

    weapons: [
      {
        id: 'weapon_display_lever',
        name: 'Hardened Display Pry Tool',
        category: 'tool',
        subType: 'mechanical_lever',
        description: 'A flat steel pry tool with paint scrape residue matching the trophy showcase frame.'
      },
      {
        id: 'weapon_duplicate_key',
        name: 'Duplicate Brass Master Key',
        category: 'key',
        subType: 'access_tool',
        description: 'A freshly ground duplicate brass key cut to open academy display cases and library files.'
      },
      {
        id: 'weapon_locker_pry_bar',
        name: 'Equipment Locker Crowbar',
        category: 'tool',
        subType: 'physical',
        description: 'A miniature iron crowbar taken from the groundkeeper equipment shed.'
      },
      {
        id: 'weapon_track_spike',
        name: 'Sharpened Track Shoe Spike',
        category: 'improvised',
        subType: 'athletic_gear',
        description: 'A tungsten running spike detached from sprint footwear, used to tamper with window latches.'
      },
      {
        id: 'weapon_whistle_decoy',
        name: 'Coach Timer Whistle',
        category: 'sound_decoy',
        subType: 'misdirection',
        description: 'A metallic pea-whistle used to fake the conclusion of practice and lure the guard away.'
      }
    ],

    motives: [
      {
        id: 'motive_championship_rivalry',
        name: 'Inter-School Sports Rivalry',
        description: 'Desperate desire to prevent St. Jude’s from winning the centenary championship banner.'
      },
      {
        id: 'motive_disqualification_coverup',
        name: 'Disqualification Cover-Up',
        description: 'Hiding a forged sports attendance register that would disqualify the lead athlete.'
      },
      {
        id: 'motive_trophy_resale',
        name: 'Selling Antique Gold Trophy',
        description: 'Scheme to sell the solid gold centerpiece of the trophy to an illegal metal dealer.'
      },
      {
        id: 'motive_captaincy_jealousy',
        name: 'Bitterness Over Team Captaincy',
        description: 'Deep resentment over being stripped of the team captain badge on sports eve.'
      },
      {
        id: 'motive_falsified_grade_scandal',
        name: 'Falsified Academic Eligibility',
        description: 'Panic over audit sheets showing athletic grades were inflated before the championship.'
      }
    ],

    clues: [
      {
        id: 'clue_cctv_footage',
        name: 'CCTV Security Tape (8:27 PM)',
        category: 'surveillance',
        reliability: 0.95,
        description: 'Security camera footage showing a shadowy figure in running shoes unbolting the showcase at 8:27 PM.'
      },
      {
        id: 'clue_torn_attendance_sheet',
        name: 'Torn Sports Attendance Register',
        category: 'document',
        reliability: 0.9,
        description: 'A page torn out of the official attendance binder right across the evening practice hours.'
      },
      {
        id: 'clue_sports_track_clay',
        name: 'Red Athletic Track Clay Prints',
        category: 'forensic',
        reliability: 0.85,
        description: 'Distinct red clay athletic track mud impressions stamped across the trophy room entrance.'
      },
      {
        id: 'clue_dropped_locker_token',
        name: 'Metal Equipment Locker Token #7',
        category: 'personal_item',
        reliability: 0.9,
        description: 'A stamped brass token for Pavilion Locker #7 dropped beneath the trophy showcase bench.'
      },
      {
        id: 'clue_scratched_display_lock',
        name: 'Scraped Showcase Lock Cylinder',
        category: 'forensic',
        reliability: 0.85,
        description: 'Fresh metal scratch marks on the brass showcase lock showing it was pried with a flat tool.'
      },
      {
        id: 'clue_torn_team_ribbon',
        name: 'Crimson Team Ribbon Corner',
        category: 'personal_item',
        reliability: 0.8,
        description: 'A scrap of gold-fringed crimson satin ribbon caught in the display cabinet hinge.'
      }
    ]
  },

  // =========================================================================
  // 2. SCIENCE EXHIBITION PROTOTYPE THEFT (Junior Science Fair)
  // =========================================================================
  science: {
    suspects: [
      {
        id: 'suspect_dr_homi_sen',
        name: 'Prof. Homi Sen',
        role: 'Chief Science Fair Judge & Department Dean',
        traits: ['authoritative', 'skeptical', 'secretive'],
        possibleMotives: ['motive_intellectual_theft', 'motive_corporate_espionage', 'motive_sabotage_rival'],
        accessLocations: ['location_science_lab', 'location_exhibition_hall', 'location_prep_room'],
        affiliatedWeapons: ['weapon_override_dongle', 'weapon_precision_cutters', 'weapon_acid_solvent']
      },
      {
        id: 'suspect_kabir_sen',
        name: 'Kabir Sen',
        role: 'Rival Robotics Contestant',
        traits: ['genius', 'jealous', 'reckless'],
        possibleMotives: ['motive_sabotage_rival', 'motive_intellectual_theft', 'motive_scholarship_desperation'],
        accessLocations: ['location_science_lab', 'location_exhibition_hall', 'location_sensor_booth'],
        affiliatedWeapons: ['weapon_soldering_pen', 'weapon_precision_cutters', 'weapon_override_dongle']
      },
      {
        id: 'suspect_ananya_ray',
        name: 'Ananya Ray',
        role: 'Senior Laboratory Research Assistant',
        traits: ['methodical', 'disgruntled', 'overworked'],
        possibleMotives: ['motive_intellectual_theft', 'motive_corporate_espionage', 'motive_scholarship_desperation'],
        accessLocations: ['location_science_lab', 'location_prep_room', 'location_sensor_booth'],
        affiliatedWeapons: ['weapon_acid_solvent', 'weapon_override_dongle', 'weapon_precision_cutters']
      },
      {
        id: 'suspect_neha_gupta',
        name: 'Neha Gupta',
        role: 'Electronics Lab Sponsor & Venture Scout',
        traits: ['calculating', 'commercial', 'shrewd'],
        possibleMotives: ['motive_corporate_espionage', 'motive_patent_preemption', 'motive_intellectual_theft'],
        accessLocations: ['location_exhibition_hall', 'location_prep_room', 'location_sensor_booth'],
        affiliatedWeapons: ['weapon_override_dongle', 'weapon_soldering_pen']
      },
      {
        id: 'suspect_dev_sharma',
        name: 'Dev Sharma',
        role: 'Autonomous Drone Competitor',
        traits: ['proud', 'competitive', 'volatile'],
        possibleMotives: ['motive_sabotage_rival', 'motive_scholarship_desperation', 'motive_patent_preemption'],
        accessLocations: ['location_science_lab', 'location_exhibition_hall', 'location_sensor_booth'],
        affiliatedWeapons: ['weapon_soldering_pen', 'weapon_precision_cutters']
      },
      {
        id: 'suspect_dr_rita_sen',
        name: 'Dr. Rita Sen',
        role: 'Senior Chemistry Demonstrator',
        traits: ['protective', 'fastidious', 'nervous'],
        possibleMotives: ['motive_patent_preemption', 'motive_intellectual_theft', 'motive_corporate_espionage'],
        accessLocations: ['location_prep_room', 'location_science_lab', 'location_exhibition_hall'],
        affiliatedWeapons: ['weapon_acid_solvent', 'weapon_precision_cutters']
      },
      {
        id: 'suspect_arjun_nair',
        name: 'Arjun Nair',
        role: 'Lab Technician & Night Custodian',
        traits: ['practical', 'indifferent', 'in_debt'],
        possibleMotives: ['motive_corporate_espionage', 'motive_scholarship_desperation', 'motive_sabotage_rival'],
        accessLocations: ['location_science_lab', 'location_prep_room', 'location_exhibition_hall'],
        affiliatedWeapons: ['weapon_precision_cutters', 'weapon_soldering_pen', 'weapon_acid_solvent']
      }
    ],

    locations: [
      {
        id: 'location_science_lab',
        name: 'Junior Science Laboratory',
        type: 'indoor_laboratory',
        description: 'Slate chemical demonstration benches, Bunsen burners, circuit testing kits, and formula chalkboards.',
        compatibleWeapons: ['weapon_acid_solvent', 'weapon_precision_cutters', 'weapon_soldering_pen']
      },
      {
        id: 'location_exhibition_hall',
        name: 'Science Exhibition Gallery',
        type: 'indoor_gallery',
        description: 'Illuminated display stands, blue ribbon banners, participant lockers, and spotlighted podiums.',
        compatibleWeapons: ['weapon_override_dongle', 'weapon_soldering_pen', 'weapon_precision_cutters']
      },
      {
        id: 'location_prep_room',
        name: 'Chemical & Component Preparation Room',
        type: 'secure_storage',
        description: 'Reinforced ventilation cabinets, locked optics lockers, acid containers, and soldering stations.',
        compatibleWeapons: ['weapon_acid_solvent', 'weapon_override_dongle', 'weapon_precision_cutters']
      },
      {
        id: 'location_sensor_booth',
        name: 'Robotics Sensor Calibration Booth',
        type: 'testing_facility',
        description: 'Infrared calibration screens, diagnostic oscilloscopes, and anti-static workbench mats.',
        compatibleWeapons: ['weapon_override_dongle', 'weapon_soldering_pen', 'weapon_precision_cutters']
      }
    ],

    weapons: [
      {
        id: 'weapon_precision_cutters',
        name: 'Precision Wire Cutters',
        category: 'tool',
        subType: 'electronics',
        description: 'Diagonal cutters with carbon steel blades used to slice robot wiring bundles clean.'
      },
      {
        id: 'weapon_soldering_pen',
        name: 'Heavy-Duty Soldering Pen',
        category: 'thermal_tool',
        subType: 'electronics',
        description: 'High-temperature soldering pen used to desolder the micro-controller chip.'
      },
      {
        id: 'weapon_override_dongle',
        name: 'USB Security Override Dongle',
        category: 'electronic_bypass',
        subType: 'digital_tool',
        description: 'A flash dongle loaded with firmware designed to bypass lab smart locks.'
      },
      {
        id: 'weapon_acid_solvent',
        name: 'Chemical Flux Solvent Bottle',
        category: 'chemical',
        subType: 'liquid',
        description: 'Volatile cleaning chemical used to erase printed circuit board serial numbers.'
      },
      {
        id: 'weapon_multimeter_probe',
        name: 'Sharpened Multimeter Probe',
        category: 'diagnostic_tool',
        subType: 'electronics',
        description: 'A pointed electrical test probe with copper residue used to short-circuit display relays.'
      }
    ],

    motives: [
      {
        id: 'motive_intellectual_theft',
        name: 'Algorithm & Code Theft',
        description: 'Intent to steal the autonomous navigation algorithm for a commercial startup.'
      },
      {
        id: 'motive_sabotage_rival',
        name: 'Sabotaging First Prize',
        description: 'Desperation to prevent the winning prototype from taking the university scholarship.'
      },
      {
        id: 'motive_corporate_espionage',
        name: 'Corporate Trade Espionage',
        description: 'Selling proprietary sensor schematics to an external technology manufacturer.'
      },
      {
        id: 'motive_scholarship_desperation',
        name: 'Scholarship Desperation',
        description: 'Pressure to secure the exclusive national science fellowship at any cost.'
      },
      {
        id: 'motive_patent_preemption',
        name: 'Patent Preemption',
        description: 'Filing a patent on the motor drive before the student inventor could publicly demonstrate it.'
      }
    ],

    clues: [
      {
        id: 'clue_circuit_schematic_scrap',
        name: 'Torn Circuit Schematic Scrap',
        category: 'document',
        reliability: 0.95,
        description: 'A torn corner of blueprint paper showing circuit diagrams for the robot’s controller board.'
      },
      {
        id: 'clue_chemical_solvent_odor',
        name: 'Chemical Flux Solvent Residue',
        category: 'chemical',
        reliability: 0.9,
        description: 'Pungent soldering flux and solvent residue swabbed from the demonstration slate bench.'
      },
      {
        id: 'clue_shattered_sensor_glass',
        name: 'Shattered Optical Sensor Lens',
        category: 'forensic',
        reliability: 0.85,
        description: 'A cracked infrared sensor lens with trace fingerprint dust on its casing.'
      },
      {
        id: 'clue_lab_access_card',
        name: 'Electronic Badge Log (10:48 PM)',
        category: 'surveillance',
        reliability: 0.9,
        description: 'Access terminal record logging a card swipe right before the lab power circuit tripped.'
      },
      {
        id: 'clue_soldering_iron_burn',
        name: 'Workbench Solder Scorch Mark',
        category: 'forensic',
        reliability: 0.85,
        description: 'A fresh circular heat burn branded into the wooden edge of the participant workbench.'
      },
      {
        id: 'clue_muddy_gravel_prints',
        name: 'Courtyard Gravel Boot Impressions',
        category: 'forensic',
        reliability: 0.8,
        description: 'Wet pea-gravel and courtyard mud impressions stamped near the emergency laboratory window.'
      }
    ]
  },

  // =========================================================================
  // 3. SECRET HERITAGE TREASURE (Blackwood Manor Study & Secret Vault)
  // =========================================================================
  treasure: {
    suspects: [
      {
        id: 'suspect_lord_harrington',
        name: 'Lord Arthur Harrington',
        role: 'Aristocratic Estate Heir',
        traits: ['arrogant', 'secretive', 'heavily_indebted'],
        possibleMotives: ['motive_inheritance', 'motive_financial_debt', 'motive_blackmail'],
        accessLocations: ['location_manor_study', 'location_secret_vault', 'location_manor_gardens'],
        affiliatedWeapons: ['weapon_antique_pistol', 'weapon_ornate_dagger', 'weapon_heavy_candlestick']
      },
      {
        id: 'suspect_eleanor_vance',
        name: 'Eleanor Vance',
        role: 'Distant Heiress & Antiquarian',
        traits: ['calculating', 'poised', 'resourceful'],
        possibleMotives: ['motive_inheritance', 'motive_ancient_scandal', 'motive_financial_debt'],
        accessLocations: ['location_manor_study', 'location_secret_vault', 'location_manor_gardens'],
        affiliatedWeapons: ['weapon_silk_scarf', 'weapon_ornate_dagger', 'weapon_antique_pistol']
      },
      {
        id: 'suspect_julian_croft',
        name: 'Julian Croft',
        role: 'Shrewd Antique Broker & Dealer',
        traits: ['charming', 'dishonest', 'conniving'],
        possibleMotives: ['motive_financial_debt', 'motive_blackmail', 'motive_inheritance'],
        accessLocations: ['location_manor_study', 'location_secret_vault', 'location_greenhouse'],
        affiliatedWeapons: ['weapon_ornate_dagger', 'weapon_heavy_candlestick', 'weapon_antique_pistol']
      },
      {
        id: 'suspect_thomas_finch',
        name: 'Thomas Finch',
        role: 'Head Grounds-Keeper & Blacksmith',
        traits: ['gruff', 'resentful', 'strong'],
        possibleMotives: ['motive_ancient_scandal', 'motive_financial_debt', 'motive_blackmail'],
        accessLocations: ['location_manor_gardens', 'location_greenhouse', 'location_manor_study'],
        affiliatedWeapons: ['weapon_heavy_candlestick', 'weapon_antique_pistol', 'weapon_silk_scarf']
      },
      {
        id: 'suspect_beatrice_thorne',
        name: 'Beatrice Thorne',
        role: 'Estate Housekeeper of 30 Years',
        traits: ['loyal', 'silent', 'all_knowing'],
        possibleMotives: ['motive_ancient_scandal', 'motive_inheritance', 'motive_blackmail'],
        accessLocations: ['location_manor_study', 'location_secret_vault', 'location_greenhouse'],
        affiliatedWeapons: ['weapon_silk_scarf', 'weapon_heavy_candlestick']
      },
      {
        id: 'suspect_dr_sterling',
        name: 'Dr. Arthur Sterling',
        role: 'Family Physician & Trustee',
        traits: ['meticulous', 'nervous', 'observant'],
        possibleMotives: ['motive_blackmail', 'motive_ancient_scandal', 'motive_financial_debt'],
        accessLocations: ['location_manor_study', 'location_secret_vault', 'location_manor_gardens'],
        affiliatedWeapons: ['weapon_ornate_dagger', 'weapon_silk_scarf']
      },
      {
        id: 'suspect_vivienne_dubois',
        name: 'Vivienne Dubois',
        role: 'Visiting French Opera Singer & Guest',
        traits: ['dramatic', 'extravagant', 'observant'],
        possibleMotives: ['motive_financial_debt', 'motive_inheritance', 'motive_ancient_scandal'],
        accessLocations: ['location_manor_study', 'location_manor_gardens', 'location_greenhouse'],
        affiliatedWeapons: ['weapon_silk_scarf', 'weapon_ornate_dagger']
      }
    ],

    locations: [
      {
        id: 'location_manor_study',
        name: 'Heritage Manor Study',
        type: 'indoor_study',
        description: 'Carved stone fireplace, roll-top mahogany desk, wingback leather chairs, and oil ancestor portraits.',
        compatibleWeapons: ['weapon_ornate_dagger', 'weapon_heavy_candlestick', 'weapon_antique_pistol']
      },
      {
        id: 'location_secret_vault',
        name: 'Concealed Stone Vault',
        type: 'underground_vault',
        description: 'Concealed room behind study tapestry housing heavy iron safe, grandfather clock, and legal folios.',
        compatibleWeapons: ['weapon_ornate_dagger', 'weapon_antique_pistol', 'weapon_silk_scarf']
      },
      {
        id: 'location_manor_gardens',
        name: 'Rear Stone Garden Terrace',
        type: 'outdoor_garden',
        description: 'Moonlit flagstone paths, marble urns, and muddy garden beds leading to the study window.',
        compatibleWeapons: ['weapon_heavy_candlestick', 'weapon_silk_scarf', 'weapon_antique_pistol']
      },
      {
        id: 'location_greenhouse',
        name: 'Victorian Glass Conservatory',
        type: 'glass_conservatory',
        description: 'Wrought-iron glasshouse containing exotic orchids, iron work tables, and gardening tools.',
        compatibleWeapons: ['weapon_heavy_candlestick', 'weapon_silk_scarf', 'weapon_ornate_dagger']
      }
    ],

    weapons: [
      {
        id: 'weapon_antique_pistol',
        name: 'Flintlock Estate Pistol',
        category: 'firearm',
        subType: 'vintage',
        description: 'An engraved silver flintlock pistol removed from the trophy case above the fireplace.'
      },
      {
        id: 'weapon_ornate_dagger',
        name: 'Gilded Heraldic Letter Dagger',
        category: 'sharp',
        subType: 'stabbing',
        description: 'A damascened steel letter dagger with emerald pommel used to pry the desk lock.'
      },
      {
        id: 'weapon_heavy_candlestick',
        name: 'Solid Brass Candlestick',
        category: 'blunt',
        subType: 'improvised',
        description: 'A heavy Georgian three-branch brass candle stand found overturned near the hearth.'
      },
      {
        id: 'weapon_silk_scarf',
        name: 'Monogrammed Parisian Silk Scarf',
        category: 'cloth',
        subType: 'restraint',
        description: 'A deep indigo Parisian silk scarf smelling of cologne, dropped during the break-in.'
      },
      {
        id: 'weapon_iron_chisel',
        name: 'Masonry Iron Safe Chisel',
        category: 'tool',
        subType: 'mechanical',
        description: 'A forged steel mason’s chisel bearing scratches from forcing the safe door hinges.'
      }
    ],

    motives: [
      {
        id: 'motive_inheritance',
        name: 'Disputed Estate Will',
        description: 'Desperation to secure the original deed before the revised will could be registered.'
      },
      {
        id: 'motive_financial_debt',
        name: 'Crushing Gaming Debts',
        description: 'Imminent threat of bankruptcy and debtor’s prison driving a desperate heirloom theft.'
      },
      {
        id: 'motive_blackmail',
        name: 'Silencing Blackmail Threats',
        description: 'Recovering incriminating telegrams and promissory notes locked inside the manor safe.'
      },
      {
        id: 'motive_ancient_scandal',
        name: 'Suppressing Family Scandal',
        description: 'Hiding historic adoption documents proving the claimant has no rightful lineage.'
      },
      {
        id: 'motive_resale_abroad',
        name: 'Smuggling Heirloom Abroad',
        description: 'Secret arrangement with a continental collector to smuggle the diamond brooch overseas.'
      }
    ],

    clues: [
      {
        id: 'clue_charred_telegram',
        name: 'Charred Midnight Telegram',
        category: 'document',
        reliability: 0.95,
        description: 'Half-burnt telegram in hearth ashes: "Act before morning express train. Title deed must not be registered."'
      },
      {
        id: 'clue_monogrammed_cufflink',
        name: 'Engraved Silver Cufflink',
        category: 'personal_item',
        reliability: 0.9,
        description: 'Antique silver shirt cufflink engraved with initials dropped in the wingback settee seam.'
      },
      {
        id: 'clue_muddy_herringbone_prints',
        name: 'Muddy Herringbone Boot Impressions',
        category: 'forensic',
        reliability: 0.85,
        description: 'Distinctive size 10 herringbone boot impressions stamped into stone dust on the garden window sill.'
      },
      {
        id: 'clue_forced_vault_dial',
        name: 'Scratched Iron Safe Dial',
        category: 'forensic',
        reliability: 0.9,
        description: 'Fresh scratch marks on the vault dial notches proving the combination was forced with a lever.'
      },
      {
        id: 'clue_sliced_ledger_page',
        name: 'Excised Estate Ledger Sheet',
        category: 'document',
        reliability: 0.85,
        description: 'A razor-sliced account ledger page detailing midnight payments excised from the binding.'
      },
      {
        id: 'clue_broken_pocket_watch',
        name: 'Impact-Shattered Pocket Watch',
        category: 'chronological',
        reliability: 0.95,
        description: 'Gold pocket watch with hands frozen at 12:04 AM discovered behind the pendulum clock housing.'
      }
    ]
  },

  // =========================================================================
  // 4. MUSEUM MASTERPIECE & RARE ARCHIVES MYSTERY (Central City Museum)
  // =========================================================================
  library: {
    suspects: [
      {
        id: 'suspect_curator_sen',
        name: 'Mr. Alok Sen',
        role: 'Head Museum Curator & Archival Scholar',
        traits: ['scholarly', 'proud', 'protective'],
        possibleMotives: ['motive_forgery_swap', 'motive_black_market_art', 'motive_scholarly_prestige'],
        accessLocations: ['location_reading_hall', 'location_rare_archives', 'location_restoration_lab'],
        affiliatedWeapons: ['weapon_palette_knife', 'weapon_uv_lamp', 'weapon_duplicate_archive_key']
      },
      {
        id: 'suspect_natasha_vance',
        name: 'Natasha Vance',
        role: 'Master Art Conservator & Restorer',
        traits: ['meticulous', 'secretive', 'financially_strained'],
        possibleMotives: ['motive_forgery_swap', 'motive_insurance_fraud', 'motive_black_market_art'],
        accessLocations: ['location_reading_hall', 'location_restoration_lab', 'location_rare_archives'],
        affiliatedWeapons: ['weapon_palette_knife', 'weapon_chloroform_cloth', 'weapon_diamond_glass_cutter']
      },
      {
        id: 'suspect_victor_vance',
        name: 'Victor Vance',
        role: 'Private Collector & Art Patron',
        traits: ['wealthy', 'obsessive', 'arrogant'],
        possibleMotives: ['motive_black_market_art', 'motive_forgery_swap', 'motive_insurance_fraud'],
        accessLocations: ['location_reading_hall', 'location_private_gallery', 'location_rare_archives'],
        affiliatedWeapons: ['weapon_diamond_glass_cutter', 'weapon_duplicate_archive_key', 'weapon_palette_knife']
      },
      {
        id: 'suspect_ashok_kumar',
        name: 'Ashok Kumar',
        role: 'Night Museum Security Warden',
        traits: ['observant', 'weary', 'bribable'],
        possibleMotives: ['motive_black_market_art', 'motive_insurance_fraud', 'motive_scholarly_prestige'],
        accessLocations: ['location_reading_hall', 'location_private_gallery', 'location_rare_archives'],
        affiliatedWeapons: ['weapon_duplicate_archive_key', 'weapon_chloroform_cloth']
      },
      {
        id: 'suspect_maya_lin',
        name: 'Dr. Maya Lin',
        role: 'Visiting Medieval Manuscript Specialist',
        traits: ['brilliant', 'obsessive', 'impatient'],
        possibleMotives: ['motive_scholarly_prestige', 'motive_forgery_swap', 'motive_black_market_art'],
        accessLocations: ['location_reading_hall', 'location_rare_archives', 'location_restoration_lab'],
        affiliatedWeapons: ['weapon_uv_lamp', 'weapon_palette_knife', 'weapon_chloroform_cloth']
      },
      {
        id: 'suspect_alistair_finch',
        name: 'Alistair Finch',
        role: 'Auction House Appraiser & Evaluator',
        traits: ['shrewd', 'cynical', 'calculating'],
        possibleMotives: ['motive_insurance_fraud', 'motive_black_market_art', 'motive_forgery_swap'],
        accessLocations: ['location_reading_hall', 'location_private_gallery', 'location_restoration_lab'],
        affiliatedWeapons: ['weapon_diamond_glass_cutter', 'weapon_uv_lamp']
      },
      {
        id: 'suspect_suresh_rao',
        name: 'Suresh Rao',
        role: 'Museum Facilities & Freight Custodian',
        traits: ['quiet', 'resentful', 'practical'],
        possibleMotives: ['motive_black_market_art', 'motive_insurance_fraud', 'motive_scholarly_prestige'],
        accessLocations: ['location_restoration_lab', 'location_rare_archives', 'location_private_gallery'],
        affiliatedWeapons: ['weapon_diamond_glass_cutter', 'weapon_chloroform_cloth']
      }
    ],

    locations: [
      {
        id: 'location_reading_hall',
        name: "Curator's Gallery Reading Hall",
        type: 'indoor_museum',
        description: 'High vaulted ceilings, illuminated display pedestals, mahogany reading tables, and tall leaded windows.',
        compatibleWeapons: ['weapon_palette_knife', 'weapon_diamond_glass_cutter', 'weapon_uv_lamp']
      },
      {
        id: 'location_rare_archives',
        name: 'Climate-Controlled Rare Archives',
        type: 'secure_archive',
        description: 'Locked glass preservation cases, humidity monitors, cataloguing desks, and grandfather pendulum clocks.',
        compatibleWeapons: ['weapon_duplicate_archive_key', 'weapon_chloroform_cloth', 'weapon_palette_knife']
      },
      {
        id: 'location_restoration_lab',
        name: 'Art Conservation Studio',
        type: 'restoration_studio',
        description: 'Solvent racks, easels holding master canvas stretchers, magnifying inspection lamps, and drying racks.',
        compatibleWeapons: ['weapon_palette_knife', 'weapon_uv_lamp', 'weapon_chloroform_cloth']
      },
      {
        id: 'location_private_gallery',
        name: 'Private Benefactor Viewing Room',
        type: 'viewing_room',
        description: 'Velvet roped partitions, spotlighted gilded frames, and catalog folios for VIP collectors.',
        compatibleWeapons: ['weapon_diamond_glass_cutter', 'weapon_duplicate_archive_key', 'weapon_uv_lamp']
      }
    ],

    weapons: [
      {
        id: 'weapon_palette_knife',
        name: "Conservator's Razor Palette Blade",
        category: 'blade',
        subType: 'fine_cutting',
        description: 'An ultra-fine flexible surgical steel palette blade used to slice canvas from its stretcher.'
      },
      {
        id: 'weapon_diamond_glass_cutter',
        name: 'Diamond-Tipped Glass Scribe',
        category: 'tool',
        subType: 'glass_cutting',
        description: 'A handheld brass glass cutter with a diamond point used to bypass display vitrines silently.'
      },
      {
        id: 'weapon_duplicate_archive_key',
        name: 'Duplicate Archival Gate Key',
        category: 'key',
        subType: 'access',
        description: 'A duplicate iron skeleton key fitted to the archival security gate.'
      },
      {
        id: 'weapon_chloroform_cloth',
        name: 'Solvent-Soaked Velvet Pad',
        category: 'chemical',
        subType: 'vapor',
        description: 'A velvet cleaning pad soaked in fast-acting aesthetic solvent used to incapacitate guards.'
      },
      {
        id: 'weapon_uv_lamp',
        name: 'Ultraviolet Inspection Torch',
        category: 'optical_tool',
        subType: 'fluorescence',
        description: 'A portable 365nm UV torch used to inspect archival watermark fluorescence in darkness.'
      }
    ],

    motives: [
      {
        id: 'motive_forgery_swap',
        name: 'Masterpiece Forgery Swap',
        description: 'Swapping the illuminated manuscript with an aged counterfeit before the morning exhibition.'
      },
      {
        id: 'motive_black_market_art',
        name: 'Black Market Private Contract',
        description: 'A millions-worth commission from a private collector to smuggle the national treasure.'
      },
      {
        id: 'motive_insurance_fraud',
        name: 'Exhibition Insurance Payout',
        description: 'A staged theft to trigger a fraudulent multi-million pound insurance policy payout.'
      },
      {
        id: 'motive_scholarly_prestige',
        name: 'Exclusive Translation Monopoly',
        description: 'Desire to possess the only surviving ancient codex to secure permanent academic fame.'
      },
      {
        id: 'motive_restitution_conflict',
        name: 'Secret Heritage Restitution',
        description: 'An ideological plot to return the manuscript to its original ancestral order.'
      }
    ],

    clues: [
      {
        id: 'clue_razor_canvas_edge',
        name: 'Surgically Sliced Canvas Fringe',
        category: 'forensic',
        reliability: 0.95,
        description: 'Clean razor cut fibers along the gilded frame edge proving professional excision.'
      },
      {
        id: 'clue_forged_curator_stamp',
        name: 'Forged Archival Release Stamp',
        category: 'document',
        reliability: 0.9,
        description: 'An ink verification stamp on the archive register using modern quick-drying non-archival ink.'
      },
      {
        id: 'clue_dropped_cotton_glove',
        name: 'White Art Handling Cotton Glove',
        category: 'personal_item',
        reliability: 0.85,
        description: 'A white conservator glove dropped near the reading lamp with traces of frame gilding.'
      },
      {
        id: 'clue_visitor_log_blade_cut',
        name: 'Excised Visitor Sign-In Row',
        category: 'document',
        reliability: 0.9,
        description: 'The visitor register for 6:45 PM cleanly sliced away with a razor blade.'
      },
      {
        id: 'clue_uv_varnish_traces',
        name: 'Fluorescent Varnish Chemical Residue',
        category: 'chemical',
        reliability: 0.85,
        description: 'Chemical varnish residue swabbed from the desk glowing bright violet under ultraviolet inspection.'
      },
      {
        id: 'clue_courtyard_window_mud',
        name: 'Courtyard Flagstone Footwear Prints',
        category: 'forensic',
        reliability: 0.8,
        description: 'Damp courtyard garden soil and leather shoe impressions on the archive window sill.'
      }
    ]
  }
};

/**
 * Returns the candidate entity pool for a requested mystery theme.
 * @param {'trophy'|'science'|'treasure'|'library'} [theme='trophy']
 * @returns {typeof THEMATIC_POOLS['trophy']}
 */
function getThematicPool(theme) {
  const normalized = theme && THEMATIC_POOLS[theme] ? theme : 'trophy';
  return THEMATIC_POOLS[normalized];
}

module.exports = {
  THEMATIC_POOLS,
  getThematicPool
};
