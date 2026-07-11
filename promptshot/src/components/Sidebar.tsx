import { Icon } from "./Icon";
import { Page, useNav } from "../state/nav";
import { useStore } from "../state/store";
import { MODE_LABEL } from "../lib/env";

const NAV: { page: Page; label: string; icon: string }[] = [
  { page: "home", label: "Home", icon: "home" },
  { page: "inbox", label: "Inbox", icon: "inbox" },
  { page: "create", label: "Create Packet", icon: "create" },
  { page: "projects", label: "Projects", icon: "folder" },
  { page: "history", label: "History", icon: "history" },
  { page: "settings", label: "Settings", icon: "settings" },
];

export function Sidebar() {
  const { page, go } = useNav();
  const { db, selected } = useStore();

  const counts: Partial<Record<Page, number>> = {
    inbox: db.screenshots.length,
    projects: db.projects.length,
    history: db.packets.length,
  };

  return (
    <aside className="sidebar">
      <div className="brand" onClick={() => go("home")} role="button" tabIndex={0}>
        <img src="/promptshot.png" alt="" className="brand-logo" />
        <div>
          <div className="brand-name">PromptShot</div>
          <div className="brand-sub">AI handoff clipboard</div>
        </div>
      </div>

      <nav className="nav">
        {NAV.map((item) => (
          <button
            key={item.page}
            className={`nav-item ${page === item.page ? "active" : ""}`}
            onClick={() => go(item.page)}
          >
            <Icon name={item.icon} size={19} />
            <span>{item.label}</span>
            {counts[item.page] ? (
              <span className="nav-count">{counts[item.page]}</span>
            ) : item.page === "create" && selected.size ? (
              <span className="nav-count accent">{selected.size}</span>
            ) : null}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <span className="env-dot" />
        {MODE_LABEL}
      </div>
    </aside>
  );
}
