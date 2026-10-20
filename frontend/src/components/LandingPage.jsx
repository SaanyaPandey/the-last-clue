import React, { useState } from 'react';
import StartScreen from './StartScreen';

/**
 * LandingPage Component
 * Premium cinematic noir entrance featuring:
 * 1. Classified Scotland Yard top navigation
 * 2. Dramatic hero section ("EVERY CLUE LEAVES A TRACE.")
 * 3. 3-Step "How to Play" field methodology
 * 4. Case Experience & Evidence Board preview
 * 5. Direct launch into live procedural case generation
 * 6. Atmospheric detective footer
 */
export default function LandingPage({ onStartInvestigation, loading = false, error = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="noir-landing">
      {/* 1. TOP NAVIGATION */}
      <header className="noir-nav-header">
        <div className="noir-nav-container">
          <div className="noir-logo-group" onClick={() => scrollToSection('hero')}>
            <span className="noir-logo-stamp">CLASSIFIED</span>
            <span className="noir-logo-title font-title">THE LAST CLUE</span>
          </div>

          {/* Desktop Nav Links */}
          <nav className="noir-nav-links" aria-label="Main Navigation">
            <button
              type="button"
              className="noir-nav-link"
              onClick={() => scrollToSection('how-to-play')}
            >
              How to Play
            </button>
            <button
              type="button"
              className="noir-nav-link"
              onClick={() => scrollToSection('experience')}
            >
              The Experience
            </button>
            <button
              type="button"
              className="noir-nav-link"
              onClick={() => scrollToSection('rules')}
            >
              Methodology
            </button>
            <button
              type="button"
              className="noir-nav-cta"
              onClick={() => scrollToSection('case-launch')}
            >
              Begin Case →
            </button>
          </nav>

          {/* Mobile Menu Toggle Button */}
          <button
            type="button"
            className="noir-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="noir-mobile-dropdown">
            <button
              type="button"
              className="noir-mobile-link"
              onClick={() => scrollToSection('how-to-play')}
            >
              How to Play
            </button>
            <button
              type="button"
              className="noir-mobile-link"
              onClick={() => scrollToSection('experience')}
            >
              The Experience
            </button>
            <button
              type="button"
              className="noir-mobile-link"
              onClick={() => scrollToSection('rules')}
            >
              Methodology
            </button>
            <button
              type="button"
              className="noir-nav-cta"
              style={{ width: '100%', textAlign: 'center', marginTop: '0.5rem' }}
              onClick={() => scrollToSection('case-launch')}
            >
              Begin Case →
            </button>
          </div>
        )}
      </header>

      {/* 2. CINEMATIC HERO SECTION */}
      <section id="hero" className="noir-hero-section">
        <div className="noir-hero-spotlight" aria-hidden="true" />
        <div className="noir-hero-content">
          <div className="noir-hero-meta">
            <span className="badge badge-burgundy">CASE FILE #4092-B</span>
            <span className="badge badge-slate">SCOTLAND YARD ARCHIVE</span>
            <span className="badge badge-amber">100% PROCEDURAL DSA</span>
          </div>

          <h1 className="noir-hero-headline font-title">
            EVERY CLUE LEAVES A TRACE.
          </h1>

          <p className="noir-hero-subhead">
            Midnight at Blackwood Manor. A wealthy benefactor lies dead under suspicious circumstances.
            Forensic traces are scattered across the estate, and every suspect harbors a secret.
            Examine physical evidence, reconstruct the graph of interconnected relationships,
            and expose the single true culprit through pure deductive reasoning.
          </p>

          <div className="noir-hero-actions">
            <button
              type="button"
              className="noir-btn-primary"
              onClick={() => scrollToSection('case-launch')}
            >
              <span>🔎 BEGIN INVESTIGATION</span>
            </button>
            <button
              type="button"
              className="noir-btn-secondary"
              onClick={() => scrollToSection('how-to-play')}
            >
              <span>FIELD METHODOLOGY</span>
            </button>
          </div>

          {/* Engine Highlights */}
          <div className="noir-hero-specs">
            <div className="spec-card">
              <span className="spec-val font-mono">CSP ENGINE</span>
              <span className="spec-desc">Constraint satisfaction solver guarantees plausible criminal alibis</span>
            </div>
            <div className="spec-card">
              <span className="spec-val font-mono">BFS / DFS</span>
              <span className="spec-desc">Algorithmic traversal validates evidence path reachability</span>
            </div>
            <div className="spec-card">
              <span className="spec-val font-mono">ZERO AI / LLMs</span>
              <span className="spec-desc">Deterministic Mulberry32 PRNG ensures 100% reproducible mysteries</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW TO PLAY SECTION */}
      <section id="how-to-play" className="noir-section">
        <div className="section-header-block">
          <span className="badge badge-amber">INVESTIGATIVE PROTOCOL</span>
          <h2 className="section-title font-title">THREE STEPS TO SOLVING THE CRIME</h2>
          <p className="section-subtext">
            Standard police methodology for analyzing procedurally generated crime scenes.
          </p>
        </div>

        <div className="methodology-grid">
          <div className="methodology-card">
            <div className="methodology-num font-mono">01</div>
            <h3 className="methodology-heading font-title">Examine the Clues</h3>
            <p className="methodology-text">
              Inspect physical artifacts, torn blackmail letters, chemical goblets, and chronological timestamps.
              Every generated mystery begins from a verified initial lead connected to the crime scene.
            </p>
            <div className="methodology-tag">FORENSIC ARTIFACTS</div>
          </div>

          <div className="methodology-card">
            <div className="methodology-num font-mono">02</div>
            <h3 className="methodology-heading font-title">Connect the Evidence</h3>
            <p className="methodology-text">
              Traverse the interactive Evidence Board. Examine how suspects link to accessible rooms,
              affiliated implements, and circumstantial motives. Discard plausible red herrings.
            </p>
            <div className="methodology-tag">GRAPH REASONING</div>
          </div>

          <div className="methodology-card">
            <div className="methodology-num font-mono">03</div>
            <h3 className="methodology-heading font-title">Identify the Culprit</h3>
            <p className="methodology-text">
              Formulate your indictment with an official detective statement. Submit your charge to
              Scotland Yard for authoritative server-side verdict verification.
            </p>
            <div className="methodology-tag">JUDICIAL VERDICT</div>
          </div>
        </div>
      </section>

      {/* 4. CASE EXPERIENCE & PREVIEW */}
      <section id="experience" className="noir-section noir-preview-section">
        <div className="section-header-block">
          <span className="badge badge-teal">SYSTEM OVERVIEW</span>
          <h2 className="section-title font-title">THE DETECTIVE'S WORKSPACE</h2>
          <p className="section-subtext">
            A cohesive suite of investigation tools built directly on mathematical graph algorithms.
          </p>
        </div>

        <div className="preview-display">
          <div className="preview-terminal-header">
            <div className="terminal-dots">
              <span className="dot red" />
              <span className="dot yellow" />
              <span className="dot green" />
            </div>
            <span className="terminal-title font-mono">THE_LAST_CLUE // EVIDENCE_BOARD_MODULE</span>
            <span className="badge badge-slate" style={{ fontSize: '0.65rem' }}>SYSTEM: ACTIVE</span>
          </div>

          <div className="preview-terminal-body">
            <div className="preview-panel">
              <span className="preview-badge">PROCEDURAL ADJACENCY GRAPH</span>
              <h4 className="font-title" style={{ color: 'var(--amber-light)', fontSize: '1.1rem', margin: '0.4rem 0' }}>
                Relational Evidence Network
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#a69f93', lineHeight: 1.6 }}>
                Every case builds a genuine Adjacency-List graph connecting suspects, Manor rooms,
                murder weapons, and forensic traces. Inspect incoming and outgoing links directly
                on the board or through the accessible Connection Index.
              </p>
              <ul className="preview-feature-list">
                <li>✦ <strong>Multi-layered Nodes:</strong> Distinct color tokens for suspects, clues, rooms, and weapons</li>
                <li>✦ <strong>Directed & Undirected Relations:</strong> Points-to, found-at, affiliated-with, motivated-by</li>
                <li>✦ <strong>Dynamic Inspector:</strong> Highlight incident edges and neighbor subgraphs on demand</li>
              </ul>
            </div>

            <div className="preview-panel">
              <span className="preview-badge" style={{ borderColor: 'var(--burgundy-light)', color: '#f78da7' }}>
                INTELLIGENCE REGISTRY
              </span>
              <h4 className="font-title" style={{ color: '#ff9fb2', fontSize: '1.1rem', margin: '0.4rem 0' }}>
                Suspect Profiles & Journal
              </h4>
              <p style={{ fontSize: '0.85rem', color: '#a69f93', lineHeight: 1.6 }}>
                Review behavioral traits, access histories, and motive theories. Flag Persons of Interest (POIs)
                and track honest investigation progress based on examined leads and field observations.
              </p>
              <ul className="preview-feature-list">
                <li>✦ <strong>Person of Interest (POI) Flags:</strong> Direct suspect tracking without marking guilt</li>
                <li>✦ <strong>Deductions Journal:</strong> Working hypothesis notepad and recorded field log</li>
                <li>✦ <strong>Sealed Solution Privacy:</strong> Authoritative server validation with zero client leaks</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* 5. METHODOLOGY & RULES */}
      <section id="rules" className="noir-section">
        <div className="section-header-block">
          <span className="badge badge-burgundy">FORENSIC RIGOR</span>
          <h2 className="section-title font-title">CONSTRAINT & COMPLEXITY TIERS</h2>
          <p className="section-subtext">
            How procedural parameters scale the investigative difficulty.
          </p>
        </div>

        <div className="complexity-grid">
          <div className="complexity-card">
            <div className="complexity-badge">EASY DOSSIER</div>
            <h3 className="font-title" style={{ fontSize: '1.2rem', color: '#72cbcf' }}>3 Suspects • 3 Clues</h3>
            <p style={{ fontSize: '0.85rem', color: '#aba191' }}>
              A concise murder inquiry with 1 red herring. Ideal for familiarizing yourself with forensic
              clue examination and direct evidence chains.
            </p>
          </div>

          <div className="complexity-card featured">
            <div className="complexity-badge" style={{ color: 'var(--amber-light)', borderColor: 'var(--amber-primary)' }}>
              STANDARD DOSSIER
            </div>
            <h3 className="font-title" style={{ fontSize: '1.2rem', color: 'var(--amber-light)' }}>4 Suspects • 4 Clues</h3>
            <p style={{ fontSize: '0.85rem', color: '#aba191' }}>
              The standard Scotland Yard inquiry with 2 plausible red herrings. Demands careful scrutiny
              of conflicting alibis and estate room access.
            </p>
          </div>

          <div className="complexity-card">
            <div className="complexity-badge" style={{ color: '#ff9fb2', borderColor: 'var(--burgundy-light)' }}>
              COMPLEX DOSSIER
            </div>
            <h3 className="font-title" style={{ fontSize: '1.2rem', color: '#ff9fb2' }}>5 Suspects • 6 Clues</h3>
            <p style={{ fontSize: '0.85rem', color: '#aba191' }}>
              An intricate web featuring 3 red herrings and deep branching relationships. Only a rigorous
              forensic deduction will pinpoint the sole culprit.
            </p>
          </div>
        </div>
      </section>

      {/* 6. LIVE CASE LAUNCH & DISPATCH */}
      <section id="case-launch" className="noir-section noir-dispatch-section">
        <div className="section-header-block" style={{ marginBottom: '1.5rem' }}>
          <span className="badge badge-amber">DISPATCH TERMINAL</span>
          <h2 className="section-title font-title">OPEN CONFIDENTIAL CASE FILE</h2>
          <p className="section-subtext">
            Configure your investigation parameters below to generate a live procedural case.
          </p>
        </div>

        {/* Embedded Live StartScreen Form */}
        <StartScreen
          onStartInvestigation={onStartInvestigation}
          loading={loading}
          error={error}
        />
      </section>

      {/* 7. FOOTER */}
      <footer className="noir-footer">
        <div className="noir-footer-inner">
          <div className="noir-footer-brand">
            <span className="font-title" style={{ fontSize: '1.15rem', color: 'var(--amber-light)' }}>
              THE LAST CLUE
            </span>
            <p style={{ fontSize: '0.8rem', color: '#8a8275', margin: '4px 0 0' }}>
              "Every mystery has an answer. Every answer leaves a trace."
            </p>
          </div>

          <div className="noir-footer-meta">
            <span style={{ fontSize: '0.75rem', color: '#687282', fontFamily: 'var(--font-mono)' }}>
              PURE PROCEDURAL DSA • NO THIRD-PARTY AI • DETERMINISTIC PRNG
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
