import React, { useEffect, useState } from 'react';
import { AlertTriangle, CheckCircle, Info, ShieldAlert } from 'lucide-react';
import { cn } from '../utils/cn';

const CircularGauge = ({ value, label, colorClass, size = 120 }) => {
    const [animatedValue, setAnimatedValue] = useState(0);
    // Value is 0.0 to 1.0
    const percentage = Math.min(Math.max(value * 100, 0), 100);
    const strokeWidth = 8;
    const radius = (size - strokeWidth) / 2;
    const circumference = radius * 2 * Math.PI;

    useEffect(() => {
        // Simple animation effect
        const timer = setTimeout(() => setAnimatedValue(percentage), 100);
        return () => clearTimeout(timer);
    }, [percentage]);

    const strokeDashoffset = circumference - (animatedValue / 100) * circumference;

    return (
        <div className="flex flex-col items-center justify-center space-y-3">
            <div className="relative" style={{ width: size, height: size }}>
                {/* Background Circle */}
                <svg fill="none" className="w-full h-full transform -rotate-90">
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        stroke="currentColor"
                        className="text-charcoal-700"
                    />
                    {/* Progress Circle */}
                    <circle
                        cx={size / 2}
                        cy={size / 2}
                        r={radius}
                        strokeWidth={strokeWidth}
                        strokeDasharray={circumference}
                        strokeDashoffset={strokeDashoffset}
                        strokeLinecap="round"
                        stroke="currentColor"
                        className={cn("transition-all duration-1000 ease-out drop-shadow-[0_0_8px_currentColor]", colorClass)}
                    />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <span className="text-2xl font-bold text-white">{Math.round(animatedValue)}%</span>
                </div>
            </div>
            <span className="text-sm font-medium text-gray-400 tracking-wide uppercase">{label}</span>
        </div>
    );
};

export default function ReportDashboard({ data, isLoading, error }) {
    if (error) {
        return (
            <div className="glass-panel p-8 h-full flex flex-col items-center justify-center text-center">
                <ShieldAlert size={48} className="text-danger mb-4" />
                <h3 className="text-xl font-semibold text-white mb-2">Analysis Failed</h3>
                <p className="text-gray-400">{error}</p>
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="glass-panel p-8 h-full flex flex-col items-center justify-center">
                <div className="w-16 h-16 border-4 border-charcoal-700 border-t-cyan-400 rounded-full animate-spin mb-4"></div>
                <p className="text-cyan-400 font-medium animate-pulse">Running Triple-Fusion Inference...</p>
            </div>
        );
    }

    if (!data) {
        return (
            <div className="glass-panel p-8 h-full flex flex-col items-center justify-center text-center border-dashed border-2 border-white/5 bg-charcoal-900/50">
                <Info size={40} className="text-gray-500 mb-4" />
                <h3 className="text-xl text-gray-400 font-medium">No Data Yet</h3>
                <p className="text-gray-500 max-w-sm mt-2">
                    Fill out the form and submit your voice check-in to generate a comprehensive stability report.
                </p>
            </div>
        );
    }

    const { physical_score, mental_score, vocal_score, overall_score, status, advice } = data;

    const getStatusColor = (status) => {
        if (status.includes("CRITICAL")) return "text-danger bg-danger/10 border-danger/20";
        if (status.includes("MODERATE")) return "text-warning bg-warning/10 border-warning/20";
        return "text-safe bg-safe/10 border-safe/20";
    };

    const statusColor = getStatusColor(status);
    const StatusIcon = status.includes("CRITICAL") ? ShieldAlert : status.includes("MODERATE") ? AlertTriangle : CheckCircle;

    return (
        <div className="glass-panel overflow-hidden h-full flex flex-col animate-in fade-in zoom-in-95 duration-700 shadow-2xl shadow-indigo-900/20">

            {/* Header / Final Status */}
            <div className="p-8 border-b border-white/5 bg-charcoal-900/40 relative overflow-hidden flex-shrink-0">
                <div className="absolute right-[-10%] top-[-20%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] bg-indigo-500/10 rounded-full blur-[100px]" />
                <div className="absolute left-[-10%] bottom-[-20%] w-[200px] h-[200px] md:w-[300px] md:h-[300px] bg-cyan-500/10 rounded-full blur-[100px]" />

                <div className="relative z-10 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
                    <div>
                        <p className="text-xs font-black tracking-widest text-gray-500 uppercase mb-3">Integrative Diagnostic Result</p>
                        <div className={cn("inline-flex items-center gap-3 px-6 py-3 rounded-2xl border backdrop-blur-md shadow-lg transition-transform hover:scale-105", statusColor)}>
                            <StatusIcon size={28} className="drop-shadow-[0_0_8px_currentColor]" />
                            <span className="text-3xl font-black tracking-tight drop-shadow-md">{status}</span>
                        </div>
                    </div>

                    <div className="text-left md:text-right bg-charcoal-950/50 p-6 rounded-3xl border border-white/5 shadow-inner">
                        <div className="text-sm font-bold text-gray-400 uppercase tracking-widest mb-1">Cumulative Risk Index</div>
                        <div className="flex items-baseline md:justify-end gap-2">
                            <span className="text-6xl font-black text-transparent bg-clip-text bg-gradient-to-br from-white to-gray-400 drop-shadow-lg">
                                {Math.round(overall_score * 100)}<span className="text-3xl text-gray-500">%</span>
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 3-Column Breakdown */}
            <div className="p-8 flex-grow flex flex-col justify-center relative bg-charcoal-950/20">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative z-10">
                    <div className="glass-panel p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/10 transition-all duration-300">
                        <div className="absolute -inset-4 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                        <div className="relative z-10">
                            <CircularGauge value={physical_score} label="Physical Load" colorClass="text-cyan-400" />
                        </div>
                    </div>
                    
                    <div className="glass-panel p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-indigo-500/10 transition-all duration-300">
                        <div className="absolute -inset-4 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                        <div className="relative z-10">
                            <CircularGauge value={mental_score} label="Mental Strain" colorClass="text-indigo-400" />
                        </div>
                    </div>

                    <div className="glass-panel p-8 flex flex-col items-center justify-center relative overflow-hidden group hover:-translate-y-2 hover:shadow-2xl hover:shadow-rose-500/10 transition-all duration-300">
                        <div className="absolute -inset-4 bg-gradient-to-br from-rose-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>
                        <div className="relative z-10">
                            <CircularGauge value={vocal_score} label="Vocal Stress" colorClass="text-rose-400" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Contextual Advice Footer */}
            <div className="p-6 md:p-8 bg-charcoal-900/90 border-t border-white/5 flex-shrink-0 relative">
                <div className="absolute left-0 top-0 w-1 h-full bg-gradient-to-b from-cyan-400 to-indigo-500"></div>
                <div className="flex gap-5">
                    <div className="flex-shrink-0 mt-1 bg-charcoal-800 p-3 rounded-xl shadow-inner border border-white/5">
                        <Info size={28} className="text-cyan-400 drop-shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
                    </div>
                    <div>
                        <h4 className="text-xs font-black text-cyan-400 uppercase tracking-widest mb-2">Clinical Recommendation</h4>
                        <p className="text-gray-300 leading-relaxed text-lg font-medium">{advice}</p>
                    </div>
                </div>
            </div>

        </div>
    );
}
