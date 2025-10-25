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

    // Using Gemini 2.5 Pro with native TTS and Zephyr voice
    const response = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-pro-preview-tts:generateContentStream?key=${apiKey}`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          contents: [
            {
              role: 'user',
              parts: [
                {
                  text: text
                }
              ]
            }
          ],
          generationConfig: {
            temperature: 1,
            responseModalities: ['audio'],
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

    if (!response.body) {
      throw new Error('No response body received');
    }

    // Process streaming response and collect audio chunks
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    const audioChunks: Uint8Array[] = [];
    let buffer = '';

    while (true) {
      const { done, value } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        if (!line.trim() || line.startsWith('[')) continue;
        
        try {
          const chunk = JSON.parse(line);
          
          if (chunk.candidates?.[0]?.content?.parts?.[0]?.inlineData) {
            const inlineData = chunk.candidates[0].content.parts[0].inlineData;
            const audioData = inlineData.data;
            const mimeType = inlineData.mimeType || '';
            
            if (audioData) {
              // Decode base64 audio data
              const binaryString = atob(audioData);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              
              // If not WAV, convert to WAV
              if (!mimeType.includes('wav') && mimeType.includes('audio')) {
                const params = parseMimeType(mimeType);
                const wavHeader = createWavHeader(bytes.length, params);
                const wavFile = new Uint8Array(wavHeader.length + bytes.length);
                wavFile.set(wavHeader, 0);
                wavFile.set(bytes, wavHeader.length);
                audioChunks.push(wavFile);
              } else {
                audioChunks.push(bytes);
              }
            }
          }
        } catch (e) {
          console.error('Error parsing chunk:', e);
        }
      }
    }

    if (audioChunks.length === 0) {
      throw new Error('No audio data received from Gemini TTS');
    }

    console.log(`Received ${audioChunks.length} audio chunks`);

    // Combine all audio chunks
    const totalLength = audioChunks.reduce((sum, chunk) => sum + chunk.length, 0);
    const combinedAudio = new Uint8Array(totalLength);
    let offset = 0;
    for (const chunk of audioChunks) {
      combinedAudio.set(chunk, offset);
      offset += chunk.length;
    }

    // Convert to base64
    let binary = '';
    for (let i = 0; i < combinedAudio.length; i++) {
      binary += String.fromCharCode(combinedAudio[i]);
    }
    const base64Audio = btoa(binary);

    console.log('Mystical speech generated successfully with Zephyr voice');

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
