'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ColorMode } from '../types/task';
import { updateUserPreferencesApi } from '../lib/api';

interface ColorModeContextType {
  colorMode: ColorMode;
  setColorMode: (mode: ColorMode) => void;
}

const ColorModeContext = createContext<ColorModeContextType>({
  colorMode: 'blue',
  setColorMode: () => {},
});

export const ColorModeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [colorMode, setColorModeState] = useState<ColorMode>('blue');

  useEffect(() => {
    const saved = localStorage.getItem('app-color-mode') as ColorMode;
    if (saved) {
      setColorModeState(saved);
      document.documentElement.setAttribute('data-color-mode', saved);
    } else {
      document.documentElement.setAttribute('data-color-mode', 'blue');
    }
  }, []);

  const setColorMode = (mode: ColorMode) => {
    setColorModeState(mode);
    localStorage.setItem('app-color-mode', mode);
    document.documentElement.setAttribute('data-color-mode', mode);

    const guestUserId = localStorage.getItem('guestUserId');
    if (guestUserId) {
      updateUserPreferencesApi(guestUserId, { colorMode: mode }).catch(() => {});
    }
  };

  return (
    <ColorModeContext.Provider value={{ colorMode, setColorMode }}>
      {children}
    </ColorModeContext.Provider>
  );
};

export const useColorMode = () => useContext(ColorModeContext);
