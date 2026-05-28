import React from 'react';

/**
 * SVG Donut / Circular gauge chart.
 * Usage: <DonutChart score={78} max={100} color="#6D5DFE" label="Good" />
 */
export default function DonutChart({
  score = 78,
  max = 100,
  color = '#6D5DFE',
  trackColor = 'var(--border-color)',
  size = 175,
  strokeWidth = 12,
  label = 'Good',
}) {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = Math.min(score / max, 1);
  const offset = circumference - progress * circumference;
  const center = size / 2;

  return (
    <div className="relative inline-flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        {/* Track */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <circle
          cx={center}
          cy={center}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s ease-out', filter: `drop-shadow(0 0 6px ${color}80)` }}
        />
      </svg>
      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="text-5xl font-black text-[var(--text-main)] leading-none">{score}</span>
        <span className="text-base font-bold text-[var(--text-muted)] mt-0.5">/{max}</span>
        {label && <span className="text-base font-extrabold mt-1" style={{ color }}>{label}</span>}
      </div>
    </div>
  );
}
