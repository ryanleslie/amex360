-- Add last_login column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN last_login TIMESTAMP WITH TIME ZONE;

-- Create index for better performance when querying by last_login
CREATE INDEX idx_profiles_last_login ON public.profiles(last_login);