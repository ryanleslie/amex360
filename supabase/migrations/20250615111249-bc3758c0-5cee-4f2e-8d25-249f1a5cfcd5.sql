
-- First drop all policies that depend on the has_role function
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;

-- Now we can safely drop and recreate the has_role function
DROP FUNCTION IF EXISTS public.has_role(text, app_role);

-- Recreate the function to accept UUID instead of text for user_id
CREATE OR REPLACE FUNCTION public.has_role(_user_id uuid, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id::uuid = _user_id
      AND role = _role
  )
$$;

-- Now recreate the optimized policies using subqueries
CREATE POLICY "Only admins can insert roles" 
  ON public.user_roles 
  FOR INSERT 
  WITH CHECK (
    public.has_role((SELECT auth.uid()), 'admin') 
    OR NOT EXISTS (SELECT 1 FROM public.user_roles)
  );

CREATE POLICY "Only admins can update roles" 
  ON public.user_roles 
  FOR UPDATE 
  USING (public.has_role((SELECT auth.uid()), 'admin'));

CREATE POLICY "Only admins can delete roles" 
  ON public.user_roles 
  FOR DELETE 
  USING (public.has_role((SELECT auth.uid()), 'admin'));
