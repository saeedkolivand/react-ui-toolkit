import React, { useEffect, useState } from 'react';
import { Button } from './base/Button/Button';

export const ThemeToggle: React.FC = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    // Check initial theme
    if (typeof window !== 'undefined') {
      setIsDark(document.documentElement.classList.contains('dark'));
    }
  }, []);

  const toggleTheme = () => {
    const newTheme = !isDark;
    setIsDark(newTheme);

    // Update document class
    if (newTheme) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  };

  return (
    <Button variant="ghost" onClick={toggleTheme} className="fixed top-4 right-4">
      {isDark ? '🌞 Light Mode' : '🌙 Dark Mode'}
    </Button>
  );
};
