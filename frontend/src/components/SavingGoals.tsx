import { savingsGoals } from '../data/mockData';

export function SavingGoals() {
  return (
    <div className="panel goals-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Planning</p>
          <h2>Saving Goals</h2>
        </div>
      </div>

      <div className="goal-list">
        {savingsGoals.map((goal) => {
          const percentage = Math.min((goal.saved / goal.target) * 100, 100);

          return (
            <div key={goal.name} className="goal-item">
              <div className="goal-topline">
                <span>{goal.name}</span>
                <strong>
                  ₹{goal.saved.toLocaleString()} / ₹{goal.target.toLocaleString()}
                </strong>
              </div>

              <div className="goal-bar">
                <span style={{ width: `${percentage}%`, background: goal.accent }} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
