import {
  DashboardStats,
  NGORequestDetail,
  NGORequestListItem,
  NGORequestCreatePayload,
  AnalysisResult,
  Volunteer,
} from './types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000';

class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

async function request<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const url = `${API_BASE}${endpoint}`;
  try {
    const res = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...(options?.headers || {}),
      },
      ...options,
    });

    if (!res.ok) {
      let errMsg = `Request failed with status ${res.status}`;
      try {
        const errJson = await res.json();
        errMsg = errJson.detail || errMsg;
      } catch {
        // fallback to text or status message
      }
      throw new ApiError(errMsg, res.status);
    }

    if (res.status === 204) {
      return {} as T;
    }

    return await res.json();
  } catch (error: any) {
    if (error instanceof ApiError) throw error;
    throw new ApiError(error.message || 'Unable to connect to server. Ensure backend is running.', 503);
  }
}

export const api = {
  // Dashboard
  getDashboardStats: () => request<DashboardStats>('/api/dashboard/stats'),

  // NGO Requests
  getRequests: (params?: { category?: string; urgency?: string; search?: string }) => {
    const query = new URLSearchParams();
    if (params?.category && params.category !== 'All') query.append('category', params.category);
    if (params?.urgency && params.urgency !== 'All') query.append('urgency', params.urgency);
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();
    return request<NGORequestListItem[]>(`/api/requests${qs ? `?${qs}` : ''}`);
  },

  getRequestDetail: (id: number | string) => request<NGORequestDetail>(`/api/requests/${id}`),

  submitRequest: (payload: NGORequestCreatePayload) =>
    request<NGORequestDetail>('/api/requests', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  reanalyzeRequest: (id: number | string) =>
    request<NGORequestDetail>(`/api/requests/${id}/analyze`, {
      method: 'POST',
    }),

  deleteRequest: (id: number | string) =>
    request<void>(`/api/requests/${id}`, {
      method: 'DELETE',
    }),

  previewAnalysis: (payload: { title: string; description: string; optional_skills?: string[]; urgency?: string }) =>
    request<AnalysisResult>('/api/requests/analyze-preview', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),

  // Volunteers
  getVolunteers: (params?: {
    skill?: string;
    location?: string;
    availability?: string;
    min_exp?: number;
    search?: string;
  }) => {
    const query = new URLSearchParams();
    if (params?.skill && params.skill !== 'All') query.append('skill', params.skill);
    if (params?.location && params.location !== 'All') query.append('location', params.location);
    if (params?.availability && params.availability !== 'All') query.append('availability', params.availability);
    if (params?.min_exp !== undefined && params.min_exp > 0) query.append('min_exp', String(params.min_exp));
    if (params?.search) query.append('search', params.search);
    const qs = query.toString();
    return request<Volunteer[]>(`/api/volunteers${qs ? `?${qs}` : ''}`);
  },

  getVolunteerDetail: (id: number | string) => request<Volunteer>(`/api/volunteers/${id}`),

  createVolunteer: (payload: Partial<Volunteer>) =>
    request<Volunteer>('/api/volunteers', {
      method: 'POST',
      body: JSON.stringify(payload),
    }),
};
