-- Create function to sync card balances from plaid accounts
CREATE OR REPLACE FUNCTION public.sync_card_balances_from_plaid()
RETURNS void
LANGUAGE sql
SECURITY DEFINER
AS $$
  UPDATE public.card_balances 
  SET 
    "currentBalance" = pa.current_balance,
    last_updated = now()
  FROM public.plaid_accounts pa
  WHERE card_balances.plaid_account_id = pa.plaid_account_id;
$$;