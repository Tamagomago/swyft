'use client';

import { useThemeStore } from '@/store/theme';
import { useEffect } from 'react';

function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  console.log(theme);
  useEffect(() => {
    if (!theme) {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
    if (theme) {
      document.cookie = `theme=${theme};path=/;`;
      document.querySelector('html')?.setAttribute('data-theme', theme);
    }
  }, [theme, setTheme]);

  return (
    <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
      <span className={'text-ctm-foreground'}>Toggle</span>
    </button>
  );
}

export default ThemeToggle;
