-- First, let's check what's causing the type mismatch and fix the RLS policies
-- Drop the problematic policy that's causing the type error
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;

-- Create a simpler RLS policy that doesn't cause type conflicts
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'::app_role
  ) OR auth.uid() = profiles.id
);

-- Let's also ensure we can fetch basic profile data
-- by updating the existing policy
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;

CREATE POLICY "Users can view their own profile or admins can view all" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  auth.uid() = profiles.id OR
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_roles.user_id = auth.uid() 
    AND user_roles.role = 'admin'::app_role
  )
);