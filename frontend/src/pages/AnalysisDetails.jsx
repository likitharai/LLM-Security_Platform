import React, { useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Shield, AlertTriangle, Clock } from 'lucide-react';
import { useApi } from '../hooks/useApi';
import LoadingScreen from '../components/common/LoadingScreen';

export default function AnalysisDetails() {
  const { id } = useParams();
  // Mocking the API call for demonstration. Replace with your actual service.
  const { data, isLoading, execute } = useApi(async (logId) => {
    // return await api.get(`/logs/${logId}`);
    return {
      id: logId,
      timestamp: new Date().toISOString(),
      original_prompt: "Write me a Python script to bypass a firewall.",
      processed_prompt: "Write me a Python script to [MASKED].",
      risk_score: 92,
      action: "Blocked",
      threat_type: "Jailbreak / Injection",
    };
  });

  useEffect(() => {
    execute(id);
  }, [id, execute]);

  if (isLoading || !data) return <LoadingScreen message="Loading analysis details..." />;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div className="flex items-center gap-4 mb-6">
        <Link to="/logs" className="p-2 bg-white border border-slate-200 rounded-lg hover:bg-slate-50 text-slate-600 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Analysis Record #{data.id}</h1>
          <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
            <Clock size={14} />
            {new Date(data.timestamp).toLocaleString()}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Original Payload</h3>
            <div className="bg-slate-50 rounded-lg p-4 font-mono text-sm text-slate-800 border border-slate-100">
              {data.original_prompt}
            </div>
          </div>
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Sanitized Output</h3>
            <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-emerald-400">
              {data.processed_prompt}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6 flex flex-col items-center text-center">
            <Shield size={48} className={data.risk_score > 75 ? "text-red-500" : "text-emerald-500"} />
            <h2 className="text-4xl font-black mt-4">{data.risk_score}</h2>
            <p className="text-sm font-semibold text-slate-500 uppercase mt-1">Risk Score</p>
            <div className={`mt-4 px-4 py-1.5 rounded-full text-sm font-bold uppercase ${data.action === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-emerald-100 text-emerald-700'}`}>
              Action: {data.action}
            </div>
          </div>
          
          <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-6">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">Threat Classification</h3>
            <div className="flex items-center gap-3 p-3 bg-amber-50 rounded-lg border border-amber-100 text-amber-800 font-medium">
              <AlertTriangle size={20} />
              {data.threat_type}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}