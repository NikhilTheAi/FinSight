import { Bell, ChevronDown, LogOut, Plus, Search, Settings as SettingsIcon, UserRound } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();
  const menuRef = useRef<HTMLDivElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleMenuAction = (path: string) => {
    setIsOpen(false);
    navigate(path);
  };

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

        <div className="profile-menu-wrap" ref={menuRef}>
          <button
            type="button"
            className="user-pill user-trigger"
            aria-label="Open user profile menu"
            aria-expanded={isOpen}
            onClick={() => setIsOpen((open) => !open)}
          >
            <div className="avatar">N</div>
            <span>Nikhil</span>
            <ChevronDown size={16} className={`profile-chevron ${isOpen ? 'open' : ''}`} />
          </button>

          {isOpen && (
            <div className="profile-dropdown" role="menu" aria-label="Profile menu">
              <div className="profile-dropdown-header">
                <div className="avatar avatar-large">N</div>
                <div>
                  <strong>Nikhil Panwar</strong>
                  <span>Personal Account</span>
                </div>
              </div>

              <div className="profile-dropdown-divider" />

              <button type="button" className="profile-dropdown-item" onClick={() => handleMenuAction('/settings')}>
                <UserRound size={16} />
                <span>Profile</span>
              </button>

              <button type="button" className="profile-dropdown-item" onClick={() => handleMenuAction('/settings')}>
                <SettingsIcon size={16} />
                <span>Settings</span>
              </button>

              <div className="profile-dropdown-divider" />

              <button type="button" className="profile-dropdown-item danger" onClick={() => setIsOpen(false)}>
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </div>
          )}
        </div>

        <button type="button" className="primary-button">
          <Plus size={16} />
          Add Transaction
        </button>
      </div>
    </header>
  );
}
