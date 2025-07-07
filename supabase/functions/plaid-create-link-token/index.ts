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

    const plaidClientId = Deno.env.get('PLAID_CLIENT_ID');
    const plaidSecret = Deno.env.get('PLAID_SECRET');

    console.log('Environment check:', {
      hasClientId: !!plaidClientId,
      hasSecret: !!plaidSecret,
      userId: user.id
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

    // Use production environment for Limited Production access
    const plaidUrl = 'https://production.plaid.com/link/token/create';
    const requestBody = {
      user: {
        client_user_id: user.id
      },
      client_name: 'Amex Balance Tracker',
      products: [
        'transactions'
      ],
      country_codes: [
        'US'
      ],
      language: 'en'
    };

    console.log('Making request to Plaid:', {
      url: plaidUrl,
      body: requestBody
    });

    const response = await fetch(plaidUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'PLAID-CLIENT-ID': plaidClientId,
        'PLAID-SECRET': plaidSecret
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    console.log('Plaid response:', {
      status: response.status,
      data
    });

    if (!response.ok) {
      console.error('Plaid API error:', data);
      return new Response(JSON.stringify({
        error: 'Failed to create link token',
        details: data
      }), {
        status: 500,
        headers: {
          ...corsHeaders,
          'Content-Type': 'application/json'
        }
      });
    }

    return new Response(JSON.stringify({
      link_token: data.link_token
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('Error creating link token:', error);
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