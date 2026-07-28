import React, { useState } from 'react';
import { Shield, Zap, Loader2, AlertTriangle, CheckCircle } from 'lucide-react';

export default function AnalyzePrompt() {
  const [prompt, setPrompt] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState(null);

  const handleAnalyze = async () => {
    if (!prompt.trim()) return;
    
    setIsAnalyzing(true);
    setResult(null);

    try {
      // Calls your FastAPI backend
      const response = await fetch('http://localhost:8000/api/v1/analysis/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          prompt_text: prompt,
          source_system: 'MedIntel Web UI',
          user_id: 'dr_smith_123'
        })
      });

      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error("Analysis failed:", error);
      // Fallback for UI testing if backend is offline
      setResult({
        risk_score: 0.95,
        decision: "BLOCK",
        primary_threat: "Prompt Injection",
        flagged_entities: ["ignore previous instructions"],
      });
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      {/* ... (Keep the Header Section exactly as it was) ... */}
      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-[#0d9488] text-xs font-bold tracking-widest uppercase">Real-time Security Test</span>
        </div>
        <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Analyze a prompt</h2>
        <p className="text-slate-500 mt-1">Test any healthcare LLM prompt against all active security layers.</p>
      </div>

      <div className="grid grid-cols-2 gap-6 h-[500px]">
        {/* Left Column: Input */}
        <div className="bg-white rounded-xl border border-gray-200 shadow-sm flex flex-col">
          {/* ... (Keep header of left column) ... */}
          <div className="p-6 flex-1 flex flex-col">
            <textarea 
              className="flex-1 w-full resize-none outline-none text-slate-700 text-sm placeholder:text-slate-400"
              placeholder="Paste a prompt here..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            
            <button 
              onClick={handleAnalyze}
              disabled={isAnalyzing || !prompt.trim()}
              className="mt-4 w-full bg-[#94baba] hover:bg-[#0d9488] disabled:bg-slate-300 text-white py-3 rounded-lg text-sm font-bold transition-colors flex justify-center items-center gap-2"
            >
              {isAnalyzing ? <Loader2 size={18} className="animate-spin" /> : null}
              {isAnalyzing ? 'Analyzing...' : 'Analyze prompt →'}
            </button>
          </div>
        </div>

        {/* Right Column: Dynamic Results */}
        <div className={`rounded-xl border ${result ? 'bg-white border-gray-200 shadow-sm' : 'bg-slate-50 border-gray-200 border-dashed'} flex flex-col items-center justify-center text-center p-8`}>
          {!result ? (
            <>
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm border border-gray-100 mb-4">
                <Zap size={24} className="text-[#0d9488]" />
              </div>
              <h3 className="text-lg font-bold text-slate-800">Ready to analyze</h3>
              <p className="text-sm text-slate-500 max-w-xs mt-2">
                Your risk score, policy action, detected entities, and explanation will appear here.
              </p>
            </>
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center space-y-4">
              <div className={`w-20 h-20 rounded-full flex items-center justify-center ${result.decision === 'BLOCK' ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'}`}>
                {result.decision === 'BLOCK' ? <AlertTriangle size={36} /> : <CheckCircle size={36} />}
              </div>
              <h3 className="text-2xl font-bold text-slate-900">{result.decision}</h3>
              <p className="text-sm text-slate-500 font-medium">Risk Score: <span className="font-bold text-slate-900">{result.risk_score}</span></p>
              
              <div className="bg-slate-50 p-4 rounded-lg border border-slate-100 w-full text-left mt-4">
                <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Threat Detected</p>
                <p className="text-sm font-medium text-slate-800">{result.primary_threat || "None detected"}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}