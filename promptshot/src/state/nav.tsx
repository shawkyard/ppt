import { createContext, useContext } from "react";
import { PacketMode } from "../types";

export type Page = "home" | "inbox" | "create" | "projects" | "history" | "settings";

export interface NavValue {
  page: Page;
  go(page: Page, opts?: { mode?: PacketMode }): void;
  pendingMode?: PacketMode;
  consumePendingMode(): PacketMode | undefined;
}

export const NavContext = createContext<NavValue | null>(null);

export function useNav(): NavValue {
  const ctx = useContext(NavContext);
  if (!ctx) throw new Error("useNav must be used inside NavContext");
  return ctx;
}
