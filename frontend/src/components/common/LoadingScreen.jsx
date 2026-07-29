import React from 'react';
import { Loader2, Shield } from 'lucide-react';

export default function LoadingScreen({ message = "Initializing Security Modules..." }) {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
      <div className="relative flex items-center justify-center mb-8">
        {/* Outer glowing effect */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-xl rounded-full w-24 h-24 animate-pulse"></div>
        {/* Inner static shield icon */}
        <Shield size={48} className="text-indigo-600 relative z-10" strokeWidth={1.5} />
        {/* Orbiting loader */}
        <Loader2 size={80} className="text-indigo-400 absolute animate-spin font-light z-20" strokeWidth={1} />
      </div>
      
      <h2 className="text-lg font-semibold text-slate-900 tracking-tight">{message}</h2>
      <p className="text-sm text-slate-500 mt-2 font-mono">Loading Hugging Face Transformers</p>
    </div>
  );
}