# KaelThrift — Supabase Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com) and sign in
2. Click **New Project**
3. Choose an organization, name it `kaelthrift`, set a strong DB password
4. Select region closest to Kenya (e.g., `eu-west-1` or `af-south-1` if available)
5. Wait for the project to provision

## 2. Run the Database Schema

1. Go to **SQL Editor** in your Supabase dashboard
2. Click **New Query**
3. Copy the entire contents of `supabase/schema.sql` into the editor
4. Click **Run** — this creates:
   - `products` table with RLS policies
   - Performance indexes on key columns
   - Triggers for auto-updating timestamps and status
   - `analytics_events` table for tracking WhatsApp clicks

## 3. Set Up Storage

1. Go to **Storage** in your Supabase dashboard
2. Click **New Bucket**
3. Name: `product-images`
4. Check **Public bucket** (images need to be publicly readable)
5. Click **Create Bucket**
6. Go to **Policies** tab for the bucket and add:
   - **SELECT**: Allow public access (anyone can view images)
   - **INSERT**: Only authenticated users
   - **DELETE**: Only authenticated users

## 4. Create Admin User

1. Go to **Authentication** → **Users**
2. Click **Add User** → **Create New User**
3. Enter your admin email and a strong password
4. This is the only user — **do NOT enable public signups**
5. Go to **Authentication** → **Settings** → **Auth Providers**
6. Ensure **Email** is enabled
7. **Disable** "Enable email confirmations" for simplicity (or confirm the email)

## 5. Get Your API Keys

1. Go to **Settings** → **API**
2. Copy:
   - **Project URL** → `VITE_SUPABASE_URL`
   - **anon / public key** → `VITE_SUPABASE_ANON_KEY`
3. **NEVER** expose the `service_role` key in client-side code

## 6. Configure Environment Variables

Create a `.env` file in the project root:

```env
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_WHATSAPP_NUMBER=254740396075
VITE_SOLD_DISPLAY_DAYS=7
```

## 7. Verify Setup

Run the app locally (`npm run dev`) and check:
- [ ] Products page loads without errors
- [ ] Admin login works with your credentials
- [ ] Image upload to Storage succeeds
- [ ] WhatsApp buttons generate correct links
