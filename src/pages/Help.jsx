import React from 'react';
import { motion } from 'framer-motion';
import { Info, BookOpen, HelpCircle, CheckCircle, Activity, Mic, Moon, Sparkles, Watch, Link } from 'lucide-react';

const HELP_CONTENT = [
  { 
    title: 'Getting Started', 
    icon: Sparkles,
    desc: 'Start by clicking "New Check-In" on your dashboard. Provide your sleep data, mood text, and a short voice clip. Our AI will then fuse these indicators to give you a comprehensive wellness score and personalized advice.' 
  },
  { 
    title: 'Connecting Fitbit', 
    icon: Link,
    desc: 'To connect your Fitbit, click the "Connect Fitbit" button on the Dashboard header. You will be redirected to Fitbit’s secure login page. After authorizing SleepSense AI, your sleep metrics will automatically sync with our dashboard.' 
  },
  { 
    title: 'Fitbit Data Sync', 
    icon: Watch,
    desc: 'Ensure your Fitbit wearable is synced with the Fitbit app on your smartphone. SleepSense AI fetches data from the cloud; if your device hasn’t synced with your phone, we may not see your latest sleep data.' 
  },
  { 
    title: 'Sleep Latency', 
    icon: Moon,
    desc: 'The total time (in minutes) it takes you to fall asleep after getting into bed and turning off the lights. High latency can indicate stress or poor sleep hygiene.' 
  },
  { 
    title: 'Sleep Efficiency', 
    icon: Activity,
    desc: 'The percentage of time you actually spend sleeping while in bed. High efficiency (above 85%) indicates healthy, uninterrupted sleep.' 
  },
  { 
    title: 'Deep Sleep', 
    icon: CheckCircle,
    desc: 'The stage of sleep where your body repairs tissue, builds bone and muscle, and strengthens the immune system. It is the most restorative phase.' 
  },
  { 
    title: 'REM Sleep', 
    icon: Activity,
    desc: 'Rapid Eye Movement sleep. This is when most dreaming occurs and is essential for emotional regulation, learning, and memory consolidation.' 
  },
  { 
    title: 'Vocal Analysis', 
    icon: Mic,
    desc: 'We use 1D-CNN models to analyze your vocal tone. We look for indicators of fatigue, stress, or emotional distress in the frequencies of your speech.' 
  },
  { 
    title: 'Mental Analysis', 
    icon: Info,
    desc: 'Our MentalBERT model analyzes the sentiment and context of your written check-ins to detect early signs of anxiety or depression.' 
  }
];

const fadeUp = { initial: { opacity: 0, y: 20 }, animate: { opacity: 1, y: 0 } };

export default function Help() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <motion.div {...fadeUp} className="text-center space-y-4">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-[#7D6BDB]/10 text-[#7D6BDB] mb-2">
          <BookOpen size={32} />
        </div>
        <h1 className="text-4xl font-black text-white uppercase tracking-tighter">Help Center</h1>
        <p className="text-[#8B949E] max-w-lg mx-auto">
          Learn how to sync your wearable devices and understand the science behind your wellness scores.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {HELP_CONTENT.map((item, idx) => (
          <motion.div 
            key={idx}
            {...fadeUp}
            transition={{ delay: idx * 0.05 }}
            className="ss-card group hover:border-[#7D6BDB]/50 transition-all duration-300"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-[#7D6BDB] group-hover:bg-[#7D6BDB] group-hover:text-white transition-all duration-300">
                <item.icon size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-white mb-2 uppercase tracking-wide group-hover:text-[#7D6BDB] transition-colors">
                  {item.title}
                </h3>
                <p className="text-sm text-[#8B949E] leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <motion.div 
        {...fadeUp} 
        transition={{ delay: 0.4 }}
        className="ss-card bg-gradient-to-br from-[#7D6BDB]/10 to-transparent border-[#7D6BDB]/20 text-center !p-10"
      >
        <h3 className="text-xl font-bold text-white mb-4">Still have questions?</h3>
        <p className="text-[#8B949E] text-sm mb-6 max-w-md mx-auto">
          Our team is constantly improving the AI models. If you encounter any issues or have suggestions, feel free to reach out.
        </p>
        <button className="btn-primary">Contact Support</button>
      </motion.div>
    </div>
  );
}
