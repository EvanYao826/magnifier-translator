export interface UserSettings {
  targetLanguage: string;
  enabled: boolean;
}

const DEFAULT_SETTINGS: UserSettings = {
  targetLanguage: 'zh-CN',
  enabled: true
};

export async function getUserSettings(): Promise<UserSettings> {
  return new Promise((resolve) => {
    chrome.storage.local.get(['targetLanguage', 'enabled'], (items) => {
      const typedItems = items as { targetLanguage?: string; enabled?: boolean };
      resolve({
        targetLanguage: typedItems.targetLanguage || DEFAULT_SETTINGS.targetLanguage,
        enabled: typedItems.enabled !== false
      });
    });
  });
}

export async function saveUserSettings(settings: Partial<UserSettings>): Promise<void> {
  return new Promise((resolve) => {
    chrome.storage.local.set(settings, resolve);
  });
}