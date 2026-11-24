import React, { useMemo } from 'react';
import { useLanguage } from '../localization/LanguageContext';

/**
 * InvestigationJournal Component — Detective Notebook
 * Feels like a real detective field journal: case file, dynamic objective,
 * observations, clue notes, unresolved questions, and persons of interest.
 */
export default function InvestigationJournal({
  caseData,
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
  const { t, getClueText, getSuspectText } = useLanguage();

  const examinedCount = examinedClueIds.size;
  const totalClues = clues.length;
  const unexaminedCount = Math.max(0, totalClues - examinedCount);
  const poiCount = personsOfInterest.size;
  const notesCount =
    Object.values(clueNotes).filter((n) => n.trim() !== '').length +
    (generalNotes.trim() ? 1 : 0);

  // Derive theme key from caseData
  const themeKey = caseData?.theme || caseData?.themeKey || 'trophy';

  // Dynamic objective based on progress
  const dynamicObjective = useMemo(() => {
    if (examinedCount === 0) {
      return t('journal.objectiveStart');
    }
    if (examinedCount < totalClues) {
      return (t('journal.objectiveExploring') || '')
        .replace('{found}', examinedCount)
        .replace('{total}', totalClues);
    }
    if (poiCount === 0) {
      return t('journal.objectiveAllClues');
    }
    const firstPoi = suspects.find((s) => personsOfInterest.has(s.id));
    const firstName = firstPoi
      ? (getSuspectText(firstPoi.id).name || firstPoi.name || firstPoi.id)
      : '';
    return (t('journal.objectiveHasPoi') || '').replace('{name}', firstName);
  }, [examinedCount, totalClues, poiCount, suspects, personsOfInterest]);

  // Case-specific unresolved questions
  const unresolvedQuestions = useMemo(() => {
    const qMap = {
      trophy: [
        t('journal.questions.trophy.q1'),
        t('journal.questions.trophy.q2'),
        t('journal.questions.trophy.q3')
      ],
      science: [
        t('journal.questions.science.q1'),
        t('journal.questions.science.q2'),
        t('journal.questions.science.q3')
      ],
      treasure: [
        t('journal.questions.treasure.q1'),
        t('journal.questions.treasure.q2'),
        t('journal.questions.treasure.q3')
      ],
      library: [
        t('journal.questions.library.q1'),
        t('journal.questions.library.q2'),
        t('journal.questions.library.q3')
      ]
    };
    return (qMap[themeKey] || qMap.trophy).filter(Boolean);
  }, [themeKey]);

  // Progress bar color
  const progressColor =
    progress < 30 ? '#d44a6b' : progress < 70 ? '#d4a359' : '#3fa1a9';

  return (
    <div className="panel-container">
      <div className="panel-header-row">
        <div>
          <h2 className="panel-title font-title">{t('journal.title')}</h2>
          <p className="panel-subtitle">{t('journal.subtitle')}</p>
        </div>
        <div className="badge badge-amber" style={{ fontSize: '0.85rem' }}>
          {t('journal.caseCompletion')} {progress}%
        </div>
      </div>

      {/* ── Progress Bar ── */}
      <div style={{ padding: '0 0 1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '5px' }}>
          <span style={{ color: 'var(--text-muted)' }}>{t('journal.inspectionProgress')}</span>
          <span style={{ color: 'var(--amber-light)', fontFamily: 'var(--font-mono)' }}>
            {totalClues > 0 ? Math.round((examinedCount / totalClues) * 100) : 0}%
          </span>
        </div>
        <div className="progress-bar-track" style={{ width: '100%', height: '8px' }}>
          <div
            className="progress-bar-fill"
            style={{
              width: `${totalClues > 0 ? (examinedCount / totalClues) * 100 : 0}%`,
              background: progressColor,
              transition: 'width 0.5s ease, background 0.5s ease'
            }}
          />
        </div>
      </div>

      <div className="journal-container">
        {/* ── MAIN COLUMN ── */}
        <div className="journal-main">

          {/* CASE FILE CARD */}
          {caseData && (
            <div
              className="journal-dossier-card"
              style={{
                background: 'rgba(212, 163, 89, 0.05)',
                border: '1px solid rgba(212, 163, 89, 0.25)',
                borderLeft: '3px solid var(--amber-light)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.6rem' }}>
                <span className="badge badge-amber" style={{ fontSize: '0.65rem' }}>📁 {t('journal.caseFileLabel')}</span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  #{caseData.caseId || caseData.seed}
                </span>
              </div>
              <h3
                className="font-title"
                style={{ fontSize: '1.05rem', color: 'var(--text-ivory)', marginBottom: '0.35rem' }}
              >
                {caseData.title || t(`caseThemes.${themeKey}.title`)}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.3rem 1rem', fontSize: '0.75rem', color: '#9d9487' }}>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>📍 </span>
                  {t(`caseThemes.${themeKey}.locationName`)}
                </div>
                <div>
                  <span style={{ color: 'var(--text-muted)' }}>🕐 </span>
                  {t(`caseThemes.${themeKey}.incidentTime`)}
                </div>
                <div style={{ gridColumn: '1 / -1' }}>
                  <span style={{ color: 'var(--text-muted)' }}>👤 {t('journal.reportedBy')}: </span>
                  {t(`caseThemes.${themeKey}.complainant`)}
                </div>
              </div>
            </div>
          )}

          {/* CURRENT OBJECTIVE */}
          <div
            className="journal-dossier-card"
            style={{
              background: 'rgba(63, 161, 169, 0.06)',
              border: '1px solid rgba(63, 161, 169, 0.25)',
              borderLeft: '3px solid #3fa1a9'
            }}
          >
            <h3 className="font-title" style={{ fontSize: '0.9rem', color: '#3fa1a9', marginBottom: '0.4rem' }}>
              🎯 {t('journal.currentObjective')}
            </h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-primary)', margin: 0, lineHeight: 1.5 }}>
              {dynamicObjective}
            </p>
          </div>

          {/* DETECTIVE'S WORKING HYPOTHESIS */}
          <div className="journal-dossier-card">
            <h3 className="font-title" style={{ fontSize: '1.1rem', color: 'var(--text-ivory)' }}>
              {t('journal.hypothesisTitle')}
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#9d9487', marginBottom: '0.5rem' }}>
              {t('journal.hypothesisDesc')}
            </p>
            <textarea
              className="general-notes-area"
              placeholder={t('journal.hypothesisPlaceholder')}
              value={generalNotes}
              onChange={(e) => onUpdateGeneralNotes(e.target.value)}
              style={{
                backgroundImage:
                  'repeating-linear-gradient(transparent, transparent 27px, rgba(212,163,89,0.07) 27px, rgba(212,163,89,0.07) 28px)',
                lineHeight: '28px'
              }}
            />
          </div>

          {/* CLUE NOTES LOG */}
          <div className="journal-dossier-card">
            <h3 className="font-title" style={{ fontSize: '1.1rem', color: 'var(--text-ivory)' }}>
              {t('journal.logTitle')} ({notesCount})
            </h3>
            {Object.keys(clueNotes).filter((id) => clueNotes[id]?.trim()).length === 0 ? (
              <p style={{ fontStyle: 'italic', color: '#7a8699', fontSize: '0.85rem' }}>
                {t('journal.noNotes')}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                {clues
                  .filter((c) => clueNotes[c.id]?.trim())
                  .map((clue) => {
                    const localizedClue = getClueText(clue.id);
                    return (
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
                          <strong style={{ color: 'var(--amber-light)' }}>
                            {localizedClue.name || clue.name || clue.id}
                          </strong>
                          <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>
                            {localizedClue.category
                              ? localizedClue.category.toUpperCase()
                              : (clue.category?.toUpperCase() || 'EVIDENCE')}
                          </span>
                        </div>
                        <p style={{ fontStyle: 'italic', color: 'var(--text-primary)', margin: 0 }}>
                          "{clueNotes[clue.id]}"
                        </p>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* UNRESOLVED QUESTIONS */}
          <div
            className="journal-dossier-card"
            style={{
              background: 'rgba(139, 40, 60, 0.05)',
              border: '1px solid rgba(139, 40, 60, 0.2)',
              borderLeft: '3px solid #d44a6b'
            }}
          >
            <h3 className="font-title" style={{ fontSize: '0.95rem', color: '#ff9fb2', marginBottom: '0.5rem' }}>
              ❓ {t('journal.unresolvedTitle')}
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
              {unresolvedQuestions.map((q, i) => (
                <div
                  key={i}
                  style={{
                    display: 'flex',
                    gap: '0.5rem',
                    fontSize: '0.82rem',
                    color: '#c8beb4',
                    padding: '0.3rem 0',
                    borderBottom:
                      i < unresolvedQuestions.length - 1
                        ? '1px solid rgba(255,255,255,0.05)'
                        : 'none'
                  }}
                >
                  <span style={{ color: '#d44a6b', flexShrink: 0 }}>•</span>
                  <span>{q}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── SIDEBAR ── */}
        <div className="journal-sidebar">
          {/* Investigation Metrics */}
          <div className="journal-dossier-card">
            <h4 className="font-title" style={{ fontSize: '0.95rem', color: 'var(--amber-light)' }}>
              {t('journal.metricsTitle')}
            </h4>
            <div className="journal-stats-grid">
              <div className="stat-box">
                <div className="stat-num">{examinedCount}</div>
                <div className="stat-label">{t('journal.statExamined')}</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">{unexaminedCount}</div>
                <div className="stat-label">{t('journal.statPending')}</div>
              </div>
              <div className="stat-box">
                <div className="stat-num">{poiCount}</div>
                <div className="stat-label">{t('journal.statPois')}</div>
              </div>
            </div>
          </div>

          {/* Persons of Interest */}
          <div className="journal-dossier-card">
            <h4 className="font-title" style={{ fontSize: '0.95rem', color: '#ff9fb2' }}>
              {t('journal.poiTitle')} ({poiCount})
            </h4>
            {poiCount === 0 ? (
              <p style={{ fontSize: '0.8rem', color: '#7a8699', fontStyle: 'italic' }}>
                {t('journal.noPois')}
              </p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {suspects
                  .filter((s) => personsOfInterest.has(s.id))
                  .map((suspect) => {
                    const localizedSuspect = getSuspectText(suspect.id);
                    return (
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
                            {localizedSuspect.name || suspect.name || suspect.id}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                            {localizedSuspect.role || suspect.role}
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => onTogglePOI(suspect.id)}
                          style={{ fontSize: '0.75rem', color: '#ff9fb2' }}
                          title={t('suspectPanel.unmarkPoi')}
                        >
                          ✕
                        </button>
                      </div>
                    );
                  })}
              </div>
            )}
          </div>

          {/* Suspects Quick Reference */}
          <div className="journal-dossier-card">
            <h4
              className="font-title"
              style={{ fontSize: '0.95rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}
            >
              {t('journal.suspectsLabel')} ({suspects.length})
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              {suspects.map((s) => {
                const ls = getSuspectText(s.id);
                const isPoi = personsOfInterest.has(s.id);
                return (
                  <div
                    key={s.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.4rem',
                      padding: '0.3rem 0.5rem',
                      borderRadius: 'var(--radius-sm)',
                      background: isPoi ? 'rgba(139,40,60,0.1)' : 'transparent',
                      fontSize: '0.8rem',
                      color: isPoi ? '#ff9fb2' : 'var(--text-primary)'
                    }}
                  >
                    <span>{isPoi ? '★' : '◦'}</span>
                    <span>{ls.name || s.name || s.id}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
