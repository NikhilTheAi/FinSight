export function BudgetCard() {
  const spent = 21400;
  const total = 40000;
  const percentage = Math.round((spent / total) * 100);

  return (
    <div className="panel budget-panel">
      <div className="panel-header budget-header">
        <div>
          <p className="eyebrow">Budget</p>
          <h2>Monthly Budget</h2>
        </div>
      </div>

      <div className="budget-content">
        <div
          className="budget-ring"
          style={{
            background: `conic-gradient(#2F7D5B 0 ${percentage}%, #e9e3d9 ${percentage}% 100%)`,
          }}
        >
          <div className="budget-ring-inner">
            <span>{percentage}%</span>
          </div>
        </div>

        <div className="budget-text">
          <p>₹21,400 spent</p>
          <p className="muted">of ₹40,000</p>
          <p className="budget-used">53% used</p>
        </div>
      </div>

      <button type="button" className="secondary-button budget-button">
        Manage Budget
      </button>
    </div>
  );
}
