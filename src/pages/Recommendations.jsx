import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { motion } from 'framer-motion';
import {

  Moon, Smartphone, Coffee, Brain, Droplets, Headphones,
  BedDouble, MonitorOff, Timer, Footprints, Wind,
  ShieldAlert, MessageCircle, Ban, Utensils, Heart,
  CheckCircle, AlertTriangle, Flame, ChevronRight, Sparkles
} from 'lucide-react';

const API_BASE = import.meta.env.VITE_BACKEND_URL;

/* ── Recommendation tiers based on overall score ── */
const TIERS = {
  good: {
    range: '0–40%',
    label: 'Good Health',
    emoji: '😌',
    statusIcon: CheckCircle,
    statusColor: '#10B981',
    gradient: 'from-[#10B981]/15 to-[#059669]/5',
    borderColor: '#10B981',
    goal: 'Maintain consistency (not improve drastically)',
    aiMessage: 'You are in a healthy state. Maintain your current routine to prevent future stress.',
    recommendations: [
      { icon: BedDouble, color: '#7D6BDB', title: 'Maintain a consistent sleep schedule (7–8 hours)', desc: 'Go to bed and wake up at the same time every day for best results.' },
      { icon: Footprints, color: '#10B981', title: 'Continue regular physical activity (30–60 mins/day)', desc: 'Moderate exercise keeps your body and mind in sync.' },
      { icon: Smartphone, color: '#22D3EE', title: 'Limit screen time before bed', desc: 'Blue light disrupts melatonin production. Switch off 1 hour before sleep.' },
      { icon: Droplets, color: '#BFDBFE', title: 'Stay hydrated (2–3 liters/day)', desc: 'Proper hydration supports cognitive function and mood stability.' },
      { icon: Headphones, color: '#F59E0B', title: 'Practice light relaxation (meditation / music)', desc: 'Even 10 minutes of calm music or meditation can reduce stress hormones.' },
    ]
  },
  moderate: {
    range: '41–70%',
    label: 'Moderate Risk',
    emoji: '⚠️',
    statusIcon: AlertTriangle,
    statusColor: '#F59E0B',
    gradient: 'from-[#F59E0B]/15 to-[#D97706]/5',
    borderColor: '#F59E0B',
    goal: 'Reduce stress before it becomes serious',
    aiMessage: 'Your stress level is moderate. Small lifestyle adjustments can significantly improve your well-being.',
    recommendations: [
      { icon: Moon, color: '#7D6BDB', title: 'Improve sleep timing (sleep before 11 PM)', desc: 'Aligning with your circadian rhythm improves deep sleep quality.' },
      { icon: MonitorOff, color: '#22D3EE', title: 'Reduce screen exposure at night', desc: 'Especially 1 hour before sleep — try reading or journaling instead.' },
      { icon: Timer, color: '#F59E0B', title: 'Take short breaks during work/study', desc: 'Use the Pomodoro method: 25 min focus + 5 min break for sustained productivity.' },
      { icon: Footprints, color: '#10B981', title: 'Add light exercise or walking (20–30 mins/day)', desc: 'A simple walk can significantly reduce cortisol levels.' },
      { icon: Coffee, color: '#EF4444', title: 'Reduce caffeine intake', desc: 'Limit coffee to mornings only. Caffeine has a 6-hour half-life.' },
      { icon: Wind, color: '#BFDBFE', title: 'Practice breathing exercises (5–10 mins daily)', desc: 'Box breathing (4-4-4-4) activates your parasympathetic nervous system.' },
    ]
  },
  critical: {
    range: '71–100%',
    label: 'Critical Risk',
    emoji: '🚨',
    statusIcon: Flame,
    statusColor: '#EF4444',
    gradient: 'from-[#EF4444]/15 to-[#DC2626]/5',
    borderColor: '#EF4444',
    goal: 'Immediate recovery + stress reduction',
    aiMessage: 'Your stress level is high. Immediate attention to sleep and mental health is strongly recommended.',
    recommendations: [
      { icon: BedDouble, color: '#7D6BDB', title: 'Ensure minimum 7 hours sleep daily', desc: 'Sleep deprivation compounds stress exponentially. Prioritize rest.' },
      { icon: Ban, color: '#EF4444', title: 'Avoid late-night work and screen usage', desc: 'Your brain needs wind-down time. Set a strict digital curfew.' },
      { icon: ShieldAlert, color: '#F59E0B', title: 'Reduce workload and take rest breaks', desc: 'Burnout is real. Delegate tasks and protect your recovery time.' },
      { icon: Brain, color: '#E9D5FF', title: 'Practice deep breathing / meditation (10–15 mins)', desc: 'Guided meditation apps can help. Consistency matters more than duration.' },
      { icon: Utensils, color: '#10B981', title: 'Avoid excessive caffeine and junk food', desc: 'Processed food and stimulants worsen anxiety and disrupt sleep cycles.' },
      { icon: MessageCircle, color: '#22D3EE', title: 'Talk to a friend/family member or seek support', desc: 'Social connection is one of the strongest buffers against stress.' },
      { icon: Heart, color: '#EF4444', title: 'If persistent, consider professional help', desc: 'A counselor or therapist can provide personalized coping strategies.' },
    ]
  }
};

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp  = { initial: { opacity: 0, y: 16 }, animate: { opacity: 1, y: 0 } };

