import React from 'react';
import { useLanguage } from '../localization/LanguageContext';
import { getCaseTheme } from '../game/caseThemes';

/**
 * DetectiveBriefing Component
 * Comprehensive pre-investigation intelligence dossier screen.
 * Displays:
 * - Case Title & ID
 * - Mission Objective
 * - Incident Location, Time & Complainant
 * - Initial Clue Lead
 * - Active Suspect Dossier Cards
 * - Enter Investigation Call-to-Action
 */
export default function DetectiveBriefing({ caseData, onEnterInvestigation, onBackToIntro }) {
  const { t, getSuspectText, getClueText } = useLanguage();

  const theme = getCaseTheme(caseData?.seed || caseData?.caseId, caseData?.theme);
  const themeKey = theme.key;

  const suspects = caseData?.suspects || [];
  const startingClue = caseData?.clues?.find((c) => c.id === caseData?.startingClueId) || caseData?.clues?.[0];
  const startingClueInfo = startingClue ? getClueText(startingClue.id) : null;

  return (
    <div className="detective-briefing-wrapper">
      <div className="briefing-dossier-card animate-fade-in">
        {/* Top Dossier Seal */}
        <header className="briefing-header">
          <div className="briefing-stamp-group">
            <span className="briefing-seal-tag">{t('briefing.officialDossierTag')}</span>
            <span className="briefing-case-code font-mono">{caseData?.caseId || 'CASE-FILE'}</span>
          </div>

          <div className="briefing-title-group">
            <span className="briefing-theme-icon" aria-hidden="true">{theme.icon}</span>
            <div>
              <h1 className="briefing-case-title font-title">
                {t(`caseThemes.${themeKey}.title`)}
              </h1>
              <p className="briefing-case-tagline font-serif">
                "{t(`caseThemes.${themeKey}.tagline`)}"
              </p>
            </div>
          </div>
        </header>

        {/* Big Mission Objective Callout */}
        <section className="briefing-mission-banner" role="region" aria-label="Investigation Mission">
          <div className="mission-beacon-strip">
            <span className="mission-pill font-mono">★ {t('briefing.missionLabel')}</span>
          </div>
          <div className="mission-core-text font-sans">
            {t(`caseThemes.${themeKey}.mission`)}
          </div>
        </section>

        {/* 4-Item Incident Intelligence Grid */}
        <section className="briefing-intel-grid">
          <div className="intel-cell">
            <span className="intel-icon" aria-hidden="true">🏛️</span>
            <div className="intel-details">
              <span className="intel-label font-mono">{t('briefing.incidentLocation')}</span>
              <span className="intel-value">{t(`caseThemes.${themeKey}.locationName`)}</span>
            </div>
          </div>

          <div className="intel-cell">
            <span className="intel-icon" aria-hidden="true">⏰</span>
            <div className="intel-details">
              <span className="intel-label font-mono">{t('briefing.incidentTime')}</span>
              <span className="intel-value">{t(`caseThemes.${themeKey}.incidentTime`)}</span>
            </div>
          </div>

          <div className="intel-cell">
            <span className="intel-icon" aria-hidden="true">📢</span>
            <div className="intel-details">
              <span className="intel-label font-mono">{t('briefing.reportedBy')}</span>
              <span className="intel-value">{t(`caseThemes.${themeKey}.complainant`)}</span>
            </div>
          </div>

          <div className="intel-cell">
            <span className="intel-icon" aria-hidden="true">🔍</span>
            <div className="intel-details">
              <span className="intel-label font-mono">{t('briefing.startingLead')}</span>
              <span className="intel-value">{startingClueInfo?.name || startingClue?.id || t('briefing.initialSearch')}</span>
            </div>
          </div>
        </section>

        {/* Suspect Lineup Cards */}
        <section className="briefing-suspects-section">
          <div className="section-title-bar">
            <h3 className="section-title font-title">
              👤 {t('briefing.suspectLineupTitle')} ({suspects.length})
            </h3>
            <span className="section-hint font-mono">{t('briefing.suspectLineupSubtitle')}</span>
          </div>

          <div className="briefing-suspects-grid">
            {suspects.map((s) => {
              const info = getSuspectText(s.id);
              const traits = info.traits && info.traits.length > 0 ? info.traits : s.traits || [];

              return (
                <div key={s.id} className="briefing-suspect-card">
                  <div className="suspect-card-header">
                    <div className="suspect-avatar-badge font-title">
                      {info.name ? info.name.charAt(0) : 'S'}
                    </div>
                    <div className="suspect-names">
                      <span className="suspect-name font-sans">{info.name || s.name}</span>
                      <span className="suspect-role font-serif">{info.role || s.role}</span>
                    </div>
                  </div>

                  <div className="suspect-traits-row">
                    {traits.slice(0, 3).map((trait, idx) => (
                      <span key={idx} className="suspect-trait-tag font-mono">
                        {trait}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* Action Controls & Navigation */}
        <footer className="briefing-footer-actions">
          {onBackToIntro && (
            <button
              type="button"
              className="btn-briefing-back"
              onClick={onBackToIntro}
            >
              ◀ {t('briefing.rewatchStory')}
            </button>
          )}

          <button
            type="button"
            className="btn-enter-investigation"
            onClick={onEnterInvestigation}
          >
            <span>{t('briefing.enterInvestigationBtn')}</span>
            <span className="btn-arrow">➔</span>
          </button>
        </footer>
      </div>
    </div>
  );
}
