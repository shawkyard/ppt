import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  ReactNode,
} from "react";
import {
  DBShape,
  EMPTY_DB,
  PacketMode,
  Project,
  Screenshot,
  ScreenshotSource,
} from "../types";
import * as persistence from "../lib/persistence";
import { uid } from "../lib/format";
import { PickedImage, fileToPicked, readImageAt } from "../lib/fileio";
import { readClipboardImage } from "../lib/clipboard";
import { watchFolder, UnwatchFn } from "../lib/folderWatch";
import { isTauri } from "../lib/env";

export interface Toast {
  id: string;
  message: string;
  tone: "ok" | "error";
}

interface StoreValue {
  db: DBShape;
  ready: boolean;
  selected: Set<string>;
  toasts: Toast[];

  // selection
  toggleSelect(id: string): void;
  isSelected(id: string): boolean;
  clearSelection(): void;
  selectedScreenshots(): Screenshot[];

  // ingest
  importPicked(images: PickedImage[], source: ScreenshotSource): Promise<number>;
  importFromClipboard(): Promise<void>;
  importUploadFiles(files: FileList | File[]): Promise<void>;

  // screenshots
  removeScreenshot(id: string): Promise<void>;

  // projects
  createProject(name: string): Project;
  assignScreenshotsToProject(ids: string[], projectId: string | null): void;
  deleteProject(id: string): void;

  // packets
  savePacket(input: {
    mode: PacketMode;
    contextNote: string;
    screenshotIds: string[];
    generatedText: string;
    projectId?: string;
  }): void;
  deletePacket(id: string): void;
  clearHistory(): void;

  // settings
  setWatchedFolder(path: string | undefined): void;

  // ui
  notify(message: string, tone?: "ok" | "error"): void;
  dismissToast(id: string): void;
}

const StoreContext = createContext<StoreValue | null>(null);

export function useStore(): StoreValue {
  const ctx = useContext(StoreContext);
  if (!ctx) throw new Error("useStore must be used inside <StoreProvider>");
  return ctx;
}

