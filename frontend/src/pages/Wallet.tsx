import { useMemo, useState } from 'react';
import {
  Banknote,
  CreditCard as CreditCardIcon,
  Landmark,
  Pencil,
  Plus,
  Trash2,
  Wallet as WalletIcon,
  X,
} from 'lucide-react';

import { CustomSelect } from '../components/CustomSelect';
import { Sidebar } from '../components/Sidebar';

type AccountType = 'Bank Account' | 'Cash' | 'UPI Wallet' | 'Credit Card';

type Account = {
  id: string;
  name: string;
  type: AccountType;
  balance: number;
};

const accountTypeOptions: AccountType[] = ['Bank Account', 'Cash', 'UPI Wallet', 'Credit Card'];

const initialAccounts: Account[] = [
  { id: 'acc-1', name: 'HDFC Bank', type: 'Bank Account', balance: 48500 },
  { id: 'acc-2', name: 'SBI Bank', type: 'Bank Account', balance: 22750 },
  { id: 'acc-3', name: 'Cash', type: 'Cash', balance: 5000 },
  { id: 'acc-4', name: 'UPI Wallet', type: 'UPI Wallet', balance: 8000 },
];

const getAccountIcon = (type: AccountType) => {
  if (type === 'Credit Card') return CreditCardIcon;
  if (type === 'Cash') return Banknote;
  if (type === 'UPI Wallet') return WalletIcon;
  return Landmark;
};

export function Wallet() {
  const [accounts, setAccounts] = useState<Account[]>(initialAccounts);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ name: '', type: 'Bank Account' as AccountType, balance: '0' });
  const [formError, setFormError] = useState('');

  const totalBalance = useMemo(
    () => accounts.reduce((sum, account) => sum + account.balance, 0),
    [accounts],
  );

  const handleOpenAdd = () => {
    setEditingId(null);
    setForm({ name: '', type: 'Bank Account', balance: '0' });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (account: Account) => {
    setEditingId(account.id);
    setForm({ name: account.name, type: account.type, balance: String(account.balance) });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleClose = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setForm({ name: '', type: 'Bank Account', balance: '0' });
    setFormError('');
  };

  const handleSubmit = () => {
    if (!form.name.trim()) {
      setFormError('Account name is required.');
      return;
    }

    const balanceValue = Number(form.balance);
    if (!Number.isFinite(balanceValue) || balanceValue < 0) {
      setFormError('Enter a valid balance greater than or equal to zero.');
      return;
    }

    const nextAccount: Account = {
      id: editingId ?? `acc-${Date.now()}`,
      name: form.name.trim(),
      type: form.type,
      balance: balanceValue,
    };

    setAccounts((current) => {
      if (editingId) {
        return current.map((account) => (account.id === editingId ? nextAccount : account));
      }

      return [nextAccount, ...current];
    });

    handleClose();
  };

  const handleDelete = (id: string) => {
    setAccounts((current) => current.filter((account) => account.id !== id));
  };

  return (
    <div className="app-shell">
      <Sidebar activeItem="Wallet" />

      <main className="main-panel">
        <header className="page-header top-header">
          <div>
            <h1>My Wallet</h1>
            <p>Manage your accounts and track your money.</p>
          </div>

          <div className="header-actions">
            <button type="button" className="primary-button" onClick={handleOpenAdd}>
              <Plus size={16} />
              Add Account
            </button>
          </div>
        </header>

        <section className="summary-grid wallet-summary-grid" aria-label="Wallet summary">
          <article className="summary-card primary">
            <div className="summary-header">
              <span>Total Available Balance</span>
              <span className="trend positive">+3.8%</span>
            </div>
            <div className="summary-amount">₹{totalBalance.toLocaleString()}</div>
          </article>
        </section>

        <section className="account-grid">
          {accounts.map((account) => {
            const Icon = getAccountIcon(account.type);

            return (
              <article key={account.id} className="account-card">
                <div className="account-card-header">
                  <div className="account-title-wrap">
                    <div className="account-icon">
                      <Icon size={18} />
                    </div>
                    <div>
                      <h3>{account.name}</h3>
                      <span>{account.type}</span>
                    </div>
                  </div>

                  <div className="account-actions">
                    <button type="button" className="icon-action" aria-label={`Edit ${account.name}`} onClick={() => handleOpenEdit(account)}>
                      <Pencil size={14} />
                    </button>
                    <button type="button" className="icon-action danger" aria-label={`Delete ${account.name}`} onClick={() => handleDelete(account.id)}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>

                <div className="account-amount">₹{account.balance.toLocaleString()}</div>
                <div className="account-footer">
                  <span className="account-pill">Active</span>
                  <button type="button" className="text-button">View Details</button>
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
              <h3>{editingId ? 'Edit Account' : 'Add Account'}</h3>
              <button type="button" className="icon-button modal-close" onClick={handleClose} aria-label="Close account form">
                <X size={18} />
              </button>
            </div>

            <div className="modal-form">
              <label className="field-group">
                <span>Account Name</span>
                <input
                  type="text"
                  value={form.name}
                  onChange={(event) => setForm((current) => ({ ...current, name: event.target.value }))}
                  placeholder="e.g. Axis Bank"
                />
              </label>

              <label className="field-group">
                <span>Account Type</span>
                <CustomSelect
                  options={accountTypeOptions.map((type) => ({ label: type, value: type }))}
                  value={form.type}
                  onChange={(value) => setForm((current) => ({ ...current, type: value as AccountType }))}
                />
              </label>

              <label className="field-group full-span">
                <span>Initial Balance</span>
                <input
                  type="number"
                  min="0"
                  step="1"
                  value={form.balance}
                  onChange={(event) => setForm((current) => ({ ...current, balance: event.target.value }))}
                  placeholder="0"
                />
              </label>
            </div>

            {formError ? <div className="field-error form-error">{formError}</div> : null}

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={handleClose}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={handleSubmit}>
                {editingId ? 'Save Changes' : 'Add Account'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
