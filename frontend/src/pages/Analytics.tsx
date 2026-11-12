import { useMemo, useState } from 'react';
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { Sidebar } from '../components/Sidebar';
import { SummaryCard } from '../components/SummaryCard';

const formatCurrencyValue = (value: number | string | readonly (number | string)[] | undefined) => {
  const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
  return `₹${Number.isFinite(numericValue) ? numericValue.toLocaleString() : '0'}`;
};

type PeriodKey = 'This Month' | 'Last 3 Months' | 'Last 6 Months' | 'This Year';

const analyticsData: Record<
  PeriodKey,
  {
    summary: {
      income: number;
      expenses: number;
      savingsRate: number;
      highestCategory: string;
    };
    comparison: Array<{ month: string; income: number; expenses: number }>;
    categories: Array<{ name: string; value: number; color: string }>;
    savingsTrend: Array<{ month: string; savings: number }>;
    breakdown: Array<{ name: string; amount: number; percent: number }>;
  }
> = {
  'This Month': {
    summary: { income: 48600, expenses: 22750, savingsRate: 46, highestCategory: 'Food & Dining' },
    comparison: [
      { month: 'Jan', income: 42000, expenses: 18000 },
      { month: 'Feb', income: 39000, expenses: 22000 },
      { month: 'Mar', income: 47000, expenses: 24000 },
      { month: 'Apr', income: 46000, expenses: 26000 },
      { month: 'May', income: 52000, expenses: 21400 },
      { month: 'Jun', income: 48600, expenses: 22750 },
    ],
    categories: [
      { name: 'Food & Dining', value: 7800, color: '#2F7D5B' },
      { name: 'Shopping', value: 5400, color: '#1D3F4F' },
      { name: 'Transport', value: 3200, color: '#8FAB8F' },
      { name: 'Entertainment', value: 2800, color: '#D79C52' },
      { name: 'Bills', value: 4100, color: '#D85C5C' },
      { name: 'Other', value: 1450, color: '#B7C9C1' },
    ],
    savingsTrend: [
      { month: 'Jan', savings: 24000 },
      { month: 'Feb', savings: 17000 },
      { month: 'Mar', savings: 23000 },
      { month: 'Apr', savings: 20000 },
      { month: 'May', savings: 30500 },
      { month: 'Jun', savings: 25850 },
    ],
    breakdown: [
      { name: 'Food & Dining', amount: 7800, percent: 34 },
      { name: 'Shopping', amount: 5400, percent: 24 },
      { name: 'Transport', amount: 3200, percent: 14 },
      { name: 'Entertainment', amount: 2800, percent: 12 },
      { name: 'Bills', amount: 4100, percent: 18 },
      { name: 'Other', amount: 1450, percent: 6 },
    ],
  },
  'Last 3 Months': {
    summary: { income: 142800, expenses: 66200, savingsRate: 54, highestCategory: 'Shopping' },
    comparison: [
      { month: 'Apr', income: 46000, expenses: 26000 },
      { month: 'May', income: 52000, expenses: 21400 },
      { month: 'Jun', income: 48600, expenses: 22750 },
    ],
    categories: [
      { name: 'Food & Dining', value: 6400, color: '#2F7D5B' },
      { name: 'Shopping', value: 8200, color: '#1D3F4F' },
      { name: 'Transport', value: 3600, color: '#8FAB8F' },
      { name: 'Entertainment', value: 2900, color: '#D79C52' },
      { name: 'Bills', value: 5100, color: '#D85C5C' },
      { name: 'Other', value: 1800, color: '#B7C9C1' },
    ],
    savingsTrend: [
      { month: 'Apr', savings: 20000 },
      { month: 'May', savings: 30500 },
      { month: 'Jun', savings: 25850 },
    ],
    breakdown: [
      { name: 'Shopping', amount: 8200, percent: 29 },
      { name: 'Food & Dining', amount: 6400, percent: 22 },
      { name: 'Bills', amount: 5100, percent: 18 },
      { name: 'Transport', amount: 3600, percent: 13 },
      { name: 'Entertainment', amount: 2900, percent: 10 },
      { name: 'Other', amount: 1800, percent: 8 },
    ],
  },
  'Last 6 Months': {
    summary: { income: 274500, expenses: 128600, savingsRate: 53, highestCategory: 'Food & Dining' },
    comparison: [
      { month: 'Jan', income: 42000, expenses: 18000 },
      { month: 'Feb', income: 39000, expenses: 22000 },
      { month: 'Mar', income: 47000, expenses: 24000 },
      { month: 'Apr', income: 46000, expenses: 26000 },
      { month: 'May', income: 52000, expenses: 21400 },
      { month: 'Jun', income: 48600, expenses: 22750 },
    ],
    categories: [
      { name: 'Food & Dining', value: 21600, color: '#2F7D5B' },
      { name: 'Shopping', value: 19000, color: '#1D3F4F' },
      { name: 'Transport', value: 14000, color: '#8FAB8F' },
      { name: 'Entertainment', value: 11500, color: '#D79C52' },
      { name: 'Bills', value: 18600, color: '#D85C5C' },
      { name: 'Other', value: 9200, color: '#B7C9C1' },
    ],
    savingsTrend: [
      { month: 'Jan', savings: 24000 },
      { month: 'Feb', savings: 17000 },
      { month: 'Mar', savings: 23000 },
      { month: 'Apr', savings: 20000 },
      { month: 'May', savings: 30500 },
      { month: 'Jun', savings: 25850 },
    ],
    breakdown: [
      { name: 'Food & Dining', amount: 21600, percent: 28 },
      { name: 'Shopping', amount: 19000, percent: 24 },
      { name: 'Bills', amount: 18600, percent: 23 },
      { name: 'Transport', amount: 14000, percent: 18 },
      { name: 'Entertainment', amount: 11500, percent: 15 },
      { name: 'Other', amount: 9200, percent: 12 },
    ],
  },
  'This Year': {
    summary: { income: 586200, expenses: 278600, savingsRate: 52, highestCategory: 'Bills' },
    comparison: [
      { month: 'Jan', income: 47200, expenses: 21000 },
      { month: 'Feb', income: 47000, expenses: 22200 },
      { month: 'Mar', income: 49500, expenses: 24200 },
      { month: 'Apr', income: 48600, expenses: 25800 },
      { month: 'May', income: 53200, expenses: 22400 },
      { month: 'Jun', income: 48600, expenses: 22750 },
    ],
    categories: [
      { name: 'Food & Dining', value: 32000, color: '#2F7D5B' },
      { name: 'Shopping', value: 29600, color: '#1D3F4F' },
      { name: 'Transport', value: 21800, color: '#8FAB8F' },
      { name: 'Entertainment', value: 16700, color: '#D79C52' },
      { name: 'Bills', value: 33400, color: '#D85C5C' },
      { name: 'Other', value: 14300, color: '#B7C9C1' },
    ],
    savingsTrend: [
      { month: 'Jan', savings: 26200 },
      { month: 'Feb', savings: 24800 },
      { month: 'Mar', savings: 25300 },
      { month: 'Apr', savings: 22800 },
      { month: 'May', savings: 30800 },
      { month: 'Jun', savings: 25850 },
    ],
    breakdown: [
      { name: 'Bills', amount: 33400, percent: 26 },
      { name: 'Food & Dining', amount: 32000, percent: 24 },
      { name: 'Shopping', amount: 29600, percent: 22 },
      { name: 'Transport', amount: 21800, percent: 17 },
      { name: 'Entertainment', amount: 16700, percent: 13 },
      { name: 'Other', amount: 14300, percent: 11 },
    ],
  },
};

