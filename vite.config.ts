import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { crx } from '@crxjs/vite-plugin'
import manifest from './src/manifest'
import { copyFileSync, mkdirSync, existsSync } from 'fs'
import { join } from 'path'

function copyDictionaryFiles() {
  const srcDir = join(__dirname, 'src', 'data')
  const destDir = join(__dirname, 'dist', 'data')

  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true })
  }

  try {
    copyFileSync(join(srcDir, 'dictionary-mini.json'), join(destDir, 'dictionary-mini.json'))
    copyFileSync(join(srcDir, 'dictionary-large.json'), join(destDir, 'dictionary-large.json'))
    console.log('词典文件复制成功')
  } catch (error) {
    console.error('复制词典文件失败:', error)
  }
}

export default defineConfig({
  plugins: [
    react(),
    crx({ manifest }),
    {
      name: 'copy-dictionary-files',
      closeBundle() {
        copyDictionaryFiles()
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: 'src/popup/popup.html',
        options: 'src/options/options.html'
      }
    }
  }
})