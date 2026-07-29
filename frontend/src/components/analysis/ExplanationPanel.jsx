import React from 'react';
import { ShieldAlert, Fingerprint, Network, Clock, CheckCircle } from 'lucide-react';

export default function ExplanationPanel({ results }) {
  if (!results) return null;

  const { security_decision, analysis, metrics, processed_prompt } = results;
  const { score_breakdown } = security_decision;

  const getStatusColor = (score) => {
    if (score >= 75) return 'text-red-600 bg-red-50 border-red-200';
    if (score >= 45) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-emerald-600 bg-emerald-50 border-emerald-200';
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden flex flex-col h-full">
      {/* Header Section */}
      <div className="p-6 border-b border-slate-100 bg-slate-50/50">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold text-slate-900">Security Explanation</h3>
          <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getStatusColor(security_decision.risk_score)} uppercase tracking-wider`}>
            Action: {security_decision.action}
          </span>
        </div>
        <div className="flex items-end gap-3">
          <span className="text-5xl font-light text-slate-900">{security_decision.risk_score}</span>
          <span className="text-sm font-medium text-slate-500 mb-1 pb-1">/ 100 Overall Risk</span>
        </div>
      </div>

      {/* Breakdown Metrics */}
      <div className="p-6 flex-1 overflow-y-auto space-y-6">
        
        {/* DeBERTa Intent Risk */}
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-indigo-50 text-indigo-600 rounded-lg shrink-0">
            <ShieldAlert size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-semibold text-slate-900">Intent Classification</h4>
              <span className="text-xs font-mono font-medium text-slate-500">{score_breakdown.classifier_risk}/100</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Analyzed via DeBERTa-v3 Transformer</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
              <div className="bg-indigo-500 h-1.5 rounded-full" style={{ width: `${score_breakdown.classifier_risk}%` }}></div>
            </div>
            <p className="text-xs font-medium text-slate-700 bg-slate-50 p-2 rounded">
              Detected Category: <span className="text-indigo-600">{analysis.classification.category}</span>
            </p>
          </div>
        </div>

        {/* BERT-NER PHI Risk */}
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-purple-50 text-purple-600 rounded-lg shrink-0">
            <Fingerprint size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-semibold text-slate-900">Data Privacy (NER)</h4>
              <span className="text-xs font-mono font-medium text-slate-500">{score_breakdown.phi_risk}/100</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Analyzed via BERT-base-NER</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
              <div className="bg-purple-500 h-1.5 rounded-full" style={{ width: `${score_breakdown.phi_risk}%` }}></div>
            </div>
            {analysis.entities.length > 0 ? (
              <div className="flex flex-wrap gap-2 mt-2">
                {analysis.entities.map((ent, i) => (
                  <span key={i} className="text-[10px] font-semibold px-2 py-1 bg-purple-50 text-purple-700 rounded border border-purple-100">
                    {ent.entity} ({(ent.confidence * 100).toFixed(1)}%)
                  </span>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 flex items-center gap-1 mt-2">
                <CheckCircle size={12} className="text-emerald-500" /> No sensitive entities detected
              </p>
            )}
          </div>
        </div>

        {/* MiniLM Vector Similarity */}
        <div className="flex items-start gap-4">
          <div className="p-2.5 bg-blue-50 text-blue-600 rounded-lg shrink-0">
            <Network size={20} />
          </div>
          <div className="flex-1">
            <div className="flex justify-between items-center mb-1">
              <h4 className="text-sm font-semibold text-slate-900">Vector Similarity</h4>
              <span className="text-xs font-mono font-medium text-slate-500">{score_breakdown.similarity_risk}/100</span>
            </div>
            <p className="text-xs text-slate-500 mb-2">Analyzed against adversarial embeddings</p>
            <div className="w-full bg-slate-100 rounded-full h-1.5 mb-2">
              <div className="bg-blue-500 h-1.5 rounded-full" style={{ width: `${score_breakdown.similarity_risk}%` }}></div>
            </div>
          </div>
        </div>

      </div>

      {/* Footer Metrics */}
      <div className="p-4 bg-slate-50 border-t border-slate-100 flex justify-between items-center text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Clock size={14} /> Pipeline Latency: <span className="font-mono font-medium text-slate-700">{metrics.latency_ms}ms</span>
        </div>
        <div>
          {metrics.models_used.length} Models Active
        </div>
      </div>
    </div>
  );
}