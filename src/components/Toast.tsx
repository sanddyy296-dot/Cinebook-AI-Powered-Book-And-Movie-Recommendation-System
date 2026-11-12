import React from 'react';
import { useApp } from '../context/AppContext';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map(toast => {
        const isSuccess = toast.type === 'success';
        const isError = toast.type === 'error';
        const isWarning = toast.type === 'warning';

        return (
          <div
            key={toast.id}
            className={`pointer-events-auto flex items-center justify-between p-3.5 rounded-xl border shadow-xl backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5 ${
              isSuccess
                ? 'bg-slate-900/90 border-emerald-500/40 text-emerald-200'
                : isError
                ? 'bg-slate-900/90 border-rose-500/40 text-rose-200'
                : isWarning
                ? 'bg-slate-900/90 border-amber-500/40 text-amber-200'
                : 'bg-slate-900/90 border-cyan-500/40 text-cyan-200'
            }`}
          >
            <div className="flex items-center gap-3">
              {isSuccess && <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />}
              {isError && <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />}
              {isWarning && <AlertCircle className="w-5 h-5 text-amber-400 shrink-0" />}
              {!isSuccess && !isError && !isWarning && <Info className="w-5 h-5 text-cyan-400 shrink-0" />}
              <span className="text-sm font-medium text-slate-100">{toast.message}</span>
            </div>
            <button
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-white/10 rounded-lg text-slate-400 hover:text-white transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
