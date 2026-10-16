'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowLeft, 
  RotateCw, 
  MapPin, 
  Calendar, 
  Users, 
  Clock, 
  Building2, 
  Layers, 
  CheckCircle2, 
  Share2, 
  FileText,
  AlertCircle
} from 'lucide-react';
import { api } from '@/lib/api';
import { NGORequestDetail, Recommendation, Volunteer } from '@/lib/types';
import SkillBadge from '@/components/SkillBadge';
import UrgencyBadge from '@/components/UrgencyBadge';
import VolunteerCard from '@/components/VolunteerCard';
import VolunteerModal from '@/components/VolunteerModal';
import Toast, { ToastMessage } from '@/components/Toast';
import EmptyState from '@/components/EmptyState';

export default function RequestDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;

  const [requestDetail, setRequestDetail] = useState<NGORequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [reanalyzing, setReanalyzing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [selectedRec, setSelectedRec] = useState<Recommendation | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const fetchDetail = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await api.getRequestDetail(id);
      setRequestDetail(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load request analysis.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (id) {
      fetchDetail();
    }
  }, [id]);

  const handleReanalyze = async () => {
    if (!id) return;
    setReanalyzing(true);
    try {
      const updated = await api.reanalyzeRequest(id);
      setRequestDetail(updated);
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'AI re-analysis & volunteer matching complete!',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Re-analysis failed.',
      });
    } finally {
      setReanalyzing(false);
    }
  };

  const handleOpenProfile = (vol: Volunteer, rec: Recommendation) => {
    setSelectedVolunteer(vol);
    setSelectedRec(rec);
  };

  const handleContactVolunteer = (vol: Volunteer) => {
    setToast({
      id: String(Date.now()),
      type: 'success',
      message: `Volunteer connection request sent to ${vol.name} (${vol.email})!`,
    });
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-12 h-12 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-4" />
        <h3 className="text-lg font-bold text-slate-800">Loading Analysis Results...</h3>
        <p className="text-xs text-slate-500 mt-1">Retrieving AI categorization and ranked recommendations.</p>
      </div>
    );
  }

  if (error || !requestDetail) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <div className="bg-rose-50 border border-rose-200 rounded-3xl p-8 text-center space-y-4">
          <AlertCircle className="w-12 h-12 text-rose-600 mx-auto" />
          <h2 className="text-xl font-bold text-rose-900">Request Analysis Not Found</h2>
          <p className="text-xs sm:text-sm text-rose-700 max-w-md mx-auto">{error}</p>
          <Link
            href="/requests"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Return to Request History</span>
          </Link>
        </div>
      </div>
    );
  }

  const analysis = requestDetail.analysis;
  const recommendations = requestDetail.recommendations || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Profile Modal */}
      <VolunteerModal
        volunteer={selectedVolunteer}
        recommendation={selectedRec}
        onClose={() => {
          setSelectedVolunteer(null);
          setSelectedRec(null);
        }}
        onContact={handleContactVolunteer}
      />

      {/* Top Navigation Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <Link
          href="/requests"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-600 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Request History</span>
        </Link>

        <div className="flex items-center space-x-3">
          <button
            onClick={handleReanalyze}
            disabled={reanalyzing}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-2xs transition-all disabled:opacity-50"
          >
            <RotateCw className={`w-3.5 h-3.5 ${reanalyzing ? 'animate-spin' : ''}`} />
            <span>{reanalyzing ? 'Re-analyzing...' : 'Re-run AI Matching'}</span>
          </button>

          <Link
            href="/analyze"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-all"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Analyze New Request</span>
          </Link>
        </div>
      </div>

      {/* Main Request Header Banner */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-2">
              <span className="text-2xs font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-brand-50 text-brand-700 border border-brand-200">
                {requestDetail.status}
              </span>
              <UrgencyBadge urgency={requestDetail.urgency} size="sm" />
              {analysis?.category && (
                <span className="text-2xs font-semibold px-2.5 py-0.5 rounded-full bg-indigo-50 text-indigo-700 border border-indigo-200">
                  {analysis.category} • {analysis.subcategory || 'General'}
                </span>
              )}
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {requestDetail.title}
            </h1>

            <div className="flex flex-wrap items-center gap-y-1 gap-x-4 text-xs text-slate-500 mt-2">
              <span className="flex items-center gap-1.5 font-medium text-slate-700">
                <Building2 className="w-4 h-4 text-brand-600" />
                {requestDetail.ngo_name}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                {requestDetail.location}
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Users className="w-3.5 h-3.5 text-slate-400" />
                {requestDetail.volunteers_required} Volunteers Required
              </span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {requestDetail.availability || 'Weekends'}
              </span>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 shrink-0 text-left lg:text-right">
            <span className="text-2xs font-mono uppercase tracking-wider text-slate-400 block">
              Analysis Engine
            </span>
            <span className="text-xs font-bold text-slate-800 flex items-center gap-1.5 lg:justify-end mt-0.5">
              <Sparkles className="w-3.5 h-3.5 text-brand-600" />
              {analysis?.analysis_method || 'Hybrid NLP Engine'}
            </span>
            <span className="text-2xs text-emerald-600 font-semibold block mt-1">
              Confidence: {Math.round((analysis?.category_confidence || 0.95) * 100)}%
            </span>
          </div>
        </div>

        {/* Natural Language Input Narrative */}
        <div className="pt-6">
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
            Original Unstructured Requirement Description
          </span>
          <p className="text-sm text-slate-700 bg-slate-50/70 p-4 rounded-2xl border border-slate-200/80 leading-relaxed italic">
            &ldquo;{requestDetail.description}&rdquo;
          </p>
        </div>
      </div>

      {/* AI Structured Analysis Panel */}
      <div className="bg-gradient-to-br from-indigo-50/70 via-white to-slate-50/50 rounded-3xl border border-indigo-100 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex items-center justify-between pb-3 border-b border-indigo-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-600 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-4 h-4" />
            </div>
            <div>
              <h2 className="text-base font-bold text-slate-900">
                AI NLP Requirement Breakdown
              </h2>
              <p className="text-2xs text-slate-500">
                Autonomous classification, entity extraction & urgency evaluation
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Category */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
              Category
            </span>
            <span className="text-base font-extrabold text-slate-900 block mt-0.5">
              {analysis?.category || 'Education'}
            </span>
            <span className="text-xs text-brand-600 font-medium">
              {analysis?.subcategory || 'Teaching & Training'}
            </span>
          </div>

          {/* Urgency */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
              Urgency Assessment
            </span>
            <div className="mt-1">
              <UrgencyBadge urgency={analysis?.urgency || requestDetail.urgency} size="sm" />
            </div>
            <p className="text-2xs text-slate-500 mt-1 line-clamp-2">
              {analysis?.urgency_reason || 'Standard timeframe for volunteer mobilization.'}
            </p>
          </div>

          {/* Logistics */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
              Target Volunteer Quota
            </span>
            <span className="text-base font-extrabold text-slate-900 block mt-0.5">
              {requestDetail.volunteers_required} Volunteers
            </span>
            <span className="text-xs text-slate-500">
              Duration: {requestDetail.duration || 'Flexible'}
            </span>
          </div>

          {/* Total Recommendations */}
          <div className="bg-white p-4 rounded-2xl border border-slate-200/80 shadow-2xs">
            <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block">
              Compatible Matches
            </span>
            <span className="text-base font-extrabold text-emerald-600 block mt-0.5">
              {recommendations.length} Volunteers Ranked
            </span>
            <span className="text-xs text-slate-500">
              Highest Match: {recommendations[0]?.match_score || 0}%
            </span>
          </div>
        </div>

        {/* Extracted Skills Badges */}
        <div>
          <span className="text-2xs font-bold uppercase tracking-wider text-slate-500 block mb-2">
            Required Skills Extracted from Description ({analysis?.extracted_skills?.length || 0})
          </span>
          <div className="flex flex-wrap gap-2">
            {analysis?.extracted_skills && analysis.extracted_skills.length > 0 ? (
              analysis.extracted_skills.map((skill) => (
                <SkillBadge key={skill} skill={skill} matched />
              ))
            ) : (
              <span className="text-xs text-slate-400 italic">No specific skills extracted</span>
            )}
          </div>
        </div>

        {/* Summary note */}
        {analysis?.summary && (
          <div className="bg-white/80 p-3.5 rounded-2xl border border-indigo-100 text-xs text-slate-600 leading-relaxed">
            <strong className="text-slate-800">Executive Brief:</strong> {analysis.summary}
          </div>
        )}
      </div>

      {/* Recommended Volunteers Section */}
      <div className="space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
          <div>
            <h2 className="text-2xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
              <Users className="w-6 h-6 text-brand-600" />
              <span>Recommended Volunteers (Ranked by Compatibility)</span>
            </h2>
            <p className="text-xs sm:text-sm text-slate-500">
              Sorted from highest compatibility to lowest using transparent multi-factor scoring.
            </p>
          </div>

          <span className="text-xs font-semibold text-slate-500 bg-white px-3 py-1.5 rounded-xl border border-slate-200 shadow-2xs shrink-0">
            Showing Top {recommendations.length} Candidates
          </span>
        </div>

        {recommendations.length === 0 ? (
          <EmptyState
            title="No Strong Matches Found"
            description="Try expanding the location, availability, or required skills in the request."
            actionText="Submit New Request"
            actionHref="/analyze"
          />
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {recommendations.map((rec) => (
              <VolunteerCard
                key={rec.volunteer_id}
                recommendation={rec}
                onViewProfile={handleOpenProfile}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
