-- Fix the user_roles table to properly reference profiles
-- First, let's make sure we have the foreign key relationship
ALTER TABLE public.user_roles 
ADD CONSTRAINT user_roles_user_id_fkey 
FOREIGN KEY (user_id) REFERENCES public.profiles(id) ON DELETE CASCADE;

-- Drop the conflicting has_role function that takes text parameter
DROP FUNCTION IF EXISTS public.has_role(uuid, text);

-- Keep only the function that uses the app_role enum
-- (The function with app_role parameter should remain)

-- Also, let's make sure profiles can be viewed by admins
CREATE POLICY "Admins can view all profiles" 
ON public.profiles 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM public.user_roles 
    WHERE user_id = auth.uid() AND role = 'admin'
  )
);