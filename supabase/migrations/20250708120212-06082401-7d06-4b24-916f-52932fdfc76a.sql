-- Drop the sync function that updates card_balances table
DROP FUNCTION IF EXISTS public.sync_card_balances_from_plaid();

-- Drop the card_balances table since we're now using in-memory calculations
DROP TABLE IF EXISTS public.card_balances;