import { useMemo } from 'react';
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import { AlertTriangle, ArrowUpRight, Lightbulb, PiggyBank, TrendingUp } from 'lucide-react';

import { Sidebar } from '../components/Sidebar';

const formatCurrencyValue = (value: number | string | readonly (number | string)[] | undefined) => {
  const numericValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
  return `₹${Number.isFinite(numericValue) ? numericValue.toLocaleString() : '0'}`;
};

const predictionData = [
  { month: 'Jan', amount: 22000 },
  { month: 'Feb', amount: 23400 },
  { month: 'Mar', amount: 22650 },
  { month: 'Apr', amount: 23880 },
  { month: 'May', amount: 23250 },
  { month: 'Jun', amount: 24800 },
];

const recommendations = [
  'Reduce Food & Dining spending by ₹1,200.',
  'Your Bills budget is close to its limit.',
  'You could save approximately ₹4,500 next month.',
  'Your MacBook Pro goal is currently on track.',
];

export function AIInsights() {
  const nextMonthPrediction = useMemo(() => predictionData[predictionData.length - 1].amount, []);
  const previousMonth = predictionData[predictionData.length - 2]?.amount ?? nextMonthPrediction;
  const change = ((nextMonthPrediction - previousMonth) / previousMonth) * 100;

  return (
    <div className="app-shell">
      <Sidebar activeItem="AI Insights" />

      <main className="main-panel">
        <header className="page-header top-header">
          <div>
            <h1>AI Financial Insights</h1>
            <p>Smart predictions and insights based on your spending.</p>
          </div>
        </header>

        <section className="insight-hero panel">
          <div className="insight-hero-copy">
            <p className="eyebrow">Forecast</p>
            <h2>Next Month Expense Prediction</h2>
            <div className="prediction-amount">₹{nextMonthPrediction.toLocaleString()}</div>
            <div className="prediction-change positive-change">
              <ArrowUpRight size={16} />
              {change.toFixed(1)}% compared with this month
            </div>
          </div>

          <div className="prediction-chart">
            <ResponsiveContainer width="100%" height={180}>
              <AreaChart data={predictionData} margin={{ top: 10, right: 10, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="aiFill" x1="0" x2="0" y1="0" y2="1">
                    <stop offset="0%" stopColor="#2F7D5B" stopOpacity={0.3} />
                    <stop offset="100%" stopColor="#2F7D5B" stopOpacity={0.05} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="#E7E0D9" strokeDasharray="4 4" vertical={false} />
                <XAxis dataKey="month" tickLine={false} axisLine={false} />
                <YAxis tickLine={false} axisLine={false} tickFormatter={(value) => `₹${Number(value) / 1000}k`} />
                <Tooltip formatter={formatCurrencyValue} />
                <Area type="monotone" dataKey="amount" stroke="#2F7D5B" fill="url(#aiFill)" strokeWidth={3} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </section>

        <section className="insight-card-grid">
          <article className="panel insight-card">
            <div className="insight-card-header">
              <div className="insight-icon-wrap green">
                <TrendingUp size={18} />
              </div>
              <h3>Spending Pattern</h3>
            </div>
            <p>Food spending increased by 18% this month.</p>
          </article>

          <article className="panel insight-card">
            <div className="insight-card-header">
              <div className="insight-icon-wrap amber">
                <AlertTriangle size={18} />
              </div>
              <h3>Anomaly Detection</h3>
            </div>
            <p>
              Unusual transaction detected: Amazon Shopping ₹3,499, higher than your typical shopping spend.
            </p>
          </article>

          <article className="panel insight-card wide-card-insight">
            <div className="insight-card-header">
              <div className="insight-icon-wrap navy">
                <Lightbulb size={18} />
              </div>
              <h3>Smart Recommendations</h3>
            </div>

            <ul className="recommendation-list">
              {recommendations.map((recommendation) => (
                <li key={recommendation}>
                  <PiggyBank size={14} />
                  <span>{recommendation}</span>
                </li>
              ))}
            </ul>
          </article>
        </section>
      </main>
    </div>
  );
}
