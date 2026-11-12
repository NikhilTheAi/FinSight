import { useMemo, useState } from 'react';
import { Pencil, Plus, Trash2, X } from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

import { Sidebar } from '../components/Sidebar';

const formatCurrencyValue = (value: number | string | readonly (number | string)[] | undefined) => {
  const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
  return `₹${Number.isFinite(numericValue) ? numericValue.toLocaleString() : '0'}`;
};

type Budget = {
  id: string;
  category: string;
  spent: number;
  limit: number;
};

const initialBudgets: Budget[] = [
  { id: 'b-1', category: 'Food & Dining', spent: 6200, limit: 10000 },
  { id: 'b-2', category: 'Shopping', spent: 5450, limit: 8000 },
  { id: 'b-3', category: 'Transport', spent: 2040, limit: 5000 },
  { id: 'b-4', category: 'Entertainment', spent: 1800, limit: 4000 },
  { id: 'b-5', category: 'Bills', spent: 5910, limit: 8000 },
];

const getProgressColor = (ratio: number) => {
  if (ratio < 0.7) return '#2F7D5B';
  if (ratio < 0.9) return '#d79c52';
  return '#d85c5c';
};

export function Budgets() {
  const [budgets, setBudgets] = useState<Budget[]>(initialBudgets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ category: 'Food & Dining', spent: '0', limit: '0' });
  const [formError, setFormError] = useState('');

  const totalLimit = useMemo(() => budgets.reduce((sum, budget) => sum + budget.limit, 0), [budgets]);
  const totalSpent = useMemo(() => budgets.reduce((sum, budget) => sum + budget.spent, 0), [budgets]);
  const remaining = totalLimit - totalSpent;
  const usedPercentage = totalLimit > 0 ? (totalSpent / totalLimit) * 100 : 0;

  const donutData = [
    { name: 'Spent', value: totalSpent },
    { name: 'Remaining', value: Math.max(remaining, 0) },
  ];

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ category: 'Food & Dining', spent: '0', limit: '0' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (budget: Budget) => {
    setEditingId(budget.id);
    setForm({ category: budget.category, spent: String(budget.spent), limit: String(budget.limit) });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ category: 'Food & Dining', spent: '0', limit: '0' });
    setFormError('');
  };

  const handleSubmit = () => {
    const spentValue = Number(form.spent);
    const limitValue = Number(form.limit);

    if (!form.category.trim()) {
      setFormError('Category is required.');
      return;
    }

    if (!Number.isFinite(spentValue) || spentValue < 0 || !Number.isFinite(limitValue) || limitValue <= 0) {
      setFormError('Enter valid non-negative spent value and a budget limit greater than zero.');
      return;
    }

    const nextBudget: Budget = {
      id: editingId ?? `budget-${Date.now()}`,
      category: form.category.trim(),
      spent: spentValue,
      limit: limitValue,
    };

    setBudgets((current) => {
      if (editingId) {
        return current.map((budget) => (budget.id === editingId ? nextBudget : budget));
      }

      return [nextBudget, ...current];
    });

    handleClose();
  };

  const handleDelete = (id: string) => {
    setBudgets((current) => current.filter((budget) => budget.id !== id));
  };

  return (
    <div className="app-shell">
      <Sidebar activeItem="Budgets" />

      <main className="main-panel">
        <header className="page-header top-header">
          <div>
            <h1>Budgets</h1>
            <p>Plan your spending and stay within your limits.</p>
          </div>

          <div className="header-actions">
            <button type="button" className="primary-button" onClick={handleOpenAdd}>
              <Plus size={16} />
              Create Budget
            </button>
          </div>
        </header>

        <section className="budget-overview page-grid-two">
          <article className="panel budget-summary-card">
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Budget snapshot</p>
                <h2>Monthly Budget</h2>
              </div>
            </div>

            <div className="budget-vertical-grid">
              <div className="budget-stats-line">
                <span>Monthly Budget</span>
                <strong>₹{totalLimit.toLocaleString()}</strong>
              </div>
              <div className="budget-stats-line">
                <span>Spent</span>
                <strong>₹{totalSpent.toLocaleString()}</strong>
              </div>
              <div className="budget-stats-line">
                <span>Remaining</span>
                <strong>₹{remaining.toLocaleString()}</strong>
              </div>
              <div className="budget-stats-line">
                <span>Used</span>
                <strong>{Math.round(usedPercentage)}%</strong>
              </div>
            </div>
          </article>

          <article className="panel budget-chart-panel">
            <div className="panel-header compact-header">
              <div>
                <p className="eyebrow">Overview</p>
                <h2>Budget Health</h2>
              </div>
            </div>

            <div className="donut-wrapper">
              <ResponsiveContainer width="100%" height={200}>
                <PieChart>
                  <Pie data={donutData} dataKey="value" innerRadius={42} outerRadius={68} startAngle={90} endAngle={-270}>
                    {donutData.map((entry, index) => (
                      <Cell key={entry.name} fill={index === 0 ? '#2F7D5B' : '#E6E0D8'} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatCurrencyValue} />
                </PieChart>
              </ResponsiveContainer>

              <div className="donut-center">
                <strong>{Math.round(usedPercentage)}%</strong>
                <span>Used</span>
              </div>
            </div>
          </article>
        </section>

        <section className="budget-list-area">
          {budgets.map((budget) => {
            const ratio = budget.limit > 0 ? budget.spent / budget.limit : 0;
            const color = getProgressColor(ratio);

            return (
              <article key={budget.id} className="panel budget-item">
                <div className="budget-item-top">
                  <div>
                    <h3>{budget.category}</h3>
                    <p>
                      ₹{budget.spent.toLocaleString()} / ₹{budget.limit.toLocaleString()}
                    </p>
                  </div>

                  <div className="account-actions">
                    <button type="button" className="icon-action" aria-label={`Edit ${budget.category}`} onClick={() => handleOpenEdit(budget)}>
                      <Pencil size={14} />
                    </button>
                    <button type="button" className="icon-action danger" aria-label={`Delete ${budget.category}`} onClick={() => handleDelete(budget.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="goal-bar">
                  <span style={{ width: `${Math.min(ratio * 100, 100)}%`, background: color }} />
                </div>
                <div className="budget-legend">
                  <span>{Math.round(ratio * 100)}% used</span>
                  <span>{budget.limit - budget.spent > 0 ? `₹${(budget.limit - budget.spent).toLocaleString()} left` : 'Limit reached'}</span>
                </div>
              </article>
            );
          })}
        </section>
      </main>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleClose}>
          <div className="transaction-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Budget' : 'Create Budget'}</h3>
              <button type="button" className="icon-button modal-close" onClick={handleClose} aria-label="Close budget form">
                <X size={18} />
              </button>
            </div>

            <div className="modal-form">
              <label className="field-group full-span">
                <span>Category</span>
                <input
                  type="text"
                  value={form.category}
                  onChange={(event) => setForm((current) => ({ ...current, category: event.target.value }))}
                  placeholder="Food & Dining"
                />
              </label>

              <label className="field-group">
                <span>Spent</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.spent}
                  onChange={(event) => setForm((current) => ({ ...current, spent: event.target.value }))}
                />
              </label>

              <label className="field-group">
                <span>Limit</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.limit}
                  onChange={(event) => setForm((current) => ({ ...current, limit: event.target.value }))}
                />
              </label>
            </div>

            {formError ? <div className="field-error form-error">{formError}</div> : null}

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={handleClose}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={handleSubmit}>
                {editingId ? 'Save Changes' : 'Add Budget'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
