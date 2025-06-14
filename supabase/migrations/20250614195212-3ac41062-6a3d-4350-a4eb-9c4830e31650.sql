
-- Create new guest user aburton
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'aburton',
  crypt('@mex360guest-andre', gen_salt('bf')),
  'andre@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name, first_name)
VALUES ('aburton', 'Andre Burton', 'Andre');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('aburton', 'user');
