import React from 'react';
import { ScoreBreakdown as IScoreBreakdown } from '@/lib/types';

interface ScoreBreakdownProps {
  breakdown: IScoreBreakdown;
  compact?: boolean;
}

export default function ScoreBreakdown({ breakdown, compact = false }: ScoreBreakdownProps) {
  const factors = [
    { label: 'Skills', max: 50, score: breakdown.skill_score, color: 'bg-indigo-600' },
    { label: 'Location', max: 20, score: breakdown.location_score, color: 'bg-emerald-600' },
    { label: 'Availability', max: 15, score: breakdown.availability_score, color: 'bg-amber-600' },
    { label: 'Experience', max: 10, score: breakdown.experience_score, color: 'bg-sky-600' },
    { label: 'Interests', max: 5, score: breakdown.interest_score, color: 'bg-purple-600' },
  ];

  if (compact) {
    return (
      <div className="space-y-1.5 text-xs">
        <div className="flex justify-between text-slate-500 font-medium">
          <span>Component Breakdown</span>
          <span>{breakdown.total_score}% Total</span>
        </div>
        <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden flex">
          {factors.map((f) => (
            <div
              key={f.label}
              style={{ width: `${(f.score / 100) * 100}%` }}
              className={`${f.color} transition-all duration-500`}
              title={`${f.label}: ${f.score}/${f.max} pts`}
            />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/80 space-y-3">
      <div className="flex items-center justify-between pb-1 border-b border-slate-200">
        <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
          Match Scoring Formula (Transparent Weights)
        </span>
        <span className="text-xs font-semibold text-brand-700 bg-brand-50 px-2 py-0.5 rounded">
          {breakdown.total_score} / 100 Points
        </span>
      </div>

      <div className="space-y-2.5">
        {factors.map((f) => {
          const pct = Math.min(100, Math.round((f.score / f.max) * 100));
          return (
            <div key={f.label} className="space-y-1">
              <div className="flex justify-between text-xs">
                <span className="text-slate-600 font-medium">{f.label} (Max {f.max}%)</span>
                <span className="text-slate-800 font-semibold">
                  {f.score} / {f.max} pts ({pct}%)
                </span>
              </div>
              <div className="h-1.5 w-full bg-slate-200/70 rounded-full overflow-hidden">
                <div
                  className={`h-full ${f.color} rounded-full transition-all duration-500`}
                  style={{ width: `${pct}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
