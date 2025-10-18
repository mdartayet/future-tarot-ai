-- Fix user_readings table: proper UUID type and constraints
ALTER TABLE public.user_readings
  ALTER COLUMN user_id TYPE uuid USING user_id::uuid,
  ADD CONSTRAINT fk_user_readings_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ALTER COLUMN user_id SET NOT NULL,
  ADD CONSTRAINT user_name_length CHECK (length(user_name) <= 50 AND length(user_name) > 0),
  ADD CONSTRAINT question_length CHECK (question IS NULL OR (length(question) <= 500 AND length(question) >= 10)),
  ADD CONSTRAINT valid_focus CHECK (focus IN ('love', 'career', 'money'));

-- Fix user_credits table: proper UUID type and constraints  
ALTER TABLE public.user_credits
  ALTER COLUMN user_id TYPE uuid USING user_id::uuid,
  ADD CONSTRAINT fk_user_credits_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE,
  ALTER COLUMN user_id SET NOT NULL,
  ADD CONSTRAINT unique_user_credits UNIQUE (user_id);

-- Drop insecure RLS policies
DROP POLICY IF EXISTS "Users can view their own readings" ON public.user_readings;
DROP POLICY IF EXISTS "Anyone can create readings" ON public.user_readings;
DROP POLICY IF EXISTS "Users can view their own credits" ON public.user_credits;
DROP POLICY IF EXISTS "Anyone can insert credits" ON public.user_credits;
DROP POLICY IF EXISTS "Users can update their own credits" ON public.user_credits;

-- Create secure RLS policies for user_readings
CREATE POLICY "Users view own readings only"
  ON public.user_readings
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own readings only"
  ON public.user_readings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

-- Create secure RLS policies for user_credits
CREATE POLICY "Users view own credits only"
  ON public.user_credits
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users create own credits only"
  ON public.user_credits
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users update own credits only"
  ON public.user_credits
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create profiles table for user metadata
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  display_name text,
  created_at timestamp with time zone NOT NULL DEFAULT now(),
  updated_at timestamp with time zone NOT NULL DEFAULT now()
);

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Profiles viewable by authenticated users"
  ON public.profiles
  FOR SELECT
  TO authenticated
  USING (true);

CREATE POLICY "Users update own profile only"
  ON public.profiles
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users insert own profile only"
  ON public.profiles
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

-- Create trigger function for new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, display_name)
  VALUES (new.id, new.raw_user_meta_data->>'display_name');
  
  -- Initialize credits (3 free credits)
  INSERT INTO public.user_credits (user_id, credits)
  VALUES (new.id, 3);
  
  RETURN new;
END;
$$;

-- Create trigger for new user signups
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Add updated_at trigger for profiles
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();