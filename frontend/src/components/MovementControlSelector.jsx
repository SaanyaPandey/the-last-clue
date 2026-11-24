import React, { useState, useRef, useEffect } from 'react';
import { useControls } from '../context/ControlsContext';
import { useLanguage } from '../localization/LanguageContext';

/**
 * MovementControlSelector Component
 * Victorian-noir styled movement controls switcher supporting:
 * - Both (Keyboard + Mouse Hold & Drag) [Default]
 * - Keyboard Only (WASD / Arrows)
 * - Mouse Only (Hold & Drag)
 */
export default function MovementControlSelector({ variant = 'compact', className = '' }) {
  const { controlMode, setControlMode, availableControlModes } = useControls();
  const { t } = useLanguage();
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handleOutsideClick = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleOutsideClick);
    return () => document.removeEventListener('mousedown', handleOutsideClick);
  }, []);

  const currentModeObj = availableControlModes.find((m) => m.id === controlMode) || availableControlModes[0];

  if (variant === 'segmented') {
    return (
      <div className={`ctrl-segmented-bar ${className}`} role="radiogroup" aria-label="Movement Controls">
        {availableControlModes.map((mode) => {
          const isActive = controlMode === mode.id;
          const label = t(`controls.${mode.id}.label`);
          return (
            <button
              key={mode.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`ctrl-segment-btn ${isActive ? 'active' : ''}`}
              onClick={() => setControlMode(mode.id)}
              title={t(`controls.${mode.id}.desc`)}
            >
              <span className="ctrl-icon" aria-hidden="true">{mode.icon}</span>
              <span className="ctrl-name">{label}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`ctrl-selector-dropdown ${className}`} ref={containerRef}>
      <button
        type="button"
        className="ctrl-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title={t('controls.switchControlsTitle')}
      >
        <span className="ctrl-icon" aria-hidden="true">{currentModeObj.icon}</span>
        <span className="ctrl-current-label font-mono">
          {t(`controls.${controlMode}.badge`)}
        </span>
        <span className="ctrl-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <ul className="ctrl-menu" role="listbox" aria-label="Movement control modes">
          {availableControlModes.map((mode) => {
            const isSelected = controlMode === mode.id;
            return (
              <li
                key={mode.id}
                role="option"
                aria-selected={isSelected}
                className={`ctrl-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setControlMode(mode.id);
                  setIsOpen(false);
                }}
              >
                <span className="ctrl-icon-menu" aria-hidden="true">{mode.icon}</span>
                <div className="ctrl-option-text">
                  <span className="ctrl-option-title font-sans">
                    {t(`controls.${mode.id}.label`)}
                  </span>
                  <span className="ctrl-option-desc font-serif">
                    {t(`controls.${mode.id}.desc`)}
                  </span>
                </div>
                {isSelected && <span className="ctrl-check">✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
