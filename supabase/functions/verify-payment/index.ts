import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.7.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    console.log('🔍 Starting payment verification...');
    
    // Get auth header
    const authHeader = req.headers.get('Authorization');
    console.log('📋 Auth header present:', !!authHeader);
    
    if (!authHeader) {
      console.error('❌ No authorization header');
      throw new Error('No authorization header');
    }

    // Create authenticated Supabase client
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

    // Verify user is authenticated
    console.log('👤 Verifying user authentication...');
    const { data: { user }, error: userError } = await supabaseClient.auth.getUser();
    
    if (userError) {
      console.error('❌ Authentication error:', userError);
    }
    
    if (!user) {
      console.error('❌ No user found');
      return new Response(
        JSON.stringify({ error: 'Unauthorized - No user found' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    console.log('✅ User authenticated:', user.id);

    // Parse request body
    const { orderId, readingId } = await req.json();
    
    if (!orderId || !readingId) {
      return new Response(
        JSON.stringify({ error: 'Missing orderId or readingId' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('🔍 Verifying PayPal order:', orderId);

    // Get PayPal access token
    const PAYPAL_CLIENT_ID = Deno.env.get('VITE_PAYPAL_CLIENT_ID');
    const PAYPAL_SECRET = Deno.env.get('PAYPAL_SECRET_KEY');
    
    if (!PAYPAL_CLIENT_ID || !PAYPAL_SECRET) {
      console.error('❌ PayPal credentials not configured');
      return new Response(
        JSON.stringify({ error: 'Payment system not configured' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Get PayPal access token
    const authResponse = await fetch('https://api-m.sandbox.paypal.com/v1/oauth2/token', {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Language': 'en_US',
        'Authorization': `Basic ${btoa(`${PAYPAL_CLIENT_ID}:${PAYPAL_SECRET}`)}`,
        'Content-Type': 'application/x-www-form-urlencoded'
      },
      body: 'grant_type=client_credentials'
    });

    if (!authResponse.ok) {
      const errorText = await authResponse.text();
      console.error('❌ PayPal auth failed:', errorText);
      throw new Error('Failed to authenticate with PayPal');
    }

    const authData = await authResponse.json();
    const accessToken = authData.access_token;

    // Verify the order with PayPal
    const orderResponse = await fetch(
      `https://api-m.sandbox.paypal.com/v2/checkout/orders/${orderId}`,
      {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${accessToken}`,
          'Content-Type': 'application/json'
        }
      }
    );

    if (!orderResponse.ok) {
      const errorText = await orderResponse.text();
      console.error('❌ PayPal order verification failed:', errorText);
      return new Response(
        JSON.stringify({ error: 'Payment verification failed' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const order = await orderResponse.json();
    console.log('✅ PayPal order retrieved:', order.id, 'Status:', order.status);

    // Validate payment
    const amount = order.purchase_units[0].amount.value;
    const status = order.status;

    if (status !== 'COMPLETED') {
      return new Response(
        JSON.stringify({ error: 'Payment not completed', status }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (parseFloat(amount) !== 2.99) {
      console.error('❌ Invalid amount:', amount);
      return new Response(
        JSON.stringify({ error: 'Invalid payment amount' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verify reading belongs to user
    const { data: reading, error: readingError } = await supabaseClient
      .from('tarot_readings')
      .select('user_id')
      .eq('id', readingId)
      .single();

    if (readingError || !reading || reading.user_id !== user.id) {
      console.error('❌ Reading verification failed:', readingError);
      return new Response(
        JSON.stringify({ error: 'Invalid reading' }),
        { status: 403, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Use service role to insert payment and update reading
    const supabaseAdmin = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    // Check if payment already exists
    const { data: existingPayment } = await supabaseAdmin
      .from('payments')
      .select('id')
      .eq('paypal_order_id', orderId)
      .single();

    if (existingPayment) {
      console.log('⚠️ Payment already processed:', orderId);
      return new Response(
        JSON.stringify({ 
          success: true, 
          message: 'Payment already verified',
          alreadyProcessed: true 
        }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Insert payment record
    const { error: paymentError } = await supabaseAdmin
      .from('payments')
      .insert({
        reading_id: readingId,
        paypal_order_id: orderId,
        amount: 2.99,
        status: 'COMPLETED'
      });

    if (paymentError) {
      console.error('❌ Failed to record payment:', paymentError);
      throw new Error('Failed to record payment');
    }

    // Update reading to unlock premium
    const { error: updateError } = await supabaseAdmin
      .from('tarot_readings')
      .update({ is_premium_unlocked: true })
      .eq('id', readingId);

    if (updateError) {
      console.error('❌ Failed to unlock premium:', updateError);
      throw new Error('Failed to unlock premium content');
    }

    console.log('✅ Payment verified and recorded successfully');

    return new Response(
      JSON.stringify({ 
        success: true, 
        message: 'Payment verified and premium unlocked' 
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('❌ Error in verify-payment:', error);
    const errorMessage = error instanceof Error ? error.message : 'Internal server error';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
