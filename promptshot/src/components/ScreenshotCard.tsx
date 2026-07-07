import { Screenshot } from "../types";
import { useImageUrl } from "../lib/useImageUrl";
import { useStore } from "../state/store";
import { Icon } from "./Icon";
import { formatDateTime } from "../lib/format";

const SOURCE_LABEL: Record<Screenshot["source"], string> = {
  clipboard: "Clipboard",
  folder: "Watched folder",
  upload: "Upload",
};

interface Props {
  shot: Screenshot;
  selectable?: boolean;
  showDelete?: boolean;
  compact?: boolean;
}

export function ScreenshotCard({
  shot,
  selectable = true,
  showDelete = true,
  compact = false,
}: Props) {
  const url = useImageUrl(shot);
  const { isSelected, toggleSelect, removeScreenshot, db } = useStore();
  const active = isSelected(shot.id);
  const project = db.projects.find((p) => p.id === shot.projectId);

  return (
    <div
      className={`shot-card ${active ? "selected" : ""} ${compact ? "compact" : ""}`}
      onClick={() => selectable && toggleSelect(shot.id)}
    >
      <div className="shot-thumb">
        {url ? (
          <img src={url} alt={shot.fileName} loading="lazy" />
        ) : (
          <div className="shot-thumb-empty">
            <Icon name="camera" size={26} />
          </div>
        )}
        {selectable && (
          <span className={`shot-check ${active ? "on" : ""}`}>
            {active && <Icon name="check" size={14} />}
          </span>
        )}
        <span className={`shot-source src-${shot.source}`}>
          {SOURCE_LABEL[shot.source]}
        </span>
      </div>

      <div className="shot-meta">
        <div className="shot-name" title={shot.fileName}>
          {shot.fileName}
        </div>
        <div className="shot-date">{formatDateTime(shot.createdAt)}</div>
        {project && <div className="shot-project">📁 {project.name}</div>}
      </div>

      {showDelete && (
        <button
          className="shot-delete"
          title="Remove from PromptShot"
          onClick={(e) => {
            e.stopPropagation();
            void removeScreenshot(shot.id);
          }}
        >
          <Icon name="trash" size={16} />
        </button>
      )}
    </div>
  );
}
