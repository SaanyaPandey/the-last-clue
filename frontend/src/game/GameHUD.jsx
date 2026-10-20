import React from 'react';

/**
 * Handcrafted vector icon components for detective tools
 */
function JournalIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
      <line x1="8" y1="7" x2="16" y2="7" />
      <line x1="8" y1="11" x2="14" y2="11" />
    </svg>
  );
}

function BoardIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <circle cx="6" cy="6" r="3" />
      <circle cx="18" cy="8" r="3" />
      <circle cx="12" cy="18" r="3" />
      <line x1="8.5" y1="7" x2="15.5" y2="7.5" />
      <line x1="7.5" y1="8.5" x2="10.5" y2="15.5" />
      <line x1="16.5" y1="10" x2="13.5" y2="15.5" />
    </svg>
  );
}

function SuspectsIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
      <circle cx="12" cy="7" r="4" />
    </svg>
  );
}

function ScalesIcon() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <line x1="12" y1="3" x2="12" y2="21" />
      <path d="M4 7h16" />
      <path d="M4 7l3 6h-6l3-6z" />
      <path d="M20 7l3 6h-6l3-6z" />
      <line x1="8" y1="21" x2="16" y2="21" />
    </svg>
  );
}

function SoundIcon({ muted }) {
  if (muted) {
    return (
      <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <line x1="23" y1="9" x2="17" y2="15" />
        <line x1="17" y1="9" x2="23" y2="15" />
      </svg>
    );
  }
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
      <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
      <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
    </svg>
  );
}

/**
 * GameHUD Component
 * In-game detective interface designed like real Victorian field equipment:
 * - Compact location indicator with brass compass beacon
 * - Subtle narrative objective
 * - Restrained typography (Cinzel & JetBrains Mono)
 * - Vector equipment tool buttons without emoji substitutes
 * - Tactile proximity action banner
 */
export default function GameHUD({
  currentRoomName,
  objectiveText,
  cluesSecuredCount,
  totalCluesCount,
  progressPercentage,
  isAudioMuted,
  onToggleAudio,
  nearbyObject,
  onInteractNearby,
  onOpenJournal,
  onOpenBoard,
  onOpenSuspects,
  onOpenAccusation,
  onVirtualMove
}) {
  return (
    <div className="game-hud-layer">
      {/* 1. TOP STATUS BAR (Detective Field Equipment) */}
      <header className="hud-top-bar">
        {/* Room & Objective */}
        <div className="hud-location-group">
          <div className="hud-room-title font-title">
            <span className="hud-room-beacon" aria-hidden="true" />
            <span>{currentRoomName}</span>
          </div>
          <div className="hud-objective-text font-serif">
            {objectiveText}
          </div>
        </div>

        {/* Evidence Progress Counter */}
        <div className="hud-progress-group">
          <div className="hud-progress-pill font-mono">
            <span className="pill-label">EVIDENCE:</span>
            <span className="pill-value">{cluesSecuredCount} / {totalCluesCount}</span>
          </div>
          <div className="hud-progress-pill font-mono">
            <span className="pill-label">SOLVABILITY:</span>
            <span className="pill-value">{progressPercentage}%</span>
          </div>
        </div>

        {/* Handcrafted Tool Buttons */}
        <div className="hud-controls-group">
          <button
            type="button"
            className="hud-tool-btn"
            onClick={onOpenJournal}
            title="Open Field Notebook [J]"
            aria-label="Open Field Notebook"
          >
            <JournalIcon />
            <span className="hud-btn-text">Journal</span>
            <span className="hud-key font-mono">J</span>
          </button>

          <button
            type="button"
            className="hud-tool-btn"
            onClick={onOpenBoard}
            title="Open Evidence Pinboard [B]"
            aria-label="Open Evidence Pinboard"
          >
            <BoardIcon />
            <span className="hud-btn-text">Board</span>
            <span className="hud-key font-mono">B</span>
          </button>

          <button
            type="button"
            className="hud-tool-btn"
            onClick={onOpenSuspects}
            title="Review Suspect Dossiers [S]"
            aria-label="Review Suspect Dossiers"
          >
            <SuspectsIcon />
            <span className="hud-btn-text">Suspects</span>
            <span className="hud-key font-mono">S</span>
          </button>

          <button
            type="button"
            className="hud-tool-btn hud-accuse-btn"
            onClick={onOpenAccusation}
            title="File Indictment Accusation [A]"
            aria-label="File Indictment Accusation"
          >
            <ScalesIcon />
            <span className="hud-btn-text">Accuse</span>
            <span className="hud-key font-mono">A</span>
          </button>

          <button
            type="button"
            className="hud-sound-btn"
            onClick={onToggleAudio}
            title={isAudioMuted ? 'Unmute Ambient Manor Sound' : 'Mute Ambient Manor Sound'}
            aria-label={isAudioMuted ? 'Unmute Ambient Sound' : 'Mute Ambient Sound'}
          >
            <SoundIcon muted={isAudioMuted} />
          </button>
        </div>
      </header>

      {/* 2. CONTEXTUAL PROXIMITY INTERACTION BANNER */}
      {nearbyObject && (
        <div className="hud-interaction-banner animate-fade-in">
          <div className="interaction-key-pill font-mono">
            <span>[ E ]</span>
          </div>
          <div className="interaction-details">
            <span className="interaction-action-label font-mono">
              {nearbyObject.isDoor ? 'PASSAGEWAY' : 'FORENSIC EXAM'}
            </span>
            <span className="interaction-target-name font-title">
              {nearbyObject.title}
            </span>
          </div>
          <button
            type="button"
            className="interaction-trigger-btn"
            onClick={onInteractNearby}
          >
            {nearbyObject.isDoor ? 'Pass Through Doorway →' : 'Examine Object →'}
          </button>
        </div>
      )}

      {/* 3. MOBILE TOUCH VIRTUAL CONTROLS */}
      <div className="hud-mobile-dpad" aria-label="Touch Movement Controls">
        <div className="dpad-row">
          <button
            type="button"
            className="dpad-btn up"
            onPointerDown={() => onVirtualMove('up', true)}
            onPointerUp={() => onVirtualMove('up', false)}
            aria-label="Move Up"
          >
            ▲
          </button>
        </div>
        <div className="dpad-row middle">
          <button
            type="button"
            className="dpad-btn left"
            onPointerDown={() => onVirtualMove('left', true)}
            onPointerUp={() => onVirtualMove('left', false)}
            aria-label="Move Left"
          >
            ◀
          </button>
          <button
            type="button"
            className="dpad-btn down"
            onPointerDown={() => onVirtualMove('down', true)}
            onPointerUp={() => onVirtualMove('down', false)}
            aria-label="Move Down"
          >
            ▼
          </button>
          <button
            type="button"
            className="dpad-btn right"
            onPointerDown={() => onVirtualMove('right', true)}
            onPointerUp={() => onVirtualMove('right', false)}
            aria-label="Move Right"
          >
            ▶
          </button>
        </div>
      </div>
    </div>
  );
}
