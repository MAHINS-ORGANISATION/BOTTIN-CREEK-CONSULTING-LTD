import React, { createContext, useCallback, useContext, useMemo, useState } from 'react';
import { useColorScheme as useSystemColorScheme } from 'react-native';

export type ThemePreference = 'system' | 'light' | 'dark';

type PreferencesContextValue = {
  themePreference: ThemePreference;
  setThemePreference: (v: ThemePreference) => void;
  resolvedScheme: 'light' | 'dark';
};

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: React.ReactNode }) {
  const system = useSystemColorScheme();
  const [themePreference, setThemePreferenceState] = useState<ThemePreference>('system');

  const setThemePreference = useCallback((v: ThemePreference) => {
    setThemePreferenceState(v);
  }, []);

  const resolvedScheme: 'light' | 'dark' = useMemo(() => {
    if (themePreference === 'light' || themePreference === 'dark') return themePreference;
    return system === 'dark' ? 'dark' : 'light';
  }, [themePreference, system]);

  const value = useMemo(
    () => ({ themePreference, setThemePreference, resolvedScheme }),
    [themePreference, setThemePreference, resolvedScheme]
  );

  return <PreferencesContext.Provider value={value}>{children}</PreferencesContext.Provider>;
}

export function usePreferences() {
  const ctx = useContext(PreferencesContext);
  if (!ctx) throw new Error('usePreferences must be used within PreferencesProvider');
  return ctx;
}

export function useAppColorScheme(): 'light' | 'dark' {
  return usePreferences().resolvedScheme;
}
