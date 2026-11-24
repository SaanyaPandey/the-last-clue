import React, { useState } from 'react';
import StartScreen from './StartScreen';
import LanguageSelector from './LanguageSelector';
import DetectiveWorldCanvas from './DetectiveWorldCanvas';
import { useLanguage } from '../localization/LanguageContext';
import { soundEngine } from '../game/SoundEngine';

/**
 * LandingPage Component
 * Completely redesigned narrative detective adventure entrance.
 * Features:
 * 1. Living Animated Detective World on the right:
 *    - Victorian old-town street & manor exterior at night
 *    - Human-like detective walking with natural gait, fedora, and glowing lantern
 *    - Silhouettes moving behind warm glowing arched windows
 *    - Flickering gas streetlamp with volumetric light cone
 *    - Drifting fog ribbons, raindrops, and wet cobblestone puddle reflections
 *    - Interactive magnifying glass that reveals a hidden clue on hover
 * 2. Dramatic narrative headline & typography on the left:
 *    - "EVERY CLUE LEAVES A TRACE."
 *    - "Har raaz ke peeche ek kahani hai. Kya tum sach tak pahunch sakte ho?"
 *    - Prominent tactile "Start Investigating" button and "Discover the Mystery" link
 * 3. Scotland Yard Field Notebook & Live Case Dispatch Console
 * 4. Rich handcrafted palette: deep burgundy, dark walnut, antique brass, and aged parchment
 */
