
-- Drop the existing restrictive SELECT policy
DROP POLICY IF EXISTS "Authenticated users can view card balances" ON public.card_balances;

-- Create a new policy that allows public read access to card balances
CREATE POLICY "Public can view card balances" 
ON public.card_balances 
FOR SELECT 
TO public
USING (true);
