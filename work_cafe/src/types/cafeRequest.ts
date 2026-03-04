export interface CafeRequest {
  id?: number;
  name: string;
  address: string;
  area: string;
  description: string;
  submitter_name: string;
  submitter_email: string;
  submitter_phone?: string;
  image_urls: string[];
  price_range: number;
  noise_level: "Quiet" | "Moderate" | "Loud";
  avg_visit_length: string;
  opening_hours: {
    Weekdays: string;
    Weekends: string;
  };
  website?: string;
  instagram?: string;
  amenities: string[];
  tags: string[];
  additional_notes?: string;
  status: "pending" | "approved" | "rejected";
  admin_notes?: string;
  submitted_at: string;
  reviewed_at?: string;
  reviewed_by?: string;
}

export const API_BASE_URL = "http://localhost/cafeind_api/api";