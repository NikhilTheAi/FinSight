import type { ReactNode } from 'react';
import { SearchX } from 'lucide-react';

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: ReactNode;
};

export function EmptyState({ title, description, actionLabel, onAction, icon }: EmptyStateProps) {
  return (
    <div className="empty-state">
      <div className="empty-state-icon">{icon ?? <SearchX size={22} />}</div>
      <h3>{title}</h3>
      <p>{description}</p>
      {actionLabel && onAction ? (
        <button type="button" className="primary-button empty-state-button" onClick={onAction}>
          {actionLabel}
        </button>
      ) : null}
    </div>
  );
}
