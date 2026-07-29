import React from 'react';
import { Search, Bell, User, Settings } from 'lucide-react';
import { useLocation } from 'react-router-dom';

export default function Header() {
  const location = useLocation();
  
  // Create a clean title based on the current route
  const getPageTitle = () => {
    const path = location.pathname.split('/')[1];
    if (!path) return 'Overview';
    return path.charAt(0).toUpperCase() + path.slice(1).replace('-', ' ');
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 flex items-center justify-between px-6 sticky top-0 z-30">
      <div className="flex items-center">
        <h1 className="text-xl font-bold text-slate-800">{getPageTitle()}</h1>
      </div>

      <div className="flex items-center gap-4">
        {/* Search Bar */}
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
          <input 
            type="text" 
            placeholder="Search logs, policies..." 
            className="pl-9 pr-4 py-2 bg-slate-100 border-transparent rounded-lg text-sm focus:bg-white focus:border-indigo-500 focus:ring-2 focus:ring-indigo-200 transition-all w-64 outline-none"
          />
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2 border-l border-slate-200 pl-4 ml-2">
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white"></span>
          </button>
          
          <button className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors">
            <Settings size={20} />
          </button>

          {/* User Profile */}
          <button className="ml-2 flex items-center gap-2 p-1 pr-3 bg-slate-50 border border-slate-200 rounded-full hover:bg-slate-100 transition-colors">
            <div className="w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center shadow-inner">
              <User size={16} />
            </div>
            <span className="text-sm font-semibold text-slate-700 hidden sm:block">Admin</span>
          </button>
        </div>
      </div>
    </header>
  );
}