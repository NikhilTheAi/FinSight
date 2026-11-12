import { CreditCard, PiggyBank, Plus, Target } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const actions = [
  { label: 'Add Expense', icon: CreditCard, type: 'expense' },
  { label: 'Add Income', icon: Plus, type: 'income' },
  { label: 'Set Budget', icon: PiggyBank, type: null },
  { label: 'Create Goal', icon: Target, type: null },
];

export function QuickActions() {
  const navigate = useNavigate();

  return (
    <div className="panel actions-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Actions</p>
          <h2>Quick Actions</h2>
        </div>
      </div>

      <div className="quick-actions-grid">
        {actions.map(({ label, icon: Icon, type }) => (
          <button
            key={label}
            type="button"
            className="action-button"
            onClick={() => {
              if (type === 'expense') navigate('/transactions?type=expense');
              else if (type === 'income') navigate('/transactions?type=income');
            }}
          >
            <span className="action-icon">
              <Icon size={18} />
            </span>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
