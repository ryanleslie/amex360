
-- Create new guest user cwhertel
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'cwhertel',
  crypt('@mex360guest-clay', gen_salt('bf')),
  'clay@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name, first_name)
VALUES ('cwhertel', 'Clay Hertel', 'Clay');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('cwhertel', 'user');
