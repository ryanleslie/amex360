
-- Create plaid_items table to store Plaid item connections
CREATE TABLE public.plaid_items (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT NOT NULL,
  item_id TEXT NOT NULL UNIQUE,
  access_token TEXT NOT NULL,
  institution_id TEXT,
  institution_name TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMP WITH TIME ZONE,
  status TEXT DEFAULT 'active' CHECK (status IN ('active', 'inactive', 'error'))
);

-- Create plaid_accounts table to store individual account information
CREATE TABLE public.plaid_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  plaid_item_id UUID NOT NULL REFERENCES public.plaid_items(id) ON DELETE CASCADE,
  account_id TEXT NOT NULL UNIQUE,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  account_subtype TEXT,
  current_balance NUMERIC,
  available_balance NUMERIC,
  credit_limit NUMERIC,
  currency_code TEXT DEFAULT 'USD',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  last_synced_at TIMESTAMP WITH TIME ZONE
);

-- Enable RLS on both tables
ALTER TABLE public.plaid_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.plaid_accounts ENABLE ROW LEVEL SECURITY;

-- RLS policies for plaid_items
CREATE POLICY "Users can view their own plaid items" 
  ON public.plaid_items 
  FOR SELECT 
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can insert their own plaid items" 
  ON public.plaid_items 
  FOR INSERT 
  WITH CHECK (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can update their own plaid items" 
  ON public.plaid_items 
  FOR UPDATE 
  USING (user_id = current_setting('app.current_user_id', true));

CREATE POLICY "Users can delete their own plaid items" 
  ON public.plaid_items 
  FOR DELETE 
  USING (user_id = current_setting('app.current_user_id', true));

-- RLS policies for plaid_accounts
CREATE POLICY "Users can view their own plaid accounts" 
  ON public.plaid_accounts 
  FOR SELECT 
  USING (plaid_item_id IN (
    SELECT id FROM public.plaid_items 
    WHERE user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can insert their own plaid accounts" 
  ON public.plaid_accounts 
  FOR INSERT 
  WITH CHECK (plaid_item_id IN (
    SELECT id FROM public.plaid_items 
    WHERE user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can update their own plaid accounts" 
  ON public.plaid_accounts 
  FOR UPDATE 
  USING (plaid_item_id IN (
    SELECT id FROM public.plaid_items 
    WHERE user_id = current_setting('app.current_user_id', true)
  ));

CREATE POLICY "Users can delete their own plaid accounts" 
  ON public.plaid_accounts 
  FOR DELETE 
  USING (plaid_item_id IN (
    SELECT id FROM public.plaid_items 
    WHERE user_id = current_setting('app.current_user_id', true)
  ));

-- Create indexes for better performance
CREATE INDEX idx_plaid_items_user_id ON public.plaid_items(user_id);
CREATE INDEX idx_plaid_items_item_id ON public.plaid_items(item_id);
CREATE INDEX idx_plaid_accounts_plaid_item_id ON public.plaid_accounts(plaid_item_id);
CREATE INDEX idx_plaid_accounts_account_id ON public.plaid_accounts(account_id);
