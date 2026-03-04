export interface PendingReview {
  id?: number;
  cafe_id: number;
  wifi_quality: number;
  power_outlets: number;
  comfort_level: number;
  comment: string;
  user_id: string;
  status: 'pending' | 'approved' | 'rejected';
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
  admin_notes?: string;
}

export interface ApprovedReview {
  id: number;
  cafe_id: number;
  wifi_quality: number;
  power_outlets: number;
  comfort_level: number;
  comment: string;
  date: string;
  user: string;
}

export interface ReviewStats {
  total: number;
  pending: number;
  approved: number;
  rejected: number;
}