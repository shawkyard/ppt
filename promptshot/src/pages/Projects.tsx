import { useState } from "react";
import { Icon } from "../components/Icon";
import { ScreenshotCard } from "../components/ScreenshotCard";
import { useStore } from "../state/store";
import { formatDateTime } from "../lib/format";
import { modeMeta } from "../lib/prompts";

export function Projects() {
  const {
    db,
    selected,
    createProject,
    assignScreenshotsToProject,
    deleteProject,
    clearSelection,
    notify,
  } = useStore();
  const [name, setName] = useState("");

  function onCreate() {
    if (!name.trim()) return;
    createProject(name);
    setName("");
    notify("Project created.");
  }

  function assign(projectId: string | null) {
    if (selected.size === 0) {
      notify("Select screenshots in the Inbox first.", "error");
      return;
    }
    assignScreenshotsToProject([...selected], projectId);
    notify(
      projectId
        ? `Assigned ${selected.size} screenshot(s) to project.`
        : `Removed ${selected.size} screenshot(s) from their project.`
    );
    clearSelection();
  }

  const unassigned = db.screenshots.filter((s) => !s.projectId);

  return (
    <div className="page">
      <header className="page-head">
        <div>
          <h1>Projects</h1>
          <p className="page-sub">
            Group screenshots and saved packets by what you're working on. All
            local — no sync.
          </p>
        </div>
      </header>

      <div className="new-project">
        <input
          value={name}
          placeholder="New project name (e.g. Landing page redesign)"
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && onCreate()}
        />
        <button className="btn btn-primary" onClick={onCreate}>
          <Icon name="plus" size={16} /> Create project
        </button>
      </div>

      {selected.size > 0 && (
        <div className="assign-bar">
          <span>{selected.size} screenshot(s) selected —</span>
          {db.projects.map((p) => (
            <button key={p.id} className="chip active" onClick={() => assign(p.id)}>
              → {p.name}
            </button>
          ))}
          <button className="chip" onClick={() => assign(null)}>
            Unassign
          </button>
        </div>
      )}

      {db.projects.length === 0 ? (
        <div className="empty">
          <Icon name="folder" size={40} />
          <h3>No projects yet</h3>
          <p>Create one above to organize your screenshots and packets.</p>
        </div>
      ) : (
        db.projects.map((project) => {
          const shots = db.screenshots.filter((s) => s.projectId === project.id);
          const packets = db.packets.filter((p) => p.projectId === project.id);
          return (
            <section key={project.id} className="project-block">
              <div className="project-head">
                <div>
                  <h2>{project.name}</h2>
                  <span className="page-sub">
                    {shots.length} screenshot(s) · {packets.length} packet(s) ·
                    created {formatDateTime(project.createdAt)}
                  </span>
                </div>
                <button
                  className="btn btn-ghost btn-sm danger"
                  onClick={() => deleteProject(project.id)}
                >
                  <Icon name="trash" size={15} /> Delete
                </button>
              </div>

              {shots.length > 0 ? (
                <div className="shot-strip">
                  {shots.map((s) => (
                    <ScreenshotCard key={s.id} shot={s} compact showDelete={false} />
                  ))}
                </div>
              ) : (
                <p className="muted">
                  No screenshots yet. Select some in the Inbox, then assign them
                  here.
                </p>
              )}

              {packets.length > 0 && (
                <div className="project-packets">
                  {packets.map((p) => (
                    <span key={p.id} className="packet-tag">
                      <Icon name={modeMeta(p.mode).icon} size={13} />
                      {modeMeta(p.mode).title}
                    </span>
                  ))}
                </div>
              )}
            </section>
          );
        })
      )}

      {unassigned.length > 0 && (
        <p className="muted small">
          {unassigned.length} screenshot(s) are not in any project.
        </p>
      )}
    </div>
  );
}
