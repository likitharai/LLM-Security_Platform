import React from 'react';
import { Settings as SettingsIcon, Sliders, Database, Key } from 'lucide-react';

export default function Settings() {
  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Platform Settings</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Navigation Sidebar for settings */}
        <div className="space-y-1">
          <button className="w-full flex items-center gap-3 px-4 py-3 bg-indigo-50 text-indigo-700 rounded-lg font-semibold text-sm transition-colors">
            <Sliders size={18} /> Risk Thresholds
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
            <Database size={18} /> Model Configuration
          </button>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-slate-600 hover:bg-slate-100 rounded-lg font-medium text-sm transition-colors">
            <Key size={18} /> API Keys
          </button>
        </div>

        {/* Main Settings Panel */}
        <div className="md:col-span-3 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <div className="flex items-center gap-3 mb-6 border-b border-slate-100 pb-4">
              <div className="p-2 bg-indigo-100 rounded-lg"><Sliders className="text-indigo-600" size={20} /></div>
              <div>
                <h2 className="text-lg font-bold text-slate-900">Global Risk Thresholds</h2>
                <p className="text-sm text-slate-500">Configure sensitivity for automatic block/quarantine actions.</p>
              </div>
            </div>

            <div className="space-y-8">
              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">Injection & Jailbreak Block Threshold</label>
                  <span className="text-sm font-mono font-bold text-indigo-600">75 / 100</span>
                </div>
                <input type="range" className="w-full accent-indigo-600" min="0" max="100" defaultValue="75" />
                <p className="text-xs text-slate-500 mt-2">Prompts scoring above this will be immediately blocked and not sent to the LLM.</p>
              </div>

              <div>
                <div className="flex justify-between mb-2">
                  <label className="text-sm font-semibold text-slate-700">PHI/PII Redaction Strictness</label>
                  <span className="text-sm font-mono font-bold text-purple-600">High</span>
                </div>
                <select className="w-full p-2.5 bg-slate-50 border border-slate-300 rounded-lg text-sm focus:ring-indigo-500 focus:border-indigo-500">
                  <option>Low (Only obvious entities)</option>
                  <option>Medium (Standard NER mapping)</option>
                  <option selected>High (Aggressive redaction)</option>
                </select>
              </div>
            </div>
            
            <div className="mt-8 pt-4 border-t border-slate-100 flex justify-end">
              <button className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 transition-colors">
                Save Changes
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}