-- Now that we've migrated roles to the profiles table, we can clean up
-- Drop the user_roles table and related functions since they're no longer needed
DROP TABLE IF EXISTS public.user_roles CASCADE;
DROP FUNCTION IF EXISTS public.has_role(uuid, public.app_role) CASCADE;