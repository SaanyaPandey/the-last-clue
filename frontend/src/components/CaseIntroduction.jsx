import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../localization/LanguageContext';
import { soundEngine } from '../game/SoundEngine';
import { getCaseTheme } from '../game/caseThemes';

/**
 * CaseIntroduction Component
 * 5-panel animated cinematic story sequence introducing the case
 * before entering the detective briefing or room.
 * Explains: What happened, Where, When, Who reported, Why investigate.
 */
export default function CaseIntroduction({ caseData, onComplete, onSkip }) {
  const { t } = useLanguage();
  const [currentSlide, setCurrentSlide] = useState(0);

  const theme = getCaseTheme(caseData?.seed || caseData?.caseId, caseData?.theme);
  const themeKey = theme.key;

  // Sound effects on slide change
  const playSlideSound = useCallback(() => {
    try {
      soundEngine.playInspect();
    } catch {
      // Audio fallback safe
    }
  }, []);

  const handleNext = () => {
    if (currentSlide < 4) {
      setCurrentSlide(prev => prev + 1);
      playSlideSound();
    } else {
      onComplete();
    }
  };

  const handlePrev = () => {
    if (currentSlide > 0) {
      setCurrentSlide(prev => prev - 1);
      playSlideSound();
    }
  };

  // Keyboard navigation (Arrow keys, Enter, Escape)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'ArrowRight' || e.key === 'Enter') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      } else if (e.key === 'Escape') {
        e.preventDefault();
        onSkip();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  // Story panels data for current theme
  const panels = [
    {
      num: 1,
      badge: t('caseIntro.step1Badge'),
      question: t('caseIntro.whatHappenedQuestion'),
      headline: t(`caseIntro.${themeKey}.whatHeadline`),
      desc: t(`caseIntro.${themeKey}.whatDesc`),
      icon: theme.icon,
      highlight: t(`caseIntro.${themeKey}.whatHighlight`)
    },
    {
      num: 2,
      badge: t('caseIntro.step2Badge'),
      question: t('caseIntro.whereQuestion'),
      headline: t(`caseIntro.${themeKey}.whereHeadline`),
      desc: t(`caseIntro.${themeKey}.whereDesc`),
      icon: '🏛️',
      highlight: t(`caseIntro.${themeKey}.whereHighlight`)
    },
    {
      num: 3,
      badge: t('caseIntro.step3Badge'),
      question: t('caseIntro.whenQuestion'),
      headline: t(`caseIntro.${themeKey}.whenHeadline`),
      desc: t(`caseIntro.${themeKey}.whenDesc`),
      icon: '⏰',
      highlight: t(`caseIntro.${themeKey}.whenHighlight`)
    },
    {
      num: 4,
      badge: t('caseIntro.step4Badge'),
      question: t('caseIntro.whoReportedQuestion'),
      headline: t(`caseIntro.${themeKey}.whoHeadline`),
      desc: t(`caseIntro.${themeKey}.whoDesc`),
      icon: '📢',
      highlight: t(`caseIntro.${themeKey}.whoHighlight`)
    },
    {
      num: 5,
      badge: t('caseIntro.step5Badge'),
      question: t('caseIntro.whyInvestigateQuestion'),
      headline: t(`caseIntro.${themeKey}.whyHeadline`),
      desc: t(`caseIntro.${themeKey}.whyDesc`),
      icon: '🔎',
      highlight: t(`caseIntro.${themeKey}.whyHighlight`)
    }
  ];

  const panel = panels[currentSlide];

  return (
    <div className="case-intro-backdrop" role="dialog" aria-modal="true" aria-label="Case Introduction Story">
      <div className="case-intro-card animate-scale-up">
        {/* Top Header with Progress and Skip */}
        <header className="case-intro-header">
          <div className="intro-meta-left">
            <span className="badge badge-amber font-mono">
              {panel.badge} • {currentSlide + 1} / 5
            </span>
            <span className="case-code-pill font-mono">
              {caseData?.caseId || 'CASE-FILE'}
            </span>
          </div>

          <button
            type="button"
            className="intro-skip-btn font-mono"
            onClick={onSkip}
            title="Skip directly to Briefing [Esc]"
          >
            {t('caseIntro.skipBtn')} ⏭
          </button>
        </header>

        {/* Cinematic Story Content */}
        <div className="case-intro-body">
          {/* Visual Emblem */}
          <div className="intro-visual-cluster">
            <div className="intro-icon-halo">
              <span className="intro-primary-icon" aria-hidden="true">{panel.icon}</span>
            </div>
            <div className="intro-question-label font-mono">
              {panel.question}
            </div>
          </div>

          {/* Narrative Text */}
          <div className="intro-narrative-group">
            <h2 className="intro-headline font-title">
              {panel.headline}
            </h2>
            <p className="intro-desc font-serif">
              {panel.desc}
            </p>
            {panel.highlight && (
              <div className="intro-key-fact font-mono">
                <span className="fact-label">{t('caseIntro.keyFactLabel')}:</span>
                <span className="fact-text">{panel.highlight}</span>
              </div>
            )}
          </div>
        </div>

        {/* Navigation Footer */}
        <footer className="case-intro-footer">
          {/* Progress Dots */}
          <div className="intro-dots" role="tablist" aria-label="Story panels">
            {panels.map((p, idx) => (
              <button
                key={p.num}
                type="button"
                role="tab"
                aria-selected={currentSlide === idx}
                aria-label={`Go to story slide ${idx + 1}`}
                className={`intro-dot ${currentSlide === idx ? 'active' : ''}`}
                onClick={() => {
                  setCurrentSlide(idx);
                  playSlideSound();
                }}
              />
            ))}
          </div>

          {/* Action Buttons */}
          <div className="intro-actions-right">
            {currentSlide > 0 && (
              <button
                type="button"
                className="btn-intro-prev"
                onClick={handlePrev}
              >
                ◀ {t('caseIntro.prevBtn')}
              </button>
            )}

            <button
              type="button"
              className="btn-intro-next"
              onClick={handleNext}
            >
              {currentSlide === 4 ? (
                <>
                  <span>{t('caseIntro.startBriefingBtn')}</span>
                  <span>➔</span>
                </>
              ) : (
                <>
                  <span>{t('caseIntro.nextBtn')}</span>
                  <span>➔</span>
                </>
              )}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
