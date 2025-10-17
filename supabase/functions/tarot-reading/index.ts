import "https://deno.land/x/xhr@0.1.0/mod.ts";
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
    const { userName, focus, question, cards } = await req.json();
    
    if (!question || !question.trim()) {
      return new Response(
        JSON.stringify({ error: 'Se requiere una pregunta para la lectura premium' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY no está configurada');
    }

    // Create prompt for AI
    const cardDescriptions = cards.map((card: any, index: number) => {
      const positions = ['Pasado', 'Presente', 'Futuro'];
      return `${positions[index]}: ${card.name}\nSignificado: ${card.meaning}\nLectura: ${card.reading}`;
    }).join('\n\n');

    const systemPrompt = `Eres un místico lector de tarot con profundo conocimiento esotérico. 
Tu misión es proporcionar lecturas personalizadas, profundas y significativas basadas en las cartas del tarot.
Habla con un tono místico pero accesible, usando metáforas y simbolismo.
Sé específico en tus respuestas y conecta las cartas con la pregunta del usuario.`;

    const userPrompt = `El viajero ${userName} busca respuestas sobre ${focus}.

Su pregunta es: "${question}"

Las cartas reveladas son:
${cardDescriptions}

Proporciona una lectura detallada y personalizada que:
1. Responda directamente a su pregunta
2. Conecte las tres cartas (pasado, presente, futuro) con su situación
3. Ofrezca guía práctica y espiritual
4. Mantenga un tono místico pero comprensible
5. Sea profunda pero concisa (máximo 400 palabras)`;

    // Call Lovable AI
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
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

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Límite de consultas excedido, intenta más tarde' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Se requieren créditos para usar esta función' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      const errorText = await response.text();
      console.error('Error de AI Gateway:', response.status, errorText);
      throw new Error('Error al generar lectura con IA');
    }

    const data = await response.json();
    const aiResponse = data.choices[0].message.content;

    // Save reading to database
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    await supabase.from('user_readings').insert({
      user_id: userName, // Using userName as temporary user_id
      user_name: userName,
      focus,
      question,
      cards,
      ai_response: aiResponse,
    });

    return new Response(
      JSON.stringify({ response: aiResponse }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Error en tarot-reading:', error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Error desconocido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});