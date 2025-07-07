
-- Drop existing RLS policies for plaid_items
DROP POLICY IF EXISTS "Users can view their own plaid items" ON public.plaid_items;
DROP POLICY IF EXISTS "Users can insert their own plaid items" ON public.plaid_items;
DROP POLICY IF EXISTS "Users can update their own plaid items" ON public.plaid_items;
DROP POLICY IF EXISTS "Users can delete their own plaid items" ON public.plaid_items;

-- Drop existing RLS policies for plaid_accounts
DROP POLICY IF EXISTS "Users can view their own plaid accounts" ON public.plaid_accounts;
DROP POLICY IF EXISTS "Users can insert their own plaid accounts" ON public.plaid_accounts;
DROP POLICY IF EXISTS "Users can update their own plaid accounts" ON public.plaid_accounts;
DROP POLICY IF EXISTS "Users can delete their own plaid accounts" ON public.plaid_accounts;

-- New RLS policies for plaid_items (admin only for modifications, all users can view)
CREATE POLICY "All users can view plaid items" 
  ON public.plaid_items 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admin can insert plaid items" 
  ON public.plaid_items 
  FOR INSERT 
  WITH CHECK (has_role(current_setting('app.current_user_id', true)::text, 'admin'::app_role));

CREATE POLICY "Only admin can update plaid items" 
  ON public.plaid_items 
  FOR UPDATE 
  USING (has_role(current_setting('app.current_user_id', true)::text, 'admin'::app_role));

CREATE POLICY "Only admin can delete plaid items" 
  ON public.plaid_items 
  FOR DELETE 
  USING (has_role(current_setting('app.current_user_id', true)::text, 'admin'::app_role));

-- New RLS policies for plaid_accounts (admin only for modifications, all users can view)
CREATE POLICY "All users can view plaid accounts" 
  ON public.plaid_accounts 
  FOR SELECT 
  USING (true);

CREATE POLICY "Only admin can insert plaid accounts" 
  ON public.plaid_accounts 
  FOR INSERT 
  WITH CHECK (has_role(current_setting('app.current_user_id', true)::text, 'admin'::app_role));

CREATE POLICY "Only admin can update plaid accounts" 
  ON public.plaid_accounts 
  FOR UPDATE 
  USING (has_role(current_setting('app.current_user_id', true)::text, 'admin'::app_role));

CREATE POLICY "Only admin can delete plaid accounts" 
  ON public.plaid_accounts 
  FOR DELETE 
  USING (has_role(current_setting('app.current_user_id', true)::text, 'admin'::app_role));
