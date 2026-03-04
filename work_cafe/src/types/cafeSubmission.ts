export interface CafeSubmissionData {
  // Basic Information (Step 1)
  name: string;
  address: string;
  area: string;
  description: string;
  
  // Your Information (Step 2)
  submitter_name: string;
  submitter_email: string;
  submitter_phone?: string;
  
  // Cafe Details (Step 3)
  price_range: number;
  noise_level: 'Quiet' | 'Moderate' | 'Loud';
  avg_visit_length: string;
  opening_hours: {
    weekdays: string;
    weekends: string;
  };
  website?: string;
  instagram?: string;
  amenities: string[];
  tags: string[];
  
  // Upload & Notes (Step 4)
  image_urls: string[];
  additional_notes?: string;
  
  // System fields
  isFinal?: boolean;
  submitted_at?: string;
}

export interface UploadedImage {
  url: string;
  cloudinary_public_id: string;
  file: File;
}

export const AREAS = [
  'Semarang Timur',
  'Semarang Barat', 
  'Semarang Selatan',
  'Semarang Utara',
  'Semarang Tengah',
  'Candisari',
  'Gajahmungkur',
  'Gayamsari',
  'Genuk',
  'Gunungpati',
  'Mijen',
  'Ngaliyan',
  'Pedurungan',
  'Tembalang',
  'Tugu',
  'Banyumanik'
];

export const DEFAULT_AMENITIES = [
  'High-Speed WiFi',
  'Power Outlets',
  'Air Conditioning',
  'Coffee',
  'Snacks',
  'Meeting Room',
  'Outdoor Seating',
  'Prayer Room',
  'Printing Services',
];

export const DEFAULT_TAGS = [
  'Cozy',
  'WFC',
  'Instagrammable',
  'Meeting Friendly',
  'Coworking Space',
  '24 Hours',
];

export const API_BASE_URL = 'https://cafeind.my.id/cafeind_api/api';