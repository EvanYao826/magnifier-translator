chrome.runtime.onInstalled.addListener(() => {
  chrome.storage.local.get(['targetLanguage', 'enabled'], (items) => {
    const typedItems = items as { targetLanguage?: string; enabled?: boolean };

    chrome.storage.local.set({
      targetLanguage: typedItems.targetLanguage ?? 'zh-CN',
      enabled: typedItems.enabled ?? true
    });
  });
});
