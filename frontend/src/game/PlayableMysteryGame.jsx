import React, { useState, useEffect, useMemo, useCallback } from 'react';
import RoomEngine from './RoomEngine';
import GameHUD from './GameHUD';
import ObjectInspectorModal from './ObjectInspectorModal';
import HintModal from '../components/HintModal';
import DetectiveBriefing from '../components/DetectiveBriefing';
import { getCaseTheme, getThematicRoomObjects } from './caseThemes';
import { soundEngine } from './SoundEngine';
import { useLanguage } from '../localization/LanguageContext';
import { useControls } from '../context/ControlsContext';

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
  progressPercentage,
  poiCount = 0,
  hasOpenedBoard = false,
  hasOpenedJournal = false
}) {
  const { t, getRoomObjectText, getLocationText, getObjectiveText } = useLanguage();
  const { controlMode } = useControls();
  const clues = caseData?.clues || [];

  // Determine active case theme deterministically from case seed or ID
  const caseTheme = useMemo(
    () => getCaseTheme(caseData?.seed || caseData?.caseId, caseData?.theme),
    [caseData]
  );

  const primaryRoomKey = typeof caseTheme.primaryRoom === 'string'
    ? caseTheme.primaryRoom
    : caseTheme.primaryRoom?.type || 'school_hall';
  const secondaryRoomKey = typeof caseTheme.secondaryRoom === 'string'
    ? caseTheme.secondaryRoom
    : caseTheme.secondaryRoom?.type || 'school_library';

  const primaryRoomMeta = caseTheme.rooms?.[primaryRoomKey] || {};
  const secondaryRoomMeta = caseTheme.rooms?.[secondaryRoomKey] || {};

  const [currentRoom, setCurrentRoom] = useState(primaryRoomKey);
  const [playerPos, setPlayerPos] = useState({ x: 500, y: 520, facing: 'down' });
  const [nearbyObject, setNearbyObject] = useState(null);
  const [inspectingObject, setInspectingObject] = useState(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [roomTransitioning, setRoomTransitioning] = useState(false);

  // Progressive 3-Tier Hint Modal & Briefing Dossier State
  const [isHintOpen, setIsHintOpen] = useState(false);
  const [hintsUsed, setHintsUsed] = useState([]);
  const [isBriefingOpen, setIsBriefingOpen] = useState(false);

  // Reset room and position when theme or case changes
  useEffect(() => {
    setCurrentRoom(primaryRoomKey);
    setPlayerPos(primaryRoomMeta.initialPos || { x: 500, y: 520, facing: 'down' });
    setNearbyObject(null);
    setInspectingObject(null);
    setHintsUsed([]);
  }, [caseTheme.key, caseData?.caseId]);

  // ==========================================
  // OBJECT DEFINITIONS & CLUE ASSIGNMENTS
  // ==========================================
  const roomObjects = useMemo(() => {
    const rawThematic = getThematicRoomObjects(caseTheme.key, clues);
    const enriched = {};

    for (const [roomKey, objList] of Object.entries(rawThematic)) {
      enriched[roomKey] = objList.map((baseObj) => {
        const localized = getRoomObjectText(baseObj.id);
        return {
          ...baseObj,
          title: baseObj.title || localized?.title,
          roomName: baseObj.roomName || localized?.roomName,
          description: baseObj.description || localized?.description,
          detailObservation: baseObj.detailObservation || localized?.detailObservation,
          actionLabel: baseObj.actionLabel || localized?.actionLabel
        };
      });
    }

    return enriched;
  }, [caseTheme.key, clues, getRoomObjectText]);

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
        const targetType = obj.targetRoom;
        setCurrentRoom(targetType);

        if (targetType === secondaryRoomKey) {
          setPlayerPos(secondaryRoomMeta.initialPos || { x: 180, y: 440, facing: 'right' });
        } else {
          setPlayerPos(primaryRoomMeta.initialPos || { x: 960, y: 440, facing: 'left' });
        }
        setNearbyObject(null);
        setRoomTransitioning(false);
      }, 300);
    } else {
      // Open close-up object inspection modal
      soundEngine.playInspect();
      setInspectingObject(obj);
    }
  }, [secondaryRoomKey, secondaryRoomMeta, primaryRoomMeta]);

  // Keyboard shortcut listener (E for interact, J, B, S, A, H, M, Esc)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;

      const key = e.key.toLowerCase();

      // [E] or [Space] interacts with nearby object
      if ((key === 'e' || key === ' ') && nearbyObject && !inspectingObject && !isHintOpen && !isBriefingOpen) {
        e.preventDefault();
        handleInteract(nearbyObject);
      }

      // [Esc] closes open modals
      if (key === 'escape') {
        if (inspectingObject) {
          e.preventDefault();
          setInspectingObject(null);
        } else if (isHintOpen) {
          e.preventDefault();
          setIsHintOpen(false);
        } else if (isBriefingOpen) {
          e.preventDefault();
          setIsBriefingOpen(false);
        }
      }

      // [H] opens 3-Tier Progressive Hint
      if (key === 'h' && !inspectingObject && !isBriefingOpen) {
        e.preventDefault();
        setIsHintOpen(prev => !prev);
      }

      // [J] opens Journal
      if (key === 'j' && !inspectingObject && !isHintOpen && !isBriefingOpen) {
        e.preventDefault();
        onOpenJournal();
      }

      // [B] opens Evidence Board
      if (key === 'b' && !inspectingObject && !isHintOpen && !isBriefingOpen) {
        e.preventDefault();
        onOpenBoard();
      }

      // [S] opens Suspects
      if (key === 's' && !inspectingObject && !isHintOpen && !isBriefingOpen) {
        e.preventDefault();
        onOpenSuspects();
      }

      // [A] opens Accusation
      if (key === 'a' && !inspectingObject && !isHintOpen && !isBriefingOpen) {
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
  }, [nearbyObject, inspectingObject, isHintOpen, isBriefingOpen, handleInteract, onOpenJournal, onOpenBoard, onOpenSuspects, onOpenAccusation]);

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

  const isPrimary = currentRoom === primaryRoomKey;
  const currentRoomMeta = isPrimary ? primaryRoomMeta : secondaryRoomMeta;
  const localizedRoomTitle = t(currentRoomMeta?.nameKey)
    || currentRoomMeta?.name
    || (isPrimary ? 'Crime Scene' : 'Connected Wing');

  const objectiveText = getObjectiveText(examinedClueIds.size, clues.length);

  return (
    <div className={`playable-mystery-viewport ${roomTransitioning ? 'transition-fading' : ''}`}>
      {/* 1. IN-GAME DETECTIVE HUD */}
      <GameHUD
        currentRoomName={localizedRoomTitle}
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
        onOpenBriefing={() => setIsBriefingOpen(true)}
        onOpenHint={() => setIsHintOpen(true)}
        hintsUsedCount={hintsUsed.length}
        poiCount={poiCount}
        hasOpenedBoard={hasOpenedBoard}
        hasOpenedJournal={hasOpenedJournal}
        onVirtualMove={handleVirtualMove}
      />

      {/* 2. 2.5D ROOM SPATIAL ENVIRONMENT CANVAS */}
      <RoomEngine
        roomType={currentRoom}
        initialPos={playerPos}
        interactiveObjects={currentRoomObjects}
        examinedObjectIds={examinedObjectIds}
        controlMode={controlMode}
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

      {/* 4. 3-TIER PROGRESSIVE DETECTIVE HINT MODAL */}
      {isHintOpen && (
        <HintModal
          caseData={caseData}
          caseTheme={caseTheme}
          currentRoom={currentRoom}
          examinedClueIds={examinedClueIds}
          onClose={() => setIsHintOpen(false)}
          onHintRevealed={(tier) => {
            if (!hintsUsed.includes(tier)) {
              setHintsUsed(prev => [...prev, tier]);
            }
          }}
        />
      )}

      {/* 5. DETECTIVE BRIEFING DOSSIER MODAL */}
      {isBriefingOpen && (
        <div className="briefing-overlay-modal" role="dialog" aria-modal="true">
          <div className="briefing-overlay-card">
            <DetectiveBriefing
              caseData={caseData}
              caseTheme={caseTheme}
              onEnterInvestigation={() => setIsBriefingOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
