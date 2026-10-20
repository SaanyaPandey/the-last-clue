import React, { useState } from 'react';

/**
 * LocationPanel Component
 * Displays Crime Scenes / Manor Locations and Potential Weapons / Motives.
 * Respects strict secrecy: never leaks whether a location or weapon is the actual murder implement.
 */
export default function LocationPanel({
  locations = [],
  weapons = [],
  motives = [],
  onSelectGraphNode
}) {
  const [subTab, setSubTab] = useState('locations'); // 'locations' | 'weapons' | 'motives'

  return (
    <div className="panel-container">
      <div className="panel-header-row">
        <div>
          <h2 className="panel-title font-title">ESTATE & ARTIFACT RECONNAISSANCE</h2>
          <p className="panel-subtitle">
            Forensic survey of Blackwood Manor rooms, recovered implements, and documented grievances.
          </p>
        </div>

        <div className="panel-filter-bar">
          <button
            type="button"
            className={`filter-btn ${subTab === 'locations' ? 'active' : ''}`}
            onClick={() => setSubTab('locations')}
          >
            Manor Rooms ({locations.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${subTab === 'weapons' ? 'active' : ''}`}
            onClick={() => setSubTab('weapons')}
          >
            Recovered Implements ({weapons.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${subTab === 'motives' ? 'active' : ''}`}
            onClick={() => setSubTab('motives')}
          >
            Suspected Motives ({motives.length})
          </button>
        </div>
      </div>

      {/* LOCATIONS SUB-TAB */}
      {subTab === 'locations' && (
        <div className="clues-grid">
          {locations.map((loc) => (
            <article key={loc.id} className="clue-card">
              <div className="clue-header-line">
                <div className="clue-icon" aria-hidden="true">🏛️</div>
                <div>
                  <h3 className="clue-title">{loc.name || loc.id}</h3>
                  <span className="badge badge-teal" style={{ marginTop: '3px' }}>
                    {loc.type ? loc.type.toUpperCase() : 'ESTATE ROOM'}
                  </span>
                </div>
              </div>

              <div className="clue-desc font-serif">
                "{loc.description || 'Survey details restricted to police architectural schematics.'}"
              </div>

              {loc.compatibleWeapons && loc.compatibleWeapons.length > 0 && (
                <div className="suspect-intel-section">
                  <div className="intel-row">
                    <span className="intel-label">Forensically Compatible Implement Types:</span>
                    <span className="intel-val" style={{ fontSize: '0.78rem' }}>
                      {loc.compatibleWeapons.map((w) => w.replace('weapon_', '').replace(/_/g, ' ')).join(', ')}
                    </span>
                  </div>
                </div>
              )}

              {onSelectGraphNode && (
                <div className="clue-actions" style={{ marginTop: 'auto' }}>
                  <button
                    type="button"
                    className="btn-examine"
                    onClick={() => onSelectGraphNode(loc.id)}
                  >
                    🕸️ View on Evidence Board
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* WEAPONS SUB-TAB */}
      {subTab === 'weapons' && (
        <div className="clues-grid">
          {weapons.map((wep) => (
            <article key={wep.id} className="clue-card">
              <div className="clue-header-line">
                <div className="clue-icon" aria-hidden="true">🗡️</div>
                <div>
                  <h3 className="clue-title">{wep.name || wep.id}</h3>
                  <div style={{ display: 'flex', gap: '0.35rem', marginTop: '3px' }}>
                    <span className="badge badge-burgundy">
                      {wep.category ? wep.category.toUpperCase() : 'IMPLEMENT'}
                    </span>
                    {wep.subType && (
                      <span className="badge badge-slate">
                        {wep.subType.toUpperCase()}
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="clue-desc font-serif">
                "{wep.description || 'Forensic lab description logged in evidence repository.'}"
              </div>

              {onSelectGraphNode && (
                <div className="clue-actions" style={{ marginTop: 'auto' }}>
                  <button
                    type="button"
                    className="btn-examine"
                    onClick={() => onSelectGraphNode(wep.id)}
                  >
                    🕸️ View on Evidence Board
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}

      {/* MOTIVES SUB-TAB */}
      {subTab === 'motives' && (
        <div className="clues-grid">
          {motives.map((mot) => (
            <article key={mot.id} className="clue-card">
              <div className="clue-header-line">
                <div className="clue-icon" aria-hidden="true">⚖️</div>
                <div>
                  <h3 className="clue-title">{mot.name || mot.id}</h3>
                  <span className="badge badge-amber" style={{ marginTop: '3px' }}>
                    THEORY OF MOTIVATION
                  </span>
                </div>
              </div>

              <div className="clue-desc font-serif">
                "{mot.description || 'Circumstantial motive under detective review.'}"
              </div>

              {onSelectGraphNode && (
                <div className="clue-actions" style={{ marginTop: 'auto' }}>
                  <button
                    type="button"
                    className="btn-examine"
                    onClick={() => onSelectGraphNode(mot.id)}
                  >
                    🕸️ View on Evidence Board
                  </button>
                </div>
              )}
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
