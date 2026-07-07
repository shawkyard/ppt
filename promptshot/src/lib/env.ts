/**
 * Runtime environment detection.
 *
 * PromptShot is a Tauri desktop app, but the whole UI also runs in a plain
 * browser (`npm run dev`) using a localStorage + IndexedDB fallback. That makes
 * the app fast to iterate on and lets non-Tauri features degrade gracefully.
 */
export const isTauri: boolean =
  typeof window !== "undefined" &&
  // Tauri v2 injects this on the global object inside the webview.
  "__TAURI_INTERNALS__" in window;

export const MODE_LABEL = isTauri ? "Desktop" : "Browser preview";
