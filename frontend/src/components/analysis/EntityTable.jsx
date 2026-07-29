import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export default function EntityTable({ entities }) {
  if (!entities || entities.length === 0) {
    return (
      <div className="bg-slate-50 border border-slate-200 rounded-lg p-6 flex flex-col items-center justify-center text-center h-full">
        <ShieldCheck size={32} className="text-emerald-500 mb-3" />
        <h4 className="text-sm font-semibold text-slate-900">No Sensitive Data Detected</h4>
        <p className="text-xs text-slate-500 mt-1">The NER model did not flag any PHI or PII in this prompt.</p>
      </div>
    );
  }

  return (
    <div className="bg-white border border-slate-200 rounded-lg shadow-sm overflow-hidden">
      <div className="px-4 py-3 border-b border-slate-100 bg-slate-50 flex justify-between items-center">
        <h4 className="text-sm font-bold text-slate-800 uppercase tracking-wider">Detected Entities</h4>
        <span className="bg-purple-100 text-purple-700 text-xs font-bold px-2 py-1 rounded-full flex items-center gap-1">
          <AlertTriangle size={12} /> {entities.length} Found
        </span>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm text-slate-600">
          <thead className="bg-slate-50 text-xs uppercase font-semibold text-slate-500">
            <tr>
              <th className="px-4 py-3">Entity Type</th>
              <th className="px-4 py-3">Redacted Value</th>
              <th className="px-4 py-3">Confidence</th>
              <th className="px-4 py-3">Source Model</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {entities.map((entity, index) => (
              <tr key={index} className="hover:bg-slate-50 transition-colors">
                <td className="px-4 py-3 font-medium text-slate-900">{entity.entity}</td>
                <td className="px-4 py-3 font-mono text-xs bg-slate-100 rounded px-2 py-1 mx-4 my-2 inline-block">
                  {entity.value}
                </td>
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <span className="w-8">{(entity.confidence * 100).toFixed(1)}%</span>
                    <div className="w-16 bg-slate-200 rounded-full h-1.5">
                      <div 
                        className="bg-purple-500 h-1.5 rounded-full" 
                        style={{ width: `${entity.confidence * 100}%` }}
                      ></div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-xs text-slate-500">{entity.source}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}