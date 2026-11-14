import { useEffect, useMemo, useState } from 'react';
import {
  Bell,
  Edit3,
  Plus,
  Search,
  Trash2,
  X,
} from 'lucide-react';
import { useSearchParams } from 'react-router-dom';

import { CustomSelect } from '../components/CustomSelect';
import { DatePicker } from '../components/DatePicker';
import { EmptyState } from '../components/EmptyState';
import { SummaryCard } from '../components/SummaryCard';
import { TransactionRowSkeleton } from '../components/Skeleton';
import { TransactionCategoryIcon } from '../components/TransactionCategoryIcon';
import { useToast } from '../components/Toast';
import {
  categoryOptions,
  paymentMethodOptions,
  type PaymentMethod,
  type TransactionRecord,
  type TransactionType,
} from '../data/mockData';
import { createTransaction, deleteTransaction, getTransactions, updateTransaction } from '../services/transactionApi';

type TypeFilter = 'All' | 'Income' | 'Expense';

type TransactionFormState = {
  type: TransactionType;
  amount: string;
  description: string;
  category: string;
  date: string;
  paymentMethod: PaymentMethod;
  note: string;
};

const defaultDate = new Date().toISOString().slice(0, 10);
const MAX_TRANSACTION_AMOUNT = 10000000;

const buildEmptyForm = (type: TransactionType = 'Expense'): TransactionFormState => ({
  type,
  amount: '',
  description: '',
  category: categoryOptions[0],
  date: defaultDate,
  paymentMethod: 'UPI',
  note: '',
});

