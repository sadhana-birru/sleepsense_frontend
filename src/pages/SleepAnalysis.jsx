import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, BedDouble, BarChart2 } from 'lucide-react';
import DonutChart from '../components/ui/DonutChart';
import ProgressBar from '../components/ui/ProgressBar';
import {
  ResponsiveContainer, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Cell,
} from 'recharts';

const TABS = ['Overview', 'Sleep Stages', 'Sleep Trends'];

const NIGHTLY = [
  { night: 'Mon', hours: 6.5 },
  { night: 'Tue', hours: 5.8 },
  { night: 'Wed', hours: 7.2 },
  { night: 'Thu', hours: 6.9 },
  { night: 'Fri', hours: 7.5 },
  { night: 'Sat', hours: 8.1 },
  { night: 'Sun', hours: 7.1 },
];

const STAGES = [
  { label: 'Deep Sleep',   value: '2h 35m', pct: '32%', color: '#7D6BDB' },
  { label: 'Light Sleep',  value: '3h 45m', pct: '48%', color: '#22D3EE' },
  { label: 'REM Sleep',    value: '1h 10m', pct: '15%', color: '#2DD4BF' },
  { label: 'Awake',        value: '20m',    pct: '5%',  color: '#F59E0B' },
];

const FACTORS = [
  { label: 'Sleep Duration',    value: 82, status: 'Good'     },
  { label: 'Sleep Efficiency',  value: 79, status: 'Good'     },
  { label: 'Awake Interruptions', value: 55, status: 'Moderate' },
  { label: 'Consistency',       value: 80, status: 'Good'     },
];

const stagger = { animate: { transition: { staggerChildren: 0.07 } } };
const fadeUp  = { initial: { opacity:0, y:14 }, animate: { opacity:1, y:0 } };

function SleepBarTooltip({ active, payload }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="ss-card p-2.5 text-xs">
      <p className="text-white font-semibold">{payload[0].value}h</p>
    </div>
  );
}

export default function SleepAnalysis() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <div className="max-w-5xl mx-auto">
      {/* ── Header + tabs ── */}
      <motion.div {...fadeUp} transition={{ duration:0.35 }} className="mb-6">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center"
            style={{ background:'rgba(125,107,219,0.2)' }}>
            <Moon size={17} color="#7D6BDB"/>
          </div>
          <h1 className="text-xl font-bold text-white">Sleep Analysis</h1>
        </div>
        {/* Tabs */}
        <div className="flex gap-1 p-1 rounded-xl w-fit"
          style={{ background:'rgba(15,23,42,0.05)', border:'1px solid rgba(15,23,42,0.08)' }}>
          {TABS.map((tab, i) => (
            <button key={tab} onClick={() => setActiveTab(i)}
              className="px-4 py-1.5 rounded-lg text-sm font-medium transition-all duration-200"
              style={activeTab===i
                ? { background:'#57358F', color:'#fff', boxShadow:'0 0 12px rgba(87,53,143,0.4)' }
                : { color:'#64748B' }}>
              {tab}
            </button>
          ))}
        </div>
      </motion.div>

      {/* ── Main grid ── */}
      <motion.div variants={stagger} initial="initial" animate="animate"
        className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-4">

        {/* Left column */}
        <div className="space-y-4">
          {/* Score + stages */}
          <motion.div variants={fadeUp} transition={{ duration:0.35 }} className="ss-card">
            <div className="flex flex-col md:flex-row gap-6 items-start">
              {/* Donut */}
              <div className="flex flex-col items-center">
                <p className="text-sm font-semibold text-white mb-4">Sleep Quality Score</p>
                <DonutChart score={78} label="Good" size={140} color="#7D6BDB"/>
                <p className="text-xs text-[#8B949E] mt-3 text-center max-w-[140px] leading-relaxed">
                  You had a restful sleep. Keep maintaining your routine!
                </p>
              </div>

              {/* Sleep stages grid */}
              <div className="flex-1">
                <p className="text-sm font-semibold text-white mb-3">Sleep Stages</p>
                <div className="grid grid-cols-2 gap-3">
                  {STAGES.map(({ label, value, pct, color }) => (
                    <div key={label} className="p-3 rounded-xl"
                      style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.063)' }}>
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="w-2 h-2 rounded-full" style={{ background:color }}/>
                        <span className="text-xs text-[#8B949E]">{label}</span>
                      </div>
                      <p className="text-base font-bold text-white">{value}</p>
                      <p className="text-xs" style={{ color }}>{pct}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Sleep Quality Factors */}
          <motion.div variants={fadeUp} transition={{ duration:0.35 }} className="ss-card">
            <p className="text-sm font-semibold text-white mb-4">Sleep Quality Factors</p>
            <div className="space-y-3">
              {FACTORS.map((f, i) => (
                <ProgressBar key={f.label} label={f.label} value={f.value} status={f.status} delay={i*0.1}/>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Right column */}
        <div className="space-y-4">
          {/* Duration stat */}
          <motion.div variants={fadeUp} transition={{ duration:0.35 }} className="ss-card">
            <p className="text-sm font-semibold text-white mb-3">Sleep Duration</p>
            <div className="flex items-center gap-3 mb-1">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ background:'rgba(125,107,219,0.2)' }}>
                <BedDouble size={17} color="#7D6BDB"/>
              </div>
              <div>
                <p className="text-3xl font-bold text-white">7h 12m</p>
                <p className="text-xs text-[#10B981]">Normal · Goal: 7-8 hours</p>
              </div>
            </div>
          </motion.div>

          {/* Nightly bar chart */}
          <motion.div variants={fadeUp} transition={{ duration:0.35 }} className="ss-card">
            <p className="text-sm font-semibold text-white mb-3">Nightly Sleep (hrs)</p>
            <ResponsiveContainer width="100%" height={150}>
              <BarChart data={NIGHTLY} margin={{ top:4, right:4, left:-24, bottom:0 }} barSize={18}>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false}/>
                <XAxis dataKey="night" tick={{ fill:'#8B949E', fontSize:10 }} axisLine={false} tickLine={false}/>
                <YAxis domain={[0,10]} tick={{ fill:'#8B949E', fontSize:10 }} axisLine={false} tickLine={false}/>
                <Tooltip content={<SleepBarTooltip/>}/>
                <Bar dataKey="hours" radius={[6,6,0,0]}>
                  {NIGHTLY.map((_, i) => (
                    <Cell key={i} fill={i===5?'#7D6BDB':'rgba(125,107,219,0.35)'}/>
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </motion.div>

          {/* Improve tip */}
          <motion.div variants={fadeUp} transition={{ duration:0.35 }} className="ss-card"
            style={{ background:'rgba(245,158,11,0.08)', border:'1px solid rgba(245,158,11,0.2)' }}>
            <div className="flex items-start gap-2">
              <span className="text-xl">💡</span>
              <div>
                <p className="text-sm font-semibold text-white mb-1">Improve Tip</p>
                <p className="text-xs text-[#8B949E] leading-relaxed">
                  Try to reduce screen time before bed and maintain a regular sleep schedule.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  );
}
