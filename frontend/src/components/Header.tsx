import { Bell, Plus, Search } from 'lucide-react';

export function Header() {
  return (
    <header className="top-header">
      <div>
        <h1>Welcome back, Nikhil 👋</h1>
        <p>Track, manage and grow your money smartly.</p>
      </div>

      <div className="header-actions">
        <label className="search-box" aria-label="Search">
          <Search size={18} />
          <input type="search" placeholder="Search" />
        </label>

        <button type="button" className="icon-button" aria-label="Notifications">
          <Bell size={18} />
        </button>

        <div className="user-pill" aria-label="User profile">
          <div className="avatar">N</div>
          <span>Nikhil</span>
        </div>

        <button type="button" className="primary-button">
          <Plus size={16} />
          Add Transaction
        </button>
      </div>
    </header>
  );
}
