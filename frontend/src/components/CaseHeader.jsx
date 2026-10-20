import React from 'react';

/**
 * CaseHeader Component
 * Sticky top-bar displaying case metadata, real-time investigation progress,
 * and quick actions (New Case, Return to Menu, Accusation).
 */
export default function CaseHeader({
  caseData,
  progress = 0,
  onNewCase,
  onReturnToMenu,
  onOpenAccusation
}) {
  if (!caseData) return null;

  const { caseId, difficulty, seed } = caseData;

  const difficultyColors = {
    easy: 'badge-teal',
    medium: 'badge-amber',
    hard: 'badge-burgundy'
  };

  return (
    <header className="case-header">
      <div className="case-header-inner">
        <div className="brand-section">
          <h1 className="brand-title font-title" onClick={onReturnToMenu} title="Return to Menu">
            THE LAST CLUE
          </h1>
          <div className="case-meta-group">
            <span className="badge badge-slate" title="Unique Case Identifier">
              {caseId || 'CASE-ACTIVE'}
            </span>
            <span className={`badge ${difficultyColors[difficulty] || 'badge-amber'}`}>
              {difficulty ? difficulty.toUpperCase() : 'STANDARD'}
            </span>
            <span className="badge badge-slate" title="Mulberry32 PRNG Seed">
              SEED: {seed}
            </span>
          </div>
        </div>

        <div className="progress-widget" title="Derived from examined clues, POIs, and notes">
          <span className="progress-label">Progress</span>
          <div className="progress-bar-track" role="progressbar" aria-valuenow={progress} aria-valuemin="0" aria-valuemax="100">
            <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
          </div>
          <span className="progress-percent">{progress}%</span>
        </div>

        <div className="header-actions">
          <button
            type="button"
            className="btn-header"
            onClick={onNewCase}
            title="Generate a new procedural mystery"
          >
            New Case
          </button>
          <button
            type="button"
            className="btn-header"
            onClick={onReturnToMenu}
            title="Return to Case Files Archive"
          >
            Archive
          </button>
          <button
            type="button"
            className="btn-header btn-accuse"
            onClick={onOpenAccusation}
            title="File an official accusation"
          >
            File Accusation
          </button>
        </div>
      </div>
    </header>
  );
}
