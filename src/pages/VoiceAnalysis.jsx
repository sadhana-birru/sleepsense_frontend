import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mic, MicOff, BarChart2 } from 'lucide-react';

const fadeUp = { initial:{ opacity:0, y:14 }, animate:{ opacity:1, y:0 } };

const WAVEFORM_HEIGHTS = [12,22,35,48,30,54,40,28,44,58,32,46,20,38,50,26,42,56,18,36,52,24,44,34,48];

function Waveform({ active }) {
  return (
    <div className="flex items-center justify-center gap-1 h-16">
      {WAVEFORM_HEIGHTS.map((h, i) => (
        <div key={i}
          className="rounded-full transition-all duration-300"
          style={{
            width: 3,
            height: active ? h : h * 0.3,
            background: active ? '#7D6BDB' : 'rgba(125,107,219,0.3)',
            animation: active ? `waveform 1.2s ease-in-out infinite` : 'none',
            animationDelay: `${i * 0.06}s`,
            opacity: active ? (0.4 + (h/58)*0.6) : 0.3,
          }}
        />
      ))}
    </div>
  );
}

const RESULTS = [
  { label: 'Detected Mood',   value: 'Calm',      color: '#10B981' },
  { label: 'Stress Level',    value: 'Low',        color: '#10B981' },
  { label: 'Energy',          value: 'Moderate',   color: '#F59E0B' },
  { label: 'Confidence',      value: 'High',       color: '#22D3EE' },
];

export default function VoiceAnalysis() {
  const [recording, setRecording] = useState(false);
  const [analyzed,  setAnalyzed]  = useState(false);

  const handleMic = () => {
    if (!recording) {
      setRecording(true);
      setAnalyzed(false);
      setTimeout(() => { setRecording(false); setAnalyzed(true); }, 4000);
    }
  };

  return (
    <div className="max-w-xl mx-auto">
      <motion.div {...fadeUp} transition={{ duration:0.35 }} className="text-center mb-8">
        <h1 className="text-2xl font-bold text-white mb-2">Voice Analysis</h1>
        <p className="text-sm text-[#8B949E]">
          Speak naturally for a few seconds. Our AI will analyse your vocal tone,<br/>
          stress patterns, and emotional state.
        </p>
      </motion.div>

      {/* Mic card */}
      <motion.div {...fadeUp} transition={{ duration:0.35, delay:0.1 }} className="ss-card mb-4 text-center py-8">
        {/* Waveform */}
        <Waveform active={recording}/>

        {/* Mic button */}
        <div className="relative inline-flex items-center justify-center mt-6 mb-4">
          {recording && (
            <>
              <div className="absolute w-24 h-24 rounded-full animate-ping"
                style={{ background:'rgba(125,107,219,0.15)' }}/>
              <div className="absolute w-20 h-20 rounded-full animate-pulse"
                style={{ background:'rgba(125,107,219,0.2)' }}/>
            </>
          )}
          <motion.button
            whileHover={{ scale:1.08 }}
            whileTap={{ scale:0.95 }}
            onClick={handleMic}
            className="relative w-16 h-16 rounded-full flex items-center justify-center transition-all duration-300"
            style={{
              background: recording
                ? 'linear-gradient(135deg,#EF4444,#C0392B)'
                : 'linear-gradient(135deg,#7D6BDB,#57358F)',
              boxShadow: recording
                ? '0 0 30px rgba(239,68,68,0.5)'
                : '0 0 30px rgba(125,107,219,0.5)',
            }}>
            {recording ? <MicOff size={24} color="#fff"/> : <Mic size={24} color="#fff"/>}
          </motion.button>
        </div>

        <p className="text-sm font-medium"
          style={{ color: recording ? '#EF4444' : '#64748B' }}>
          {recording ? 'Recording… tap to stop' : 'Tap mic to start recording'}
        </p>
      </motion.div>

      {/* Results */}
      {analyzed && (
        <motion.div initial={{ opacity:0, y:16 }} animate={{ opacity:1, y:0 }} transition={{ duration:0.4 }}
          className="ss-card">
          <div className="flex items-center gap-2 mb-4">
            <BarChart2 size={16} color="#7D6BDB"/>
            <p className="text-sm font-semibold text-white">Analysis Results</p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {RESULTS.map(({ label, value, color }) => (
              <div key={label} className="p-3 rounded-xl text-center"
                style={{ background:'rgba(255,255,255,0.04)', border:'1px solid rgba(255,255,255,0.063)' }}>
                <p className="text-xs text-[#8B949E] mb-1">{label}</p>
                <p className="font-bold text-sm" style={{ color }}>{value}</p>
              </div>
            ))}
          </div>
          <p className="text-xs text-[#8B949E] mt-4 text-center">
            Analysis completed · {new Date().toLocaleTimeString('en-US',{hour:'2-digit',minute:'2-digit'})}
          </p>
        </motion.div>
      )}
    </div>
  );
}
