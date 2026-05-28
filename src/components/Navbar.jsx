import React, { useState, useRef, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { LogOut, Activity } from 'lucide-react';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const profileRef = useRef(null);

  useEffect(() => {
    function handleClickOutside(event) {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  // Hide navbar on auth screens
  if (location.pathname === '/login' || location.pathname === '/signup') return null;

  return (
    <nav className="sticky top-6 z-50 mx-4 md:mx-auto max-w-5xl mb-12">
      <div className="glass-panel !overflow-visible px-4 py-3 sm:px-6 sm:py-4 flex items-center justify-between !rounded-full shadow-2xl shadow-indigo-900/20 border border-white/10 bg-charcoal-900/70 backdrop-blur-3xl before:absolute before:inset-0 before:rounded-full before:bg-gradient-to-r before:from-cyan-500/5 before:to-indigo-500/5 before:pointer-events-none">
        
        <Link to="/" className="flex items-center gap-3 group relative z-10">
          <div className="bg-gradient-to-br from-indigo-500 to-cyan-400 p-2.5 rounded-xl group-hover:scale-105 transition-transform shadow-[0_0_20px_rgba(99,102,241,0.5)] relative overflow-hidden">
            <div className="absolute inset-0 bg-white/30 -translate-x-[150%] skew-x-12 group-hover:translate-x-[150%] transition-transform duration-700"></div>
            <Activity size={22} className="text-white relative z-10" />
          </div>
          <span className="text-2xl font-black text-white tracking-tight hidden sm:block">
            SleepSense <span className="text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-indigo-400">AI</span>
          </span>
        </Link>

        {user ? (
          <div className="flex items-center gap-3 sm:gap-6 relative z-10">
            <div className="hidden md:flex items-center bg-charcoal-950/50 p-1 rounded-full border border-white/5">
              <Link 
                to="/dashboard" 
                className={`text-sm font-semibold transition-all duration-300 px-5 py-2.5 rounded-full ${location.pathname === '/dashboard' ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 shadow-inner border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Dashboard
              </Link>
              <Link 
                to="/checkin" 
                className={`text-sm font-semibold transition-all duration-300 px-5 py-2.5 rounded-full ${location.pathname === '/checkin' ? 'bg-gradient-to-r from-indigo-500/20 to-cyan-500/20 text-cyan-300 shadow-inner border border-white/5' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
              >
                Check-In
              </Link>
            </div>
            
            <div className="h-8 w-px bg-white/10 hidden md:block" />
            
            <div className="flex items-center gap-4 relative" ref={profileRef}>
              <div 
                className="flex items-center gap-3 cursor-pointer group"
                onClick={() => setIsProfileOpen(!isProfileOpen)}
              >
                <div className="hidden sm:block text-right">
                  <div className="text-sm font-bold text-white capitalize">{user.name}</div>
                  <div className="text-[10px] text-cyan-400 font-bold uppercase tracking-widest">Active User</div>
                </div>
                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 p-[2px] shadow-lg shadow-cyan-500/20 group-hover:scale-105 transition-transform">
                  <div className="w-full h-full bg-charcoal-900 rounded-full flex items-center justify-center text-white font-black text-lg">
                    {user.name?.charAt(0).toUpperCase() || 'U'}
                  </div>
                </div>
              </div>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 top-14 w-72 glass-panel p-6 border-white/10 bg-charcoal-900/95 backdrop-blur-3xl shadow-2xl shadow-indigo-900/50 rounded-3xl animate-in fade-in zoom-in-95 duration-200">
                  <div className="flex flex-col items-center text-center">
                    <div className="w-20 h-20 rounded-full bg-gradient-to-br from-cyan-400 to-indigo-500 p-1 mb-4 shadow-lg shadow-cyan-500/30">
                      <div className="w-full h-full bg-charcoal-950 rounded-full flex items-center justify-center text-white font-black text-3xl">
                        {user.name?.charAt(0).toUpperCase() || 'U'}
                      </div>
                    </div>
                    <h3 className="text-xl font-bold text-white capitalize mb-1">{user.name}</h3>
                    <p className="text-xs text-cyan-400 font-bold uppercase tracking-widest mb-6 px-3 py-1 bg-cyan-500/10 rounded-full">Standard Profile</p>
                    
                    <div className="w-full h-px bg-white/10 mb-6"></div>
                    
                    <div className="w-full text-left space-y-3 mb-6">
                       <div className="flex items-center gap-3 text-sm text-gray-300 bg-white/5 p-3 rounded-xl border border-white/5">
                         <Activity size={16} className="text-indigo-400" />
                         <span>Triple-Fusion Tracking: <span className="text-emerald-400 font-bold ml-1">Active</span></span>
                       </div>
                    </div>

                    <button 
                      onClick={handleLogout}
                      className="w-full glass-button flex items-center justify-center gap-2 text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 transition-colors border-rose-500/20 shadow-none !rounded-xl py-3 group"
                    >
                      <LogOut size={18} className="group-hover:-translate-x-1 transition-transform" />
                      <span className="font-bold">Secure Sign Out</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div className="flex gap-4 relative z-10">
            <Link to="/login" className="text-gray-300 hover:text-white text-sm font-bold flex items-center transition-colors px-4">Log In</Link>
            <Link to="/signup" className="glass-button text-sm !px-6 !py-2.5 !rounded-full bg-gradient-to-r from-indigo-500 to-cyan-500 hover:from-indigo-400 hover:to-cyan-400 shadow-[0_0_15px_rgba(56,189,248,0.4)] border-none">Start Now</Link>
          </div>
        )}

      </div>
    </nav>
  );
}
