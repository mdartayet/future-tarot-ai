import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { text, language = 'es' } = await req.json();
    
    if (!text) {
      throw new Error('Text is required');
    }

    const apiKey = Deno.env.get('GOOGLE_AI_STUDIO_API_KEY');
    if (!apiKey) {
      throw new Error('Google AI Studio API key not configured');
    }

    console.log(`Generating mysterious whispering speech (${language}):`, text.substring(0, 100));

    // Select voice based on language
    const voiceName = language === 'en' ? 'en-US-Journey-F' : 'es-ES-Journey-F';
    
    // Using Google AI Studio Text-to-Speech API
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text: text },
          voice: {
            languageCode: language === 'en' ? 'en-US' : 'es-ES',
            name: voiceName
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.75,
            pitch: -2.0
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Google AI Studio TTS API error:', error);
      throw new Error(`Failed to generate speech: ${error}`);
    }

    const data = await response.json();
    
    if (!data.audioContent) {
      throw new Error('No audio content received from Google AI Studio');
    }

    const base64Audio = data.audioContent;

    console.log('Speech generated successfully');

    return new Response(
      JSON.stringify({ audioContent: base64Audio }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  } catch (error: any) {
    console.error('Error in text-to-speech function:', error);
    return new Response(
      JSON.stringify({ error: error?.message || 'Unknown error' }),
      {
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
      }
    );
  }
});
