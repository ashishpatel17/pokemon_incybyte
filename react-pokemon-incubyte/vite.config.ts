import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";

export default defineConfig({
  plugins: [react()],

  test: {
    globals: true,
    environment: "jsdom",
    setupFiles: "./src/setupTest.ts",
  },
  
  resolve: {
    alias: {
      "@": "/src",
      "@types": path.resolve(__dirname, "src/types"),
      "@assets": path.resolve(__dirname, "src/assets"),
      "@hooks": path.resolve(__dirname, "src/hooks"),
    },
  },

  server: {
    port: 5173,
    open: true,
  },

  build: {
    outDir: "dist",
    sourcemap: true,
  },
});