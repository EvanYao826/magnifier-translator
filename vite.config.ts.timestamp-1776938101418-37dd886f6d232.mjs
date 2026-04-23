// vite.config.ts
import { defineConfig } from "file:///E:/VSproject/Magnifier-Translator/node_modules/vite/dist/node/index.js";
import react from "file:///E:/VSproject/Magnifier-Translator/node_modules/@vitejs/plugin-react/dist/index.js";
import { crx } from "file:///E:/VSproject/Magnifier-Translator/node_modules/@crxjs/vite-plugin/dist/index.mjs";

// src/manifest.ts
import { defineManifest } from "file:///E:/VSproject/Magnifier-Translator/node_modules/@crxjs/vite-plugin/dist/index.mjs";
var manifest_default = defineManifest({
  manifest_version: 3,
  name: "Magnifier Translator",
  description: "Selected-word translation browser extension with offline-first tooltip lookup.",
  version: "1.0.0",
  permissions: ["storage"],
  host_permissions: ["https://translate.googleapis.com/*"],
  web_accessible_resources: [
    {
      resources: ["data/dictionary-mini.json"],
      matches: ["<all_urls>"],
      use_dynamic_url: false
    }
  ],
  content_scripts: [
    {
      matches: ["<all_urls>"],
      js: ["src/content/content-script.tsx"],
      css: ["src/content/styles.css"]
    }
  ],
  action: {
    default_popup: "src/popup/popup.html",
    default_title: "Magnifier Translator"
  },
  options_page: "src/options/options.html"
});

