import { useState } from 'react';
import { Save, ShieldCheck, Smartphone } from 'lucide-react';

import { CustomSelect } from '../components/CustomSelect';
import { Sidebar } from '../components/Sidebar';
import { useToast } from '../components/Toast';

const THEME_STORAGE_KEY = 'finsight-theme';

const getStoredThemePreference = () => {
  if (typeof window === 'undefined') {
    return 'system';
  }

  const storedTheme = window.localStorage.getItem(THEME_STORAGE_KEY);
  if (storedTheme === 'light' || storedTheme === 'dark' || storedTheme === 'system') {
    return storedTheme;
  }

  return 'system';
};

const toAppearanceLabel = (theme: string) => {
  if (theme === 'light') return 'Light';
  if (theme === 'dark') return 'Dark';
  return 'System';
};

export function Settings() {
  const [form, setForm] = useState({
    fullName: 'Nikhil Panwar',
    email: 'nikhil@finsight.app',
    phone: '+91 98765 43210',
    currency: 'INR ₹',
    appearance: toAppearanceLabel(getStoredThemePreference()),
    budgetAlerts: true,
    goalReminders: true,
    unusualSpendingAlerts: true,
    monthlyFinancialReport: false,
  });

  const [saved, setSaved] = useState(false);
  const { showToast } = useToast();

  const handleToggle = (key: keyof typeof form) => {
    if (key === 'fullName' || key === 'email' || key === 'phone' || key === 'currency' || key === 'appearance') return;

    setForm((current) => ({ ...current, [key]: !current[key] }));
  };

  const updateAppearance = (option: 'Light' | 'Dark' | 'System') => {
    const normalizedTheme = option.toLowerCase();
    const nextTheme = normalizedTheme === 'system' ? 'system' : normalizedTheme;

    window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);

    const resolvedTheme = nextTheme === 'system'
      ? window.matchMedia('(prefers-color-scheme: dark)').matches
        ? 'dark'
        : 'light'
      : nextTheme;

    document.documentElement.setAttribute('data-theme', resolvedTheme);
    setForm((current) => ({ ...current, appearance: option }));
  };

  return (
    <div className="app-shell">
      <Sidebar activeItem="Settings" />

      <main className="main-panel">
        <header className="page-header top-header">
          <div>
            <h1>Settings</h1>
            <p>Manage your FinSight preferences.</p>
          </div>
        </header>

        <section className="settings-layout">
          <article className="panel settings-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Profile</p>
                <h2>Profile</h2>
              </div>
            </div>

            <div className="form-grid">
              <label className="field-group">
                <span>Full Name</span>
                <input
                  type="text"
                  value={form.fullName}
                  onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
                />
              </label>

              <label className="field-group">
                <span>Email</span>
                <input
                  type="email"
                  value={form.email}
                  onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
                />
              </label>

              <label className="field-group full-span">
                <span>Phone</span>
                <input
                  type="tel"
                  value={form.phone}
                  onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
                />
              </label>
            </div>
          </article>

          <article className="panel settings-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Preferences</p>
                <h2>Currency</h2>
              </div>
            </div>

            <label className="field-group">
              <span>Preferred Currency</span>
              <CustomSelect
                options={[
                  { label: 'INR ₹', value: 'INR ₹' },
                  { label: 'USD $', value: 'USD $' },
                  { label: 'EUR €', value: 'EUR €' },
                  { label: 'GBP £', value: 'GBP £' },
                ]}
                value={form.currency}
                onChange={(value) => setForm((current) => ({ ...current, currency: value }))}
              />
            </label>
          </article>

          <article className="panel settings-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Alerts</p>
                <h2>Notifications</h2>
              </div>
            </div>

            <div className="toggle-list">
              {[
                ['Budget alerts', 'budgetAlerts'],
                ['Goal reminders', 'goalReminders'],
                ['Unusual spending alerts', 'unusualSpendingAlerts'],
                ['Monthly financial report', 'monthlyFinancialReport'],
              ].map(([label, key]) => (
                <label key={label} className="toggle-row">
                  <span>{label}</span>
                  <button
                    type="button"
                    className={`toggle-switch ${form[key as keyof typeof form] ? 'on' : ''}`}
                    aria-label={label}
                    onClick={() => handleToggle(key as keyof typeof form)}
                  >
                    <span />
                  </button>
                </label>
              ))}
            </div>
          </article>

          <article className="panel settings-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Theme</p>
                <h2>Appearance</h2>
              </div>
            </div>

            <div className="appearance-options">
              {['Light', 'Dark', 'System'].map((option) => (
                <button
                  key={option}
                  type="button"
                  className={`option-chip ${form.appearance === option ? 'selected' : ''}`}
                  onClick={() => updateAppearance(option as 'Light' | 'Dark' | 'System')}
                >
                  {option}
                </button>
              ))}
            </div>
          </article>

          <article className="panel settings-card">
            <div className="panel-header">
              <div>
                <p className="eyebrow">Security</p>
                <h2>Security</h2>
              </div>
            </div>

            <div className="security-actions">
              <button type="button" className="secondary-button action-button-inline">
                <ShieldCheck size={16} />
                Change Password
              </button>
              <button type="button" className="secondary-button action-button-inline">
                <Smartphone size={16} />
                Two-Factor Authentication
              </button>
            </div>
          </article>
        </section>

        <div className="settings-footer">
          <button
            type="button"
            className="primary-button"
            onClick={() => {
              setSaved(true);
              showToast('success', 'Settings saved');
            }}
          >
            <Save size={16} />
            Save Changes
          </button>
          {saved && <span className="saved-status">Changes saved</span>}
        </div>
      </main>
    </div>
  );
}
