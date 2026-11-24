import React, { useState } from 'react';
import { requestCaseSolutionReveal } from '../services/caseApi';
import { useLanguage } from '../localization/LanguageContext';

/**
 * AccusationResult Component
 * Displays the authoritative judicial verdict returned by the server.
 * Handles both correct and incorrect outcomes without leaking the answer,
 * and provides an optional post-game reveal flow once concluded.
 */
export default function AccusationResult({
  filingRecord,
  caseInstanceId,
  caseId,
  onClose,
  onNewCase
}) {
  const [unsealedArchive, setUnsealedArchive] = useState(null);
  const [isRevealing, setIsRevealing] = useState(false);
  const [revealError, setRevealError] = useState(null);
  const { t, getSuspectText, getLocationText, getWeaponText, getMotiveText } = useLanguage();

  if (!filingRecord) return null;

  const {
    isCorrect,
    suspect,
    rationale,
    seed,
    status
  } = filingRecord;

  const handleRequestReveal = async () => {
    if (isRevealing) return;
    setIsRevealing(true);
    setRevealError(null);

    const result = await requestCaseSolutionReveal({
      caseInstanceId: caseInstanceId || filingRecord.caseInstanceId,
      caseId: caseId || filingRecord.caseId
    });

    if (result.success && result.data?.unsealedFindings) {
      setUnsealedArchive(result.data.unsealedFindings);
    } else {
      setRevealError(result.error || t('feedback.errorDefault'));
    }
    setIsRevealing(false);
  };

  const accusedId = suspect?.id || filingRecord.accusedSuspectId;
  const localizedAccused = getSuspectText(accusedId);
  const feedbackMessage = isCorrect
    ? t('verdict.victoryFeedback')
    : t('verdict.defeatFeedback');

  return (
    <div className="filed-dossier" role="region" aria-label="Authoritative Accusation Verdict">
      {/* Verdict Seal */}
      <div
        className="filed-seal font-title"
        aria-hidden="true"
        style={{
          background: isCorrect ? 'linear-gradient(135deg, #1b5e20, #2e7d32)' : 'var(--burgundy-primary)',
          borderColor: isCorrect ? '#81c784' : '#ff9fb2',
          boxShadow: isCorrect ? '0 0 25px rgba(76, 175, 80, 0.45)' : '0 0 25px rgba(139, 40, 60, 0.45)'
        }}
      >
        {isCorrect ? '✓' : '✗'}
      </div>

      <div>
        <span
          className="filed-badge"
          style={{
            color: isCorrect ? '#a5d6a7' : '#ff9fb2',
            borderColor: isCorrect ? 'rgba(76, 175, 80, 0.5)' : 'var(--burgundy-light)',
            background: isCorrect ? 'rgba(46, 125, 50, 0.2)' : 'rgba(139, 40, 60, 0.2)'
          }}
        >
          {isCorrect ? t('verdict.victoryBadge') : t('verdict.defeatBadge')}
        </span>

        <h3
          className="font-title"
          style={{
            fontSize: '1.4rem',
            color: isCorrect ? '#a5d6a7' : '#ff9fb2',
            marginTop: '0.4rem'
          }}
        >
          {isCorrect ? t('verdict.victoryTitle') : t('verdict.defeatTitle')}
        </h3>

        {/* Child-friendly Star Rating & Detective Rank */}
        {isCorrect && (
          <div style={{ marginTop: '0.4rem', textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '0.35rem' }}>
              <span style={{ fontSize: '1.5rem', color: '#ffd166', filter: 'drop-shadow(0 0 6px rgba(255, 209, 102, 0.6))' }}>★</span>
              <span style={{ fontSize: '1.5rem', color: '#ffd166', filter: 'drop-shadow(0 0 6px rgba(255, 209, 102, 0.6))' }}>★</span>
              <span style={{ fontSize: '1.5rem', color: '#ffd166', filter: 'drop-shadow(0 0 6px rgba(255, 209, 102, 0.6))' }}>★</span>
            </div>
            <span style={{ fontSize: '0.78rem', color: '#ffd166', fontFamily: 'var(--font-mono)', letterSpacing: '0.05em' }}>
              ✦ MASTER SLEUTH VERDICT ✦
            </span>
          </div>
        )}
      </div>

      {/* Official Feedback from Scotland Yard */}
      <div
        style={{
          width: '100%',
          background: 'rgba(10, 13, 18, 0.55)',
          border: `1px solid ${isCorrect ? 'rgba(76, 175, 80, 0.4)' : 'var(--border-burgundy)'}`,
          borderRadius: 'var(--radius-sm)',
          padding: '1rem',
          textAlign: 'left',
          fontSize: '0.85rem'
        }}
      >
        <p style={{ margin: '0 0 0.75rem', color: 'var(--text-ivory)', fontStyle: 'italic', lineHeight: 1.5 }}>
          "{feedbackMessage}"
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', paddingTop: '0.65rem' }}>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>
              {t('verdict.caseRef')}
            </span>
            <strong style={{ color: 'var(--text-ivory)' }}>{caseId || filingRecord.caseId || 'CASE-ACTIVE'}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>
              {t('verdict.seed')}
            </span>
            <strong style={{ color: 'var(--amber-light)', fontFamily: 'var(--font-mono)' }}>{seed}</strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>
              {t('verdict.accused')}
            </span>
            <strong style={{ color: isCorrect ? '#a5d6a7' : '#ff9fb2' }}>
              {localizedAccused.name || accusedId}
            </strong>
          </div>
          <div>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>
              {t('verdict.status')}
            </span>
            <span style={{ color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
              {status || (isCorrect ? t('verdict.statusSolved') : t('verdict.statusClosed'))}
            </span>
          </div>
        </div>

        {rationale && (
          <div style={{ borderTop: '1px solid rgba(255, 255, 255, 0.08)', marginTop: '0.65rem', paddingTop: '0.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.72rem', display: 'block' }}>
              {t('verdict.statementRecorded')}
            </span>
            <p style={{ fontStyle: 'italic', color: '#ded7cb', margin: '3px 0 0' }}>
              "{rationale}"
            </p>
          </div>
        )}
      </div>

      {/* Post-Game Solution Reveal Accordion (Allowed only once case is closed) */}
      {!unsealedArchive ? (
        <div style={{ width: '100%', marginTop: '0.25rem' }}>
          <button
            type="button"
            className="btn-header"
            style={{
              width: '100%',
              padding: '0.65rem',
              borderColor: 'var(--amber-dim)',
              color: 'var(--amber-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '0.5rem'
            }}
            onClick={handleRequestReveal}
            disabled={isRevealing}
          >
            {isRevealing ? t('verdict.unsealingBtn') : t('verdict.unsealBtn')}
          </button>
          {revealError && (
            <p style={{ color: '#ff9fb2', fontSize: '0.75rem', marginTop: '4px' }}>
              {revealError}
            </p>
          )}
        </div>
      ) : (
        <div
          style={{
            width: '100%',
            background: 'rgba(15, 20, 28, 0.95)',
            border: '1px solid var(--amber-primary)',
            borderRadius: 'var(--radius-sm)',
            padding: '1rem',
            textAlign: 'left',
            boxShadow: '0 0 20px rgba(212, 163, 89, 0.15)'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge badge-amber">{t('verdict.unsealedBadge')}</span>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t('verdict.authoritativeTruth')}</span>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.6rem', fontSize: '0.82rem' }}>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>{t('verdict.perpetratorTitle')}</span>
              <strong style={{ color: 'var(--amber-light)' }}>
                {getSuspectText(unsealedArchive.perpetrator).name || unsealedArchive.perpetrator?.replace('suspect_', '').replace(/_/g, ' ').toUpperCase()}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>{t('verdict.crimeScene')}</span>
              <strong style={{ color: '#72cbcf' }}>
                {getLocationText(unsealedArchive.crimeScene).name || unsealedArchive.crimeScene?.replace('location_', '').replace(/_/g, ' ').toUpperCase()}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>{t('verdict.murderWeapon')}</span>
              <strong style={{ color: '#e5879a' }}>
                {getWeaponText(unsealedArchive.weaponUsed).name || unsealedArchive.weaponUsed?.replace('weapon_', '').replace(/_/g, ' ').toUpperCase()}
              </strong>
            </div>
            <div>
              <span style={{ color: 'var(--text-muted)', display: 'block' }}>{t('verdict.criminalMotive')}</span>
              <strong style={{ color: '#b5c2d4' }}>
                {getMotiveText(unsealedArchive.motiveDeduction).name || unsealedArchive.motiveDeduction?.replace('motive_', '').replace(/_/g, ' ').toUpperCase()}
              </strong>
            </div>
          </div>
        </div>
      )}

      {/* Modal Actions */}
      <div style={{ display: 'flex', gap: '0.75rem', marginTop: '0.5rem', width: '100%', justifyContent: 'center' }}>
        <button
          type="button"
          className="btn-cancel"
          style={{ padding: '0.65rem 1.25rem' }}
          onClick={onClose}
        >
          {t('verdict.reviewBoardBtn')}
        </button>
        <button
          type="button"
          className="btn-confirm-accuse"
          style={{ padding: '0.65rem 1.4rem' }}
          onClick={onNewCase}
        >
          {t('verdict.newCaseBtn')}
        </button>
      </div>
    </div>
  );
}
