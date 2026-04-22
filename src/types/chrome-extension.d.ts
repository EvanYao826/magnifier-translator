declare namespace chrome.translation {
  interface TranslateOptions {
    srcLang?: string;
    destLang: string;
    callback?: (translatedText: string, response: TranslateResponse) => void;
  }

  interface TranslateResponse {
    translatedText: string;
    sourceLanguage: string;
    status: number;
  }

  function translate(text: string | string[], options: TranslateOptions): void;
  function isPageTranslated(callback: (isTranslated: boolean) => void): void;
  function getLanguageNames(languageCodes: string | string[], callback: (languageNames: string[]) => void): void;
  function getSupportedLanguages(callback: (languages: Language[]) => void): void;

  interface Language {
    code: string;
    name: string;
  }
}

declare namespace chrome.runtime {
  function sendMessage(message: any, callback?: (response: any) => void): void;
  const onMessage:
    chrome.events.Event<(message: any, sender: MessageSender, sendResponse: (response?: any) => void) => void>;

  interface MessageSender {
    tab?: chrome.tabs.Tab;
    id?: string;
    url?: string;
  }
}

declare namespace chrome.storage {
  namespace local {
    function get<T>(keys: string | string[] | object, callback: (items: T) => void): void;
    function set(items: object, callback?: () => void): void;
  }
}