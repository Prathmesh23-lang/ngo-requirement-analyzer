'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  Sparkles, 
  Building2, 
  FileText, 
  Zap, 
  RotateCcw
} from 'lucide-react';
import { api } from '@/lib/api';
import { AnalysisResult, NGORequestCreatePayload } from '@/lib/types';
import SkillBadge from '@/components/SkillBadge';
import UrgencyBadge from '@/components/UrgencyBadge';
import Toast, { ToastMessage } from '@/components/Toast';

// Demonstration Presets
const DEMO_PRESETS = [
  {
    id: 'education',
    label: 'College Demo: Education Program',
    ngo_name: 'Helping Hands Foundation',
    ngo_email: 'contact@helpinghandspune.org',
    location: 'Pune',
    title: 'Weekend Education Program',
    description:
      'We are organizing a weekend education program for underprivileged children. We need volunteers who can teach mathematics and basic computer skills. Volunteers should be comfortable communicating with children and should preferably be available on weekends in Pune.',
    volunteers_required: 4,
    duration: '4 weeks',
    expected_date: 'Upcoming Saturday',
    availability: 'Weekends',
    urgency: 'Auto',
    optional_skills: ['Communication', 'Teaching'],
  },
  {
    id: 'environment',
    label: 'Tree Plantation & Green Drive',
    ngo_name: 'Green Earth Initiative',
    ngo_email: 'info@greenearthpune.org',
    location: 'Pune',
    title: 'Monsoon Tree Plantation and Environmental Awareness',
    description:
      'Conducting an urban greening drive in public parks. Need volunteers to distribute saplings, guide visitors, and spread environmental awareness about waste management and afforestation on weekends.',
    volunteers_required: 6,
    duration: '1 weekend',
    expected_date: 'This Sunday',
    availability: 'Weekends',
    urgency: 'Low',
    optional_skills: ['Environmental Awareness', 'Event Management'],
  },
  {
    id: 'technology',
    label: 'Tech: Website Development',
    ngo_name: 'TechForGood Foundation',
    ngo_email: 'dev@techforgood.org',
    location: 'Bangalore',
    title: 'NGO Website and Portal Development',
    description:
      'We need skilled volunteers to develop a responsive website and volunteer management portal for our NGO. Looking for volunteers with experience in web development, python backend, and modern UI/UX design.',
    volunteers_required: 2,
    duration: '6 weeks',
    expected_date: 'Within 2 weeks',
    availability: 'Flexible',
    urgency: 'Medium',
    optional_skills: ['Web Development', 'Python', 'UI/UX Design'],
  },
  {
    id: 'emergency',
    label: 'High Urgency: Flood Relief',
    ngo_name: 'Care & Relief Trust',
    ngo_email: 'sos@careandrelief.org',
    location: 'Mumbai',
    title: 'Emergency Flood Relief Food Distribution',
    description:
      'We urgently need volunteers to distribute food rations, drinking water, and first aid supplies to families affected by heavy monsoon flooding. Critical emergency assistance needed on-ground immediately!',
    volunteers_required: 10,
    duration: '3 days',
    expected_date: 'Immediately',
    availability: 'Weekends',
    urgency: 'High',
    optional_skills: ['First Aid', 'Community Outreach'],
  },
  {
    id: 'healthcare',
    label: 'Community Health Awareness Camp',
    ngo_name: 'Sanjeevani Care Trust',
    ngo_email: 'health@sanjeevani.org',
    location: 'Delhi',
    title: 'Free Community Health Camp',
    description:
      'Organizing a free general health checkup and first aid awareness camp. Looking for volunteers with healthcare assistance, first aid, and patient care background to assist doctors and manage attendee flow.',
    volunteers_required: 5,
    duration: '2 days',
    expected_date: 'Next month',
    availability: 'Weekends',
    urgency: 'Medium',
    optional_skills: ['Healthcare Assistance', 'First Aid'],
  },
];

function AnalyzeContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [formData, setFormData] = useState<NGORequestCreatePayload>({
    ngo_name: '',
    ngo_email: '',
    location: 'Pune',
    title: '',
    description: '',
    volunteers_required: 4,
    duration: '4 weeks',
    expected_date: 'Next Saturday',
    availability: 'Weekends',
    optional_skills: [],
    urgency: 'Auto',
  });

  const [customSkillInput, setCustomSkillInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [previewLoading, setPreviewLoading] = useState(false);
  const [previewResult, setPreviewResult] = useState<AnalysisResult | null>(null);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // Check URL preset query param
  useEffect(() => {
    const presetId = searchParams.get('preset');
    if (presetId) {
      const match = DEMO_PRESETS.find((p) => p.id === presetId);
      if (match) {
        applyPreset(match);
      }
    } else {
      // Default to college education demo preset for easy evaluation
      applyPreset(DEMO_PRESETS[0]);
    }
  }, [searchParams]);

  const applyPreset = (preset: typeof DEMO_PRESETS[0]) => {
    setFormData({
      ngo_name: preset.ngo_name,
      ngo_email: preset.ngo_email,
      location: preset.location,
      title: preset.title,
      description: preset.description,
      volunteers_required: preset.volunteers_required,
      duration: preset.duration,
      expected_date: preset.expected_date,
      availability: preset.availability,
      optional_skills: preset.optional_skills || [],
      urgency: preset.urgency,
    });
    setPreviewResult(null);
  };

  const handleAddSkill = () => {
    if (!customSkillInput.trim()) return;
    const trimmed = customSkillInput.trim();
    if (!formData.optional_skills?.includes(trimmed)) {
      setFormData({
        ...formData,
        optional_skills: [...(formData.optional_skills || []), trimmed],
      });
    }
    setCustomSkillInput('');
  };

  const handleRemoveSkill = (skill: string) => {
    setFormData({
      ...formData,
      optional_skills: formData.optional_skills?.filter((s) => s !== skill),
    });
  };

  // Instant AI Preview
  const handlePreview = async () => {
    if (!formData.description.trim()) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Please enter a detailed requirement description first.',
      });
      return;
    }

    setPreviewLoading(true);
    try {
      const res = await api.previewAnalysis({
        title: formData.title || 'Requirement',
        description: formData.description,
        optional_skills: formData.optional_skills,
        urgency: formData.urgency,
      });
      setPreviewResult(res);
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'AI Preview generated successfully!',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to preview analysis.',
      });
    } finally {
      setPreviewLoading(false);
    }
  };

  // Submit and match
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.ngo_name.trim()) {
      setToast({ id: String(Date.now()), type: 'error', message: 'NGO Name is required.' });
      return;
    }
    if (!formData.ngo_email.trim()) {
      setToast({ id: String(Date.now()), type: 'error', message: 'NGO Email is required.' });
      return;
    }
    if (!formData.description.trim() || formData.description.length < 10) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: 'Please enter a meaningful requirement description (at least 10 characters).',
      });
      return;
    }

    setLoading(true);
    try {
      const res = await api.submitRequest(formData);
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'Request analyzed and volunteers matched successfully!',
      });
      // Redirect to the newly created request detail page
      router.push(`/requests/${res.id}`);
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to analyze request. Check backend connection.',
      });
      setLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="mb-8">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
          <Sparkles className="w-3.5 h-3.5 text-brand-600" />
          <span>Natural Language Request Analyzer</span>
        </div>
        <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
          Submit & Analyze NGO Requirement
        </h1>
        <p className="mt-1 text-sm text-slate-600">
          Enter an unstructured natural-language request. The AI engine will categorize the request,
          extract required skills, detect urgency, and match the most compatible volunteers.
        </p>
      </div>

      {/* Presets Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 mb-8 shadow-xs">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-xs font-bold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
            <Zap className="w-3.5 h-3.5 text-amber-500" />
            Quick Demonstration Presets (Click to autofill):
          </span>
          <span className="text-2xs text-slate-400">1-Click Scenarios</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {DEMO_PRESETS.map((preset) => (
            <button
              key={preset.id}
              type="button"
              onClick={() => applyPreset(preset)}
              className="text-xs px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-brand-50 hover:text-brand-700 hover:border-brand-200 font-medium transition-all text-slate-700"
            >
              {preset.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Card 1: NGO Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <Building2 className="w-5 h-5 text-brand-600" />
              <span>1. NGO Information</span>
            </h2>
            <p className="text-xs text-slate-500">Details about the non-profit organization submitting the request.</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                NGO Name *
              </label>
              <input
                type="text"
                required
                value={formData.ngo_name}
                onChange={(e) => setFormData({ ...formData, ngo_name: e.target.value })}
                placeholder="e.g. Helping Hands Foundation"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                NGO Email *
              </label>
              <input
                type="email"
                required
                value={formData.ngo_email}
                onChange={(e) => setFormData({ ...formData, ngo_email: e.target.value })}
                placeholder="e.g. contact@helpinghandspune.org"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                City / Location *
              </label>
              <input
                type="text"
                required
                value={formData.location}
                onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                placeholder="e.g. Pune"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>
          </div>
        </div>

        {/* Card 2: Request Requirement Information */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="border-b border-slate-100 pb-3">
            <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
              <FileText className="w-5 h-5 text-brand-600" />
              <span>2. Request Details (Natural Language Input)</span>
            </h2>
            <p className="text-xs text-slate-500">
              Describe your requirement in natural language. Our AI will automatically categorize, extract skills, and detect urgency.
            </p>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Request Title *
            </label>
            <input
              type="text"
              required
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Weekend Education Program"
              className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 font-medium"
            />
          </div>

          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">
                Detailed Requirement / Description (Natural Language) *
              </label>
              <button
                type="button"
                onClick={handlePreview}
                disabled={previewLoading || !formData.description.trim()}
                className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800 disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>{previewLoading ? 'Analyzing...' : 'Test AI Preview'}</span>
              </button>
            </div>
            <textarea
              required
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Type your natural language request, e.g. We are organizing a weekend education program for underprivileged children. We need volunteers who can teach mathematics and basic computer skills. Volunteers should be comfortable communicating with children and should preferably be available on weekends in Pune."
              className="w-full text-sm p-3.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 leading-relaxed"
            />
            <p className="text-2xs text-slate-400 mt-1">
              Pro-tip: Include skills needed, timeline, audience, and location context for optimal matching.
            </p>
          </div>

          {/* Logistics Fields */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Volunteers Needed
              </label>
              <input
                type="number"
                min={1}
                max={100}
                value={formData.volunteers_required}
                onChange={(e) =>
                  setFormData({ ...formData, volunteers_required: parseInt(e.target.value) || 1 })
                }
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Duration
              </label>
              <input
                type="text"
                value={formData.duration || ''}
                onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                placeholder="e.g. 4 weeks"
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Preferred Schedule
              </label>
              <select
                value={formData.availability}
                onChange={(e) => setFormData({ ...formData, availability: e.target.value })}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
              >
                <option value="Weekends">Weekends</option>
                <option value="Weekdays">Weekdays</option>
                <option value="Flexible">Flexible</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                Urgency Priority
              </label>
              <select
                value={formData.urgency}
                onChange={(e) => setFormData({ ...formData, urgency: e.target.value })}
                className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
              >
                <option value="Auto">Auto (AI Detects)</option>
                <option value="Low">Low</option>
                <option value="Medium">Medium</option>
                <option value="High">High (Emergency)</option>
              </select>
            </div>
          </div>

          {/* Optional Skills Input */}
          <div className="pt-2">
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-600 mb-1">
              Explicit / Optional Skills (Extra tags)
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={customSkillInput}
                onChange={(e) => setCustomSkillInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleAddSkill();
                  }
                }}
                placeholder="Type additional skill and press Enter (e.g. Child Psychology, Python)"
                className="flex-1 text-sm px-3.5 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
              />
              <button
                type="button"
                onClick={handleAddSkill}
                className="px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors"
              >
                Add Skill
              </button>
            </div>

            {formData.optional_skills && formData.optional_skills.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {formData.optional_skills.map((skill) => (
                  <span
                    key={skill}
                    className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-lg bg-brand-50 text-brand-700 border border-brand-200 font-medium"
                  >
                    <span>{skill}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveSkill(skill)}
                      className="hover:text-brand-900 font-bold"
                    >
                      ×
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Live Preview Drawer if triggered */}
        {previewResult && (
          <div className="bg-gradient-to-br from-indigo-50/80 via-white to-slate-50 rounded-3xl border border-brand-200 p-6 sm:p-8 shadow-sm space-y-4 animate-in fade-in duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-brand-100">
              <div className="flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-brand-600" />
                <h3 className="font-bold text-base text-slate-900">
                  Instant AI NLP Analysis Preview
                </h3>
              </div>
              <span className="text-2xs font-mono font-semibold px-2 py-0.5 rounded bg-brand-100 text-brand-800">
                {previewResult.analysis_method}
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <span className="text-2xs uppercase tracking-wider font-semibold text-slate-400 block">
                  Category
                </span>
                <span className="text-sm font-bold text-slate-800">
                  {previewResult.category}
                </span>
                {previewResult.subcategory && (
                  <span className="text-xs text-slate-500 block">
                    Sub: {previewResult.subcategory}
                  </span>
                )}
              </div>

              <div>
                <span className="text-2xs uppercase tracking-wider font-semibold text-slate-400 block">
                  Detected Urgency
                </span>
                <div className="mt-1">
                  <UrgencyBadge urgency={previewResult.urgency} size="sm" />
                </div>
                <p className="text-2xs text-slate-500 mt-1">{previewResult.urgency_reason}</p>
              </div>

              <div>
                <span className="text-2xs uppercase tracking-wider font-semibold text-slate-400 block">
                  Confidence
                </span>
                <span className="text-sm font-bold text-emerald-600">
                  {Math.round(previewResult.category_confidence * 100)}%
                </span>
              </div>
            </div>

            <div>
              <span className="text-2xs uppercase tracking-wider font-semibold text-slate-400 block mb-1.5">
                Automatically Extracted Skills ({previewResult.extracted_skills.length})
              </span>
              <div className="flex flex-wrap gap-1.5">
                {previewResult.extracted_skills.map((skill) => (
                  <SkillBadge key={skill} skill={skill} matched size="sm" />
                ))}
              </div>
            </div>

            {previewResult.summary && (
              <p className="text-xs text-slate-600 italic bg-white/70 p-3 rounded-xl border border-brand-100">
                &ldquo;{previewResult.summary}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Submit Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-2">
          <button
            type="button"
            onClick={() => applyPreset(DEMO_PRESETS[0])}
            className="text-xs text-slate-500 hover:text-slate-800 inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset to College Demo Preset</span>
          </button>

          <button
            type="submit"
            disabled={loading}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-4 rounded-2xl text-base font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-lg shadow-brand-500/25 transition-all hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <>
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running AI Analysis & Volunteer Matching...</span>
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>Analyze Request & Match Volunteers</span>
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}

export default function AnalyzePage() {
  return (
    <Suspense fallback={
      <div className="max-w-5xl mx-auto px-4 py-16 text-center">
        <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Loading requirement submission form...</p>
      </div>
    }>
      <AnalyzeContent />
    </Suspense>
  );
}
