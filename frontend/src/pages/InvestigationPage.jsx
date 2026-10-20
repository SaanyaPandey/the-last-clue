import React, { useState, useMemo, useEffect } from 'react';
import CaseHeader from '../components/CaseHeader';
import EvidenceBoard from '../components/EvidenceBoard';
import CluePanel from '../components/CluePanel';
import SuspectPanel from '../components/SuspectPanel';
import LocationPanel from '../components/LocationPanel';
import InvestigationJournal from '../components/InvestigationJournal';
import AccusationModal from '../components/AccusationModal';
import PlayableMysteryGame from '../game/PlayableMysteryGame';

/**
 * InvestigationPage Component
 * Primary detective investigation workspace.
 * Centers the experience directly inside the playable 2.5D Crime Scene (Drawing Room),
 * with contextual access to the Evidence Board, Suspects, Journal, and Accusation tools.
 */
export default function InvestigationPage({
  caseData,
  onNewCase,
  onReturnToMenu
}) {
  // 'scene' is the primary default playable room view; other views open as contextual dossiers
  const [activeTab, setActiveTab] = useState('scene'); // 'scene' | 'board' | 'clues' | 'suspects' | 'locations' | 'journal'
  const [examinedClueIds, setExaminedClueIds] = useState(new Set());
  const [personsOfInterest, setPersonsOfInterest] = useState(new Set());
  const [clueNotes, setClueNotes] = useState({});
  const [generalNotes, setGeneralNotes] = useState('');
  const [selectedNodeId, setSelectedNodeId] = useState(null);
  const [isAccusationOpen, setIsAccusationOpen] = useState(false);
  const [preselectedSuspectId, setPreselectedSuspectId] = useState(null);
  const [submittedAccusation, setSubmittedAccusation] = useState(null);

  const clues = caseData?.clues || [];
  const suspects = caseData?.suspects || [];
  const locations = caseData?.locations || [];
  const weapons = caseData?.weapons || [];
  const motives = caseData?.motives || [];
  const graph = caseData?.graph || { nodes: [], edges: [] };
  const startingClueId = caseData?.startingClueId;

  // Lookup maps
  const locationsMap = useMemo(() => new Map(locations.map((l) => [l.id, l])), [locations]);
  const weaponsMap = useMemo(() => new Map(weapons.map((w) => [w.id, w])), [weapons]);
  const motivesMap = useMemo(() => new Map(motives.map((m) => [m.id, m])), [motives]);

  // Derive real investigation progress (0 - 100%)
  const progress = useMemo(() => {
    if (clues.length === 0) return 0;
    // 60% based on proportion of clues examined
    const clueWeight = (examinedClueIds.size / clues.length) * 60;
    // 20% based on marking at least one person of interest
    const poiWeight = personsOfInterest.size > 0 ? Math.min(20, personsOfInterest.size * 10) : 0;
    // 20% based on taking notes
    const notesCount = Object.values(clueNotes).filter((n) => n.trim().length > 0).length + (generalNotes.trim() ? 1 : 0);
    const notesWeight = notesCount > 0 ? Math.min(20, notesCount * 10) : 0;

    return Math.min(100, Math.round(clueWeight + poiWeight + notesWeight));
  }, [clues.length, examinedClueIds.size, personsOfInterest.size, clueNotes, generalNotes]);

  // Toggle clue examined
  const handleToggleExamined = (clueId) => {
    setExaminedClueIds((prev) => {
      const next = new Set(prev);
      if (next.has(clueId)) {
        next.delete(clueId);
      } else {
        next.add(clueId);
      }
      return next;
    });
  };

  // Toggle suspect as Person of Interest
  const handleTogglePOI = (suspectId) => {
    setPersonsOfInterest((prev) => {
      const next = new Set(prev);
      if (next.has(suspectId)) {
        next.delete(suspectId);
      } else {
        next.add(suspectId);
      }
      return next;
    });
  };

  // Update clue note
  const handleUpdateClueNote = (clueId, noteText) => {
    setClueNotes((prev) => ({
      ...prev,
      [clueId]: noteText
    }));
  };

  // Open graph and select node
  const handleSelectGraphNode = (nodeId) => {
    setSelectedNodeId(nodeId);
    setActiveTab('board');
  };

  // Initiate direct accusation on a specific suspect
  const handleInitiateAccusation = (suspectId = null) => {
    setPreselectedSuspectId(suspectId);
    setIsAccusationOpen(true);
  };

  // Return to crime scene room when pressing Esc outside the scene
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'Escape' && activeTab !== 'scene') {
        e.preventDefault();
        setActiveTab('scene');
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeTab]);

  return (
    <div className="investigation-app">
      {/* Top Dossier Bar */}
      <CaseHeader
        caseData={caseData}
        progress={progress}
        onNewCase={onNewCase}
        onReturnToMenu={onReturnToMenu}
        onOpenAccusation={() => handleInitiateAccusation(null)}
      />

      {/* Investigation Navigation Tabs */}
      <nav className="investigation-nav" aria-label="Investigation dossier sections">
        <div className="nav-tabs-container">
          <button
            type="button"
            className={`nav-tab ${activeTab === 'scene' ? 'active' : ''}`}
            onClick={() => setActiveTab('scene')}
          >
            <span>🕵️ Crime Scene Room</span>
            <span className="badge badge-amber font-mono" style={{ fontSize: '0.65rem' }}>PLAYABLE</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'board' ? 'active' : ''}`}
            onClick={() => setActiveTab('board')}
          >
            <span>🕸️ Evidence Board</span>
            <span className="nav-counter">{graph.nodes.length}</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'clues' ? 'active' : ''}`}
            onClick={() => setActiveTab('clues')}
          >
            <span>🔍 Forensic Clues</span>
            <span className="nav-counter">
              {examinedClueIds.size}/{clues.length}
            </span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'suspects' ? 'active' : ''}`}
            onClick={() => setActiveTab('suspects')}
          >
            <span>👤 Suspect Profiles</span>
            <span className="nav-counter">{suspects.length}</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'locations' ? 'active' : ''}`}
            onClick={() => setActiveTab('locations')}
          >
            <span>🏛️ Estate & Weapons</span>
            <span className="nav-counter">{locations.length + weapons.length}</span>
          </button>

          <button
            type="button"
            className={`nav-tab ${activeTab === 'journal' ? 'active' : ''}`}
            onClick={() => setActiveTab('journal')}
          >
            <span>📖 Detective Journal</span>
            <span className="nav-counter">{progress}%</span>
          </button>
        </div>
      </nav>

      {/* Main Workspace Panels */}
      <main className="main-content" style={{ padding: activeTab === 'scene' ? '0.5rem 1rem 2rem' : undefined }}>
        {/* 1. PLAYABLE 2.5D CRIME SCENE (Default & Core Experience) */}
        {activeTab === 'scene' && (
          <PlayableMysteryGame
            caseData={caseData}
            examinedClueIds={examinedClueIds}
            onToggleExamined={handleToggleExamined}
            onOpenJournal={() => setActiveTab('journal')}
            onOpenBoard={() => setActiveTab('board')}
            onOpenSuspects={() => setActiveTab('suspects')}
            onOpenAccusation={() => handleInitiateAccusation(null)}
            progressPercentage={progress}
          />
        )}

        {/* 2. CONTEXTUAL DOSSIER OVERLAYS */}
        {activeTab !== 'scene' && (
          <div className="dossier-overlay-container">
            <div className="dossier-return-banner">
              <button
                type="button"
                className="btn-return-scene"
                onClick={() => setActiveTab('scene')}
              >
                ◀ Return to Crime Scene Room [Esc]
              </button>
              <span className="dossier-hint font-mono">
                PRESS [ESC] OR CLICK TO RETURN TO SPATIAL EXPLORATION
              </span>
            </div>

            {activeTab === 'board' && (
              <EvidenceBoard
                graph={graph}
                startingClueId={startingClueId}
                selectedNodeId={selectedNodeId}
                onSelectNode={setSelectedNodeId}
              />
            )}

            {activeTab === 'clues' && (
              <CluePanel
                clues={clues}
                startingClueId={startingClueId}
                examinedClueIds={examinedClueIds}
                onToggleExamined={handleToggleExamined}
                clueNotes={clueNotes}
                onUpdateClueNote={handleUpdateClueNote}
                onSelectGraphNode={handleSelectGraphNode}
              />
            )}

            {activeTab === 'suspects' && (
              <SuspectPanel
                suspects={suspects}
                personsOfInterest={personsOfInterest}
                onTogglePOI={handleTogglePOI}
                onInitiateAccusation={handleInitiateAccusation}
                onSelectGraphNode={handleSelectGraphNode}
                locationsMap={locationsMap}
                weaponsMap={weaponsMap}
                motivesMap={motivesMap}
              />
            )}

            {activeTab === 'locations' && (
              <LocationPanel
                locations={locations}
                weapons={weapons}
                motives={motives}
                onSelectGraphNode={handleSelectGraphNode}
              />
            )}

            {activeTab === 'journal' && (
              <InvestigationJournal
                clues={clues}
                suspects={suspects}
                examinedClueIds={examinedClueIds}
                personsOfInterest={personsOfInterest}
                clueNotes={clueNotes}
                generalNotes={generalNotes}
                onUpdateGeneralNotes={setGeneralNotes}
                onToggleExamined={handleToggleExamined}
                onTogglePOI={handleTogglePOI}
                progress={progress}
              />
            )}
          </div>
        )}
      </main>

      {/* Authoritative Accusation Modal */}
      <AccusationModal
        isOpen={isAccusationOpen}
        onClose={() => setIsAccusationOpen(false)}
        suspects={suspects}
        preselectedSuspectId={preselectedSuspectId}
        caseInstanceId={caseData?.caseInstanceId}
        caseId={caseData?.caseId}
        seed={caseData?.seed}
        onAccusationSubmitted={(record) => setSubmittedAccusation(record)}
        onNewCase={onNewCase}
      />
    </div>
  );
}
