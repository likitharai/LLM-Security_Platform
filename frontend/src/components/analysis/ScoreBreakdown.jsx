import React from 'react';

export default function ScoreBreakdown({ breakdown }) {
  if (!breakdown) return null;

  const metrics = [
    { label: 'Injection Threat', value: breakdown.classifier_risk, color: 'bg-indigo-500' },
    { label: 'PHI Exposure', value: breakdown.phi_risk, color: 'bg-purple-500' },
    { label: 'Vector Match', value: breakdown.similarity_risk, color: 'bg-blue-500' }
  ];

  return (
    <div className="bg-white rounded-lg border border-slate-200 p-5 mt-4 shadow-sm">
      <h4 className="text-sm font-bold text-slate-800 mb-4 uppercase tracking-wider">Risk Factors</h4>
      
      <div className="space-y-4">
        {metrics.map((metric, idx) => (
          <div key={idx}>
            <div className="flex justify-between items-center mb-1">
              <span className="text-xs font-semibold text-slate-600">{metric.label}</span>
              <span className="text-xs font-mono font-medium text-slate-900">{metric.value} / 100</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div 
                className={`${metric.color} h-2 rounded-full transition-all duration-700 ease-out`} 
                style={{ width: `${metric.value}%` }}
              ></div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}