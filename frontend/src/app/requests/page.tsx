'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { 
  History, 
  Search, 
  PlusCircle, 
  ChevronRight, 
  Building2, 
  MapPin, 
  Calendar, 
  Users, 
  Sparkles,
  Trash2
} from 'lucide-react';
import { api } from '@/lib/api';
import { NGORequestListItem } from '@/lib/types';
import UrgencyBadge from '@/components/UrgencyBadge';
import EmptyState from '@/components/EmptyState';
import Toast, { ToastMessage } from '@/components/Toast';

export default function RequestHistoryPage() {
  const [requests, setRequests] = useState<NGORequestListItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedUrgency, setSelectedUrgency] = useState('All');
  const [toast, setToast] = useState<ToastMessage | null>(null);

  const categories = [
    'All',
    'Education',
    'Healthcare',
    'Environment',
    'Technology',
    'Community Service',
    'Fundraising',
    'Marketing & Social Media',
  ];

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const data = await api.getRequests({
        category: selectedCategory,
        urgency: selectedUrgency,
        search,
      });
      setRequests(data);
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to fetch request history.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      fetchRequests();
    }, 250);

    return () => clearTimeout(delayDebounceFn);
  }, [search, selectedCategory, selectedUrgency]);

  const handleDelete = async (e: React.MouseEvent, reqId: number) => {
    e.preventDefault();
    e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this NGO request?')) return;

    try {
      await api.deleteRequest(reqId);
      setRequests(requests.filter((r) => r.id !== reqId));
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: 'Request deleted successfully.',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to delete request.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
            <History className="w-3.5 h-3.5 text-brand-600" />
            <span>Audit & Submission History</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            NGO Request History
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Browse and inspect all past requirements, AI classifications, and volunteer recommendations.
          </p>
        </div>

        <Link
          href="/analyze"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-all shrink-0"
        >
          <PlusCircle className="w-4 h-4" />
          <span>New NGO Request</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex flex-col md:flex-row gap-3">
        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by request title or NGO name..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Category Dropdown */}
        <div className="w-full md:w-56">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
          >
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                Category: {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Urgency Dropdown */}
        <div className="w-full md:w-44">
          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="w-full text-xs sm:text-sm px-3.5 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500 bg-white"
          >
            <option value="All">Urgency: All</option>
            <option value="High">High Priority</option>
            <option value="Medium">Medium Priority</option>
            <option value="Low">Low Priority</option>
          </select>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Loading requests...</p>
        </div>
      ) : requests.length === 0 ? (
        <EmptyState
          title="No NGO Requests Found"
          description="Try adjusting your search criteria or submit a new requirement."
          actionText="Submit New Request"
          actionHref="/analyze"
        />
      ) : (
        <div className="bg-white rounded-3xl border border-slate-200 shadow-xs overflow-hidden">
          {/* Table for Desktop */}
          <div className="hidden lg:block overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50/70 text-2xs font-bold uppercase tracking-wider text-slate-500">
                  <th className="py-4 px-6">Request / NGO</th>
                  <th className="py-4 px-4">Category</th>
                  <th className="py-4 px-4">Urgency</th>
                  <th className="py-4 px-4">Location</th>
                  <th className="py-4 px-4">Volunteers</th>
                  <th className="py-4 px-4">Status</th>
                  <th className="py-4 px-6 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-xs sm:text-sm">
                {requests.map((req) => (
                  <tr
                    key={req.id}
                    onClick={() => (window.location.href = `/requests/${req.id}`)}
                    className="hover:bg-slate-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-900 group-hover:text-brand-700 transition-colors">
                        {req.title}
                      </div>
                      <div className="text-xs text-slate-500 flex items-center gap-1.5 mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-400" />
                        <span>{req.ngo_name}</span>
                      </div>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-medium text-slate-800">
                        {req.category || 'Education'}
                      </span>
                      {req.subcategory && (
                        <span className="block text-2xs text-slate-400 mt-0.5">
                          {req.subcategory}
                        </span>
                      )}
                    </td>

                    <td className="py-4 px-4">
                      <UrgencyBadge urgency={req.urgency} size="sm" />
                    </td>

                    <td className="py-4 px-4 text-slate-600">
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {req.location}
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="font-semibold text-slate-800">
                        {req.volunteers_required} Needed
                      </span>
                      <span className="block text-2xs text-emerald-600 font-medium">
                        {req.recommended_count} Recommended
                      </span>
                    </td>

                    <td className="py-4 px-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-2xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                        {req.status}
                      </span>
                    </td>

                    <td className="py-4 px-6 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Link
                          href={`/requests/${req.id}`}
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-brand-50 hover:bg-brand-100 text-brand-700 font-medium text-xs transition-colors"
                        >
                          <span>View Analysis</span>
                          <ChevronRight className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={(e) => handleDelete(e, req.id)}
                          className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                          title="Delete Request"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Cards for Mobile/Tablet */}
          <div className="lg:hidden divide-y divide-slate-100">
            {requests.map((req) => (
              <div
                key={req.id}
                onClick={() => (window.location.href = `/requests/${req.id}`)}
                className="p-5 hover:bg-slate-50 transition-colors cursor-pointer space-y-3"
              >
                <div className="flex items-start justify-between gap-2">
                  <div>
                    <h3 className="font-bold text-base text-slate-900">{req.title}</h3>
                    <p className="text-xs text-slate-500 mt-0.5">{req.ngo_name} • {req.location}</p>
                  </div>
                  <UrgencyBadge urgency={req.urgency} size="sm" />
                </div>

                <div className="flex flex-wrap items-center gap-2 text-xs text-slate-600">
                  <span className="px-2 py-0.5 rounded bg-slate-100 font-medium text-slate-700">
                    {req.category}
                  </span>
                  <span>•</span>
                  <span>{req.volunteers_required} Volunteers Required</span>
                  <span>•</span>
                  <span className="text-emerald-600 font-medium">{req.recommended_count} Matches</span>
                </div>

                <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
                  <span className="text-2xs text-slate-400">
                    {new Date(req.created_at).toLocaleDateString()}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-brand-600 font-semibold flex items-center gap-1">
                      View Results <ChevronRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
