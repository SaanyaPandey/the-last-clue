import React, { useState } from 'react';
import { useLanguage } from '../localization/LanguageContext';

/**
 * MissionObjectives Component
 * Persistent, compact detective mission objective panel.
 * Guides the player through 5 logical investigation milestones:
 * 1. Explore incident scene & inspect first clue
 * 2. Search secondary room for hidden forensic traces
 * 3. Review suspect statements & mark Persons of Interest
 * 4. Cross-reference evidence on the Pinboard
 * 5. Accuse the culprit & file final verdict
 */
export default function MissionObjectives({
  examinedCount = 0,
  totalClues = 4,
  poiCount = 0,
  hasOpenedBoard = false,
  hasOpenedJournal = false,
  onOpenJournal,
  onOpenBoard,
  onOpenAccusation
}) {
  const { t } = useLanguage();
  const [isExpanded, setIsExpanded] = useState(false);

  // Derive status for each milestone
  // Step 1: Examine at least 1 clue
  const step1Done = examinedCount >= 1;
  // Step 2: Examine all or majority of clues
  const step2Done = examinedCount >= Math.min(3, totalClues);
  // Step 3: Review suspects / journal or mark POI
  const step3Done = poiCount > 0 || hasOpenedJournal;
  // Step 4: Check pinboard / connect evidence
  const step4Done = hasOpenedBoard && examinedCount >= 2;
  // Step 5: Ready for accusation
  const step5Ready = examinedCount >= 2;

  // Determine current active step
  let currentStepIdx = 1;
  if (!step1Done) currentStepIdx = 1;
  else if (!step2Done) currentStepIdx = 2;
  else if (!step3Done) currentStepIdx = 3;
  else if (!step4Done) currentStepIdx = 4;
  else currentStepIdx = 5;

  const steps = [
    {
      num: 1,
      title: t('objectives.step1Title'),
      desc: t('objectives.step1Desc'),
      done: step1Done,
      active: currentStepIdx === 1,
      action: null
    },
    {
      num: 2,
      title: t('objectives.step2Title', { current: examinedCount, total: totalClues }),
      desc: t('objectives.step2Desc'),
      done: step2Done,
      active: currentStepIdx === 2,
      action: null
    },
    {
      num: 3,
      title: t('objectives.step3Title'),
      desc: t('objectives.step3Desc'),
      done: step3Done,
      active: currentStepIdx === 3,
      action: onOpenJournal,
      actionLabel: t('hud.journalBtn')
    },
    {
      num: 4,
      title: t('objectives.step4Title'),
      desc: t('objectives.step4Desc'),
      done: step4Done,
      active: currentStepIdx === 4,
      action: onOpenBoard,
      actionLabel: t('hud.boardBtn')
    },
    {
      num: 5,
      title: t('objectives.step5Title'),
      desc: t('objectives.step5Desc'),
      done: false,
      active: currentStepIdx === 5,
      action: onOpenAccusation,
      actionLabel: t('hud.accuseBtn')
    }
  ];

  const activeStep = steps.find(s => s.active) || steps[0];

  return (
    <div className="mission-objectives-container" aria-label="Investigation Mission Checklist">
      {/* Compact Active Pill */}
      <div className="mission-compact-card">
        <div className="mission-beacon-dot" aria-hidden="true" />
        <div className="mission-text-group" onClick={() => setIsExpanded(!isExpanded)}>
          <span className="mission-step-tag font-mono">
            {t('objectives.stepTag')} {activeStep.num} / 5
          </span>
          <span className="mission-active-title font-sans">
            {activeStep.title}
          </span>
        </div>

        <button
          type="button"
          className="mission-expand-btn font-mono"
          onClick={() => setIsExpanded(!isExpanded)}
          aria-expanded={isExpanded}
          title="Toggle Mission Checklist"
        >
          {isExpanded ? '▲' : '▼'}
        </button>
      </div>

      {/* Expanded Multi-Step Drawer */}
      {isExpanded && (
        <div className="mission-expanded-drawer animate-fade-in">
          <div className="drawer-header">
            <span className="drawer-title font-mono">{t('objectives.checklistTitle')}</span>
            <span className="drawer-counter font-mono">{examinedCount} / {totalClues} {t('cluePanel.title')}</span>
          </div>

          <div className="mission-steps-list">
            {steps.map((s) => {
              const statusClass = s.done ? 'status-done' : s.active ? 'status-active' : 'status-locked';

              return (
                <div key={s.num} className={`mission-step-row ${statusClass}`}>
                  <div className="step-indicator font-mono">
                    {s.done ? '✓' : s.active ? '▶' : '🔒'}
                  </div>

                  <div className="step-info">
                    <span className="step-title font-sans">{s.title}</span>
                    <span className="step-desc font-serif">{s.desc}</span>
                  </div>

                  {s.action && s.active && (
                    <button
                      type="button"
                      className="step-quick-btn font-mono"
                      onClick={() => {
                        s.action();
                        setIsExpanded(false);
                      }}
                    >
                      {s.actionLabel} ➔
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
