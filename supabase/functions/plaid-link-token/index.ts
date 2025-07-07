
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
    console.log('=== PLAID LINK TOKEN REQUEST START ===');
    
    const authHeader = req.headers.get('Authorization');
    console.log('Auth header present:', !!authHeader);
    
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
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    console.log('User retrieval result:', {
      hasUser: !!user,
      userId: user?.id,
      userError: userError?.message
    });
    
    if (userError || !user) {
      console.error('Authentication failed:', userError);
      return new Response(JSON.stringify({
        error: 'Unauthorized - No valid user session'
      }), {
        status: 401,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
    const plaidSecret = Deno.env.get('PLAID_SECRET');

    console.log('Environment variables check:', {
      hasClientId: !!plaidClientId,
      hasSecret: !!plaidSecret,
      clientIdLength: plaidClientId?.length || 0,
      secretLength: plaidSecret?.length || 0
    });

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

    // Use production environment
    const plaidUrl = 'https://production.plaid.com/link/token/create';
    console.log('Using Plaid URL:', plaidUrl);

    const requestBody = {
      client_name: "Credit Card Dashboard",
      country_codes: ['US'],
      language: 'en',
      user: {
        client_user_id: user.id,
      },
      products: ['transactions'],
      account_filters: {
        credit: {
          account_subtypes: ['credit card', 'paypal']
        }
      }
    };

    console.log('Plaid request body:', JSON.stringify(requestBody, null, 2));

    console.log('Making request to Plaid with headers:', {
      url: plaidUrl,
      hasClientId: !!plaidClientId,
      hasSecret: !!plaidSecret,
      userId: user.id
    });

    const response = await fetch(plaidUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': plaidClientId,
        'PLAID-SECRET': plaidSecret,
      },
      body: JSON.stringify(requestBody),
    });

    const data = await response.json();
    
    console.log('Full Plaid response:', {
      status: response.status,
      statusText: response.statusText,
      headers: Object.fromEntries(response.headers.entries()),
      data: JSON.stringify(data, null, 2)
    });

    if (!response.ok) {
      console.error('Plaid API error - Full response:', data);
      return new Response(JSON.stringify({
        error: 'Failed to create link token',
        plaidError: {
          error_code: data.error_code,
          error_type: data.error_type,
          error_message: data.error_message,
          display_message: data.display_message
        },
        details: data
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    console.log('SUCCESS: Link token created:', !!data.link_token);
    console.log('=== PLAID LINK TOKEN REQUEST END ===');

    return new Response(JSON.stringify({ link_token: data.link_token }), {
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });

  } catch (error) {
    console.error('=== PLAID LINK TOKEN ERROR ===');
    console.error('Error details:', {
      message: error.message,
      stack: error.stack,
      name: error.name
    });
    return new Response(JSON.stringify({
      error: 'Internal server error',
      details: error.message
    }), {
      status: 500,
      headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    });
  }
});
