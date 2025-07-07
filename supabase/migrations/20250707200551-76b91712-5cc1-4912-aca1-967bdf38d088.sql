-- Sync current balances from plaid_accounts to card_balances
UPDATE public.card_balances 
SET 
  "currentBalance" = pa.current_balance,
  last_updated = now()
FROM public.plaid_accounts pa
WHERE card_balances.plaid_account_id = pa.plaid_account_id;