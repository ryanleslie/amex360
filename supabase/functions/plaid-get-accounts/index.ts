import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  console.log('🚀🚀🚀 FUNCTION CALLED - THIS SHOULD APPEAR IN LOGS 🚀🚀🚀');
  console.log('🚀 plaid-get-accounts function started');
  console.log('📝 Request details:', {
    method: req.method,
    url: req.url,
    headers: Object.fromEntries(req.headers.entries())
  });

  if (req.method === 'OPTIONS') {
    console.log('⚡ Handling CORS preflight request');
    return new Response(null, {
      headers: corsHeaders
    });
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
    console.log('🔐 Getting authenticated user...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError) {
      console.error('❌ Error getting user:', userError);
      return new Response(JSON.stringify({
        error: 'Authentication error',
        details: userError
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }
    
    if (!user) {
      console.error('❌ No authenticated user found');
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

    console.log('✅ User authenticated:', user.id);

    // Get user's Plaid items
    console.log('📊 Fetching Plaid items for user:', user.id);
    const { data: items, error: itemsError } = await supabaseClient
      .from('plaid_items')
      .select('*')
      .eq('user_id', user.id);

    if (itemsError) {
      console.error('❌ Error fetching items:', itemsError);
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

    console.log('📋 Found Plaid items:', items?.length || 0);

    if (!items || items.length === 0) {
      console.log('⚠️ No items found for user:', user.id);
      return new Response(JSON.stringify({
        accounts: [],
        message: 'No Plaid items found for user'
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
    const plaidSecret = Deno.env.get('PLAID_SECRET');
    
    console.log('🔑 Plaid credentials check:', {
      clientIdExists: !!plaidClientId,
      secretExists: !!plaidSecret
    });

    if (!plaidClientId || !plaidSecret) {
      console.error('❌ Missing Plaid credentials');
      return new Response(JSON.stringify({
        error: 'Missing Plaid API credentials'
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const allAccounts = [];

    // Fetch fresh data from Plaid for each item using production environment
    console.log('🔄 Processing', items.length, 'Plaid items...');
    for (const item of items) {
      console.log('📡 Fetching accounts for item:', item.plaid_item_id);
      try {
        const accountsResponse = await fetch('https://production.plaid.com/accounts/balance/get', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'PLAID-CLIENT-ID': plaidClientId,
            'PLAID-SECRET': plaidSecret
          },
          body: JSON.stringify({
            access_token: item.access_token
          })
        });

        const accountsData = await accountsResponse.json();
        console.log('📊 Plaid API response:', {
          status: accountsResponse.status,
          ok: accountsResponse.ok,
          accountCount: accountsData?.accounts?.length || 0,
          error: accountsData?.error_code || null,
          errorMessage: accountsData?.error_message || null,
          fullResponse: accountsData
        });

        if (accountsResponse.ok && accountsData.accounts) {
          console.log('🗑️ Deleting existing accounts for item:', item.plaid_item_id);
          // Delete existing accounts for this item to prevent duplicates
          const { error: deleteError } = await supabaseClient
            .from('plaid_accounts')
            .delete()
            .eq('plaid_item_id', item.plaid_item_id)
            .eq('user_id', user.id);

          if (deleteError) {
            console.error('❌ Error deleting existing accounts:', deleteError);
          } else {
            console.log('✅ Successfully deleted existing accounts');
          }

          // Insert fresh account data
          const accountsToInsert = accountsData.accounts.map((account) => ({
            user_id: user.id,
            plaid_account_id: account.account_id,
            plaid_item_id: item.plaid_item_id,
            account_name: account.name,
            account_type: account.type,
            account_subtype: account.subtype,
            current_balance: account.balances.current,
            available_balance: account.balances.available,
            credit_limit: account.balances.limit,
            institution_name: item.institution_name
          }));

          console.log('💾 Inserting', accountsToInsert.length, 'new accounts');
          const { error: insertError } = await supabaseClient
            .from('plaid_accounts')
            .insert(accountsToInsert);

          if (insertError) {
            console.error('❌ Error inserting accounts:', insertError);
          } else {
            console.log('✅ Successfully inserted accounts');
          }

          allAccounts.push(...accountsData.accounts);
        } else {
          console.error('❌ Plaid API error:', {
            status: accountsResponse.status,
            response: accountsData
          });
        }
      } catch (error) {
        console.error(`❌ Error fetching accounts for item ${item.plaid_item_id}:`, error);
      }
    }

    // After updating plaid_accounts, sync the card_balances table
    try {
      console.log('Syncing card balances...');
      const { error: syncError } = await supabaseClient.rpc('sync_card_balances_from_plaid');
      
      if (syncError) {
        console.error('Error syncing card balances:', syncError);
      } else {
        console.log('Card balances synced successfully');
      }
    } catch (error) {
      console.error('Error during card balance sync:', error);
    }

    console.log('🎉 Function completed successfully. Returning accounts:', {
      count: allAccounts.length,
      totalProcessed: items.length
    });

    return new Response(JSON.stringify({
      accounts: allAccounts,
      message: `Successfully processed ${items.length} Plaid items and fetched ${allAccounts.length} accounts`
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