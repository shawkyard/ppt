import { useEffect, useState } from "react";
import { Screenshot } from "../types";
import { imageUrl } from "./persistence";

// Module-level cache keyed by screenshot id so we resolve each image's bytes
// only once, even as it appears across the Inbox, Create, and Projects views.
const cache = new Map<string, string>();

export function useImageUrl(shot: Screenshot | undefined): string | undefined {
  const [url, setUrl] = useState<string | undefined>(
    shot ? cache.get(shot.id) : undefined
  );

  useEffect(() => {
    let alive = true;
    if (!shot) {
      setUrl(undefined);
      return;
    }
    const cached = cache.get(shot.id);
    if (cached) {
      setUrl(cached);
      return;
    }
    void imageUrl(shot)
      .then((u) => {
        cache.set(shot.id, u);
        if (alive) setUrl(u);
      })
      .catch((err) => console.error("imageUrl failed", err));
    return () => {
      alive = false;
    };
  }, [shot?.id]);

  return url;
}

export function forgetImageUrl(id: string): void {
  cache.delete(id);
}
