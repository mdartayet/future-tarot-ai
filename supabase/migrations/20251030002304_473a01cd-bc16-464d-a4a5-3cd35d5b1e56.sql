-- Add language column to daily_horoscopes table
ALTER TABLE public.daily_horoscopes 
ADD COLUMN language TEXT NOT NULL DEFAULT 'es';

-- Drop the old unique constraint
ALTER TABLE public.daily_horoscopes 
DROP CONSTRAINT IF EXISTS daily_horoscopes_sign_date_key;

-- Create new unique constraint including language
ALTER TABLE public.daily_horoscopes 
ADD CONSTRAINT daily_horoscopes_sign_date_language_key 
UNIQUE (sign, date, language);

-- Create index for faster lookups with language
DROP INDEX IF EXISTS idx_daily_horoscopes_sign_date;
CREATE INDEX idx_daily_horoscopes_sign_date_language 
ON public.daily_horoscopes(sign, date, language);