import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { 

  Activity, Clock, Calendar, ChevronRight, 
  Search, Filter, ShieldAlert, CheckCircle, AlertTriangle
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_API_BASE_URL;

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function History() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!token || token === 'null' || token === 'undefined') return;
    fetch(`${API_BASE}/api/history`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(r => { 
        if (r.status === 401) {
          logout();
          navigate('/login');
          throw new Error('Session expired');
        }
        if (!r.ok) throw new Error('Failed to load history'); 
        return r.json(); 
      })
      .then(d => setHistory(d))
      .catch(e => setError(e.message))
      .finally(() => setIsLoading(false));
  }, [token]);

  const getStatusIcon = (status) => {
    if (!status) return <Activity size={16} className="text-gray-400"/>;
    if (status.includes('CRITICAL')) return <ShieldAlert size={16} className="text-[#F85149]"/>;
    if (status.includes('MODERATE')) return <AlertTriangle size={16} className="text-[#D29922]"/>;
    return <CheckCircle size={16} className="text-[#3FB950]"/>;
  };

  return (
    <div className="max-w-4xl mx-auto">
      <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="mb-8">
        <h1 className="text-4xl font-black text-[var(--text-main)] mb-3">Assessment History</h1>
        <p className="text-[var(--text-muted)] text-lg font-bold">View and manage your past emotional stability reports.</p>
      </motion.div>

      {error && (
        <div className="mb-6 p-4 ss-card !border-red-500/20 flex items-center gap-3 text-[#F85149]">
          <ShieldAlert size={20}/>
          <p className="text-sm">{error}</p>
        </div>
      )}

      <div className="ss-card !p-0 overflow-hidden">
        <div className="p-6 border-b border-[var(--border-color)] flex items-center justify-between bg-white/[0.02]">
          <div className="relative flex-1 max-w-sm">
            <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--text-muted)]"/>
            <input 
              type="text" 
              placeholder="Search reports..." 
              className="w-full bg-[var(--bg-card-alt)] border border-[var(--border-color)] rounded-xl py-3 pl-11 pr-5 text-base text-[var(--text-main)] focus:outline-none focus:ring-2 focus:ring-[#57358F]/30 transition-all font-semibold"
            />
          </div>
          <button className="flex items-center gap-2.5 text-base text-[var(--text-muted)] hover:text-[var(--text-main)] transition-colors font-bold">
            <Filter size={18}/> Filter
          </button>
        </div>

        <div className="divide-y divide-white/5">
          {isLoading ? (
            [1, 2, 3, 4, 5].map(i => (
              <div key={i} className="p-6 animate-pulse flex items-center gap-4">
                <div className="w-10 h-10 rounded-xl bg-white/5"/>
                <div className="flex-1 space-y-2">
                  <div className="h-4 w-1/4 bg-white/5 rounded"/>
                  <div className="h-3 w-1/6 bg-white/5 rounded"/>
                </div>
              </div>
            ))
          ) : history.length === 0 ? (
            <div className="p-12 text-center">
              <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center mx-auto mb-4">
                <Calendar size={24} className="text-[#8B949E]"/>
              </div>
              <h3 className="text-white font-semibold mb-1">No reports found</h3>
              <p className="text-[#8B949E] text-sm mb-6">You haven't completed any assessments yet.</p>
              <button 
                onClick={() => navigate('/checkin')}
                className="btn-primary px-6 py-2 rounded-xl text-sm"
              >
                Start First Assessment
              </button>
            </div>
          ) : (
            history.map((r) => (
              <div 
                key={r.id}
                onClick={() => navigate('/report', { state: { reportData: r } })}
                className="group p-6 flex items-center gap-5 hover:bg-white/[0.03] transition-all cursor-pointer border-b border-[var(--border-color)] last:border-b-0"
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
                  style={{ background: 'rgba(87,53,143,0.1)' }}>
                  {getStatusIcon(r.status)}
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-1.5">
                    <span className="text-lg font-bold text-[var(--text-main)] group-hover:text-[#57358F] transition-colors">
                      {r.status}
                    </span>
                    <span className="text-xs px-2 py-0.5 rounded-full bg-white/5 text-[var(--text-muted)] font-bold">
                      ID: #{r.id.toString().slice(-4)}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-[var(--text-muted)] font-semibold">
                    <span className="flex items-center gap-1.5">
                      <Calendar size={14}/>
                      {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={14}/>
                      {new Date(r.created_at).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-5">
                  <div className="text-right">
                    <p className="text-lg font-black text-[var(--text-main)]">{Math.round(r.overall_score * 100)}%</p>
                    <p className="text-xs text-[var(--text-muted)] font-bold">Overall Score</p>
                  </div>
                  <ChevronRight size={22} className="text-[var(--text-muted)] group-hover:text-[var(--text-main)] transition-colors"/>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
