import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import { 
  User, Mail, Shield, MapPin, Settings, LogOut,
  Moon, Activity, Heart, Smile
} from 'lucide-react';
import {

  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

/* ── Utils ── */
const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ss-card p-3 text-xs min-w-[120px]">
      <p className="text-[#8B949E] mb-2 font-medium">{label}</p>
      {payload.map(p => (
        <p key={p.dataKey} className="flex items-center justify-between gap-4">
          <span style={{ color: p.color }}>{p.dataKey}</span>
          <span className="text-white font-semibold">{p.value}</span>
        </p>
      ))}
    </div>
  );
}

export default function Profile() {
  const { user, token, logout } = useAuth();
  const [history, setHistory] = React.useState([]);
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    if (!token || token === 'null' || token === 'undefined') return;
    fetch(`${API_BASE}/api/history`, { 
      headers: { Authorization: `Bearer ${token}` } 
    })
      .then(r => r.ok ? r.json() : [])
      .then(d => {
        setHistory(d);
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [token]);

  // Generate dynamic chart data for the last 7 days
  const today = new Date();
  const weeklyPerformance = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(today);
    d.setDate(today.getDate() - i);
    const dateStr = d.toISOString().split('T')[0];
    
    // Find reports for this day (take average if multiple)
    const reportsOnDay = history.filter(r => 
      new Date(r.created_at).toISOString().split('T')[0] === dateStr
    );
    
    if (reportsOnDay.length > 0) {
      const avg = (field) => Math.round(reportsOnDay.reduce((a,c) => a + (c[field] || 0), 0) / reportsOnDay.length * 100);
      weeklyPerformance.push({
        day: days[d.getDay()],
        Sleep: avg('physical_score'),
        Emotion: avg('mental_score'),
        Overall: avg('overall_score')
      });
    } else {
      weeklyPerformance.push({
        day: days[d.getDay()],
        Sleep: 0,
        Emotion: 0,
        Overall: 0
      });
    }
  }

  const totalReports = history.length;
  const avgSleep = totalReports ? Math.round(history.reduce((a, c) => a + (c.physical_score || 0), 0) / totalReports * 100) : 0;
  const avgMental = totalReports ? Math.round(history.reduce((a, c) => a + (c.mental_score || 0), 0) / totalReports * 100) : 0;
  const avgOverall = totalReports ? Math.round(history.reduce((a, c) => a + (c.overall_score || 0), 0) / totalReports * 100) : 0;

  const getOverallStatus = (score) => {
    if (score === 0) return "No Data";
    if (score >= 70) return "CRITICAL RISK";
    if (score >= 40) return "MODERATE RISK";
    return "STABLE";
  };

  const quickSummary = [
    { label: 'Avg Sleep Risk', value: `${avgSleep}%` },
    { label: 'Avg Emotional Stress', value: `${avgMental}%` },
    { label: 'Overall Risk Status', value: getOverallStatus(avgOverall) },
    { label: 'Total Assessments', value: totalReports.toString() },
  ];

  return (
    <div className="max-w-6xl mx-auto py-6 space-y-6">
      <motion.div {...fadeUp} className="ss-card overflow-hidden border border-white/10 shadow-xl">
        {/* Banner */}
        <div className="h-24 bg-gradient-to-r from-[#7D6BDB] to-[#22D3EE] opacity-10" />
        
        <div className="px-8 pb-6">
          <div className="relative -mt-12 flex flex-col md:flex-row items-center gap-6">
            {/* Avatar */}
            <div className="w-24 h-24 rounded-3xl bg-gradient-to-br from-[#7D6BDB] to-[#57358F] border-4 border-[var(--bg-main)] flex items-center justify-center text-3xl font-bold text-white shadow-2xl">
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            
            <div className="flex-1 text-center md:text-left pt-14 md:pt-10">
              <div className="flex items-center justify-center md:justify-start gap-3">
                <h1 className="text-2xl font-bold text-white">{user?.name || 'User Name'}</h1>
                <span className="bg-[#7D6BDB]/20 text-[#7D6BDB] text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider">Premium</span>
              </div>
              <div className="flex flex-wrap justify-center md:justify-start gap-4 text-xs text-[#8B949E] mt-1">
                <span className="flex items-center gap-1.5"><Mail size={13}/> {user?.email || 'Email not found'}</span>
                <span className="flex items-center gap-1.5"><MapPin size={13}/> India (IST)</span>
              </div>
            </div>

            <div className="flex gap-3 pt-4 md:pt-10">
              <button onClick={logout} className="bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 border border-rose-500/20 px-5 py-2 rounded-xl text-xs font-semibold transition-all">
                Logout
              </button>
            </div>
          </div>
        </div>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] items-start gap-6">
        {/* Weekly Overview */}
        <motion.div {...fadeUp} transition={{ delay: 0.1 }} className="ss-card !p-4 border border-white/10 shadow-xl">
          <div className="flex items-center justify-between mb-4 px-2">
            <div>
              <p className="font-semibold text-white">Weekly Performance</p>
              <p className="text-[10px] text-[#8B949E] mt-0.5">Physical & mental metric analysis</p>
            </div>
            <div className="flex items-center gap-3 text-[9px] font-bold uppercase tracking-wider text-[#8B949E]">
              {[['Sleep','#7D6BDB'],['Emotion','#22D3EE'],['Overall','#10B981']].map(([l,c])=>(
                <span key={l} className="flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full" style={{background:c}}/>
                  {l}
                </span>
              ))}
            </div>
          </div>
          <ResponsiveContainer width="100%" height={220}>
            <LineChart data={weeklyPerformance} margin={{ top:4, right:0, left:-28, bottom:0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)"/>
              <XAxis dataKey="day" tick={{ fill:'#8B949E', fontSize:11 }} axisLine={false} tickLine={false}/>
              <YAxis domain={[0,100]} tick={{ fill:'#8B949E', fontSize:11 }} axisLine={false} tickLine={false}/>
              <Tooltip content={<CustomTooltip/>}/>
              <Line type="monotone" dataKey="Sleep"    stroke="#7D6BDB" strokeWidth={2.5} dot={{ r:3, fill:'#7D6BDB' }} activeDot={{ r:5 }}/>
              <Line type="monotone" dataKey="Emotion"  stroke="#22D3EE" strokeWidth={2.5} dot={{ r:3, fill:'#22D3EE' }} activeDot={{ r:5 }}/>
              <Line type="monotone" dataKey="Overall" stroke="#10B981" strokeWidth={2.5} dot={{ r:3, fill:'#10B981' }} activeDot={{ r:5 }}/>
            </LineChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Quick Summary Sidebar */}
        <motion.div {...fadeUp} transition={{ delay: 0.2 }} className="space-y-6">
          <div className="ss-card">
            <p className="font-semibold text-white mb-5 flex items-center gap-2">
              <Activity size={18} className="text-[#7D6BDB]"/> Historical Averages
            </p>
            <div className="space-y-4">
              {quickSummary.map(({ label, value }) => (
                <div key={label} className="flex flex-col gap-1 py-1 border-b border-white/5 last:border-0 pb-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#8B949E]">{label}</span>
                  <span className="text-white font-bold">{value}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="ss-card bg-gradient-to-br from-[#7D6BDB]/10 to-transparent">
            <h3 className="text-white font-semibold mb-3 flex items-center gap-2">
              <Shield size={18} className="text-[#10B981]"/> Security Status
            </h3>
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8B949E]">Account Verified</span>
                <span className="text-[#10B981] font-bold">YES</span>
              </div>
              <div className="flex justify-between items-center text-xs">
                <span className="text-[#8B949E]">App Version</span>
                <span className="text-white">v2.4.0</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
