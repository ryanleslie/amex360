
-- Create new guest user cterry
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'cterry',
  crypt('@mex360guest-christina', gen_salt('bf')),
  'cterry@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name, first_name)
VALUES ('cterry', 'Christina Terry', 'Christina');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('cterry', 'user');
