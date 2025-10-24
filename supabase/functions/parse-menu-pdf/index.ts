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

// Helper function to convert PDF page to PNG base64
async function pdfPageToImage(pdfBytes: Uint8Array, pageNumber: number): Promise<string> {
  try {
    // Import PDF.js library
    const pdfjsLib = await import('https://esm.sh/pdfjs-dist@4.0.379/build/pdf.mjs');
    
    // Set worker to null for Deno environment
    pdfjsLib.GlobalWorkerOptions.workerSrc = null;

    // Load the PDF document
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;

    // Get the specific page
    const page = await pdf.getPage(pageNumber);
    
    // Set scale for better quality (2x for 150 DPI)
    const scale = 2.0;
    const viewport = page.getViewport({ scale });

    // Create a canvas (using a mock canvas for Deno)
    const { createCanvas } = await import('https://deno.land/x/canvas@v1.4.1/mod.ts');
    const canvas = createCanvas(viewport.width, viewport.height);
    const context = canvas.getContext('2d');

    // Render the page
    const renderContext = {
      canvasContext: context,
      viewport: viewport,
    };
    
    await page.render(renderContext).promise;

    // Convert canvas to PNG base64
    const pngData = canvas.toBuffer('image/png');
    const base64Image = btoa(String.fromCharCode(...new Uint8Array(pngData)));
    
    return base64Image;
  } catch (error) {
    console.error(`Error converting page ${pageNumber}:`, error);
    throw error;
  }
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
    
    const pathAfterPublic = urlParts[1];
    const firstSlashIndex = pathAfterPublic.indexOf('/');
    const bucket = pathAfterPublic.substring(0, firstSlashIndex);
    const path = pathAfterPublic.substring(firstSlashIndex + 1);

    console.log('Downloading from bucket:', bucket, 'path:', path);

    // Download the PDF
    const { data: pdfData, error: downloadError } = await supabase.storage
      .from(bucket)
      .download(path);

    if (downloadError) {
      console.error('Error downloading PDF:', downloadError);
      throw new Error('Failed to download PDF file');
    }

    // Convert PDF to Uint8Array
    const arrayBuffer = await pdfData.arrayBuffer();
    const pdfBytes = new Uint8Array(arrayBuffer);

    console.log('PDF downloaded, size:', arrayBuffer.byteLength, 'bytes');

    // Import PDF.js to get page count
    const pdfjsLib = await import('https://esm.sh/pdfjs-dist@4.0.379/build/pdf.mjs');
    pdfjsLib.GlobalWorkerOptions.workerSrc = null;
    const loadingTask = pdfjsLib.getDocument({ data: pdfBytes });
    const pdf = await loadingTask.promise;
    const numPages = pdf.numPages;

    console.log(`PDF has ${numPages} page(s), processing...`);

    // Collect all menu items from all pages
    const allItems: ParsedMenuItem[] = [];

    // Process each page
    for (let pageNum = 1; pageNum <= numPages; pageNum++) {
      console.log(`Processing page ${pageNum}/${numPages}...`);
      
      try {
        // Convert PDF page to image
        const base64Image = await pdfPageToImage(pdfBytes, pageNum);

        // Use OpenAI to parse the page image
        const prompt = `You are a menu parser. Extract all menu items from this restaurant menu page.

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
                      url: `data:image/png;base64,${base64Image}`
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
          console.error(`OpenAI API error on page ${pageNum}:`, response.status, errorText);
          continue; // Skip this page but continue with others
        }

        const data = await response.json();
        const content = data.choices[0].message.content;
        
        console.log(`OpenAI response for page ${pageNum}:`, content);

        // Parse the JSON response
        try {
          const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
          const parsedData = JSON.parse(cleanedContent);
          const pageItems: ParsedMenuItem[] = parsedData.items || [];
          
          console.log(`Extracted ${pageItems.length} items from page ${pageNum}`);
          allItems.push(...pageItems);
        } catch (parseError) {
          console.error(`Failed to parse OpenAI response for page ${pageNum}:`, content);
        }
      } catch (pageError) {
        console.error(`Error processing page ${pageNum}:`, pageError);
        // Continue with next page
      }
    }
    
    console.log(`Successfully parsed ${allItems.length} total menu items from ${numPages} page(s)`);

    return new Response(
      JSON.stringify({
        items: allItems,
        total_items: allItems.length,
        pages_processed: numPages,
        parsing_notes: allItems.length === 0 
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
