import React from 'react';

interface SkillBadgeProps {
  skill: string;
  matched?: boolean;
  size?: 'sm' | 'md';
  onClick?: () => void;
}

export default function SkillBadge({ skill, matched = false, size = 'md', onClick }: SkillBadgeProps) {
  const sizeClasses = size === 'sm' ? 'text-xs px-2 py-0.5' : 'text-xs px-2.5 py-1 font-medium';

  const baseClasses = matched
    ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-semibold ring-1 ring-emerald-400/30'
    : 'bg-slate-100 text-slate-700 border-slate-200 hover:bg-slate-200/80';

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center rounded-md border transition-colors ${baseClasses} ${sizeClasses} ${
        onClick ? 'cursor-pointer' : ''
      }`}
    >
      {matched && <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mr-1.5" />}
      {skill}
    </span>
  );
}
