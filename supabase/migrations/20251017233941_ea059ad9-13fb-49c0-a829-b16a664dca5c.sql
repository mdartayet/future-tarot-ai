-- Create user_readings table to track premium readings
CREATE TABLE public.user_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  focus TEXT NOT NULL,
  question TEXT,
  cards JSONB NOT NULL,
  ai_response TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_readings ENABLE ROW LEVEL SECURITY;

-- Users can view their own readings
CREATE POLICY "Users can view their own readings"
ON public.user_readings
FOR SELECT
USING (true);

-- Anyone can create a reading
CREATE POLICY "Anyone can create readings"
ON public.user_readings
FOR INSERT
WITH CHECK (true);

-- Create credits table for premium features
CREATE TABLE public.user_credits (
  user_id TEXT NOT NULL PRIMARY KEY,
  credits INTEGER NOT NULL DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.user_credits ENABLE ROW LEVEL SECURITY;

-- Users can view their own credits
CREATE POLICY "Users can view their own credits"
ON public.user_credits
FOR SELECT
USING (true);

-- Anyone can insert their credits
CREATE POLICY "Anyone can insert credits"
ON public.user_credits
FOR INSERT
WITH CHECK (true);

-- Users can update their own credits
CREATE POLICY "Users can update their own credits"
ON public.user_credits
FOR UPDATE
USING (true);

-- Trigger to update updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_user_credits_updated_at
BEFORE UPDATE ON public.user_credits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();