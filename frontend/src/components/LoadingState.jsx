import React from 'react';

/**
 * LoadingState Component
 * Displays an atmospheric, accessible loading screen during case generation
 */
export default function LoadingState({ message = 'Unsealing confidential case dossier...' }) {
  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <h3 className="loading-title font-title">INVESTIGATION IN PROGRESS</h3>
      <p style={{ color: '#b8afa0', maxWidth: '420px', margin: '0 auto' }}>
        {message}
      </p>
      <span className="badge badge-amber" style={{ marginTop: '0.5rem' }}>
        EXECUTING PROCEDURAL CSP ENGINE
      </span>
    </div>
  );
}