const periodOptions: PeriodKey[] = ['This Month', 'Last 3 Months', 'Last 6 Months', 'This Year'];

export function Analytics() {
  const [period, setPeriod] = useState<PeriodKey>('This Month');

  const currentData = useMemo(() => analyticsData[period], [period]);

  return (
    <div className="app-shell">
      <Sidebar activeItem="Analytics" />

      <main className="main-panel">
        <header className="page-header top-header">
          <div>
            <h1>Financial Analytics</h1>
            <p>Understand where your money goes.</p>
          </div>

          <div className="header-actions">
            <div className="period-selector" aria-label="Select analytics period">
              {periodOptions.map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`period-button ${period === option ? 'active' : ''}`}
                  onClick={() => setPeriod(option)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </header>

        <section className="summary-grid analytics-summary-grid" aria-label="Analytics summary">
          <SummaryCard label="Average Monthly Income" amount={`₹${currentData.summary.income.toLocaleString()}`} change="+6.3%" positive={true} />
          <SummaryCard label="Average Monthly Expenses" amount={`₹${currentData.summary.expenses.toLocaleString()}`} change="-2.4%" positive={false} />
          <SummaryCard label="Savings Rate" amount={`${currentData.summary.savingsRate}%`} change="Strong" positive={true} accent="primary" />
          <SummaryCard label="Highest Spending Category" amount={currentData.summary.highestCategory} change="Current" positive={true} />
        </section>

        <section className="analytics-grid">
          <article className="panel analytics-card wide-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Performance</p>
                <h2>Income vs Expenses</h2>
              </div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={280}>
                <AreaChart data={currentData.comparison} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2F7D5B" stopOpacity={0.26} />
                      <stop offset="100%" stopColor="#2F7D5B" stopOpacity={0.02} />
                    </linearGradient>
                    <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#142B3A" stopOpacity={0.2} />
                      <stop offset="100%" stopColor="#142B3A" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E7E0D9" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                  <Tooltip formatter={formatCurrencyValue} />
                  <Area type="monotone" dataKey="income" stroke="#2F7D5B" fill="url(#incomeFill)" strokeWidth={3} />
                  <Area type="monotone" dataKey="expenses" stroke="#142B3A" fill="url(#expenseFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel analytics-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Breakdown</p>
                <h2>Spending by Category</h2>
              </div>
            </div>

            <div className="chart-wrap donut-chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <PieChart>
                  <Pie data={currentData.categories} dataKey="value" innerRadius={52} outerRadius={86} paddingAngle={3}>
                    {currentData.categories.map((entry) => (
                      <Cell key={entry.name} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip formatter={formatCurrencyValue} />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel analytics-card wide-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Trend</p>
                <h2>Monthly Savings Trend</h2>
              </div>
            </div>

            <div className="chart-wrap">
              <ResponsiveContainer width="100%" height={260}>
                <AreaChart data={currentData.savingsTrend} margin={{ top: 10, right: 10, left: -18, bottom: 0 }}>
                  <defs>
                    <linearGradient id="savingsFill" x1="0" x2="0" y1="0" y2="1">
                      <stop offset="0%" stopColor="#2F7D5B" stopOpacity={0.28} />
                      <stop offset="100%" stopColor="#2F7D5B" stopOpacity={0.02} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="#E7E0D9" strokeDasharray="4 4" vertical={false} />
                  <XAxis dataKey="month" tickLine={false} axisLine={false} />
                  <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                  <Tooltip formatter={formatCurrencyValue} />
                  <Area type="monotone" dataKey="savings" stroke="#2F7D5B" fill="url(#savingsFill)" strokeWidth={3} />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </article>

          <article className="panel analytics-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Category mix</p>
                <h2>Expense Breakdown</h2>
              </div>
            </div>

            <div className="breakdown-list">
              {currentData.breakdown.map((item) => (
                <div className="breakdown-item" key={item.name}>
                  <div className="breakdown-header">
                    <span>{item.name}</span>
                    <strong>₹{item.amount.toLocaleString()}</strong>
                  </div>
                  <div className="goal-bar small-bar">
                    <span style={{ width: `${item.percent}%`, background: '#2F7D5B' }} />
                  </div>
                  <small>{item.percent}% of expenses</small>
                </div>
              ))}
            </div>
          </article>
        </section>
      </main>
    </div>
  );
}
