-- Create plaid_accounts table
CREATE TABLE public.plaid_accounts (
  id UUID NOT NULL DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL,
  plaid_account_id TEXT NOT NULL,
  plaid_item_id TEXT NOT NULL,
  account_name TEXT NOT NULL,
  account_type TEXT NOT NULL,
  account_subtype TEXT NULL,
  current_balance NUMERIC NULL,
  available_balance NUMERIC NULL,
  credit_limit NUMERIC NULL,
  institution_name TEXT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT plaid_accounts_pkey PRIMARY KEY (id),
  CONSTRAINT plaid_accounts_plaid_account_id_key UNIQUE (plaid_account_id),
  CONSTRAINT plaid_accounts_plaid_item_id_fkey FOREIGN KEY (plaid_item_id) REFERENCES plaid_items (plaid_item_id) ON DELETE CASCADE,
  CONSTRAINT plaid_accounts_user_id_fkey FOREIGN KEY (user_id) REFERENCES auth.users (id) ON DELETE CASCADE
);

-- Enable Row Level Security
ALTER TABLE public.plaid_accounts ENABLE ROW LEVEL SECURITY;

-- Create policies for user access
CREATE POLICY "Users can view their own plaid accounts" 
ON public.plaid_accounts 
FOR SELECT 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own plaid accounts" 
ON public.plaid_accounts 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own plaid accounts" 
ON public.plaid_accounts 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own plaid accounts" 
ON public.plaid_accounts 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create trigger for automatic timestamp updates (reuse existing function)
CREATE TRIGGER update_plaid_accounts_updated_at
    BEFORE UPDATE ON public.plaid_accounts
    FOR EACH ROW
    EXECUTE FUNCTION public.update_updated_at_column();