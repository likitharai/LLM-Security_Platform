import React from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  Plus, 
  Home, 
  Terminal, 
  AlignLeft, 
  ShieldCheck, 
  Activity,
  HelpCircle,
  Settings,
  MoreVertical
} from 'lucide-react';

export default function AppLayout() {
  const location = useLocation();

  const navItems = [
    { name: 'Overview', path: '/overview', icon: Home },
    { name: 'Analyze Prompt', path: '/analyze', icon: Terminal },
    { name: 'Threat Logs', path: '/logs', icon: AlignLeft, badge: 12 },
    { name: 'Policies', path: '/policies', icon: ShieldCheck },
    { name: 'Model Health', path: '/health', icon: Activity },
  ];

  return (
    <div className="flex h-screen bg-[#f3f4f6] font-sans overflow-hidden">
      
      {/* Dark Sidebar */}
      <aside className="w-[260px] bg-[#0f172a] flex flex-col justify-between shrink-0">
        <div>
          {/* Branding */}
          <div className="flex items-center gap-3 px-6 py-8">
            <div className="bg-[#0d9488] rounded-xl p-2 text-white flex items-center justify-center">
              <Plus size={24} strokeWidth={3} />
            </div>
            <div>
              <h1 className="text-white font-bold text-[17px] leading-tight">Hybrid Adaptive</h1>
              <p className="text-[#0d9488] text-[11px] font-bold uppercase tracking-widest mt-0.5">Security Platform</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="px-4 space-y-1">
            {navItems.map((item) => {
              const isActive = location.pathname.includes(item.path);
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  to={item.path}
                  className={`flex items-center justify-between px-4 py-3 rounded-lg transition-all ${
                    isActive 
                      ? 'bg-[#1e293b] text-white relative before:absolute before:left-0 before:top-2 before:bottom-2 before:w-1 before:bg-[#0d9488] before:rounded-r-md' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-[#1e293b]/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                    <span className={`text-sm ${isActive ? 'font-semibold' : 'font-medium'}`}>
                      {item.name}
                    </span>
                  </div>
                  {item.badge && (
                    <span className="bg-[#ef4444] text-white text-[10px] font-bold px-2 py-0.5 rounded-full">
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Bottom Section */}
        <div className="px-4 pb-6 space-y-2">
          <button className="flex items-center gap-3 px-4 py-2 w-full text-slate-400 hover:text-white transition-colors">
            <HelpCircle size={18} />
            <span className="text-sm font-medium">Help center</span>
          </button>
          <button className="flex items-center gap-3 px-4 py-2 w-full text-slate-400 hover:text-white transition-colors">
            <Settings size={18} />
            <span className="text-sm font-medium">Settings</span>
          </button>
          
          <div className="mt-4 pt-4 border-t border-slate-700/50 flex items-center justify-between px-2 cursor-pointer hover:bg-[#1e293b] p-2 rounded-lg transition-colors">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-slate-700 text-white flex items-center justify-center text-xs font-bold">
                AR
              </div>
              <div className="text-left">
                <p className="text-sm font-semibold text-white leading-tight">Aakruthi Rao</p>
                <p className="text-xs text-slate-400 font-medium">Administrator</p>
              </div>
            </div>
            <MoreVertical size={16} className="text-slate-500" />
          </div>
        </div>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-full overflow-hidden">
        {/* Top Header */}
        <header className="bg-white border-b border-gray-200 px-8 py-4 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-slate-500 font-medium">Security Console</span>
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">Overview</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-[#f0fdf4] border border-[#bbf7d0] rounded-full">
              <div className="w-2 h-2 rounded-full bg-[#22c55e]"></div>
              <span className="text-sm font-medium text-[#15803d]">All systems operational</span>
            </div>
            <button className="p-2 text-slate-400 hover:bg-slate-50 border border-gray-200 rounded-lg">
              <Activity size={18} />
            </button>
            <button className="bg-[#0d9488] hover:bg-[#0f766e] text-white px-4 py-2 rounded-lg text-sm font-semibold transition-colors flex items-center gap-2">
              <Plus size={16} strokeWidth={3} />
              Analyze prompt
            </button>
          </div>
        </header>

        {/* Scrollable Page Content */}
        <div className="flex-1 overflow-y-auto bg-[#fafafa]">
          <Outlet />
        </div>
      </main>
    </div>
  );
}