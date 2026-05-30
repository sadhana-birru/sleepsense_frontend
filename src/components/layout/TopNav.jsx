import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useTheme } from '../../hooks/useTheme';
import { PlusCircle, Sun, Moon, Menu } from 'lucide-react';

const PAGE_TITLES = {
  '/dashboard':       'Dashboard',
  '/sleep':           'Sleep Analysis',
  '/voice-analysis':  'Voice Analysis',
  '/checkin':         'Input Analysis',
  '/history':         'History',
  '/insights':        'Insights',
  '/recommendations': 'Recommendations',
  '/profile':         'Profile',
  '/settings':        'Settings',
};

export default function TopNav({ onMenuClick }) {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const location = useLocation();
  const title = PAGE_TITLES[location.pathname] || 'Dashboard';

  const initials = (user?.name || 'U')
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <header
      className="sticky top-0 z-30 flex items-center justify-between px-6 py-4 transition-all duration-300"
      style={{
        background: 'var(--bg-topnav)',
        backdropFilter: 'blur(20px) saturate(140%)',
        borderBottom: '1px solid var(--border-color)',
        borderLeft: '1px solid var(--border-color)',
      }}
    >
      {/* Page title and mobile menu */}
      <div className="flex items-center gap-3">
        <button 
          onClick={onMenuClick}
          className="md:hidden w-10 h-10 flex items-center justify-center rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors border border-white/10"
        >
          <Menu size={20} />
        </button>
        <h2 className="text-3xl md:text-5xl font-black tracking-tighter text-[var(--text-main)] uppercase">{title}</h2>
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-4">
        {/* New Check-In — only on Dashboard */}
        {location.pathname === '/dashboard' && (
          <Link to="/checkin"
            className="btn-glow-pulse flex items-center gap-2 text-sm px-5 py-2.5 rounded-xl font-bold">
            <PlusCircle size={16} /> New Check-In
          </Link>
        )}
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="w-10 h-10 rounded-xl flex items-center justify-center border border-[var(--border-color)] bg-white/10 hover:bg-white/20 transition-all duration-300 text-[var(--text-main)] shadow-inner"
          title={theme === 'light' ? 'Switch to Dark Mode' : 'Switch to Light Mode'}
        >
          {theme === 'light' ? (
            <Moon size={18} className="text-[#57358F]" />
          ) : (
            <Sun size={18} className="text-[#22D3EE] animate-pulse" />
          )}
        </button>
        {/* Avatar */}
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center text-xs font-bold text-white cursor-pointer ml-1"
          style={{
            background: 'linear-gradient(135deg, #7D6BDB, #22D3EE)',
            boxShadow: '0 4px 12px rgba(87,53,143,0.2)',
          }}
        >
          {initials}
        </div>
      </div>
    </header>
  );
}
