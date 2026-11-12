import { useMemo, useState } from 'react';
import { Pencil, Plus, Target, Trash2, X } from 'lucide-react';

import { Sidebar } from '../components/Sidebar';

type Goal = {
  id: string;
  name: string;
  current: number;
  target: number;
  targetDate: string;
};

const initialGoals: Goal[] = [
  { id: 'g-1', name: 'MacBook Pro', current: 16500, target: 60000, targetDate: '2026-12-31' },
  { id: 'g-2', name: 'New House', current: 60000, target: 150000, targetDate: '2027-06-30' },
  { id: 'g-3', name: 'New Car', current: 45000, target: 90000, targetDate: '2027-02-15' },
];

const getProgressColor = (ratio: number) => {
  if (ratio < 0.5) return '#2F7D5B';
  if (ratio < 0.8) return '#d79c52';
  return '#2F7D5B';
};

export function Goals() {
  const [goals, setGoals] = useState<Goal[]>(initialGoals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', current: '0', target: '0', targetDate: '2027-12-31' });
  const [formError, setFormError] = useState('');

  const totalSaved = useMemo(() => goals.reduce((sum, goal) => sum + goal.current, 0), [goals]);
  const totalTarget = useMemo(() => goals.reduce((sum, goal) => sum + goal.target, 0), [goals]);
  const overallProgress = totalTarget > 0 ? (totalSaved / totalTarget) * 100 : 0;

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ name: '', current: '0', target: '0', targetDate: '2027-12-31' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (goal: Goal) => {
    setEditingId(goal.id);
    setForm({ name: goal.name, current: String(goal.current), target: String(goal.target), targetDate: goal.targetDate });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: '', current: '0', target: '0', targetDate: '2027-12-31' });
    setFormError('');
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setFormError('Goal name is required.');
      return;
    }

    const currentValue = Number(form.current);
    const targetValue = Number(form.target);

    if (!Number.isFinite(currentValue) || currentValue < 0 || !Number.isFinite(targetValue) || targetValue <= 0) {
      setFormError('Enter valid current savings and target values.');
      return;
    }

    const nextGoal: Goal = {
      id: editingId ?? `goal-${Date.now()}`,
      name: form.name.trim(),
      current: currentValue,
      target: targetValue,
      targetDate: form.targetDate,
    };

    setGoals((current) => {
      if (editingId) {
        return current.map((goal) => (goal.id === editingId ? nextGoal : goal));
      }

      return [nextGoal, ...current];
    });

    handleClose();
  };

  const handleDelete = (id: string) => {
    setGoals((current) => current.filter((goal) => goal.id !== id));
  };

  return (
    <div className="app-shell">
      <Sidebar activeItem="Goals" />

      <main className="main-panel">
        <header className="page-header top-header">
          <div>
            <h1>Saving Goals</h1>
            <p>Turn your financial plans into achievable goals.</p>
          </div>

          <div className="header-actions">
            <button type="button" className="primary-button" onClick={handleOpenAdd}>
              <Plus size={16} />
              Create Goal
            </button>
          </div>
        </header>

        <section className="summary-grid goals-summary-grid" aria-label="Goals summary">
          <article className="summary-card">
            <div className="summary-header">
              <span>Total Saved</span>
              <span className="trend positive">+5.4%</span>
            </div>
            <div className="summary-amount">₹{totalSaved.toLocaleString()}</div>
          </article>

          <article className="summary-card">
            <div className="summary-header">
              <span>Total Target</span>
              <span className="trend neutral">Plan</span> 
            </div>
            <div className="summary-amount">₹{totalTarget.toLocaleString()}</div>
          </article>

          <article className="summary-card primary">
            <div className="summary-header">
              <span>Overall Progress</span>
              <span className="trend positive">On track</span>
            </div>
            <div className="summary-amount">{overallProgress.toFixed(1)}%</div>
          </article>
        </section>

        <section className="goal-list-grid">
          {goals.map((goal) => {
            const progress = goal.target > 0 ? (goal.current / goal.target) * 100 : 0;
            const color = getProgressColor(progress / 100);

            return (
              <article key={goal.id} className="panel goal-card">
                <div className="goal-card-top">
                  <div className="goal-title-wrap">
                    <div className="account-icon goal-icon">
                      <Target size={18} />
                    </div>
                    <div>
                      <h3>{goal.name}</h3>
                      <p>
                        ₹{goal.current.toLocaleString()} / ₹{goal.target.toLocaleString()}
                      </p>
                    </div>
                  </div>

                  <div className="account-actions">
                    <button type="button" className="icon-action" aria-label={`Edit ${goal.name}`} onClick={() => handleOpenEdit(goal)}>
                      <Pencil size={14} />
                    </button>
                    <button type="button" className="icon-action danger" aria-label={`Delete ${goal.name}`} onClick={() => handleDelete(goal.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="goal-metric-row">
                  <span>{Math.round(progress)}% complete</span>
                  <span>Target: {new Date(goal.targetDate).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                </div>

                <div className="goal-bar">
                  <span style={{ width: `${Math.min(progress, 100)}%`, background: color }} />
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
              <h3>{editingId ? 'Edit Goal' : 'Create Goal'}</h3>
              <button type="button" className="icon-button modal-close" onClick={handleClose} aria-label="Close goal form">
                <X size={18} />
              </button>
            </div>

            <div className="modal-form">
              <label className="field-group full-span">
                <span>Goal Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="Travel Fund"
                />
              </label>

              <label className="field-group">
                <span>Target Amount</span>
                <input
                  type="number"
                  min="1"
                  step="1"
                  value={form.target}
                  onChange={(event) => setForm((current) => ({ ...current, target: event.target.value }))}
                />
              </label>

              <label className="field-group">
                <span>Current Savings</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.current}
                  onChange={(event) => setForm((current) => ({ ...current, current: event.target.value }))}
                />
              </label>

              <label className="field-group full-span">
                <span>Target Date</span>
                <input
                  type="date"
                  value={form.targetDate}
                  onChange={(event) => setForm((current) => ({ ...current, targetDate: event.target.value }))}
                />
              </label>
            </div>

            {formError ? <div className="field-error form-error">{formError}</div> : null}

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={handleClose}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={handleSubmit}>
                {editingId ? 'Save Changes' : 'Add Goal'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
