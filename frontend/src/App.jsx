import React, { useState } from 'react';
import { generateMysteryCase } from './services/caseApi';
import HomePage from './pages/HomePage';
import InvestigationPage from './pages/InvestigationPage';
import LoadingState from './components/LoadingState';
import ErrorState from './components/ErrorState';
import ErrorBoundary from './components/ErrorBoundary';
import DetectiveCursor from './components/DetectiveCursor';
import './styles/global.css';
import './styles/game.css';

/**
 * Main Application Shell
 * Controls top-level navigation between the Case File Archive (HomePage),
 * procedural generation (LoadingState), and Active Investigation (InvestigationPage).
 */
function App() {
  const [activeCase, setActiveCase] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const [lastParams, setLastParams] = useState({ difficulty: 'medium' });

  // Handles requesting a new mystery case from backend API
  const handleStartInvestigation = async ({ difficulty = 'medium', seed } = {}) => {
    if (isGenerating) return;

    setIsGenerating(true);
    setErrorMessage(null);
    setLastParams({ difficulty, seed });

    const result = await generateMysteryCase({ difficulty, seed });

    if (result.success && result.data) {
      setActiveCase(result.data);
      setErrorMessage(null);
    } else {
      setErrorMessage(result.error || 'Failed to generate mystery case.');
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

  // Render appropriate view
  return (
    <div className="app-root">
      <DetectiveCursor />
      <ErrorBoundary onReset={handleReturnToMenu}>
        {isGenerating ? (
          <div className="main-content" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
            <LoadingState message="Formulating crime scene graph, generating forensic leads, and verifying unique solvability..." />
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

export default App;
