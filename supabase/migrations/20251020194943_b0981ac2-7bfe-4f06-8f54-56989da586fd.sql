-- Create table for tarot readings
CREATE TABLE IF NOT EXISTS public.tarot_readings (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  user_name TEXT NOT NULL,
  focus TEXT NOT NULL,
  question TEXT NOT NULL,
  language TEXT NOT NULL DEFAULT 'es',
  selected_cards JSONB NOT NULL,
  ai_reading TEXT,
  is_premium_unlocked BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.tarot_readings ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own readings" 
ON public.tarot_readings 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own readings" 
ON public.tarot_readings 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own readings" 
ON public.tarot_readings 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own readings" 
ON public.tarot_readings 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_tarot_readings_updated_at
BEFORE UPDATE ON public.tarot_readings
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();