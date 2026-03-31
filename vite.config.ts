import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

import svgr from "vite-plugin-svgr";

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => ({
  server: {
    host: "::",
    port: 3000,
    hmr: {
      overlay: false,
    },
    proxy: {
      '/api': {
        target: 'https://h-class-server.onrender.com',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  plugins: [react(), svgr()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
}));
