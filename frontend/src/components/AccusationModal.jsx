import React, { useState } from 'react';
import { submitAccusation } from '../services/caseApi';
import AccusationResult from './AccusationResult';

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

  if (!isOpen) return null;

  const accusedSuspect = suspects.find((s) => s.id === selectedSuspectId) || suspects[0];

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
      setErrorMessage(apiResult.error || 'Failed to submit accusation to judicial dispatch.');
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
              <span className="badge badge-burgundy">JUDICIAL PROCEEDINGS</span>
              <h3 id="accusation-dialog-title" className="accusation-title font-title">
                FILE OFFICIAL ACCUSATION
              </h3>
              <p style={{ fontSize: '0.82rem', color: '#b9a89c', margin: 0 }}>
                Designate the individual you deduce is solely culpable under the forensic constraints.
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
                <strong>Dispatch Error:</strong> {errorMessage}
              </div>
            )}

            <form onSubmit={handleProceedToConfirm} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label className="form-label">
                  <span>Designate Culprit from Suspect Pool</span>
                </label>
                <div className="suspect-select-list" role="radiogroup" aria-label="Select suspect to accuse">
                  {suspects.map((suspect) => {
                    const isSelected = selectedSuspectId === suspect.id;
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
                            {suspect.name || suspect.id}
                          </strong>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                            {suspect.role}
                          </div>
                        </div>
                        {isSelected && <span style={{ color: '#ff9fb2', fontWeight: 'bold' }}>✓ SELECTED</span>}
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="accusation-rationale" className="form-label">
                  <span>Indictment Rationale (Optional)</span>
                </label>
                <textarea
                  id="accusation-rationale"
                  placeholder="Detail the evidence chain linking this suspect to the crime scene..."
                  value={rationale}
                  onChange={(e) => setRationale(e.target.value)}
                  className="clue-notes-input"
                  style={{ minHeight: '64px' }}
                />
              </div>

              <div className="modal-actions">
                <button type="button" className="btn-cancel" onClick={onClose}>
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn-confirm-accuse"
                  disabled={!selectedSuspectId}
                >
                  Review Accusation →
                </button>
              </div>
            </form>
          </>
        ) : (
          /* STAGE 2: SOLEMN CONFIRMATION WARNING */
          <>
            <div className="accusation-header">
              <span className="badge badge-burgundy">CONFIRMATION OF INDICTMENT</span>
              <h3 id="accusation-dialog-title" className="accusation-title font-title">
                CONFIRM CHARGES
              </h3>
            </div>

            <div style={{ textAlign: 'center', padding: '0.5rem 0' }}>
              <p style={{ color: 'var(--text-primary)', fontSize: '0.95rem' }}>
                You are about to submit formal murder charges against:
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
                {accusedSuspect?.name}
              </h4>
              <p style={{ fontStyle: 'italic', color: 'var(--text-secondary)', fontSize: '0.85rem' }}>
                Role: {accusedSuspect?.role}
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
                  <strong>Statement of Accusation:</strong>
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
                ← Back
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
                    Verifying with Scotland Yard...
                  </>
                ) : (
                  'Confirm & Submit to Inspector'
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
