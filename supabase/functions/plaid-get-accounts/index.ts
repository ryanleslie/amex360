
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const authHeader = req.headers.get('Authorization');
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '', 
      Deno.env.get('SUPABASE_ANON_KEY') ?? '', 
      {
        global: {
          headers: {
            Authorization: authHeader
          }
        }
      }
    );

    // Get the authenticated user
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      console.error('No authenticated user found');
      return new Response(JSON.stringify({
        error: 'Unauthorized'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Get user's Plaid items
    const { data: items, error: itemsError } = await supabaseClient
      .from('plaid_items')
      .select('*')
      .eq('user_id', user.id);

    if (itemsError) {
      console.error('Error fetching items:', itemsError);
      return new Response(JSON.stringify({
        error: 'Failed to fetch accounts',
        details: itemsError
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    if (!items || items.length === 0) {
      console.log('No items found for user:', user.id);
      return new Response(JSON.stringify({
        accounts: []
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
    const plaidSecret = Deno.env.get('PLAID_SECRET');
    const allAccounts = [];

    // Fetch fresh data from Plaid for each item using production environment
    for (const item of items) {
      try {
        const accountsResponse = await fetch('https://production.plaid.com/accounts/balance/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'PLAID-CLIENT-ID': plaidClientId,
            'PLAID-SECRET': plaidSecret,
          },
          body: JSON.stringify({
            access_token: item.access_token,
          }),
        });

        const accountsData = await accountsResponse.json();

        if (accountsResponse.ok && accountsData.accounts) {
          // Delete existing accounts for this item to prevent duplicates
          await supabaseClient
            .from('plaid_accounts')
            .delete()
            .eq('plaid_item_id', item.item_id)
            .eq('user_id', user.id);

          // Insert fresh account data
          const accountsToInsert = accountsData.accounts.map((account: any) => ({
            user_id: user.id,
            account_id: account.account_id,
            plaid_item_id: item.id,
            account_name: account.name,
            account_type: account.type,
            account_subtype: account.subtype,
            current_balance: account.balances.current,
            available_balance: account.balances.available,
            credit_limit: account.balances.limit,
            currency_code: account.balances.iso_currency_code || 'USD'
          }));

          await supabaseClient
            .from('plaid_accounts')
            .insert(accountsToInsert);

          allAccounts.push(...accountsData.accounts);
        }
      } catch (error) {
        console.error(`Error fetching accounts for item ${item.item_id}:`, error);
      }
    }

    console.log('Returning accounts:', {
      count: allAccounts.length
    });

    return new Response(JSON.stringify({
      accounts: allAccounts
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error fetching accounts:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });
  }
});
