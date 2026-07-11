import { useCallback, useRef, useState } from "react";
import { Sidebar } from "./components/Sidebar";
import { ToastHost } from "./components/Toast";
import { NavContext, Page } from "./state/nav";
import { StoreProvider, useStore } from "./state/store";
import { PacketMode } from "./types";
import { Home } from "./pages/Home";
import { Inbox } from "./pages/Inbox";
import { CreatePacket } from "./pages/CreatePacket";
import { Projects } from "./pages/Projects";
import { History } from "./pages/History";
import { Settings } from "./pages/Settings";

function Shell() {
  const [page, setPage] = useState<Page>("home");
  const pendingMode = useRef<PacketMode | undefined>(undefined);
  const { ready } = useStore();

  const go = useCallback((next: Page, opts?: { mode?: PacketMode }) => {
    if (opts?.mode) pendingMode.current = opts.mode;
    setPage(next);
    // Scroll the content area back to top on navigation.
    requestAnimationFrame(() => {
      document.querySelector(".content")?.scrollTo({ top: 0 });
    });
  }, []);

  const consumePendingMode = useCallback(() => {
    const m = pendingMode.current;
    pendingMode.current = undefined;
    return m;
  }, []);

  return (
    <NavContext.Provider value={{ page, go, consumePendingMode }}>
      <div className="app">
        <Sidebar />
        <main className="content">
          {!ready ? (
            <div className="loading">Loading PromptShot…</div>
          ) : (
            <PageView page={page} />
          )}
        </main>
        <ToastHost />
      </div>
    </NavContext.Provider>
  );
}

function PageView({ page }: { page: Page }) {
  switch (page) {
    case "home":
      return <Home />;
    case "inbox":
      return <Inbox />;
    case "create":
      return <CreatePacket />;
    case "projects":
      return <Projects />;
    case "history":
      return <History />;
    case "settings":
      return <Settings />;
  }
}

export default function App() {
  return (
    <StoreProvider>
      <Shell />
    </StoreProvider>
  );
}