export function Transactions() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [searchText, setSearchText] = useState('');
  const [typeFilter, setTypeFilter] = useState<TypeFilter>('All');
  const [categoryFilter, setCategoryFilter] = useState('All Categories');
  const [monthFilter, setMonthFilter] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [form, setForm] = useState<TransactionFormState>(buildEmptyForm());
  const [formErrors, setFormErrors] = useState<{ [key: string]: string }>({});
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const { showToast } = useToast();

  useEffect(() => {
    const requestedType = searchParams.get('type');

    if (requestedType === 'income' || requestedType === 'expense') {
      setForm(buildEmptyForm(requestedType === 'income' ? 'Income' : 'Expense'));
      setEditingId(null);
      setIsModalOpen(true);
      setSearchParams({});
    }
  }, [searchParams, setSearchParams]);

  const retryLoadTransactions = async () => {
    try {
      setIsLoading(true);
      setLoadError(false);
      const nextTransactions = await getTransactions();
      setTransactions(nextTransactions);
    } catch (error) {
      console.error('Failed to load transactions:', error);
      setLoadError(true);
      setTransactions([]);
      showToast('error', 'Unable to load transactions', "We couldn't connect to the FinSight server.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    void retryLoadTransactions();
  }, [showToast]);

  useEffect(() => {
    const isModalOpenState = isModalOpen || Boolean(deleteId);
    document.body.classList.toggle('modal-open', isModalOpenState);

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [deleteId, isModalOpen]);

  const totalIncome = useMemo(
    () => transactions.filter((item) => item.type === 'Income').reduce((sum, item) => sum + item.amount, 0),
    [transactions],
  );

  const totalExpenses = useMemo(
    () => transactions.filter((item) => item.type === 'Expense').reduce((sum, item) => sum + item.amount, 0),
    [transactions],
  );

  const netBalance = totalIncome - totalExpenses;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((item) => {
      const matchesSearch =
        item.title.toLowerCase().includes(searchText.toLowerCase()) ||
        item.category.toLowerCase().includes(searchText.toLowerCase()) ||
        item.paymentMethod.toLowerCase().includes(searchText.toLowerCase());

      const matchesType = typeFilter === 'All' || item.type === typeFilter;
      const matchesCategory = categoryFilter === 'All Categories' || item.category === categoryFilter;
      const matchesDate = !monthFilter || item.date === monthFilter;

      return matchesSearch && matchesType && matchesCategory && matchesDate;
    });
  }, [categoryFilter, monthFilter, searchText, transactions, typeFilter]);

  const handleOpenAddModal = (presetType: TransactionType = 'Expense') => {
    setEditingId(null);
    setForm(buildEmptyForm(presetType));
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (transaction: TransactionRecord) => {
    setEditingId(transaction.id);
    setForm({
      type: transaction.type,
      amount: String(transaction.amount),
      description: transaction.title,
      category: transaction.category,
      date: transaction.date,
      paymentMethod: transaction.paymentMethod,
      note: transaction.note ?? '',
    });
    setFormErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingId(null);
    setFormErrors({});
    setForm(buildEmptyForm());
  };

  const validateForm = () => {
    const nextErrors: { [key: string]: string } = {};

    if (!form.description.trim()) {
      nextErrors.description = 'Description is required.';
    }

    if (!form.amount || Number(form.amount) <= 0) {
      nextErrors.amount = 'Enter a valid amount greater than zero.';
    } else if (Number(form.amount) > MAX_TRANSACTION_AMOUNT) {
      nextErrors.amount = 'Amount cannot exceed ₹1,00,00,000.';
    }

    if (!form.date) {
      nextErrors.date = 'Please select a date.';
    }

    setFormErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleSaveTransaction = async () => {
    if (!validateForm()) return;

    const parsedAmount = Number(form.amount);
    const type: 'INCOME' | 'EXPENSE' = form.type === 'Income' ? 'INCOME' : 'EXPENSE';
    const payload = {
      description: form.description.trim(),
      amount: parsedAmount,
      type,
      category: form.category,
      transactionDate: form.date,
      paymentMethod: form.paymentMethod,
      note: form.note.trim() || undefined,
    };

    try {
      if (editingId) {
        const updatedTransaction = await updateTransaction(editingId, payload);
        setTransactions((current) => current.map((item) => (item.id === editingId ? updatedTransaction : item)));
        showToast('success', 'Transaction updated successfully');
      } else {
        const createdTransaction = await createTransaction(payload);
        setTransactions((current) => [createdTransaction, ...current]);
        showToast('success', 'Transaction added successfully');
      }

      handleCloseModal();
    } catch (error) {
      console.error('Failed to save transaction:', error);
      showToast('error', 'Unable to save transaction', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteId) return;

    try {
      await deleteTransaction(deleteId);
      setTransactions((current) => current.filter((item) => item.id !== deleteId));
      showToast('info', 'Transaction deleted');
      setDeleteId(null);
    } catch (error) {
      console.error('Failed to delete transaction:', error);
      showToast('error', 'Unable to delete transaction', error instanceof Error ? error.message : 'Please try again.');
    }
  };

  const clearFilters = () => {
    setSearchText('');
    setTypeFilter('All');
    setCategoryFilter('All Categories');
    setMonthFilter('');
  };

  return (
    <div className="transactions-page">
      <header className="transactions-header top-header">
        <div>
          <h1>Transactions</h1>
          <p>Track and manage your income and expenses.</p>
        </div>

        <div className="header-actions">
          <label className="search-box" aria-label="Search transactions">
            <Search size={18} />
            <input type="search" placeholder="Search" value={searchText} onChange={(event) => setSearchText(event.target.value)} />
          </label>

          <button type="button" className="icon-button" aria-label="Notifications">
            <Bell size={18} />
          </button>

          <div className="user-pill" aria-label="User profile">
            <div className="avatar">N</div>
            <span>Nikhil</span>
          </div>

          <button type="button" className="primary-button" onClick={() => handleOpenAddModal('Expense')}>
            <Plus size={16} />
            Add Transaction
          </button>
        </div>
      </header>

      <section className="transactions-summary-grid summary-grid">
        <SummaryCard label="Total Income" amount={loadError || isLoading ? '—' : `₹${totalIncome.toLocaleString()}`} change={loadError || isLoading ? 'Unavailable' : '+6.3%'} positive={!loadError && !isLoading} />
        <SummaryCard label="Total Expenses" amount={loadError || isLoading ? '—' : `₹${totalExpenses.toLocaleString()}`} change={loadError || isLoading ? 'Unavailable' : '-2.4%'} positive={false} />
        <SummaryCard label="Net Balance" amount={loadError || isLoading ? '—' : `₹${netBalance.toLocaleString()}`} change={loadError || isLoading ? 'Unavailable' : '+12%'} positive={!loadError && !isLoading} accent="primary" />
      </section>

      <section className="panel filter-panel">
        <div className="transaction-filters">
          <label className="filter-field search-filter-field">
            <span>Search</span>
            <div className="inline-search">
              <Search size={16} />
              <input
                type="text"
                value={searchText}
                onChange={(event) => setSearchText(event.target.value)}
                placeholder="Search transactions..."
              />
            </div>
          </label>

          <label className="filter-field">
            <span>Type</span>
            <CustomSelect
              options={[
                { label: 'All', value: 'All' },
                { label: 'Income', value: 'Income' },
                { label: 'Expense', value: 'Expense' },
              ]}
              value={typeFilter}
              onChange={(value) => setTypeFilter(value as TypeFilter)}
            />
          </label>

          <label className="filter-field">
            <span>Category</span>
            <CustomSelect
              options={[
                { label: 'All Categories', value: 'All Categories' },
                ...categoryOptions.map((category) => ({ label: category, value: category })),
              ]}
              value={categoryFilter}
              onChange={setCategoryFilter}
            />
          </label>

          <label className="filter-field">
            <span>Date</span>
            <DatePicker value={monthFilter} onChange={setMonthFilter} placeholder="Select date" />
          </label>

          <button type="button" className="secondary-button clear-filter-button" onClick={clearFilters}>
            Clear Filters
          </button>
        </div>
      </section>

      <section className="panel transactions-panel">
        <div className="table-wrap">
          <table className="transaction-table">
            <thead>
              <tr>
                <th>Transaction</th>
                <th>Category</th>
                <th>Date</th>
                <th>Payment Method</th>
                <th>Amount</th>
                <th>Type</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                Array.from({ length: 4 }, (_, index) => <TransactionRowSkeleton key={`transaction-skeleton-${index}`} />)
              ) : loadError ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title="Unable to load transactions"
                      description="We couldn't connect to the FinSight server."
                      actionLabel="Retry"
                      onAction={() => {
                        void retryLoadTransactions();
                      }}
                      icon={<Search size={22} />}
                    />
                  </td>
                </tr>
              ) : filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7}>
                    <EmptyState
                      title="No transactions found"
                      description="Try adjusting your search or filters."
                      actionLabel="Add Transaction"
                      onAction={() => handleOpenAddModal('Expense')}
                      icon={<Search size={22} />}
                    />
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction) => {
                  const isIncome = transaction.type === 'Income';

                  return (
                    <tr key={transaction.id}>
                      <td>
                        <div className="table-title-wrap">
                          <TransactionCategoryIcon category={transaction.category} type={transaction.type} size={16} />
                          <div>
                            <div className="table-title">{transaction.title}</div>
                            {transaction.note ? <small>{transaction.note}</small> : null}
                          </div>
                        </div>
                      </td>
                      <td>{transaction.category}</td>
                      <td>{new Date(`${transaction.date}T00:00:00`).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' })}</td>
                      <td>{transaction.paymentMethod}</td>
                      <td className={isIncome ? 'amount-income' : 'amount-expense'}>
                        {isIncome ? '+' : '-'}₹{transaction.amount.toLocaleString()}
                      </td>
                      <td>
                        <span className={`table-badge ${isIncome ? 'income' : 'expense'}`}>{transaction.type}</span>
                      </td>
                      <td>
                        <div className="action-group">
                          <button type="button" className="icon-action" aria-label="Edit transaction" onClick={() => handleOpenEditModal(transaction)}>
                            <Edit3 size={15} />
                          </button>
                          <button type="button" className="icon-action danger" aria-label="Delete transaction" onClick={() => setDeleteId(transaction.id)}>
                            <Trash2 size={15} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </section>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="transaction-modal" onClick={(event) => event.stopPropagation()}>
            <div className="modal-header">
              <h3>{editingId ? 'Edit Transaction' : 'Add Transaction'}</h3>
              <button type="button" className="icon-button modal-close" onClick={handleCloseModal} aria-label="Close form">
                <X size={18} />
              </button>
            </div>

            <div className="modal-form">
              <label className="field-group">
                <span>Transaction Type</span>
                <CustomSelect
                  options={[
                    { label: 'Expense', value: 'Expense' },
                    { label: 'Income', value: 'Income' },
                  ]}
                  value={form.type}
                  onChange={(value) => setForm((current) => ({ ...current, type: value as TransactionType }))}
                />
              </label>

              <label className="field-group">
                <span>Amount</span>
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={form.amount}
                  onChange={(event) => setForm((current) => ({ ...current, amount: event.target.value }))}
                  placeholder="0"
                />
                {formErrors.amount ? <small className="field-error">{formErrors.amount}</small> : null}
              </label>

              <label className="field-group">
                <span>Description</span>
                <input
                  type="text"
                  value={form.description}
                  onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                  placeholder="Grocery shopping"
                />
                {formErrors.description ? <small className="field-error">{formErrors.description}</small> : null}
              </label>

              <label className="field-group">
                <span>Category</span>
                <CustomSelect
                  options={categoryOptions.map((category) => ({ label: category, value: category }))}
                  value={form.category}
                  onChange={(value) => setForm((current) => ({ ...current, category: value }))}
                />
              </label>

              <label className="field-group">
                <span>Date</span>
                <input
                  type="date"
                  value={form.date}
                  onChange={(event) => setForm((current) => ({ ...current, date: event.target.value }))}
                />
                {formErrors.date ? <small className="field-error">{formErrors.date}</small> : null}
              </label>

              <label className="field-group">
                <span>Payment Method</span>
                <CustomSelect
                  options={paymentMethodOptions.map((method) => ({ label: method, value: method }))}
                  value={form.paymentMethod}
                  onChange={(value) => setForm((current) => ({ ...current, paymentMethod: value as PaymentMethod }))}
                />
              </label>

              <label className="field-group">
                <span>Optional Note</span>
                <textarea
                  rows={3}
                  value={form.note}
                  onChange={(event) => setForm((current) => ({ ...current, note: event.target.value }))}
                  placeholder="Optional note"
                />
              </label>
            </div>

            <div className="modal-actions">
              <button type="button" className="secondary-button" onClick={handleCloseModal}>
                Cancel
              </button>
              <button type="button" className="primary-button" onClick={handleSaveTransaction}>
                {editingId ? 'Save Changes' : 'Add Transaction'}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="modal-overlay" onClick={() => setDeleteId(null)}>
          <div className="confirm-modal" onClick={(event) => event.stopPropagation()}>
            <h3>Delete this transaction?</h3>
            <div className="modal-actions confirm-actions">
              <button type="button" className="secondary-button" onClick={() => setDeleteId(null)}>
                Cancel
              </button>
              <button type="button" className="primary-button danger-button" onClick={handleDeleteConfirmed}>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
