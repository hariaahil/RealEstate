# HydPropertiesHub Deployment Setup

## Environment Variables
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `RAZORPAY_KEY_ID`
- `RAZORPAY_KEY_SECRET`
- `NEXT_PUBLIC_RAZORPAY_KEY_ID`
- `CLOUDINARY_CLOUD_NAME`
- `CLOUDINARY_API_KEY`
- `CLOUDINARY_API_SECRET`
- `NEXT_PUBLIC_SITE_URL`

## Vercel
1. Import repository in Vercel.
2. Set all environment variables for Production/Preview.
3. Enable Node.js runtime and deploy.

## Supabase
1. Create project and run `supabase_schema.sql`.
2. Configure auth providers: Google, Phone OTP, Email.
3. Apply RLS policies for user/agent/admin role permissions.

## Razorpay
1. Create account and obtain API keys.
2. Configure webhook endpoint: `/api/payment/verify`.
3. Validate payment signature in backend before unlock.

## Cloudinary
1. Create product environment.
2. Add credentials to environment variables.
3. Use upload presets for property images/videos.
