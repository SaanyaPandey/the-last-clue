import React, { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { locales } from './locales/index.js';

const STORAGE_KEY = 'the_last_clue_lang';
const DEFAULT_LANGUAGE = 'hinglish';
const ALLOWED_LANGUAGES = ['hinglish', 'en', 'hi'];

const LanguageContext = createContext(null);

export function LanguageProvider({ children }) {
  const [language, setLanguageState] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved && ALLOWED_LANGUAGES.includes(saved)) {
          return saved;
        }
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }
    return DEFAULT_LANGUAGE;
  });

  const setLanguage = useCallback((newLang) => {
    if (!ALLOWED_LANGUAGES.includes(newLang)) return;
    setLanguageState(newLang);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, newLang);
      }
    } catch {
      // Ignore localStorage write errors
    }
  }, []);

  const activeDictionary = useMemo(() => {
    return locales[language] || locales[DEFAULT_LANGUAGE];
  }, [language]);

  // Main translation function with dot notation and parameter interpolation
  const t = useCallback((path, params = {}) => {
    if (!path || typeof path !== 'string') return '';

    const keys = path.split('.');
    let current = activeDictionary;
    let fallback = locales[DEFAULT_LANGUAGE];

    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        current = null;
      }
      if (fallback && typeof fallback === 'object' && key in fallback) {
        fallback = fallback[key];
      } else {
        fallback = null;
      }
    }

    let val = current !== null && current !== undefined ? current : fallback;

    if (val === null || val === undefined) {
      return path;
    }

    if (typeof val === 'string' && Object.keys(params).length > 0) {
      return val.replace(/\{(\w+)\}/g, (_, placeholder) => {
        return params[placeholder] !== undefined ? String(params[placeholder]) : `{${placeholder}}`;
      });
    }

    return val;
  }, [activeDictionary]);

  // Dynamic Case Entity Resolvers
  const getClueText = useCallback((clueId) => {
    if (!clueId) return { name: '', description: '', category: '' };
    const dict = activeDictionary?.entities?.clues?.[clueId] ||
      locales[DEFAULT_LANGUAGE]?.entities?.clues?.[clueId];

    return {
      name: dict?.name || clueId.replace('clue_', '').replace(/_/g, ' '),
      description: dict?.description || '',
      category: dict?.category || ''
    };
  }, [activeDictionary]);

  const getSuspectText = useCallback((suspectId) => {
    if (!suspectId) return { name: '', role: '', traits: [] };
    const dict = activeDictionary?.entities?.suspects?.[suspectId] ||
      locales[DEFAULT_LANGUAGE]?.entities?.suspects?.[suspectId];

    return {
      name: dict?.name || suspectId.replace('suspect_', '').replace(/_/g, ' '),
      role: dict?.role || '',
      traits: dict?.traits || []
    };
  }, [activeDictionary]);

  const getLocationText = useCallback((locId) => {
    if (!locId) return { name: '', type: '', description: '' };
    const dict = activeDictionary?.entities?.locations?.[locId] ||
      locales[DEFAULT_LANGUAGE]?.entities?.locations?.[locId];

    return {
      name: dict?.name || locId.replace('location_', '').replace(/_/g, ' '),
      type: dict?.type || '',
      description: dict?.description || ''
    };
  }, [activeDictionary]);

  const getWeaponText = useCallback((wepId) => {
    if (!wepId) return { name: '', category: '', subType: '', description: '' };
    const dict = activeDictionary?.entities?.weapons?.[wepId] ||
      locales[DEFAULT_LANGUAGE]?.entities?.weapons?.[wepId];

    return {
      name: dict?.name || wepId.replace('weapon_', '').replace(/_/g, ' '),
      category: dict?.category || '',
      subType: dict?.subType || '',
      description: dict?.description || ''
    };
  }, [activeDictionary]);

  const getMotiveText = useCallback((motId) => {
    if (!motId) return { name: '', description: '' };
    const dict = activeDictionary?.entities?.motives?.[motId] ||
      locales[DEFAULT_LANGUAGE]?.entities?.motives?.[motId];

    return {
      name: dict?.name || motId.replace('motive_', '').replace(/_/g, ' '),
      description: dict?.description || ''
    };
  }, [activeDictionary]);

  const getRelationshipText = useCallback((rel) => {
    if (!rel) return '';
    const label = activeDictionary?.relationships?.[rel] ||
      locales[DEFAULT_LANGUAGE]?.relationships?.[rel];
    return label || rel.replace(/_/g, ' ');
  }, [activeDictionary]);

  const getRoomObjectText = useCallback((objectId) => {
    if (!objectId) return null;
    const dict = activeDictionary?.entities?.roomObjects?.[objectId] ||
      locales[DEFAULT_LANGUAGE]?.entities?.roomObjects?.[objectId];

    if (!dict) return null;
    return {
      title: dict.title || objectId,
      roomName: dict.roomName || '',
      description: dict.description || '',
      detailObservation: dict.detailObservation || '',
      actionLabel: dict.actionLabel || ''
    };
  }, [activeDictionary]);

  const getObjectiveText = useCallback((examinedCount, totalCount) => {
    if (examinedCount === 0) {
      return t('hud.objectives.initialDrawingRoom');
    }
    if (examinedCount < totalCount) {
      return t('hud.objectives.exploringRooms', { current: examinedCount, total: totalCount });
    }
    return t('hud.objectives.allCluesFound');
  }, [t]);

  const contextValue = useMemo(() => ({
    language,
    setLanguage,
    t,
    getClueText,
    getSuspectText,
    getLocationText,
    getWeaponText,
    getMotiveText,
    getRelationshipText,
    getRoomObjectText,
    getObjectiveText,
    availableLanguages: [
      { id: 'hinglish', label: 'Hinglish', nativeLabel: 'Hinglish', flag: '🇮🇳' },
      { id: 'en', label: 'Simple English', nativeLabel: 'English', flag: '🇬🇧' },
      { id: 'hi', label: 'Hindi', nativeLabel: 'हिन्दी', flag: '🇮🇳' }
    ]
  }), [
    language,
    setLanguage,
    t,
    getClueText,
    getSuspectText,
    getLocationText,
    getWeaponText,
    getMotiveText,
    getRelationshipText,
    getRoomObjectText,
    getObjectiveText
  ]);

  return (
    <LanguageContext.Provider value={contextValue}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
}
