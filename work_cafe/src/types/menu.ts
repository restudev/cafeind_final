export interface MenuItem {
  id?: number;
  cafe_id?: number;
  name: string;
  category: string;
  priceIDR: number;
  specialty: boolean;
  cafe_name?: string;
}

export const menuCategories = ["Select", "Coffee & Beverage", "Brunch & Meal", "Bakery & Pastry"];

export const API_BASE_URL = "http://localhost/cafeind_api/api";
export interface Cafe {
  id: number;
  name: string;
  address: string;
  area: string;
  description: string;
  image_url?: string;
  price_range: number;
  noise_level: "Quiet" | "Moderate" | "Loud";
  avg_visit_length: string;
  opening_hours: Record<string, string>;
  featured: boolean;
  menu_link?: string;
  website?: string;
  link_maps?: string;
  instagram?: string;
  amenities: string[];
  tags: string[];
  created_date: string;
}
