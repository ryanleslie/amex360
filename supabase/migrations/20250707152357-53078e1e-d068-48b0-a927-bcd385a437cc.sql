-- Drop the conflicting has_role function that takes text parameter
DROP FUNCTION IF EXISTS public.has_role(uuid, text);

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