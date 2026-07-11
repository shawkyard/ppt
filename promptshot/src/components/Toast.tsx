import { useStore } from "../state/store";
import { Icon } from "./Icon";

export function ToastHost() {
  const { toasts, dismissToast } = useStore();
  return (
    <div className="toast-host">
      {toasts.map((t) => (
        <div
          key={t.id}
          className={`toast ${t.tone === "error" ? "toast-error" : "toast-ok"}`}
          onClick={() => dismissToast(t.id)}
        >
          <Icon name={t.tone === "error" ? "x" : "check"} size={16} />
          <span>{t.message}</span>
        </div>
      ))}
    </div>
  );
}
