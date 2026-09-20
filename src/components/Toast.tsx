import React from 'react';
import { Check, X, Info, AlertTriangle } from 'lucide-react';
import { ToastMessage } from '../types';

interface ToastProps {
  toast: ToastMessage | null;
  onClose: () => void;
}

export const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
  if (!toast) return null;

  return (
    <div
      id="toast-notification"
      role="alert"
      className="fixed bottom-6 right-6 z-50 max-w-sm rounded-2xl bg-[#0b0e16]/95 backdrop-blur-md border border-emerald-500/30 p-4 shadow-[0_10px_35px_rgba(0,0,0,0.8)] flex items-start gap-3.5 transition-all duration-300 animate-in fade-in slide-in-from-bottom-5"
      style={{
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.7), 0 0 20px rgba(16, 185, 129, 0.15)'
      }}
    >
      {/* Green Check Circle Icon - Matches screenshot */}
      <div className="w-8 h-8 rounded-full bg-emerald-500/15 border border-emerald-500/40 flex items-center justify-center shrink-0 text-emerald-400 mt-0.5">
        {toast.type === 'info' ? (
          <Info className="w-4 h-4 text-blue-400" />
        ) : toast.type === 'warning' ? (
          <AlertTriangle className="w-4 h-4 text-amber-400" />
        ) : (
          <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
        )}
      </div>

      {/* Content */}
      <div className="flex-1 pr-1">
        <h4 className="text-sm font-semibold text-white tracking-tight">
          {toast.title}
        </h4>
        <p className="text-xs text-slate-400 mt-0.5 leading-snug">
          {toast.description}
        </p>
      </div>

      {/* Close button */}
      <button
        id="btn-close-toast"
        onClick={onClose}
        className="text-slate-500 hover:text-slate-200 p-1 rounded-lg hover:bg-white/5 transition-colors"
        aria-label="Kapat"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
};
