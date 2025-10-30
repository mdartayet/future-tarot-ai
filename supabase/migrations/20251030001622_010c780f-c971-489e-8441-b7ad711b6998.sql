-- Create table for daily horoscopes
CREATE TABLE IF NOT EXISTS public.daily_horoscopes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  sign TEXT NOT NULL,
  date DATE NOT NULL,
  prediction TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(sign, date)
);

-- Enable Row Level Security
ALTER TABLE public.daily_horoscopes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow everyone to read horoscopes
CREATE POLICY "Anyone can read horoscopes"
ON public.daily_horoscopes
FOR SELECT
USING (true);

-- Create index for faster lookups
CREATE INDEX idx_daily_horoscopes_sign_date ON public.daily_horoscopes(sign, date);