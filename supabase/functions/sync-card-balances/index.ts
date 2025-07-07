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

    // Get the authenticated user (admin only)
    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
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

    // Check if user is admin
    const { data: profile } = await supabaseClient
      .from('profiles')
      .select('role')
      .eq('id', user.id)
      .single();

    if (profile?.role !== 'admin') {
      return new Response(JSON.stringify({
        error: 'Admin access required'
      }), {
        status: 403,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('Starting balance sync...');

    // Get all plaid accounts
    const { data: plaidAccounts, error: plaidError } = await supabaseClient
      .from('plaid_accounts')
      .select('*');

    if (plaidError) {
      console.error('Error fetching plaid accounts:', plaidError);
      return new Response(JSON.stringify({
        error: 'Failed to fetch plaid accounts',
        details: plaidError
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    if (!plaidAccounts || plaidAccounts.length === 0) {
      console.log('No plaid accounts found');
      return new Response(JSON.stringify({
        message: 'No plaid accounts to sync',
        synced: 0
      }), {
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    let syncedCount = 0;
    const errors = [];

    // Update card_balances with current balances from plaid_accounts
    for (const plaidAccount of plaidAccounts) {
      try {
        const { error: updateError } = await supabaseClient
          .from('card_balances')
          .update({
            currentBalance: plaidAccount.current_balance,
            last_updated: new Date().toISOString()
          })
          .eq('plaid_account_id', plaidAccount.plaid_account_id);

        if (updateError) {
          console.error(`Error updating balance for ${plaidAccount.plaid_account_id}:`, updateError);
          errors.push({
            plaid_account_id: plaidAccount.plaid_account_id,
            error: updateError.message
          });
        } else {
          syncedCount++;
          console.log(`Updated balance for ${plaidAccount.plaid_account_id}: $${plaidAccount.current_balance}`);
        }
      } catch (error) {
        console.error(`Exception updating balance for ${plaidAccount.plaid_account_id}:`, error);
        errors.push({
          plaid_account_id: plaidAccount.plaid_account_id,
          error: error.message
        });
      }
    }

    console.log(`Balance sync completed. Synced: ${syncedCount}, Errors: ${errors.length}`);

    return new Response(JSON.stringify({
      message: 'Balance sync completed',
      synced: syncedCount,
      errors: errors.length > 0 ? errors : undefined,
      timestamp: new Date().toISOString()
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error in sync-card-balances function:', error);
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