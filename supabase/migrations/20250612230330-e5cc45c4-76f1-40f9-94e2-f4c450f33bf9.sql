
-- Create new guest user rbhammond
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'rbhammond',
  crypt('@mex360guest-raymond', gen_salt('bf')),
  'rbhammond@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name)
VALUES ('rbhammond', 'Raymond Hammond');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('rbhammond', 'user');
