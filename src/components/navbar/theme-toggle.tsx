'use client';

import { useThemeStore } from '@/store/theme';
import { useEffect } from 'react';
import Button from '@/components/ui/button';
import { IoSunny, IoMoon } from 'react-icons/io5';

function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);

  useEffect(() => {
    if (!theme) {
      const cookieTheme = document.cookie
        .split('; ')
        .find((row) => row.startsWith('theme='))
        ?.split('=')[1] as 'light' | 'dark' | undefined;

      setTheme(
        cookieTheme ||
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'),
      );
      return;
    }
    document.cookie = `theme=${theme};path=/;`;
    document.querySelector('html')?.setAttribute('data-theme', theme);
  }, [theme, setTheme]);

  if (!theme) return null; // wait until the theme is resolved

  return (
    <Button
      className={
        'bg-transparent hover:bg-transparent border-none ring-0 focus:outline-none! focus:ring-0! aspect-square'
      }
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
    >
      <span className={'text-foreground relative flex items-center justify-center aspect-square'}>
        <IoSunny
          className={`absolute aspect-square transition-transform duration-300 ${theme === 'dark' ? 'scale-100 rotate-0' : 'scale-0 rotate-180'} `}
          size={20}
        />
        <IoMoon
          className={`absolute aspect-square transition-transform duration-300 ${theme === 'dark' ? 'scale-0 rotate-180' : 'scale-100 rotate-0'} `}
          size={20}
        />
      </span>
    </Button>
  );
}

export default ThemeToggle;
