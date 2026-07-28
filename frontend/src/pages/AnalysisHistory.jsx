import React, { useState, useEffect } from 'react';
import { Loader2, AlertTriangle, CheckCircle, ShieldAlert } from 'lucide-react';
import { analysisService } from '../services/analysisService';

export default function AnalysisHistory() {
  const [logs, setLogs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        // Fetch up to 50 of the most recent prompt analyses
        const data = await analysisService.getThreatLogs(50);
        setLogs(data);
      } catch (error) {
        console.error("Failed to fetch logs:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLogs();
  }, []);

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-6">
      <div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Analysis History</h2>
        <p className="text-slate-500 mt-1">Audit trail of all prompts processed by the security gateway.</p>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-200 text-xs uppercase tracking-wider text-slate-500 font-bold">
                <th className="p-4">Timestamp</th>
                <th className="p-4">User ID</th>
                <th className="p-4">Prompt Excerpt</th>
                <th className="p-4">Risk Score</th>
                <th className="p-4">Decision</th>
                <th className="p-4">Primary Threat</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {isLoading ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    <Loader2 size={24} className="animate-spin mx-auto mb-2" />
                    Loading history...
                  </td>
                </tr>
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="6" className="p-8 text-center text-slate-500">
                    No analysis logs found. Go analyze a prompt first!
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log.id} className="hover:bg-slate-50 transition-colors">
                    <td className="p-4 text-sm text-slate-600 whitespace-nowrap">
                      {new Date(log.timestamp).toLocaleString()}
                    </td>
                    <td className="p-4 text-sm font-medium text-slate-900">{log.user_id}</td>
                    <td className="p-4 text-sm text-slate-600 max-w-xs truncate">
                      {log.prompt_text}
                    </td>
                    <td className="p-4">
                      <span className={`text-sm font-bold ${log.risk_score > 0.7 ? 'text-red-600' : 'text-slate-900'}`}>
                        {log.risk_score.toFixed(2)}
                      </span>
                    </td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold ${
                        log.decision === 'BLOCKED' ? 'bg-red-100 text-red-700' : 
                        log.decision === 'MASKED' ? 'bg-purple-100 text-purple-700' : 
                        'bg-green-100 text-green-700'
                      }`}>
                        {log.decision === 'BLOCKED' && <AlertTriangle size={12} />}
                        {log.decision === 'MASKED' && <ShieldAlert size={12} />}
                        {log.decision === 'ALLOWED' && <CheckCircle size={12} />}
                        {log.decision}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-slate-600">
                      {log.primary_threat || "None"}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}