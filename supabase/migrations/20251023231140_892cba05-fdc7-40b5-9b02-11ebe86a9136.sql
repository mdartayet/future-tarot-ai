-- Fix 1: Replace broken RLS policy with trigger-based immutability check
-- Drop the problematic policy
DROP POLICY IF EXISTS "Users update own readings metadata only" ON public.tarot_readings;

-- Create simplified RLS policy that just checks ownership
CREATE POLICY "Users update own readings"
ON public.tarot_readings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Create trigger function to prevent premium unlock manipulation
CREATE OR REPLACE FUNCTION public.prevent_premium_unlock_manipulation()
RETURNS TRIGGER 
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow service_role to modify premium status
  IF OLD.is_premium_unlocked != NEW.is_premium_unlocked THEN
    IF current_setting('request.jwt.claims', true)::json->>'role' != 'service_role' THEN
      RAISE EXCEPTION 'Cannot modify premium unlock status';
    END IF;
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to enforce premium immutability
CREATE TRIGGER protect_premium_status
  BEFORE UPDATE ON public.tarot_readings
  FOR EACH ROW
  EXECUTE FUNCTION public.prevent_premium_unlock_manipulation();

-- Fix 2: Restrict profile access to own profile only
DROP POLICY IF EXISTS "Profiles viewable by authenticated users" ON public.profiles;

CREATE POLICY "Users view own profile only"
ON public.profiles FOR SELECT
USING (auth.uid() = id);