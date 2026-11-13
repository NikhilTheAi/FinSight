type SkeletonProps = {
  className?: string;
};

export function Skeleton({ className = '' }: SkeletonProps) {
  return <div className={`skeleton ${className}`.trim()} />;
}

export function SummaryCardSkeleton() {
  return (
    <div className="summary-card skeleton-card">
      <div className="summary-header">
        <Skeleton className="skeleton-line skeleton-line-short" />
        <Skeleton className="skeleton-pill" />
      </div>
      <Skeleton className="skeleton-line skeleton-line-large" />
    </div>
  );
}

export function TransactionRowSkeleton() {
  return (
    <tr className="skeleton-row">
      <td>
        <div className="table-title-wrap">
          <Skeleton className="skeleton-avatar" />
          <div className="skeleton-stack">
            <Skeleton className="skeleton-line skeleton-line-long" />
            <Skeleton className="skeleton-line skeleton-line-small" />
          </div>
        </div>
      </td>
      <td><Skeleton className="skeleton-line skeleton-line-mid" /></td>
      <td><Skeleton className="skeleton-line skeleton-line-mid" /></td>
      <td><Skeleton className="skeleton-line skeleton-line-mid" /></td>
      <td><Skeleton className="skeleton-line skeleton-line-short" /></td>
      <td><Skeleton className="skeleton-pill" /></td>
      <td><div className="action-group"><Skeleton className="skeleton-icon-button" /><Skeleton className="skeleton-icon-button" /></div></td>
    </tr>
  );
}

export function ChartSkeleton() {
  return (
    <div className="panel skeleton-panel">
      <div className="panel-header compact-header">
        <Skeleton className="skeleton-line skeleton-line-mid" />
      </div>
      <div className="skeleton-chart" />
    </div>
  );
}

export function PageSkeleton() {
  return (
    <div className="app-shell">
      <div className="skeleton-sidebar" />
      <main className="main-panel">
        <div className="skeleton-header" />
        <div className="summary-grid">
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
          <SummaryCardSkeleton />
        </div>
        <div className="panel skeleton-panel">
          <div className="skeleton-chart" />
        </div>
      </main>
    </div>
  );
}
