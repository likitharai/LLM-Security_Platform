import React, { useState, useEffect } from 'react';
import { Shield, Lock, FileText, CheckCircle2, Save, Loader2, AlertCircle } from 'lucide-react';
import { policyService } from '../services/policyService';

// Default fallback policies used if the database is initially empty or offline
const DEFAULT_POLICIES = {
  phiMasking: {
    enabled: true,
    name: 'PHI & PII Masking',
    desc: 'Automatically redact SSNs, Patient IDs, emails, and phone numbers before they reach the LLM.',
    action: 'MASK',
    category: 'privacy'
  },
  clinicalData: {
    enabled: false,
    name: 'Block Clinical Diagnoses',
    desc: 'Prevent the LLM from processing highly sensitive raw clinical notes without anonymization.',
    action: 'BLOCK',
    category: 'privacy'
  },
  promptInjection: {
    enabled: true,
    name: 'Block Prompt Injections',
    desc: 'Detect and drop requests attempting to jailbreak the model or override system instructions.',
    action: 'BLOCK',
    category: 'security'
  },
  roleplay: {
    enabled: true,
    name: 'Restrict Persona Roleplay',
    desc: 'Prevent the model from adopting unauthorized personas (e.g., "Act as a malicious hacker").',
    action: 'BLOCK',
    category: 'security'
  },
  toxicContent: {
    enabled: true,
    name: 'Toxicity Filter',
    desc: 'Block profanity, hate speech, and abusive language in both prompts and responses.',
    action: 'BLOCK',
    category: 'content'
  },
  medicalAdvice: {
    enabled: false,
    name: 'Strict Medical Advice Filter',
    desc: 'Block the model from giving direct medical diagnoses or treatment plans to end-users.',
    action: 'BLOCK',
    category: 'content'
  }
};

