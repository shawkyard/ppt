import { useEffect, useMemo, useState } from "react";
import { Icon } from "../components/Icon";
import { ModeCard } from "../components/ModeCard";
import { ScreenshotCard } from "../components/ScreenshotCard";
import { MODES, generatePacket } from "../lib/prompts";
import { useStore } from "../state/store";
import { useNav } from "../state/nav";
import { PacketMode } from "../types";
import { copyText } from "../lib/clipboard";

export function CreatePacket() {
  const {
    db,
    selectedScreenshots,
    selected,
    clearSelection,
    savePacket,
    notify,
  } = useStore();
  const { go, consumePendingMode } = useNav();

  const [mode, setMode] = useState<PacketMode | null>(null);
  const [note, setNote] = useState("");
  const [projectId, setProjectId] = useState<string>("");
  const [copied, setCopied] = useState(false);
  const [savedId, setSavedId] = useState<string | null>(null);

  useEffect(() => {
    const pending = consumePendingMode();
    if (pending) setMode(pending);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const shots = selectedScreenshots();
  const canCompare = shots.length >= 2;

  const packet = useMemo(() => {
    if (!mode) return "";
    return generatePacket(mode, note, shots);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, note, selected, db.screenshots]);

  useEffect(() => {
    setCopied(false);
    setSavedId(null);
  }, [packet]);

  async function onCopy() {
    if (!packet || !mode) return;
    await copyText(packet);
    setCopied(true);
    if (!savedId) {
      const id = crypto.randomUUID?.() ?? String(Date.now());
      savePacket({
        mode,
        contextNote: note,
        screenshotIds: shots.map((s) => s.id),
        generatedText: packet,
        projectId: projectId || undefined,
      });
      setSavedId(id);
      notify("Copied — packet saved to History.");
    } else {
      notify("Copied to clipboard.");
    }
  }

  return (
    <div className="page create">
      <header className="page-head">
        <div>
          <h1>Create AI Packet</h1>
          <p className="page-sub">
            Screenshots + context + mode = a perfect AI handoff packet.
          </p>
        </div>
      </header>

      {/* Step 1 — screenshots */}
      <section className="build-block">
        <div className="block-head">
          <span className="step-num">1</span>
          <h2>Screenshots</h2>
          <span className="count-pill">
            {shots.length} screenshot{shots.length === 1 ? "" : "s"} selected
          </span>
          {shots.length > 0 && (
            <button className="btn btn-ghost btn-sm" onClick={clearSelection}>
              Clear
            </button>
          )}
        </div>

        {db.screenshots.length === 0 ? (
          <div className="empty small">
            <p>
              No screenshots yet.{" "}
              <button className="linklike" onClick={() => go("inbox")}>
                Go to the Inbox
              </button>{" "}
              to import some.
            </p>
          </div>
        ) : (
          <div className="shot-strip">
            {db.screenshots.map((s) => (
              <ScreenshotCard key={s.id} shot={s} showDelete={false} compact />
            ))}
          </div>
        )}
      </section>

      {/* Step 2 — context */}
      <section className="build-block">
        <div className="block-head">
          <span className="step-num">2</span>
          <h2>What are you trying to do?</h2>
        </div>
        <textarea
          className="note-input"
          placeholder="Example: I want ChatGPT to look at these screenshots and tell me the exact next prompt to give Lovable."
          value={note}
          onChange={(e) => setNote(e.target.value)}
          rows={3}
        />
        {db.projects.length > 0 && (
          <div className="project-select">
            <label>Save under project</label>
            <select
              value={projectId}
              onChange={(e) => setProjectId(e.target.value)}
            >
              <option value="">None</option>
              {db.projects.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        )}
      </section>

      {/* Step 3 — mode */}
      <section className="build-block">
        <div className="block-head">
          <span className="step-num">3</span>
          <h2>Choose a mode</h2>
        </div>
        <div className="mode-grid">
          {MODES.map((m) => (
            <ModeCard
              key={m.id}
              mode={m}
              active={mode === m.id}
              disabled={m.id === "compare" && !canCompare}
              onSelect={() => setMode(m.id)}
            />
          ))}
        </div>
      </section>

      {/* Step 4 — packet */}
      <section className="build-block">
        <div className="block-head">
          <span className="step-num">4</span>
          <h2>Your handoff packet</h2>
          {packet && (
            <button
              className={`btn btn-primary btn-sm ${copied ? "ok" : ""}`}
              onClick={onCopy}
            >
              <Icon name={copied ? "check" : "copy"} size={15} />
              {copied ? "Copied" : "Copy AI Packet"}
            </button>
          )}
        </div>

        {!mode ? (
          <div className="empty small">
            <p>Pick a mode above to generate your packet.</p>
          </div>
        ) : (
          <>
            {shots.length === 0 && (
              <div className="warn-inline">
                <Icon name="camera" size={16} /> No screenshots selected — the
                packet still works, but remember to attach images when you paste.
              </div>
            )}
            <pre className="packet-preview">{packet}</pre>
            <p className="packet-foot">
              <Icon name="bolt" size={14} /> Paste this into ChatGPT, Claude,
              Lovable, v0, Manus, or any AI — then attach the screenshots above.
            </p>
          </>
        )}
      </section>
    </div>
  );
}
