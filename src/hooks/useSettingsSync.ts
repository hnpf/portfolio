import { useEffect } from 'react';
import { useTheme } from '../ThemeContext';

export const useSettingsSync = (setToast: (msg: string | null) => void) => {
  const { settings, updateSettings } = useTheme();

  // Parse sharing capsule from URL search params on startup
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const capsule = params.get("theme") || params.get("capsule");
    if (capsule) {
      try {
        const decoded = JSON.parse(atob(capsule));
        const validatedSettings: Partial<typeof settings> = {};
        
        const keys: (keyof typeof settings)[] = [
          "mode", "accent", "hue", "saturation", "sidebarFlipped",
          "sidebarCollapsed", "profileContainer", "brutalistMode",
          "developerFont", "focusMode", "floatingSidebar", "debugMode",
          "helloAnimation", "disableAnimations", "highHz", "amoledMode",
          "bentoTilt"
        ];
        
        for (const k of keys) {
          if (decoded[k] !== undefined) {
            (validatedSettings as any)[k] = decoded[k];
          }
        }
        
        updateSettings(validatedSettings);
        setToast("Theme loaded from Sharing Capsule! ✨");
        
        const cleanUrl = window.location.pathname;
        window.history.replaceState({}, document.title, cleanUrl);
      } catch (e) {
        console.error("oh shit, capsule decoding failed! probably corrupted.", e);
      }
    }
  }, [updateSettings, setToast]);
};
