import { isTauri } from "./env";
import { isImageName } from "./format";

export type UnwatchFn = () => void;

/**
 * Watch a folder for newly added image files (desktop only).
 *
 * Tauri's fs `watch` fires on create/modify events; we filter to image
 * extensions and de-duplicate paths we've already reported. The caller is
 * responsible for reading the file bytes and importing them.
 *
 * Returns a no-op unwatcher in the browser preview (folder watching needs the
 * native filesystem).
 */
export async function watchFolder(
  path: string,
  onNewImage: (filePath: string) => void
): Promise<UnwatchFn> {
  if (!isTauri) {
    return () => {};
  }

  const { watchImmediate } = await import("@tauri-apps/plugin-fs");
  const seen = new Set<string>();

  const stop = await watchImmediate(
    path,
    (event) => {
      // event.paths lists the affected files; event.type describes the change.
      const type = (event as { type?: unknown }).type;
      const isRemove =
        typeof type === "object" && type !== null && "remove" in (type as object);
      if (isRemove) return;

      for (const p of event.paths) {
        if (!isImageName(p)) continue;
        if (seen.has(p)) continue;
        seen.add(p);
        // Small delay: the writing app may still be flushing the file.
        setTimeout(() => onNewImage(p), 250);
      }
    },
    { recursive: false }
  );

  return stop;
}
