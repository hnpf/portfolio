import React, { createContext, useContext, useEffect, useState, useLayoutEffect } from 'react';

type ThemeMode = 'light' | 'dark' | 'system';
type AccentColor = 'orange' | 'green' | 'red' | 'purple' | 'blue' | 'virex' | 'custom';

interface ThemeSettings {
  mode: ThemeMode;
  accent: AccentColor;
  hue: number;
  saturation: number;
  sidebarFlipped: boolean;
  sidebarCollapsed: boolean;
  profileContainer: boolean;
  brutalistMode: boolean;
  developerFont: boolean;
  focusMode: boolean;
  floatingSidebar: boolean;
  debugMode: boolean;
  helloAnimation: boolean;
  disableAnimations: boolean;
  highHz: boolean;
  amoledMode: boolean;
  bentoTilt: boolean;
}

interface ThemeContextType {
  settings: ThemeSettings;
  updateSettings: (newSettings: Partial<ThemeSettings>) => void;
  actualTheme: 'light' | 'dark';
  cycleTheme: () => void;
}

const DEFAULT_SETTINGS: ThemeSettings = {
  mode: 'system',
  accent: 'virex',
  hue: 360,
  saturation: 84,
  sidebarFlipped: false,
  sidebarCollapsed: false,
  profileContainer: false,
  brutalistMode: false,
  developerFont: false,
  focusMode: false,
  floatingSidebar: false,
  debugMode: false,
  helloAnimation: true,
  disableAnimations: false,
  highHz: true,
  amoledMode: false,
  bentoTilt: true,
};

// lookup is cleaner than a ternary chain here
const ACCENT_HUES: Record<AccentColor, number> = {
  blue: 240,
  green: 150,
  red: 0,
  purple: 300,
  orange: 30,
  virex: 360,
  custom: 220, // overridden below when custom is active
};

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

const IS_APR = (() => {
  const now = new Date();
  return now.getMonth() === 3 && now.getDate() === 1;
})();

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [settings, setSettings] = useState<ThemeSettings>(() => {
    const saved = localStorage.getItem('virex-settings');
    const base = saved ? { ...DEFAULT_SETTINGS, ...JSON.parse(saved) } : DEFAULT_SETTINGS;
    if (IS_APR) {
      return { ...base, mode: 'light', accent: 'custom', hue: 108 };
    }
    return base;
  });
  const [actualTheme, setActualTheme] = useState<'light' | 'dark'>('dark');

  useLayoutEffect(() => {
    const root = document.documentElement;
    const apply = () => {
      let resolved = settings.mode === 'system'
        ? (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light')
        : settings.mode;
      
      if (IS_APR) resolved = 'light';

      setActualTheme(resolved);
      root.classList.toggle('dark', resolved === 'dark');
    };
    apply();
    if (settings.mode === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      mq.addEventListener('change', apply);
      return () => mq.removeEventListener('change', apply);
    }
  }, [settings.mode]);

  useEffect(() => {
    if (!IS_APR) return;
    // cursed fish cursor
    const style = document.createElement('style');
    style.innerHTML = `
      * { cursor: url('/fsh-spin.gif'), auto !important; }
      img { animation: fsh-blink 0.4s infinite !important; }
      @keyframes fsh-blink { 0% { opacity: 1; } 50% { opacity: 0; } 100% { opacity: 1; } }
    `;
    document.head.appendChild(style);
    return () => { style.remove(); };
  }, []);

  const cycleTheme = () => {
    if (IS_APR) return; // no escape lol
    const nextTheme = actualTheme === 'light' ? 'dark' : 'light';
    console.log("cycling theme to", nextTheme, "lmao");
    setSettings(prev => ({ ...prev, mode: nextTheme }));
  };

  useLayoutEffect(() => {
    console.log("applying theme settings... mode:", settings.mode, "accent:", settings.accent);
    const root = document.documentElement;
    const h = settings.accent === 'custom' ? settings.hue : ACCENT_HUES[settings.accent];
    const s = settings.accent === 'custom' ? settings.saturation : settings.accent === 'virex' ? 84 : 100;
    
    root.style.setProperty('--primary-hue', h.toString());
    root.style.setProperty('--primary-chroma', (s / 100 * 0.3).toFixed(3));

    root.classList.toggle('brutalist-mode', settings.brutalistMode);
    root.classList.toggle('developer-font', settings.developerFont);
    root.classList.toggle('focus-mode', settings.focusMode);
    root.classList.toggle('debug-mode', settings.debugMode);
    root.classList.toggle('amoled-mode', settings.amoledMode);
    root.classList.toggle('bento-tilt', settings.bentoTilt);

    localStorage.setItem('virex-settings', JSON.stringify(settings));

    // updates favicon color to match the accent, kinda obvious but genius
    // like tell me who tf else does this 😭
    const color = actualTheme === 'dark' ? `oklch(0.8 0.12 ${h})` : `oklch(0.6 0.15 ${h})`;
    const svg = `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200">
        <path 
          d="M 137.26,35.21 C 126.39,35.74 116.89,43.33 111.96,52.8 L 98.25,80.92 C 96.69,83.98 97.07,87.19 98.58,90.01 L 104.46,101.41 L 123.78,61.61 C 125.29,58.25 127.83,57.72 129.96,58.93 C 132.35,60.29 132.4,63.06 131.04,66.02 L 99.61,130.61 L 63.09,53.75 C 60.55,48.35 55.91,46.94 51.42,47.37 C 44.01,48.05 40.01,55.79 42.24,62.54 L 88.11,157.21 C 90.8,162.19 95.14,164.28 99.92,164.12 C 105.28,163.91 109.07,160.86 111.61,155.73 L 156.03,66.02 C 162.87,53.01 155.16,34.9 137.26,35.21 Z" 
          fill="${color}"
          stroke="${color}"
          stroke-width="4"
          stroke-linejoin="round"
          transform="translate(100, 100) scale(1.3) translate(-100, -100)"
        />
      </svg>
    `.trim();

    const favicon = document.querySelector('link[rel="icon"]') as HTMLLinkElement;
    if (favicon) favicon.href = `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }, [settings, actualTheme]);

  const updateSettings = (newSettings: Partial<ThemeSettings>) => {
    console.log("updating settings with:", newSettings);
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  return (
    <ThemeContext.Provider value={{ settings, updateSettings, actualTheme, cycleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used within ThemeProvider');
  return ctx;
}