export default function LandingPage({ onStartInvestigation, loading = false, error = null }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [secretClueDiscovered, setSecretClueDiscovered] = useState(false);
  const { t } = useLanguage();

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleQuickStart = () => {
    soundEngine.playInspect();
    onStartInvestigation({ difficulty: 'medium' });
  };

  const handleClueDiscovered = () => {
    setSecretClueDiscovered(true);
  };

  return (
    <div className="adventure-landing">
      {/* 1. TOP VICTORIAN NAVIGATION */}
      <header className="adventure-nav-header">
        <div className="adventure-nav-container">
          <div className="adventure-logo-group" onClick={() => scrollToSection('hero')}>
            <span className="scotland-yard-seal font-mono">SCOTLAND YARD • CASE 4092-B</span>
            <span className="adventure-logo-title font-title">{t('app.title')}</span>
          </div>

          {/* Desktop Nav Controls */}
          <nav className="adventure-nav-links" aria-label="Main Navigation">
            <button
              type="button"
              className="adventure-nav-link"
              onClick={() => scrollToSection('casebook')}
            >
              {t('nav.howToPlay')}
            </button>
            <button
              type="button"
              className="adventure-nav-link"
              onClick={() => scrollToSection('experience')}
            >
              {t('nav.experience')}
            </button>
            <button
              type="button"
              className="adventure-nav-link"
              onClick={() => scrollToSection('case-dispatch')}
            >
              {t('nav.methodology')}
            </button>

            {/* Language Switcher */}
            <LanguageSelector variant="compact" />

            {/* Direct Header Action */}
            <button
              type="button"
              className="adventure-nav-cta font-mono"
              onClick={handleQuickStart}
              disabled={loading}
            >
              {t('hero.startInvestigating') || t('hero.beginBtn')}
            </button>
          </nav>

          {/* Mobile Menu Button */}
          <button
            type="button"
            className="adventure-mobile-toggle"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-expanded={mobileMenuOpen}
            aria-label="Toggle Navigation Menu"
          >
            {mobileMenuOpen ? '✕' : '☰'}
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="adventure-mobile-dropdown animate-fade-in">
            <div style={{ padding: '0.6rem 0.8rem', borderBottom: '1px solid rgba(212,163,89,0.15)' }}>
              <LanguageSelector variant="segmented" />
            </div>
            <button
              type="button"
              className="adventure-mobile-link"
              onClick={() => scrollToSection('casebook')}
            >
              {t('nav.howToPlay')}
            </button>
            <button
              type="button"
              className="adventure-mobile-link"
              onClick={() => scrollToSection('experience')}
            >
              {t('nav.experience')}
            </button>
            <button
              type="button"
              className="adventure-mobile-link"
              onClick={() => scrollToSection('case-dispatch')}
            >
              {t('nav.methodology')}
            </button>
            <button
              type="button"
              className="adventure-nav-cta font-mono"
              style={{ width: '100%', textAlign: 'center', margin: '0.8rem 0 0.4rem' }}
              onClick={handleQuickStart}
              disabled={loading}
            >
              {t('hero.startInvestigating') || t('hero.beginBtn')}
            </button>
          </div>
        )}
      </header>

      {/* 2. SPLIT-SCREEN ANIMATED DETECTIVE HERO */}
      <section id="hero" className="adventure-hero-section">
        {/* Subtle Ambient Fog & Vignette Overlays */}
        <div className="adventure-hero-vignette" aria-hidden="true" />
        <div className="adventure-ambient-glow" aria-hidden="true" />

        <div className="adventure-hero-split-layout">
          {/* LEFT COLUMN: Narrative Typography & Actions */}
          <div className="adventure-hero-left">
            <div className="hero-case-stamp font-mono">
              <span className="case-stamp-bullet" aria-hidden="true">✦</span>
              <span>{t('hero.caseBadge')}</span>
              <span className="case-badge-active">ACTIVE INQUIRY</span>
            </div>

            <h1 className="noir-hero-headline hero-adventure-title font-title">
              {t('hero.headline')}
            </h1>

            <p className="hero-narrative-tagline font-serif">
              "{t('hero.supportingStory')}"
            </p>

            <p className="hero-narrative-desc font-serif">
              {t('hero.subhead')}
            </p>

            {/* Primary & Secondary Call to Actions */}
            <div className="hero-action-cluster">
              <button
                type="button"
                className="btn-adventure-primary"
                onClick={handleQuickStart}
                disabled={loading}
              >
                <span className="btn-icon" aria-hidden="true">🔎</span>
                <span className="btn-text font-mono">
                  {loading ? t('startScreen.loadingBtn') : (t('hero.startInvestigating') || t('hero.beginBtn'))}
                </span>
                <span className="btn-shine-bar" aria-hidden="true" />
              </button>

              <button
                type="button"
                className="btn-adventure-secondary font-mono"
                onClick={() => scrollToSection('case-dispatch')}
              >
                <span>{t('hero.discoverMystery') || t('hero.methodologyBtn')}</span>
              </button>
            </div>

            {/* Secret Evidence Badge / Interactive Scene Feedback */}
            <div className="hero-clue-status-strip font-mono" role="status">
              <div className="clue-status-pill">
                <span className="status-dot-active" aria-hidden="true" />
                <span>
                  {secretClueDiscovered
                    ? t('hero.secretClueFound')
                    : '1 Hidden Evidence on the street — hover right with magnifying glass'}
                </span>
              </div>
            </div>

            {/* Quick Detective Highlights */}
            <div className="hero-features-ribbon">
              <div className="feature-pill">
                <span className="pill-icon" aria-hidden="true">🏛️</span>
                <span className="pill-text font-serif">Thematic Victorian Estates</span>
              </div>
              <div className="feature-pill">
                <span className="pill-icon" aria-hidden="true">🕸️</span>
                <span className="pill-text font-serif">Evidence Pinboard & Graph</span>
              </div>
              <div className="feature-pill">
                <span className="pill-icon" aria-hidden="true">⚖️</span>
                <span className="pill-text font-serif">100% Solvable Deductive Puzzles</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN: The Living Animated Detective World */}
          <div className="adventure-hero-right">
            <div className="adventure-frame-wrapper">
              <div className="frame-corner top-left" aria-hidden="true" />
              <div className="frame-corner top-right" aria-hidden="true" />
              <div className="frame-corner bottom-left" aria-hidden="true" />
              <div className="frame-corner bottom-right" aria-hidden="true" />

              <DetectiveWorldCanvas
                onDiscoverClue={handleClueDiscovered}
                discoveredCount={secretClueDiscovered ? 1 : 0}
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3. SCOTLAND YARD FIELD CASEBOOK (How To Play) */}
      <section id="casebook" className="casebook-section">
        <div className="section-header-block">
          <span className="badge badge-amber font-mono">{t('howToPlay.protocolBadge')}</span>
          <h2 className="section-title font-title">{t('howToPlay.title')}</h2>
          <p className="section-subtext font-serif">
            {t('howToPlay.subtitle')}
          </p>
        </div>

        <div className="casebook-notebook">
          <div className="casebook-dossier-card">
            <div className="casebook-card-header font-mono">
              <span className="step-num">01</span>
              <span className="step-tag">{t('howToPlay.step1.tag')}</span>
            </div>
            <h3 className="casebook-title font-title">{t('howToPlay.step1.title')}</h3>
            <p className="casebook-text font-serif">
              {t('howToPlay.step1.desc')}
            </p>
          </div>

          <div className="casebook-dossier-card">
            <div className="casebook-card-header font-mono">
              <span className="step-num">02</span>
              <span className="step-tag">{t('howToPlay.step2.tag')}</span>
            </div>
            <h3 className="casebook-title font-title">{t('howToPlay.step2.title')}</h3>
            <p className="casebook-text font-serif">
              {t('howToPlay.step2.desc')}
            </p>
          </div>

          <div className="casebook-dossier-card">
            <div className="casebook-card-header font-mono">
              <span className="step-num">03</span>
              <span className="step-tag">{t('howToPlay.step3.tag')}</span>
            </div>
            <h3 className="casebook-title font-title">{t('howToPlay.step3.title')}</h3>
            <p className="casebook-text font-serif">
              {t('howToPlay.step3.desc')}
            </p>
          </div>
        </div>
      </section>

      {/* 4. CASE EXPERIENCE & EVIDENCE BOARD SHOWCASE */}
      <section id="experience" className="experience-showcase-section">
        <div className="section-header-block">
          <span className="badge badge-burgundy font-mono">{t('preview.systemBadge')}</span>
          <h2 className="section-title font-title">{t('preview.title')}</h2>
          <p className="section-subtext font-serif">
            {t('preview.subtitle')}
          </p>
        </div>

        <div className="experience-dual-grid">
          {/* Evidence Pinboard Card */}
          <div className="experience-feature-card">
            <div className="feature-card-header">
              <span className="feature-icon" aria-hidden="true">🕸️</span>
              <div>
                <span className="feature-badge font-mono">{t('nav.evidenceBoard')}</span>
                <h3 className="feature-title font-title">{t('preview.boardTitle')}</h3>
              </div>
            </div>
            <p className="feature-desc font-serif">{t('preview.boardDesc')}</p>
            <ul className="feature-bullet-list font-sans">
              {t('preview.featuresList').map((item, idx) => (
                <li key={idx}>✦ {item}</li>
              ))}
            </ul>
          </div>

          {/* Suspects & Diary Card */}
          <div className="experience-feature-card">
            <div className="feature-card-header">
              <span className="feature-icon" aria-hidden="true">📖</span>
              <div>
                <span className="feature-badge font-mono">{t('nav.suspects')} & {t('nav.journal')}</span>
                <h3 className="feature-title font-title">{t('preview.journalTitle')}</h3>
              </div>
            </div>
            <p className="feature-desc font-serif">{t('preview.journalDesc')}</p>
            <ul className="feature-bullet-list font-sans">
              {t('preview.journalFeaturesList').map((item, idx) => (
                <li key={idx}>✦ {item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* 5. ACTIVE CASE DISPATCH & LAUNCH TERMINAL */}
      <section id="case-dispatch" className="dispatch-terminal-section">
        <div className="section-header-block">
          <span className="badge badge-amber font-mono">{t('startScreen.dispatchBadge')}</span>
          <h2 className="section-title font-title">{t('startScreen.title')}</h2>
          <p className="section-subtext font-serif">
            {t('startScreen.subtitle')}
          </p>
        </div>

        <div className="dispatch-form-card">
          <StartScreen
            onStartInvestigation={onStartInvestigation}
            loading={loading}
            error={error}
          />
        </div>
      </section>

      {/* 6. VICTORIAN DETECTIVE FOOTER */}
      <footer className="adventure-footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <span className="font-title footer-title">{t('app.title')}</span>
            <p className="footer-tagline font-serif">{t('app.tagline')}</p>
          </div>

          <div className="footer-crests font-mono">
            <span>SCOTLAND YARD ARCHIVAL UNIT</span>
            <span className="footer-dot">•</span>
            <span>100% DETERMINISTIC PRNG</span>
            <span className="footer-dot">•</span>
            <span>NO SPOILER LEAKS</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
