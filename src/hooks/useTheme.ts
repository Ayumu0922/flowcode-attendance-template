import { useState, useEffect, useCallback } from 'react';

type Theme = 'dark' | 'light';
type AccentColor = 'mono' | 'blue' | 'teal' | 'emerald' | 'rose' | 'violet' | 'amber' | 'cyan' | 'orange';

export const accentColors: { name: AccentColor; label: string; swatch: string }[] = [
  { name: 'mono', label: 'モノトーン', swatch: '#94a3b8' },
  { name: 'blue', label: 'ブルー', swatch: '#3b82f6' },
  { name: 'teal', label: 'ティール', swatch: '#14b8a6' },
  { name: 'emerald', label: 'エメラルド', swatch: '#10b981' },
  { name: 'rose', label: 'ローズ', swatch: '#f43f5e' },
  { name: 'violet', label: 'バイオレット', swatch: '#8b5cf6' },
  { name: 'amber', label: 'アンバー', swatch: '#f59e0b' },
  { name: 'cyan', label: 'シアン', swatch: '#06b6d4' },
  { name: 'orange', label: 'オレンジ', swatch: '#f97316' },
];

export function useTheme() {
  const [theme, setTheme] = useState<Theme>(() => {
    return (localStorage.getItem('app-theme') as Theme) || 'dark';
  });

  const [accentColor, setAccentColorState] = useState<AccentColor>(() => {
    return (localStorage.getItem('app-accent-color') as AccentColor) || 'mono';
  });

  useEffect(() => {
    localStorage.setItem('app-theme', theme);
    const root = document.documentElement;
    if (theme === 'light') {
      root.classList.add('theme-light');
    } else {
      root.classList.remove('theme-light');
    }
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('app-accent-color', accentColor);
    document.documentElement.setAttribute('data-color', accentColor);
  }, [accentColor]);

  const toggleTheme = useCallback(() => {
    setTheme(prev => (prev === 'dark' ? 'light' : 'dark'));
  }, []);

  const setAccentColor = useCallback((color: AccentColor) => {
    setAccentColorState(color);
  }, []);

  return { theme, toggleTheme, accentColor, setAccentColor } as const;
}
