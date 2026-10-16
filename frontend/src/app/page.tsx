import React from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  FileText, 
  Cpu, 
  CheckCircle2, 
  Users, 
  ShieldCheck, 
  Clock, 
  BarChart3,
  HeartHandshake,
  Layers,
  Search
} from 'lucide-react';

export default function HomePage() {
  const steps = [
    {
      step: '01',
      title: 'Submit Requirement',
      desc: 'NGO inputs unstructured natural-language requests like "Need weekend volunteers to teach math and computers to kids in Pune".',
      icon: FileText,
      color: 'bg-indigo-50 text-indigo-600 border-indigo-200',
    },
    {
      step: '02',
      title: 'AI Request Analysis',
      desc: 'Hybrid NLP automatically classifies the domain (Education, Healthcare, etc.) and detects urgency levels with explainable reasoning.',
      icon: Cpu,
      color: 'bg-purple-50 text-purple-600 border-purple-200',
    },
    {
      step: '03',
      title: 'Extract Skills',
      desc: 'Extracts canonical skills (Teaching, Mathematics, Communication, etc.) with alias mapping and token normalization.',
      icon: Layers,
      color: 'bg-emerald-50 text-emerald-600 border-emerald-200',
    },
    {
      step: '04',
      title: 'Match Volunteers',
      desc: 'Ranks volunteers using a transparent multi-factor formula and generates plain-English "Why this volunteer?" reasons.',
      icon: Users,
      color: 'bg-amber-50 text-amber-600 border-amber-200',
    },
  ];

  return (
    <div className="space-y-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 lg:pt-20 lg:pb-24 bg-gradient-to-b from-brand-50/70 via-white to-slate-50/50 border-b border-slate-200/70">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-50 border border-brand-200/80 text-brand-700 text-xs sm:text-sm font-semibold mb-6 shadow-xs animate-in fade-in slide-in-from-top-4 duration-300">
            <Sparkles className="w-4 h-4 text-brand-600" />
            <span>AI-Powered Volunteer Recommendation System</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight max-w-4xl mx-auto leading-tight">
            NGO Requirement <span className="bg-gradient-to-r from-brand-600 to-indigo-600 bg-clip-text text-transparent">Analyzer</span>
          </h1>

          {/* Subtitle */}
          <p className="mt-5 text-lg sm:text-xl text-slate-600 max-w-2xl mx-auto font-normal leading-relaxed">
            Turn NGO requirements into actionable volunteer recommendations using AI.
          </p>

          {/* Workflow Badges */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs sm:text-sm font-medium text-slate-700">
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              Submit Requirement
            </span>
            <span className="text-brand-500 font-bold">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              Analyze
            </span>
            <span className="text-brand-500 font-bold">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              Extract Skills
            </span>
            <span className="text-brand-500 font-bold">→</span>
            <span className="px-3 py-1.5 rounded-xl bg-white border border-slate-200 shadow-xs">
              Match Volunteers
            </span>
          </div>

          {/* CTAs */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/analyze"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2.5 px-8 py-3.5 rounded-2xl text-base font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-md shadow-brand-500/25 transition-all hover:shadow-lg hover:-translate-y-0.5 active:translate-y-0"
            >
              <Sparkles className="w-5 h-5" />
              <span>Analyze NGO Request</span>
            </Link>

            <Link
              href="/dashboard"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-2xl text-base font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 shadow-xs transition-all hover:border-slate-300"
            >
              <BarChart3 className="w-5 h-5 text-slate-500" />
              <span>View Dashboard</span>
            </Link>
          </div>

          {/* Live Quick Demo Highlight Box */}
          <div className="mt-12 max-w-2xl mx-auto p-4 rounded-2xl bg-white border border-slate-200 shadow-sm text-left flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <span className="text-2xs font-extrabold uppercase tracking-wider text-brand-600 bg-brand-50 px-2 py-0.5 rounded">
                College Demonstration Preset
              </span>
              <p className="text-xs sm:text-sm text-slate-700 font-medium mt-1">
                &ldquo;Weekend Education Program for Underprivileged Children in Pune&rdquo;
              </p>
            </div>
            <Link
              href="/analyze?preset=education"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold text-white bg-slate-900 hover:bg-brand-600 transition-colors shrink-0"
            >
              <span>Load Preset Demo</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Purpose & Problem Statement Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-3xl border border-slate-200 p-8 sm:p-12 shadow-sm">
          <div className="max-w-3xl">
            <span className="text-xs font-bold uppercase tracking-wider text-brand-600 bg-brand-50 px-3 py-1 rounded-full">
              Problem & Solution
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mt-3">
              Overcoming the Volunteer Matching Bottleneck
            </h2>
            <p className="mt-3 text-sm sm:text-base text-slate-600 leading-relaxed">
              Non-Governmental Organizations frequently post assistance needs in raw conversational language. 
              Reviewing these manually to decipher what skills are needed, whether the request is urgent, and 
              which registered volunteers best fit the timeframe, location, and cause is slow and inefficient.
            </p>
            <p className="mt-2 text-sm sm:text-base text-slate-600 leading-relaxed">
              <strong>NGO Requirement Analyzer</strong> resolves this with an autonomous hybrid NLP pipeline 
              that parses unstructured natural language, extracts standardized competencies, scores volunteer compatibility 
              across 5 transparent dimensions, and produces explainable recommendations.
            </p>
          </div>

          {/* 4 Pillars Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {steps.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.step}
                  className="rounded-2xl border border-slate-200/80 p-6 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs hover:shadow-sm"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className={`w-10 h-10 rounded-xl border flex items-center justify-center ${item.color}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <span className="text-xs font-mono font-bold text-slate-400">
                      {item.step}
                    </span>
                  </div>
                  <h3 className="font-bold text-slate-900 text-base mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {item.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Transparent Scoring Formula Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl p-8 sm:p-12 text-white shadow-xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 bg-indigo-950/80 px-3 py-1 rounded-full border border-indigo-800/80">
                Explainable Recommendation Engine
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight mt-3">
                Transparent Multi-Factor Matching
              </h2>
              <p className="mt-3 text-slate-300 text-sm leading-relaxed">
                Rather than treating volunteer matching as an opaque black box, every recommendation computes 
                a deterministic score from 0% to 100% across five well-defined parameters:
              </p>
              
              <ul className="mt-6 space-y-3 text-xs sm:text-sm text-slate-300">
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-indigo-400" />
                  <strong className="text-white">Skill Overlap (50%):</strong> Matches required skills against volunteer profiles.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  <strong className="text-white">Location Proximity (20%):</strong> Prioritizes exact city matches and remote capability.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-amber-400" />
                  <strong className="text-white">Schedule Alignment (15%):</strong> Evaluates weekends, weekdays, and flexible windows.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-sky-400" />
                  <strong className="text-white">Volunteering Experience (10%):</strong> Weights track record and active volunteering years.
                </li>
                <li className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-purple-400" />
                  <strong className="text-white">Cause Interest (5%):</strong> Confirms volunteer passion for the request category.
                </li>
              </ul>
            </div>

            {/* Visual Callout Card */}
            <div className="bg-slate-800/90 rounded-2xl border border-slate-700/80 p-6 space-y-4 shadow-inner">
              <div className="flex items-center justify-between pb-3 border-b border-slate-700">
                <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                  Sample Recommendation Output
                </span>
                <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30">
                  94% Match
                </span>
              </div>

              <div>
                <h4 className="text-base font-bold text-white">Rahul Sharma</h4>
                <p className="text-xs text-slate-400">Pune • Weekends • 2.0 yrs exp</p>
              </div>

              <div className="space-y-1.5 text-xs text-emerald-300 bg-emerald-950/40 p-3 rounded-xl border border-emerald-800/40">
                <div className="text-2xs uppercase tracking-wider font-bold text-emerald-400 mb-1">
                  Why this volunteer?
                </div>
                <div>✓ Mathematics matches required skill</div>
                <div>✓ Teaching matches required skill</div>
                <div>✓ Located in Pune (matches request location)</div>
                <div>✓ Available on Weekends (matches preferred schedule)</div>
              </div>

              <div className="pt-2">
                <Link
                  href="/volunteers"
                  className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold transition-colors"
                >
                  <Search className="w-3.5 h-3.5" />
                  <span>Browse 22+ Sample Volunteers</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Quick Launch CTA Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="bg-brand-50 border border-brand-200/80 rounded-3xl p-8 sm:p-10 shadow-xs">
          <HeartHandshake className="w-10 h-10 text-brand-600 mx-auto mb-3" />
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Ready to test the NGO Requirement Analyzer?
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 max-w-md mx-auto mt-1 mb-6">
            Enter any custom natural language request or choose one of our demonstration presets to see the AI classification and volunteer matching engine in action.
          </p>
          <Link
            href="/analyze"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-bold text-white bg-brand-600 hover:bg-brand-700 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            <span>Submit a Requirement Now</span>
          </Link>
        </div>
      </section>
    </div>
  );
}
