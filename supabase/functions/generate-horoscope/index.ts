import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.75.1";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { sign } = await req.json();
    
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    const today = new Date().toISOString().split('T')[0];

    // Check if horoscope already exists for today
    const { data: existing } = await supabase
      .from('daily_horoscopes')
      .select('*')
      .eq('sign', sign)
      .eq('date', today)
      .single();

    if (existing) {
      return new Response(
        JSON.stringify({ prediction: existing.prediction }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Generate new horoscope using Lovable AI
    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY not configured');
    }

    const systemPrompt = `Eres un astrólogo experto que crea horóscopos diarios basados en las posiciones planetarias y constelaciones. 
    Genera predicciones únicas, personalizadas y profundas para cada signo zodiacal.
    Incluye aspectos de amor, trabajo, salud y energía del día.
    Usa un tono místico pero profesional. La predicción debe ser de 3-4 párrafos.`;

    const userPrompt = `Genera el horóscopo diario para ${sign} considerando:
    - Las posiciones planetarias actuales
    - Las constelaciones visibles
    - Los tránsitos astrológicos del día
    - La influencia lunar
    
    Proporciona una predicción completa que cubra amor, trabajo, salud y energía general.`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: userPrompt }
        ],
      }),
    });

    if (!aiResponse.ok) {
      if (aiResponse.status === 429) {
        throw new Error('Límite de uso excedido, intenta más tarde');
      }
      if (aiResponse.status === 402) {
        throw new Error('Se requiere pago para continuar usando el servicio');
      }
      throw new Error('Error generando horóscopo');
    }

    const aiData = await aiResponse.json();
    const prediction = aiData.choices[0].message.content;

    // Save to database
    await supabase
      .from('daily_horoscopes')
      .insert({
        sign,
        date: today,
        prediction
      });

    return new Response(
      JSON.stringify({ prediction }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in generate-horoscope:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' }
      }
    );
  }
});