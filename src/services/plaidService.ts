
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
  async createLinkToken(): Promise<string> {
    const { data, error } = await supabase.functions.invoke('plaid-link-token');
    
    if (error) {
      console.error('Error creating link token:', error);
      throw error;
    }

    return data.link_token;
  },

  async exchangePublicToken(publicToken: string): Promise<void> {
    const { error } = await supabase.functions.invoke('plaid-exchange-token', {
      body: { public_token: publicToken }
    });
    
    if (error) {
      console.error('Error exchanging public token:', error);
      throw error;
    }
  },

  async syncAccounts(): Promise<void> {
    const { error } = await supabase.functions.invoke('plaid-sync-accounts');
    
    if (error) {
      console.error('Error syncing accounts:', error);
      throw error;
    }
  },

  async getPlaidAccounts(): Promise<PlaidAccountBalance[]> {
    // First try to get real Plaid accounts
    const { data: plaidAccounts, error: plaidError } = await supabase
      .from('plaid_accounts')
      .select(`
        *,
        plaid_items!inner(institution_name)
      `)
      .order('current_balance', { ascending: false, nullsFirst: false });

    if (!plaidError && plaidAccounts && plaidAccounts.length > 0) {
      return plaidAccounts.map(account => ({
        id: account.id,
        account_id: account.account_id,
        account_name: account.account_name,
        account_type: account.account_type,
        account_subtype: account.account_subtype,
        current_balance: account.current_balance,
        available_balance: account.available_balance,
        credit_limit: account.credit_limit,
        institution_name: (account.plaid_items as any)?.institution_name || 'Unknown Institution'
      }));
    }

    // Fallback to card_balances table if no Plaid accounts
    const { data: cardBalances, error: cardError } = await supabase
      .from('card_balances')
      .select('*')
      .order('currentBalance', { ascending: false, nullsFirst: false });

    if (cardError) {
      console.error('Error fetching card balances:', cardError);
      throw cardError;
    }

    return (cardBalances || []).map(card => ({
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
