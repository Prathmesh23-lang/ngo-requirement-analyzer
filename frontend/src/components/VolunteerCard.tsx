'use client';

import React from 'react';
import { Recommendation, Volunteer } from '@/lib/types';
import { MapPin, Calendar, Award, CheckCircle2, ChevronRight, User } from 'lucide-react';
import SkillBadge from './SkillBadge';
import ScoreBreakdown from './ScoreBreakdown';

interface VolunteerCardProps {
  recommendation: Recommendation;
  onViewProfile: (volunteer: Volunteer, recommendation: Recommendation) => void;
}

export default function VolunteerCard({ recommendation, onViewProfile }: VolunteerCardProps) {
  const vol = recommendation.volunteer;
  if (!vol) return null;

  const score = recommendation.match_score;
  const isTopMatch = recommendation.rank === 1;

  // Score badge color
  const getScoreColor = (sc: number) => {
    if (sc >= 85) return 'text-emerald-700 bg-emerald-50 border-emerald-300 ring-1 ring-emerald-400/40';
    if (sc >= 70) return 'text-brand-700 bg-brand-50 border-brand-300';
    return 'text-amber-700 bg-amber-50 border-amber-300';
  };

  return (
    <div
      className={`group bg-white rounded-2xl border transition-all duration-200 overflow-hidden shadow-xs hover:shadow-md ${
        isTopMatch
          ? 'border-brand-300 ring-2 ring-brand-500/10'
          : 'border-slate-200 hover:border-slate-300'
      }`}
    >
      {/* Top Banner with Rank & Score */}
      <div className="p-5 sm:p-6 pb-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex items-start space-x-3.5">
            {/* Rank / Avatar */}
            <div className="relative">
              <div className="w-12 h-12 rounded-xl bg-slate-100 text-slate-700 font-bold flex items-center justify-center text-lg border border-slate-200 group-hover:bg-brand-50 group-hover:text-brand-700 transition-colors">
                {vol.name.charAt(0)}
              </div>
              <span
                className={`absolute -top-1.5 -left-1.5 w-6 h-6 rounded-full text-2xs font-extrabold flex items-center justify-center shadow-xs ${
                  isTopMatch
                    ? 'bg-amber-400 text-amber-950 ring-2 ring-white'
                    : 'bg-slate-800 text-white'
                }`}
                title={`Rank #${recommendation.rank}`}
              >
                #{recommendation.rank}
              </span>
            </div>

            {/* Name & Basic Info */}
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-base sm:text-lg text-slate-900 group-hover:text-brand-700 transition-colors">
                  {vol.name}
                </h3>
                {isTopMatch && (
                  <span className="text-2xs uppercase tracking-wide font-extrabold px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200">
                    Top Match
                  </span>
                )}
              </div>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 mt-1">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-slate-400" />
                  {vol.location}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  {vol.availability}
                </span>
                <span>•</span>
                <span className="flex items-center gap-1">
                  <Award className="w-3.5 h-3.5 text-slate-400" />
                  {vol.experience_years} yrs exp
                </span>
              </div>
            </div>
          </div>

          {/* Match Score Display */}
          <div className="text-right shrink-0">
            <div
              className={`inline-flex items-center px-3 py-1 rounded-xl text-sm font-extrabold border ${getScoreColor(
                score
              )}`}
            >
              {score}% Match
            </div>
          </div>
        </div>

        {/* Skills Tag Section */}
        <div className="mt-4">
          <div className="text-2xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">
            Volunteer Skills
          </div>
          <div className="flex flex-wrap gap-1.5">
            {vol.skills && vol.skills.map((skill) => {
              const isMatched = recommendation.matched_skills?.some(
                (ms) => ms.toLowerCase() === skill.toLowerCase()
              );
              return <SkillBadge key={skill} skill={skill} matched={isMatched} size="sm" />;
            })}
          </div>
        </div>

        {/* Why Recommended Explainable Section */}
        {recommendation.match_reasons && recommendation.match_reasons.length > 0 && (
          <div className="mt-4 p-3 bg-slate-50/80 rounded-xl border border-slate-100 text-xs">
            <div className="font-semibold text-slate-700 mb-1.5 flex items-center gap-1">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
              <span>Why Recommended:</span>
            </div>
            <ul className="space-y-1 text-slate-600">
              {recommendation.match_reasons.slice(0, 3).map((rsn, idx) => (
                <li key={idx} className="flex items-start gap-1.5">
                  <span className="text-emerald-600 font-bold shrink-0">✓</span>
                  <span>{rsn.replace(/^[✓\s]+/, '')}</span>
                </li>
              ))}
              {recommendation.match_reasons.length > 3 && (
                <li className="text-2xs text-brand-600 font-medium pl-3.5">
                  + {recommendation.match_reasons.length - 3} more matching attributes
                </li>
              )}
            </ul>
          </div>
        )}

        {/* Mini Breakdown progress */}
        {recommendation.score_breakdown && (
          <div className="mt-3.5">
            <ScoreBreakdown breakdown={recommendation.score_breakdown} compact />
          </div>
        )}
      </div>

      {/* Card Footer Button */}
      <div className="bg-slate-50/60 px-5 sm:px-6 py-3 border-t border-slate-100 flex items-center justify-between">
        <span className="text-2xs text-slate-400 font-medium">
          {vol.status} • {vol.interests?.slice(0, 2).join(', ')}
        </span>
        <button
          onClick={() => onViewProfile(vol, recommendation)}
          className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 transition-colors"
        >
          View Full Profile & Reasons
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
