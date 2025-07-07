import { createClient } from 'https://esm.sh/@supabase/supabase-js@2.50.0'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Create Supabase client with service role key for admin operations
    const supabase = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? '',
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    )

    console.log('Starting email sync for existing profiles...')

    // Get all users from auth
    const { data: authUsers, error: authError } = await supabase.auth.admin.listUsers()
    
    if (authError) {
      console.error('Error fetching auth users:', authError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch auth users' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Get profiles that don't have email set
    const { data: profiles, error: profilesError } = await supabase
      .from('profiles')
      .select('id, email')
      .is('email', null)

    if (profilesError) {
      console.error('Error fetching profiles:', profilesError)
      return new Response(
        JSON.stringify({ error: 'Failed to fetch profiles' }),
        { 
          status: 500, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    console.log(`Found ${profiles?.length || 0} profiles without email`)

    // Update each profile with the corresponding email
    let updatedCount = 0
    for (const profile of profiles || []) {
      const authUser = authUsers.users.find(u => u.id === profile.id)
      if (authUser?.email) {
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ email: authUser.email })
          .eq('id', profile.id)

        if (updateError) {
          console.error(`Error updating profile ${profile.id}:`, updateError)
        } else {
          updatedCount++
          console.log(`Updated profile ${profile.id} with email ${authUser.email}`)
        }
      }
    }

    console.log(`Successfully updated ${updatedCount} profiles`)

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: `Updated ${updatedCount} profiles with email addresses` 
      }),
      { 
        status: 200, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('Unexpected error:', error)
    return new Response(
      JSON.stringify({ error: 'Internal server error' }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})