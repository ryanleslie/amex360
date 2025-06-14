
-- Create new guest user gperez
INSERT INTO public.users (user_id, password_hash, email)
VALUES (
  'gperez',
  crypt('@mex360guest-genaro', gen_salt('bf')),
  'genaro@guest.local'
);

-- Create profile for the new user
INSERT INTO public.profiles (user_id, display_name, first_name)
VALUES ('gperez', 'Genaro Perez', 'Genaro');

-- Assign user role (default role)
INSERT INTO public.user_roles (user_id, role)
VALUES ('gperez', 'user');
