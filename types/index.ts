// ==========================================
// USER ROLES
// ==========================================
export type UserRole = 'admin' | 'broker' | 'customer';

// ==========================================
// STATUS ENUMS
// ==========================================
export type ApprovalStatus = 'pending' | 'approved' | 'rejected';
export type ListingCategory = 'sale' | 'rent';
export type InquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed';
export type PaymentStatus = 'pending' | 'paid' | 'failed';

// ==========================================
// PROPERTY TYPES
// ==========================================
export type PropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Office' | 'Retail' | 'PG' | 'Commercial';
export type FurnishingType = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type FamilyType = 'Family' | 'Bachelors' | 'Couples' | 'Professionals' | 'Students';

// ==========================================
// DATABASE TYPES
// ==========================================

export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  avatar_url: string | null;
  is_verified: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
}

export interface Agent {
  id: string;
  profile_id: string | null;
  name: string;
  email: string;
  phone: string;
  whatsapp: string | null;
  area_specialization: string[] | null;
  profile_image: string | null;
  bio: string | null;
  license_number: string | null;
  experience_years: number | null;
  rating: number | null;
  total_sales: number;
  is_featured: boolean;
  status: ApprovalStatus;
  created_at: string;
  updated_at: string;
  profiles?: Profile;
}

export interface Property {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  price: number;
  listing_category: ListingCategory;
  property_type: PropertyType | null;
  bhk: number | null;
  sqft: number | null;
  locality: string;
  city: string;
  address_approx: string | null;
  amenities: string[] | null;
  latitude: number | null;
  longitude: number | null;
  featured: boolean;
  verified: boolean;
  status: ApprovalStatus;
  agent_id: string | null;
  furnishing: FurnishingType | null;
  monthly_rent: number | null;
  deposit_amount: number | null;
  available_from: string | null;
  tenant_preference: string[] | null;
  pets_allowed: boolean;
  parking_available: boolean;
  property_age: string | null;
  bathrooms: number | null;
  balcony: number | null;
  occupied: boolean;
  views: number;
  owner_contact: string | null;
  parking: number | null;
  created_at: string;
  updated_at: string;
  agents?: Agent;
  property_images?: PropertyImage[];
  property_videos?: PropertyVideo[];
}

export interface PropertyImage {
  id: string;
  property_id: string;
  image_url: string;
  is_primary: boolean;
  created_at: string;
  properties?: Property;
}

export interface PropertyVideo {
  id: string;
  property_id: string;
  video_url: string;
  created_at: string;
  properties?: Property;
}

export interface Inquiry {
  id: string;
  property_id: string | null;
  user_id: string | null;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  message: string | null;
  inquiry_status: InquiryStatus;
  assigned_agent_id: string | null;
  created_at: string;
  updated_at: string;
  properties?: Property;
  profiles?: Profile;
  agents?: Agent;
}

export interface RentalInquiry {
  id: string;
  property_id: string | null;
  user_id: string | null;
  tenant_name: string;
  tenant_phone: string;
  occupation: string;
  budget: number | null;
  family_type: FamilyType | null;
  move_in_date: string | null;
  assigned_agent_id: string | null;
  inquiry_status: InquiryStatus;
  created_at: string;
  updated_at: string;
  properties?: Property;
  profiles?: Profile;
  agents?: Agent;
}

export interface Favorite {
  id: string;
  user_id: string;
  property_id: string;
  created_at: string;
  profiles?: Profile;
  properties?: Property;
}

export interface ContactUnlock {
  id: string;
  user_id: string | null;
  property_id: string | null;
  amount_paid: number;
  payment_status: PaymentStatus;
  unlocked_at: string;
  profiles?: Profile;
  properties?: Property;
}

export interface Notification {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: 'inquiry' | 'approval' | 'system' | 'payment';
  is_read: boolean;
  created_at: string;
  profiles?: Profile;
}

export interface PlatformSettings {
  id: string;
  enable_google_login: boolean;
  enable_otp_login: boolean;
  enable_email_login: boolean;
  enable_customer_signup: boolean;
  enable_agent_signup: boolean;
  maintenance_mode: boolean;
  created_at: string;
}

// ==========================================
// API RESPONSE TYPES
// ==========================================

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// ==========================================
// AUTH TYPES
// ==========================================

export interface SignUpData {
  email: string;
  password: string;
  full_name: string;
  phone: string;
  role?: UserRole;
}

export interface SignInData {
  email: string;
  password: string;
}

export interface BrokerRegistrationData {
  name: string;
  email: string;
  phone: string;
  whatsapp?: string;
  license_number?: string;
  experience_years?: number;
  bio?: string;
  area_specialization?: string[];
}

// ==========================================
// FILTER & SEARCH TYPES
// ==========================================

export interface PropertyFilters {
  listing_category?: ListingCategory;
  property_type?: PropertyType;
  min_price?: number;
  max_price?: number;
  min_bhk?: number;
  max_bhk?: number;
  min_sqft?: number;
  max_sqft?: number;
  locality?: string;
  city?: string;
  furnishing?: FurnishingType;
  status?: ApprovalStatus;
  featured?: boolean;
  verified?: boolean;
}

export interface PropertySort {
  field: 'price' | 'created_at' | 'views' | 'bhk' | 'sqft';
  order: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
  filters?: PropertyFilters;
  sort?: PropertySort;
  page?: number;
  pageSize?: number;
}

// ==========================================
// FORM TYPES
// ==========================================

export interface PropertyFormData {
  title: string;
  description?: string;
  price: number;
  listing_category: ListingCategory;
  property_type: PropertyType;
  bhk?: number;
  sqft?: number;
  locality: string;
  city: string;
  address_approx?: string;
  amenities?: string[];
  latitude?: number;
  longitude?: number;
  furnishing?: FurnishingType;
  monthly_rent?: number;
  deposit_amount?: number;
  available_from?: string;
  tenant_preference?: string[];
  pets_allowed?: boolean;
  parking_available?: boolean;
  bathrooms?: number;
  balcony?: number;
  parking?: number;
}

export interface InquiryFormData {
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  message?: string;
}

export interface RentalInquiryFormData {
  tenant_name: string;
  tenant_phone: string;
  occupation: string;
  budget?: number;
  family_type?: FamilyType;
  move_in_date?: string;
}

// ==========================================
// DASHBOARD TYPES
// ==========================================

export interface DashboardStats {
  totalProperties: number;
  activeProperties: number;
  pendingProperties: number;
  totalInquiries: number;
  newInquiries: number;
  totalFavorites: number;
  totalViews: number;
  totalSales?: number;
  totalRevenue?: number;
}

export interface BrokerDashboardStats extends DashboardStats {
  approvedProperties: number;
  rejectedProperties: number;
  contactedInquiries: number;
  qualifiedInquiries: number;
  closedInquiries: number;
}

export interface AdminDashboardStats extends DashboardStats {
  totalUsers: number;
  totalBrokers: number;
  pendingBrokers: number;
  approvedBrokers: number;
  rejectedBrokers: number;
}
