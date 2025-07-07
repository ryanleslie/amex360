
-- Drop all triggers first
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;

-- Drop all functions
DROP FUNCTION IF EXISTS public.handle_new_user();
DROP FUNCTION IF EXISTS public.has_role(UUID, TEXT);
DROP FUNCTION IF EXISTS public.has_role(TEXT, app_role);
DROP FUNCTION IF EXISTS public.get_current_user_role();
DROP FUNCTION IF EXISTS public.hash_password(TEXT);
DROP FUNCTION IF EXISTS public.verify_password(TEXT, TEXT);

-- Drop all tables (in correct order due to foreign key constraints)
DROP TABLE IF EXISTS public.user_sessions CASCADE;
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP TABLE IF EXISTS public.profiles CASCADE;
DROP TABLE IF EXISTS public.users CASCADE;

-- Drop custom enum types
DROP TYPE IF EXISTS public.app_role;

-- Clean up any remaining policies (just in case)
DROP POLICY IF EXISTS "Users can view their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can insert their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON public.profiles;
DROP POLICY IF EXISTS "Users can view their own role" ON public.user_roles;
DROP POLICY IF EXISTS "Admins can manage all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Users can view their own data" ON public.users;
DROP POLICY IF EXISTS "Users can update their own data" ON public.users;
DROP POLICY IF EXISTS "Allow user registration" ON public.users;
DROP POLICY IF EXISTS "Allow profile creation" ON public.profiles;
DROP POLICY IF EXISTS "Users can view profiles" ON public.profiles;
DROP POLICY IF EXISTS "Users can update profiles" ON public.profiles;
DROP POLICY IF EXISTS "Allow session creation" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow session management" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow session deletion" ON public.user_sessions;
DROP POLICY IF EXISTS "Allow session updates" ON public.user_sessions;
DROP POLICY IF EXISTS "Users can view all roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can insert roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can update roles" ON public.user_roles;
DROP POLICY IF EXISTS "Only admins can delete roles" ON public.user_roles;
