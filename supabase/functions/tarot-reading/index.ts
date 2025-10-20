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

    const { userName, focus, question, cards, language = 'es' } = await req.json();
    
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
      const positions = language === 'es' ? ['Pasado', 'Presente', 'Futuro'] : ['Past', 'Present', 'Future'];
      return `${positions[index]}: ${card.name}\n${language === 'es' ? 'Significado' : 'Meaning'}: ${card.meaning}\n${language === 'es' ? 'Lectura' : 'Reading'}: ${card.reading}`;
    }).join('\n\n');

    const systemPrompt = language === 'es' 
      ? `Eres un místico lector de tarot con profundo conocimiento esotérico. 
Tu misión es proporcionar lecturas personalizadas, profundas y significativas basadas en las cartas del tarot.
Habla con un tono místico pero accesible, usando metáforas y simbolismo.

IMPORTANTE: Estructura tu respuesta en TRES secciones claramente marcadas:
- PASADO: (breve explicación de la carta + cómo se relaciona con el destino y pregunta del consultante)
- PRESENTE: (breve explicación de la carta + cómo se relaciona con el destino y pregunta del consultante)
- FUTURO: (breve explicación de la carta + cómo se relaciona con el destino y pregunta del consultante)

Cada sección DEBE seguir esta estructura:
1. Primero, explica brevemente el significado esotérico de la carta (2-3 oraciones)
2. Luego, conecta ese significado con la pregunta específica del consultante y su destino (3-4 oraciones)

Cada sección debe comenzar exactamente con su título en mayúsculas seguido de dos puntos.`
      : `You are a mystical tarot reader with deep esoteric knowledge.
Your mission is to provide personalized, profound and meaningful readings based on the tarot cards.
Speak with a mystical but accessible tone, using metaphors and symbolism.

IMPORTANT: Structure your response in THREE clearly marked sections:
- PAST: (brief explanation of the card + how it relates to the querent's destiny and question)
- PRESENT: (brief explanation of the card + how it relates to the querent's destiny and question)
- FUTURE: (brief explanation of the card + how it relates to the querent's destiny and question)

Each section MUST follow this structure:
1. First, briefly explain the esoteric meaning of the card (2-3 sentences)
2. Then, connect that meaning to the querent's specific question and destiny (3-4 sentences)

Each section must start exactly with its title in uppercase followed by a colon.`;

    const userPrompt = language === 'es'
      ? `El viajero ${userName} busca respuestas sobre ${focus}.

Su pregunta es: "${sanitizedQuestion}"

Las cartas reveladas son:
${cardDescriptions}

Proporciona una lectura dividida en tres secciones claramente identificadas. Para cada sección:

PASADO: 
- Primero explica qué representa ${cards[0].name} en el tarot (su simbolismo y energía)
- Luego conecta esa carta con los orígenes de la situación relacionada a "${sanitizedQuestion}"
- Explica cómo esta energía del pasado ha moldeado el camino actual del consultante
(120-140 palabras total)

PRESENTE: 
- Primero explica qué representa ${cards[1].name} en el tarot (su simbolismo y energía)
- Luego conecta esa carta con el momento actual del consultante respecto a "${sanitizedQuestion}"
- Describe cómo esta energía influye en las decisiones y circunstancias presentes
(120-140 palabras total)

FUTURO: 
- Primero explica qué representa ${cards[2].name} en el tarot (su simbolismo y energía)
- Luego conecta esa carta con las posibilidades futuras relacionadas a "${sanitizedQuestion}"
- Ofrece guía sobre cómo alinearse con esta energía para manifestar el mejor destino posible
(120-140 palabras total)`
      : `The traveler ${userName} seeks answers about ${focus}.

Their question is: "${sanitizedQuestion}"

The revealed cards are:
${cardDescriptions}

Provide a reading divided into three clearly identified sections. For each section:

PAST: 
- First explain what ${cards[0].name} represents in tarot (its symbolism and energy)
- Then connect that card with the origins of the situation related to "${sanitizedQuestion}"
- Explain how this energy from the past has shaped the querent's current path
(120-140 words total)

PRESENT: 
- First explain what ${cards[1].name} represents in tarot (its symbolism and energy)
- Then connect that card with the querent's current moment regarding "${sanitizedQuestion}"
- Describe how this energy influences present decisions and circumstances
(120-140 words total)

FUTURE: 
- First explain what ${cards[2].name} represents in tarot (its symbolism and energy)
- Then connect that card with future possibilities related to "${sanitizedQuestion}"
- Offer guidance on how to align with this energy to manifest the best possible destiny
(120-140 words total)`;

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
