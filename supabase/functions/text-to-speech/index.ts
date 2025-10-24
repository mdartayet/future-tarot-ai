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
    const { text } = await req.json();
    
    if (!text) {
      throw new Error('Text is required');
    }

    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!apiKey) {
      throw new Error('Google Cloud API key not configured');
    }

    console.log('Generating speech for text:', text.substring(0, 100));

    // Using Google Cloud Text-to-Speech API with a soft, whispering female voice
    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { text },
          voice: {
            languageCode: 'es-ES',
            name: 'es-ES-Neural2-A', // Female voice
            ssmlGender: 'FEMALE'
          },
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.85, // Slightly slower for whisper effect
            pitch: -2.0, // Lower pitch for intimate, whispering tone
            volumeGainDb: -5.0 // Softer volume
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Google TTS API error:', error);
      throw new Error(`Failed to generate speech: ${error}`);
    }

    const data = await response.json();
    
    if (!data.audioContent) {
      throw new Error('No audio content received');
    }

    console.log('Speech generated successfully');

    return new Response(
      JSON.stringify({ audioContent: data.audioContent }),
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
