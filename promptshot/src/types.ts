// ---------------------------------------------------------------------------
// PromptShot local data model
// ---------------------------------------------------------------------------

export type ScreenshotSource = "clipboard" | "folder" | "upload";

/**
 * Where the raw image bytes live. In the Tauri desktop build this is a file on
 * disk inside the app's local data directory. In the browser fallback build it
 * is a key into IndexedDB. The UI never cares which — it always resolves a
 * displayable URL through the persistence layer.
 */
export type StorageRef =
  | { kind: "file"; fileName: string }
  | { kind: "idb"; key: string };

export interface Screenshot {
  id: string;
  fileName: string;
  ext: string; // png | jpg | jpeg | webp
  source: ScreenshotSource;
  createdAt: string; // ISO — when the screenshot was taken/created if known
  importedAt: string; // ISO — when PromptShot ingested it
  projectId?: string;
  storageRef: StorageRef;
}

export interface Project {
  id: string;
  name: string;
  createdAt: string;
}

export type PacketMode =
  | "boss"
  | "builder"
  | "fix"
  | "error"
  | "client"
  | "compare";

export interface Packet {
  id: string;
  mode: PacketMode;
  contextNote: string;
  screenshotIds: string[];
  screenshotNames: string[]; // snapshot of names so history survives deletes
  projectId?: string;
  generatedText: string;
  createdAt: string;
}

export interface Settings {
  watchedFolder?: string;
}

export interface DBShape {
  version: number;
  screenshots: Screenshot[];
  projects: Project[];
  packets: Packet[];
  settings: Settings;
}

export const EMPTY_DB: DBShape = {
  version: 1,
  screenshots: [],
  projects: [],
  packets: [],
  settings: {},
};
