
-- Create new guest user waynemccarthy
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'waynemccarthy',
  crypt('@mex360guest-wayne', gen_salt('bf')),
  'waynemccarthy@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name, first_name)
VALUES ('waynemccarthy', 'Wayne McCarthy', 'Wayne');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('waynemccarthy', 'user');
