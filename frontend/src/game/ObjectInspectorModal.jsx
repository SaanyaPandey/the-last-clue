import React, { useState } from 'react';
import { soundEngine } from './SoundEngine';
import { useLanguage } from '../localization/LanguageContext';

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
          {/* Silhouette */}
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
    case 'bookshelf':
    case 'ledger_shelf':
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
    case 'wall_safe':
    case 'safe':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Heavy Steel Safe Door */}
          <rect x="20" y="20" width="80" height="80" rx="4" fill="#1b212b" stroke="#48566a" strokeWidth="3" />
          <circle cx="60" cy="60" r="24" fill="#263140" stroke="#d4a359" strokeWidth="2.5" />
          <circle cx="60" cy="60" r="16" fill="#121820" stroke="#a67c3b" strokeWidth="1.5" />
          {/* Safe Dial Notches */}
          <line x1="60" y1="38" x2="60" y2="44" stroke="#ffdf88" strokeWidth="2" />
          <line x1="76" y1="52" x2="82" y2="52" stroke="#ffdf88" strokeWidth="2" />
          <line x1="60" y1="76" x2="60" y2="82" stroke="#ffdf88" strokeWidth="2" />
          <line x1="38" y1="52" x2="44" y2="52" stroke="#ffdf88" strokeWidth="2" />
          {/* Heavy Brass Locking Wheel */}
          <circle cx="60" cy="60" r="6" fill="#e6b86e" />
        </svg>
      );
    case 'potting_bench':
    case 'greenhouse_bench':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Wooden Bench Top */}
          <rect x="15" y="55" width="90" height="14" fill="#3a2517" stroke="#543622" strokeWidth="2" />
          <rect x="22" y="69" width="8" height="42" fill="#2d1d12" />
          <rect x="90" y="69" width="8" height="42" fill="#2d1d12" />
          {/* Terracotta Plant Pots */}
          <polygon points="32,55 46,55 43,38 35,38" fill="#a44e2b" stroke="#7a3418" strokeWidth="1" />
          <polygon points="50,55 66,55 63,34 53,34" fill="#bf5b32" stroke="#7a3418" strokeWidth="1" />
          {/* Gardening Shears */}
          <line x1="74" y1="50" x2="92" y2="34" stroke="#b0b8c4" strokeWidth="3" />
          <line x1="74" y1="34" x2="92" y2="50" stroke="#b0b8c4" strokeWidth="3" />
          <circle cx="72" cy="52" r="4" fill="none" stroke="#a44e2b" strokeWidth="2" />
          <circle cx="72" cy="32" r="4" fill="none" stroke="#a44e2b" strokeWidth="2" />
        </svg>
      );
    case 'wine_cask':
    case 'cask':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Oak Wine Cask */}
          <ellipse cx="60" cy="60" rx="36" ry="44" fill="#382216" stroke="#4f3120" strokeWidth="2" />
          <ellipse cx="60" cy="60" rx="32" ry="40" fill="#2e1a10" />
          {/* Iron Hoops */}
          <ellipse cx="60" cy="60" rx="36" ry="12" fill="none" stroke="#161e28" strokeWidth="3" />
          <ellipse cx="60" cy="40" rx="33" ry="10" fill="none" stroke="#161e28" strokeWidth="2.5" />
          <ellipse cx="60" cy="80" rx="33" ry="10" fill="none" stroke="#161e28" strokeWidth="2.5" />
          {/* Brass Spigot Tap */}
          <rect x="57" y="56" width="6" height="8" fill="#d4a359" />
          <circle cx="60" cy="56" r="3" fill="#ffdf88" />
        </svg>
      );
    case 'trophy_cabinet':
    case 'project_podium':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Velvet Display Pedestal */}
          <rect x="25" y="85" width="70" height="24" rx="3" fill="#1c1214" stroke="#d4a359" strokeWidth="2" />
          <rect x="30" y="80" width="60" height="8" fill="#7a1a28" />
          {/* Golden Trophy Cup */}
          <path d="M 40 30 L 80 30 Q 75 62 60 70 Q 45 62 40 30 Z" fill="#f0c05a" stroke="#b8893d" strokeWidth="2" />
          {/* Trophy Handles */}
          <path d="M 40 36 Q 26 44 38 56 Q 42 58 45 54" fill="none" stroke="#d4a359" strokeWidth="3" strokeLinecap="round" />
          <path d="M 80 36 Q 94 44 82 56 Q 78 58 75 54" fill="none" stroke="#d4a359" strokeWidth="3" strokeLinecap="round" />
          {/* Star Sparkle */}
          <polygon points="60,40 62,35 64,40 69,42 64,44 62,49 60,44 55,42" fill="#fff" />
          {/* Plaque */}
          <rect x="44" y="93" width="32" height="8" fill="#d4a359" />
        </svg>
      );
    case 'cctv_monitor':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* CRT Monitor Housing */}
          <rect x="15" y="20" width="90" height="70" rx="6" fill="#1e293b" stroke="#475569" strokeWidth="2.5" />
          {/* Screen with glowing cyan surveillance tint */}
          <rect x="22" y="26" width="76" height="54" rx="2" fill="#04151f" stroke="#0ea5e9" strokeWidth="1" />
          {/* Scanlines & Camera Grid */}
          <line x1="22" y1="53" x2="98" y2="53" stroke="rgba(14,165,233,0.3)" strokeWidth="1" strokeDasharray="3 3" />
          <line x1="60" y1="26" x2="60" y2="80" stroke="rgba(14,165,233,0.3)" strokeWidth="1" strokeDasharray="3 3" />
          {/* Camera 2 Timestamp & Recording Indicator */}
          <text x="26" y="38" fill="#38bdf8" fontSize="6px" fontFamily="monospace">CAM-02 20:27:14</text>
          <text x="26" y="46" fill="#ef4444" fontSize="5px" fontFamily="monospace">● REC</text>
          {/* Silhouette Figure at Showcase on Screen */}
          <circle cx="58" cy="62" r="3" fill="#38bdf8" opacity="0.8" />
          <path d="M 58 65 L 58 72 L 53 77 M 58 72 L 63 76" stroke="#38bdf8" strokeWidth="1.5" strokeLinecap="round" opacity="0.8" />
          {/* Monitor Stand */}
          <rect x="52" y="90" width="16" height="12" fill="#334155" />
          <rect x="36" y="102" width="48" height="6" rx="2" fill="#1e293b" />
        </svg>
      );
    case 'principal_desk':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Executive Oak School Desk */}
          <rect x="15" y="45" width="90" height="60" rx="3" fill="#2d1b11" stroke="#4a2c1d" strokeWidth="2" />
          {/* Green Desk Blotter */}
          <rect x="24" y="48" width="72" height="20" fill="#143323" stroke="#b8893d" strokeWidth="1" />
          {/* School Attendance Ledger with Torn Page */}
          <rect x="36" y="52" width="28" height="14" fill="#fdfbf7" stroke="#94a3b8" strokeWidth="0.8" />
          <line x1="40" y1="56" x2="60" y2="56" stroke="#334155" strokeWidth="0.8" />
          <line x1="40" y1="60" x2="56" y2="60" stroke="#ef4444" strokeWidth="0.8" />
          {/* Brass Reception Bell */}
          <ellipse cx="76" cy="58" rx="5" ry="4" fill="#d4a359" stroke="#b8893d" strokeWidth="1" />
          <circle cx="76" cy="54" r="1.5" fill="#f59e0b" />
          {/* Academy Stamp */}
          <rect x="85" y="52" width="6" height="8" rx="1" fill="#78350f" />
        </svg>
      );
    case 'sports_locker':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Metal Locker Body */}
          <rect x="22" y="16" width="76" height="92" rx="3" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          {/* Locker Louvers */}
          <line x1="34" y1="26" x2="86" y2="26" stroke="#475569" strokeWidth="2" />
          <line x1="34" y1="32" x2="86" y2="32" stroke="#475569" strokeWidth="2" />
          <line x1="34" y1="38" x2="86" y2="38" stroke="#475569" strokeWidth="2" />
          {/* Number 7 Plate */}
          <rect x="50" y="46" width="20" height="10" rx="1" fill="#d4a359" />
          <text x="60" y="54" textAnchor="middle" fill="#000" fontSize="7px" fontWeight="bold">#7</text>
          {/* Scratched Padlock Hasp */}
          <rect x="76" y="62" width="8" height="14" rx="2" fill="#94a3b8" stroke="#ef4444" strokeWidth="1" />
          <circle cx="80" cy="68" r="2" fill="#0f172a" />
        </svg>
      );
    case 'notice_board':
    case 'bulletin_board':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Wooden Frame */}
          <rect x="15" y="20" width="90" height="80" rx="3" fill="#4a2e1b" stroke="#6b4428" strokeWidth="2" />
          {/* Cork Surface */}
          <rect x="22" y="27" width="76" height="66" fill="#a4774b" />
          {/* Pinned Papers */}
          <rect x="28" y="34" width="28" height="22" fill="#f8fafc" stroke="#cbd5e1" strokeWidth="1" />
          <circle cx="42" cy="36" r="2.5" fill="#ef4444" />
          <rect x="62" y="38" width="30" height="26" fill="#fef08a" stroke="#ca8a04" strokeWidth="1" />
          <circle cx="77" cy="40" r="2.5" fill="#3b82f6" />
          {/* Dropped Button Glint */}
          <circle cx="70" cy="82" r="5" fill="#e2e8f0" stroke="#94a3b8" strokeWidth="1.5" />
          <circle cx="70" cy="82" r="1.5" fill="#475569" />
        </svg>
      );
    case 'lab_workbench':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Heavy Slate Workbench */}
          <rect x="15" y="65" width="90" height="42" fill="#1e293b" stroke="#334155" strokeWidth="2" />
          <rect x="10" y="58" width="100" height="10" fill="#334155" />
          {/* Bunsen Burner */}
          <rect x="28" y="44" width="8" height="14" fill="#94a3b8" />
          <ellipse cx="32" cy="58" rx="10" ry="3" fill="#475569" />
          {/* Blue Flame */}
          <path d="M 28 44 Q 32 26 32 22 Q 36 34 36 44 Z" fill="#38bdf8" />
          {/* Erlenmeyer Flask with Chemical */}
          <path d="M 65 34 L 75 34 L 85 54 L 55 54 Z" fill="rgba(6, 182, 212, 0.7)" stroke="#e0f2fe" strokeWidth="1.5" />
          <ellipse cx="70" cy="54" rx="15" ry="3" fill="#0891b2" />
          <line x1="70" y1="28" x2="70" y2="34" stroke="#e0f2fe" strokeWidth="2" />
        </svg>
      );
    case 'formula_chalkboard':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Oak Board Frame */}
          <rect x="15" y="22" width="90" height="76" rx="2" fill="#3d2817" stroke="#5a3c23" strokeWidth="2" />
          {/* Dark Green Slate Chalkboard */}
          <rect x="22" y="29" width="76" height="62" fill="#143323" />
          {/* Chalk formulas & diagrams */}
          <rect x="30" y="38" width="22" height="18" fill="none" stroke="#e2e8f0" strokeWidth="1.5" />
          <line x1="52" y1="47" x2="68" y2="47" stroke="#e2e8f0" strokeWidth="1.5" />
          <circle cx="75" cy="47" r="5" fill="none" stroke="#fef08a" strokeWidth="1.5" />
          {/* Torn Blueprint Corner */}
          <polygon points="68,68 88,68 88,82 74,82" fill="#38bdf8" stroke="#bae6fd" strokeWidth="1" />
          {/* Chalk Tray */}
          <rect x="20" y="89" width="80" height="4" fill="#5a3c23" />
          <rect x="45" y="87" width="10" height="2" fill="#fff" />
        </svg>
      );
    case 'specimen_cabinet':
    case 'storage_locker':
    case 'record_cabinet':
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Metal Archive Cabinet */}
          <rect x="22" y="18" width="76" height="88" rx="3" fill="#1e293b" stroke="#475569" strokeWidth="2" />
          {/* Drawer 1 */}
          <rect x="28" y="26" width="64" height="24" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <rect x="48" y="34" width="24" height="6" rx="2" fill="#d4a359" />
          {/* Drawer 2 */}
          <rect x="28" y="54" width="64" height="24" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <rect x="48" y="62" width="24" height="6" rx="2" fill="#d4a359" />
          {/* Drawer 3 / Base */}
          <rect x="28" y="82" width="64" height="18" fill="#0f172a" stroke="#334155" strokeWidth="1" />
          <rect x="52" y="87" width="16" height="4" rx="2" fill="#94a3b8" />
        </svg>
      );
    default:
      return (
        <svg viewBox="0 0 120 120" className="object-svg-art" aria-hidden="true">
          {/* Golden Detective Magnifying Glass & Glow */}
          <circle cx="52" cy="50" r="26" fill="rgba(212, 163, 89, 0.15)" stroke="#d4a359" strokeWidth="3.5" />
          <circle cx="52" cy="50" r="22" fill="none" stroke="rgba(255, 235, 180, 0.4)" strokeWidth="1" />
          {/* Reflection Glint */}
          <path d="M 40 36 Q 52 30 64 36" stroke="#fff" strokeWidth="2" fill="none" strokeLinecap="round" />
          {/* Turned Brass Handle */}
          <line x1="72" y1="70" x2="98" y2="96" stroke="#8c6527" strokeWidth="7" strokeLinecap="round" />
          <line x1="72" y1="70" x2="98" y2="96" stroke="#d4a359" strokeWidth="4" strokeLinecap="round" />
          {/* Star sparkles */}
          <circle cx="48" cy="52" r="2.5" fill="#ffdf88" />
          <polygon points="58,44 60,40 62,44 66,46 62,48 60,52 58,48 54,46" fill="#ffeaad" />
        </svg>
      );
  }
}

