import React from 'react';
import { motion } from 'framer-motion';

const STATUS_STYLES = {
  Good:     { color: '#3FB950', bg: 'rgba(63,185,80,0.1)' },
  Moderate: { color: '#D29922', bg: 'rgba(210,153,34,0.1)' },
  Poor:     { color: '#F85149', bg: 'rgba(248,81,73,0.1)' },
};

const STATUS_COLORS = {
  Good:     '#3FB950',
  Moderate: '#D29922',
  Poor:     '#F85149',
};

/**
 * Horizontal progress bar for Sleep Quality Factors.
 * Usage:
 * <ProgressBar label="Sleep Duration" value={85} status="Good" />
 */
export default function ProgressBar({ label, value = 0, status = 'Good', delay = 0 }) {
  const barColor = STATUS_COLORS[status] || '#6D5DFE';
  const statusStyle = STATUS_STYLES[status] || STATUS_STYLES.Good;

  return (
    <div className="flex items-center gap-4">
      <span className="text-sm text-[#8B949E] w-40 flex-shrink-0">{label}</span>
      <div className="flex-1 progress-track">
        <motion.div
          className="progress-fill"
          style={{ background: barColor }}
          initial={{ width: 0 }}
          animate={{ width: `${value}%` }}
          transition={{ duration: 0.8, delay, ease: 'easeOut' }}
        />
      </div>
      <span
        className="text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
        style={{ color: statusStyle.color, background: statusStyle.bg }}
      >
        {status}
      </span>
    </div>
  );
}
