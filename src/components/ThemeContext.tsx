'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'

interface ThemeContextType {
  isDark: boolean;
  isTransitioning: boolean;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType>({
  isDark: true,
  isTransitioning: false,
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDark, setIsDark] = useState(true);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const toggleTheme = useCallback(() => {
    setIsTransitioning(true);
    // Theme will be toggled after animation completes in the Hero component
    setTimeout(() => {
      setIsDark(prev => !prev);
      setIsTransitioning(false);
    }, 1000); // Match this with animation duration
  }, []);

  return (
    <ThemeContext.Provider value={{ isDark, isTransitioning, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}; 