export function StoreProvider({ children }: { children: ReactNode }) {
  const [db, setDb] = useState<DBShape>(EMPTY_DB);
  const [ready, setReady] = useState(false);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [toasts, setToasts] = useState<Toast[]>([]);

  // Keep a live ref so async callbacks (folder watch) always persist the
  // latest state instead of a stale closure.
  const dbRef = useRef(db);
  dbRef.current = db;
  const unwatchRef = useRef<UnwatchFn | null>(null);

  // --- persistence helpers -------------------------------------------------

  const commit = useCallback((next: DBShape) => {
    dbRef.current = next;
    setDb(next);
    void persistence.saveDB(next);
  }, []);

  const notify = useCallback(
    (message: string, tone: "ok" | "error" = "ok") => {
      const id = uid();
      setToasts((t) => [...t, { id, message, tone }]);
      setTimeout(() => {
        setToasts((t) => t.filter((x) => x.id !== id));
      }, 3200);
    },
    []
  );

  const dismissToast = useCallback((id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
  }, []);

  // --- initial load --------------------------------------------------------

  useEffect(() => {
    void persistence.loadDB().then((loaded) => {
      dbRef.current = loaded;
      setDb(loaded);
      setReady(true);
    });
  }, []);

  // --- ingest --------------------------------------------------------------

  const importPicked = useCallback(
    async (images: PickedImage[], source: ScreenshotSource): Promise<number> => {
      let added = 0;
      let next = dbRef.current;
      for (const img of images) {
        // De-dupe: same name + created time from the same source is a re-import.
        const dup = next.screenshots.some(
          (s) =>
            s.fileName === img.fileName &&
            s.createdAt === img.createdAt &&
            s.source === source
        );
        if (dup) continue;

        const id = uid();
        const ref = await persistence.saveImage(id, img.ext, img.bytes);
        const shot: Screenshot = {
          id,
          fileName: img.fileName,
          ext: img.ext,
          source,
          createdAt: img.createdAt,
          importedAt: new Date().toISOString(),
          storageRef: ref,
        };
        next = { ...next, screenshots: [shot, ...next.screenshots] };
        added += 1;
      }
      if (added > 0) commit(next);
      return added;
    },
    [commit]
  );

  const importFromClipboard = useCallback(async () => {
    try {
      const bytes = await readClipboardImage();
      if (!bytes) {
        notify(
          isTauri
            ? "No image found on the clipboard. Copy a screenshot first."
            : "Clipboard image read isn't available in browser preview — use the paste zone or upload.",
          "error"
        );
        return;
      }
      const stamp = new Date().toISOString();
      const picked: PickedImage = {
        fileName: `clipboard-${stamp.replace(/[:.]/g, "-")}.png`,
        ext: "png",
        bytes,
        createdAt: stamp,
      };
      const n = await importPicked([picked], "clipboard");
      notify(n ? "Screenshot imported from clipboard." : "Already imported.");
    } catch (err) {
      console.error(err);
      notify("Could not read the clipboard image.", "error");
    }
  }, [importPicked, notify]);

  const importUploadFiles = useCallback(
    async (files: FileList | File[]) => {
      const arr = Array.from(files).filter((f) => f.type.startsWith("image/"));
      if (arr.length === 0) {
        notify("No image files found in that selection.", "error");
        return;
      }
      const picked = await Promise.all(arr.map(fileToPicked));
      const n = await importPicked(picked, "upload");
      notify(n ? `Imported ${n} screenshot${n > 1 ? "s" : ""}.` : "Already imported.");
    },
    [importPicked, notify]
  );

  // --- folder watch lifecycle ---------------------------------------------

  useEffect(() => {
    const folder = db.settings.watchedFolder;
    // Tear down any previous watcher first.
    unwatchRef.current?.();
    unwatchRef.current = null;
    if (!folder || !isTauri) return;

    let cancelled = false;
    void watchFolder(folder, async (filePath) => {
      try {
        const picked = await readImageAt(filePath);
        const n = await importPicked([picked], "folder");
        if (n) notify(`New screenshot detected: ${picked.fileName}`);
      } catch (err) {
        console.error("folder import failed", err);
      }
    }).then((stop) => {
      if (cancelled) stop();
      else unwatchRef.current = stop;
    });

    return () => {
      cancelled = true;
      unwatchRef.current?.();
      unwatchRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [db.settings.watchedFolder]);

  // --- screenshots ---------------------------------------------------------

  const removeScreenshot = useCallback(
    async (id: string) => {
      const shot = dbRef.current.screenshots.find((s) => s.id === id);
      if (shot) await persistence.deleteImage(shot.storageRef);
      commit({
        ...dbRef.current,
        screenshots: dbRef.current.screenshots.filter((s) => s.id !== id),
      });
      setSelected((sel) => {
        const n = new Set(sel);
        n.delete(id);
        return n;
      });
    },
    [commit]
  );

  // --- selection -----------------------------------------------------------

  const toggleSelect = useCallback((id: string) => {
    setSelected((sel) => {
      const n = new Set(sel);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  }, []);

  const isSelected = useCallback((id: string) => selected.has(id), [selected]);
  const clearSelection = useCallback(() => setSelected(new Set()), []);
  const selectedScreenshots = useCallback(
    () => db.screenshots.filter((s) => selected.has(s.id)),
    [db.screenshots, selected]
  );

  // --- projects ------------------------------------------------------------

  const createProject = useCallback(
    (name: string): Project => {
      const project: Project = {
        id: uid(),
        name: name.trim() || "Untitled project",
        createdAt: new Date().toISOString(),
      };
      commit({ ...dbRef.current, projects: [project, ...dbRef.current.projects] });
      return project;
    },
    [commit]
  );

  const assignScreenshotsToProject = useCallback(
    (ids: string[], projectId: string | null) => {
      const set = new Set(ids);
      commit({
        ...dbRef.current,
        screenshots: dbRef.current.screenshots.map((s) =>
          set.has(s.id) ? { ...s, projectId: projectId ?? undefined } : s
        ),
      });
    },
    [commit]
  );

  const deleteProject = useCallback(
    (id: string) => {
      commit({
        ...dbRef.current,
        projects: dbRef.current.projects.filter((p) => p.id !== id),
        screenshots: dbRef.current.screenshots.map((s) =>
          s.projectId === id ? { ...s, projectId: undefined } : s
        ),
        packets: dbRef.current.packets.map((p) =>
          p.projectId === id ? { ...p, projectId: undefined } : p
        ),
      });
    },
    [commit]
  );

  // --- packets -------------------------------------------------------------

  const savePacket = useCallback<StoreValue["savePacket"]>(
    (input) => {
      const names = dbRef.current.screenshots
        .filter((s) => input.screenshotIds.includes(s.id))
        .map((s) => s.fileName);
      const packet = {
        id: uid(),
        createdAt: new Date().toISOString(),
        screenshotNames: names,
        ...input,
      };
      commit({ ...dbRef.current, packets: [packet, ...dbRef.current.packets] });
    },
    [commit]
  );

  const deletePacket = useCallback(
    (id: string) => {
      commit({
        ...dbRef.current,
        packets: dbRef.current.packets.filter((p) => p.id !== id),
      });
    },
    [commit]
  );

  const clearHistory = useCallback(() => {
    commit({ ...dbRef.current, packets: [] });
    notify("History cleared.");
  }, [commit, notify]);

  // --- settings ------------------------------------------------------------

  const setWatchedFolder = useCallback(
    (path: string | undefined) => {
      commit({
        ...dbRef.current,
        settings: { ...dbRef.current.settings, watchedFolder: path },
      });
    },
    [commit]
  );

  const value = useMemo<StoreValue>(
    () => ({
      db,
      ready,
      selected,
      toasts,
      toggleSelect,
      isSelected,
      clearSelection,
      selectedScreenshots,
      importPicked,
      importFromClipboard,
      importUploadFiles,
      removeScreenshot,
      createProject,
      assignScreenshotsToProject,
      deleteProject,
      savePacket,
      deletePacket,
      clearHistory,
      setWatchedFolder,
      notify,
      dismissToast,
    }),
    [
      db,
      ready,
      selected,
      toasts,
      toggleSelect,
      isSelected,
      clearSelection,
      selectedScreenshots,
      importPicked,
      importFromClipboard,
      importUploadFiles,
      removeScreenshot,
      createProject,
      assignScreenshotsToProject,
      deleteProject,
      savePacket,
      deletePacket,
      clearHistory,
      setWatchedFolder,
      notify,
      dismissToast,
    ]
  );

  return (
    <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
  );
}
