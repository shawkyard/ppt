import { useRef, useState } from "react";
import { Icon } from "../components/Icon";
import { ScreenshotCard } from "../components/ScreenshotCard";
import { useStore } from "../state/store";
import { useNav } from "../state/nav";
import { pickImageFiles } from "../lib/fileio";
import { isTauri } from "../lib/env";
import { ScreenshotSource } from "../types";

type Filter = "all" | ScreenshotSource;

export function Inbox() {
  const {
    db,
    selected,
    importPicked,
    importUploadFiles,
    importFromClipboard,
    clearSelection,
    toggleSelect,
    notify,
  } = useStore();
  const { go } = useNav();
  const fileInput = useRef<HTMLInputElement>(null);
  const [filter, setFilter] = useState<Filter>("all");
  const [dragOver, setDragOver] = useState(false);

  const shots =
    filter === "all"
      ? db.screenshots
      : db.screenshots.filter((s) => s.source === filter);

  async function onUploadClick() {
    if (isTauri) {
      const picked = await pickImageFiles();
      if (picked.length) {
        const n = await importPicked(picked, "upload");
        notify(n ? `Imported ${n}.` : "Already imported.");
      }
    } else {
      fileInput.current?.click();
    }
  }

  function onPaste(e: React.ClipboardEvent) {
    const files: File[] = [];
    for (const item of Array.from(e.clipboardData.items)) {
      if (item.type.startsWith("image/")) {
        const f = item.getAsFile();
        if (f) files.push(f);
      }
    }
    if (files.length) {
      e.preventDefault();
      void importUploadFiles(files);
    }
  }

  function onDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files?.length) {
      void importUploadFiles(e.dataTransfer.files);
    }
  }

  const filters: { id: Filter; label: string }[] = [
    { id: "all", label: "All" },
    { id: "clipboard", label: "Clipboard" },
    { id: "folder", label: "Watched folder" },
    { id: "upload", label: "Uploads" },
  ];

  return (
    <div className="page" onPaste={onPaste} tabIndex={0}>
      <input
        ref={fileInput}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => {
          if (e.target.files) void importUploadFiles(e.target.files);
          e.target.value = "";
        }}
      />

      <header className="page-head">
        <div>
          <h1>Screenshot Inbox</h1>
          <p className="page-sub">
            Everything PromptShot has picked up, ready to turn into a packet.
          </p>
        </div>
        <div className="head-actions">
          <button className="btn btn-ghost" onClick={() => void importFromClipboard()}>
            <Icon name="clipboard" size={16} /> From clipboard
          </button>
          <button className="btn btn-primary" onClick={onUploadClick}>
            <Icon name="upload" size={16} /> Import screenshot
          </button>
        </div>
      </header>

      <div
        className={`drop-zone ${dragOver ? "over" : ""}`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
      >
        <Icon name="paste" size={22} />
        <span>
          <strong>Drag &amp; drop</strong> images here, or click into this page and{" "}
          <strong>paste</strong> (Ctrl/Cmd&nbsp;+&nbsp;V) a copied screenshot.
        </span>
      </div>

      <div className="toolbar">
        <div className="filters">
          {filters.map((f) => (
            <button
              key={f.id}
              className={`chip ${filter === f.id ? "active" : ""}`}
              onClick={() => setFilter(f.id)}
            >
              {f.label}
            </button>
          ))}
        </div>
        <div className="toolbar-right">
          {selected.size > 0 && (
            <>
              <span className="selected-count">
                {selected.size} selected
              </span>
              <button className="btn btn-ghost btn-sm" onClick={clearSelection}>
                Clear
              </button>
              <button className="btn btn-primary btn-sm" onClick={() => go("create")}>
                <Icon name="create" size={15} /> Create packet
              </button>
            </>
          )}
        </div>
      </div>

      {shots.length === 0 ? (
        <div className="empty">
          <Icon name="inbox" size={40} />
          <h3>No screenshots yet</h3>
          <p>
            Import from your clipboard, drop a file above, or set a watched
            folder in Settings and screenshots will appear here automatically.
          </p>
        </div>
      ) : (
        <div className="shot-grid">
          {shots.map((s) => (
            <ScreenshotCard key={s.id} shot={s} />
          ))}
        </div>
      )}

      {shots.length > 0 && (
        <div className="inbox-hint">
          Tip: click a screenshot to select it, then hit{" "}
          <button className="linklike" onClick={() => go("create")}>
            Create Packet
          </button>
          . Selected screenshots carry across pages.
          {selected.size > 0 && (
            <button
              className="linklike"
              onClick={() => selected.forEach((id) => toggleSelect(id))}
            >
              {" "}
              Deselect all
            </button>
          )}
        </div>
      )}
    </div>
  );
}
