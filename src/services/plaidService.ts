
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
    // Use card_balances table until Plaid integration is complete
    const { data, error } = await supabase
      .from('card_balances')
      .select('*')
      .order('currentBalance', { ascending: false, nullsFirst: false });

    if (error) {
      console.error('Error fetching card balances:', error);
      throw error;
    }

    // Transform card_balances data to match PlaidAccountBalance interface
    return (data || []).map(card => ({
      id: card.ID,
      account_id: card.ID,
      account_name: card.cardType,
      account_type: 'credit',
      account_subtype: 'credit_card',
      current_balance: card.currentBalance,
      available_balance: null,
      credit_limit: null,
      institution_name: 'Credit Card Provider'
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
