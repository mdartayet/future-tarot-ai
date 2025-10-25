import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Helper function to create WAV header
function createWavHeader(dataLength: number, options: {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
}): Uint8Array {
  const { numChannels, sampleRate, bitsPerSample } = options;
  const byteRate = sampleRate * numChannels * bitsPerSample / 8;
  const blockAlign = numChannels * bitsPerSample / 8;
  const buffer = new Uint8Array(44);
  
  // RIFF header
  buffer.set([0x52, 0x49, 0x46, 0x46], 0); // "RIFF"
  const chunkSize = 36 + dataLength;
  buffer[4] = chunkSize & 0xff;
  buffer[5] = (chunkSize >> 8) & 0xff;
  buffer[6] = (chunkSize >> 16) & 0xff;
  buffer[7] = (chunkSize >> 24) & 0xff;
  buffer.set([0x57, 0x41, 0x56, 0x45], 8); // "WAVE"
  
  // fmt subchunk
  buffer.set([0x66, 0x6d, 0x74, 0x20], 12); // "fmt "
  buffer.set([16, 0, 0, 0], 16); // Subchunk1Size
  buffer.set([1, 0], 20); // AudioFormat (PCM)
  buffer.set([numChannels, 0], 22); // NumChannels
  buffer[24] = sampleRate & 0xff;
  buffer[25] = (sampleRate >> 8) & 0xff;
  buffer[26] = (sampleRate >> 16) & 0xff;
  buffer[27] = (sampleRate >> 24) & 0xff;
  buffer[28] = byteRate & 0xff;
  buffer[29] = (byteRate >> 8) & 0xff;
  buffer[30] = (byteRate >> 16) & 0xff;
  buffer[31] = (byteRate >> 24) & 0xff;
  buffer.set([blockAlign, 0], 32);
  buffer.set([bitsPerSample, 0], 34);
  
  // data subchunk
  buffer.set([0x64, 0x61, 0x74, 0x61], 36); // "data"
  buffer[40] = dataLength & 0xff;
  buffer[41] = (dataLength >> 8) & 0xff;
  buffer[42] = (dataLength >> 16) & 0xff;
  buffer[43] = (dataLength >> 24) & 0xff;
  
  return buffer;
}

// Parse mime type to extract audio parameters
function parseMimeType(mimeType: string): {
  numChannels: number;
  sampleRate: number;
  bitsPerSample: number;
} {
  const params = mimeType.split(';').map(s => s.trim());
  const format = params[0].split('/')[1];
  
  const options = {
    numChannels: 1,
    sampleRate: 24000, // default
    bitsPerSample: 16, // default
  };
  
  if (format && format.startsWith('L')) {
    const bits = parseInt(format.slice(1), 10);
    if (!isNaN(bits)) {
      options.bitsPerSample = bits;
    }
  }
  
  for (const param of params) {
    const [key, value] = param.split('=').map(s => s.trim());
    if (key === 'rate') {
      options.sampleRate = parseInt(value, 10);
    }
  }
  
  return options;
}

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

    console.log(`Generating mystical speech with Zephyr voice (${language}):`, text.substring(0, 100));

    // Using Gemini 2.5 Flash with native TTS and Zephyr voice
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent`,
      {
        method: 'POST',
        headers: {
          'x-goog-api-key': apiKey,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [{
            parts: [{
              text: text
            }]
          }],
          generationConfig: {
            responseModalities: ['AUDIO'],
            speechConfig: {
              voiceConfig: {
                prebuiltVoiceConfig: {
                  voiceName: 'Zephyr'
                }
              }
            }
          }
        })
      }
    );

    if (!response.ok) {
      const error = await response.text();
      console.error('Gemini TTS API error:', error);
      throw new Error(`Failed to generate speech: ${error}`);
    }

    const data = await response.json();
    
    if (!data.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data) {
      throw new Error('No audio data received from Gemini TTS');
    }

    // The audio data is already in base64 format from Gemini
    const base64Audio = data.candidates[0].content.parts[0].inlineData.data;
    const mimeType = data.candidates[0].content.parts[0].inlineData.mimeType || 'audio/pcm';

    console.log(`Mystical speech generated successfully with Zephyr voice (${mimeType})`);

    // If it's PCM, we need to convert to WAV
    let finalBase64Audio = base64Audio;
    if (mimeType.includes('pcm') || mimeType.includes('L16')) {
      console.log('Converting PCM to WAV...');
      
      // Decode base64 to get raw PCM data
      const binaryString = atob(base64Audio);
      const pcmData = new Uint8Array(binaryString.length);
      for (let i = 0; i < binaryString.length; i++) {
        pcmData[i] = binaryString.charCodeAt(i);
      }
      
      // Create WAV header (PCM, 24000 Hz, 16-bit, mono)
      const wavHeader = createWavHeader(pcmData.length, {
        numChannels: 1,
        sampleRate: 24000,
        bitsPerSample: 16
      });
      
      // Combine header + PCM data
      const wavFile = new Uint8Array(wavHeader.length + pcmData.length);
      wavFile.set(wavHeader, 0);
      wavFile.set(pcmData, wavHeader.length);
      
      // Convert back to base64
      let binary = '';
      for (let i = 0; i < wavFile.length; i++) {
        binary += String.fromCharCode(wavFile[i]);
      }
      finalBase64Audio = btoa(binary);
      console.log('PCM converted to WAV successfully');
    }

    return new Response(
      JSON.stringify({ audioContent: finalBase64Audio }),
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
