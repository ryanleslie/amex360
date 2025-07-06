
-- Enable RLS on card_balances table
ALTER TABLE public.card_balances ENABLE ROW LEVEL SECURITY;

-- Allow authenticated users to read card balances
CREATE POLICY "Authenticated users can view card balances" 
  ON public.card_balances 
  FOR SELECT 
  TO authenticated
  USING (true);

-- Allow admin users to insert card balances
CREATE POLICY "Admins can insert card balances" 
  ON public.card_balances 
  FOR INSERT 
  TO authenticated
  WITH CHECK (public.has_role(auth.uid(), 'admin'));

-- Allow admin users to update card balances
CREATE POLICY "Admins can update card balances" 
  ON public.card_balances 
  FOR UPDATE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));

-- Allow admin users to delete card balances
CREATE POLICY "Admins can delete card balances" 
  ON public.card_balances 
  FOR DELETE 
  TO authenticated
  USING (public.has_role(auth.uid(), 'admin'));
