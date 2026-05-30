import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import {
  LayoutDashboard, FileText, Lightbulb, User, LogOut, Brain, PlusCircle, HelpCircle
} from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard',        icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/checkin',          icon: PlusCircle,      label: 'Initiate Tracking' },
  { to: '/recommendations',  icon: Lightbulb,       label: 'Recommendations' },
  { to: '/history',          icon: FileText,        label: 'History' },
  { to: '/profile',          icon: User,            label: 'Profile' },
  { to: '/help',             icon: HelpCircle,      label: 'Help' },
];

export default function Sidebar({ isOpen, setIsOpen }) {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={`fixed left-0 top-0 h-screen flex flex-col z-50 transition-all duration-300 
        w-64 md:w-20 lg:w-64 
        ${isOpen ? "translate-x-0" : "-translate-x-full"} md:translate-x-0`}
      style={{
        background: 'var(--bg-sidebar)',
        backdropFilter: 'blur(24px) saturate(140%)',
        borderRight: '1px solid var(--border-color)',
      }}
    >
      {/* Logo */}
      <div className="flex flex-col items-center justify-center gap-2.5 px-3 py-6 text-center" style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.1)' }}>
        <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#7D6BDB,#22D3EE)', boxShadow: '0 4px 15px rgba(125,107,219,0.3)' }}>
          <Brain size={28} color="#fff" />
        </div>
        <div className="block md:hidden lg:block">
          <p className="text-white font-bold text-sm leading-tight tracking-wider uppercase">SleepSense</p>
          <p className="text-[10px] leading-none mt-0.5" style={{ color: '#EDE9FE', opacity: 0.75 }}>AI</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto py-6 px-4 space-y-4 no-scrollbar">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            onClick={() => setIsOpen && setIsOpen(false)}
            className={({ isActive }) =>
              `sidebar-nav-item ${isActive ? 'active' : ''}`
            }
          >
            <Icon size={28} strokeWidth={1.8} />
            <span className="block md:hidden lg:block text-[11px] leading-tight tracking-wide font-extrabold text-center mt-1">{label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Logout */}
      <div className="px-4 pb-6" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.1)', paddingTop: '16px' }}>
        <button
          onClick={handleLogout}
          className="sidebar-nav-item w-full !text-rose-400 hover:!bg-rose-500/10"
        >
          <LogOut size={28} strokeWidth={1.8} />
          <span className="block md:hidden lg:block text-[11px] leading-tight tracking-wide font-extrabold text-center mt-1">Logout</span>
        </button>
      </div>
    </aside>
  );
}
