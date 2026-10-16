'use client';

import React, { useEffect } from 'react';
import { CheckCircle2, AlertCircle, Info, X } from 'lucide-react';

export interface ToastMessage {
  id: string;
  type: 'success' | 'error' | 'info';
  message: string;
}

interface ToastProps {
  toast: ToastMessage | null;
  onDismiss: () => void;
}

export default function Toast({ toast, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!toast) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 4000);
    return () => clearTimeout(timer);
  }, [toast, onDismiss]);

  if (!toast) return null;

  const typeConfig = {
    success: {
      bg: 'bg-emerald-600',
      icon: CheckCircle2,
    },
    error: {
      bg: 'bg-rose-600',
      icon: AlertCircle,
    },
    info: {
      bg: 'bg-slate-900',
      icon: Info,
    },
  }[toast.type];

  const Icon = typeConfig.icon;

  return (
    <div className="fixed bottom-5 right-5 z-50 animate-in slide-in-from-bottom-5 duration-200">
      <div
        className={`${typeConfig.bg} text-white px-4 py-3 rounded-2xl shadow-xl flex items-center space-x-3 max-w-md border border-white/20`}
      >
        <Icon className="w-5 h-5 shrink-0" />
        <p className="text-xs sm:text-sm font-medium">{toast.message}</p>
        <button
          onClick={onDismiss}
          className="p-1 rounded-lg hover:bg-white/20 text-white/80 hover:text-white transition-colors ml-2"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
