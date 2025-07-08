-- Rename last_updated column to last_synced in card_balances table
ALTER TABLE public.card_balances 
RENAME COLUMN last_updated TO last_synced;