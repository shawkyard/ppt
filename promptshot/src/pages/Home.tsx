import { Icon } from "../components/Icon";
import { useNav } from "../state/nav";
import { useStore } from "../state/store";
import { pickFolder, pickImageFiles } from "../lib/fileio";
import { isTauri } from "../lib/env";
import { useRef } from "react";

const STEPS = [
  {
    icon: "camera",
    title: "Capture",
    body: "Screenshot with any tool — Snipping Tool, ShareX, Snagit, anything.",
  },
  {
    icon: "note",
    title: "Add context",
    body: "Pick your shots, write one line about what you're trying to do.",
  },
  {
    icon: "paste",
    title: "Paste into any AI",
    body: "Get a clean handoff packet for ChatGPT, Claude, Lovable, v0…",
  },
];

const TOOLS = [
  "ChatGPT",
  "Claude",
  "Manus",
  "Lovable",
  "v0",
  "Bolt",
  "Figma AI",
  "Framer AI",
  "Cursor",
];

export function Home() {
  const { go } = useNav();
  const {
    importPicked,
    importUploadFiles,
    importFromClipboard,
    setWatchedFolder,
    db,
    notify,
  } = useStore();
  const fileInput = useRef<HTMLInputElement>(null);

  async function onImport() {
    if (isTauri) {
      const picked = await pickImageFiles();
      if (picked.length) {
        const n = await importPicked(picked, "upload");
        notify(
          n ? `Imported ${n} screenshot${n > 1 ? "s" : ""}.` : "Already imported."
        );
      }
    } else {
      fileInput.current?.click();
    }
  }

  async function onWatch() {
    if (!isTauri) {
      notify("Folder watching is available in the desktop app.", "error");
      go("settings");
      return;
    }
    const dir = await pickFolder();
    if (dir) {
      setWatchedFolder(dir);
      notify("Now watching that folder for new screenshots.");
      go("inbox");
    }
  }

  return (
    <div className="page home">
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

      <section className="hero">
        <div className="hero-badge">
          <Icon name="bolt" size={14} /> Local-first · No cloud · No login
        </div>
        <h1 className="hero-title">The missing clipboard between AI tools.</h1>
        <p className="hero-sub">
          Turn screenshots into clean AI-ready handoff packets for ChatGPT,
          Claude, Manus, Lovable, v0, Figma AI, and every other AI workspace.
        </p>

        <div className="hero-actions">
          <button className="btn btn-primary btn-lg" onClick={onImport}>
            <Icon name="upload" size={18} /> Import Screenshot
          </button>
          <button className="btn btn-ghost btn-lg" onClick={onWatch}>
            <Icon name="folder" size={18} /> Choose Watch Folder
          </button>
          <button className="btn btn-ghost btn-lg" onClick={() => go("create")}>
            <Icon name="create" size={18} /> Create AI Packet
          </button>
        </div>

        <div className="hero-tools">
          <span className="hero-tools-label">Paste into</span>
          {TOOLS.map((t) => (
            <span key={t} className="tool-chip">
              {t}
            </span>
          ))}
        </div>
      </section>

      <section className="steps">
        {STEPS.map((s, i) => (
          <div key={s.title} className="step-card">
            <div className="step-index">{i + 1}</div>
            <div className="step-icon">
              <Icon name={s.icon} size={24} />
            </div>
            <h3>{s.title}</h3>
            <p>{s.body}</p>
          </div>
        ))}
      </section>

      <section className="home-stats">
        <button className="stat" onClick={() => go("inbox")}>
          <span className="stat-num">{db.screenshots.length}</span>
          <span className="stat-label">Screenshots in inbox</span>
        </button>
        <button className="stat" onClick={() => go("history")}>
          <span className="stat-num">{db.packets.length}</span>
          <span className="stat-label">Packets generated</span>
        </button>
        <button className="stat" onClick={() => go("projects")}>
          <span className="stat-num">{db.projects.length}</span>
          <span className="stat-label">Projects</span>
        </button>
        <button className="stat clip" onClick={() => void importFromClipboard()}>
          <span className="stat-icon">
            <Icon name="clipboard" size={22} />
          </span>
          <span className="stat-label">Import from clipboard</span>
        </button>
      </section>
    </div>
  );
}
