export type AgentRole = 'agent' | 'admin';

export type Agent = {
  id: string;
  name: string;
  email: string;
  phone: string;
  whatsapp: string;
  area_specialization: string[];
  profile_image: string;
  bio: string;
  role: AgentRole;
};

export type PropertyStatus = 'pending' | 'approved' | 'rejected';
export type PropertyType = 'Apartment' | 'Villa' | 'Plot' | 'Office' | 'Retail';
export type Furnishing = 'Furnished' | 'Semi-Furnished' | 'Unfurnished';

export type Property = {
  id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
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
  parking: number;
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
