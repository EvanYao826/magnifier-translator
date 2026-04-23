import { getOfflineTranslation, translateText } from '../utils/translation';
import { getUserSettings, type UserSettings } from '../utils/storage';

interface TranslationResult {
  text: string;
  phonetic?: string;
  pos?: string;
  isOffline: boolean;
}

interface SelectionMatch {
  word: string;
  rect: DOMRect;
}

const WORD_PATTERN = /^[A-Za-z][A-Za-z'-]*$/;
const tooltipOffset = 12;
const translationCache = new Map<string, TranslationResult>();

let settings: UserSettings = {
  targetLanguage: 'zh-CN',
  enabled: true
};
let tooltipElement: HTMLDivElement | null = null;
let activeRequestId = 0;
let selectedWord = '';

void initialize();

async function initialize() {
  try {
    settings = await getUserSettings();
    console.log('用户设置加载成功:', settings);
  } catch (error) {
    console.warn('获取用户设置失败，使用默认设置:', error);
    // 确保使用默认设置
    settings = {
      targetLanguage: 'zh-CN',
      enabled: true
    };
  }

  try {
    chrome.storage.onChanged.addListener((changes, areaName) => {
      if (areaName !== 'local') return;

      if (changes.targetLanguage?.newValue) {
        settings.targetLanguage = changes.targetLanguage.newValue;
        clearTranslationCache();
        hideTooltip();
        console.log('目标语言已更新为:', changes.targetLanguage.newValue);
      }

      if (typeof changes.enabled?.newValue === 'boolean') {
        settings.enabled = changes.enabled.newValue;
        console.log('插件状态已更新为:', changes.enabled.newValue ? '启用' : '禁用');
        if (!settings.enabled) {
          clearActiveSelection();
          hideTooltip();
        }
      }
    });
  } catch (error) {
    console.warn('添加存储变更监听器失败:', error);
  }

  try {
    document.addEventListener('dblclick', handleSelectionTrigger);
    document.addEventListener('mouseup', handleSelectionTrigger);
    document.addEventListener('selectionchange', handleSelectionChange);
    document.addEventListener('scroll', hideTooltip, true);
    document.addEventListener('mousedown', handlePointerDown, true);
    window.addEventListener('blur', hideTooltip);
    document.addEventListener('visibilitychange', () => {
      if (document.hidden) {
        hideTooltip();
      }
    });
    console.log('事件监听器已成功添加');
  } catch (error) {
    console.warn('添加事件监听器失败:', error);
  }
}

async function getTranslation(word: string): Promise<TranslationResult> {
  const normalizedWord = word.toLowerCase();
  const cacheKey = `${settings.targetLanguage}:${normalizedWord}`;
  const cached = translationCache.get(cacheKey);

  if (cached) {
    console.log('从缓存获取翻译结果:', word);
    return cached;
  }

  try {
    console.log('开始翻译:', word);
    // 优先尝试离线翻译
    const offlineResult = await getOfflineTranslation(normalizedWord);
    if (offlineResult) {
      console.log('离线词典翻译成功:', word);
      const result: TranslationResult = {
        text: offlineResult.translation,
        phonetic: offlineResult.phonetic,
        isOffline: true
      };
      translationCache.set(cacheKey, result);
      return result;
    }

    console.log('离线词典无结果，尝试在线翻译:', word);
    // 在线翻译添加超时处理
    try {
      const translatedText = await translateText(normalizedWord, settings.targetLanguage);
      const result: TranslationResult = {
        text: translatedText,
        isOffline: false
      };
      console.log('在线翻译成功:', word, '->', translatedText);
      translationCache.set(cacheKey, result);
      return result;
    } catch (onlineError) {
      console.warn('在线翻译失败，使用离线词典兜底:', onlineError);
      // 再次尝试离线翻译，确保没有遗漏
      const offlineResultAgain = await getOfflineTranslation(normalizedWord);
      if (offlineResultAgain) {
        const result: TranslationResult = {
          text: offlineResultAgain.translation,
          phonetic: offlineResultAgain.phonetic,
          isOffline: true
        };
        translationCache.set(cacheKey, result);
        return result;
      }
      // 所有翻译都失败
      const result: TranslationResult = {
        text: '翻译失败，请检查网络连接或稍后重试',
        isOffline: false
      };
      translationCache.set(cacheKey, result);
      return result;
    }
  } catch (error) {
    console.warn('翻译失败，显示错误信息:', error);
    const result: TranslationResult = {
      text: '翻译失败，请检查网络连接或稍后重试',
      isOffline: false
    };
    translationCache.set(cacheKey, result);
    return result;
  }
}

function handleSelectionChange() {
  if (!settings.enabled) return;

  const match = getSelectionMatch();
  if (!match) {
    clearActiveSelection();
    hideTooltip();
  }
}

function handleSelectionTrigger() {
  if (!settings.enabled) return;

  const match = getSelectionMatch();
  if (!match) {
    clearActiveSelection();
    hideTooltip();
    return;
  }

  if (selectedWord === match.word && tooltipElement) {
    positionTooltip(tooltipElement, match.rect);
    return;
  }

  void showSelectionTranslation(match);
}

async function showSelectionTranslation(match: SelectionMatch) {
  selectedWord = match.word;
  const requestId = ++activeRequestId;
  
  try {
    console.log('开始处理选择翻译:', match.word);
    const translation = await getTranslation(match.word);

    if (requestId !== activeRequestId || selectedWord !== match.word) {
      console.log('翻译请求已过期，忽略结果:', match.word);
      return;
    }

    if (!translation.text || translation.text.toLowerCase() === match.word.toLowerCase()) {
      console.log('翻译结果为空或与原文相同，隐藏tooltip:', match.word);
      hideTooltip();
      return;
    }

    console.log('准备显示翻译结果:', match.word, '->', translation.text);
    renderTooltip(match, translation);
  } catch (error) {
    console.warn('显示翻译失败:', error);
    hideTooltip();
  }
}

function clearActiveSelection() {
  selectedWord = '';
  activeRequestId += 1;
}

function clearTranslationCache() {
  translationCache.clear();
}

function hideTooltip() {
  if (tooltipElement) {
    tooltipElement.remove();
    tooltipElement = null;
  }
}

function handlePointerDown(event: MouseEvent) {
  const target = event.target;
  if (target instanceof HTMLElement && target.closest('.magnifier-translator')) {
    return;
  }

  if (!window.getSelection()?.toString().trim()) {
    clearActiveSelection();
    hideTooltip();
  }
}

function renderTooltip(match: SelectionMatch, translation: TranslationResult) {
  hideTooltip();

  const container = document.createElement('div');
  container.className = 'magnifier-translator';
  container.innerHTML = createTooltipContent(match.word, translation);
  document.body.appendChild(container);
  positionTooltip(container, match.rect);
  tooltipElement = container;
}

function positionTooltip(container: HTMLDivElement, rect: DOMRect) {
  const tooltipRect = container.getBoundingClientRect();
  let left = rect.left + rect.width / 2 - tooltipRect.width / 2;
  let top = rect.bottom + tooltipOffset;

  if (left < 12) {
    left = 12;
  }

  if (left + tooltipRect.width > window.innerWidth - 12) {
    left = window.innerWidth - tooltipRect.width - 12;
  }

  if (top + tooltipRect.height > window.innerHeight - 12) {
    top = rect.top - tooltipRect.height - tooltipOffset;
  }

  if (top < 12) {
    top = 12;
  }

  container.style.left = `${left}px`;
  container.style.top = `${top}px`;
}

function createTooltipContent(word: string, translation: TranslationResult) {
  const sourceLabel = translation.isOffline ? '离线词典' : '在线翻译';

  return [
    `<div class="original">${escapeHtml(word)}</div>`,
    `<div class="translated">${escapeHtml(translation.text)}</div>`,
    translation.phonetic ? `<div class="phonetic">[${escapeHtml(translation.phonetic)}]</div>` : '',
    translation.pos ? `<div class="pos">${escapeHtml(translation.pos)}</div>` : '',
    `<div class="source">${sourceLabel}</div>`
  ].join('');
}

function getSelectionMatch(): SelectionMatch | null {
  const selection = window.getSelection();
  if (!selection || selection.rangeCount === 0 || selection.isCollapsed) {
    return null;
  }

  const text = normalizeSelectedWord(selection.toString());
  if (!text) {
    return null;
  }

  const range = selection.getRangeAt(0).cloneRange();
  const rect = getRangeRect(range);
  if (!rect) {
    return null;
  }

  const anchorElement = getSelectionContainerElement(range);
  if (!anchorElement || isEditableElement(anchorElement) || anchorElement.closest('.magnifier-translator')) {
    return null;
  }

  return { word: text, rect };
}

function normalizeSelectedWord(text: string) {
  const trimmed = text.trim();
  if (!trimmed || trimmed.length > 40) {
    return null;
  }

  if (!WORD_PATTERN.test(trimmed)) {
    return null;
  }

  return trimmed;
}

function getRangeRect(range: Range): DOMRect | null {
  const rects = Array.from(range.getClientRects());
  const visibleRect = rects.find(rect => rect.width > 0 || rect.height > 0);
  return visibleRect ?? (range.getBoundingClientRect().width || range.getBoundingClientRect().height ? range.getBoundingClientRect() : null);
}

function getSelectionContainerElement(range: Range): HTMLElement | null {
  const container = range.commonAncestorContainer;
  if (container instanceof HTMLElement) {
    return container;
  }

  return container.parentElement;
}

function isEditableElement(element: HTMLElement) {
  return element.isContentEditable || element instanceof HTMLInputElement || element instanceof HTMLTextAreaElement;
}

function escapeHtml(text: string) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}