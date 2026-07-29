import React, { useState } from 'react';
import { UploadCloud, Play, FileText, CheckCircle } from 'lucide-react';

export default function BatchAnalyzer() {
  const [file, setFile] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [progress, setProgress] = useState(0);

  const handleUpload = (e) => {
    e.preventDefault();
    if (!file) return;
    setIsProcessing(true);
    
    // Simulate batch processing
    let current = 0;
    const interval = setInterval(() => {
      current += 10;
      setProgress(current);
      if (current >= 100) {
        clearInterval(interval);
        setIsProcessing(false);
      }
    }, 500);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold text-slate-900">Batch Analysis Job</h1>
      <p className="text-slate-500">Upload a CSV or JSON file containing prompts to analyze them in bulk.</p>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-8">
        <div className="border-2 border-dashed border-slate-300 rounded-xl p-10 flex flex-col items-center justify-center text-center bg-slate-50 hover:bg-slate-100 transition-colors cursor-pointer">
          <UploadCloud size={48} className="text-indigo-400 mb-4" />
          <h3 className="text-lg font-semibold text-slate-700">Drag & Drop your dataset here</h3>
          <p className="text-sm text-slate-500 mt-2">Supports .csv, .json (Max 10MB)</p>
          <input 
            type="file" 
            className="hidden" 
            id="file-upload" 
            accept=".csv,.json"
            onChange={(e) => setFile(e.target.files[0])}
          />
          <label htmlFor="file-upload" className="mt-6 px-6 py-2 bg-white border border-slate-300 rounded-lg text-sm font-semibold text-slate-700 hover:bg-slate-50 cursor-pointer shadow-sm">
            Browse Files
          </label>
        </div>

        {file && (
          <div className="mt-6 p-4 bg-indigo-50 border border-indigo-100 rounded-lg flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileText className="text-indigo-600" size={24} />
              <div>
                <p className="text-sm font-semibold text-indigo-900">{file.name}</p>
                <p className="text-xs text-indigo-700">{(file.size / 1024).toFixed(2)} KB</p>
              </div>
            </div>
            <button 
              onClick={handleUpload}
              disabled={isProcessing || progress === 100}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50"
            >
              {isProcessing ? 'Processing...' : progress === 100 ? 'Completed' : 'Start Job'}
              {!isProcessing && progress !== 100 && <Play size={16} />}
            </button>
          </div>
        )}

        {isProcessing || progress > 0 ? (
          <div className="mt-6 space-y-2">
            <div className="flex justify-between text-sm font-semibold text-slate-700">
              <span>Analysis Progress</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-slate-100 rounded-full h-2">
              <div className="bg-indigo-600 h-2 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
            </div>
          </div>
        ) : null}

        {progress === 100 && (
          <div className="mt-6 p-4 bg-emerald-50 border border-emerald-200 rounded-lg flex items-center gap-3 text-emerald-800">
            <CheckCircle size={20} className="text-emerald-500" />
            <span className="text-sm font-semibold">Batch analysis complete. Results have been appended to Threat Logs.</span>
          </div>
        )}
      </div>
    </div>
  );
}