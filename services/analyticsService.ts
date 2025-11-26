
import { AnalyticsSettings } from '../types';

const SETTINGS_STORAGE_KEY = 'nutritionWiseAnalyticsSettings';

const defaultSettings: AnalyticsSettings = {
    analyticsEnabled: true,
    crashReportsEnabled: true,
};

class AnalyticsService {
    private settings: AnalyticsSettings = defaultSettings;

    constructor() {
        this.loadSettings();
    }

    init() {
        console.log('Analytics Service Initialized with settings:', this.settings);
    }

    private loadSettings() {
        try {
            const savedSettings = localStorage.getItem(SETTINGS_STORAGE_KEY);
            this.settings = savedSettings ? JSON.parse(savedSettings) : defaultSettings;
        } catch (error) {
            console.error('Error loading analytics settings:', error);
            this.settings = defaultSettings;
        }
    }

    getSettings(): AnalyticsSettings {
        return this.settings;
    }

    updateSettings(newSettings: AnalyticsSettings) {
        this.settings = newSettings;
        try {
            localStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(newSettings));
            console.log('Analytics settings updated:', newSettings);
        } catch (error) {
            console.error('Error saving analytics settings:', error);
        }
    }

    logEvent(eventName: string, params?: Record<string, any>) {
        if (!this.settings.analyticsEnabled) {
            return; // User has opted out
        }

        if (eventName.includes('failed') || eventName.includes('error')) {
             if (!this.settings.crashReportsEnabled) {
                return; // User has opted out of error reporting
             }
        }

        console.log(`[ANALYTICS] Event: ${eventName}`, params || '');
    }
}

export const analyticsService = new AnalyticsService();
