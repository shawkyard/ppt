import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Tauri expects a fixed port and does not gracefully handle a random one.
const host = process.env.TAURI_DEV_HOST;

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Prevent Vite from obscuring Rust errors.
  clearScreen: false,
  server: {
    port: 1420,
    strictPort: true,
    host: host || false,
    hmr: host
      ? { protocol: "ws", host, port: 1421 }
      : undefined,
    watch: {
      // Tauri works in `src-tauri`; don't let Vite watch it.
      ignored: ["**/src-tauri/**"],
    },
  },
  // Produce assets relative to index.html so the Tauri webview can load them.
  base: "./",
  build: {
    target: "es2021",
    minify: "esbuild",
    sourcemap: false,
  },
});
