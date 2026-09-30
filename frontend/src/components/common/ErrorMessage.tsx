import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry?: () => void;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="rounded-xl bg-red-950/40 border border-red-500/30 p-4 text-red-200 flex flex-col sm:flex-row sm:items-center justify-between gap-4 my-4 animate-fade-in shadow-md">
      <div className="flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-red-400 mt-0.5 flex-shrink-0" />
        <div>
          <h4 className="text-sm font-semibold text-red-100">Unable to Complete Request</h4>
          <p className="text-xs text-red-300 mt-0.5">{message}</p>
        </div>
      </div>
      {onRetry && (
        <button
          onClick={onRetry}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-red-900/60 hover:bg-red-800/80 text-xs font-medium text-red-100 border border-red-500/40 transition-colors w-fit"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Try Again
        </button>
      )}
    </div>
  );
};
