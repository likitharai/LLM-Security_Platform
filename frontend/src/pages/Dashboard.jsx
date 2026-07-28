import React, { useState, useEffect } from 'react';
import { Shield, ShieldAlert, Activity, AlertTriangle, Loader2 } from 'lucide-react';
import { 
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { analysisService } from '../services/analysisService';

// Chart color palette matching the UI
const COLORS = {
  ALLOWED: '#10b981', // emerald-500
  BLOCKED: '#ef4444', // red-500
  MASKED: '#a855f7',  // purple-500
};

export default function Dashboard() {
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    total: 0,
    blocked: 0,
    masked: 0,
    avgRisk: 0,
  });
  const [trendData, setTrendData] = useState([]);
  const [distributionData, setDistributionData] = useState([]);

  useEffect(() => {
    const fetchAndProcessData = async () => {
      try {
        // Fetch the 100 most recent logs from your backend
        const logs = await analysisService.getThreatLogs(100);
        
        if (!logs || logs.length === 0) {
          setIsLoading(false);
          return;
        }

        // 1. Calculate KPIs
        const total = logs.length;
        const blocked = logs.filter(l => l.decision === 'BLOCKED').length;
        const masked = logs.filter(l => l.decision === 'MASKED').length;
        const totalRisk = logs.reduce((sum, l) => sum + l.risk_score, 0);
        
        setStats({
          total,
          blocked,
          masked,
          avgRisk: (totalRisk / total).toFixed(2)
        });

        // 2. Prepare Pie Chart Data (Distribution)
        const allowed = total - blocked - masked;
        setDistributionData([
          { name: 'Allowed', value: allowed, color: COLORS.ALLOWED },
          { name: 'Masked (PHI)', value: masked, color: COLORS.MASKED },
          { name: 'Blocked', value: blocked, color: COLORS.BLOCKED }
        ]);

        // 3. Prepare Area Chart Data (Risk Trends - sorting chronologically)
        const sortedLogs = [...logs].sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
        const formattedTrends = sortedLogs.map((log, index) => ({
          name: `Req ${index + 1}`,
          risk: parseFloat(log.risk_score.toFixed(2)),
          time: new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        })).slice(-20); // Show last 20 requests for a clean chart
        
        setTrendData(formattedTrends);

      } catch (error) {
        console.error("Failed to load dashboard data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchAndProcessData();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-500 flex-col gap-4">
        <Loader2 size={32} className="animate-spin text-[#0d9488]" />
        <p className="font-medium">Loading security metrics...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      
      {/* Header */}
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Security Overview</h2>
          <p className="text-slate-500 mt-1">Real-time system health and threat analytics.</p>
        </div>
        <div className="flex items-center gap-2 bg-green-50 text-green-700 px-3 py-1.5 rounded-lg border border-green-200 text-sm font-bold">
          <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
          Gateway Active
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Total Evaluated</p>
            <Activity size={20} className="text-[#0d9488]" />
          </div>
          <h3 className="text-3xl font-bold text-slate-900">{stats.total}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Threats Blocked</p>
            <ShieldAlert size={20} className="text-red-500" />
          </div>
          <h3 className="text-3xl font-bold text-red-600">{stats.blocked}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">PHI Masked</p>
            <Shield size={20} className="text-purple-500" />
          </div>
          <h3 className="text-3xl font-bold text-purple-600">{stats.masked}</h3>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col justify-between">
          <div className="flex justify-between items-start mb-4">
            <p className="text-sm font-bold text-slate-500 uppercase tracking-wider">Avg Risk Score</p>
            <AlertTriangle size={20} className={stats.avgRisk > 0.5 ? "text-amber-500" : "text-green-500"} />
          </div>
          <h3 className="text-3xl font-bold text-slate-900">{stats.avgRisk}</h3>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-3 gap-6 h-[400px]">
        
        {/* Risk Trend Line Chart */}
        <div className="col-span-2 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-6 uppercase tracking-wider">Risk Score Trends (Recent Prompts)</h3>
          <div className="flex-1 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={trendData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRisk" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#0d9488" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#0d9488" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e5e7eb" />
                <XAxis dataKey="time" axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} />
                <YAxis axisLine={false} tickLine={false} tick={{fill: '#94a3b8', fontSize: 12}} domain={[0, 1]} />
                <Tooltip 
                  contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                />
                <Area type="monotone" dataKey="risk" stroke="#0d9488" strokeWidth={3} fillOpacity={1} fill="url(#colorRisk)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Policy Action Distribution */}
        <div className="col-span-1 bg-white p-6 rounded-xl border border-gray-200 shadow-sm flex flex-col">
          <h3 className="text-sm font-bold text-slate-800 mb-2 uppercase tracking-wider">Policy Actions</h3>
          <div className="flex-1 w-full flex items-center justify-center">
            {stats.total === 0 ? (
              <p className="text-slate-400 text-sm">No data to display</p>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={distributionData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                    stroke="none"
                  >
                    {distributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    itemStyle={{ fontWeight: 'bold' }}
                  />
                  <Legend verticalAlign="bottom" height={36} iconType="circle" />
                </PieChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}