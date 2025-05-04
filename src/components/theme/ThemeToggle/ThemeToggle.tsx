import React from 'react';
import { useChangeTheme } from '../../../hooks/useChangeTheme';
import { Button } from '../../base/Button/Button';

export const ThemeToggle: React.FC = () => {
  const { isDarkMode, toggleTheme } = useChangeTheme();

  return (
    <Button onClick={toggleTheme} variant="ghost" size="sm" className="flex items-center gap-2">
      {isDarkMode ? (
        <>
          <span className="text-lg">🌞</span>
          <span>Light Mode</span>
        </>
      ) : (
        <>
          <span className="text-lg">🌙</span>
          <span>Dark Mode</span>
        </>
      )}
    </Button>
  );
};
