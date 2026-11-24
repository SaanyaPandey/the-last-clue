import React, { useState } from 'react';
import { submitAccusation } from '../services/caseApi';
import AccusationResult from './AccusationResult';
import { useLanguage } from '../localization/LanguageContext';

/**
 * AccusationModal Component
 * Two-stage formal accusation interface:
 * Stage 1: Suspect selection & deduction rationale
 * Stage 2: Solemn confirmation warning & authoritative server dispatch
 * Stage 3: Official verdict outcome (AccusationResult)
 */
export default function AccusationModal({
  isOpen,
  onClose,
  suspects = [],
  preselectedSuspectId = null,
  caseInstanceId,
  caseId,
  seed,
  onAccusationSubmitted,
  onNewCase
}) {
  const [selectedSuspectId, setSelectedSuspectId] = useState(preselectedSuspectId || (suspects[0]?.id ?? null));
  const [rationale, setRationale] = useState('');
  const [isConfirming, setIsConfirming] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [submissionResult, setSubmissionResult] = useState(null);
  const { t, getSuspectText } = useLanguage();

  if (!isOpen) return null;

  const accusedSuspect = suspects.find((s) => s.id === selectedSuspectId) || suspects[0];
  const localizedAccused = accusedSuspect ? getSuspectText(accusedSuspect.id) : null;

  const handleProceedToConfirm = (e) => {
    e.preventDefault();
    if (!selectedSuspectId) return;
    setErrorMessage(null);
    setIsConfirming(true);
  };

  const handleFinalSubmit = async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);
    setErrorMessage(null);

    const apiResult = await submitAccusation({
      caseInstanceId,
      caseId,
      suspectId: selectedSuspectId,
      rationale: rationale.trim()
    });

    if (apiResult.success && apiResult.data) {
      const record = {
        ...apiResult.data,
        suspect: accusedSuspect,
        rationale: rationale.trim(),
        seed,
        timestamp: new Date().toLocaleTimeString()
      };
      setSubmissionResult(record);
      if (onAccusationSubmitted) {
        onAccusationSubmitted(record);
      }
    } else {
      setErrorMessage(apiResult.error || t('feedback.errorDefault'));
      setIsConfirming(false);
    }

    setIsSubmitting(false);
  };

  const handleResetModal = () => {
    setIsConfirming(false);
    setIsSubmitting(false);
    setErrorMessage(null);
    setSubmissionResult(null);
    onClose();
  };

  return (
    <div
      className="modal-backdrop"
      role="dialog"
      aria-modal="true"
      aria-labelledby="accusation-dialog-title"
      onClick={(e) => {
        if (e.target === e.currentTarget && !submissionResult && !isSubmitting) {
          onClose();
        }
      }}
    >
      <div className="accusation-modal">
        {/* If submission completed, show authoritative server result dossier */}
        {submissionResult ? (
          <AccusationResult
            filingRecord={submissionResult}
            caseInstanceId={caseInstanceId}
            caseId={caseId}
            onClose={handleResetModal}
            onNewCase={() => {
              handleResetModal();
              if (onNewCase) onNewCase();
            }}
          />
        ) : !isConfirming ? (
          /* STAGE 1: SUSPECT SELECTION & STATEMENT */
          <>
            <div className="accusation-header">
              <span className="badge badge-burgundy">{t('accusation.badge')}</span>
              <h3 id="accusation-dialog-title" className="accusation-title font-title">
                {t('accusation.title')}
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#b9a89c', margin: 0 }}>
                {t('accusation.subtitle')}
              </p>
            </div>

            {errorMessage && (
              <div
                role="alert"
                style={{
                  background: 'rgba(139, 40, 60, 0.25)',
                  border: '1px solid var(--burgundy-light)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.65rem 0.85rem',
                  color: '#ffc1cd',
                  fontSize: '0.82rem'
                }}
              >
                <strong>{t('feedback.errorTitle')}:</strong> {errorMessage}
              </div>
            )}

            <form onSubmit={handleProceedToConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>{t('accusation.selectPrompt')}</span>
                </label>
                <div className="suspect-select-list" role="radiogroup" aria-label={t('accusation.selectPrompt')}>
                  {suspects.map((suspect) => {
                    const isSelected = selectedSuspectId === suspect.id;
                    const localizedS = getSuspectText(suspect.id);
                    return (
                      <div
                        key={suspect.id}
                        role="radio"
                        aria-checked={isSelected}
                        tabIndex={0}
                        className={`suspect-option ${isSelected ? 'selected' : ''}`}
                        onClick={() => setSelectedSuspectId(suspect.id)}
                        onKeyDown={(e) => {
                          if (e.key === ' ' || e.key === 'Enter') {
                            setSelectedSuspectId(suspect.id);
                          }
                        }}
                      >
                        <div>
                          <strong style={{ color: isSelected ? '#ff9fb2' : '#f5efe6' }}>
                            {localizedS.name || suspect.name || suspect.id}
                          </strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {localizedS.role || suspect.role}
                          </div>
                        </div>
                        {isSelected && <span style={{ color: '#ff9fb2', fontWeight: 'bold' }}>{t('accusation.selectedBadge')}</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="accusation-rationale" className="form-label">
                  <span>{t('accusation.rationaleLabel')}</span>
                </label>
                <textarea
                  id="accusation-rationale"
                  placeholder={t('accusation.rationalePlaceholder')}
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="clue-notes-input"
                  style={{ minHeight: '64px' }}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  {t('accusation.cancelBtn')}
                </button>
                <button
                  type="submit"
                  className="btn-confirm-accuse"
                  disabled={!selectedSuspectId}
                >
                  {t('accusation.reviewBtn')}
                </button>
              </div>
            </form>
          </>
        ) : (
          /* STAGE 2: SOLEMN CONFIRMATION WARNING */
          <>
            <div className="accusation-header">
              <span className="badge badge-burgundy">{t('accusation.badge')}</span>
              <h3 id="accusation-dialog-title" className="accusation-title font-title">
                {t('accusation.confirmTitle')}
              </h3>
            </div>

            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                {t('accusation.confirmPrompt')}
              </p>
              <h4
                className="font-title"
                style={{
                  color: '#ff9fb2',
                  fontSize: '1.35rem',
                  margin: '0.5rem 0',
                  textShadow: '0 0 12px rgba(255, 159, 178, 0.3)'
                }}
              >
                {localizedAccused?.name || accusedSuspect?.name}
              </h4>
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                {localizedAccused?.role || accusedSuspect?.role}
              </p>

              {rationale.trim() && (
                <div
                  style={{
                    background: 'rgba(10, 13, 18, 0.5)',
                    padding: '0.75rem',
                    borderRadius: 'var(--radius-sm)',
                    margin: '1rem 0 0.5rem',
                    fontSize: '0.82rem',
                    textAlign: 'left',
                    color: '#c9bfb1'
                  }}
                >
                  <strong>{t('accusation.statementRecorded')}</strong>
                  <p style={{ margin: '4px 0 0', fontStyle: 'italic' }}>"{rationale}"</p>
                </div>
              )}
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="btn-cancel"
                onClick={() => setIsConfirming(false)}
                disabled={isSubmitting}
              >
                {t('accusation.backBtn')}
              </button>
              <button
                type="button"
                className="btn-confirm-accuse"
                onClick={handleFinalSubmit}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <span className="loading-spinner" style={{ width: '14px', height: '14px', display: 'inline-block', marginRight: '6px' }} />
                    {t('accusation.verifying')}
                  </>
                ) : (
                  t('accusation.submitBtn')
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
