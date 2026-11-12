import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AIInsights } from './pages/AIInsights';
import { Analytics } from './pages/Analytics';
import { Budgets } from './pages/Budgets';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { Transactions } from './pages/Transactions';
import { Wallet } from './pages/Wallet';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/budgets" element={<Budgets />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/ai-insights" element={<AIInsights />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
