import { useEffect } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { ToastProvider } from './components/Toast';
import { AIInsights } from './pages/AIInsights';
import { Analytics } from './pages/Analytics';
import { Budgets } from './pages/Budgets';
import { Dashboard } from './pages/Dashboard';
import { Goals } from './pages/Goals';
import { Settings } from './pages/Settings';
import { Transactions } from './pages/Transactions';
import { Wallet } from './pages/Wallet';

const THEME_STORAGE_KEY = 'finsight-theme';

function getSystemTheme() {
  if (typeof window === 'undefined') {
    return 'light';
  }

  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme: string) {
  const resolvedTheme = theme === 'system' ? getSystemTheme() : theme;
  document.documentElement.setAttribute('data-theme', resolvedTheme);
}

function App() {
  useEffect(() => {
    const savedTheme = localStorage.getItem(THEME_STORAGE_KEY) ?? 'system';
    const validTheme = savedTheme === 'light' || savedTheme === 'dark' || savedTheme === 'system' ? savedTheme : 'system';

    localStorage.setItem(THEME_STORAGE_KEY, validTheme);
    applyTheme(validTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

    const handleSystemThemeChange = () => {
      const currentTheme = localStorage.getItem(THEME_STORAGE_KEY) ?? 'system';
      if (currentTheme === 'system') {
        applyTheme('system');
      }
    };

    if (typeof mediaQuery.addEventListener === 'function') {
      mediaQuery.addEventListener('change', handleSystemThemeChange);
      return () => mediaQuery.removeEventListener('change', handleSystemThemeChange);
    }

    mediaQuery.addListener(handleSystemThemeChange);
    return () => mediaQuery.removeListener(handleSystemThemeChange);
  }, []);

  return (
    <ToastProvider>
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
    </ToastProvider>
  );
}

export default App;