/* Meditation SVG illustration */
function MeditationIllustration() {
  return (
    <svg width="120" height="120" viewBox="0 0 120 120" fill="none" className="flex-shrink-0">
      {/* Body */}
      <ellipse cx="60" cy="85" rx="28" ry="14" fill="rgba(255,255,255,0.15)"/>
      {/* Legs cross */}
      <path d="M35 80 Q50 90 60 78 Q70 90 85 80" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none"/>
      {/* Torso */}
      <rect x="50" y="55" width="20" height="24" rx="10" fill="white" opacity="0.9"/>
      {/* Head */}
      <circle cx="60" cy="48" r="12" fill="#F8B4A0"/>
      {/* Hair */}
      <path d="M48 44 Q54 32 68 36 Q74 44 70 48 Q62 40 52 44Z" fill="#5B21B6"/>
      {/* Arms */}
      <path d="M50 65 Q38 72 36 78" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
      <path d="M70 65 Q82 72 84 78" stroke="white" strokeWidth="3" strokeLinecap="round" fill="none" opacity="0.9"/>
      {/* Leaves */}
      <ellipse cx="25" cy="95" rx="10" ry="5" fill="#10B981" opacity="0.6" transform="rotate(-20,25,95)"/>
      <ellipse cx="95" cy="95" rx="10" ry="5" fill="#10B981" opacity="0.6" transform="rotate(20,95,95)"/>
      {/* Sparkles */}
      <circle cx="20" cy="40" r="2" fill="#E9D5FF" opacity="0.7"/>
      <circle cx="100" cy="35" r="2" fill="#EDE9FE" opacity="0.6"/>
      <circle cx="15"  cy="65" r="1.5" fill="#EDE9FE" opacity="0.5"/>
    </svg>
  );
}

