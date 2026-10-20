import React from 'react';
import LandingPage from '../components/LandingPage';

/**
 * HomePage Component
 * Hosts the cinematic noir LandingPage and active case generation launcher.
 */
export default function HomePage({ onStartInvestigation, loading = false, error = null }) {
  return (
    <LandingPage
      onStartInvestigation={onStartInvestigation}
      loading={loading}
      error={error}
    />
  );
}
