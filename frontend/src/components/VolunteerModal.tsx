'use client';

import React, { useState } from 'react';
import { Volunteer, Recommendation } from '@/lib/types';
import { 
  X, 
  MapPin, 
  Calendar, 
  Award, 
  Mail, 
  Phone, 
  CheckCircle2, 
  Send,
  Sparkles,
  Heart
} from 'lucide-react';
import SkillBadge from './SkillBadge';
import ScoreBreakdown from './ScoreBreakdown';

interface VolunteerModalProps {
  volunteer: Volunteer | null;
  recommendation?: Recommendation | null;
  onClose: () => void;
  onContact?: (volunteer: Volunteer) => void;
}

export default function VolunteerModal({
  volunteer,
  recommendation,
  onClose,
  onContact,
}: VolunteerModalProps) {
  const [invited, setInvited] = useState(false);

  if (!volunteer) return null;

  const handleInvite = () => {
    setInvited(true);
    if (onContact) onContact(volunteer);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-150">
      <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-slate-100 overflow-hidden transform transition-all">
        {/* Header Banner */}
        <div className="bg-gradient-to-r from-brand-600 via-indigo-600 to-indigo-700 px-6 py-6 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-2xl font-bold text-white shadow-inner">
              {volunteer.name.charAt(0)}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-xl font-bold tracking-tight text-white">{volunteer.name}</h3>
                <span className="text-xs bg-emerald-400/20 text-emerald-200 border border-emerald-400/30 px-2 py-0.5 rounded-full font-medium">
                  {volunteer.status}
                </span>
              </div>
              <p className="text-indigo-100 text-xs sm:text-sm mt-0.5 flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5" /> {volunteer.location}
                <span>•</span>
                <Calendar className="w-3.5 h-3.5" /> {volunteer.availability}
                <span>•</span>
                <Award className="w-3.5 h-3.5" /> {volunteer.experience_years} Years Exp
              </p>
            </div>
          </div>

          {recommendation && (
            <div className="mt-4 pt-3 border-t border-white/15 flex items-center justify-between text-xs">
              <span className="flex items-center gap-1.5 text-indigo-100 font-medium">
                <Sparkles className="w-4 h-4 text-amber-300" />
                Compatibility Match with current NGO Request:
              </span>
              <span className="text-base font-extrabold text-white bg-white/20 px-2.5 py-0.5 rounded-lg border border-white/30">
                {recommendation.match_score}% Match
              </span>
            </div>
          )}
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 max-h-[70vh] overflow-y-auto">
          {/* Why Recommended Section (if available) */}
          {recommendation && recommendation.match_reasons.length > 0 && (
            <div className="bg-emerald-50/70 border border-emerald-200/80 rounded-2xl p-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 mb-2 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Why this volunteer was recommended:
              </h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-emerald-800">
                {recommendation.match_reasons.map((rsn, idx) => (
                  <li key={idx} className="flex items-start gap-1.5">
                    <span className="text-emerald-600 font-bold shrink-0">✓</span>
                    <span>{rsn.replace(/^[✓\s]+/, '')}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* About / Bio */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Profile Summary
            </h4>
            <p className="text-sm text-slate-700 leading-relaxed bg-slate-50 p-3.5 rounded-xl border border-slate-100">
              {volunteer.description || 'No additional bio provided for this volunteer.'}
            </p>
          </div>

          {/* Skills Grid */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
              Skill Competencies
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {volunteer.skills && volunteer.skills.map((skill) => {
                const isMatched = recommendation?.matched_skills?.some(
                  (ms) => ms.toLowerCase() === skill.toLowerCase()
                );
                return <SkillBadge key={skill} skill={skill} matched={isMatched} />;
              })}
            </div>
          </div>

          {/* Interests */}
          {volunteer.interests && volunteer.interests.length > 0 && (
            <div>
              <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500 mb-2">
                Interest & Cause Domains
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {volunteer.interests.map((interest) => (
                  <span
                    key={interest}
                    className="inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-purple-50 text-purple-700 border border-purple-200"
                  >
                    <Heart className="w-3 h-3 text-purple-500" />
                    {interest}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Contact Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
            <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200/80 bg-white">
              <Mail className="w-4 h-4 text-brand-600" />
              <div>
                <span className="text-2xs uppercase tracking-wider font-semibold text-slate-400 block">
                  Email
                </span>
                <span className="text-xs font-medium text-slate-800 break-all">
                  {volunteer.email}
                </span>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-3 rounded-xl border border-slate-200/80 bg-white">
              <Phone className="w-4 h-4 text-brand-600" />
              <div>
                <span className="text-2xs uppercase tracking-wider font-semibold text-slate-400 block">
                  Phone
                </span>
                <span className="text-xs font-medium text-slate-800">
                  {volunteer.phone || 'Not shared'}
                </span>
              </div>
            </div>
          </div>

          {/* Scoring Detail Breakdown */}
          {recommendation && recommendation.score_breakdown && (
            <div>
              <ScoreBreakdown breakdown={recommendation.score_breakdown} />
            </div>
          )}
        </div>

        {/* Footer Actions */}
        <div className="bg-slate-50 px-6 py-4 border-t border-slate-100 flex items-center justify-between">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
          >
            Close
          </button>
          <button
            onClick={handleInvite}
            disabled={invited}
            className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold shadow-sm transition-all ${
              invited
                ? 'bg-emerald-600 text-white cursor-default'
                : 'bg-brand-600 text-white hover:bg-brand-700 active:scale-95'
            }`}
          >
            {invited ? (
              <>
                <CheckCircle2 className="w-4 h-4" />
                Invitation Sent
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Connect / Invite Volunteer
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
