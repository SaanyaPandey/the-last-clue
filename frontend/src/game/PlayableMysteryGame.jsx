import React, { useState, useEffect, useMemo, useCallback } from 'react';
import RoomEngine from './RoomEngine';
import GameHUD from './GameHUD';
import ObjectInspectorModal from './ObjectInspectorModal';
import { soundEngine } from './SoundEngine';

/**
 * PlayableMysteryGame Component
 * Core gameplay coordinator transforming THE LAST CLUE into a playable detective exploration game.
 * Manages spatial rooms, player position, object interactions, door transitions, and contextual HUD tools.
 */
export default function PlayableMysteryGame({
  caseData,
  examinedClueIds,
  onToggleExamined,
  onOpenJournal,
  onOpenBoard,
  onOpenSuspects,
  onOpenAccusation,
  progressPercentage
}) {
  const [currentRoom, setCurrentRoom] = useState('drawing_room'); // 'drawing_room' | 'library'
  const [playerPos, setPlayerPos] = useState({ x: 500, y: 520, facing: 'down' });
  const [nearbyObject, setNearbyObject] = useState(null);
  const [inspectingObject, setInspectingObject] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [roomTransitioning, setRoomTransitioning] = useState(false);

  const clues = caseData?.clues || [];

  // ==========================================
  // OBJECT DEFINITIONS & CLUE ASSIGNMENTS
  // ==========================================
  const roomObjects = useMemo(() => {
    const unassignedClues = [...clues];

    const assignClue = (patternId) => {
      const idx = unassignedClues.findIndex((c) => c.id === patternId);
      if (idx !== -1) {
        return unassignedClues.splice(idx, 1)[0];
      }
      return null;
    };

    // 1. Drawing Room Objects with explicit physical hit boxes and walk destinations
    const drawingRoomObjs = [
      {
        id: 'fireplace',
        title: 'Stone Hearth & Fireplace',
        icon: '✦',
        x: 600,
        y: 330,
        walkTo: { x: 600, y: 390 },
        hitBox: { x1: 480, y1: 150, x2: 720, y2: 370 },
        roomName: 'Gilded Drawing Room',
        description: 'A towering carved limestone fireplace with crackling flames casting warm, dancing shadows over the floor.',
        detailObservation: 'White birch logs burn steadily. Amidst the gray hearth ashes, a partially combusted fragment appears to have survived the heat.',
        actionLabel: 'Sift through Hearth Ashes',
        matchedClue: assignClue('clue_burnt_telegram') || assignClue('clue_torn_letter')
      },
      {
        id: 'desk',
        title: 'Mahogany Writing Desk',
        icon: '✦',
        x: 250,
        y: 430,
        walkTo: { x: 250, y: 510 },
        hitBox: { x1: 140, y1: 380, x2: 370, y2: 500 },
        roomName: 'Gilded Drawing Room',
        description: 'An ornate roll-top desk fitted with brass drawer pulls, leather blotter, and an inkstand.',
        detailObservation: 'The center drawer has been jimmied open with a bladed instrument. Several papers are hastily stuffed into the lower recess.',
        actionLabel: 'Search Confidential Drawer Compartment',
        matchedClue: assignClue('clue_torn_letter') || assignClue('clue_forged_check') || assignClue('clue_missing_ledger_page')
      },
      {
        id: 'teatable',
        title: 'Velvet Settee & Side Table',
        icon: '✦',
        x: 870,
        y: 490,
        walkTo: { x: 870, y: 560 },
        hitBox: { x1: 720, y1: 420, x2: 990, y2: 560 },
        roomName: 'Gilded Drawing Room',
        description: 'A deep crimson velvet settee accompanied by an antique side table bearing a silver tea tray.',
        detailObservation: 'A crystal beverage goblet rests on the tray. A faint, bitter almond odor lingers near the rim, and something metallic glints beneath the cushion.',
        actionLabel: 'Examine Goblet & Inspect Beneath Settee',
        matchedClue: assignClue('clue_chemical_residue') || assignClue('clue_monogrammed_cufflink')
      },
      {
        id: 'window',
        title: 'Gothic Arched Window',
        icon: '✦',
        x: 320,
        y: 280,
        walkTo: { x: 320, y: 350 },
        hitBox: { x1: 220, y1: 50, x2: 420, y2: 310 },
        roomName: 'Gilded Drawing Room',
        description: 'Floor-to-ceiling leaded glass windows overlooking the storm-swept gardens.',
        detailObservation: 'Sheets of rain blur the dark tree canopy outside. On the stone window sill, distinct impressions are stamped into the grit.',
        actionLabel: 'Inspect Sills for Forensic Trace Evidence',
        matchedClue: assignClue('clue_muddy_footprints')
      },
      {
        id: 'portrait',
        title: 'Portrait of Lord Harrington',
        icon: '✦',
        x: 600,
        y: 150,
        walkTo: { x: 600, y: 390 },
        hitBox: { x1: 520, y1: 50, x2: 680, y2: 170 },
        roomName: 'Gilded Drawing Room',
        description: 'An imposing oil portrait of the manor’s late benefactor in an elaborate gilded frame.',
        detailObservation: 'The portrait gazes sternly into the room. A subtle tilt in the lower frame corner hints that it was recently adjusted or disturbed.',
        actionLabel: 'Inspect Frame Edge & Hidden Wall Surface',
        matchedClue: null
      },
      {
        id: 'door_library',
        title: 'Doorway to Grand Library',
        icon: '▸',
        x: 1080,
        y: 330,
        walkTo: { x: 1040, y: 370 },
        hitBox: { x1: 1020, y1: 150, x2: 1150, y2: 380 },
        roomName: 'Gilded Drawing Room',
        isDoor: true,
        targetRoom: 'library',
        description: 'A heavy arched double door fitted with brass lever hardware, leading into the estate’s extensive library wing.'
      }
    ];

    // 2. Grand Library Objects
    const libraryObjs = [
      {
        id: 'library_desk',
        title: 'Curator’s Reading Table',
        icon: '✦',
        x: 590,
        y: 460,
        walkTo: { x: 590, y: 535 },
        hitBox: { x1: 430, y1: 390, x2: 780, y2: 520 },
        roomName: 'Grand Library',
        description: 'A massive oak reading table covered in green baize cloth, stacked with leather-bound ledgers and historical maps.',
        detailObservation: 'A bound accounts ledger lies open. A razor cut along the spine indicates a crucial record was excised moments before the crime.',
        actionLabel: 'Examine Bound Account Pages',
        matchedClue: assignClue('clue_missing_ledger_page') || assignClue('clue_forged_check')
      },
      {
        id: 'grandfather_clock',
        title: 'Antique Grandfather Clock',
        icon: '✦',
        x: 870,
        y: 340,
        walkTo: { x: 870, y: 400 },
        hitBox: { x1: 820, y1: 160, x2: 910, y2: 380 },
        roomName: 'Grand Library',
        description: 'A tall walnut pendulum clock chiming the quarter hours with a resonant brass bell.',
        detailObservation: 'The small glass access door at the base is unlatched. Something small and metallic fell into the pendulum recess.',
        actionLabel: 'Inspect Pendulum Housing',
        matchedClue: assignClue('clue_broken_pocket_watch') || assignClue('clue_monogrammed_cufflink')
      },
      {
        id: 'bookcase_rare',
        title: 'Rare Folio Bookshelf',
        icon: '✦',
        x: 260,
        y: 320,
        walkTo: { x: 260, y: 370 },
        hitBox: { x1: 50, y1: 50, x2: 470, y2: 360 },
        roomName: 'Grand Library',
        description: 'Floor-to-ceiling mahogany bookcases storing ancient estate genealogies, toxicology texts, and legal folios.',
        detailObservation: 'A volume titled "Alkaloids and Organic Distillates" sits slightly askew, with finger smudges on the cloth spine.',
        actionLabel: 'Examine Folio Margins & Spine',
        matchedClue: null
      },
      {
        id: 'door_drawing',
        title: 'Doorway to Drawing Room',
        icon: '◂',
        x: 110,
        y: 330,
        walkTo: { x: 130, y: 370 },
        hitBox: { x1: 50, y1: 150, x2: 160, y2: 380 },
        roomName: 'Grand Library',
        isDoor: true,
        targetRoom: 'drawing_room',
        description: 'A heavy oak door returning to the Gilded Drawing Room.'
      }
    ];

    // Ensure any remaining unassigned clues are bound to an inspectable object
    const allInspectable = [
      ...drawingRoomObjs.filter(o => !o.isDoor),
      ...libraryObjs.filter(o => !o.isDoor)
    ];

    for (const remaining of unassignedClues) {
      const targetObj = allInspectable.find(o => !o.matchedClue);
      if (targetObj) {
        targetObj.matchedClue = remaining;
      }
    }

    return {
      drawing_room: drawingRoomObjs,
      library: libraryObjs
    };
  }, [clues]);

  const currentRoomObjects = roomObjects[currentRoom] || [];

  // Set of examined object IDs for visual checkmarks
  const examinedObjectIds = useMemo(() => {
    const ids = new Set();
    for (const obj of currentRoomObjects) {
      if (obj.matchedClue && examinedClueIds.has(obj.matchedClue.id)) {
        ids.add(obj.id);
      }
    }
    return ids;
  }, [currentRoomObjects, examinedClueIds]);

  // Execute interaction on object or door
  const handleInteract = useCallback((obj) => {
    if (!obj) return;

    if (obj.isDoor) {
      // Room Transition
      setRoomTransitioning(true);
      soundEngine.playDoor();

      setTimeout(() => {
        if (obj.targetRoom === 'library') {
          setCurrentRoom('library');
          setPlayerPos({ x: 180, y: 440, facing: 'right' });
        } else {
          setCurrentRoom('drawing_room');
          setPlayerPos({ x: 960, y: 440, facing: 'left' });
        }
        setNearbyObject(null);
        setRoomTransitioning(false);
      }, 300);
    } else {
      // Open close-up object inspection modal
      soundEngine.playInspect();
      setInspectingObject(obj);
    }
  }, []);

  // Keyboard shortcut listener (E for interact, J, B, S, A, M, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();

      // [E] or [Space] interacts with nearby object
      if ((key === 'e' || key === ' ') && nearbyObject && !inspectingObject) {
        e.preventDefault();
        handleInteract(nearbyObject);
      }

      // [Esc] closes open inspection modal
      if (key === 'escape' && inspectingObject) {
        e.preventDefault();
        setInspectingObject(null);
      }

      // [J] opens Journal
      if (key === 'j' && !inspectingObject) {
        e.preventDefault();
        onOpenJournal();
      }

      // [B] opens Evidence Board
      if (key === 'b' && !inspectingObject) {
        e.preventDefault();
        onOpenBoard();
      }

      // [S] opens Suspects
      if (key === 's' && !inspectingObject) {
        e.preventDefault();
        onOpenSuspects();
      }

      // [A] opens Accusation
      if (key === 'a' && !inspectingObject) {
        e.preventDefault();
        onOpenAccusation();
      }

      // [M] toggles audio
      if (key === 'm') {
        e.preventDefault();
        setIsAudioMuted(soundEngine.toggleMute());
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [nearbyObject, inspectingObject, handleInteract, onOpenJournal, onOpenBoard, onOpenSuspects, onOpenAccusation]);

  // Touch virtual movement helper
  const handleVirtualMove = (direction, isPressed) => {
    const map = {
      up: 'ArrowUp',
      down: 'ArrowDown',
      left: 'ArrowLeft',
      right: 'ArrowRight'
    };
    const keyName = map[direction];
    if (keyName) {
      const eventType = isPressed ? 'keydown' : 'keyup';
      window.dispatchEvent(new KeyboardEvent(eventType, { key: keyName }));
    }
  };

  // Dynamic objective text
  const objectiveText = useMemo(() => {
    if (examinedClueIds.size === 0) {
      return "Investigate the Drawing Room: examine the hearth, writing desk, and velvet settee for forensic leads.";
    }
    if (examinedClueIds.size < clues.length) {
      return `Explore the estate wings (${examinedClueIds.size}/${clues.length} clues discovered). Use doorways to enter connected rooms.`;
    }
    return "All physical clues secured! Cross-reference evidence in the Board [B] or file an Indictment [A].";
  }, [examinedClueIds.size, clues.length]);

  return (
    <div className={`playable-mystery-viewport ${roomTransitioning ? 'transition-fading' : ''}`}>
      {/* 1. IN-GAME DETECTIVE HUD */}
      <GameHUD
        currentRoomName={currentRoom === 'drawing_room' ? 'Gilded Drawing Room' : 'Grand Library Wing'}
        objectiveText={objectiveText}
        cluesSecuredCount={examinedClueIds.size}
        totalCluesCount={clues.length}
        progressPercentage={progressPercentage}
        isAudioMuted={isAudioMuted}
        onToggleAudio={() => setIsAudioMuted(soundEngine.toggleMute())}
        nearbyObject={nearbyObject}
        onInteractNearby={() => handleInteract(nearbyObject)}
        onOpenJournal={onOpenJournal}
        onOpenBoard={onOpenBoard}
        onOpenSuspects={onOpenSuspects}
        onOpenAccusation={onOpenAccusation}
        onVirtualMove={handleVirtualMove}
      />

      {/* 2. 2.5D ROOM SPATIAL ENVIRONMENT CANVAS */}
      <RoomEngine
        roomType={currentRoom}
        initialPos={playerPos}
        interactiveObjects={currentRoomObjects}
        examinedObjectIds={examinedObjectIds}
        onObjectClick={handleInteract}
        onObjectProximityChange={setNearbyObject}
      />

      {/* 3. CLOSE-UP OBJECT FORENSIC INSPECTION MODAL */}
      {inspectingObject && (
        <ObjectInspectorModal
          objectData={inspectingObject}
          matchedClue={inspectingObject.matchedClue}
          isAlreadyExamined={inspectingObject.matchedClue && examinedClueIds.has(inspectingObject.matchedClue.id)}
          onDiscoverClue={(clueId) => {
            onToggleExamined(clueId);
          }}
          onClose={() => setInspectingObject(null)}
        />
      )}
    </div>
  );
}
