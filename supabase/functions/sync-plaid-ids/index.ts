import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type'
};

serve(async (req) => {
  console.log('🔄 Starting Plaid ID sync process...');

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

    // CSV data mapping - cardType to plaid_account_id
    const cardMappings = [
      { cardType: "Business Platinum Card", plaid_account_id: "NYJO5DK4pxtX8xzbZ6jPIEdozLX1pyfz4kNQBz" },
      { cardType: "Business Green", plaid_account_id: "ekMY6dRrOLUjROmaz4KeH7Qn3kNLEvU9RKyYvQ" },
      { cardType: "Charles Schwab Platinum Card", plaid_account_id: "Xe8YqvJ7pVtALqYrox0bCjydp0zEBeIj9nvyBw" },
      { cardType: "Business Rose Gold", plaid_account_id: "9VAyLMgQXNIOo3BbqEKNHV0zZLR4YgtJnB54ny" },
      { cardType: "Business Blue Plus I", plaid_account_id: "77KBwzo3XpF6XkzO49D1cgX1xaJRyDsZgL7Egz" },
      { cardType: "Amazon Business Prime", plaid_account_id: "OeOYa1kZpJtmD7OKbx8QI9NxrVKzPjuPjRLej5" },
      { cardType: "Business Classic Gold", plaid_account_id: "nJ4YK3P5Nkf5EJ93YmVeUdyOn0ZkoqCXK9ONK5" },
      { cardType: "Delta SkyMiles® Reserve", plaid_account_id: "Eeb8ZM6XpKtB4ejq9Xo1UX7xVKB0RqIq4Dj84v" },
      { cardType: "Platinum Card", plaid_account_id: "pZ4wNKBobvfVwgXzyOReSneVgKovP6tLR8PDRy" },
      { cardType: "Bonvoy Business Amex", plaid_account_id: "VeQY1kaRp7t8wvOyRQMrupB4LXan08UJvxZYvY" },
      { cardType: "Business Blue Plus II", plaid_account_id: "ReJYwB07X5tAo6R0OQm3CjDeY4AwaVIra3JoaP" },
      { cardType: "Hilton Honors Business", plaid_account_id: "MeJVQLy9patQRXZVM0zOfzaV0MQe3Ytg6Y4O6w" },
      { cardType: "Business White Gold", plaid_account_id: "QeJYdqvypZt5pQzDwerJUa9Oyz5gvVsoVr3MVj" }
    ];

    console.log(`📋 Processing ${cardMappings.length} card mappings...`);

    let updatedCount = 0;
    let errors = [];

    // Update each card balance with the correct plaid_account_id
    for (const mapping of cardMappings) {
      try {
        console.log(`🔄 Updating ${mapping.cardType} with plaid_account_id: ${mapping.plaid_account_id}`);
        
        const { data, error } = await supabaseClient
          .from('card_balances')
          .update({ 
            plaid_account_id: mapping.plaid_account_id,
            last_synced: new Date().toISOString()
          })
          .eq('cardType', mapping.cardType);

        if (error) {
          console.error(`❌ Error updating ${mapping.cardType}:`, error);
          errors.push({ cardType: mapping.cardType, error: error.message });
        } else {
          console.log(`✅ Successfully updated ${mapping.cardType}`);
          updatedCount++;
        }
      } catch (err) {
        console.error(`❌ Exception updating ${mapping.cardType}:`, err);
        errors.push({ cardType: mapping.cardType, error: err.message });
      }
    }

    console.log(`🎉 Sync process completed. Updated: ${updatedCount}, Errors: ${errors.length}`);

    return new Response(JSON.stringify({
      success: true,
      updated: updatedCount,
      total: cardMappings.length,
      errors: errors,
      message: `Successfully updated ${updatedCount} card balance records with new Plaid account IDs`
    }), {
      headers: {
        ...corsHeaders,
        'Content-Type': 'application/json'
      }
    });

  } catch (error) {
    console.error('❌ Error in sync process:', error);
    return new Response(JSON.stringify({
      success: false,
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