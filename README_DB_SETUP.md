# Database Setup Instructions

This application uses **Supabase** (PostgreSQL) as its database. Follow these steps to set up the database with test data.

## Prerequisites

1. A Supabase account (sign up at https://supabase.com)
2. A new Supabase project created

## Setup Steps

### 1. Get Your Supabase Credentials

After creating a project in Supabase:
- Go to **Settings** → **API**
- Copy your **Project URL** (`NEXT_PUBLIC_SUPABASE_URL`)
- Copy your **anon/public key** (`NEXT_PUBLIC_SUPABASE_ANON_KEY`)

### 2. Configure Environment Variables

Create or update the `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
```

### 3. Run the SQL Schema

1. Go to your Supabase project dashboard
2. Navigate to **SQL Editor**
3. Copy the entire contents of `supabase_schema.sql` from this project
4. Paste it into the SQL Editor and click **Run**

This will:
- Create all necessary tables (agents, properties, property_images, property_videos, inquiries, favorites)
- Enable Row Level Security (RLS) with public read access policies
- Insert sample test data (5 agents, 5 properties, property images, and videos)

### 4. Verify the Setup

After running the SQL script, you can verify the data was inserted by:

1. Going to **Table Editor** in Supabase
2. Check the following tables have data:
   - `agents` (should have 5 rows)
   - `properties` (should have 5 rows)
   - `property_images` (should have 6 rows)
   - `property_videos` (should have 2 rows)

### 5. Run the Application

```bash
npm install
npm run dev
```

The application will now fetch all data from your Supabase database instead of using hardcoded values.

## API Endpoints

The following API endpoints are available:

- `GET /api/properties` - Fetch all properties
- `GET /api/agents` - Fetch all agents
- `POST /api/inquiries` - Submit a property inquiry
- `GET/POST/DELETE /api/favorites` - Manage favorite properties

## Tables Structure

### agents
- id (uuid, primary key)
- name, email, phone, whatsapp
- area_specialization (text array)
- profile_image, bio, role

### properties
- id (uuid, primary key)
- title, slug, description, price
- property_type, bhk, sqft
- locality, city, address_approx
- amenities (text array), latitude, longitude
- featured, verified, status
- agent_id (foreign key), furnishing, parking

### property_images & property_videos
- id, property_id (foreign key), url

### inquiries
- id, property_id, buyer details, message, status

### favorites
- id, user_id, property_id

## Notes

- The schema includes permissive RLS policies for demo purposes (public read/write access)
- For production, restrict write access to authenticated users only
- All prices are in INR (Indian Rupees)
- Property locations are focused on Hyderabad, India
