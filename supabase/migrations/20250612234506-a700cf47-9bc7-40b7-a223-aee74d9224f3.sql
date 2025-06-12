
-- Create new guest user nolansmith
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'nolansmith',
  crypt('@mex360guest-nolan', gen_salt('bf')),
  'nolansmith@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name, first_name)
VALUES ('nolansmith', 'Nolan Smith', 'Nolan');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('nolansmith', 'user');