/**
 * ObjectInspectorModal Component
 * Immersive close-up inspection view for examine-in-place detective gameplay.
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
  const { t, getClueText } = useLanguage();

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
  const localizedClue = matchedClue ? getClueText(matchedClue.id) : null;

  return (
    <div
      className="inspector-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${t('inspector.dossierBadge')}: ${objectData.title}`}
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="inspector-modal-card">
        {/* Header Ribbon with Brass Accents */}
        <div className="inspector-modal-header">
          <div className="inspector-meta-badge">
            <span className="badge badge-amber font-mono">{t('inspector.dossierBadge')}</span>
            <span className="inspector-room-tag font-mono">
              {objectData.roomName?.toUpperCase() || 'MANOR CRIME SCENE'}
            </span>
          </div>
          <button
            type="button"
            className="inspector-close-btn"
            onClick={onClose}
            aria-label={t('inspector.closeAria')}
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
                <span>{t('inspector.examiningArtifact')}</span>
              </div>
            )}

            {isSecured && (
              <div className="archival-wax-stamp font-mono animate-stamp-press">
                <div className="stamp-inner-border">
                  <span className="stamp-subtext">{t('inspector.scotlandYard')}</span>
                  <span className="stamp-maintext">{t('inspector.evidenceRecorded')}</span>
                  <span className="stamp-date font-mono">{t('inspector.archivalSecured')}</span>
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
              <span className="inspector-detail-label font-mono">{t('inspector.observationLabel')}</span>
              <p className="inspector-detail-text font-serif">
                "{objectData.detailObservation}"
              </p>
            </div>

            {/* Evidence Discovery Section */}
            {matchedClue && (
              <div className={`inspector-clue-unveil ${isSecured ? 'unveiled' : ''}`}>
                <div className="clue-unveil-header">
                  <span className="clue-tag font-mono">
                    {isSecured ? t('inspector.evidenceIdentified') : t('inspector.irregularityDetected')}
                  </span>
                </div>

                {!isSecured ? (
                  <div className="clue-action-container">
                    <p className="clue-prompt-text font-serif">
                      {t('inspector.promptText')}
                    </p>
                    <button
                      type="button"
                      className={`inspector-action-btn ${isExaminingAction ? 'btn-inspecting' : ''}`}
                      onClick={handleExamineEvidence}
                      disabled={isExaminingAction}
                    >
                      {isExaminingAction
                        ? t('inspector.actionInspecting')
                        : (objectData.actionLabel || t('inspector.actionSearchDefault'))}
                    </button>
                  </div>
                ) : (
                  <div className="clue-revealed-card parchment-paper-texture">
                    <div className="clue-revealed-top">
                      <span className="clue-title font-title">
                        {localizedClue?.name || matchedClue.name}
                      </span>
                      <span className="badge badge-teal font-mono">
                        {t('inspector.reliability')}: {Math.round((matchedClue.reliability || 0.9) * 100)}%
                      </span>
                    </div>
                    <p className="clue-description font-serif">
                      "{localizedClue?.description || matchedClue.description}"
                    </p>
                    <div className="clue-status-footer font-mono">
                      <span>{t('inspector.statusFiled')}</span>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Decorative note */}
            {!matchedClue && (
              <div className="inspector-decorative-note font-mono">
                <span>{t('inspector.noEvidenceNote')}</span>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="inspector-modal-footer">
          <span className="inspector-hotkey-tip font-mono">
            {t('inspector.hotkeyTip')}
          </span>
          <button
            type="button"
            className="inspector-back-btn"
            onClick={onClose}
          >
            {t('inspector.resumeBtn')}
          </button>
        </div>
      </div>
    </div>
  );
}
