
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { public_token } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);
    
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      console.error('Missing Authorization header');
      throw new Error('Missing authorization header');
    }
    
    const token = authHeader.replace('Bearer ', '');
    
    const { data: { user }, error: userError } = await supabase.auth.getUser(token);
    if (userError || !user) {
      console.error('Authentication error:', userError);
      throw new Error('Authentication failed');
    }

    console.log('Authenticated user:', user.id);

    const PLAID_CLIENT_ID = Deno.env.get('PLAID_CLIENT_ID');
    const PLAID_SECRET = Deno.env.get('PLAID_SECRET');
    const PLAID_ENV = Deno.env.get('PLAID_ENV') || 'sandbox';

    if (!PLAID_CLIENT_ID || !PLAID_SECRET) {
      throw new Error('Plaid credentials not configured');
    }

    const plaidBaseUrl = PLAID_ENV === 'production' 
      ? 'https://production.plaid.com' 
      : PLAID_ENV === 'development'
      ? 'https://development.plaid.com'
      : 'https://sandbox.plaid.com';

    // Exchange public token for access token
    const exchangeResponse = await fetch(`${plaidBaseUrl}/item/public_token/exchange`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
      },
      body: JSON.stringify({
        public_token,
      }),
    });

    const exchangeData = await exchangeResponse.json();
    
    if (!exchangeResponse.ok) {
      console.error('Plaid exchange error:', exchangeData);
      throw new Error(exchangeData.error_message || 'Failed to exchange token');
    }

    const { access_token, item_id } = exchangeData;

    // Get institution info
    const institutionResponse = await fetch(`${plaidBaseUrl}/item/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
      },
      body: JSON.stringify({
        access_token,
      }),
    });

    const institutionData = await institutionResponse.json();
    let institutionName = 'Unknown Institution';
    let institutionId = null;

    if (institutionResponse.ok && institutionData.item) {
      institutionId = institutionData.item.institution_id;
      
      if (institutionId) {
        const instResponse = await fetch(`${plaidBaseUrl}/institutions/get_by_id`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
            'PLAID-SECRET': PLAID_SECRET,
          },
          body: JSON.stringify({
            institution_id: institutionId,
            country_codes: ['US'],
          }),
        });

        const instData = await instResponse.json();
        if (instResponse.ok && instData.institution) {
          institutionName = instData.institution.name;
        }
      }
    }

    // Store the plaid item
    const { data: plaidItem, error: itemError } = await supabase
      .from('plaid_items')
      .insert({
        user_id: user.id,
        item_id,
        access_token,
        institution_id: institutionId,
        institution_name: institutionName,
        status: 'active'
      })
      .select()
      .single();

    if (itemError) {
      console.error('Error storing plaid item:', itemError);
      throw new Error('Failed to store connection');
    }

    // Get accounts
    const accountsResponse = await fetch(`${plaidBaseUrl}/accounts/get`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': PLAID_CLIENT_ID,
        'PLAID-SECRET': PLAID_SECRET,
      },
      body: JSON.stringify({
        access_token,
      }),
    });

    const accountsData = await accountsResponse.json();
    
    if (accountsResponse.ok && accountsData.accounts) {
      // Store accounts
      const accountsToInsert = accountsData.accounts.map((account: any) => ({
        plaid_item_id: plaidItem.id,
        account_id: account.account_id,
        account_name: account.name,
        account_type: account.type,
        account_subtype: account.subtype,
        current_balance: account.balances.current,
        available_balance: account.balances.available,
        credit_limit: account.balances.limit,
        currency_code: account.balances.iso_currency_code || 'USD'
      }));

      const { error: accountsError } = await supabase
        .from('plaid_accounts')
        .insert(accountsToInsert);

      if (accountsError) {
        console.error('Error storing accounts:', accountsError);
      }
    }

    return new Response(JSON.stringify({ success: true, item_id }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('Error in plaid-exchange-token function:', error);
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
