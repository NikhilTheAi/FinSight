import {
  ArrowLeftRight,
  BarChart3,
  CircleHelp,
  LayoutGrid,
  PiggyBank,
  Settings,
  Sparkles,
  Target,
  Wallet,
} from 'lucide-react';
import { useLocation, useNavigate } from 'react-router-dom';

const navItems = [
  { label: 'Dashboard', icon: LayoutGrid, route: '/' },
  { label: 'Transactions', icon: ArrowLeftRight, route: '/transactions' },
  { label: 'Wallet', icon: Wallet, route: '/wallet' },
  { label: 'Budgets', icon: PiggyBank, route: '/budgets' },
  { label: 'Goals', icon: Target, route: '/goals' },
  { label: 'Analytics', icon: BarChart3, route: '/analytics' },
  { label: 'AI Insights', icon: Sparkles, route: '/ai-insights' },
];

const secondaryItems = [
  { label: 'Settings', icon: Settings, route: '/settings' },
  { label: 'Help & Support', icon: CircleHelp, route: null },
];

type SidebarProps = {
  activeItem?: string;
};

export function Sidebar({ activeItem = 'Dashboard' }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleNavigate = (route: string | null) => {
    if (!route) return;
    navigate(route);
  };

  return (
    <aside className="sidebar">
      <div className="brand-block">
        <div className="brand-mark">F</div>
        <div>
          <div className="brand-name">FinSight</div>
          <div className="brand-subtitle">Smart finance</div>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Main navigation">
        {navItems.map(({ label, icon: Icon, route }) => {
          const isActive = label === activeItem || (route !== null && location.pathname === route);

          return (
            <button
              key={label}
              type="button"
              className={`nav-item ${isActive ? 'active' : ''}`}
              onClick={() => handleNavigate(route)}
            >
              <Icon size={18} />
              <span>{label}</span>
            </button>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        {secondaryItems.map(({ label, icon: Icon, route }) => (
          <button
            key={label}
            type="button"
            className="nav-item secondary"
            onClick={() => handleNavigate(route)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </aside>
  );
}
