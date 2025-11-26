
import { useState, useEffect, useCallback } from 'react';
import { AppearanceSettings, Theme, FontSize } from '../types';

const APPEARANCE_STORAGE_KEY = 'nutritionWiseAppearanceSettings';

const defaultSettings: AppearanceSettings = {
  theme: 'system',
  fontSize: 'medium',
  boldText: false,
};

export const useTheme = () => {
    const [settings, setSettings] = useState<AppearanceSettings>(() => {
        try {
            const saved = localStorage.getItem(APPEARANCE_STORAGE_KEY);
            // Merge saved settings with defaults to ensure all keys are present
            return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
        } catch {
            return defaultSettings;
        }
    });

    const applySettings = useCallback((s: AppearanceSettings) => {
        const root = document.documentElement;
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

        // Apply theme using Tailwind's class-based dark mode
        const shouldUseDark = s.theme === 'dark' || (s.theme === 'system' && mediaQuery.matches);
        root.classList.toggle('dark', shouldUseDark);
        // Keep data-theme for compatibility
        root.setAttribute('data-theme', shouldUseDark ? 'dark' : 'light');

        // Apply font size
        root.setAttribute('data-font-size', s.fontSize);

        // Apply bold text
        root.setAttribute('data-bold-text', String(s.boldText));

    }, []);

    useEffect(() => {
        applySettings(settings);

        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleSystemThemeChange = (e: MediaQueryListEvent) => {
            if (settings.theme === 'system') {
                const root = document.documentElement;
                root.classList.toggle('dark', e.matches);
                root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
            }
        };

        mediaQuery.addEventListener('change', handleSystemThemeChange);

        return () => {
            mediaQuery.removeEventListener('change', handleSystemThemeChange);
        };
    }, [settings, applySettings]);

    const changeAppearance = (newSettings: Partial<AppearanceSettings>) => {
        setSettings(prev => {
            const updatedSettings = { ...prev, ...newSettings };
            try {
                localStorage.setItem(APPEARANCE_STORAGE_KEY, JSON.stringify(updatedSettings));
            } catch (error) {
                console.error('Failed to save appearance settings to localStorage', error);
            }
            return updatedSettings;
        });
    };

    return { settings, changeAppearance };
};
