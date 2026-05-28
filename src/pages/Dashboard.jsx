import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Moon, Smile, Heart, ShieldAlert, CheckCircle,
  AlertTriangle, PlusCircle, Activity, Mic, Calendar,
  ArrowRight, Sparkles
} from 'lucide-react';
import MetricCard from '../components/ui/MetricCard';
import FitbitConnectButton from '../components/FitbitConnectButton';

import slideSleep from '../assets/slide_sleep_custom.jpg';
import slidePeace from '../assets/slide_peace_custom.jpg';
import slideBuddha from '../assets/slide_buddha.jpg';

/* ── Carousel Data ── */
const SLIDES = [
  { image: slideSleep },
  { image: slidePeace },
  { image: slideBuddha }
];

const fadeUp = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

export default function Dashboard() {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();
  const [history, setHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isFitbitConnected, setIsFitbitConnected] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);

  // New states for Fitbit data fetching by date
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedFitbitData, setSelectedFitbitData] = useState(null);
  const [isLoadingFitbitData, setIsLoadingFitbitData] = useState(false);

  const slideTimer = React.useRef(null);
  useEffect(() => {
    if (slideTimer.current) clearInterval(slideTimer.current);
    slideTimer.current = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % SLIDES.length);
    }, 5000);
    return () => {
      if (slideTimer.current) clearInterval(slideTimer.current);
    };
  }, []);

  useEffect(() => {
    const checkFitbitStatus = async () => {
      try {
        const response = await fetch('/api/auth/fitbit/status', {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        if (response.ok) {
          const data = await response.json();
          setIsFitbitConnected(data.connected);
        }
      } catch (err) { console.error('Error checking Fitbit status:', err); }
    };
    if (token && token !== 'null' && token !== 'undefined') checkFitbitStatus();
  }, [token]);

  useEffect(() => {
    if (!token || token === 'null' || token === 'undefined') return;
    fetch('/api/history', { headers: { Authorization: `Bearer ${token}` } })
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

  useEffect(() => {
    if (!isFitbitConnected || !token || token === 'null' || token === 'undefined') return;
    const fetchFitbitData = async () => {
      setIsLoadingFitbitData(true);
      try {
        const response = await fetch(`/api/fitbit/sleep/${selectedDate}`, {
          headers: { 'Authorization': `Bearer ${token}` }
        });
        if (response.status === 401) {
          logout();
          navigate('/login');
          return;
        }
        if (response.ok) {
          const data = await response.json();
          setSelectedFitbitData(data);
        } else {
          setSelectedFitbitData(null);
        }
      } catch (err) {
        setSelectedFitbitData(null);
      } finally {
        setIsLoadingFitbitData(false);
      }
    };
    fetchFitbitData();
  }, [selectedDate, isFitbitConnected, token]);

  const totalCheckins = history.length;
  const avg = (field) => totalCheckins
    ? Math.round(history.reduce((a, c) => a + (c[field] || 0), 0) / totalCheckins * 100)
    : 0; // Default to 0 when no data

  const sleepScore = avg('physical_score');
  const emoteScore = avg('mental_score');
  const wellbeScore = avg('overall_score');

  // Dynamic sparkline data from the last 7 entries
  const recentHistory = [...history]
    .sort((a, b) => new Date(a.created_at) - new Date(b.created_at))
    .slice(-7);

  const getSparkData = (field) => {
    if (recentHistory.length === 0) return [0, 0, 0, 0, 0, 0, 0];
    const data = recentHistory.map(item => Math.round((item[field] || 0) * 100));
    // Pad start with 0s to make it exactly 7 items
    while (data.length < 7) {
      data.unshift(0);
    }
    return data;
  };

  const sleepSpark = getSparkData('physical_score');
  const emoteSpark = getSparkData('mental_score');
  const wellbeSpark = getSparkData('overall_score');

  const getScoreTag = (score) => {
    if (score === 0) return "No Data";
    if (score >= 70) return "Risky";
    if (score >= 40) return "Moderate";
    return "Stable";
  };

  const today = new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

  const getStatusIcon = (status) => {
    if (!status) return <Activity size={16} className="text-gray-400" />;
    if (status.includes('CRITICAL')) return <ShieldAlert size={16} className="text-[#F85149]" />;
    if (status.includes('MODERATE')) return <AlertTriangle size={16} className="text-[#D29922]" />;
    return <CheckCircle size={16} className="text-[#3FB950]" />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      {/* ── Carousel Section ── */}
      <motion.div {...fadeUp} className="relative h-[400px] rounded-3xl overflow-hidden shadow-2xl bg-[#0B0E14] border border-white/5 group">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8 }}
            className="absolute inset-0"
          >
            <div className="absolute inset-0 bg-gradient-to-t from-[#0B0E14] via-transparent to-transparent z-10 opacity-30" />
            <img
              src={SLIDES[currentSlide].image}
              alt="Dashboard Slide"
              className="w-full h-full object-cover"
            />
          </motion.div>
        </AnimatePresence>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex gap-2">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => setCurrentSlide(i)}
              className={`h-1.5 rounded-full transition-all duration-300 ${i === currentSlide ? 'w-8 bg-[#7D6BDB]' : 'w-2 bg-white/20'}`}
            />
          ))}
        </div>
      </motion.div>

      {/* ── Header ── */}
      <motion.div {...fadeUp} transition={{ duration: 0.4 }} className="flex items-center justify-between">
        <div>
          <h1 className="text-5xl font-black text-[var(--text-main)] tracking-tight">
            Hello, {user?.name || 'User'}! <span className="text-4xl animate-bounce inline-block ml-1">👋</span>
          </h1>
          <p className="text-[var(--text-muted)] text-lg font-bold mt-1.5">Ready for your daily wellness check-in?</p>
        </div>
        <div className="flex items-center gap-4">
          {/* Date Picker — highlighted */}
          <div className="ss-card !p-3 flex items-center gap-3 !rounded-xl border-2 border-[#7D6BDB]/50 shadow-[0_0_15px_rgba(125,107,219,0.25)]"
            style={{ minWidth: '200px' }}>
            <div className="w-9 h-9 rounded-lg bg-[#7D6BDB]/20 flex items-center justify-center flex-shrink-0">
              <Calendar size={18} className="text-[#7D6BDB]" />
            </div>
            <input
              type="date"
              value={selectedDate}
              max={new Date().toISOString().split('T')[0]}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="bg-transparent border-none text-white text-sm font-semibold focus:outline-none cursor-pointer focus:ring-0 outline-none w-full"
              style={{ colorScheme: 'dark' }}
            />
          </div>
          {/* Fitbit Button */}
          <div className="min-w-[180px]">
            <FitbitConnectButton
              isConnected={isFitbitConnected}
              onDisconnect={() => setIsFitbitConnected(false)}
            />
          </div>
        </div>
      </motion.div>

      {/* ── HERO ACTION SECTION ── */}
      <motion.div
        {...fadeUp}
        className="ss-card relative bg-gradient-to-r from-royal-purple to-purple-dark border-none overflow-hidden group cursor-pointer"
        onClick={() => navigate('/checkin')}
      >
        <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-white/20 transition-all duration-700" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-[#58A6FF]/20 rounded-full blur-3xl -ml-20 -mb-20" />
 
        <div className="relative z-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-6">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md flex items-center justify-center shadow-inner">
              <Sparkles size={32} className="text-white animate-pulse" />
            </div>
            <div>
              <h2 className="text-3xl font-black text-white leading-tight">Start Your Daily Check-In</h2>
              <p className="text-white/80 text-sm mt-1 max-w-sm">Track your mood and sleep to unlock personalized insights for a better tomorrow.</p>
            </div>
          </div>
          <button className="bg-white text-royal-purple font-black px-10 py-4.5 rounded-2xl flex items-center gap-2 shadow-2xl hover:scale-105 active:scale-95 transition-all group-hover:shadow-white/20 text-base">
            Get Started Now
            <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </motion.div>

      {error && (
        <div className="p-3 ss-card !border-red-500/20 flex items-center gap-2 text-[#F85149] text-sm">
          <ShieldAlert size={16} />{error}
        </div>
      )}

      {/* ── Fitbit Daily Summary ── */}
      {isFitbitConnected && (
        <motion.div {...fadeUp} className="ss-card bg-gradient-to-r from-[#0B0E14] to-[#161B22] border-[#7D6BDB]/30 relative overflow-hidden">
          <div className="absolute top-0 right-0 w-32 h-32 bg-[#7D6BDB]/10 rounded-full blur-2xl -mr-10 -mt-10" />
          <div className="flex items-center justify-between mb-4 relative z-10">
            <div className="flex items-center gap-2">
              <Activity size={18} className="text-[#7D6BDB]" />
              <h3 className="font-bold text-white text-lg">Fitbit Data for {selectedDate}</h3>
            </div>
          </div>
          {isLoadingFitbitData ? (
            <div className="animate-pulse flex space-x-4">
              <div className="h-16 w-full bg-white/5 rounded-xl"></div>
            </div>
          ) : selectedFitbitData ? (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 relative z-10">
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-xs text-[#8B949E] mb-1">Total Sleep</p>
                <p className="text-xl font-bold text-white">{Math.round((selectedFitbitData.total_minutes_asleep || 0) / 60 * 10) / 10} <span className="text-sm font-normal text-[#8B949E]">hrs</span></p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-xs text-[#8B949E] mb-1">Efficiency</p>
                <p className="text-xl font-bold text-[#3FB950]">{selectedFitbitData.sleep_efficiency || 0}<span className="text-sm font-normal text-[#8B949E]">%</span></p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-xs text-[#8B949E] mb-1">Deep Sleep</p>
                <p className="text-xl font-bold text-[#7D6BDB]">{Math.round((selectedFitbitData.sleep_stages?.deep || 0) / 60 * 10) / 10} <span className="text-sm font-normal text-[#8B949E]">hrs</span></p>
              </div>
              <div className="bg-white/5 p-3 rounded-xl border border-white/10 hover:bg-white/10 transition-colors">
                <p className="text-xs text-[#8B949E] mb-1">REM Sleep</p>
                <p className="text-xl font-bold text-[#2DD4BF]">{Math.round((selectedFitbitData.sleep_stages?.rem || 0) / 60 * 10) / 10} <span className="text-sm font-normal text-[#8B949E]">hrs</span></p>
              </div>
            </div>
          ) : (
            <div className="text-sm text-[#8B949E] py-4 relative z-10 flex items-center gap-2">
              <AlertTriangle size={14} /> No Fitbit data available for this date.
            </div>
          )}
        </motion.div>
      )}

      {/* ── Metric Cards ── */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <MetricCard icon={<Moon size={15} />} label="Sleep Risk"
          score={sleepScore} tag={getScoreTag(sleepScore)}
          description="Based on last 7 nights"
          sparkData={sleepSpark} accentColor="#7D6BDB" />
        <MetricCard icon={<Smile size={15} />} label="Emotional Stress"
          score={emoteScore} tag={getScoreTag(emoteScore)}
          description="Voice & text sentiment avg"
          sparkData={emoteSpark} accentColor="#22D3EE" />
        <MetricCard icon={<Heart size={15} />} label="Overall Risk"
          score={wellbeScore} tag={getScoreTag(wellbeScore)}
          description="Overall composite risk score"
          sparkData={wellbeSpark} accentColor="#10B981" />
      </div>

      {/* ── Recent Activity + Tip ── */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="ss-card">
          <div className="flex items-center justify-between mb-4">
            <p className="text-2xl font-black text-[var(--text-main)]">Recent Activity</p>
            <Link to="/history" className="text-xs text-[#57358F] hover:text-[#7D6BDB] hover:underline uppercase tracking-widest font-black transition-colors duration-200">View All</Link>
          </div>
          {isLoading ? (
            <div className="space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-12 rounded-xl animate-pulse bg-white/5" />
              ))}
            </div>
          ) : history.length === 0 ? (
            <div className="flex flex-col items-center py-8 text-center">
              <Activity size={28} className="text-[#8B949E] mb-3" />
              <p className="text-sm text-[#8B949E]">No activity yet.</p>
            </div>
          ) : (
            <div className="space-y-2">
              {history.slice(0, 4).map(r => (
                <div key={r.id}
                  onClick={() => navigate('/report', { state: { reportData: r } })}
                  className="flex items-center gap-3 p-3 rounded-xl cursor-pointer hover:bg-white/[0.05] transition-all border border-white/5">
                  <div className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#7D6BDB]/10">
                    <Mic size={14} color="#7D6BDB" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-white font-medium truncate">
                      {getStatusIcon(r.status)} {r.status}
                    </p>
                    <p className="text-[10px] text-[#8B949E]">
                      {new Date(r.created_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </p>
                  </div>
                  <span className="text-xs font-bold text-white">
                    {Math.round(r.overall_score * 100)}%
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="ss-card relative overflow-hidden bg-gradient-to-br from-[#7D6BDB]/20 to-[#22D3EE]/10 border-[#7D6BDB]/30">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0 bg-[#7D6BDB]/30 shadow-lg shadow-[#7D6BDB]/20">
              <Moon size={24} color="#7D6BDB" />
            </div>
            <div>
              <p className="text-2xl font-black text-[var(--text-main)] mb-2">Tip of the Day</p>
              <p className="text-base text-[var(--text-muted)] leading-relaxed">
                Consistency is key! Going to bed and waking up at the same time daily strengthens your circadian rhythm and improves mental resilience.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
