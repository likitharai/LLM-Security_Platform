import React from 'react';

export default function RiskHeatmap({ data }) {
  // Fallback data if none provided
  const matrix = data || [
    { level: 'High', safe: 12, suspicious: 45, malicious: 120 },
    { level: 'Medium', safe: 340, suspicious: 89, malicious: 23 },
    { level: 'Low', safe: 1250, suspicious: 12, malicious: 2 }
  ];

  const getColor = (value, type) => {
    if (value === 0) return 'bg-slate-50 text-slate-400';
    if (type === 'malicious') {
      if (value > 50) return 'bg-red-500 text-white';
      if (value > 10) return 'bg-red-400 text-white';
      return 'bg-red-200 text-red-900';
    }
    if (type === 'suspicious') {
      if (value > 50) return 'bg-amber-500 text-white';
      if (value > 10) return 'bg-amber-400 text-white';
      return 'bg-amber-200 text-amber-900';
    }
    // Safe
    if (value > 500) return 'bg-emerald-500 text-white';
    if (value > 100) return 'bg-emerald-400 text-white';
    return 'bg-emerald-200 text-emerald-900';
  };

  return (
    <div className="w-full h-full flex flex-col justify-center">
      <div className="grid grid-cols-4 gap-2 text-center text-xs font-semibold text-slate-500 mb-2">
        <div>Volume</div>
        <div>Safe</div>
        <div>Suspicious</div>
        <div>Malicious</div>
      </div>
      
      <div className="flex flex-col gap-2">
        {matrix.map((row, idx) => (
          <div key={idx} className="grid grid-cols-4 gap-2">
            <div className="flex items-center justify-end pr-4 text-xs font-bold text-slate-700">
              {row.level}
            </div>
            <div className={`p-3 rounded-md flex items-center justify-center font-mono text-sm ${getColor(row.safe, 'safe')}`}>
              {row.safe}
            </div>
            <div className={`p-3 rounded-md flex items-center justify-center font-mono text-sm ${getColor(row.suspicious, 'suspicious')}`}>
              {row.suspicious}
            </div>
            <div className={`p-3 rounded-md flex items-center justify-center font-mono text-sm ${getColor(row.malicious, 'malicious')}`}>
              {row.malicious}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-center gap-4 text-[10px] text-slate-400 uppercase tracking-wide">
        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-emerald-400 rounded-sm"></div> Allowed</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-amber-400 rounded-sm"></div> Quarantined</span>
        <span className="flex items-center gap-1"><div className="w-2 h-2 bg-red-500 rounded-sm"></div> Blocked</span>
      </div>
    </div>
  );
}