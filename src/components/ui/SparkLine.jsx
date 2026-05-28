import React from 'react';

/**
 * Tiny SVG sparkline — renders a smooth path from an array of values.
 * Usage: <SparkLine data={[65,70,68,72,78,74,80]} color="#6D5DFE" />
 */
export default function SparkLine({ data = [], color = '#6D5DFE', width = 80, height = 32 }) {
  if (!data || data.length < 2) return null;

  const min = Math.min(...data);
  const max = Math.max(...data);
  const range = max - min || 1;

  const points = data.map((v, i) => ({
    x: (i / (data.length - 1)) * width,
    y: height - ((v - min) / range) * height * 0.8 - height * 0.1,
  }));

  // Smooth bezier path
  const d = points.reduce((acc, pt, i) => {
    if (i === 0) return `M ${pt.x} ${pt.y}`;
    const prev = points[i - 1];
    const cpx = (prev.x + pt.x) / 2;
    return `${acc} C ${cpx} ${prev.y}, ${cpx} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');

  const fillId = `fill-${color.replace('#', '')}`;

  return (
    <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} fill="none">
      <defs>
        <linearGradient id={fillId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.3" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>
      {/* Fill area */}
      <path
        d={`${d} L ${points[points.length - 1].x} ${height} L ${points[0].x} ${height} Z`}
        fill={`url(#${fillId})`}
      />
      {/* Line */}
      <path d={d} stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
      {/* End dot */}
      <circle
        cx={points[points.length - 1].x}
        cy={points[points.length - 1].y}
        r="3"
        fill={color}
        stroke="var(--bg-card)"
        strokeWidth="1.5"
      />
    </svg>
  );
}
