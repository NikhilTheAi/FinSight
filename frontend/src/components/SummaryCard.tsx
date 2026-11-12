type SummaryCardProps = {
  label: string;
  amount: string;
  change: string;
  positive: boolean;
  accent?: 'primary' | 'neutral';
};

export function SummaryCard({
  label,
  amount,
  change,
  positive,
  accent = 'neutral',
}: SummaryCardProps) {
  return (
    <article className={`summary-card ${accent === 'primary' ? 'primary' : ''}`}>
      <div className="summary-header">
        <span>{label}</span>
        <span className={`trend ${positive ? 'positive' : 'negative'}`}>{change}</span>
      </div>
      <div className="summary-amount">{amount}</div>
    </article>
  );
}
