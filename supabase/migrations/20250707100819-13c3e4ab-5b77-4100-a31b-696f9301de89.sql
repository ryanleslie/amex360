
-- Drop the plaid_accounts table (this will also drop its foreign key constraints)
DROP TABLE IF EXISTS public.plaid_accounts CASCADE;

-- Drop the plaid_items table
DROP TABLE IF EXISTS public.plaid_items CASCADE;

-- Drop any indexes that might have been created for plaid tables
-- (CASCADE should handle this, but being explicit)
DROP INDEX IF EXISTS idx_plaid_accounts_item_id;
DROP INDEX IF EXISTS idx_plaid_accounts_account_id;
DROP INDEX IF EXISTS idx_plaid_items_user_id;
DROP INDEX IF EXISTS idx_plaid_items_item_id;
