import React, { useState } from 'react';
import { useLanguage } from '../localization/LanguageContext';
import { getCaseTheme } from '../game/caseThemes';

/**
 * HintModal Component
 * Progressive 3-Tier Detective Hint System:
 * - Hint 1: Room & Location exploration guidance
 * - Hint 2: Clue category and forensic focus
 * - Hint 3: Evidence correlation without giving away the culprit
 */
export default function HintModal({
  caseData,
  examinedClueIds = new Set(),
  onClose,
  hintsUsed = 0,
  onHintRevealed
}) {
  const { t, getClueText } = useLanguage();
  const [unlockedTier, setUnlockedTier] = useState(Math.max(1, hintsUsed));

  const theme = getCaseTheme(caseData?.seed || caseData?.caseId, caseData?.theme);
  const themeKey = theme.key;

  const clues = caseData?.clues || [];
  const unexaminedClues = clues.filter(c => !examinedClueIds.has(c.id));
  const startingClue = clues.find(c => c.id === caseData?.startingClueId) || clues[0];

  const handleUnlockNext = () => {
    if (unlockedTier < 3) {
      const nextTier = unlockedTier + 1;
      setUnlockedTier(nextTier);
      if (onHintRevealed) {
        onHintRevealed(nextTier);
      }
    }
  };

  // Tier 1: Where to search
  const tier1Text = unexaminedClues.length > 0
    ? t(`hints.${themeKey}.tier1Search`, { count: unexaminedClues.length })
    : t(`hints.${themeKey}.tier1AllFound`);

  // Tier 2: What to notice
  const tier2Text = startingClue
    ? t(`hints.${themeKey}.tier2Focus`, { clueName: getClueText(startingClue.id).name })
    : t(`hints.${themeKey}.tier2Default`);

  // Tier 3: How to deduce
  const tier3Text = t(`hints.${themeKey}.tier3Deduction`);

  const tiers = [
    {
      level: 1,
      badge: t('hints.tier1Badge'),
      title: t('hints.tier1Title'),
      content: tier1Text,
      unlocked: unlockedTier >= 1
    },
    {
      level: 2,
      badge: t('hints.tier2Badge'),
      title: t('hints.tier2Title'),
      content: tier2Text,
      unlocked: unlockedTier >= 2
    },
    {
      level: 3,
      badge: t('hints.tier3Badge'),
      title: t('hints.tier3Title'),
      content: tier3Text,
      unlocked: unlockedTier >= 3
    }
  ];

  return (
    <div className="hint-modal-backdrop" role="dialog" aria-modal="true" aria-label="Detective Hint System">
      <div className="hint-modal-card animate-scale-up">
        {/* Header */}
        <header className="hint-modal-header">
          <div className="hint-header-left">
            <span className="hint-header-icon" aria-hidden="true">💡</span>
            <div>
              <h2 className="hint-modal-title font-title">{t('hints.modalTitle')}</h2>
              <span className="hint-modal-subtitle font-mono">{t('hints.modalSubtitle')}</span>
            </div>
          </div>

          <button
            type="button"
            className="hint-close-btn"
            onClick={onClose}
            aria-label="Close Hint Window"
          >
            ✕
          </button>
        </header>

        {/* Tier Cards List */}
        <div className="hint-tiers-list">
          {tiers.map((tier) => (
            <div
              key={tier.level}
              className={`hint-tier-card ${tier.unlocked ? 'unlocked' : 'locked'}`}
            >
              <div className="tier-header">
                <span className="tier-badge font-mono">{tier.badge}</span>
                <span className="tier-title font-sans">{tier.title}</span>
              </div>

              {tier.unlocked ? (
                <div className="tier-content font-serif animate-fade-in">
                  {tier.content}
                </div>
              ) : (
                <div className="tier-locked-placeholder font-mono">
                  <span>🔒 {t('hints.lockedNotice')}</span>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer Actions */}
        <footer className="hint-modal-footer">
          <div className="hints-used-badge font-mono">
            {t('hints.hintsUsedLabel')}: {unlockedTier} / 3
          </div>

          <div className="hint-actions-right">
            {unlockedTier < 3 && (
              <button
                type="button"
                className="btn-unlock-hint"
                onClick={handleUnlockNext}
              >
                🔓 {t('hints.unlockNextBtn')} (Hint {unlockedTier + 1})
              </button>
            )}

            <button
              type="button"
              className="btn-close-hint"
              onClick={onClose}
            >
              {t('hints.resumeInvestigationBtn')}
            </button>
          </div>
        </footer>
      </div>
    </div>
  );
}
