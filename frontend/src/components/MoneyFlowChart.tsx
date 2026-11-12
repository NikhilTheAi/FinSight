import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';

import { moneyFlowData } from '../data/mockData';

export function MoneyFlowChart() {
  return (
    <div className="panel chart-panel">
      <div className="panel-header">
        <div>
          <p className="eyebrow">Overview</p>
          <h2>Money Flow</h2>
        </div>
        <span className="panel-tag">Income vs Expenses</span>
      </div>

      <div className="chart-wrap">
        <ResponsiveContainer width="100%" height={280}>
          <AreaChart data={moneyFlowData} margin={{ top: 10, right: 0, left: -20, bottom: 0 }}>
            <defs>
              <linearGradient id="incomeFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#2F7D5B" stopOpacity={0.18} />
                <stop offset="95%" stopColor="#2F7D5B" stopOpacity={0.04} />
              </linearGradient>
              <linearGradient id="expenseFill" x1="0" x2="0" y1="0" y2="1">
                <stop offset="5%" stopColor="#142B3A" stopOpacity={0.12} />
                <stop offset="95%" stopColor="#142B3A" stopOpacity={0.03} />
              </linearGradient>
            </defs>
            <CartesianGrid vertical={false} stroke="#dfe5eb" strokeDasharray="4 4" />
            <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{ fill: '#516070', fontSize: 12 }} />
            <YAxis
              axisLine={false}
              tickLine={false}
              tickFormatter={(value) => `₹${Math.round(value / 1000)}k`}
              tick={{ fill: '#516070', fontSize: 12 }}
            />
            <Tooltip
              formatter={(value) => {
                const safeValue = Array.isArray(value) ? Number(value[0] ?? 0) : Number(value ?? 0);
                return [`₹${safeValue.toLocaleString()}`, ''];
              }}
              contentStyle={{
                borderRadius: 14,
                border: '1px solid #e6dfd8',
                background: '#fffdf9',
                boxShadow: '0 10px 30px rgba(11, 27, 43, 0.08)',
              }}
            />
            <Area type="monotone" dataKey="income" stroke="#2F7D5B" strokeWidth={3} fill="url(#incomeFill)" />
            <Area type="monotone" dataKey="expenses" stroke="#142B3A" strokeWidth={3} fill="url(#expenseFill)" />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
