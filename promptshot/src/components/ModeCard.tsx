import { ModeMeta } from "../lib/prompts";
import { Icon } from "./Icon";

interface Props {
  mode: ModeMeta;
  active: boolean;
  disabled?: boolean;
  onSelect(): void;
}

export function ModeCard({ mode, active, disabled, onSelect }: Props) {
  return (
    <button
      className={`mode-card ${active ? "active" : ""} ${disabled ? "disabled" : ""}`}
      onClick={onSelect}
      disabled={disabled}
      title={disabled ? "Select at least two screenshots for this mode" : mode.blurb}
    >
      <span className="mode-icon">
        <Icon name={mode.icon} size={22} />
      </span>
      <span className="mode-text">
        <span className="mode-title">{mode.title}</span>
        <span className="mode-tagline">{mode.tagline}</span>
      </span>
      {active && (
        <span className="mode-check">
          <Icon name="check" size={16} />
        </span>
      )}
    </button>
  );
}
