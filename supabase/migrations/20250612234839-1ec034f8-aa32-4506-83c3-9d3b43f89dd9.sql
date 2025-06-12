
-- Create new guest user theochristopher
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'theochristopher',
  crypt('@mex360guest-theo', gen_salt('bf')),
  'theochristopher@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name, first_name)
VALUES ('theochristopher', 'Theo Christopher', 'Theo');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('theochristopher', 'user');
