
-- Create new guest user leewilliams
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'leewilliams',
  crypt('@mex360guest-lee', gen_salt('bf')),
  'leewilliams@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name, first_name)
VALUES ('leewilliams', 'Lee Williams', 'Lee');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('leewilliams', 'user');
