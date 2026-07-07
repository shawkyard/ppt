import { useState } from "react";
import { Icon } from "../components/Icon";
import { useStore } from "../state/store";
import { modeMeta } from "../lib/prompts";
import { copyText } from "../lib/clipboard";
import { formatDateTime } from "../lib/format";

export function History() {
  const { db, deletePacket, clearHistory, notify } = useStore();
  const [openId, setOpenId] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  async function copyAgain(id: string, text: string) {
    await copyText(text);
    setCopiedId(id);
    notify("Copied to clipboard.");
    setTimeout(() => setCopiedId((c) => (c === id ? null : c)), 1800);
  }

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>History</h1>
          <p className="page-sub">Every packet you've generated, stored locally.</p>
        </div>
        {db.packets.length > 0 && (
          <button
            className="btn btn-ghost btn-sm danger"
            onClick={() => {
              if (confirm("Clear all packet history? This cannot be undone."))
                clearHistory();
            }}
          >
            <Icon name="trash" size={15} /> Clear history
          </button>
        )}
      </header>

      {db.packets.length === 0 ? (
        <div className="empty">
          <Icon name="history" size={40} />
          <h3>No packets yet</h3>
          <p>Generated packets will show up here so you can copy them again.</p>
        </div>
      ) : (
        <div className="history-list">
          {db.packets.map((p) => {
            const meta = modeMeta(p.mode);
            const project = db.projects.find((x) => x.id === p.projectId);
            const open = openId === p.id;
            return (
              <div key={p.id} className="history-item">
                <div className="history-row" onClick={() => setOpenId(open ? null : p.id)}>
                  <span className="history-mode">
                    <Icon name={meta.icon} size={16} /> {meta.title}
                  </span>
                  <span className="history-meta">
                    {p.screenshotIds.length} shot(s)
                    {project && <> · 📁 {project.name}</>} · {formatDateTime(p.createdAt)}
                  </span>
                  <span className="history-note">
                    {p.contextNote.trim() || <em className="muted">No note</em>}
                  </span>
                  <span className="history-actions">
                    <button
                      className={`btn btn-ghost btn-sm ${copiedId === p.id ? "ok" : ""}`}
                      onClick={(e) => {
                        e.stopPropagation();
                        void copyAgain(p.id, p.generatedText);
                      }}
                    >
                      <Icon name={copiedId === p.id ? "check" : "copy"} size={14} />
                      {copiedId === p.id ? "Copied" : "Copy again"}
                    </button>
                    <button
                      className="btn btn-ghost btn-sm danger"
                      onClick={(e) => {
                        e.stopPropagation();
                        deletePacket(p.id);
                      }}
                    >
                      <Icon name="trash" size={14} />
                    </button>
                  </span>
                </div>
                {open && <pre className="packet-preview inline">{p.generatedText}</pre>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
