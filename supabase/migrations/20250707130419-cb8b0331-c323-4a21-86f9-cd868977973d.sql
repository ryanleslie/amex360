
-- Update the role for team@wealthplan.co to admin
-- First, let's find the user ID for team@wealthplan.co and update their role
UPDATE public.user_roles 
SET role = 'admin' 
WHERE user_id = (
  SELECT id 
  FROM auth.users 
  WHERE email = 'team@wealthplan.co'
);

-- If for some reason the user doesn't have a role entry yet, insert one
INSERT INTO public.user_roles (user_id, role)
SELECT id, 'admin'
FROM auth.users 
WHERE email = 'team@wealthplan.co'
AND NOT EXISTS (
  SELECT 1 FROM public.user_roles 
  WHERE user_id = auth.users.id
);
