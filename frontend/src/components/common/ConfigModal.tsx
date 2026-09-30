import React from 'react';
import { X, Key, Cpu, ShieldCheck, ExternalLink, CheckCircle2, AlertTriangle } from 'lucide-react';
import { SystemStatus } from '../../types';

interface ConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  status: SystemStatus | null;
}

export const ConfigModal: React.FC<ConfigModalProps> = ({ isOpen, onClose, status }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div 
        className="w-full max-w-lg rounded-2xl bg-slate-900 border border-slate-700/60 shadow-2xl p-6 relative overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-lg text-slate-400 hover:text-slate-200 hover:bg-slate-800 transition-colors"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center gap-3 mb-5">
          <div className="w-10 h-10 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400">
            <Key className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Google Gemini Configuration</h3>
            <p className="text-xs text-slate-400">Security & Backend AI Architecture</p>
          </div>
        </div>

        {/* Current Status Box */}
        <div className="rounded-xl bg-slate-800/60 border border-slate-700/50 p-4 mb-5">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-medium text-slate-400">Active Model</span>
            <span className="px-2.5 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold flex items-center gap-1.5 border border-indigo-500/30">
              <Cpu className="w-3.5 h-3.5" />
              {status?.gemini_model || 'gemini-2.5-flash'}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-400">API Connection</span>
            {status?.gemini_configured ? (
              <span className="text-emerald-400 text-xs font-medium flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                Live Gemini Connected
              </span>
            ) : (
              <span className="text-amber-400 text-xs font-medium flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4 text-amber-400" />
                Curated Demo Mode (Add API Key)
              </span>
            )}
          </div>
        </div>

        {/* Security Highlight */}
        <div className="flex items-start gap-3 rounded-xl bg-emerald-950/20 border border-emerald-500/20 p-3.5 mb-5 text-emerald-200">
          <ShieldCheck className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />
          <p className="text-xs leading-relaxed">
            <strong>Security Guardrail Active:</strong> EduGenie uses a strict <strong>Frontend → FastAPI Backend → Gemini API</strong> architecture. The API key is stored exclusively on the backend server and never leaked into client JavaScript.
          </p>
        </div>

        {/* How to configure */}
        <div className="text-xs text-slate-300 space-y-2 mb-6">
          <h4 className="font-semibold text-slate-200">To enable your own live Gemini API:</h4>
          <ol className="list-decimal list-inside space-y-1.5 text-slate-400 pl-1">
            <li>Get a free key from <a href="https://aistudio.google.com/" target="_blank" rel="noreferrer" className="text-indigo-400 underline inline-flex items-center gap-0.5">Google AI Studio <ExternalLink className="w-3 h-3" /></a></li>
            <li>Open the project root directory <code className="bg-slate-800 text-indigo-300 px-1 py-0.5 rounded text-[11px]">.env</code> file</li>
            <li>Set: <code className="bg-slate-800 text-indigo-300 px-1 py-0.5 rounded text-[11px]">GEMINI_API_KEY=your_key_here</code></li>
            <li>Restart the backend server and refresh.</li>
          </ol>
        </div>

        <button
          onClick={onClose}
          className="w-full py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm transition-colors shadow-lg shadow-indigo-600/20"
        >
          Got it
        </button>
      </div>
    </div>
  );
};
