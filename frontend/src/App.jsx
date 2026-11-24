import React, { useState } from 'react';
import { generateMysteryCase } from './services/caseApi';
import HomePage from './pages/HomePage';
import InvestigationPage from './pages/InvestigationPage';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import ErrorBoundary from './components/ErrorBoundary';
import DetectiveCursor from './components/DetectiveCursor';
import { LanguageProvider, useLanguage } from './localization/LanguageContext';
import { ControlsProvider } from './context/ControlsContext';
import './styles/global.css';
import './styles/game.css';

/**
 * Inner Application Shell
 * Has access to LanguageContext.
 */
function MainApp() {
  const { t } = useLanguage();
  const [activeCase, setActiveCase] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastParams, setLastParams] = useState({ difficulty: 'medium' });

  // Handles requesting a new mystery case from backend API
  const handleStartInvestigation = async ({ difficulty = 'medium', seed, theme } = {}) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setLastParams({ difficulty, seed, theme });

    const result = await generateMysteryCase({ difficulty, seed, theme });

    if (result.success && result.data) {
      setActiveCase({
        ...result.data,
        theme: theme || result.data.theme
      });
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error || t('feedback.errorDefault'));
      setActiveCase(null);
    }

    setIsGenerating(false);
  };

  // Re-generate a case using the same difficulty or quick new case
  const handleNewCase = () => {
    handleStartInvestigation(lastParams);
  };

  // Return to start menu and reset current case
  const handleReturnToMenu = () => {
    setActiveCase(null);
    setErrorMessage(null);
  };

  return (
    <div className="app-root">
      <DetectiveCursor />
      <ErrorBoundary onReset={handleReturnToMenu}>
        {isGenerating ? (
          <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <LoadingState />
          </div>
        ) : errorMessage && !activeCase ? (
          <div className="main-content">
            <ErrorState
              error={errorMessage}
              onRetry={() => handleStartInvestigation(lastParams)}
              onReset={handleReturnToMenu}
            />
          </div>
        ) : activeCase ? (
          <InvestigationPage
            caseData={activeCase}
            onNewCase={handleNewCase}
            onReturnToMenu={handleReturnToMenu}
          />
        ) : (
          <HomePage
            onStartInvestigation={handleStartInvestigation}
            loading={isGenerating}
            error={errorMessage}
          />
        )}
      </ErrorBoundary>
    </div>
  );
}

/**
 * Root Application Component
 * Encloses the entire application tree inside LanguageProvider.
 */
export default function App() {
  return (
    <LanguageProvider>
      <ControlsProvider>
        <MainApp />
      </ControlsProvider>
    </LanguageProvider>


  );
}
