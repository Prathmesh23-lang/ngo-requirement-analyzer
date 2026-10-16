import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  color?: 'brand' | 'emerald' | 'amber' | 'rose' | 'blue';
}

export default function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  color = 'brand',
}: MetricCardProps) {
  const colorMap = {
    brand: {
      bg: 'bg-brand-50 text-brand-600',
      border: 'border-brand-100',
      ring: 'group-hover:border-brand-300',
    },
    emerald: {
      bg: 'bg-emerald-50 text-emerald-600',
      border: 'border-emerald-100',
      ring: 'group-hover:border-emerald-300',
    },
    amber: {
      bg: 'bg-amber-50 text-amber-600',
      border: 'border-amber-100',
      ring: 'group-hover:border-amber-300',
    },
    rose: {
      bg: 'bg-rose-50 text-rose-600',
      border: 'border-rose-100',
      ring: 'group-hover:border-rose-300',
    },
    blue: {
      bg: 'bg-sky-50 text-sky-600',
      border: 'border-sky-100',
      ring: 'group-hover:border-sky-300',
    },
  }[color];

  return (
    <div className={`group bg-white rounded-2xl border ${colorMap.border} ${colorMap.ring} p-5 shadow-xs hover:shadow-md transition-all duration-200`}>
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl ${colorMap.bg} flex items-center justify-center shadow-xs`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>
      <div className="mt-3">
        <span className="text-3xl font-extrabold text-slate-900 tracking-tight block">
          {value}
        </span>
        {subtitle && (
          <p className="mt-1 text-xs text-slate-500 flex items-center gap-1">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  );
}
