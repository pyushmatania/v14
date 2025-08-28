import React, { useState, useEffect, ReactNode } from 'react';

import { ThemeContext, ThemeContextType } from './ThemeContext';

interface ThemeProviderProps {
  children: ReactNode;
}

// Fallback component that doesn't use React hooks
// const ThemeProviderFallback: React.FC<ThemeProviderProps> = ({ children }) => {
//   // Apply default dark theme to document
//   try {
//     document.documentElement.classList.remove('light');
//     document.documentElement.setAttribute('data-gradient', '0');
//   } catch (error) {
//     console.warn('Failed to apply fallback theme:', error);
//   }

//   return (
//     <ThemeContext.Provider value={{
//       theme: 'dark',
//       toggleTheme: () => {},
//       currentGradient: 0
//     }}>
//       {children}
//     </ThemeContext.Provider>
//   );
// };

// Create a wrapper component to handle potential React context issues
const ThemeProviderWrapper: React.FC<ThemeProviderProps> = ({ children }) => {
    const isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';
    const [theme, setTheme] = useState<'light' | 'dark'>(() => {
      if (isBrowser) {
        try {
          const saved = localStorage.getItem('circles-theme') as 'light' | 'dark' | null;
          if (saved === 'light' || saved === 'dark') return saved;
        } catch {
          // localStorage may not be available in some environments
        }
      }
      return 'dark';
    });
    const [currentGradient, setCurrentGradient] = useState(0);

    // No-op: initial theme is loaded lazily above

    useEffect(() => {
      if (!isBrowser) return;
      try {
        localStorage.setItem('circles-theme', theme);
        document.documentElement.classList.toggle('light', theme === 'light');
      } catch (error) {
        console.warn('Failed to save theme to localStorage:', error);
      }
    }, [theme, isBrowser]);

    // Auto-cycle through gradient themes every 4 seconds
    useEffect(() => {
      if (!isBrowser) return;
      const interval = setInterval(() => {
        setCurrentGradient((prev) => (prev + 1) % 5); // 5 total gradients (0-4)
      }, 4000);
      return () => clearInterval(interval);
    }, [isBrowser]);

    // Apply current gradient to document
    useEffect(() => {
      if (!isBrowser) return;
      try {
        document.documentElement.setAttribute('data-gradient', currentGradient.toString());
      } catch (error) {
        console.warn('Failed to set gradient attribute:', error);
      }
    }, [currentGradient, isBrowser]);

    const toggleTheme = () => {
      setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    const contextValue: ThemeContextType = {
      theme,
      toggleTheme,
      currentGradient
    };

    return (
      <ThemeContext.Provider value={contextValue}>
        {children}
      </ThemeContext.Provider>
    );
};

export const ThemeProvider = ThemeProviderWrapper;