export default function PolicyManagement() {
  const [policies, setPolicies] = useState(DEFAULT_POLICIES);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState(null);
  const [errorMessage, setErrorMessage] = useState(null);

  // 1. Fetch active policies from the API on mount
  useEffect(() => {
    const fetchPolicies = async () => {
      setIsLoading(true);
      setErrorMessage(null);
      try {
        const data = await policyService.getPolicies();
        
        // If policies exist in DB, transform array to local state object
        if (data && data.length > 0) {
          const mappedPolicies = { ...DEFAULT_POLICIES };
          
          data.forEach((p) => {
            mappedPolicies[p.key] = {
              enabled: p.enabled,
              name: p.name,
              desc: p.description || DEFAULT_POLICIES[p.key]?.desc || '',
              action: p.action,
              category: p.category
            };
          });
          
          setPolicies(mappedPolicies);
        }
      } catch (error) {
        console.error("Failed to load backend policies, using defaults:", error);
        setErrorMessage("Could not connect to API. Changes will remain local.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPolicies();
  }, []);

  // 2. Toggle policy enabled state locally
  const handleToggle = (key) => {
    setPolicies(prev => ({
      ...prev,
      [key]: {
        ...prev[key],
        enabled: !prev[key].enabled
      }
    }));
  };

  // 3. Save modified policies back to the FastAPI database
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);
    try {
      // Transform local object state into payload array for PUT /policies/
      const payload = Object.entries(policies).map(([key, item]) => ({
        key: key,
        name: item.name,
        description: item.desc,
        action: item.action,
        category: item.category,
        enabled: item.enabled
      }));

      await policyService.updatePolicies(payload);
      setLastSaved(new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' }));
    } catch (error) {
      console.error("Failed to save policies:", error);
      setErrorMessage("Failed to persist policies to the database.");
    } finally {
      setIsSaving(false);
    }
  };

  // Helper UI component: Switch Toggle Button
  const ToggleSwitch = ({ enabled, onClick }) => (
    <button
      onClick={onClick}
      className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-[#0d9488] focus:ring-offset-2 ${
        enabled ? 'bg-[#0d9488]' : 'bg-slate-300'
      }`}
    >
      <span
        className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
          enabled ? 'translate-x-6' : 'translate-x-1'
        }`}
      />
    </button>
  );

  // Helper UI component: Individual Policy Row
  const PolicyRow = ({ policyKey, policy }) => (
    <div className="flex items-center justify-between p-6 border-b border-gray-100 last:border-0 hover:bg-slate-50/50 transition-colors">
      <div className="flex-1 pr-8">
        <div className="flex items-center gap-3 mb-1">
          <h4 className="text-base font-bold text-slate-800">{policy.name}</h4>
          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
            policy.action === 'BLOCK' ? 'bg-red-100 text-red-700 border border-red-200' :
            policy.action === 'MASK' ? 'bg-purple-100 text-purple-700 border border-purple-200' :
            'bg-slate-100 text-slate-600 border border-slate-200'
          }`}>
            Action: {policy.action}
          </span>
        </div>
        <p className="text-sm text-slate-500">{policy.desc}</p>
      </div>
      <div className="flex items-center gap-4">
        <span className={`text-sm font-semibold ${policy.enabled ? 'text-[#0d9488]' : 'text-slate-400'}`}>
          {policy.enabled ? 'Active' : 'Disabled'}
        </span>
        <ToggleSwitch enabled={policy.enabled} onClick={() => handleToggle(policyKey)} />
      </div>
    </div>
  );

  if (isLoading) {
    return (
      <div className="flex h-[80vh] items-center justify-center text-slate-500 flex-col gap-4">
        <Loader2 size={32} className="animate-spin text-[#0d9488]" />
        <p className="font-medium">Loading security policies...</p>
      </div>
    );
  }

  return (
    <div className="p-8 max-w-[1400px] mx-auto space-y-8">
      
      {/* Header Bar */}
      <div className="flex justify-between items-end border-b border-slate-200 pb-6">
        <div>
          <h2 className="text-3xl font-bold text-slate-900 tracking-tight">Policy Management</h2>
          <p className="text-slate-500 mt-1">Configure active security guardrails and data privacy rules.</p>
        </div>
        <div className="flex items-center gap-4">
          {errorMessage && (
            <span className="text-sm text-red-600 flex items-center gap-1 font-medium bg-red-50 px-3 py-1.5 rounded-md border border-red-200">
              <AlertCircle size={16} />
              {errorMessage}
            </span>
          )}
          {lastSaved && !errorMessage && (
            <span className="text-sm text-slate-500 flex items-center gap-1">
              <CheckCircle2 size={16} className="text-green-500" />
              Last saved: {lastSaved}
            </span>
          )}
          <button 
            onClick={handleSave}
            disabled={isSaving}
            className="bg-[#0d9488] hover:bg-teal-700 disabled:bg-teal-300 text-white px-6 py-2.5 rounded-lg text-sm font-bold transition-colors flex items-center gap-2 shadow-sm"
          >
            {isSaving ? <Loader2 size={18} className="animate-spin" /> : <Save size={18} />}
            {isSaving ? 'Saving...' : 'Save Policies'}
          </button>
        </div>
      </div>

      {/* Policy Categories */}
      <div className="space-y-8">
        
        {/* Section 1: Privacy & Compliance */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Lock size={20} className="text-[#0d9488]" />
            <h3 className="text-lg font-bold text-slate-900">Privacy & Compliance</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {Object.entries(policies)
              .filter(([_, p]) => p.category === 'privacy')
              .map(([key, policy]) => (
                <PolicyRow key={key} policyKey={key} policy={policy} />
            ))}
          </div>
        </section>

        {/* Section 2: Adversarial Threats */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Shield size={20} className="text-[#0d9488]" />
            <h3 className="text-lg font-bold text-slate-900">Adversarial Threats</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {Object.entries(policies)
              .filter(([_, p]) => p.category === 'security')
              .map(([key, policy]) => (
                <PolicyRow key={key} policyKey={key} policy={policy} />
            ))}
          </div>
        </section>

        {/* Section 3: Content Safety */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <FileText size={20} className="text-[#0d9488]" />
            <h3 className="text-lg font-bold text-slate-900">Content Safety</h3>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
            {Object.entries(policies)
              .filter(([_, p]) => p.category === 'content')
              .map(([key, policy]) => (
                <PolicyRow key={key} policyKey={key} policy={policy} />
            ))}
          </div>
        </section>

      </div>
    </div>
  );
}