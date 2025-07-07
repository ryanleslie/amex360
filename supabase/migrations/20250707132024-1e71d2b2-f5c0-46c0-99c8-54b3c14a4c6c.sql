
-- First, let's check if the user exists in user_roles table and what role they have
-- Then update or insert the admin role for team@wealthplan.co

-- Delete any existing role entries for this user to avoid conflicts
DELETE FROM public.user_roles 
WHERE user_id = '2c5b3386-6d70-40e8-8209-57090c715b40';

-- Insert the admin role for the team@wealthplan.co user
INSERT INTO public.user_roles (user_id, role)
VALUES ('2c5b3386-6d70-40e8-8209-57090c715b40', 'admin');
