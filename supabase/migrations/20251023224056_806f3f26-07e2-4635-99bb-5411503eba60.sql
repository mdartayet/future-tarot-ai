-- Update handle_new_user function with input validation and error handling
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Validate display_name length from metadata
  IF LENGTH(COALESCE(new.raw_user_meta_data->>'display_name', '')) > 50 THEN
    RAISE EXCEPTION 'Display name must be 50 characters or less';
  END IF;
  
  -- Create profile with validated data
  INSERT INTO public.profiles (id, display_name)
  VALUES (
    new.id, 
    SUBSTRING(COALESCE(new.raw_user_meta_data->>'display_name', ''), 1, 50)
  );
  
  -- Initialize credits (3 free credits)
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (new.id, 3);
  
  RETURN new;
EXCEPTION
  WHEN OTHERS THEN
    -- Log error but don't block signup
    RAISE WARNING 'Error in handle_new_user for user %: %', new.id, SQLERRM;
    RETURN new;
END;
$$;