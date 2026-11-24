import React from 'react';
import { useLanguage } from '../localization/LanguageContext';

/**
 * ErrorState Component
 * Displays user-friendly error messages without leaking stack traces
 */
export default function ErrorState({ error, onRetry, onReset }) {
  const { t } = useLanguage();

  return (
    <div className="error-container" role="alert" aria-live="assertive">
      <div className="badge badge-burgundy" style={{ alignSelf: 'center' }}>
        {t('feedback.errorTitle')}
      </div>
      <h3 className="error-title font-title">
        {t('feedback.errorTitle')}
      </h3>
      <p style={{ color: '#d8c5c5' }}>
        {error || t('feedback.errorDefault')}
      </p>
      <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', marginTop: '0.5rem' }}>
        {onRetry && (
          <button type="button" className="btn-retry" onClick={onRetry}>
            {t('feedback.retryBtn')}
          </button>
        )}
        {onReset && (
          <button
            type="button"
            className="btn-retry"
            style={{ borderColor: '#45556c', color: '#b5c5da' }}
            onClick={onReset}
          >
            {t('feedback.returnMenuBtn')}
          </button>
        )}
      </div>
    </div>
  );
}
