import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  TerminalSquare, 
  ShieldAlert, 
  FileText, 
  Activity, 
  Lock,
  Users
} from 'lucide-react';

const NAV_ITEMS = [
  { name: 'Dashboard', path: '/', icon: LayoutDashboard },
  { name: 'Analyze Prompt', path: '/analyze', icon: TerminalSquare },
  { name: 'Threat Logs', path: '/logs', icon: ShieldAlert },
  { name: 'Analysis History', path: '/history', icon: FileText },
  { name: 'Model Health', path: '/health', icon: Activity },
  { name: 'Security Policies', path: '/policies', icon: Lock },
  { name: 'User Management', path: '/users', icon: Users },
];

export default function Sidebar() {
  return (
    <aside className="w-64 bg-slate-900 flex flex-col h-full border-r border-slate-800 shrink-0">
      {/* Brand/Logo Area */}
      <div className="h-16 flex items-center px-6 border-b border-slate-800 bg-slate-950/50">
        <ShieldAlert className="text-indigo-500 mr-3" size={24} />
        <span className="text-white font-bold text-lg tracking-tight">LLM Security Platform</span>
      </div>

      {/* Navigation Links */}
      <div className="flex-1 overflow-y-auto py-6 px-3 space-y-1">
        <div className="px-3 mb-2 text-xs font-semibold text-slate-500 uppercase tracking-wider">
          Core Engine
        </div>
        {NAV_ITEMS.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 ${
                isActive
                  ? 'bg-indigo-600 text-white shadow-md shadow-indigo-900/20'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`
            }
          >
            <item.icon size={18} strokeWidth={2} />
            {item.name}
          </NavLink>
        ))}
      </div>

      {/* Footer Info */}
      <div className="p-4 border-t border-slate-800 bg-slate-950/30">
        <div className="flex flex-col gap-1">
          <span className="text-xs text-slate-500 font-mono">Platform v1.0.0</span>
          <span className="text-[10px] text-emerald-500 flex items-center gap-1.5 font-medium">
            <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></div>
            System Online
          </span>
        </div>
      </div>
    </aside>
  );
}