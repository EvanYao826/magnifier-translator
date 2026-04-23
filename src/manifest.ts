import { defineManifest } from '@crxjs/vite-plugin'

export default defineManifest({
  manifest_version: 3,
  name: 'Magnifier Translator',
  description: 'Selected-word translation browser extension with offline-first tooltip lookup.',
  version: '1.0.0',
  permissions: ['storage'],
  host_permissions: ['https://translate.googleapis.com/*'],
  web_accessible_resources: [
    {
      resources: ['data/dictionary-mini.json', 'data/dictionary-large.json'],
      matches: ['<all_urls>'],
      use_dynamic_url: false
    }
  ],
  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/content-script.tsx'],
      css: ['src/content/styles.css']
    }
  ],
  action: {
    default_popup: 'src/popup/popup.html',
    default_title: 'Magnifier Translator'
  },
  options_page: 'src/options/options.html'
})