// vite.config.ts
import { copyFileSync, mkdirSync, existsSync } from "fs";
import { join } from "path";
var __vite_injected_original_dirname = "E:\\VSproject\\Magnifier-Translator";
function copyDictionaryFiles() {
  const srcDir = join(__vite_injected_original_dirname, "src", "data");
  const destDir = join(__vite_injected_original_dirname, "dist", "data");
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
  }
  try {
    copyFileSync(join(srcDir, "dictionary-mini.json"), join(destDir, "dictionary-mini.json"));
    copyFileSync(join(srcDir, "dictionary-large.json"), join(destDir, "dictionary-large.json"));
    console.log("\u8BCD\u5178\u6587\u4EF6\u590D\u5236\u6210\u529F");
  } catch (error) {
    console.error("\u590D\u5236\u8BCD\u5178\u6587\u4EF6\u5931\u8D25:", error);
  }
}
var vite_config_default = defineConfig({
  plugins: [
    react(),
    crx({ manifest: manifest_default }),
    {
      name: "copy-dictionary-files",
      closeBundle() {
        copyDictionaryFiles();
      }
    }
  ],
  build: {
    outDir: "dist",
    emptyOutDir: true,
    rollupOptions: {
      input: {
        popup: "src/popup/popup.html",
        options: "src/options/options.html"
      }
    }
  }
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcudHMiLCAic3JjL21hbmlmZXN0LnRzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRTpcXFxcVlNwcm9qZWN0XFxcXE1hZ25pZmllci1UcmFuc2xhdG9yXCI7Y29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2ZpbGVuYW1lID0gXCJFOlxcXFxWU3Byb2plY3RcXFxcTWFnbmlmaWVyLVRyYW5zbGF0b3JcXFxcdml0ZS5jb25maWcudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1ZTcHJvamVjdC9NYWduaWZpZXItVHJhbnNsYXRvci92aXRlLmNvbmZpZy50c1wiO2ltcG9ydCB7IGRlZmluZUNvbmZpZyB9IGZyb20gJ3ZpdGUnXHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCdcclxuaW1wb3J0IHsgY3J4IH0gZnJvbSAnQGNyeGpzL3ZpdGUtcGx1Z2luJ1xyXG5pbXBvcnQgbWFuaWZlc3QgZnJvbSAnLi9zcmMvbWFuaWZlc3QnXHJcbmltcG9ydCB7IGNvcHlGaWxlU3luYywgbWtkaXJTeW5jLCBleGlzdHNTeW5jIH0gZnJvbSAnZnMnXHJcbmltcG9ydCB7IGpvaW4gfSBmcm9tICdwYXRoJ1xyXG5cclxuZnVuY3Rpb24gY29weURpY3Rpb25hcnlGaWxlcygpIHtcclxuICBjb25zdCBzcmNEaXIgPSBqb2luKF9fZGlybmFtZSwgJ3NyYycsICdkYXRhJylcclxuICBjb25zdCBkZXN0RGlyID0gam9pbihfX2Rpcm5hbWUsICdkaXN0JywgJ2RhdGEnKVxyXG5cclxuICBpZiAoIWV4aXN0c1N5bmMoZGVzdERpcikpIHtcclxuICAgIG1rZGlyU3luYyhkZXN0RGlyLCB7IHJlY3Vyc2l2ZTogdHJ1ZSB9KVxyXG4gIH1cclxuXHJcbiAgdHJ5IHtcclxuICAgIGNvcHlGaWxlU3luYyhqb2luKHNyY0RpciwgJ2RpY3Rpb25hcnktbWluaS5qc29uJyksIGpvaW4oZGVzdERpciwgJ2RpY3Rpb25hcnktbWluaS5qc29uJykpXHJcbiAgICBjb3B5RmlsZVN5bmMoam9pbihzcmNEaXIsICdkaWN0aW9uYXJ5LWxhcmdlLmpzb24nKSwgam9pbihkZXN0RGlyLCAnZGljdGlvbmFyeS1sYXJnZS5qc29uJykpXHJcbiAgICBjb25zb2xlLmxvZygnXHU4QkNEXHU1MTc4XHU2NTg3XHU0RUY2XHU1OTBEXHU1MjM2XHU2MjEwXHU1MjlGJylcclxuICB9IGNhdGNoIChlcnJvcikge1xyXG4gICAgY29uc29sZS5lcnJvcignXHU1OTBEXHU1MjM2XHU4QkNEXHU1MTc4XHU2NTg3XHU0RUY2XHU1OTMxXHU4RDI1OicsIGVycm9yKVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKHtcclxuICBwbHVnaW5zOiBbXHJcbiAgICByZWFjdCgpLFxyXG4gICAgY3J4KHsgbWFuaWZlc3QgfSksXHJcbiAgICB7XHJcbiAgICAgIG5hbWU6ICdjb3B5LWRpY3Rpb25hcnktZmlsZXMnLFxyXG4gICAgICBjbG9zZUJ1bmRsZSgpIHtcclxuICAgICAgICBjb3B5RGljdGlvbmFyeUZpbGVzKClcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIF0sXHJcbiAgYnVpbGQ6IHtcclxuICAgIG91dERpcjogJ2Rpc3QnLFxyXG4gICAgZW1wdHlPdXREaXI6IHRydWUsXHJcbiAgICByb2xsdXBPcHRpb25zOiB7XHJcbiAgICAgIGlucHV0OiB7XHJcbiAgICAgICAgcG9wdXA6ICdzcmMvcG9wdXAvcG9wdXAuaHRtbCcsXHJcbiAgICAgICAgb3B0aW9uczogJ3NyYy9vcHRpb25zL29wdGlvbnMuaHRtbCdcclxuICAgICAgfVxyXG4gICAgfVxyXG4gIH1cclxufSkiLCAiY29uc3QgX192aXRlX2luamVjdGVkX29yaWdpbmFsX2Rpcm5hbWUgPSBcIkU6XFxcXFZTcHJvamVjdFxcXFxNYWduaWZpZXItVHJhbnNsYXRvclxcXFxzcmNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkU6XFxcXFZTcHJvamVjdFxcXFxNYWduaWZpZXItVHJhbnNsYXRvclxcXFxzcmNcXFxcbWFuaWZlc3QudHNcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfaW1wb3J0X21ldGFfdXJsID0gXCJmaWxlOi8vL0U6L1ZTcHJvamVjdC9NYWduaWZpZXItVHJhbnNsYXRvci9zcmMvbWFuaWZlc3QudHNcIjtpbXBvcnQgeyBkZWZpbmVNYW5pZmVzdCB9IGZyb20gJ0Bjcnhqcy92aXRlLXBsdWdpbidcblxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lTWFuaWZlc3Qoe1xuICBtYW5pZmVzdF92ZXJzaW9uOiAzLFxuICBuYW1lOiAnTWFnbmlmaWVyIFRyYW5zbGF0b3InLFxuICBkZXNjcmlwdGlvbjogJ1NlbGVjdGVkLXdvcmQgdHJhbnNsYXRpb24gYnJvd3NlciBleHRlbnNpb24gd2l0aCBvZmZsaW5lLWZpcnN0IHRvb2x0aXAgbG9va3VwLicsXG4gIHZlcnNpb246ICcxLjAuMCcsXG4gIHBlcm1pc3Npb25zOiBbJ3N0b3JhZ2UnXSxcbiAgaG9zdF9wZXJtaXNzaW9uczogWydodHRwczovL3RyYW5zbGF0ZS5nb29nbGVhcGlzLmNvbS8qJ10sXG4gIHdlYl9hY2Nlc3NpYmxlX3Jlc291cmNlczogW1xuICAgIHtcbiAgICAgIHJlc291cmNlczogWydkYXRhL2RpY3Rpb25hcnktbWluaS5qc29uJ10sXG4gICAgICBtYXRjaGVzOiBbJzxhbGxfdXJscz4nXSxcbiAgICAgIHVzZV9keW5hbWljX3VybDogZmFsc2VcbiAgICB9XG4gIF0sXG4gIGNvbnRlbnRfc2NyaXB0czogW1xuICAgIHtcbiAgICAgIG1hdGNoZXM6IFsnPGFsbF91cmxzPiddLFxuICAgICAganM6IFsnc3JjL2NvbnRlbnQvY29udGVudC1zY3JpcHQudHN4J10sXG4gICAgICBjc3M6IFsnc3JjL2NvbnRlbnQvc3R5bGVzLmNzcyddXG4gICAgfVxuICBdLFxuICBhY3Rpb246IHtcbiAgICBkZWZhdWx0X3BvcHVwOiAnc3JjL3BvcHVwL3BvcHVwLmh0bWwnLFxuICAgIGRlZmF1bHRfdGl0bGU6ICdNYWduaWZpZXIgVHJhbnNsYXRvcidcbiAgfSxcbiAgb3B0aW9uc19wYWdlOiAnc3JjL29wdGlvbnMvb3B0aW9ucy5odG1sJ1xufSlcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBMlIsU0FBUyxvQkFBb0I7QUFDeFQsT0FBTyxXQUFXO0FBQ2xCLFNBQVMsV0FBVzs7O0FDRitRLFNBQVMsc0JBQXNCO0FBRWxVLElBQU8sbUJBQVEsZUFBZTtBQUFBLEVBQzVCLGtCQUFrQjtBQUFBLEVBQ2xCLE1BQU07QUFBQSxFQUNOLGFBQWE7QUFBQSxFQUNiLFNBQVM7QUFBQSxFQUNULGFBQWEsQ0FBQyxTQUFTO0FBQUEsRUFDdkIsa0JBQWtCLENBQUMsb0NBQW9DO0FBQUEsRUFDdkQsMEJBQTBCO0FBQUEsSUFDeEI7QUFBQSxNQUNFLFdBQVcsQ0FBQywyQkFBMkI7QUFBQSxNQUN2QyxTQUFTLENBQUMsWUFBWTtBQUFBLE1BQ3RCLGlCQUFpQjtBQUFBLElBQ25CO0FBQUEsRUFDRjtBQUFBLEVBQ0EsaUJBQWlCO0FBQUEsSUFDZjtBQUFBLE1BQ0UsU0FBUyxDQUFDLFlBQVk7QUFBQSxNQUN0QixJQUFJLENBQUMsZ0NBQWdDO0FBQUEsTUFDckMsS0FBSyxDQUFDLHdCQUF3QjtBQUFBLElBQ2hDO0FBQUEsRUFDRjtBQUFBLEVBQ0EsUUFBUTtBQUFBLElBQ04sZUFBZTtBQUFBLElBQ2YsZUFBZTtBQUFBLEVBQ2pCO0FBQUEsRUFDQSxjQUFjO0FBQ2hCLENBQUM7OztBRHhCRCxTQUFTLGNBQWMsV0FBVyxrQkFBa0I7QUFDcEQsU0FBUyxZQUFZO0FBTHJCLElBQU0sbUNBQW1DO0FBT3pDLFNBQVMsc0JBQXNCO0FBQzdCLFFBQU0sU0FBUyxLQUFLLGtDQUFXLE9BQU8sTUFBTTtBQUM1QyxRQUFNLFVBQVUsS0FBSyxrQ0FBVyxRQUFRLE1BQU07QUFFOUMsTUFBSSxDQUFDLFdBQVcsT0FBTyxHQUFHO0FBQ3hCLGNBQVUsU0FBUyxFQUFFLFdBQVcsS0FBSyxDQUFDO0FBQUEsRUFDeEM7QUFFQSxNQUFJO0FBQ0YsaUJBQWEsS0FBSyxRQUFRLHNCQUFzQixHQUFHLEtBQUssU0FBUyxzQkFBc0IsQ0FBQztBQUN4RixpQkFBYSxLQUFLLFFBQVEsdUJBQXVCLEdBQUcsS0FBSyxTQUFTLHVCQUF1QixDQUFDO0FBQzFGLFlBQVEsSUFBSSxrREFBVTtBQUFBLEVBQ3hCLFNBQVMsT0FBTztBQUNkLFlBQVEsTUFBTSxxREFBYSxLQUFLO0FBQUEsRUFDbEM7QUFDRjtBQUVBLElBQU8sc0JBQVEsYUFBYTtBQUFBLEVBQzFCLFNBQVM7QUFBQSxJQUNQLE1BQU07QUFBQSxJQUNOLElBQUksRUFBRSwyQkFBUyxDQUFDO0FBQUEsSUFDaEI7QUFBQSxNQUNFLE1BQU07QUFBQSxNQUNOLGNBQWM7QUFDWiw0QkFBb0I7QUFBQSxNQUN0QjtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQUEsRUFDQSxPQUFPO0FBQUEsSUFDTCxRQUFRO0FBQUEsSUFDUixhQUFhO0FBQUEsSUFDYixlQUFlO0FBQUEsTUFDYixPQUFPO0FBQUEsUUFDTCxPQUFPO0FBQUEsUUFDUCxTQUFTO0FBQUEsTUFDWDtBQUFBLElBQ0Y7QUFBQSxFQUNGO0FBQ0YsQ0FBQzsiLAogICJuYW1lcyI6IFtdCn0K
