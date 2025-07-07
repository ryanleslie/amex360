-- Let's simplify and fix the RLS policies step by step
-- First drop the problematic policies
DROP POLICY IF EXISTS "Admins can view all profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own profile or admins can view all" ON public.profiles;

-- Create a simple policy that allows users to view their own profiles
CREATE POLICY "Users can view their own profile" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (auth.uid() = id);

-- Create a separate policy for admins using the has_role function
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
TO authenticated
USING (
  public.has_role(auth.uid(), 'admin'::app_role)
);