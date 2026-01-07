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
    const { images } = await req.json();
    
    if (!images || !Array.isArray(images) || images.length === 0) {
      return new Response(
        JSON.stringify({ error: 'Images array is required' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OPENAI_API_KEY is not configured');
    }

    console.log(`Processing ${images.length} page image(s)`);

    // Collect all menu items from all pages
    const allItems: ParsedMenuItem[] = [];
    let detectedMonth: string | null = null;

    // Process each page image
    for (let pageNum = 0; pageNum < images.length; pageNum++) {
      console.log(`Processing page ${pageNum + 1}/${images.length}...`);
      
      try {
        const base64Image = images[pageNum];

        // Use OpenAI to parse the page image
        const prompt = `You are a menu parser. Extract all menu items from this restaurant menu page.

IMPORTANT: First, look for any month or date information in the menu title/header (e.g., "January Specials", "February 2026 Menu", etc.). Extract this as "detected_month".

For each menu item, extract:
- name: The dish/item name
- description: Brief description of the item
- price: Price as a number (without $ symbol)
- tags: Array of dietary tags if mentioned (GF, V, VG, CF, DF, etc.)

Return ONLY a valid JSON object in this exact format:
{
  "detected_month": "January 2026",
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
- Extract the month/year from the menu title if present (e.g., "January 2026", "February", etc.)
- If no month is visible, set detected_month to null
- Extract ALL menu items you can find on this page
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
                      url: base64Image
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
          console.error(`OpenAI API error on page ${pageNum + 1}:`, response.status, errorText);
          continue; // Skip this page but continue with others
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        console.log(`OpenAI response for page ${pageNum + 1}:`, content);

        // Parse the JSON response
        try {
          const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsedData = JSON.parse(cleanedContent);
          const pageItems: ParsedMenuItem[] = parsedData.items || [];
          
          // Capture detected month from first page that has it
          if (!detectedMonth && parsedData.detected_month) {
            detectedMonth = parsedData.detected_month;
            console.log(`Detected month from PDF: ${detectedMonth}`);
          }
          
          console.log(`Extracted ${pageItems.length} items from page ${pageNum + 1}`);
          allItems.push(...pageItems);
        } catch (parseError) {
          console.error(`Failed to parse OpenAI response for page ${pageNum + 1}:`, content);
        }
      } catch (pageError) {
        console.error(`Error processing page ${pageNum + 1}:`, pageError);
        // Continue with next page
      }
    }
    
    console.log(`Successfully parsed ${allItems.length} total menu items from ${images.length} page(s)`);

    return new Response(
      JSON.stringify({
        items: allItems,
        total_items: allItems.length,
        pages_processed: images.length,
        detected_month: detectedMonth,
        parsing_notes: allItems.length === 0 
          ? ['No menu items detected in images. Please check the file and try again.']
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
