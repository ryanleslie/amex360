-- Add role column to profiles table
ALTER TABLE public.profiles 
ADD COLUMN role public.app_role DEFAULT 'user'::public.app_role;

-- Update existing profiles to have roles based on user_roles table
-- Convert 'guest' to 'user' since guest isn't in the enum
UPDATE public.profiles 
SET role = CASE 
  WHEN user_roles.role = 'guest' THEN 'user'::public.app_role
  ELSE user_roles.role::public.app_role
END
FROM public.user_roles 
WHERE profiles.id = user_roles.user_id;

-- Update the handle_new_user function to set default role
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path TO ''
AS $function$
BEGIN
  INSERT INTO public.profiles (id, first_name, last_name, display_name, email, role)
  VALUES (
    NEW.id, 
    NEW.raw_user_meta_data ->> 'first_name',
    NEW.raw_user_meta_data ->> 'last_name',
    COALESCE(NEW.raw_user_meta_data ->> 'display_name', NEW.email),
    NEW.email,
    'user'::public.app_role
  );
  
  RETURN NEW;
END;
$function$