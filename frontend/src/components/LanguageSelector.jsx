import React, { useState, useRef, useEffect } from 'react';
import { useLanguage } from '../localization/LanguageContext';

/**
 * LanguageSelector Component
 * Elegant noir-styled language switcher for Indian children & beginner players.
 * Supports: Hinglish (Default), Simple English, and Hindi (Devanagari).
 */
export default function LanguageSelector({ variant = 'compact', className = '' }) {
  const { language, setLanguage, availableLanguages } = useLanguage();
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

  const currentLangObj = availableLanguages.find((l) => l.id === language) || availableLanguages[0];

  if (variant === 'segmented') {
    return (
      <div className={`lang-segmented-bar ${className}`} role="radiogroup" aria-label="Language selection">
        {availableLanguages.map((lang) => {
          const isActive = language === lang.id;
          return (
            <button
              key={lang.id}
              type="button"
              role="radio"
              aria-checked={isActive}
              className={`lang-segment-btn ${isActive ? 'active' : ''}`}
              onClick={() => setLanguage(lang.id)}
            >
              <span className="lang-flag">{lang.flag}</span>
              <span className="lang-name">{lang.nativeLabel}</span>
            </button>
          );
        })}
      </div>
    );
  }

  return (
    <div className={`lang-selector-dropdown ${className}`} ref={containerRef}>
      <button
        type="button"
        className="lang-toggle-btn"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
        title="Change Language / भाषा बदलें"
      >
        <span className="lang-flag">{currentLangObj.flag}</span>
        <span className="lang-current-label">{currentLangObj.nativeLabel}</span>
        <span className="lang-arrow">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <ul className="lang-menu" role="listbox" aria-label="Available languages">
          {availableLanguages.map((lang) => {
            const isSelected = language === lang.id;
            return (
              <li
                key={lang.id}
                role="option"
                aria-selected={isSelected}
                className={`lang-option ${isSelected ? 'selected' : ''}`}
                onClick={() => {
                  setLanguage(lang.id);
                  setIsOpen(false);
                }}
              >
                <span className="lang-flag">{lang.flag}</span>
                <div className="lang-option-text">
                  <span className="lang-option-native">{lang.nativeLabel}</span>
                  <span className="lang-option-sub">{lang.label}</span>
                </div>
                {isSelected && <span className="lang-check">✓</span>}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
