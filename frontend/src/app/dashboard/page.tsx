'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  FileText, 
  CheckCircle, 
  Users, 
  AlertTriangle, 
  Sparkles, 
  BarChart3, 
  TrendingUp, 
  ArrowRight,
  MapPin,
  ChevronRight
} from 'lucide-react';
import { api } from '@/lib/api';
import { DashboardStats } from '@/lib/types';
import MetricCard from '@/components/MetricCard';
import UrgencyBadge from '@/components/UrgencyBadge';
import EmptyState from '@/components/EmptyState';
import Toast, { ToastMessage } from '@/components/Toast';

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true);
        const data = await api.getDashboardStats();
        setStats(data);
      } catch (err: any) {
        setToast({
          id: String(Date.now()),
          type: 'error',
          message: err.message || 'Failed to load dashboard metrics.',
        });
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
        <p className="text-xs text-slate-500">Calculating dashboard analytics...</p>
      </div>
    );
  }

  if (!stats) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16">
        <EmptyState
          title="Dashboard Unavailable"
          description="Could not connect to the backend API. Please verify the backend server is running."
          actionText="Try Again"
          onAction={() => window.location.reload()}
        />
      </div>
    );
  }

  const categoryColors = [
    'bg-indigo-600',
    'bg-emerald-600',
    'bg-sky-600',
    'bg-amber-600',
    'bg-purple-600',
    'bg-rose-600',
    'bg-teal-600',
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
            <LayoutDashboard className="w-3.5 h-3.5 text-brand-600" />
            <span>NGO Intelligence Center</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Analytics & Operations Dashboard
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Real-time telemetry on incoming NGO requirements, category trends, and volunteer match efficacy.
          </p>
        </div>

        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-all shrink-0"
        >
          <Sparkles className="w-4 h-4" />
          <span>New Requirement</span>
        </Link>
      </div>

      {/* 4 Core KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <MetricCard
          title="Total Requests"
          value={stats.total_requests}
          subtitle="Submitted by registered NGOs"
          icon={FileText}
          color="brand"
        />
        <MetricCard
          title="Analyzed Requests"
          value={stats.analyzed_requests}
          subtitle="Processed via Hybrid AI"
          icon={CheckCircle}
          color="emerald"
        />
        <MetricCard
          title="Volunteers Recommended"
          value={stats.volunteers_recommended}
          subtitle="Compatible volunteer links generated"
          icon={Users}
          color="blue"
        />
        <MetricCard
          title="High Priority Requests"
          value={stats.high_priority_requests}
          subtitle="Urgent crisis or time-critical cases"
          icon={AlertTriangle}
          color="rose"
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Requests by Category Visualizer */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <BarChart3 className="w-4 h-4 text-brand-600" />
                <span>Requests by Category</span>
              </h2>
              <p className="text-2xs text-slate-500">Distribution across cause domains</p>
            </div>
            <span className="text-2xs font-semibold text-slate-400">
              {stats.requests_by_category.length} Domains
            </span>
          </div>

          <div className="space-y-3.5">
            {stats.requests_by_category.map((item, idx) => {
              const barColor = categoryColors[idx % categoryColors.length];
              return (
                <div key={item.category} className="space-y-1.5">
                  <div className="flex justify-between text-xs">
                    <span className="font-semibold text-slate-700">{item.category}</span>
                    <span className="text-slate-500 font-medium">
                      {item.count} requests ({item.percentage}%)
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${barColor} rounded-full transition-all duration-500`}
                      style={{ width: `${Math.max(5, item.percentage)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Requests by Urgency + Skills */}
        <div className="space-y-8">
          {/* Urgency Distribution */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-brand-600" />
                <span>Requests by Urgency Level</span>
              </h2>
              <span className="text-2xs font-semibold text-slate-400">Time Sensitivity</span>
            </div>

            <div className="grid grid-cols-3 gap-3 text-center">
              {stats.requests_by_urgency.map((urg) => {
                const isHigh = urg.urgency === 'High';
                const isMed = urg.urgency === 'Medium';
                const bg = isHigh ? 'bg-rose-50 border-rose-200' : isMed ? 'bg-amber-50 border-amber-200' : 'bg-emerald-50 border-emerald-200';
                const text = isHigh ? 'text-rose-700' : isMed ? 'text-amber-700' : 'text-emerald-700';

                return (
                  <div key={urg.urgency} className={`p-4 rounded-2xl border ${bg} ${text}`}>
                    <span className="text-2xs font-bold uppercase tracking-wider block">
                      {urg.urgency}
                    </span>
                    <span className="text-2xl font-black mt-1 block">
                      {urg.count}
                    </span>
                    <span className="text-2xs font-medium opacity-80 block">
                      {urg.percentage}% of total
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Top Demanded Skills */}
          <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-brand-600" />
                <span>Top Demanded Skills (Across Requests)</span>
              </h2>
              <span className="text-2xs font-semibold text-slate-400">Market Need</span>
            </div>

            <div className="flex flex-wrap gap-2">
              {stats.top_skills_demanded.map((item) => (
                <span
                  key={item.skill}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-slate-50 text-slate-700 border border-slate-200 text-xs font-medium"
                >
                  <span>{item.skill}</span>
                  <span className="w-5 h-5 rounded-full bg-slate-200 text-slate-700 text-2xs font-bold flex items-center justify-center">
                    {item.count}
                  </span>
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Requests Section */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-xs space-y-5">
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <h2 className="text-lg font-bold text-slate-900">Recent Analyzed Requirements</h2>
            <p className="text-xs text-slate-500">Latest submissions and their matched recommendations</p>
          </div>
          <Link
            href="/requests"
            className="inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:text-brand-800"
          >
            <span>View All</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="divide-y divide-slate-100">
          {stats.recent_requests.map((req) => (
            <div
              key={req.id}
              onClick={() => (window.location.href = `/requests/${req.id}`)}
              className="py-4 hover:bg-slate-50/80 rounded-xl px-2 transition-colors cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900 hover:text-brand-600 transition-colors">
                    {req.title}
                  </h3>
                  <UrgencyBadge urgency={req.urgency} size="sm" />
                </div>
                <div className="text-xs text-slate-500 mt-0.5 flex flex-wrap items-center gap-2">
                  <span>{req.ngo_name}</span>
                  <span>•</span>
                  <span>{req.location}</span>
                  <span>•</span>
                  <span className="font-medium text-slate-700">{req.category}</span>
                </div>
              </div>

              <div className="flex items-center space-x-3 shrink-0">
                <span className="text-xs font-medium text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                  {req.recommended_count} Volunteers Matched
                </span>
                <ChevronRight className="w-4 h-4 text-slate-400" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
