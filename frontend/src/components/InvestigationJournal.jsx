import React from 'react';

/**
 * InvestigationJournal Component
 * Detective log summarizing examined vs unexamined leads, flagged Persons of Interest,
 * written notes, and true progress metrics.
 */
export default function InvestigationJournal({
  clues = [],
  suspects = [],
  examinedClueIds = new Set(),
  personsOfInterest = new Set(),
  clueNotes = {},
  generalNotes = '',
  onUpdateGeneralNotes,
  onToggleExamined,
  onTogglePOI,
  progress = 0
}) {
  const examinedCount = examinedClueIds.size;
  const unexaminedCount = Math.max(0, clues.length - examinedCount);
  const poiCount = personsOfInterest.size;
  const notesCount = Object.values(clueNotes).filter((n) => n.trim() !== '').length + (generalNotes.trim() ? 1 : 0);

  return (
    <div className="panel-container">
      <div className="panel-header-row">
        <div>
          <h2 className="panel-title font-title">INVESTIGATION JOURNAL & LOG</h2>
          <p className="panel-subtitle">
            Official field record of examined evidence, suspected motives, and case deductions.
          </p>
        </div>

        <div className="badge badge-amber" style={{ fontSize: '0.85rem' }}>
          CASE COMPLETION: {progress}%
        </div>
      </div>

      <div className="journal-container">
        {/* Main Column: General Deductions & Field Notes */}
        <div className="journal-main">
          <div className="journal-dossier-card">
            <h3 className="font-title" style={{ fontSize: '1.1rem', color: 'var(--text-ivory)' }}>
              DETECTIVE'S WORKING HYPOTHESIS & CASE LOG
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#9d9487' }}>
              Synthesize your deductions regarding access opportunities, motive validity, and forensic compatibility.
            </p>
            <textarea
              className="general-notes-area"
              placeholder="Record overarching case theories, conflicting alibis, and forensic conclusions here..."
              value={generalNotes}
              onChange={(e) => onUpdateGeneralNotes(e.target.value)}
            />
          </div>

          {/* Recorded Clue Notes Log */}
          <div className="journal-dossier-card">
            <h3 className="font-title" style={{ fontSize: '1.1rem', color: 'var(--text-ivory)' }}>
              FIELD OBSERVATIONS LOG ({notesCount} Recorded)
            </h3>

            {Object.keys(clueNotes).filter((id) => clueNotes[id]?.trim()).length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#7a8699', fontSize: '0.85rem' }}>
                No individual clue observations recorded yet. Inspect clues to jot down deductions.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {clues
                  .filter((c) => clueNotes[c.id]?.trim())
                  .map((clue) => (
                    <div
                      key={clue.id}
                      style={{
                        background: 'rgba(10, 13, 18, 0.4)',
                        border: '1px solid var(--border-dark)',
                        borderRadius: 'var(--radius-sm)',
                        padding: '0.75rem',
                        fontSize: '0.85rem'
                      }}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <strong style={{ color: 'var(--amber-light)' }}>{clue.name || clue.id}</strong>
                        <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                          {clue.category?.toUpperCase() || 'EVIDENCE'}
                        </span>
                      </div>
                      <p style={{ fontStyle: 'italic', color: 'var(--text-primary)', margin: 0 }}>
                        "{clueNotes[clue.id]}"
                      </p>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar: Status Gauges & Persons of Interest */}
        <div className="journal-sidebar">
          {/* Real Metrics Gauge */}
          <div className="journal-dossier-card">
            <h4 className="font-title" style={{ fontSize: '0.95rem', color: 'var(--amber-light)' }}>
              INVESTIGATION METRICS
            </h4>

            <div className="journal-stats-grid">
              <div className="stat-box">
                <div className="stat-num">{examinedCount}</div>
                <div className="stat-label">Examined</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">{unexaminedCount}</div>
                <div className="stat-label">Pending</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">{poiCount}</div>
                <div className="stat-label">POIs</div>
              </div>
            </div>

            <div style={{ marginTop: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: '4px' }}>
                <span style={{ color: 'var(--text-muted)' }}>Evidence Inspection Progress:</span>
                <span style={{ color: 'var(--amber-light)', fontFamily: 'var(--font-mono)' }}>
                  {clues.length > 0 ? Math.round((examinedCount / clues.length) * 100) : 0}%
                </span>
              </div>
              <div className="progress-bar-track" style={{ width: '100%', height: '7px' }}>
                <div
                  className="progress-bar-fill"
                  style={{
                    width: `${clues.length > 0 ? (examinedCount / clues.length) * 100 : 0}%`
                  }}
                />
              </div>
            </div>
          </div>

          {/* Flagged Persons of Interest List */}
          <div className="journal-dossier-card">
            <h4 className="font-title" style={{ fontSize: '0.95rem', color: '#ff9fb2' }}>
              PERSONS OF INTEREST ({poiCount})
            </h4>

            {poiCount === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#7a8699', fontStyle: 'italic' }}>
                No suspects currently flagged as primary persons of interest.
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {suspects
                  .filter((s) => personsOfInterest.has(s.id))
                  .map((suspect) => (
                    <div
                      key={suspect.id}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.5rem 0.65rem',
                        background: 'rgba(139, 40, 60, 0.15)',
                        border: '1px solid var(--border-burgundy)',
                        borderRadius: 'var(--radius-sm)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#f5efe6' }}>
                          {suspect.name || suspect.id}
                        </div>
                        <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                          {suspect.role}
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={() => onTogglePOI(suspect.id)}
                        style={{ fontSize: '0.75rem', color: '#ff9fb2' }}
                        title="Remove from POIs"
                      >
                        ✕
                      </button>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
