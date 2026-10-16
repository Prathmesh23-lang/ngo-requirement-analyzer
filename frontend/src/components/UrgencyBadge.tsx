import React from 'react';
import { AlertCircle, AlertTriangle, CheckCircle, Clock } from 'lucide-react';

interface UrgencyBadgeProps {
  urgency: 'Low' | 'Medium' | 'High' | string;
  showIcon?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export default function UrgencyBadge({ urgency, showIcon = true, size = 'md' }: UrgencyBadgeProps) {
  const norm = urgency ? urgency.toLowerCase() : 'medium';

  const sizeClasses = {
    sm: 'text-xs px-2 py-0.5 gap-1',
    md: 'text-xs px-2.5 py-1 gap-1.5 font-medium',
    lg: 'text-sm px-3.5 py-1.5 gap-2 font-semibold',
  }[size];

  if (norm === 'high') {
    return (
      <span className={`inline-flex items-center rounded-full bg-rose-50 text-rose-700 border border-rose-200/80 ${sizeClasses}`}>
        {showIcon && <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0" />}
        <span>High Priority</span>
      </span>
    );
  }

  if (norm === 'low') {
    return (
      <span className={`inline-flex items-center rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200/80 ${sizeClasses}`}>
        {showIcon && <CheckCircle className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />}
        <span>Low Priority</span>
      </span>
    );
  }

  return (
    <span className={`inline-flex items-center rounded-full bg-amber-50 text-amber-700 border border-amber-200/80 ${sizeClasses}`}>
      {showIcon && <Clock className="w-3.5 h-3.5 text-amber-600 flex-shrink-0" />}
      <span>Medium Priority</span>
    </span>
  );
}
