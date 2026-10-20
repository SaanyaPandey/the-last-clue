import React, { useState } from 'react';

/**
 * CluePanel Component
 * Displays the case's physical and documentary evidence.
 * Highlights the starting lead, tracks examination status, and allows player note-taking.
 */
export default function CluePanel({
  clues = [],
  startingClueId,
  examinedClueIds = new Set(),
  onToggleExamined,
  clueNotes = {},
  onUpdateClueNote,
  onSelectGraphNode
}) {
  const [filter, setFilter] = useState('all'); // 'all' | 'unexamined' | 'examined'
  const [selectedClueId, setSelectedClueId] = useState(startingClueId || (clues[0]?.id ?? null));

  const filteredClues = clues.filter((clue) => {
    const isExamined = examinedClueIds.has(clue.id);
    if (filter === 'examined') return isExamined;
    if (filter === 'unexamined') return !isExamined;
    return true;
  });

  const selectedClue = clues.find((c) => c.id === selectedClueId) || clues[0];

  const categoryIcons = {
    document: '📜',
    forensic: '🔬',
    chronological: '⏱️',
    physical: '🔍',
    testimony: '🗣️'
  };

  return (
    <div className="panel-container">
      <div className="panel-header-row">
        <div>
          <h2 className="panel-title font-title">EVIDENCE & CLUES ARCHIVE</h2>
          <p className="panel-subtitle">
            Forensic artifacts and documentary records retrieved from the crime scene.
          </p>
        </div>

        <div className="panel-filter-bar" role="group" aria-label="Filter clues">
          <button
            type="button"
            className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
            onClick={() => setFilter('all')}
          >
            All Evidence ({clues.length})
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'unexamined' ? 'active' : ''}`}
            onClick={() => setFilter('unexamined')}
          >
            Unexamined ({clues.filter((c) => !examinedClueIds.has(c.id)).length})
          </button>
          <button
            type="button"
            className={`filter-btn ${filter === 'examined' ? 'active' : ''}`}
            onClick={() => setFilter('examined')}
          >
            Examined ({examinedClueIds.size})
          </button>
        </div>
      </div>

      <div className="clues-grid">
        {filteredClues.map((clue) => {
          const isStarting = clue.id === startingClueId;
          const isExamined = examinedClueIds.has(clue.id);
          const icon = categoryIcons[clue.category] || '🔍';
          const relScore = typeof clue.reliability === 'number' ? Math.round(clue.reliability * 5) : 4;

          return (
            <article
              key={clue.id}
              className={`clue-card ${isExamined ? 'examined' : ''} ${isStarting ? 'starting-clue' : ''}`}
              onClick={() => setSelectedClueId(clue.id)}
            >
              {isStarting && (
                <div className="lead-stamp" title="Starting point of procedural BFS/DFS solvability graph">
                  ★ INITIAL LEAD
                </div>
              )}

              <div className="clue-header-line">
                <div className="clue-icon" aria-hidden="true">{icon}</div>
                <div>
                  <h3 className="clue-title">{clue.name || clue.label || clue.id}</h3>
                  <span className="badge badge-slate" style={{ marginTop: '3px' }}>
                    {clue.category ? clue.category.toUpperCase() : 'PHYSICAL'}
                  </span>
                </div>
              </div>

              <div className="clue-desc font-serif">
                "{clue.description || 'Forensic examination pending. No descriptive log available.'}"
              </div>

              <div className="clue-meta-row">
                <div className="reliability-bar" title={`Reliability: ${Math.round((clue.reliability || 0.8) * 100)}%`}>
                  <span>Reliability:</span>
                  <div className="rel-indicator" aria-hidden="true">
                    {[1, 2, 3, 4, 5].map((dot) => (
                      <span
                        key={dot}
                        className={`rel-dot ${dot <= relScore ? 'filled' : ''}`}
                      />
                    ))}
                  </div>
                </div>

                <span className={`badge ${isExamined ? 'badge-success' : 'badge-slate'}`}>
                  {isExamined ? '✓ EXAMINED' : 'UNEXAMINED'}
                </span>
              </div>

              {/* Personal Observation Note */}
              <div className="clue-notes-area">
                <label
                  htmlFor={`note-${clue.id}`}
                  style={{
                    fontSize: '0.7rem',
                    fontFamily: 'var(--font-mono)',
                    color: 'var(--text-muted)',
                    display: 'block',
                    marginBottom: '3px'
                  }}
                >
                  DETECTIVE'S FIELD OBSERVATION:
                </label>
                <textarea
                  id={`note-${clue.id}`}
                  placeholder="Record deduction or hypothesis regarding this clue..."
                  value={clueNotes[clue.id] || ''}
                  onChange={(e) => onUpdateClueNote(clue.id, e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  className="clue-notes-input"
                />
              </div>

              <div className="clue-actions" onClick={(e) => e.stopPropagation()}>
                <button
                  type="button"
                  className={`btn-examine ${isExamined ? 'is-examined' : ''}`}
                  onClick={() => onToggleExamined(clue.id)}
                >
                  {isExamined ? 'Mark Unexamined' : 'Mark as Examined'}
                </button>

                {onSelectGraphNode && (
                  <button
                    type="button"
                    className="btn-examine"
                    style={{ flex: 'initial' }}
                    onClick={() => onSelectGraphNode(clue.id)}
                    title="Locate on Evidence Board"
                  >
                    🕸️ View on Board
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      {filteredClues.length === 0 && (
        <div style={{ textAlign: 'center', padding: '3rem 1rem', color: '#7a8699' }}>
          No clues match the current filter selection.
        </div>
      )}
    </div>
  );
}
