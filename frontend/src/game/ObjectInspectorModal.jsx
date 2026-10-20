import React, { useState } from 'react';
import { soundEngine } from './SoundEngine';

/**
 * Handcrafted bespoke vector illustrations for Manor objects
 */
function ObjectIllustration({ objectId }) {
  switch (objectId) {
    case 'fireplace':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Stone Hearth Arch */}
          <path d="M 15 110 L 15 40 Q 60 15 105 40 L 105 110 Z" fill="#201814" stroke="#4a3327" strokeWidth="3" />
          <path d="M 30 110 L 30 55 Q 60 35 90 55 L 90 110 Z" fill="#0c0806" />
          {/* Iron Grate */}
          <rect x="35" y="98" width="50" height="6" fill="#3a2b22" />
          <line x1="42" y1="90" x2="42" y2="104" stroke="#a67c3b" strokeWidth="2" />
          <line x1="78" y1="90" x2="78" y2="104" stroke="#a67c3b" strokeWidth="2" />
          {/* Burning Logs & Embers */}
          <ellipse cx="60" cy="100" rx="22" ry="6" fill="#1b120c" />
          <path d="M 46 98 Q 60 62 60 52 Q 65 72 74 98 Z" fill="#e85d04" />
          <path d="M 52 98 Q 60 70 60 62 Q 64 78 68 98 Z" fill="#ffba08" />
          <circle cx="58" cy="85" r="2" fill="#fff" />
        </svg>
      );
    case 'desk':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Roll-top desk frame */}
          <rect x="15" y="45" width="90" height="60" rx="3" fill="#301c13" stroke="#543220" strokeWidth="2" />
          {/* Roll-top curved tambour */}
          <path d="M 15 45 Q 60 22 105 45 Z" fill="#3d2419" stroke="#543220" strokeWidth="2" />
          {/* Tambour slats */}
          <line x1="25" y1="38" x2="95" y2="38" stroke="rgba(212,163,89,0.2)" strokeWidth="1" />
          <line x1="32" y1="32" x2="88" y2="32" stroke="rgba(212,163,89,0.2)" strokeWidth="1" />
          {/* Center Writing Drawer */}
          <rect x="22" y="54" width="76" height="20" fill="#24140c" stroke="#4a2c1d" strokeWidth="1.5" />
          <rect x="52" y="62" width="16" height="4" rx="2" fill="#d4a359" />
          {/* Lower Drawers */}
          <rect x="22" y="80" width="34" height="20" fill="#24140c" stroke="#4a2c1d" strokeWidth="1.5" />
          <rect x="64" y="80" width="34" height="20" fill="#24140c" stroke="#4a2c1d" strokeWidth="1.5" />
          <circle cx="39" cy="90" r="2" fill="#d4a359" />
          <circle cx="81" cy="90" r="2" fill="#d4a359" />
          {/* Desk Lamp */}
          <path d="M 24 38 Q 30 20 40 28" stroke="#d4a359" strokeWidth="2" fill="none" />
          <ellipse cx="40" cy="28" rx="8" ry="4" fill="#1b5e3c" />
        </svg>
      );
    case 'teatable':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Round Side Table Top */}
          <ellipse cx="60" cy="65" rx="46" ry="18" fill="#2e1a12" stroke="#4f3020" strokeWidth="2" />
          <ellipse cx="60" cy="62" rx="40" ry="14" fill="#3a2217" />
          {/* Turned Table Pedestal & Tripod Legs */}
          <rect x="57" y="65" width="6" height="35" fill="#26150e" />
          <path d="M 60 98 Q 42 110 32 112" stroke="#26150e" strokeWidth="4" fill="none" />
          <path d="M 60 98 Q 78 110 88 112" stroke="#26150e" strokeWidth="4" fill="none" />
          {/* Silver Salver Tray */}
          <ellipse cx="60" cy="58" rx="24" ry="7" fill="#b0b8c4" stroke="#d4dadf" strokeWidth="1" />
          {/* Crystal Beverage Goblet */}
          <path d="M 54 42 L 66 42 L 63 52 L 57 52 Z" fill="rgba(225, 235, 245, 0.7)" stroke="#d4dadf" strokeWidth="1" />
          <line x1="60" y1="52" x2="60" y2="57" stroke="#d4dadf" strokeWidth="1.5" />
          <ellipse cx="60" cy="57" rx="4" ry="1.5" fill="#b0b8c4" />
          {/* Poison / Chemical Residue Tint */}
          <ellipse cx="60" cy="46" rx="4" ry="2" fill="rgba(114, 203, 207, 0.6)" />
        </svg>
      );
    case 'window':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Gothic Window Arch */}
          <path d="M 25 110 L 25 50 Q 60 12 95 50 L 95 110 Z" fill="#0a121e" stroke="#3d271a" strokeWidth="3" />
          {/* Leaded Mullions */}
          <line x1="60" y1="20" x2="60" y2="110" stroke="#1c120a" strokeWidth="2" />
          <line x1="25" y1="65" x2="95" y2="65" stroke="#1c120a" strokeWidth="2" />
          <line x1="25" y1="90" x2="95" y2="90" stroke="#1c120a" strokeWidth="2" />
          {/* Diagonal Leaded Diamond Grids */}
          <line x1="42" y1="45" x2="78" y2="85" stroke="rgba(212,163,89,0.15)" strokeWidth="1" />
          <line x1="78" y1="45" x2="42" y2="85" stroke="rgba(212,163,89,0.15)" strokeWidth="1" />
          {/* Rain Streaks on Glass */}
          <line x1="38" y1="35" x2="34" y2="55" stroke="rgba(180,210,240,0.5)" strokeWidth="1.5" />
          <line x1="72" y1="40" x2="68" y2="62" stroke="rgba(180,210,240,0.5)" strokeWidth="1.5" />
          <line x1="50" y1="70" x2="46" y2="92" stroke="rgba(180,210,240,0.5)" strokeWidth="1.5" />
          {/* Stone Sill with Muddy Impressions */}
          <rect x="20" y="105" width="80" height="8" fill="#302016" stroke="#473022" strokeWidth="1" />
          <ellipse cx="48" cy="107" rx="5" ry="2" fill="#18110b" />
          <ellipse cx="68" cy="108" rx="6" ry="2" fill="#18110b" />
        </svg>
      );
    case 'portrait':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Gilded Baroque Frame with Relief Corners */}
          <rect x="20" y="15" width="80" height="90" fill="#1b120c" stroke="#b8893d" strokeWidth="4" />
          <rect x="24" y="19" width="72" height="82" fill="none" stroke="#78551f" strokeWidth="1" />
          {/* Corner Rosettes */}
          <circle cx="24" cy="19" r="3" fill="#d4a359" />
          <circle cx="96" cy="19" r="3" fill="#d4a359" />
          <circle cx="24" cy="101" r="3" fill="#d4a359" />
          <circle cx="96" cy="101" r="3" fill="#d4a359" />
          {/* Lord Harrington Dark Oil Silhouette */}
          <ellipse cx="60" cy="50" rx="14" ry="16" fill="#0d0a08" />
          <path d="M 40 92 Q 60 70 80 92 Z" fill="#0d0a08" />
          {/* Victorian Cravat / Collar */}
          <polygon points="56,66 64,66 60,74" fill="#dedad2" />
          {/* Brass Nameplate */}
          <rect x="36" y="88" width="48" height="9" fill="#d4a359" stroke="#8a6528" strokeWidth="1" />
          <line x1="42" y1="92" x2="78" y2="92" stroke="#22170d" strokeWidth="1" />
        </svg>
      );
    case 'library_desk':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Curator's Reading Table */}
          <rect x="15" y="55" width="90" height="48" rx="2" fill="#29180f" stroke="#42291b" strokeWidth="2" />
          {/* Green Baize Cloth Inlay */}
          <rect x="20" y="60" width="80" height="38" fill="#143322" stroke="#a67c3b" strokeWidth="1" />
          {/* Open Ledger */}
          <rect x="35" y="42" width="50" height="28" fill="#f4ecd8" stroke="#3b2416" strokeWidth="1.5" />
          <line x1="60" y1="42" x2="60" y2="70" stroke="#8a735c" strokeWidth="1" />
          {/* Ruled script entries */}
          <line x1="40" y1="48" x2="56" y2="48" stroke="#8c806f" strokeWidth="1" />
          <line x1="40" y1="54" x2="56" y2="54" stroke="#8c806f" strokeWidth="1" />
          <line x1="64" y1="48" x2="80" y2="48" stroke="#8c806f" strokeWidth="1" />
          {/* Razor-cut excised page */}
          <line x1="64" y1="54" x2="74" y2="54" stroke="#b03a48" strokeWidth="1.5" strokeDasharray="2,2" />
          {/* Brass Magnifier */}
          <circle cx="82" cy="74" r="7" fill="none" stroke="#d4a359" strokeWidth="2" />
          <line x1="87" y1="79" x2="95" y2="87" stroke="#d4a359" strokeWidth="2.5" />
        </svg>
      );
    case 'grandfather_clock':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Walnut Clock Tower */}
          <rect x="38" y="15" width="44" height="96" fill="#2b1a11" stroke="#472e20" strokeWidth="2" />
          {/* Clock Pediment Header */}
          <polygon points="35,18 60,8 85,18" fill="#3d2518" stroke="#472e20" strokeWidth="1.5" />
          {/* Brass Roman Dial */}
          <circle cx="60" cy="38" r="15" fill="#f4ebd8" stroke="#b8893d" strokeWidth="2" />
          <circle cx="60" cy="38" r="12" fill="none" stroke="#b8893d" strokeWidth="0.5" />
          <line x1="60" y1="38" x2="60" y2="28" stroke="#111" strokeWidth="1.5" />
          <line x1="60" y1="38" x2="67" y2="38" stroke="#111" strokeWidth="1.5" />
          {/* Glass Pendulum Chamber */}
          <rect x="46" y="60" width="28" height="42" fill="#0d0907" stroke="#543625" strokeWidth="1" />
          {/* Brass Pendulum */}
          <line x1="60" y1="62" x2="60" y2="88" stroke="#d4a359" strokeWidth="1.5" />
          <circle cx="60" cy="88" r="5" fill="#e6b86e" stroke="#b8893d" strokeWidth="1" />
        </svg>
      );
    case 'bookcase_rare':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Bookcase Shelf Arch */}
          <rect x="18" y="16" width="84" height="92" fill="#20150e" stroke="#3b2519" strokeWidth="2" />
          <rect x="22" y="58" width="76" height="6" fill="#3b2519" />
          {/* Top Shelf Books */}
          <rect x="26" y="24" width="9" height="34" fill="#7a1f31" />
          <rect x="36" y="28" width="11" height="30" fill="#1b4a50" />
          <rect x="48" y="22" width="12" height="36" fill="#a87938" />
          <rect x="61" y="26" width="10" height="32" fill="#2d452d" />
          <rect x="72" y="25" width="13" height="33" fill="#592036" />
          {/* Gold Ribbing Bands on Spine */}
          <line x1="26" y1="32" x2="35" y2="32" stroke="#d4a359" strokeWidth="1" />
          <line x1="48" y1="30" x2="60" y2="30" stroke="#d4a359" strokeWidth="1" />
          {/* Lower Shelf Book slightly askew */}
          <rect x="30" y="66" width="12" height="38" fill="#3d2b20" />
          <g transform="rotate(8 52 85)">
            <rect x="46" y="67" width="14" height="37" fill="#7a1f31" stroke="#d4a359" strokeWidth="1" />
          </g>
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          <circle cx="60" cy="60" r="40" fill="#1b1d24" stroke="#d4a359" strokeWidth="2" />
          <path d="M 45 45 L 75 75 M 75 45 L 45 75" stroke="#d4a359" strokeWidth="2" />
        </svg>
      );
  }
}

