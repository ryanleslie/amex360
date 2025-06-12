
-- Create new guest user dstallworth
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'dstallworth',
  crypt('@mex360guest-daniel', gen_salt('bf')),
  'dstallworth@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name)
VALUES ('dstallworth', 'Daniel Stallworth');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('dstallworth', 'user');
