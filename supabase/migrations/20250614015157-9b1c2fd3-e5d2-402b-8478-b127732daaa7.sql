
-- Create new guest user nemccartney
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'nemccartney',
  crypt('@mex360guest-nathan', gen_salt('bf')),
  'nathan@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name, first_name)
VALUES ('nemccartney', 'Nathan McCartney', 'Nathan');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('nemccartney', 'user');
