/**
 * 离线翻译服务
 * 使用优化后的词典系统进行翻译
 */

interface DictionaryEntry {
  word: string;
  phonetic?: string;
  translation: string;
}

interface DictionaryData {
  version: string;
  type: string;
  count: number;
  words: DictionaryEntry[];
}

let dictionaryData: DictionaryData | null = null;
let dictionaryLoadPromise: Promise<void> | null = null;
const wordIndex = new Map<string, DictionaryEntry>();

export async function loadDictionary(): Promise<void> {
  if (dictionaryData) return;
  if (dictionaryLoadPromise) return dictionaryLoadPromise;

  dictionaryLoadPromise = (async () => {
    try {
      // 优先加载迷你词典，减少加载时间和失败概率
      // 为迷你词典加载添加超时设置（5秒）
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 5000);
      
      const response = await fetch(chrome.runtime.getURL('data/dictionary-mini.json'), {
        signal: controller.signal
      });
      
      clearTimeout(timeoutId);
      
      if (!response.ok) {
        throw new Error(`迷你词典加载失败: HTTP ${response.status}`);
      }
      
      const data = await response.json() as DictionaryData;

      wordIndex.clear();
      data.words.forEach(entry => {
        wordIndex.set(entry.word.toLowerCase(), entry);
      });

      dictionaryData = data;
      console.log(`离线词典已加载（迷你版）: ${data.count} 个词条`);
    } catch (error) {
      console.warn('迷你词典加载失败，尝试加载大型词典:', error);
      try {
        // 为大型词典加载添加超时设置（10秒）
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000);
        
        const response = await fetch(chrome.runtime.getURL('data/dictionary-large.json'), {
          signal: controller.signal
        });
        
        clearTimeout(timeoutId);
        
        if (!response.ok) {
          throw new Error(`大型词典加载失败: HTTP ${response.status}`);
        }
        
        const data = await response.json() as DictionaryData;

        wordIndex.clear();
        data.words.forEach(entry => {
          wordIndex.set(entry.word.toLowerCase(), entry);
        });

        dictionaryData = data;
        console.log(`离线词典已加载: ${data.count} 个词条`);
      } catch (fallbackError) {
        console.error('所有词典加载失败:', fallbackError);
        // 即使词典加载失败，也不抛出错误，而是继续执行
      }
    }
  })();

  try {
    await dictionaryLoadPromise;
  } finally {
    dictionaryLoadPromise = null;
  }
}

export async function getOfflineTranslation(word: string): Promise<DictionaryEntry | null> {
  if (!dictionaryData) {
    try {
      await loadDictionary();
    } catch {
      return null;
    }
  }

  if (!dictionaryData) {
    return null;
  }

  let entry: DictionaryEntry | null = wordIndex.get(word.toLowerCase()) ?? null;

  if (!entry && word.length > 3) {
    entry = findWordVariation(word);
  }

  return entry || null;
}

function findWordVariation(word: string): DictionaryEntry | null {
  const lowerWord = word.toLowerCase();

  const variations = [
    lowerWord.endsWith('s') ? lowerWord.slice(0, -1) : null,
    lowerWord.endsWith('ed') ? lowerWord.slice(0, -2) : null,
    lowerWord.endsWith('ing') ? lowerWord.slice(0, -3) : null,
    lowerWord.endsWith('er') ? lowerWord.slice(0, -2) : null,
    lowerWord.endsWith('est') ? lowerWord.slice(0, -3) : null,
  ];

  for (const variation of variations) {
    if (variation && wordIndex.has(variation)) {
      const baseEntry = wordIndex.get(variation)!;
      return {
        ...baseEntry,
        word
      };
    }
  }

  return null;
}

export function getWordForms(word: string): string[] {
  const entry = wordIndex.get(word.toLowerCase());
  return entry ? [entry.word] : [word];
}

export function isOfflineTranslationSupported(): boolean {
  return dictionaryData !== null;
}

export function getDictionaryStats(): { type: string; count: number } | null {
  if (!dictionaryData) return null;
  return {
    type: dictionaryData.type,
    count: dictionaryData.count
  };
}

export function getCurrentDictionaryLevel(): string {
  if (!dictionaryData) return 'unloaded';
  return dictionaryData.type;
}