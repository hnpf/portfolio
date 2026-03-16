import React, { createContext, useContext, useEffect, useState } from 'react';
type ThemeMode = 'light' | 'dark' | 'system';
type AccentColor = 'orange' | 'green' | 'red' | 'purple' | 'blue' | 'custom';

interface ThemeSettings {
  mode: ThemeMode;
  accent: AccentColor;
  hue: number;
  sidebarFlipped: boolean;
  sidebarCollapsed: boolean;
  brutalistMode: boolean;
  developerFont: boolean;
  focusMode: boolean;
  helloAnimation: boolean;
  disableAnimations: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  actualTheme: 'light' | 'dark';
  cycleTheme: () => void;
}

const DEFAULT_SETTINGS: ThemeSettings = {
  mode: 'system',
  accent: 'purple',
  hue: 220,
  sidebarFlipped: false,
  sidebarCollapsed: false,
  brutalistMode: false,
  developerFont: false,
  focusMode: false,
  helloAnimation: true,
  disableAnimations: false,
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('virex-settings');
    return saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
  });
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

  useEffect(() => {
    const root = window.document.documentElement;
    // this bit handles the light/dark switching logic
    const applyThemeSettings = () => {
      let mode = settings.mode;
      if (mode === 'system') {
        mode = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      setActualTheme(mode as any);
      root.classList.remove('dark');
      if (mode === 'dark') root.classList.add('dark');
    };
    // apply those theme changes
    applyThemeSettings();
    if (settings.mode === 'system') {
      const media = window.matchMedia('(prefers-color-scheme: dark)');
      media.addEventListener('change', applyThemeSettings);
      return () => media.removeEventListener('change', applyThemeSettings);
    }
  }, [settings.mode]);

  const cycleTheme = () => {
    // just a quick toggle for when the user clicks the theme button
    const nextMode = actualTheme === 'light' ? 'dark' : 'light';
    setSettings(prev => ({ ...prev, mode: nextMode }));
  };

  useEffect(() => {
    const root = window.document.documentElement;
    const h = settings.accent === 'custom' ? settings.hue : 
             settings.accent === 'blue' ? 220 :
             settings.accent === 'green' ? 140 :
             settings.accent === 'red' ? 0 :
             settings.accent === 'purple' ? 284 :
             settings.accent === 'orange' ? 30 : 220;
    root.style.setProperty('--primary-hue', h.toString());
    if (settings.brutalistMode) root.classList.add('brutalist-mode');
    else root.classList.remove('brutalist-mode');
    if (settings.developerFont) root.classList.add('developer-font');
    else root.classList.remove('developer-font');
    if (settings.focusMode) root.classList.add('focus-mode');
    else root.classList.remove('focus-mode');
    localStorage.setItem('virex-settings', JSON.stringify(settings));

    // this updates the favicon color so it matches the theme accent
    const primaryColor = actualTheme === 'dark' ? `oklch(0.8 0.12 ${h})` : `oklch(0.6 0.15 ${h})`;
    const faviconSvg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path 
          d="M 137.26,35.21 C 126.39,35.74 116.89,43.33 111.96,52.8 L 98.25,80.92 C 96.69,83.98 97.07,87.19 98.58,90.01 L 104.46,101.41 L 123.78,61.61 C 125.29,58.25 127.83,57.72 129.96,58.93 C 132.35,60.29 132.4,63.06 131.04,66.02 L 99.61,130.61 L 63.09,53.75 C 60.55,48.35 55.91,46.94 51.42,47.37 C 44.01,48.05 40.01,55.79 42.24,62.54 L 88.11,157.21 C 90.8,162.19 95.14,164.28 99.92,164.12 C 105.28,163.91 109.07,160.86 111.61,155.73 L 156.03,66.02 C 162.87,53.01 155.16,34.9 137.26,35.21 Z" 
          fill="${primaryColor}"
          stroke="${primaryColor}"
          stroke-width="4"
          stroke-linejoin="round"
          transform="translate(100, 100) scale(1.3) translate(-100, -100)"
        />
      </svg>
    `.trim();

    const faviconLink = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (faviconLink) {
      faviconLink.href = `data:image/svg+xml;utf8,${encodeURIComponent(faviconSvg)}`;
    }
  }, [settings, actualTheme]);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, actualTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) throw new Error('useTheme must be used within ThemeProvider');
  return context;
}
