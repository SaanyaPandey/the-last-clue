import React from 'react';
import { useLanguage } from '../localization/LanguageContext';

/**
 * LoadingState Component
 * Displays an atmospheric, accessible loading screen during case generation
 */
export default function LoadingState({ message }) {
  const { t } = useLanguage();

  return (
    <div className="loading-container" role="status" aria-live="polite">
      <div className="loading-spinner" aria-hidden="true" />
      <h3 className="loading-title font-title">
        {t('feedback.generatingTitle')}
      </h3>
      <p style={{ color: '#b8afa0', maxWidth: '420px', margin: '0 auto' }}>
        {message || t('feedback.generatingDesc')}
      </p>
      <span className="badge badge-amber" style={{ marginTop: '0.5rem' }}>
        {t('feedback.generatingBadge')}
      </span>
    </div>
  );
}
