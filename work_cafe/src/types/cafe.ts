export interface Cafe {
  id: string;
  name: string;
  address: string;
  area: string;
  description: string;
  imageUrl: string;
  images: CafeImage[];
  priceRange: number;
  noiseLevel: "Quiet" | "Moderate" | "Loud";
  avgVisitLength: string;
  openingHours: {
    Weekdays: string;
    Weekends: string;
  };
  featured: boolean;
  menuLink: string | null;
  website: string | null;
  linkMaps: string | null;
  instagram: string | null;
  amenities: string[];
  tags: string[];
  reviews: UserReview[];
  menu: MenuItem[];
  promo: Promo[];
  rating: number;
}

export interface UserReview {
  wifiQuality: number;
  powerOutlets: number;
  comfortLevel: number;
  comment: string;
  date: string;
  user: string;
}

export interface MenuItem {
  name: string;
  category: string;
  priceIDR: number;
  specialty: boolean;
}

export interface Promo {
  id: number | string;
  title: string;
  description: string;
  valid_until: string;
  icon: string;
  start_date: string;
}

export interface CafeImage {
  id?: number;
  image_url: string;
  is_primary: boolean;
}

export interface CafeFilter {
  search: string;
  area: string;
  minRating: number;
  priceRange: 1 | 2 | 3;
  amenities: string[];
  openNow: boolean;
}

export interface CafeImage {
  id?: number;
  image_url: string;
  is_primary: boolean;
}


export const kecamatanOptions = [
  "Banyumanik",
  "Candisari",
  "Gajahmungkur",
  "Gayamsari",
  "Genuk",
  "Gunungpati",
  "Mijen",
  "Ngaliyan",
  "Pedurungan",
  "Semarang Barat",
  "Semarang Selatan",
  "Semarang Tengah",
  "Semarang Timur",
  "Semarang Utara",
  "Tembalang",
  "Tugu",
];

export const noiseOptions: Cafe["noiseLevel"][] = ["Quiet", "Moderate", "Loud"];
export const visitLengthOptions = [
  "1-2 hours",
  "2-3 hours",
  "3-4 hours",
  "4-6 hours",
  "6+ hours",
];
export const allAmenities = [
  "High-Speed WiFi",
  "Power Outlets",
  "Air Conditioning",
  "Coffee",
  "Snacks",
  "Outdoor Seating",
  "Meeting Room",
  "Printing Services",
  "Prayer Room",
];
export const validIcons = ["coffee", "book", "laptop"];
export const API_BASE_URL = "http://localhost/cafeind_api/api";

export interface Promotion {
  id: number;
  cafeId: string;
  cafeName: string;
  title: string;
  description: string;
  valid_until: string;
  icon: string;
  start_date?: string;
}