/**
 * ObjectInspectorModal Component
 * Immersive close-up inspection view for examine-in-place detective gameplay.
 * Features specialized tactile interactions (drawer slide, parchment unfold, chemical swirl)
 * and authentic Victorian archival stamps.
 */
export default function ObjectInspectorModal({
  objectData,
  matchedClue,
  isAlreadyExamined,
  onDiscoverClue,
  onClose
}) {
  const [isExaminingAction, setIsExaminingAction] = useState(false);
  const [hasJustDiscovered, setHasJustDiscovered] = useState(false);

  if (!objectData) return null;

  const handleExamineEvidence = () => {
    if (isExaminingAction || isAlreadyExamined || hasJustDiscovered) return;

    setIsExaminingAction(true);
    soundEngine.playInspect();

    setTimeout(() => {
      setIsExaminingAction(false);
      setHasJustDiscovered(true);
      soundEngine.playClueFound();

      if (matchedClue && onDiscoverClue) {
        onDiscoverClue(matchedClue.id);
      }
    }, 600);
  };

  const isSecured = isAlreadyExamined || hasJustDiscovered;

  return (
    <div
      className="inspector-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`Inspect ${objectData.title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="inspector-modal-card">
        {/* Header Ribbon with Brass Accents */}
        <div className="inspector-modal-header">
          <div className="inspector-meta-badge">
            <span className="badge badge-amber font-mono">OBJECT DOSSIER</span>
            <span className="inspector-room-tag font-mono">
              {objectData.roomName?.toUpperCase() || 'MANOR CRIME SCENE'}
            </span>
          </div>
          <button
            type="button"
            className="inspector-close-btn"
            onClick={onClose}
            aria-label="Close Inspector"
          >
            ✕
          </button>
        </div>

        {/* Object Hero Presentation */}
        <div className="inspector-content-body">
          <div className="inspector-visual-frame">
            <div className={`inspector-icon-display ${isExaminingAction ? 'inspecting-active' : ''}`} aria-hidden="true">
              <ObjectIllustration objectId={objectData.id} />
            </div>

            {/* Tactile Animation Feedback Indicator */}
            {isExaminingAction && (
              <div className="tactile-inspection-progress font-mono animate-fade-in">
                <span className="tactile-pulse-dot" />
                <span>EXAMINING ARTIFACT...</span>
              </div>
            )}

            {isSecured && (
              <div className="archival-wax-stamp font-mono animate-stamp-press">
                <div className="stamp-inner-border">
                  <span className="stamp-subtext">SCOTLAND YARD</span>
                  <span className="stamp-maintext">EVIDENCE RECORDED</span>
                  <span className="stamp-date font-mono">ARCHIVAL SECURED</span>
                </div>
              </div>
            )}
          </div>

          <div className="inspector-narrative-frame">
            <h2 className="inspector-object-title font-title">
              {objectData.title}
            </h2>

            <p className="inspector-primary-desc">
              {objectData.description}
            </p>

            {/* Close-up Forensic Detail */}
            <div className="inspector-detail-box">
              <span className="inspector-detail-label font-mono">DETECTIVE'S FIELD OBSERVATION</span>
              <p className="inspector-detail-text font-serif">
                "{objectData.detailObservation}"
              </p>
            </div>

            {/* Evidence Discovery Section */}
            {matchedClue && (
              <div className={`inspector-clue-unveil ${isSecured ? 'unveiled' : ''}`}>
                <div className="clue-unveil-header">
                  <span className="clue-tag font-mono">
                    {isSecured ? '✦ FORENSIC EVIDENCE IDENTIFIED' : '⚠ SUSPICIOUS IRREGULARITY DETECTED'}
                  </span>
                </div>

                {!isSecured ? (
                  <div className="clue-action-container">
                    <p className="clue-prompt-text font-serif">
                      A meticulous physical examination may uncover crucial material evidence linked to the victim.
                    </p>
                    <button
                      type="button"
                      className={`inspector-action-btn ${isExaminingAction ? 'btn-inspecting' : ''}`}
                      onClick={handleExamineEvidence}
                      disabled={isExaminingAction}
                    >
                      {isExaminingAction
                        ? 'Applying Forensic Powders & Reagents...'
                        : (objectData.actionLabel || 'Search and Secure Evidence')}
                    </button>
                  </div>
                ) : (
                  <div className="clue-revealed-card parchment-paper-texture">
                    <div className="clue-revealed-top">
                      <span className="clue-title font-title">{matchedClue.name}</span>
                      <span className="badge badge-teal font-mono">
                        RELIABILITY: {Math.round((matchedClue.reliability || 0.9) * 100)}%
                      </span>
                    </div>
                    <p className="clue-description font-serif">
                      "{matchedClue.description}"
                    </p>
                    <div className="clue-status-footer font-mono">
                      <span>STATUS: FILED IN FIELD NOTEBOOK & EVIDENCE PINBOARD</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Decorative note */}
            {!matchedClue && (
              <div className="inspector-decorative-note font-mono">
                <span>NO PHYSICAL CRIME EVIDENCE DETECTED ON THIS OBJECT.</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="inspector-modal-footer">
          <span className="inspector-hotkey-tip font-mono">
            PRESS [ESC] OR CLICK OUTSIDE TO RETURN TO EXPLORATION
          </span>
          <button
            type="button"
            className="inspector-back-btn"
            onClick={onClose}
          >
            Resume Investigation
          </button>
        </div>
      </div>
    </div>
  );
}
