'use client';

import { useThemeStore } from '@/store/theme';
import { useEffect } from 'react';
import Button from '@/components/ui/button';
import { IoSunny, IoMoon } from 'react-icons/io5';

function ThemeToggle() {
  const theme = useThemeStore((state) => state.theme);
  const setTheme = useThemeStore((state) => state.setTheme);
  console.log(theme);
  useEffect(() => {
    if (theme) {
      document.cookie = `theme=${theme};path=/;`;
      document.querySelector('html')?.setAttribute('data-theme', theme);
    } else {
      setTheme(window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    }
  }, [theme, setTheme]);

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
