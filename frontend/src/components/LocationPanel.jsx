import React, { useState } from 'react';
import { useLanguage } from '../localization/LanguageContext';

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
  const { t, getLocationText, getWeaponText, getMotiveText } = useLanguage();

  return (
    <div className="panel-container">
      <div className="panel-header-row">
        <div>
          <h2 className="panel-title font-title">{t('locationPanel.title')}</h2>
          <p className="panel-subtitle">
            {t('locationPanel.subtitle')}
          </p>
        </div>

        <div className="panel-filter-bar">
          <button
            type="button"
            className={`filter-btn ${subTab === 'locations' ? 'active' : ''}`}
            onClick={() => setSubTab('locations')}
          >
            {t('locationPanel.tabRooms')} ({locations.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${subTab === 'weapons' ? 'active' : ''}`}
            onClick={() => setSubTab('weapons')}
          >
            {t('locationPanel.tabWeapons')} ({weapons.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${subTab === 'motives' ? 'active' : ''}`}
            onClick={() => setSubTab('motives')}
          >
            {t('locationPanel.tabMotives')} ({motives.length})
          </button>
        </div>
      </div>

      {/* LOCATIONS SUB-TAB */}
      {subTab === 'locations' && (
        <div className="clues-grid">
          {locations.map((loc) => {
            const localizedLoc = getLocationText(loc.id);
            const displayName = localizedLoc.name || loc.name || loc.id;
            const displayType = localizedLoc.type || loc.type || 'ESTATE ROOM';
            const displayDesc = localizedLoc.description || loc.description || '';

            return (
              <article key={loc.id} className="clue-card">
                <div className="clue-header-line">
                  <div className="clue-icon" aria-hidden="true">🏛️</div>
                  <div>
                    <h3 className="clue-title">{displayName}</h3>
                    <span className="badge badge-teal" style={{ marginTop: '3px' }}>
                      {displayType.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="clue-desc font-serif">
                  "{displayDesc}"
                </div>

                {loc.compatibleWeapons && loc.compatibleWeapons.length > 0 && (
                  <div className="suspect-intel-section">
                    <div className="intel-row">
                      <span className="intel-label">{t('locationPanel.compatibleWeapons')}</span>
                      <span className="intel-val" style={{ fontSize: '0.78rem' }}>
                        {loc.compatibleWeapons.map((wId) => getWeaponText(wId).name || wId).join(', ')}
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
                      {t('locationPanel.viewOnBoard')}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* WEAPONS SUB-TAB */}
      {subTab === 'weapons' && (
        <div className="clues-grid">
          {weapons.map((wep) => {
            const localizedWep = getWeaponText(wep.id);
            const displayName = localizedWep.name || wep.name || wep.id;
            const displayCategory = localizedWep.category || wep.category || 'IMPLEMENT';
            const displaySubType = localizedWep.subType || wep.subType;
            const displayDesc = localizedWep.description || wep.description || '';

            return (
              <article key={wep.id} className="clue-card">
                <div className="clue-header-line">
                  <div className="clue-icon" aria-hidden="true">🗡️</div>
                  <div>
                    <h3 className="clue-title">{displayName}</h3>
                    <div style={{ display: 'flex', gap: '0.35rem', marginTop: '3px' }}>
                      <span className="badge badge-burgundy">
                        {displayCategory.toUpperCase()}
                      </span>
                      {displaySubType && (
                        <span className="badge badge-slate">
                          {displaySubType.toUpperCase()}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="clue-desc font-serif">
                  "{displayDesc}"
                </div>

                {onSelectGraphNode && (
                  <div className="clue-actions" style={{ marginTop: 'auto' }}>
                    <button
                      type="button"
                      className="btn-examine"
                      onClick={() => onSelectGraphNode(wep.id)}
                    >
                      {t('locationPanel.viewOnBoard')}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}

      {/* MOTIVES SUB-TAB */}
      {subTab === 'motives' && (
        <div className="clues-grid">
          {motives.map((mot) => {
            const localizedMot = getMotiveText(mot.id);
            const displayName = localizedMot.name || mot.name || mot.id;
            const displayDesc = localizedMot.description || mot.description || '';

            return (
              <article key={mot.id} className="clue-card">
                <div className="clue-header-line">
                  <div className="clue-icon" aria-hidden="true">⚖️</div>
                  <div>
                    <h3 className="clue-title">{displayName}</h3>
                    <span className="badge badge-amber" style={{ marginTop: '3px' }}>
                      {t('locationPanel.tabMotives')}
                    </span>
                  </div>
                </div>

                <div className="clue-desc font-serif">
                  "{displayDesc}"
                </div>

                {onSelectGraphNode && (
                  <div className="clue-actions" style={{ marginTop: 'auto' }}>
                    <button
                      type="button"
                      className="btn-examine"
                      onClick={() => onSelectGraphNode(mot.id)}
                    >
                      {t('locationPanel.viewOnBoard')}
                    </button>
                  </div>
                )}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
