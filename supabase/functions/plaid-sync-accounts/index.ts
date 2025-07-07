
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

    // Get all plaid items for the user
    const { data: plaidItems, error: itemsError } = await supabase
      .from('plaid_items')
      .select('*')
      .eq('user_id', user.id)
      .eq('status', 'active');

    if (itemsError) {
      console.error('Error fetching plaid items:', itemsError);
      throw new Error('Failed to fetch plaid items');
    }

    console.log('Found plaid items:', plaidItems?.length || 0);

    let totalSynced = 0;

    for (const item of plaidItems || []) {
      try {
        console.log('Syncing item:', item.id);
        
        // Get accounts for this item
        const accountsResponse = await fetch(`${plaidBaseUrl}/accounts/get`, {
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
            const { error: updateError } = await supabase
              .from('plaid_accounts')
              .update({
                current_balance: account.balances.current,
                available_balance: account.balances.available,
                credit_limit: account.balances.limit,
                last_synced_at: new Date().toISOString()
              })
              .eq('account_id', account.account_id);

            if (!updateError) {
              totalSynced++;
            } else {
              console.error('Error updating account:', updateError);
            }
          }

          // Update item sync time
          await supabase
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
    return new Response(JSON.stringify({ error: error.message }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
