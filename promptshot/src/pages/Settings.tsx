import { useEffect, useState } from "react";
import { Icon } from "../components/Icon";
import { useStore } from "../state/store";
import { pickFolder } from "../lib/fileio";
import { storageLocation } from "../lib/persistence";
import { isTauri } from "../lib/env";

export function Settings() {
  const { db, setWatchedFolder, clearHistory, notify } = useStore();
  const [location, setLocation] = useState("…");

  useEffect(() => {
    void storageLocation().then(setLocation);
  }, []);

  async function changeFolder() {
    if (!isTauri) {
      notify("Folder watching needs the desktop app.", "error");
      return;
    }
    const dir = await pickFolder();
    if (dir) {
      setWatchedFolder(dir);
      notify("Watched folder updated.");
    }
  }

  return (
    <div className="page settings">
      <header className="page-head">
        <div>
          <h1>Settings</h1>
          <p className="page-sub">Local configuration and privacy.</p>
        </div>
      </header>

      <section className="card">
        <div className="card-head">
          <Icon name="folder" size={18} />
          <h2>Watched folder</h2>
        </div>
        <p className="muted">
          PromptShot watches this folder and imports new PNG/JPG/JPEG/WebP
          screenshots automatically.
        </p>
        <div className="setting-row">
          <code className="path-box">
            {db.settings.watchedFolder || "No folder selected"}
          </code>
          <div className="setting-btns">
            <button className="btn btn-primary btn-sm" onClick={changeFolder}>
              {db.settings.watchedFolder ? "Change folder" : "Choose folder"}
            </button>
            {db.settings.watchedFolder && (
              <button
                className="btn btn-ghost btn-sm"
                onClick={() => {
                  setWatchedFolder(undefined);
                  notify("Stopped watching folder.");
                }}
              >
                Stop watching
              </button>
            )}
          </div>
        </div>
        {!isTauri && (
          <p className="warn-inline">
            <Icon name="bolt" size={14} /> Folder watching only runs in the
            PromptShot desktop app. In this browser preview, use drag &amp; drop or
            paste in the Inbox.
          </p>
        )}
      </section>

      <section className="card">
        <div className="card-head">
          <Icon name="eye" size={18} />
          <h2>Privacy</h2>
        </div>
        <p className="privacy">
          PromptShot is local-first. Your screenshots and prompt packets stay on
          your computer unless you manually copy, paste, export, or upload them
          somewhere else.
        </p>
        <p className="muted">
          No accounts. No login. No cloud sync. No AI API calls. No screenshots
          leave your machine.
        </p>
      </section>

      <section className="card">
        <div className="card-head">
          <Icon name="settings" size={18} />
          <h2>Local storage</h2>
        </div>
        <p className="muted">Your data is stored here:</p>
        <code className="path-box block">{location}</code>
        <p className="muted small">
          {isTauri
            ? "Screenshots are copied into a local app folder; metadata lives in db.json."
            : "In browser preview, metadata is in localStorage and images are in IndexedDB."}
        </p>
      </section>

      <section className="card danger-card">
        <div className="card-head">
          <Icon name="trash" size={18} />
          <h2>Clear packet history</h2>
        </div>
        <p className="muted">
          Removes all saved packets ({db.packets.length}). Screenshots and
          projects are kept.
        </p>
        <button
          className="btn btn-ghost btn-sm danger"
          onClick={() => {
            if (confirm("Clear all packet history?")) clearHistory();
          }}
        >
          <Icon name="trash" size={15} /> Clear history
        </button>
      </section>

      <p className="app-version">PromptShot v0.1.0 · The missing clipboard between AI tools.</p>
    </div>
  );
}
