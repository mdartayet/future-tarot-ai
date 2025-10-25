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

    const apiKey = Deno.env.get('GOOGLE_CLOUD_API_KEY');
    if (!apiKey) {
      throw new Error('Google Cloud API key not configured');
    }

    console.log(`Generating mysterious whispering speech (${language}):`, text.substring(0, 100));

    // Use SSML for better whisper effect
    const ssmlText = `<speak>
      <prosody rate="slow" pitch="-5st" volume="loud">
        <amazon:effect name="whispered">
          ${text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')}
        </amazon:effect>
      </prosody>
    </speak>`;

    // Voice selection - using deeper, more mysterious female voices
    const voiceConfig = language === 'en' 
      ? {
          languageCode: 'en-US',
          name: 'en-US-Neural2-C',
          ssmlGender: 'FEMALE'
        }
      : {
          languageCode: 'es-ES', 
          name: 'es-ES-Neural2-E',
          ssmlGender: 'FEMALE'
        };

    const response = await fetch(
      `https://texttospeech.googleapis.com/v1/text:synthesize?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          input: { ssml: ssmlText },
          voice: voiceConfig,
          audioConfig: {
            audioEncoding: 'MP3',
            speakingRate: 0.65,
            pitch: -8.0,
            volumeGainDb: 8.0,
            effectsProfileId: ['headphone-class-device']
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
