import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParsedMenuItem {
  name: string;
  description: string;
  price: number;
  tags: string[];
  confidence: number;
}

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { pdf_url } = await req.json();
    
    if (!pdf_url) {
      return new Response(
        JSON.stringify({ error: 'PDF URL is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log('Processing PDF from URL:', pdf_url);

    // Download PDF from storage
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseKey);

    // Extract bucket and path from URL
    const urlParts = pdf_url.split('/storage/v1/object/public/');
    if (urlParts.length < 2) {
      throw new Error('Invalid PDF URL format');
    }
    
    const [bucket, ...pathParts] = urlParts[1].split('/');
    const path = pathParts.join('/');

    // Download the PDF
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(path);

    if (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      throw new Error('Failed to download PDF file');
    }

    // Convert PDF to base64
    const arrayBuffer = await pdfData.arrayBuffer();
    const base64Pdf = btoa(String.fromCharCode(...new Uint8Array(arrayBuffer)));

    console.log('PDF downloaded, size:', arrayBuffer.byteLength, 'bytes');

    // Use OpenAI to parse the PDF content
    const prompt = `You are a menu parser. Extract all menu items from this restaurant menu PDF.

For each menu item, extract:
- name: The dish/item name
- description: Brief description of the item
- price: Price as a number (without $ symbol)
- tags: Array of dietary tags if mentioned (GF, V, VG, CF, DF, etc.)

Return ONLY a valid JSON object in this exact format:
{
  "items": [
    {
      "name": "Item Name",
      "description": "Item description",
      "price": 14.99,
      "tags": ["GF", "V"],
      "confidence": 0.95
    }
  ]
}

Rules:
- Extract ALL menu items you can find
- If no description is visible, use empty string ""
- If price is unclear, use 0
- Set confidence between 0-1 based on how clear the information is
- Only include tags that are explicitly shown (GF, V, VG, CF, DF, etc.)
- Return valid JSON only, no other text`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          {
            role: 'user',
            content: [
              { type: 'text', text: prompt },
              {
                type: 'image_url',
                image_url: {
                  url: `data:application/pdf;base64,${base64Pdf}`
                }
              }
            ]
          }
        ],
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', response.status, errorText);
      throw new Error(`OpenAI API error: ${response.status}`);
    }

    const data = await response.json();
    const content = data.choices[0].message.content;
    
    console.log('OpenAI response:', content);

    // Parse the JSON response
    let parsedData;
    try {
      // Remove markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      parsedData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error('Failed to parse OpenAI response:', content);
      throw new Error('Failed to parse menu items from PDF');
    }

    const items: ParsedMenuItem[] = parsedData.items || [];
    
    console.log(`Successfully parsed ${items.length} menu items`);

    return new Response(
      JSON.stringify({
        items,
        total_items: items.length,
        parsing_notes: items.length === 0 
          ? ['No menu items detected in PDF. Please check the file and try again.']
          : []
      }),
      { 
        status: 200,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );

  } catch (error) {
    console.error('Error in parse-menu-pdf function:', error);
    return new Response(
      JSON.stringify({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        items: [],
        total_items: 0,
        parsing_notes: ['Failed to process PDF. Please ensure it\'s a valid PDF file with readable text.']
      }),
      { 
        status: 500,
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
