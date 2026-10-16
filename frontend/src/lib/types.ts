export interface Volunteer {
  id: number;
  name: string;
  email: string;
  phone?: string;
  location: string;
  skills: string[];
  experience_years: number;
  availability: string;
  interests: string[];
  description?: string;
  status: string;
  created_at: string;
}

export interface ScoreBreakdown {
  skill_score: number;
  location_score: number;
  availability_score: number;
  experience_score: number;
  interest_score: number;
  total_score: number;
}

export interface Recommendation {
  id?: number;
  request_id?: number;
  volunteer_id: number;
  match_score: number;
  matched_skills: string[];
  match_reasons: string[];
  score_breakdown: ScoreBreakdown;
  rank: number;
  created_at?: string;
  volunteer?: Volunteer;
}

export interface AnalysisResult {
  id?: number;
  request_id?: number;
  category: string;
  subcategory?: string;
  extracted_skills: string[];
  urgency: 'Low' | 'Medium' | 'High';
  urgency_reason?: string;
  category_confidence: number;
  summary?: string;
  analysis_method: string;
  created_at?: string;
}

export interface NGORequestDetail {
  id: number;
  ngo_name: string;
  ngo_email: string;
  location: string;
  title: string;
  description: string;
  volunteers_required: number;
  duration?: string;
  expected_date?: string;
  availability?: string;
  urgency: 'Low' | 'Medium' | 'High';
  category?: string;
  subcategory?: string;
  status: string;
  created_at: string;
  analysis?: AnalysisResult;
  recommendations: Recommendation[];
}

export interface NGORequestListItem {
  id: number;
  ngo_name: string;
  ngo_email: string;
  location: string;
  title: string;
  volunteers_required: number;
  duration?: string;
  expected_date?: string;
  availability?: string;
  urgency: 'Low' | 'Medium' | 'High';
  category?: string;
  subcategory?: string;
  status: string;
  created_at: string;
  recommended_count: number;
}

export interface NGORequestCreatePayload {
  ngo_name: string;
  ngo_email: string;
  location: string;
  title: string;
  description: string;
  volunteers_required: number;
  duration?: string;
  expected_date?: string;
  availability?: string;
  optional_skills?: string[];
  urgency?: string;
}

export interface DashboardStats {
  total_requests: number;
  analyzed_requests: number;
  volunteers_recommended: number;
  high_priority_requests: number;
  total_volunteers: number;
  active_volunteers: number;
  requests_by_category: {
    category: string;
    count: number;
    percentage: number;
  }[];
  requests_by_urgency: {
    urgency: string;
    count: number;
    percentage: number;
  }[];
  top_skills_demanded: {
    skill: string;
    count: number;
  }[];
  recent_requests: NGORequestListItem[];
}
