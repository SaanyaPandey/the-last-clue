import React, { useState } from 'react';

/**
 * StartScreen Component
 * Initial briefing room for setting difficulty, seed, and launching a case.
 */
export default function StartScreen({ onStartInvestigation, loading = false, error = null }) {
  const [difficulty, setDifficulty] = useState('medium');
  const [seed, setSeed] = useState('');
  const [showInstructions, setShowInstructions] = useState(false);

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
      seed: seed.trim() !== '' ? Number(seed.trim()) : undefined
    });
  };

  return (
    <div className="start-screen-wrapper">
      <div className="case-file-cover">
        <header className="case-file-header">
          <h1 className="game-title font-title">THE LAST CLUE</h1>
          <p className="game-tagline font-serif">"Every secret leaves a trace."</p>

          <div className="case-briefing">
            Midnight at Blackwood Manor. A wealthy benefactor lies dead under suspicious circumstances.
            Forensic traces are scattered across the estate, and every suspect harbors a hidden agenda.
            As Scotland Yard’s lead investigator, explore the interconnected web of evidence, inspect forensic
            clues, interrogate suspect profiles, and identify the single true culprit.
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
            <strong>Investigation Dispatch Error:</strong> {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="investigation-form">
          {/* Difficulty Selection */}
          <div className="form-group">
            <label className="form-label">
              <span>Select Case Complexity</span>
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
                <span className="diff-title">EASY</span>
                <span className="diff-specs">3 Suspects • 3 Clues • 1 Red Herring</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={difficulty === 'medium'}
                className={`difficulty-btn ${difficulty === 'medium' ? 'active' : ''}`}
                onClick={() => setDifficulty('medium')}
                disabled={loading}
              >
                <span className="diff-title">MEDIUM</span>
                <span className="diff-specs">4 Suspects • 4 Clues • 2 Red Herrings</span>
              </button>

              <button
                type="button"
                role="radio"
                aria-checked={difficulty === 'hard'}
                className={`difficulty-btn ${difficulty === 'hard' ? 'active' : ''}`}
                onClick={() => setDifficulty('hard')}
                disabled={loading}
              >
                <span className="diff-title">HARD</span>
                <span className="diff-specs">5 Suspects • 6 Clues • 3 Red Herrings</span>
              </button>
            </div>
          </div>

          {/* Seed Input */}
          <div className="form-group">
            <label htmlFor="seed-input" className="form-label">
              <span>Investigation Seed (Optional)</span>
              <span style={{ fontSize: '0.72rem', color: '#7a8699', textTransform: 'none' }}>
                Leave blank for cryptographically random case
              </span>
            </label>
            <div className="seed-input-row">
              <input
                id="seed-input"
                type="number"
                min="0"
                max="2147483647"
                step="1"
                placeholder="e.g. 12345 (Leave empty for random seed)"
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
                title="Generate random seed"
              >
                🎲 Randomize
              </button>
              {seed && (
                <button
                  type="button"
                  className="seed-random-btn"
                  onClick={() => setSeed('')}
                  disabled={loading}
                  title="Clear seed"
                >
                  Clear
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
                  <span>Unsealing Case File...</span>
                </>
              ) : (
                <>
                  <span>🔎 Open Case File & Begin Investigation</span>
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
            <span>DETECTIVE'S FIELD MANUAL</span>
            <span>{showInstructions ? '▲ Hide' : '▼ View Instructions'}</span>
          </button>

          {showInstructions && (
            <div className="instructions-body">
              <div className="instruction-step">
                <span className="step-num">1</span>
                <div>
                  <strong>Examine Starting Clue:</strong> Every mystery originates from an initial forensic lead returned by the generator.
                </div>
              </div>
              <div className="instruction-step">
                <span className="step-num">2</span>
                <div>
                  <strong>Traverse Evidence Board:</strong> Inspect the procedural evidence graph to uncover connecting relationships.
                </div>
              </div>
              <div className="instruction-step">
                <span className="step-num">3</span>
                <div>
                  <strong>Cross-Examine Suspects:</strong> Review access locations, trait markers, and flag Persons of Interest.
                </div>
              </div>
              <div className="instruction-step">
                <span className="step-num">4</span>
                <div>
                  <strong>Maintain Your Journal:</strong> Take personal notes and monitor your true investigation progress.
                </div>
              </div>
            </div>
          )}
        </section>
      </div>
    </div>
  );
}
