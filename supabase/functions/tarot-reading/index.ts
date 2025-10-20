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
    // Get and validate auth header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Create authenticated Supabase client
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_ANON_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey, {
      global: { headers: { Authorization: authHeader } }
    });

    // Verify user is authenticated
    const { data: { user }, error: userError } = await supabase.auth.getUser();
    if (userError || !user) {
      console.error('Auth error:', userError);
      return new Response(
        JSON.stringify({ error: 'No autorizado' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const { userName, focus, question, cards } = await req.json();
    
    // Input validation
    if (!question || typeof question !== 'string') {
      return new Response(
        JSON.stringify({ error: 'Se requiere una pregunta válida' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const trimmedQuestion = question.trim();
    if (trimmedQuestion.length < 10 || trimmedQuestion.length > 500) {
      return new Response(
        JSON.stringify({ error: 'La pregunta debe tener entre 10 y 500 caracteres' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!['love', 'career', 'money'].includes(focus)) {
      return new Response(
        JSON.stringify({ error: 'Enfoque inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    if (!userName || userName.length > 50) {
      return new Response(
        JSON.stringify({ error: 'Nombre inválido' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY no está configurada');
    }

    // Sanitize question before AI prompt
    const sanitizedQuestion = trimmedQuestion
      .replace(/[<>]/g, '')
      .substring(0, 500);

    // Create prompt for AI
    const cardDescriptions = cards.map((card: any, index: number) => {
      const positions = ['Pasado', 'Presente', 'Futuro'];
      return `${positions[index]}: ${card.name}\nSignificado: ${card.meaning}\nLectura: ${card.reading}`;
    }).join('\n\n');

    const systemPrompt = `Eres un místico lector de tarot con profundo conocimiento esotérico. 
Tu misión es proporcionar lecturas personalizadas, profundas y significativas basadas en las cartas del tarot.
Habla con un tono místico pero accesible, usando metáforas y simbolismo.
Sé específico en tus respuestas y conecta las cartas con la pregunta del usuario.

IMPORTANTE: Estructura tu respuesta en TRES secciones claramente marcadas:
- PASADO: (análisis de la primera carta y su relación con el pasado del consultante)
- PRESENTE: (análisis de la segunda carta y su situación actual)
- FUTURO: (análisis de la tercera carta y las proyecciones hacia adelante)

Cada sección debe comenzar exactamente con su título en mayúsculas seguido de dos puntos.`;

    const userPrompt = `El viajero ${userName} busca respuestas sobre ${focus}.

Su pregunta es: "${sanitizedQuestion}"

Las cartas reveladas son:
${cardDescriptions}

Proporciona una lectura dividida en tres secciones claramente identificadas:

PASADO: Explica cómo la carta ${cards[0].name} revela las raíces y antecedentes de su situación. (100-120 palabras)

PRESENTE: Analiza cómo la carta ${cards[1].name} refleja su momento actual y los desafíos/oportunidades presentes. (100-120 palabras)

FUTURO: Interpreta cómo la carta ${cards[2].name} indica las tendencias y posibilidades que se aproximan. (100-120 palabras)

Responde directamente a su pregunta "${sanitizedQuestion}" en cada sección.`;

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

    // Save reading to database using authenticated user ID
    const serviceSupabase = createClient(supabaseUrl, Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!);
    
    const { error: insertError } = await serviceSupabase.from('user_readings').insert({
      user_id: user.id,  // Use authenticated user ID
      user_name: userName,
      focus,
      question: sanitizedQuestion,
      cards,
      ai_response: aiResponse,
    });

    if (insertError) {
      console.error('Insert error:', insertError);
      throw insertError;
    }

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
