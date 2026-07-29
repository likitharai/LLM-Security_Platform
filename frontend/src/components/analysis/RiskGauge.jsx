import React from 'react';

export default function RiskGauge({ score, action }) {
  // SVG arc calculation parameters
  const radius = 80;
  const circumference = radius * Math.PI;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  let color = '#10b981'; // Emerald (Safe)
  let bgClass = 'bg-emerald-50';
  let textClass = 'text-emerald-700';
  let level = 'Safe';

  if (score >= 75) {
    color = '#ef4444'; // Red (Critical)
    bgClass = 'bg-red-50';
    textClass = 'text-red-700';
    level = 'Critical Risk';
  } else if (score >= 45) {
    color = '#f59e0b'; // Amber (Warning)
    bgClass = 'bg-amber-50';
    textClass = 'text-amber-700';
    level = 'Elevated Risk';
  }

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 flex flex-col items-center relative overflow-hidden">
      <h3 className="w-full text-left text-sm font-bold text-slate-900 uppercase tracking-wider mb-6">Overall Threat Score</h3>
      
      <div className="relative w-48 h-24 mb-4">
        {/* Background Arc */}
        <svg className="w-full h-full" viewBox="0 0 200 100">
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke="#f1f5f9"
            strokeWidth="16"
            strokeLinecap="round"
          />
          {/* Foreground Score Arc */}
          <path
            d="M 10 100 A 90 90 0 0 1 190 100"
            fill="none"
            stroke={color}
            strokeWidth="16"
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            className="transition-all duration-1000 ease-out"
          />
        </svg>
        
        {/* Center Score Text */}
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex flex-col items-center">
          <span className="text-4xl font-black text-slate-900 leading-none">{score}</span>
        </div>
      </div>

      <div className={`mt-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-wider ${bgClass} ${textClass}`}>
        {level}
      </div>
    </div>
  );
}