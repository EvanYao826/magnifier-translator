import { useEffect, useState } from 'react';
import { getUserSettings, saveUserSettings } from '../utils/storage';

interface Language {
  code: string;
  name: string;
}

const supportedLanguages: Language[] = [
  { code: 'zh-CN', name: '中文（简体）' },
  { code: 'en', name: '英语' },
  { code: 'ja', name: '日语' },
  { code: 'ko', name: '韩语' },
  { code: 'fr', name: '法语' },
  { code: 'de', name: '德语' },
  { code: 'es', name: '西班牙语' },
  { code: 'ru', name: '俄语' }
];

function Options() {
  const [targetLanguage, setTargetLanguage] = useState('zh-CN');
  const [status, setStatus] = useState<{ message: string; type: 'success' | 'error' } | null>(null);

  useEffect(() => {
    void loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getUserSettings();
    setTargetLanguage(settings.targetLanguage);
  };

  const handleSave = async () => {
    try {
      await saveUserSettings({ targetLanguage });
      setStatus({ message: '语言设置已保存，重新选词即可看到新结果。', type: 'success' });

      window.setTimeout(() => {
        setStatus(null);
      }, 3000);
    } catch {
      setStatus({ message: '保存失败，请重试。', type: 'error' });
    }
  };

  return (
    <div className="options-container">
      <div className="options-header">
        <h1 className="options-title">Magnifier Translator</h1>
        <p className="options-subtitle">设置选词翻译的目标语言</p>
      </div>

      <div className="option-group">
        <h2 className="option-group-title">翻译语言</h2>

        <div className="option-item">
          <label className="option-label">目标语言</label>
          <select
            className="option-select"
            value={targetLanguage}
            onChange={(e) => setTargetLanguage(e.target.value)}
          >
            {supportedLanguages.map(lang => (
              <option key={lang.code} value={lang.code}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>

        <button className="save-button" onClick={handleSave}>
          保存设置
        </button>

        {status && (
          <div className={`status-message ${status.type}`}>
            {status.message}
          </div>
        )}
      </div>
    </div>
  );
}

export default Options;
