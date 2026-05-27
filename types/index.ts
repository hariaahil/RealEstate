export type AgentRole = 'agent' | 'admin';

export type UserRole = 'user' | 'agent' | 'admin';

export type PlatformSettings = {
  id: string;
  enable_google_login: boolean;
  enable_otp_login: boolean;
  enable_email_login: boolean;
  enable_customer_signup: boolean;
  enable_agent_signup: boolean;
  maintenance_mode: boolean;
  created_at: string;
};

export type Agent = {
  id: string;
  user_id?: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  area_specialization: string[];
  profile_image: string;
  bio: string;
  role: AgentRole;
  status?: 'pending' | 'approved' | 'rejected';
  created_at: string;
};

export type PropertyStatus = 'pending' | 'approved' | 'rejected';
export type PropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Office' | 'Retail' | 'PG' | 'Commercial';
export type ListingCategory = 'sale' | 'rent';
export type Furnishing = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';
export type TenantPreference = 'Family' | 'Bachelors' | 'Couples' | 'Professionals' | 'Students';

export type Property = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  listing_category: ListingCategory;
  property_type: PropertyType;
  bhk: number;
  sqft: number;
  locality: string;
  city: string;
  address_approx: string;
  amenities: string[];
  latitude: number;
  longitude: number;
  featured: boolean;
  verified: boolean;
  status: PropertyStatus;
  agent_id: string;
  furnishing: Furnishing;
  parking?: number;
  deposit_amount?: number;
  monthly_rent?: number;
  available_from?: string;
  tenant_preference?: TenantPreference[];
  pets_allowed?: boolean;
  parking_available?: boolean;
  property_age?: string;
  bathrooms?: number;
  balcony?: number;
  occupied?: boolean;
  views?: number;
  owner_contact?: string;
  created_at: string;
  image_url?: string;
};

export type PropertyImage = {
  id: string;
  property_id: string;
  image_url: string;
};

export type PropertyVideo = {
  id: string;
  property_id: string;
  video_url: string;
};

export type InquiryStatus = 'new' | 'contacted' | 'qualified' | 'closed';

export type Inquiry = {
  id: string;
  property_id: string;
  buyer_name: string;
  buyer_phone: string;
  buyer_email: string;
  message: string;
  inquiry_status: InquiryStatus;
  assigned_agent_id: string;
  created_at: string;
};

export type RentalInquiry = {
  id: string;
  property_id: string;
  tenant_name: string;
  tenant_phone: string;
  occupation: string;
  budget: number;
  family_type: TenantPreference;
  move_in_date: string;
  assigned_agent_id: string;
  inquiry_status: InquiryStatus;
  created_at: string;
};

export type ContactUnlock = {
  id: string;
  user_id: string;
  property_id: string;
  amount_paid: number;
  payment_status: 'pending' | 'paid' | 'failed';
  unlocked_at: string;
};

export type Favorite = {
  id: string;
  user_id: string;
  property_id: string;
};

export type PropertyFilter = {
  locality?: string;
  propertyType?: PropertyType;
  bhk?: number;
  minPrice?: number;
  maxPrice?: number;
  minSqft?: number;
  maxSqft?: number;
  furnishing?: Furnishing;
  parking?: number;
};
