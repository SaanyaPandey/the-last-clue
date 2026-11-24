import React from 'react';
import LanguageSelector from './LanguageSelector';
import MovementControlSelector from './MovementControlSelector';
import { useLanguage } from '../localization/LanguageContext';

/**
 * CaseHeader Component
 * Sticky top-bar displaying case metadata, real-time investigation progress,
 * language switcher, and quick actions (New Case, Return to Menu, Accusation).
 */
export default function CaseHeader({
  caseData,
  progress = 0,
  onNewCase,
  onReturnToMenu,
  onOpenAccusation
}) {
  const { t } = useLanguage();
  if (!caseData) return null;

  const { caseId, difficulty, seed } = caseData;

  const difficultyColors = {
    easy: 'badge-teal',
    medium: 'badge-amber',
    hard: 'badge-burgundy'
  };

  const difficultyLabels = {
    easy: t('tiers.easy.badge'),
    medium: t('tiers.medium.badge'),
    hard: t('tiers.hard.badge')
  };

  return (
    <header className="case-header">
      <div className="case-header-inner">
        <div className="brand-section">
          <h1 className="brand-title font-title" onClick={onReturnToMenu} title={t('header.archiveTitle')}>
            {t('app.title')}
          </h1>
          <div className="case-meta-group">
            <span className="badge badge-slate" title="Unique Case Identifier">
              {caseId || t('header.caseActive')}
            </span>
            <span className={`badge ${difficultyColors[difficulty] || 'badge-amber'}`}>
              {difficultyLabels[difficulty] || (difficulty ? difficulty.toUpperCase() : 'STANDARD')}
            </span>
            <span className="badge badge-slate" title="PRNG Seed">
              {t('header.seed')}: {seed}
            </span>
          </div>
        </div>

        <div className="progress-widget" title={t('journal.hypothesisDesc')}>
          <span className="progress-label">{t('header.progress')}</span>
          <div className="progress-bar-track" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-percent">{progress}%</span>
        </div>

        <div className="header-actions">
          {/* In-game Language Switcher */}
          <LanguageSelector variant="compact" />

          {/* Movement Controls Switcher */}
          <MovementControlSelector variant="compact" />

          <button
            type="button"
            className="btn-header"
            onClick={onNewCase}
            title={t('header.newCaseTitle')}
          >
            {t('header.newCase')}
          </button>
          <button
            type="button"
            className="btn-header"
            onClick={onReturnToMenu}
            title={t('header.archiveTitle')}
          >
            {t('header.archive')}
          </button>
          <button
            type="button"
            className="btn-header btn-accuse"
            onClick={onOpenAccusation}
            title={t('header.fileAccusationTitle')}
          >
            {t('header.fileAccusation')}
          </button>
        </div>
      </div>
    </header>
  );
}
