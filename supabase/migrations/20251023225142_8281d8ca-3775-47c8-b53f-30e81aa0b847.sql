-- Create payments table with proper security
CREATE TABLE public.payments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  reading_id UUID NOT NULL REFERENCES tarot_readings(id) ON DELETE CASCADE,
  paypal_order_id TEXT NOT NULL UNIQUE,
  amount DECIMAL(10,2) NOT NULL CHECK (amount = 2.99),
  status TEXT NOT NULL,
  verified_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.payments ENABLE ROW LEVEL SECURITY;

-- Users can only SELECT their own payments, never INSERT/UPDATE
CREATE POLICY "Users view own payments"
ON public.payments FOR SELECT
USING (
  reading_id IN (
    SELECT id FROM tarot_readings WHERE user_id = auth.uid()
  )
);

-- Drop existing update policy on tarot_readings
DROP POLICY IF EXISTS "Users can update their own readings" ON public.tarot_readings;

-- Create restrictive update policy - users can only update safe metadata fields
CREATE POLICY "Users update own readings metadata only"
ON public.tarot_readings FOR UPDATE
USING (auth.uid() = user_id)
WITH CHECK (
  auth.uid() = user_id AND
  -- Prevent users from modifying premium status
  is_premium_unlocked = (SELECT is_premium_unlocked FROM tarot_readings WHERE id = tarot_readings.id)
);

-- Create index for performance
CREATE INDEX idx_payments_reading_id ON public.payments(reading_id);
CREATE INDEX idx_payments_paypal_order_id ON public.payments(paypal_order_id);