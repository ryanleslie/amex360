
-- Create new guest user bjhon
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'bjhon',
  crypt('@mex360guest-brandon', gen_salt('bf')),
  'brandon@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name, first_name)
VALUES ('bjhon', 'Brandon Jhon', 'Brandon');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('bjhon', 'user');
