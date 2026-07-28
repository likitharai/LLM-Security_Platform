import React, { useState } from 'react';
import { ShieldCheck } from 'lucide-react';

const PolicyCard = ({ title, description, defaultAction, initialActive }) => {
  const [isActive, setIsActive] = useState(initialActive);

  return (
    <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-start mb-4">
          <div className="w-10 h-10 rounded-lg bg-[#f0fdf4] text-[#0d9488] flex items-center justify-center border border-[#ccfbf1]">
            <ShieldCheck size={20} />
          </div>
          {/* Toggle Switch */}
          <button 
            onClick={() => setIsActive(!isActive)}
            className={`w-11 h-6 rounded-full transition-colors relative ${isActive ? 'bg-[#0d9488]' : 'bg-slate-200'}`}
          >
            <span className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${isActive ? 'translate-x-5' : 'translate-x-0'}`} />
          </button>
        </div>
        <h3 className="text-lg font-bold text-slate-900 mb-1">{title}</h3>
        <p className="text-sm text-slate-500 mb-6">{description}</p>
      </div>
      
      <div className="flex justify-between items-center pt-4 border-t border-gray-100">
        <div className="text-sm">
          <span className="text-slate-400">Default action: </span>
          <span className="font-bold text-slate-700">{defaultAction}</span>
        </div>
        <span className={`text-xs font-bold px-2 py-1 rounded-md ${isActive ? 'text-[#0d9488] bg-[#f0fdf4]' : 'text-slate-500 bg-slate-100'}`}>
          {isActive ? 'Active' : 'Disabled'}
        </span>
      </div>
    </div>
  );
};

export default function Policies() {
  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#0d9488] text-xs font-bold tracking-widest uppercase">Policy Engine</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Security policies</h2>
        <p className="text-slate-500 mt-1">Control how Hybrid Adaptive Security Platform responds to each class of risk.</p>
      </div>

      <div className="grid grid-cols-2 gap-6">
        <PolicyCard 
          title="Prompt injection defense" 
          description="Block instruction overrides, role manipulation, and system prompt extraction."
          defaultAction="Block"
          initialActive={true}
        />
        <PolicyCard 
          title="PHI & PII protection" 
          description="Detect and mask names, IDs, phone numbers, diagnoses, and medical records."
          defaultAction="Mask"
          initialActive={true}
        />
        <PolicyCard 
          title="Jailbreak prevention" 
          description="Stop persona switches, developer-mode requests, and restriction bypasses."
          defaultAction="Block"
          initialActive={true}
        />
        <PolicyCard 
          title="Behavioral anomaly guard" 
          description="Detect unusual request frequency and evolving multi-turn attacks."
          defaultAction="Quarantine"
          initialActive={false}
        />
      </div>

    </div>
  );
}