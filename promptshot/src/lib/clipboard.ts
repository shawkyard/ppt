import { isTauri } from "./env";
import { base64ToBytes } from "./persistence";

/** Copy plain text to the system clipboard (used by "Copy AI Packet"). */
export async function copyText(text: string): Promise<void> {
  if (isTauri) {
    const { writeText } = await import(
      "@tauri-apps/plugin-clipboard-manager"
    );
    await writeText(text);
    return;
  }
  await navigator.clipboard.writeText(text);
}

/**
 * Read an image from the system clipboard.
 * Desktop: goes through the Rust `read_clipboard_image` command (returns a PNG).
 * Browser: not available — returns null so the UI can point to the paste zone.
 */
export async function readClipboardImage(): Promise<Uint8Array | null> {
  if (!isTauri) return null;
  const { invoke } = await import("@tauri-apps/api/core");
  const b64 = await invoke<string | null>("read_clipboard_image");
  if (!b64) return null;
  return base64ToBytes(b64);
}
