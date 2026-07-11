import { isTauri } from "./env";
import { baseName, extFromName } from "./format";

export interface PickedImage {
  fileName: string;
  ext: string;
  bytes: Uint8Array;
  createdAt: string; // ISO
}

/** Read image bytes from an absolute path (folder watch / dialog picks). */
export async function readImageAt(path: string): Promise<PickedImage> {
  const fs = await import("@tauri-apps/plugin-fs");
  const bytes = await fs.readFile(path);
  let createdAt = new Date().toISOString();
  try {
    const info = await fs.stat(path);
    const t = info.birthtime ?? info.mtime;
    if (t) createdAt = new Date(t).toISOString();
  } catch {
    /* stat is best-effort */
  }
  const fileName = baseName(path);
  return { fileName, ext: extFromName(fileName), bytes, createdAt };
}

/** Open the native file picker and read the selected image(s). Desktop only. */
export async function pickImageFiles(): Promise<PickedImage[]> {
  if (!isTauri) return [];
  const { open } = await import("@tauri-apps/plugin-dialog");
  const selection = await open({
    multiple: true,
    directory: false,
    filters: [
      { name: "Images", extensions: ["png", "jpg", "jpeg", "webp", "gif"] },
    ],
  });
  if (!selection) return [];
  const paths = Array.isArray(selection) ? selection : [selection];
  const results: PickedImage[] = [];
  for (const p of paths) {
    results.push(await readImageAt(p as string));
  }
  return results;
}

/** Open the native folder picker. Returns the chosen path, or null. */
export async function pickFolder(): Promise<string | null> {
  if (!isTauri) return null;
  const { open } = await import("@tauri-apps/plugin-dialog");
  const dir = await open({ directory: true, multiple: false });
  return (dir as string) ?? null;
}

/** Convert a browser File (upload / paste) into PickedImage bytes. */
export async function fileToPicked(file: File): Promise<PickedImage> {
  const buf = new Uint8Array(await file.arrayBuffer());
  const name = file.name || `pasted-${Date.now()}.png`;
  return {
    fileName: name,
    ext: extFromName(name),
    bytes: buf,
    createdAt: file.lastModified
      ? new Date(file.lastModified).toISOString()
      : new Date().toISOString(),
  };
}
