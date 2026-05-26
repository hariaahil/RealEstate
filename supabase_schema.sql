-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

-- 1. Create Agents Table
create table if not exists public.agents (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  email text not null,
  phone text not null,
  whatsapp text,
  area_specialization text[], -- Array of strings for areas
  profile_image text,
  bio text,
  role text default 'agent' check (role in ('agent', 'admin')),
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 2. Create Properties Table
create table if not exists public.properties (
  id uuid default uuid_generate_v4() primary key,
  title text not null,
  slug text unique not null,
  description text,
  price numeric not null,
  listing_category text default 'sale' check (listing_category in ('sale', 'rent')),
  property_type text check (property_type in ('Apartment', 'Villa', 'Plot', 'Office', 'Retail', 'PG', 'Commercial')),
  bhk integer,
  sqft integer,
  locality text not null,
  city text not null,
  address_approx text,
  amenities text[], -- Array of strings
  latitude numeric,
  longitude numeric,
  featured boolean default false,
  verified boolean default false,
  status text default 'pending' check (status in ('pending', 'approved', 'rejected')),
  agent_id uuid references public.agents(id),
  furnishing text check (furnishing in ('Furnished', 'Semi-Furnished', 'Unfurnished')),
  monthly_rent numeric,
  deposit_amount numeric,
  available_from date,
  tenant_preference text[],
  pets_allowed boolean default false,
  parking_available boolean default false,
  property_age text,
  bathrooms integer,
  balcony integer,
  occupied boolean default false,
  views integer default 0,
  owner_contact text,
  parking integer,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 3. Create Property Images Table
create table if not exists public.property_images (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade,
  image_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 4. Create Property Videos Table
create table if not exists public.property_videos (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id) on delete cascade,
  video_url text not null,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 5. Create Inquiries Table
create table if not exists public.inquiries (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id),
  buyer_name text not null,
  buyer_phone text not null,
  buyer_email text not null,
  message text,
  inquiry_status text default 'new' check (inquiry_status in ('new', 'contacted', 'qualified', 'closed')),
  assigned_agent_id uuid references public.agents(id),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 6. Create Favorites Table
create table if not exists public.favorites (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  property_id uuid references public.properties(id) on delete cascade,
  created_at timestamp with time zone default timezone('utc'::text, now()),
  unique(user_id, property_id)
);

-- 7. Create Contact Unlocks Table
create table if not exists public.contact_unlocks (
  id uuid default uuid_generate_v4() primary key,
  user_id text not null,
  property_id uuid references public.properties(id) on delete cascade,
  amount_paid numeric not null,
  payment_status text default 'pending' check (payment_status in ('pending', 'paid', 'failed')),
  unlocked_at timestamp with time zone default timezone('utc'::text, now())
);

-- 8. Create Rental Inquiries Table
create table if not exists public.rental_inquiries (
  id uuid default uuid_generate_v4() primary key,
  property_id uuid references public.properties(id),
  tenant_name text not null,
  tenant_phone text not null,
  occupation text not null,
  budget numeric,
  family_type text check (family_type in ('Family', 'Bachelors', 'Couples', 'Professionals', 'Students')),
  move_in_date date,
  assigned_agent_id uuid references public.agents(id),
  inquiry_status text default 'new' check (inquiry_status in ('new', 'contacted', 'qualified', 'closed')),
  created_at timestamp with time zone default timezone('utc'::text, now())
);

-- 9. Create Platform Settings Table
create table if not exists public.platform_settings (
  id uuid default uuid_generate_v4() primary key,
  enable_google_login boolean default true,
  enable_otp_login boolean default true,
  enable_email_login boolean default true,
  enable_customer_signup boolean default true,
  enable_agent_signup boolean default false,
  maintenance_mode boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now())
);

alter table public.platform_settings enable row level security;
create policy "Allow public read access to platform settings" on public.platform_settings for select using (true);
create policy "Allow public update to platform settings" on public.platform_settings for update using (true) with check (true);

-- Ensure one default settings row exists
insert into public.platform_settings (enable_google_login, enable_otp_login, enable_email_login, enable_customer_signup, enable_agent_signup, maintenance_mode)
select true, true, true, true, false, false
where not exists (select 1 from public.platform_settings);

-- Enable Row Level Security (RLS)
alter table public.agents enable row level security;
alter table public.properties enable row level security;
alter table public.property_images enable row level security;
alter table public.property_videos enable row level security;
alter table public.inquiries enable row level security;
alter table public.favorites enable row level security;
alter table public.contact_unlocks enable row level security;
alter table public.rental_inquiries enable row level security;

-- Create Policies to allow public read access (for this demo)
create policy "Allow public read access to agents" on public.agents for select using (true);
create policy "Allow public read access to properties" on public.properties for select using (true);
create policy "Allow public read access to property images" on public.property_images for select using (true);
create policy "Allow public read access to property videos" on public.property_videos for select using (true);
create policy "Allow public insert to inquiries" on public.inquiries for insert with check (true);
create policy "Allow public read access to favorites" on public.favorites for select using (true);
create policy "Allow public insert to favorites" on public.favorites for insert with check (true);
create policy "Allow public delete from favorites" on public.favorites for delete using (true);
create policy "Allow public insert to contact unlocks" on public.contact_unlocks for insert with check (true);
create policy "Allow public read access to contact unlocks" on public.contact_unlocks for select using (true);
create policy "Allow public insert to rental inquiries" on public.rental_inquiries for insert with check (true);
create policy "Allow public read access to rental inquiries" on public.rental_inquiries for select using (true);

-- Optional: Allow public write for demo purposes (Remove in production)
create policy "Allow public insert to agents" on public.agents for insert with check (true);
create policy "Allow public insert to properties" on public.properties for insert with check (true);
create policy "Allow public insert to property images" on public.property_images for insert with check (true);
create policy "Allow public insert to property videos" on public.property_videos for insert with check (true);

-- ==========================================
-- INSERT TEST DATA
-- ==========================================

-- Insert Agents
insert into public.agents (name, email, phone, whatsapp, area_specialization, profile_image, bio, role) values
('Ashwin Rao', 'ashwin@hydpropertyhub.com', '+91 91234 56789', '+919123456789', ARRAY['Gachibowli', 'Hitech City', 'Financial District'], 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=200&h=200', 'Premium Hyderabad advisor with decade-long experience in luxury apartments and gated communities.', 'agent'),
('Sana Mehta', 'sana@hydpropertyhub.com', '+91 98765 43210', '+919876543210', ARRAY['Kondapur', 'Madhapur', 'Miyapur'], 'https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&q=80&w=200&h=200', 'Verified local expert for tech suburbs and contemporary homes in Hyderabad.', 'agent'),
('Ravi Kulkarni', 'ravi@hydpropertyhub.com', '+91 99887 66554', '+919988766554', ARRAY['Kukatpally', 'Miyapur', 'Madhapur'], 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&q=80&w=200&h=200', 'Focused on high-value investor-ready homes with trusted advisory and seamless booking.', 'agent'),
('Leela Sharma', 'leela@hydpropertyhub.com', '+91 90123 45678', '+919012345678', ARRAY['Gachibowli', 'Kondapur', 'Hitech City'], 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&q=80&w=200&h=200', 'Luxury residential specialist with a warm approach to premium buyers.', 'agent'),
('Veer Kapoor', 'veer@hydpropertyhub.com', '+91 93456 78901', '+919345678901', ARRAY['Financial District', 'Kondapur', 'Hitech City'], 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=200&h=200', 'Data-driven property advisor for investors seeking strategic Hyderabad assets.', 'agent');

-- Insert Properties using DO block to reference agent IDs
DO $$
DECLARE
  agent1 uuid;
  agent2 uuid;
  agent3 uuid;
  agent4 uuid;
  agent5 uuid;
BEGIN
  SELECT id INTO agent1 FROM public.agents WHERE name = 'Ashwin Rao';
  SELECT id INTO agent2 FROM public.agents WHERE name = 'Sana Mehta';
  SELECT id INTO agent3 FROM public.agents WHERE name = 'Ravi Kulkarni';
  SELECT id INTO agent4 FROM public.agents WHERE name = 'Leela Sharma';
  SELECT id INTO agent5 FROM public.agents WHERE name = 'Veer Kapoor';

  INSERT INTO public.properties (title, slug, description, price, property_type, bhk, sqft, locality, city, address_approx, amenities, latitude, longitude, featured, verified, status, agent_id, furnishing, parking) VALUES
  ('Skyline Luxury 3BHK with Club Access', 'skyline-luxury-3bhk-gachibowli', 'A premium 3BHK residence with panoramic views, designer finishes, and private concierge services close to the Financial District.', 18500000, 'Apartment', 3, 1800, 'Gachibowli', 'Hyderabad', 'Near Hitech City Road, Gachibowli', ARRAY['Clubhouse', 'Infinity Pool', 'Gym', 'Power Backup', 'Private Lounge'], 17.4447, 78.3914, true, true, 'approved', agent1, 'Furnished', 2),
  
  ('Designer 2BHK in Kondapur Tech Hub', 'designer-2bhk-kondapur', 'An elegant 2BHK apartment with premium finishes, smart home integration, and easy access to corporate campuses.', 11200000, 'Apartment', 2, 1250, 'Kondapur', 'Hyderabad', 'Green Valley Road, Kondapur', ARRAY['Smart Lock', 'Gym', 'Rooftop Lounge', '24x7 Security'], 17.4482, 78.3832, true, true, 'approved', agent2, 'Semi-Furnished', 1),
  
  ('Grande Villa with Private Garden', 'grande-villa-kukatpally', 'A rare premium villa with landscaped gardens, vaulted ceilings, and a serene neighborhood in Kukatpally.', 26500000, 'Villa', 4, 3200, 'Kukatpally', 'Hyderabad', 'West End Layout, Kukatpally', ARRAY['Private Garden', 'Home Theater', 'Servant Quarters', 'Solar Backup'], 17.4498, 78.3781, true, true, 'approved', agent3, 'Unfurnished', 3),
  
  ('Executive 3BHK Near Cyber Towers', 'executive-3bhk-hitech-city', 'Premium high-floor apartment for professionals in Hitech City, designed for executive lifestyle and workspace convenience.', 14950000, 'Apartment', 3, 1600, 'Hitech City', 'Hyderabad', 'Cyber Towers Road, Hitech City', ARRAY['Sky Deck', 'Business Lounge', 'Concierge', 'CCTV'], 17.4448, 78.3784, false, true, 'approved', agent4, 'Furnished', 2),
  
  ('Modern 2BHK in Financial District', 'modern-2bhk-financial-district', 'A sleek 2BHK with premium interiors and easy commuting to top business parks in Hyderabad.', 13200000, 'Apartment', 2, 1300, 'Financial District', 'Hyderabad', 'Gandipet Road, Financial District', ARRAY['Business Center', 'Green Plaza', 'Swimming Pool', 'Dedicated Parking'], 17.4485, 78.3859, true, true, 'approved', agent5, 'Semi-Furnished', 1);
END $$;

-- Insert Property Images
DO $$
DECLARE
  prop1 uuid;
  prop2 uuid;
  prop3 uuid;
  prop4 uuid;
  prop5 uuid;
BEGIN
  SELECT id INTO prop1 FROM public.properties WHERE slug = 'skyline-luxury-3bhk-gachibowli';
  SELECT id INTO prop2 FROM public.properties WHERE slug = 'designer-2bhk-kondapur';
  SELECT id INTO prop3 FROM public.properties WHERE slug = 'grande-villa-kukatpally';
  SELECT id INTO prop4 FROM public.properties WHERE slug = 'executive-3bhk-hitech-city';
  SELECT id INTO prop5 FROM public.properties WHERE slug = 'modern-2bhk-financial-district';

  INSERT INTO public.property_images (property_id, image_url) VALUES
  (prop1, 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&q=80&w=800'),
  (prop1, 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&q=80&w=800'),
  (prop2, 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&q=80&w=800'),
  (prop3, 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&q=80&w=800'),
  (prop4, 'https://images.unsplash.com/photo-1600596542815-27bfef402399?auto=format&fit=crop&q=80&w=800'),
  (prop5, 'https://images.unsplash.com/photo-1583608205776-bfd35f0d9f83?auto=format&fit=crop&q=80&w=800');
END $$;

-- Insert Property Videos
DO $$
DECLARE
  prop1 uuid;
  prop3 uuid;
BEGIN
  SELECT id INTO prop1 FROM public.properties WHERE slug = 'skyline-luxury-3bhk-gachibowli';
  SELECT id INTO prop3 FROM public.properties WHERE slug = 'grande-villa-kukatpally';

  INSERT INTO public.property_videos (property_id, video_url) VALUES
  (prop1, 'https://www.youtube.com/embed/dQw4w9WgXcQ'),
  (prop3, 'https://www.youtube.com/embed/5qap5aO4i9A');
END $$;
