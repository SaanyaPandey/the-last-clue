import React, { useState } from 'react';
import LanguageSelector from './LanguageSelector';
import MovementControlSelector from './MovementControlSelector';
import { useLanguage } from '../localization/LanguageContext';
import { useControls } from '../context/ControlsContext';

/**
 * StartScreen Component
 * Initial briefing room for setting difficulty, seed, language preference, and launching a case.
 */
export default function StartScreen({ onStartInvestigation, loading = false, error = null }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [selectedTheme, setSelectedTheme] = useState(null); // 'trophy' | 'science' | 'treasure' | 'library' | null
  const [seed, setSeed] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);
  const { t } = useLanguage();
  const { controlMode } = useControls();

  const handleRandomizeSeed = () => {
    // Generate random 6-digit positive integer seed
    const randomSeed = Math.floor(100000 + Math.random() * 900000);
    setSeed(String(randomSeed));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (loading) return;

    onStartInvestigation({
      difficulty,
      seed: seed.trim() !== '' ? Number(seed.trim()) : undefined,
      theme: selectedTheme || undefined
    });
  };

  return (
    <div className="start-screen-wrapper">
      <div className="case-file-cover">
        <header className="case-file-header">
          {/* Prominent Onboarding Language Selector */}
          <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.25rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
              <span style={{ fontSize: '0.75rem', fontFamily: 'var(--font-mono)', color: 'var(--amber-light)', textTransform: 'uppercase' }}>
                🌐 {t('language.selectLanguage')}
              </span>
              <LanguageSelector variant="segmented" />
            </div>
          </div>

          <h1 className="game-title font-title">{t('app.title')}</h1>
          <p className="game-tagline font-serif">{t('app.tagline')}</p>

          <div className="case-briefing font-serif">
            {t('startScreen.briefing')}
          </div>
        </header>

        {error && (
          <div
            role="alert"
            style={{
              background: 'rgba(139, 40, 60, 0.25)',
              border: '1px solid var(--burgundy-light)',
              borderRadius: 'var(--radius-sm)',
              padding: '0.75rem 1rem',
              color: '#ffc1cd',
              fontSize: '0.85rem',
              marginBottom: '1rem'
            }}
          >
            <strong>{t('feedback.errorTitle')}:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="investigation-form">
          {/* Difficulty Selection */}
          <div className="form-group">
            <label className="form-label">
              <span>{t('startScreen.selectComplexity')}</span>
              <span className="badge badge-amber">{difficulty.toUpperCase()}</span>
            </label>
            <div className="difficulty-selector" role="radiogroup" aria-label="Difficulty level">
              <button
                type="button"
                role="radio"
                aria-checked={difficulty === 'easy'}
                className={`difficulty-btn ${difficulty === 'easy' ? 'active' : ''}`}
                onClick={() => setDifficulty('easy')}
                disabled={loading}
              >
                <span className="diff-title">{t('tiers.easy.badge')}</span>
                <span className="diff-specs">{t('tiers.easy.title')}</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={difficulty === 'medium'}
                className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
                disabled={loading}
              >
                <span className="diff-title">{t('tiers.medium.badge')}</span>
                <span className="diff-specs">{t('tiers.medium.title')}</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={difficulty === 'hard'}
                className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
                disabled={loading}
              >
                <span className="diff-title">{t('tiers.hard.badge')}</span>
                <span className="diff-specs">{t('tiers.hard.title')}</span>
              </button>
            </div>
          </div>

          {/* Mystery Theme Selector */}
          <div className="form-group">
            <label className="form-label">
              <span>{t('caseThemes.selectThemeLabel') || 'Case Theme / Adventure'}</span>
              <span className="badge badge-amber font-mono">
                {selectedTheme ? selectedTheme.toUpperCase() : 'SURPRISE / RANDOM'}
              </span>
            </label>
            <div className="case-theme-grid" role="radiogroup" aria-label="Case adventure theme">
              <button
                type="button"
                className={`theme-pick-btn ${selectedTheme === 'trophy' ? 'active' : ''}`}
                onClick={() => setSelectedTheme(selectedTheme === 'trophy' ? null : 'trophy')}
                disabled={loading}
              >
                <span className="theme-pick-icon">🏆</span>
                <span className="theme-pick-title">{t('caseThemes.trophy.title')}</span>
              </button>

              <button
                type="button"
                className={`theme-pick-btn ${selectedTheme === 'science' ? 'active' : ''}`}
                onClick={() => setSelectedTheme(selectedTheme === 'science' ? null : 'science')}
                disabled={loading}
              >
                <span className="theme-pick-icon">🔬</span>
                <span className="theme-pick-title">{t('caseThemes.science.title')}</span>
              </button>

              <button
                type="button"
                className={`theme-pick-btn ${selectedTheme === 'treasure' ? 'active' : ''}`}
                onClick={() => setSelectedTheme(selectedTheme === 'treasure' ? null : 'treasure')}
                disabled={loading}
              >
                <span className="theme-pick-icon">🗝️</span>
                <span className="theme-pick-title">{t('caseThemes.treasure.title')}</span>
              </button>

              <button
                type="button"
                className={`theme-pick-btn ${selectedTheme === 'library' ? 'active' : ''}`}
                onClick={() => setSelectedTheme(selectedTheme === 'library' ? null : 'library')}
                disabled={loading}
              >
                <span className="theme-pick-icon">📚</span>
                <span className="theme-pick-title">{t('caseThemes.library.title')}</span>
              </button>
            </div>
          </div>

          {/* Movement Controls Preference */}
          <div className="form-group">
            <label className="form-label">
              <span>{t('controls.settingLabel')}</span>
              <span className="badge badge-amber">{t(`controls.${controlMode}.badge`)}</span>
            </label>
            <MovementControlSelector variant="segmented" />
          </div>

          {/* Seed Input */}
          <div className="form-group">
            <label htmlFor="seed-input" className="form-label">
              <span>{t('startScreen.seedLabel')}</span>
              <span style={{ fontSize: '0.72rem', color: '#7a8699', textTransform: 'none' }}>
                {t('startScreen.seedHint')}
              </span>
            </label>
            <div className="seed-input-row">
              <input
                id="seed-input"
                type="number"
                min="0"
                max="2147483647"
                step="1"
                placeholder={t('startScreen.seedPlaceholder')}
                value={seed}
                onChange={(e) => setSeed(e.target.value)}
                className="seed-input"
                disabled={loading}
              />
              <button
                type="button"
                className="seed-random-btn"
                onClick={handleRandomizeSeed}
                disabled={loading}
                title="Random Code"
              >
                {t('startScreen.randomizeBtn')}
              </button>
              {seed && (
                <button
                  type="button"
                  className="seed-random-btn"
                  onClick={() => setSeed('')}
                  disabled={loading}
                  title="Clear"
                >
                  {t('startScreen.clearBtn')}
                </button>
              )}
            </div>
          </div>

          {/* Start Button */}
          <div className="start-action-row">
            <button
              type="submit"
              className="start-btn"
              disabled={loading}
              aria-busy={loading}
            >
              {loading ? (
                <>
                  <span className="loading-spinner" style={{ width: '18px', height: '18px' }} />
                  <span>{t('startScreen.loadingBtn')}</span>
                </>
              ) : (
                <>
                  <span>{t('startScreen.startBtn')}</span>
                </>
              )}
            </button>
          </div>
        </form>

        {/* Detective's Handbook / Controls */}
        <section className="instructions-card">
          <button
            type="button"
            className="instructions-toggle"
            onClick={() => setShowInstructions(!showInstructions)}
            aria-expanded={showInstructions}
          >
            <span>{t('startScreen.fieldManualToggle')}</span>
            <span>{showInstructions ? t('startScreen.hideManual') : t('startScreen.viewManual')}</span>
          </button>

          {showInstructions && (
            <div className="instructions-body">
              {t('startScreen.steps').map((step, idx) => (
                <div key={idx} className="instruction-step">
                  <span className="step-num">{idx + 1}</span>
                  <div>{step}</div>
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
