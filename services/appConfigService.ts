
// This service simulates fetching configuration from a remote server.
// It is essential for implementing operational logic from the Remote Config & Disaster Recovery PRDs.

import { AppConfig } from "../types";

type AppEnv = 'development' | 'staging' | 'production';

// The configuration that would be fetched from a remote source like Firebase Remote Config
const remoteConfig: AppConfig = {
    minVersion: "1.0.0",
    latestVersion: "1.2.1",
    forceUpdate: false,
    maintenanceMode: false,
    bannerMessage: "",
    criticalAlert: "",
    featureFlags: {
        enable_24hr: true,
        enable_stock: true,
        enable_ai_chat: true,
    }
};

// A fallback configuration to be used if the remote fetch fails.
// This allows the app to run in a "safe mode" with critical/online features disabled.
const fallbackConfig: AppConfig = {
    minVersion: "1.0.0",
    latestVersion: "1.0.0",
    forceUpdate: false,
    maintenanceMode: false,
    bannerMessage: "",
    criticalAlert: "",
    featureFlags: {
        enable_24hr: true,
        enable_stock: true,
        enable_ai_chat: false, // Disable online-only features
    }
};

class AppConfigService {
    private readonly APP_VERSION = '1.1.2';
    private readonly APP_ENV: AppEnv = 'development';
    
    private config: AppConfig = fallbackConfig;

    public getCurrentVersion(): string {
        return this.APP_VERSION;
    }

    public getAppEnv(): AppEnv {
        return this.APP_ENV;
    }

    public getConfig(): AppConfig {
        return this.config;
    }

    /**
     * Simulates fetching the configuration from a remote server.
     * Includes a 500ms delay to mimic network latency.
     * Implements failover logic by returning a safe fallback config on failure.
     */
    public async fetchConfig(): Promise<AppConfig> {
        return new Promise((resolve) => {
            setTimeout(() => {
                try {
                    // In a real app, this is where you'd make a network request.
                    // We'll use the hardcoded remoteConfig for this simulation.
                    const fetchedConfig = remoteConfig;

                    // Compare app version with the fetched minimum required version
                    const isUpdateNeeded = this.isUpdateRequired(this.APP_VERSION, fetchedConfig.minVersion);
                    
                    this.config = {
                        ...fetchedConfig,
                        forceUpdate: isUpdateNeeded,
                    };
                    
                    console.log("Remote config fetched successfully:", this.config);
                    resolve(this.config);

                } catch (error) {
                    console.error("Failed to fetch remote config, using fallback.", error);
                    this.config = fallbackConfig; // Use failover config
                    resolve(this.config);
                }
            }, 500);
        });
    }

    /**
     * Compares the current app version with the required version.
     * @param currentVersion - The running app's version (e.g., "1.1.2").
     * @param requiredVersion - The minimum required version from remote config (e.g., "1.2.0").
     * @returns {boolean} - True if an update is required, otherwise false.
     */
    private isUpdateRequired(currentVersion: string, requiredVersion: string): boolean {
        const current = currentVersion.split('.').map(Number);
        const required = requiredVersion.split('.').map(Number);

        for (let i = 0; i < required.length; i++) {
            if (current[i] < (required[i] || 0)) {
                return true;
            }
            if (current[i] > (required[i] || 0)) {
                return false;
            }
        }

        return false;
    }
}

export const appConfigService = new AppConfigService();