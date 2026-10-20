import React from 'react';

/**
 * ErrorState Component
 * Displays user-friendly error messages without leaking stack traces
 */
export default function ErrorState({ error, onRetry, onReset }) {
  return (
    <div className="error-container" role="alert" aria-live="assertive">
      <div className="badge badge-burgundy" style={{ alignSelf: 'center' }}>
        DISPATCH ERROR
      </div>
      <h3 className="error-title font-title">UNABLE TO RETRIEVE DOSSIER</h3>
      <p style={{ color: '#d8c5c5' }}>
        {error || 'An unexpected communication error occurred with the investigation server.'}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        {onRetry && (
          <button type="button" className="btn-retry" onClick={onRetry}>
            Retry Request
          </button>
        )}
        {onReset && (
          <button
            type="button"
            className="btn-retry"
            style={{ borderColor: '#45556c', color: '#b5c5da' }}
            onClick={onReset}
          >
            Return to Menu
          </button>
        )}
      </div>
    </div>
  );
}
