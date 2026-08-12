'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { ThemeMode } from '../types/task';
import { updateUserPreferencesApi } from '../lib/api';

interface ThemeContextType {
  theme: ThemeMode;
  setTheme: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  theme: 'light',
  setTheme: () => {},
  toggleTheme: () => {},
});

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [theme, setThemeState] = useState<ThemeMode>('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('app-theme') as ThemeMode;
    if (savedTheme && (savedTheme === 'light' || savedTheme === 'dark')) {
      setThemeState(savedTheme);
      applyTheme(savedTheme);
    } else {
      applyTheme('light');
    }
  }, []);

  const applyTheme = (mode: ThemeMode) => {
    const root = document.documentElement;
    if (mode === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
  };

  const setTheme = (mode: ThemeMode) => {
    setThemeState(mode);
    localStorage.setItem('app-theme', mode);
    applyTheme(mode);

    const guestUserId = localStorage.getItem('guestUserId');
    if (guestUserId) {
      updateUserPreferencesApi(guestUserId, { theme: mode }).catch(() => {});
    }
  };

  const toggleTheme = () => {
    const nextMode = theme === 'light' ? 'dark' : 'light';
    setTheme(nextMode);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
