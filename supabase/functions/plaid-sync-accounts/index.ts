
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
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

    console.log('Authenticated user:', user.id);

    const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID');
    const PLAID_SECRET = Deno.env.get('PLAID_SECRET');

    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
      return new Response(JSON.stringify({
        error: 'Plaid credentials not configured'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Get all plaid items for the user
    const { data: plaidItems, error: itemsError } = await supabaseClient
      .from('plaid_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (itemsError) {
      console.error('Error fetching plaid items:', itemsError);
      return new Response(JSON.stringify({
        error: 'Failed to fetch plaid items',
        details: itemsError
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Found plaid items:', plaidItems?.length || 0);

    let totalSynced = 0;

    for (const item of plaidItems || []) {
      try {
        console.log('Syncing item:', item.id);
        
        // Get accounts for this item using balance/get endpoint
        const accountsResponse = await fetch('https://production.plaid.com/accounts/balance/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
          },
          body: JSON.stringify({
            access_token: item.access_token,
          }),
        });

        const accountsData = await accountsResponse.json();
        
        if (accountsResponse.ok && accountsData.accounts) {
          console.log('Found accounts for item:', accountsData.accounts.length);
          
          // Update accounts
          for (const account of accountsData.accounts) {
            const { error: updateError } = await supabaseClient
              .from('plaid_accounts')
              .update({
                current_balance: account.balances.current,
                available_balance: account.balances.available,
                credit_limit: account.balances.limit,
                last_synced_at: new Date().toISOString()
              })
              .eq('account_id', account.account_id)
              .eq('plaid_item_id', item.id);

            if (!updateError) {
              totalSynced++;
            } else {
              console.error('Error updating account:', updateError);
            }
          }

          // Update item sync time
          await supabaseClient
            .from('plaid_items')
            .update({ last_synced_at: new Date().toISOString() })
            .eq('id', item.id);
        } else {
          console.error('Error fetching accounts for item:', accountsData);
        }
      } catch (error) {
        console.error(`Error syncing item ${item.id}:`, error);
      }
    }

    console.log('Total accounts synced:', totalSynced);

    return new Response(JSON.stringify({ 
      success: true, 
      synced_accounts: totalSynced 
    }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in plaid-sync-accounts function:', error);
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
