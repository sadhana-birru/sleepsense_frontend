import React from 'react';
import { motion } from 'framer-motion';
import SparkLine from './SparkLine';

const TAG_STYLES = {
  Good:     'tag-good',
  Stable:   'tag-stable',
  Moderate: 'tag-moderate',
  Poor:     'tag-bad',
  Risky:    'tag-bad',
  Fair:     'tag-moderate',
};

export default function MetricCard({
  icon,
  label,
  score,
  max = 100,
  tag,
  description,
  sparkData = [],
  accentColor = '#6D5DFE',
}) {
  const tagClass = TAG_STYLES[tag] || 'tag-stable';

  return (
    <motion.div
      className="ss-card flex flex-col gap-3 cursor-default"
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {/* Header row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center"
            style={{ background: `${accentColor}20`, color: accentColor }}
          >
            {icon}
          </div>
          <span className="metric-label">{label}</span>
        </div>
        {tag && <span className={tagClass}>{tag}</span>}
      </div>

      {/* Score */}
      <div className="flex items-end gap-2">
        <span className="text-6xl font-black text-[var(--text-main)] leading-none">{score}</span>
        <span className="text-2xl text-[var(--text-muted)] font-bold pb-1.5">/{max}</span>
      </div>

      {description && (
        <p className="text-xs text-[#8B949E]">{description}</p>
      )}

      {/* Sparkline */}
      {sparkData.length > 0 && (
        <div className="mt-auto pt-2 border-t border-[var(--border-color)]">
          <SparkLine data={sparkData} color={accentColor} width={120} height={32} />
        </div>
      )}

      {/* Accent glow */}
      <div
        className="absolute -bottom-4 -right-4 w-24 h-24 rounded-full blur-3xl pointer-events-none"
        style={{ background: `${accentColor}18` }}
      />
    </motion.div>
  );
}
