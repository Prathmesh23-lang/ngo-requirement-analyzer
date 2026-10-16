'use client';

import React, { useEffect, useState } from 'react';
import { 
  Users, 
  Search, 
  Plus, 
  MapPin, 
  Calendar, 
  Award, 
  Mail, 
  Filter, 
  X,
  CheckCircle2,
  Sparkles
} from 'lucide-react';
import { api } from '@/lib/api';
import { Volunteer } from '@/lib/types';
import SkillBadge from '@/components/SkillBadge';
import VolunteerModal from '@/components/VolunteerModal';
import EmptyState from '@/components/EmptyState';
import Toast, { ToastMessage } from '@/components/Toast';

export default function VolunteersPage() {
  const [volunteers, setVolunteers] = useState<Volunteer[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('All');
  const [selectedAvailability, setSelectedAvailability] = useState('All');
  const [selectedSkill, setSelectedSkill] = useState('All');
  const [minExp, setMinExp] = useState<number>(0);

  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [toast, setToast] = useState<ToastMessage | null>(null);

  // New Volunteer Form state
  const [newVol, setNewVol] = useState({
    name: '',
    email: '',
    phone: '',
    location: 'Pune',
    skills: 'Mathematics, Teaching',
    experience_years: 2.0,
    availability: 'Weekends',
    interests: 'Education, Community Service',
    description: '',
  });

  const locations = ['All', 'Pune', 'Mumbai', 'Bangalore', 'Delhi', 'Hyderabad', 'Kolkata', 'Ahmedabad'];
  const availabilities = ['All', 'Weekends', 'Weekdays', 'Flexible'];
  const skillsList = [
    'All',
    'Teaching',
    'Mathematics',
    'Computer Skills',
    'Communication',
    'Web Development',
    'Graphic Design',
    'Social Media Management',
    'Digital Marketing',
    'Fundraising',
    'Event Management',
    'Healthcare Assistance',
    'First Aid',
    'Environmental Awareness',
    'Community Outreach',
    'Python',
  ];

  const fetchVolunteers = async () => {
    try {
      setLoading(true);
      const data = await api.getVolunteers({
        search,
        location: selectedLocation,
        availability: selectedAvailability,
        skill: selectedSkill,
        min_exp: minExp,
      });
      setVolunteers(data);
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to load volunteers.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchVolunteers();
    }, 250);
    return () => clearTimeout(timer);
  }, [search, selectedLocation, selectedAvailability, selectedSkill, minExp]);

  const handleCreateVolunteer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newVol.name.trim() || !newVol.email.trim()) {
      setToast({ id: String(Date.now()), type: 'error', message: 'Name and email are required.' });
      return;
    }

    try {
      const skillsArr = newVol.skills.split(',').map((s) => s.trim()).filter(Boolean);
      const interestsArr = newVol.interests.split(',').map((i) => i.trim()).filter(Boolean);

      const created = await api.createVolunteer({
        name: newVol.name,
        email: newVol.email,
        phone: newVol.phone,
        location: newVol.location,
        skills: skillsArr,
        experience_years: Number(newVol.experience_years) || 0,
        availability: newVol.availability,
        interests: interestsArr,
        description: newVol.description,
        status: 'Active',
      });

      setVolunteers([created, ...volunteers]);
      setShowAddModal(false);
      setToast({
        id: String(Date.now()),
        type: 'success',
        message: `Volunteer ${created.name} registered successfully!`,
      });
      // reset form
      setNewVol({
        name: '',
        email: '',
        phone: '',
        location: 'Pune',
        skills: '',
        experience_years: 1,
        availability: 'Weekends',
        interests: '',
        description: '',
      });
    } catch (err: any) {
      setToast({
        id: String(Date.now()),
        type: 'error',
        message: err.message || 'Failed to register volunteer.',
      });
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8">
      <Toast toast={toast} onDismiss={() => setToast(null)} />

      {/* Profile Modal */}
      <VolunteerModal
        volunteer={selectedVolunteer}
        onClose={() => setSelectedVolunteer(null)}
        onContact={(vol) => {
          setToast({
            id: String(Date.now()),
            type: 'success',
            message: `Connection request sent to ${vol.name}!`,
          });
        }}
      />

      {/* Add Volunteer Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 shadow-2xl border border-slate-100 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <h3 className="text-lg font-bold text-slate-900">Register New Volunteer</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateVolunteer} className="mt-4 space-y-4 text-xs sm:text-sm">
              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={newVol.name}
                  onChange={(e) => setNewVol({ ...newVol, name: e.target.value })}
                  placeholder="e.g. Ramesh Kulkarni"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={newVol.email}
                    onChange={(e) => setNewVol({ ...newVol, email: e.target.value })}
                    placeholder="e.g. ramesh@example.com"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Phone (Optional)
                  </label>
                  <input
                    type="text"
                    value={newVol.phone}
                    onChange={(e) => setNewVol({ ...newVol, phone: e.target.value })}
                    placeholder="e.g. +91 98200 12345"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    City / Location
                  </label>
                  <input
                    type="text"
                    value={newVol.location}
                    onChange={(e) => setNewVol({ ...newVol, location: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Availability
                  </label>
                  <select
                    value={newVol.availability}
                    onChange={(e) => setNewVol({ ...newVol, availability: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  >
                    <option value="Weekends">Weekends</option>
                    <option value="Weekdays">Weekdays</option>
                    <option value="Flexible">Flexible</option>
                  </select>
                </div>
                <div>
                  <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                    Experience (Years)
                  </label>
                  <input
                    type="number"
                    step="0.5"
                    min="0"
                    value={newVol.experience_years}
                    onChange={(e) => setNewVol({ ...newVol, experience_years: parseFloat(e.target.value) || 0 })}
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                  />
                </div>
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Skills (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newVol.skills}
                  onChange={(e) => setNewVol({ ...newVol, skills: e.target.value })}
                  placeholder="e.g. Mathematics, Teaching, Communication"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Interests / Causes (Comma-separated)
                </label>
                <input
                  type="text"
                  value={newVol.interests}
                  onChange={(e) => setNewVol({ ...newVol, interests: e.target.value })}
                  placeholder="e.g. Education, Community Service"
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div>
                <label className="block text-2xs font-bold uppercase tracking-wider text-slate-600 mb-1">
                  Profile Bio / Summary
                </label>
                <textarea
                  rows={3}
                  value={newVol.description}
                  onChange={(e) => setNewVol({ ...newVol, description: e.target.value })}
                  placeholder="Describe your volunteering background, key strengths, and interests..."
                  className="w-full px-3 py-2 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20"
                />
              </div>

              <div className="pt-3 flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 rounded-xl text-slate-600 hover:text-slate-800"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-brand-600 text-white font-semibold hover:bg-brand-700 shadow-sm"
                >
                  Save Volunteer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Page Title & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-brand-50 border border-brand-200 text-brand-700 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5 text-brand-600" />
            <span>Volunteer Talent Pool</span>
          </div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">
            Volunteer Directory & Search
          </h1>
          <p className="mt-1 text-sm text-slate-600">
            Search registered volunteers by skills, location, availability, or years of experience.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-xs transition-all shrink-0"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Volunteer</span>
        </button>
      </div>

      {/* Search & Multi-Filter Bar */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs space-y-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by volunteer name, skill, email, or keywords..."
            className="w-full text-xs sm:text-sm pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-brand-500/20 focus:border-brand-500"
          />
        </div>

        {/* Dropdowns Row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Skill
            </label>
            <select
              value={selectedSkill}
              onChange={(e) => setSelectedSkill(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {skillsList.map((sk) => (
                <option key={sk} value={sk}>
                  {sk}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Location
            </label>
            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {locations.map((loc) => (
                <option key={loc} value={loc}>
                  {loc}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Availability
            </label>
            <select
              value={selectedAvailability}
              onChange={(e) => setSelectedAvailability(e.target.value)}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 bg-white focus:outline-none focus:ring-2 focus:ring-brand-500/20"
            >
              {availabilities.map((av) => (
                <option key={av} value={av}>
                  {av}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-2xs font-bold uppercase tracking-wider text-slate-400 mb-1">
              Min. Experience: {minExp} yr{minExp === 1 ? '' : 's'}
            </label>
            <input
              type="range"
              min="0"
              max="5"
              step="0.5"
              value={minExp}
              onChange={(e) => setMinExp(parseFloat(e.target.value))}
              className="w-full mt-2"
            />
          </div>
        </div>
      </div>

      {/* Volunteer Grid */}
      {loading ? (
        <div className="text-center py-16">
          <div className="w-10 h-10 border-3 border-brand-600 border-t-transparent rounded-full animate-spin mx-auto mb-3" />
          <p className="text-xs text-slate-500">Filtering volunteer database...</p>
        </div>
      ) : volunteers.length === 0 ? (
        <EmptyState
          title="No Volunteers Found"
          description="Try broadening your skill, location, or availability filter."
          actionText="Clear Filters"
          onAction={() => {
            setSearch('');
            setSelectedLocation('All');
            setSelectedAvailability('All');
            setSelectedSkill('All');
            setMinExp(0);
          }}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {volunteers.map((vol) => (
            <div
              key={vol.id}
              className="bg-white rounded-3xl border border-slate-200 p-6 shadow-xs hover:shadow-md transition-all duration-200 flex flex-col justify-between"
            >
              <div className="space-y-4">
                {/* Header */}
                <div className="flex items-start justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 rounded-2xl bg-brand-50 text-brand-700 font-bold flex items-center justify-center text-lg border border-brand-100">
                      {vol.name.charAt(0)}
                    </div>
                    <div>
                      <h3 className="font-bold text-base text-slate-900">{vol.name}</h3>
                      <span className="text-xs text-slate-500 flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-slate-400" />
                        {vol.location}
                      </span>
                    </div>
                  </div>
                  <span className="text-2xs font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                    {vol.status}
                  </span>
                </div>

                {/* Logistics */}
                <div className="flex items-center justify-between text-xs text-slate-600 bg-slate-50 p-2.5 rounded-xl border border-slate-100">
                  <span className="flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    {vol.availability}
                  </span>
                  <span className="flex items-center gap-1 font-medium">
                    <Award className="w-3.5 h-3.5 text-slate-400" />
                    {vol.experience_years} Years Exp
                  </span>
                </div>

                {/* Skills */}
                <div>
                  <span className="text-2xs font-bold uppercase tracking-wider text-slate-400 block mb-1.5">
                    Skills
                  </span>
                  <div className="flex flex-wrap gap-1">
                    {vol.skills && vol.skills.map((skill) => (
                      <SkillBadge key={skill} skill={skill} size="sm" />
                    ))}
                  </div>
                </div>

                {/* Bio */}
                {vol.description && (
                  <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                    {vol.description}
                  </p>
                )}
              </div>

              {/* Action Button */}
              <div className="pt-5 mt-4 border-t border-slate-100">
                <button
                  onClick={() => setSelectedVolunteer(vol)}
                  className="w-full py-2.5 px-4 rounded-xl bg-slate-50 hover:bg-brand-50 text-slate-700 hover:text-brand-700 font-semibold text-xs border border-slate-200 transition-colors"
                >
                  View Volunteer Profile
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
