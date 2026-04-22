import { useEffect, useState } from 'react';
import { getUserSettings, saveUserSettings } from '../utils/storage';

function Popup() {
  const [enabled, setEnabled] = useState(true);

  useEffect(() => {
    void loadSettings();
  }, []);

  const loadSettings = async () => {
    const settings = await getUserSettings();
    setEnabled(settings.enabled);
  };

  const toggleEnabled = async () => {
    const newEnabled = !enabled;
    setEnabled(newEnabled);
    await saveUserSettings({ enabled: newEnabled });
  };

  return (
    <div className="popup-container">
      <div className="popup-header">
        <div>
          <h2 className="popup-title">Magnifier Translator</h2>
          <p className="popup-subtitle">双击或选中英文单词后显示翻译</p>
        </div>
      </div>

      <div className="toggle-container">
        <div>
          <div className="toggle-label">启用选词翻译</div>
          <div className="toggle-description">关闭后页面内不会显示翻译气泡</div>
        </div>
        <label className="toggle-switch">
          <input
            type="checkbox"
            checked={enabled}
            onChange={toggleEnabled}
          />
          <span className="toggle-slider"></span>
        </label>
      </div>

      <a
        href="#"
        className="options-link"
        onClick={(e) => {
          e.preventDefault();
          chrome.runtime.openOptionsPage();
        }}
      >
        打开语言设置
      </a>
    </div>
  );
}

export default Popup;
