// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, NavLink } from 'react-router-dom';
import { LayoutDashboard, Shield, FileText, Activity, Settings, HelpCircle } from 'lucide-react';

// Import your existing pages
import Overview from './pages/Overview';
import AnalyzePrompt from './pages/AnalyzePrompt';
import ThreatLogs from './pages/ThreatLogs';
import Policies from './pages/Policies';
import ModelHealth from './pages/ModelHealth';

const Sidebar = () => {
  const navItems = [
    { name: 'Overview', path: '/', icon: <LayoutDashboard size={20} /> },
    { name: 'Analyze Prompt', path: '/analyze', icon: <Activity size={20} /> },
    { name: 'Threat Logs', path: '/logs', icon: <FileText size={20} />, badge: 12 },
    { name: 'Policies', path: '/policies', icon: <Shield size={20} /> },
    { name: 'Model Health', path: '/health', icon: <Activity size={20} /> },
  ];

  return (
    <div className="w-64 bg-[#0f172a] text-slate-300 flex flex-col min-h-screen">
      <div className="p-6 flex items-center gap-3 mb-6">
        <div className="w-8 h-8 bg-emerald-500 rounded flex items-center justify-center text-white font-bold">+</div>
        <div>
          <h1 className="font-semibold text-white leading-tight">LLM Security</h1>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest">Platform</p>
        </div>
      </div>

      <nav className="flex-1 px-4 space-y-1">
        {navItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center justify-between px-3 py-2.5 rounded-lg transition-colors ${
                isActive ? 'bg-[#1e293b] text-white' : 'hover:bg-[#1e293b] hover:text-white'
              }`
            }
          >
            <div className="flex items-center gap-3 text-sm font-medium">
              {item.icon}
              {item.name}
            </div>
            {item.badge && (
              <span className="bg-red-500 text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                {item.badge}
              </span>
            )}
          </NavLink>
        ))}
      </nav>

      <div className="p-4 space-y-1 border-t border-slate-800">
        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium hover:text-white w-full">
          <HelpCircle size={20} /> Help center
        </button>
        <button className="flex items-center gap-3 px-3 py-2 text-sm font-medium hover:text-white w-full">
          <Settings size={20} /> Settings
        </button>
        <div className="mt-4 flex items-center gap-3 px-3 py-2">
          <div className="w-8 h-8 bg-slate-700 rounded-full flex items-center justify-center text-white text-xs font-bold">AR</div>
          <div className="text-left">
            <p className="text-sm font-medium text-white">Aakruthi Rao</p>
            <p className="text-xs text-slate-500">Administrator</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default function App() {
  return (
    <Router>
      <div className="flex bg-[#f8fafc] min-h-screen font-sans">
        <Sidebar />
        <main className="flex-1 overflow-y-auto">
          <Routes>
            <Route path="/" element={<Overview />} />
            <Route path="/analyze" element={<AnalyzePrompt />} />
            <Route path="/logs" element={<ThreatLogs />} />
            <Route path="/policies" element={<Policies />} />
            <Route path="/health" element={<ModelHealth />} />
          </Routes>
        </main>
      </div>
    </Router>
  );
}