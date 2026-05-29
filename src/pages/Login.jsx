import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { AlertCircle, Brain } from 'lucide-react';
import { motion } from 'framer-motion';
import bannerImg from '../assets/auth_banner.jpg';
import GoogleLoginButton from '../components/GoogleLoginButton';

const API_BASE = import.meta.env.VITE_BACKEND_URL;



function HeroLeft() {
  return (
    <div className="relative w-full h-full flex flex-col items-center justify-center overflow-hidden bg-[#0B0E14]">
      <img 
        src={bannerImg} 
        alt="SleepSense AI" 
        className="w-full h-full object-cover opacity-80"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent opacity-40" />
    </div>
  );
}

export default function Login() {
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [error, setError]         = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { login }  = useAuth();
  const navigate   = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setError(null); setIsLoading(true);
    try {
      const res = await fetch(`${API_BASE}/api/login`, {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) { const d = await res.json().catch(()=>({})); throw new Error(d.detail||'Login failed'); }
      const data = await res.json();
      login(data.access_token, data.name, data.email);
      navigate('/dashboard');
    } catch (err) { setError(err.message); }
    finally { setIsLoading(false); }
  };

  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#0B0E14' }}>
      {/* Left hero */}
      <div className="hidden lg:flex lg:w-[48%] flex-shrink-0"><HeroLeft /></div>

      {/* Right form */}
      <div className="flex-1 flex items-center justify-center p-8 overflow-y-auto relative" style={{ background: 'linear-gradient(135deg, #ADE1F7 0%, #E9D5FF 100%)' }}>
        {/* Soft background glow blobs */}
        <div className="absolute top-[10%] left-[10%] w-[60%] h-[60%] rounded-full bg-[#7D6BDB]/15 blur-[80px] pointer-events-none" />
        <div className="absolute bottom-[10%] right-[10%] w-[50%] h-[50%] rounded-full bg-[#22D3EE]/15 blur-[80px] pointer-events-none" />

        <motion.div className="w-full max-w-sm ss-card relative z-10"
          initial={{ opacity:0, y:20 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.45 }}>

          {/* Brand */}
          <div className="text-center mb-7">
            <div className="inline-flex items-center gap-3 mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: 'linear-gradient(135deg,#7D6BDB,#57358F)' }}>
                <Brain size={24} color="#fff"/>
              </div>
              <span className="text-2xl font-bold tracking-tight text-slate-800 dark:text-slate-100">SleepSense AI</span>
            </div>
            <h2 className="text-2xl font-bold mb-1 text-slate-800 dark:text-slate-100">Welcome!</h2>
            <p className="text-sm leading-relaxed text-slate-500 dark:text-slate-400">
              Track your sleep, voice, emotions<br/>and daily well-being in one place.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div className="mb-4 p-3 rounded-xl flex items-start gap-2 text-sm"
              style={{ background:'rgba(239,68,68,0.08)', border:'1px solid rgba(239,68,68,0.2)', color:'#EF4444' }}>
              <AlertCircle size={15} className="flex-shrink-0 mt-0.5"/>{error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-300">Email Address</label>
              <input type="email" required value={email} onChange={e=>setEmail(e.target.value)}
                className="login-input-light" placeholder="you@example.com" id="login-email"/>
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1.5 text-slate-600 dark:text-slate-300">Password</label>
              <input type="password" required value={password} onChange={e=>setPassword(e.target.value)}
                className="login-input-light" placeholder="••••••••" id="login-password"/>
            </div>
            <button type="submit" id="login-submit-btn" disabled={isLoading}
              className="w-full py-3 rounded-xl font-semibold text-white text-sm transition-all duration-200 disabled:opacity-60"
              style={{ background:'linear-gradient(135deg,#7D6BDB,#57358F)', boxShadow:'0 4px 20px rgba(87,53,143,0.4)' }}>
              {isLoading
                ? <span className="flex items-center justify-center gap-2">
                    <svg className="animate-spin w-4 h-4" viewBox="0 0 24 24" fill="none">
                      <circle cx="12" cy="12" r="10" stroke="white" strokeWidth="3" strokeOpacity="0.3"/>
                      <path d="M12 2 a10 10 0 0 1 10 10" stroke="white" strokeWidth="3" strokeLinecap="round"/>
                    </svg>Signing in…
                  </span>
                : 'Get Started'}
            </button>
          </form>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-slate-200 dark:border-slate-700"></span>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[var(--bg-card)] px-2 text-slate-500 dark:text-slate-400">Or continue with</span>
            </div>
          </div>

          <GoogleLoginButton onError={setError} />

          <p className="text-center mt-5 text-xs text-slate-400 dark:text-slate-500">
            Don't have an account?{' '}
            <Link to="/signup" className="font-semibold text-[#57358F] dark:text-[#7D6BDB] hover:underline">Sign Up</Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
