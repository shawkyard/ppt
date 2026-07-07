import { DBShape, EMPTY_DB, Screenshot, StorageRef } from "../types";
import { isTauri } from "./env";
import { idbDelete, idbGet, idbPut } from "./idb";

// ---------------------------------------------------------------------------
// Persistence layer
//
// One interface, two implementations:
//   • Tauri desktop  → db.json + image files inside the app local data dir
//   • Browser preview → localStorage (metadata) + IndexedDB (image blobs)
//
// The rest of the app only ever talks to the functions exported here.
// ---------------------------------------------------------------------------

const DB_FILE = "db.json";
const IMAGE_DIR = "screenshots";
const LS_KEY = "promptshot.db";

export function mimeFor(ext: string): string {
  switch (ext.toLowerCase()) {
    case "jpg":
    case "jpeg":
      return "image/jpeg";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "image/png";
  }
}

// --- lazy Tauri module handles (kept out of the browser bundle path) --------

async function tauriFs() {
  return await import("@tauri-apps/plugin-fs");
}
async function tauriPath() {
  return await import("@tauri-apps/api/path");
}

// ---------------------------------------------------------------------------
// Database (metadata)
// ---------------------------------------------------------------------------

export async function loadDB(): Promise<DBShape> {
  if (isTauri) {
    const fs = await tauriFs();
    try {
      const exists = await fs.exists(DB_FILE, {
        baseDir: fs.BaseDirectory.AppLocalData,
      });
      if (!exists) return { ...EMPTY_DB };
      const text = await fs.readTextFile(DB_FILE, {
        baseDir: fs.BaseDirectory.AppLocalData,
      });
      return normalize(JSON.parse(text));
    } catch (err) {
      console.error("loadDB (tauri) failed", err);
      return { ...EMPTY_DB };
    }
  }

  try {
    const raw = localStorage.getItem(LS_KEY);
    return raw ? normalize(JSON.parse(raw)) : { ...EMPTY_DB };
  } catch (err) {
    console.error("loadDB (web) failed", err);
    return { ...EMPTY_DB };
  }
}

export async function saveDB(db: DBShape): Promise<void> {
  const text = JSON.stringify(db);
  if (isTauri) {
    const fs = await tauriFs();
    await fs.mkdir("", {
      baseDir: fs.BaseDirectory.AppLocalData,
      recursive: true,
    }).catch(() => {});
    await fs.writeTextFile(DB_FILE, text, {
      baseDir: fs.BaseDirectory.AppLocalData,
    });
    return;
  }
  localStorage.setItem(LS_KEY, text);
}

function normalize(parsed: Partial<DBShape>): DBShape {
  return {
    version: parsed.version ?? 1,
    screenshots: parsed.screenshots ?? [],
    projects: parsed.projects ?? [],
    packets: parsed.packets ?? [],
    settings: parsed.settings ?? {},
  };
}

// ---------------------------------------------------------------------------
// Images (binary)
// ---------------------------------------------------------------------------

export async function saveImage(
  id: string,
  ext: string,
  bytes: Uint8Array
): Promise<StorageRef> {
  if (isTauri) {
    const fs = await tauriFs();
    const fileName = `${IMAGE_DIR}/${id}.${ext}`;
    await fs.mkdir(IMAGE_DIR, {
      baseDir: fs.BaseDirectory.AppLocalData,
      recursive: true,
    }).catch(() => {});
    await fs.writeFile(fileName, bytes, {
      baseDir: fs.BaseDirectory.AppLocalData,
    });
    return { kind: "file", fileName };
  }

  const key = `${id}.${ext}`;
  await idbPut(key, new Blob([bytes as unknown as BlobPart], { type: mimeFor(ext) }));
  return { kind: "idb", key };
}

/** Resolve a displayable URL (data: or blob:) for a stored screenshot. */
export async function imageUrl(shot: Screenshot): Promise<string> {
  const ref = shot.storageRef;
  if (ref.kind === "file") {
    const fs = await tauriFs();
    const bytes = await fs.readFile(ref.fileName, {
      baseDir: fs.BaseDirectory.AppLocalData,
    });
    return bytesToDataUrl(bytes, mimeFor(shot.ext));
  }
  const blob = await idbGet(ref.key);
  if (!blob) throw new Error("image not found in local store");
  return URL.createObjectURL(blob);
}

export async function deleteImage(ref: StorageRef): Promise<void> {
  if (ref.kind === "file") {
    const fs = await tauriFs();
    await fs
      .remove(ref.fileName, { baseDir: fs.BaseDirectory.AppLocalData })
      .catch(() => {});
    return;
  }
  await idbDelete(ref.key).catch(() => {});
}

/** Human-readable description of where data lives, for the Settings page. */
export async function storageLocation(): Promise<string> {
  if (isTauri) {
    try {
      const { appLocalDataDir } = await tauriPath();
      return await appLocalDataDir();
    } catch {
      return "your operating system's app data folder";
    }
  }
  return "your browser's local storage (localStorage + IndexedDB)";
}

// --- helpers ---------------------------------------------------------------

function bytesToDataUrl(bytes: Uint8Array, mime: string): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return `data:${mime};base64,${btoa(binary)}`;
}

export function base64ToBytes(b64: string): Uint8Array {
  const binary = atob(b64);
  const out = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) out[i] = binary.charCodeAt(i);
  return out;
}
