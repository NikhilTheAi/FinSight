export type SummaryCardData = {
  label: string;
  amount: string;
  change: string;
  positive: boolean;
  accent?: 'primary' | 'neutral';
};

export type MoneyFlowPoint = {
  month: string;
  income: number;
  expenses: number;
};

export type TransactionItem = {
  title: string;
  category: string;
  amount: number;
};

export type TransactionType = 'Income' | 'Expense';
export type PaymentMethod = 'UPI' | 'Cash' | 'Credit Card' | 'Debit Card' | 'Bank Transfer';

export type TransactionRecord = {
  id: string;
  title: string;
  type: TransactionType;
  category: string;
  date: string;
  paymentMethod: PaymentMethod;
  amount: number;
  note?: string;
};

export type GoalItem = {
  name: string;
  saved: number;
  target: number;
  accent: string;
};

export const summaryCards: SummaryCardData[] = [
  { label: 'Total Balance', amount: '₹84,250', change: '+12% from last month', positive: true, accent: 'primary' },
  { label: 'Income', amount: '₹52,000', change: '+6.3%', positive: true },
  { label: 'Expenses', amount: '₹21,400', change: '-2.4%', positive: false },
  { label: 'Total Savings', amount: '₹32,913', change: '+12%', positive: true },
];

export const moneyFlowData: MoneyFlowPoint[] = [
  { month: 'Jan', income: 42000, expenses: 18000 },
  { month: 'Feb', income: 39000, expenses: 22000 },
  { month: 'Mar', income: 47000, expenses: 24000 },
  { month: 'Apr', income: 46000, expenses: 26000 },
  { month: 'May', income: 52000, expenses: 21400 },
  { month: 'Jun', income: 48000, expenses: 23000 },
];

export const recentTransactions: TransactionItem[] = [
  { title: 'Amazon', category: 'Shopping', amount: -2450 },
  { title: 'Swiggy', category: 'Food & Dining', amount: -620 },
  { title: 'Uber', category: 'Transport', amount: -340 },
  { title: 'YouTube Premium', category: 'Entertainment', amount: -149 },
  { title: 'Salary', category: 'Income', amount: 52000 },
];

export const categoryOptions = [
  'Food & Dining',
  'Shopping',
  'Transport',
  'Entertainment',
  'Bills',
  'Salary',
  'Other',
];

export const paymentMethodOptions: PaymentMethod[] = [
  'UPI',
  'Cash',
  'Credit Card',
  'Debit Card',
  'Bank Transfer',
];

export const initialTransactions: TransactionRecord[] = [
  { id: 't-1', title: 'Amazon', type: 'Expense', category: 'Shopping', date: '2026-06-12', paymentMethod: 'Credit Card', amount: 2450 },
  { id: 't-2', title: 'Salary', type: 'Income', category: 'Salary', date: '2026-06-01', paymentMethod: 'Bank Transfer', amount: 52000 },
  { id: 't-3', title: 'Swiggy', type: 'Expense', category: 'Food & Dining', date: '2026-06-10', paymentMethod: 'UPI', amount: 620 },
  { id: 't-4', title: 'Uber', type: 'Expense', category: 'Transport', date: '2026-06-09', paymentMethod: 'UPI', amount: 340 },
  { id: 't-5', title: 'YouTube Premium', type: 'Expense', category: 'Entertainment', date: '2026-06-08', paymentMethod: 'Credit Card', amount: 149 },
  { id: 't-6', title: 'Electricity Bill', type: 'Expense', category: 'Bills', date: '2026-06-06', paymentMethod: 'UPI', amount: 1850 },
  { id: 't-7', title: 'Freelance Payment', type: 'Income', category: 'Other', date: '2026-06-04', paymentMethod: 'Bank Transfer', amount: 8000 },
];

export const savingsGoals: GoalItem[] = [
  { name: 'MacBook Pro', saved: 16500, target: 60000, accent: '#2F7D5B' },
  { name: 'New House', saved: 60000, target: 150000, accent: '#2F6F6F' },
  { name: 'New Car', saved: 45000, target: 90000, accent: '#D7835C' },
];

export const aiInsights = [
  'Your food spending is 18% lower this month.',
  'You could save approximately ₹4,500 next month.',
  'You\'re on track for your MacBook savings goal.',
];

export const quickActionLabels = ['Add Expense', 'Add Income', 'Set Budget', 'Create Goal'];
