
import { supabase } from '@/integrations/supabase/client';
import { Tables } from '@/integrations/supabase/types';

export type PlaidItem = Tables<'plaid_items'>;
export type PlaidAccount = Tables<'plaid_accounts'>;

export interface PlaidAccountBalance {
  id: string;
  account_id: string;
  account_name: string;
  account_type: string;
  account_subtype: string | null;
  current_balance: number | null;
  available_balance: number | null;
  credit_limit: number | null;
  institution_name: string | null;
}

export const plaidService = {
  async getPlaidAccounts(): Promise<PlaidAccountBalance[]> {
    const { data, error } = await supabase
      .from('plaid_accounts')
      .select(`
        id,
        account_id,
        account_name,
        account_type,
        account_subtype,
        current_balance,
        available_balance,
        credit_limit,
        plaid_items!inner(
          institution_name
        )
      `)
      .order('current_balance', { ascending: false, nullsLast: true });

    if (error) {
      console.error('Error fetching Plaid accounts:', error);
      throw error;
    }

    return data.map(account => ({
      id: account.id,
      account_id: account.account_id,
      account_name: account.account_name,
      account_type: account.account_type,
      account_subtype: account.account_subtype,
      current_balance: account.current_balance,
      available_balance: account.available_balance,
      credit_limit: account.credit_limit,
      institution_name: account.plaid_items?.institution_name || null
    }));
  },

  async getPlaidItems(): Promise<PlaidItem[]> {
    const { data, error } = await supabase
      .from('plaid_items')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching Plaid items:', error);
      throw error;
    }

    return data || [];
  }
};
