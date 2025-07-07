import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
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

    const { public_token } = await req.json();
    if (!public_token) {
      console.error('No public token provided');
      return new Response(JSON.stringify({
        error: 'Public token is required'
      }), {
        status: 400,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
    const plaidSecret = Deno.env.get('PLAID_SECRET');

    if (!plaidClientId || !plaidSecret) {
      console.error('Missing Plaid credentials');
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

    console.log('Exchange token request:', {
      hasToken: !!public_token,
      userId: user.id
    });

    // Exchange public token for access token using production environment
    const exchangeResponse = await fetch('https://production.plaid.com/item/public_token/exchange', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': plaidClientId,
        'PLAID-SECRET': plaidSecret
      },
      body: JSON.stringify({
        public_token
      })
    });

    const exchangeData = await exchangeResponse.json();
    console.log('Exchange response:', {
      status: exchangeResponse.status,
      hasAccessToken: !!exchangeData.access_token,
      hasItemId: !!exchangeData.item_id
    });

    if (!exchangeResponse.ok) {
      console.error('Plaid exchange error:', exchangeData);
      return new Response(JSON.stringify({
        error: 'Failed to exchange token',
        details: exchangeData
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const { access_token, item_id } = exchangeData;

    // Get account info to store using production environment
    const accountsResponse = await fetch('https://production.plaid.com/accounts/get', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': plaidClientId,
        'PLAID-SECRET': plaidSecret
      },
      body: JSON.stringify({
        access_token
      })
    });

    const accountsData = await accountsResponse.json();
    console.log('Accounts response:', {
      status: accountsResponse.status,
      accountCount: accountsData.accounts?.length
    });

    if (!accountsResponse.ok) {
      console.error('Plaid accounts error:', accountsData);
      return new Response(JSON.stringify({
        error: 'Failed to fetch accounts',
        details: accountsData
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Store the item in Supabase (upsert to avoid duplicates)
    const { error: itemError } = await supabaseClient
      .from('plaid_items')
      .upsert({
        user_id: user.id,
        plaid_item_id: item_id,
        access_token: access_token,
        institution_id: accountsData.item?.institution_id,
        institution_name: 'American Express'
      }, {
        onConflict: 'plaid_item_id'
      });

    if (itemError) {
      console.error('Error storing item:', itemError);
      return new Response(JSON.stringify({
        error: 'Failed to store connection',
        details: itemError
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    // Delete existing accounts for this item to prevent duplicates
    await supabaseClient
      .from('plaid_accounts')
      .delete()
      .eq('plaid_item_id', item_id)
      .eq('user_id', user.id);

    // Store accounts (insert fresh data)
    const accountsToInsert = accountsData.accounts.map((account) => ({
      user_id: user.id,
      plaid_account_id: account.account_id,
      plaid_item_id: item_id,
      account_name: account.name,
      account_type: account.type,
      account_subtype: account.subtype,
      current_balance: account.balances.current,
      available_balance: account.balances.available,
      credit_limit: account.balances.limit,
      institution_name: 'American Express'
    }));

    const { error: accountsError } = await supabaseClient
      .from('plaid_accounts')
      .insert(accountsToInsert);

    if (accountsError) {
      console.error('Error storing accounts:', accountsError);
      return new Response(JSON.stringify({
        error: 'Failed to store accounts',
        details: accountsError
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Successfully stored accounts:', accountsData.accounts?.length);

    return new Response(JSON.stringify({
      success: true,
      accounts: accountsData.accounts
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error exchanging token:', error);
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