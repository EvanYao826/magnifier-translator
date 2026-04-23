import { getOfflineTranslation } from './offline-translation';

// 备用翻译服务：Google Translate 公共接口（无需 API Key）
export async function translateText(text: string, targetLang: string = 'zh-CN'): Promise<string> {
  // 优先尝试离线翻译
  const offlineResult = await getOfflineTranslation(text);
  if (offlineResult) {
    return offlineResult.translation;
  }

  // 如果离线翻译失败，使用在线翻译
  const sourceLang = 'auto';

  const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLang}&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;

  try {
    // 添加超时设置（5秒）
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000);
    
    const response = await fetch(url, {
      signal: controller.signal
    });
    
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    const data = await response.json();
    // 返回格式: [[["翻译结果","原文",...]]]
    if (data && data[0] && data[0][0] && data[0][0][0]) {
      return data[0][0][0];
    }
    throw new Error('无效的响应格式');
  } catch (error) {
    console.warn('Google Translate API 失败，返回原文:', error);
    // 降级：返回原词（避免空白）
    return text;
  }
}

export { getOfflineTranslation };