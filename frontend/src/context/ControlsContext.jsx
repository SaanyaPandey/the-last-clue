import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';

const STORAGE_KEY = 'the_last_clue_controls';
const DEFAULT_CONTROL_MODE = 'both';
const ALLOWED_CONTROL_MODES = ['both', 'keyboard', 'mouse'];

const ControlsContext = createContext(null);

export function ControlsProvider({ children }) {
  const [controlMode, setControlModeState] = useState(() => {
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        const saved = window.localStorage.getItem(STORAGE_KEY);
        if (saved && ALLOWED_CONTROL_MODES.includes(saved)) {
          return saved;
        }
      }
    } catch {
      // Ignore localStorage read errors in restricted contexts
    }
    return DEFAULT_CONTROL_MODE;
  });

  const setControlMode = useCallback((newMode) => {
    if (!ALLOWED_CONTROL_MODES.includes(newMode)) return;
    setControlModeState(newMode);
    try {
      if (typeof window !== 'undefined' && window.localStorage) {
        window.localStorage.setItem(STORAGE_KEY, newMode);
      }
    } catch {
      // Ignore localStorage write errors
    }
  }, []);

  const availableControlModes = useMemo(() => [
    { id: 'both', icon: '⌨ + 🖱', defaultMode: true },
    { id: 'keyboard', icon: '⌨', defaultMode: false },
    { id: 'mouse', icon: '🖱', defaultMode: false }
  ], []);

  const value = useMemo(() => ({
    controlMode,
    setControlMode,
    availableControlModes
  }), [controlMode, setControlMode, availableControlModes]);

  return (
    <ControlsContext.Provider value={value}>
      {children}
    </ControlsContext.Provider>
  );
}

export function useControls() {
  const context = useContext(ControlsContext);
  if (!context) {
    return {
      controlMode: DEFAULT_CONTROL_MODE,
      setControlMode: () => {},
      availableControlModes: [
        { id: 'both', icon: '⌨ + 🖱', defaultMode: true },
        { id: 'keyboard', icon: '⌨', defaultMode: false },
        { id: 'mouse', icon: '🖱', defaultMode: false }
      ]
    };
  }
  return context;
}