export default function Recommendations() {
  const { token } = useAuth();
  const [overallScore, setOverallScore] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!token || token === 'null' || token === 'undefined') return;
    fetch(`${API_BASE}/api/history`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.ok ? r.json() : [])
      .then(data => {
        if (data.length > 0) {
          const avg = data.reduce((a, c) => a + (c.overall_score || 0), 0) / data.length;
          setOverallScore(Math.round(avg * 100));
        } else {
          setOverallScore(0);
        }
        setIsLoading(false);
      })
      .catch(() => setIsLoading(false));
  }, [token]);

  // Determine tier
  const getTier = (score) => {
    if (score >= 71) return TIERS.critical;
    if (score >= 41) return TIERS.moderate;
    return TIERS.good;
  };

  if (isLoading) {
    return (
      <div className="max-w-2xl mx-auto flex items-center justify-center h-[60vh]">
        <div className="text-center space-y-3">
          <div className="w-10 h-10 border-2 border-[#57358F] border-t-transparent rounded-full animate-spin mx-auto"/>
          <p className="text-[#8B949E] text-sm">Analyzing your wellness data...</p>
        </div>
      </div>
    );
  }

  const tier = getTier(overallScore || 0);
  const StatusIcon = tier.statusIcon;

  return (
    <div className="max-w-4xl mx-auto">
      {/* ── Hero Banner ── */}
      <motion.div {...fadeUp} transition={{ duration: 0.4 }}
        className="hero-banner mb-8 flex items-center justify-between gap-6 overflow-hidden !p-10">
        <div className="flex-1">
          <p className="text-sm font-extrabold text-purple-200 uppercase tracking-wider mb-3">
            Personalized For You
          </p>
          <h1 className="text-3xl font-black text-white mb-2 leading-tight">
            Small changes today,
          </h1>
          <p className="text-purple-100 text-lg font-bold">better mental health tomorrow.</p>
        </div>
        <MeditationIllustration/>
        <div className="absolute -right-8 -bottom-8 w-40 h-40 rounded-full pointer-events-none"
          style={{ background: 'rgba(194,65,12,0.25)', filter: 'blur(32px)' }}/>
      </motion.div>

      {/* ── Status Banner ── */}
      <motion.div {...fadeUp} transition={{ delay: 0.1 }}
        className={`ss-card mb-8 bg-gradient-to-r ${tier.gradient} border`}
        style={{ borderColor: `${tier.borderColor}30` }}>
        <div className="flex items-start gap-5">
          <div className="w-14 h-14 rounded-2xl flex items-center justify-center flex-shrink-0"
            style={{ background: `${tier.statusColor}20`, border: `1px solid ${tier.statusColor}40` }}>
            <StatusIcon size={26} color={tier.statusColor}/>
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-3 mb-2">
              <span className="text-2xl">{tier.emoji}</span>
              <h2 className="text-xl font-black text-white">{tier.label}</h2>
              <span className="text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider"
                style={{ background: `${tier.statusColor}20`, color: tier.statusColor }}>
                {tier.range}
              </span>
            </div>
            <p className="text-sm text-[#786C5F] mb-2">
              <span className="font-bold text-[var(--text-main)]">Your Overall Risk Score:</span> {overallScore}%
            </p>
            <p className="text-sm text-[#786C5F]">
              <span className="font-bold text-[var(--text-main)]">🎯 Goal:</span> {tier.goal}
            </p>
          </div>
        </div>
      </motion.div>

      {/* ── AI Message ── */}
      <motion.div {...fadeUp} transition={{ delay: 0.15 }}
        className="ss-card mb-8 flex items-start gap-4"
        style={{ borderLeft: `4px solid ${tier.statusColor}` }}>
        <div className="w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0 bg-[#57358F]/20">
          <Sparkles size={20} className="text-[#57358F]"/>
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] mb-1.5">🧠 Smart AI Message</p>
          <p className="text-base text-[var(--text-main)] font-semibold italic">"{tier.aiMessage}"</p>
        </div>
      </motion.div>

      {/* ── Recommendation Cards ── */}
      <motion.div variants={stagger} initial="initial" animate="animate" className="space-y-4">
        <p className="text-xs font-black uppercase tracking-widest text-[var(--text-muted)] px-1 mb-2">
          💡 Recommendations
        </p>
        {tier.recommendations.map(({ icon: Icon, color, title, desc }) => (
          <motion.div key={title} variants={fadeUp} transition={{ duration: 0.32 }}
            whileHover={{ y: -4, scale: 1.02 }}
            className="ss-card flex items-center gap-5 cursor-pointer"
            style={{ padding: '28px 32px' }}>
            <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0"
              style={{ background: `${color}18`, border: `1px solid ${color}30` }}>
              <Icon size={22} color={color}/>
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-base font-bold text-[var(--text-main)]">{title}</p>
              <p className="text-sm text-[var(--text-muted)] font-semibold mt-1">{desc}</p>
            </div>
            <ChevronRight size={22} color="var(--text-muted)" className="flex-shrink-0"/>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
