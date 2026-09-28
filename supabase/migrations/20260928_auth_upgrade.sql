-- Supabase Migration: 20260928_auth_upgrade.sql
-- SpendWise AI: Authentication & User Profile Upgrade

-- 1. Add username and phone_number columns to public.users if not present
ALTER TABLE public.users 
ADD COLUMN IF NOT EXISTS username TEXT,
ADD COLUMN IF NOT EXISTS phone_number TEXT,
ADD COLUMN IF NOT EXISTS password_hash TEXT,
ADD COLUMN IF NOT EXISTS needs_username BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS avatar_url TEXT;

-- 2. Create unique index on lower(username) for case-insensitive unique handles
CREATE UNIQUE INDEX IF NOT EXISTS idx_users_username_unique 
ON public.users (LOWER(username)) 
WHERE username IS NOT NULL;

-- 3. Create index on phone_number for rapid authentication lookup
CREATE INDEX IF NOT EXISTS idx_users_phone_number 
ON public.users (phone_number) 
WHERE phone_number IS NOT NULL;

-- 4. For existing legacy users where username is NULL, mark needs_username = true
-- This ensures existing users are never blocked by sudden non-null constraints,
-- and will receive a smooth onboarding prompt upon their next login.
UPDATE public.users 
SET needs_username = TRUE 
WHERE username IS NULL;

-- 5. RLS Policies remain intact and enforced on public.users
-- Users can only read and update their own profile
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
