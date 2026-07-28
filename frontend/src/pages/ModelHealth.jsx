import React from 'react';
import { ChevronRight } from 'lucide-react';

const HealthMetric = ({ title, value, subtext, target }) => (
  <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
    <div className="flex justify-between items-start mb-6">
      <h3 className="text-sm font-bold text-slate-700">{title}</h3>
      <span className="text-xs font-bold text-[#10b981] bg-[#f0fdf4] px-2 py-1 rounded-md border border-[#bbf7d0]">Healthy</span>
    </div>
    <div>
      <h2 className="text-4xl font-bold text-slate-900">{value}</h2>
      <div className="flex justify-between items-end mt-2">
        <p className="text-xs text-slate-500">{subtext}</p>
        <div className="w-1/2 h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div className="h-full bg-[#0d9488] rounded-full" style={{ width: '85%' }}></div>
        </div>
      </div>
    </div>
  </div>
);

const PipelineStage = ({ step, title, status }) => (
  <div className="flex flex-col p-4 bg-slate-50 rounded-lg border border-gray-200 flex-1 relative">
    <span className="text-[10px] font-bold text-slate-400 mb-1 uppercase tracking-wider">{step}</span>
    <h4 className="text-sm font-bold text-slate-800 mb-4">{title}</h4>
    <span className="text-xs text-[#0d9488] font-medium">{status}</span>
  </div>
);

export default function ModelHealth() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#0d9488] text-xs font-bold tracking-widest uppercase">System Observability</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Model health</h2>
        <p className="text-slate-500 mt-1">Operational quality and detection performance across the security pipeline.</p>
      </div>

      <div className="grid grid-cols-4 gap-6">
        <HealthMetric title="Classifier F1" value="0.89" subtext="Target > 0.85" />
        <HealthMetric title="Detection accuracy" value="92.4%" subtext="Last evaluation" />
        <HealthMetric title="P95 latency" value="43 ms" subtext="Target < 50 ms" />
        <HealthMetric title="Service uptime" value="99.98%" subtext="Last 30 days" />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 shadow-sm p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h3 className="text-base font-bold text-slate-900">Security pipeline</h3>
            <p className="text-xs text-slate-500 mt-1">All detection modules are operational</p>
          </div>
          <span className="flex items-center gap-1.5 text-xs font-bold text-green-700 bg-green-50 px-3 py-1.5 rounded-full border border-green-200">
            <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
            Live
          </span>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <PipelineStage step="01" title="Preprocessor" status="Operational" />
          <ChevronRight className="text-slate-300 flex-shrink-0" size={20} />
          <PipelineStage step="02" title="DistilBERT classifier" status="Operational" />
          <ChevronRight className="text-slate-300 flex-shrink-0" size={20} />
          <PipelineStage step="03" title="PII detector" status="Operational" />
          <ChevronRight className="text-slate-300 flex-shrink-0" size={20} />
          <PipelineStage step="04" title="Similarity engine" status="Operational" />
          <ChevronRight className="text-slate-300 flex-shrink-0" size={20} />
          <PipelineStage step="05" title="Risk engine" status="Operational" />
          <ChevronRight className="text-slate-300 flex-shrink-0" size={20} />
          <PipelineStage step="06" title="Policy decision" status="Operational" />
        </div>
      </div>

    </div>
  );
}