
import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
const supabaseUrl = Deno.env.get('SUPABASE_URL');
const supabaseKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

async function sendWebhookWithRetry(payload: any, maxRetries = 3): Promise<void> {
  let lastError: Error | null = null;
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Webhook attempt ${attempt}/${maxRetries}:`, JSON.stringify(payload, null, 2));
      
      const response = await fetch("https://hook.us2.make.com/ycn54k1rkfnymmiqud08vb6lvoeml1rs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        console.log('AI response webhook sent successfully on attempt', attempt);
        return;
      } else {
        throw new Error(`Webhook failed with status: ${response.status}`);
      }
    } catch (error) {
      lastError = error as Error;
      console.error(`Webhook attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff: wait longer between retries
        const delay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        console.log(`Retrying webhook in ${delay}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Log final failure but don't throw - webhook failure shouldn't block the response
  console.error('All webhook attempts failed. Last error:', lastError);
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    console.log('Edge function called - generate_review_response');
    const { feedbackId, feedback, rating, guestName, email, visitDate, consentToShare } = await req.json();
    
    console.log('Processing feedback:', { feedbackId, rating, guestName, email });

    // Compose prompt
    const prompt = `Respond to this guest review in a friendly, professional tone.\nRating: ${rating}/5\nFeedback: "${feedback}"`;

    console.log('Calling OpenAI API...');
    const aiResult = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "You are an experienced hospitality brand. Respond warmly and professionally to guest feedback for Champions Sports Bar & Grill." },
          { role: "user", content: prompt },
        ],
        max_tokens: 250,
        temperature: 0.7,
      }),
    });
    
    const aiData = await aiResult.json();
    const aiResponseText = aiData.choices?.[0]?.message?.content || null;
    
    console.log('AI response generated:', aiResponseText ? 'Success' : 'Failed');

    // Store the generated response in DB
    if (feedbackId && aiResponseText) {
      console.log('Updating feedback in database...');
      const updateResponse = await fetch(`${supabaseUrl}/rest/v1/guest_feedback?id=eq.${feedbackId}`, {
        method: "PATCH",
        headers: {
          "apikey": supabaseKey,
          "Authorization": `Bearer ${supabaseKey}`,
          "Content-Type": "application/json",
          "Prefer": "return=minimal"
        },
        body: JSON.stringify({
          ai_response: aiResponseText,
          status: rating > 3 ? "responded" : "flagged"
        }),
      });

      if (!updateResponse.ok) {
        console.error('Failed to update feedback in database:', updateResponse.status);
      } else {
        console.log('Database updated successfully');
      }

      // Send webhook with AI response to Make.com with retry logic
      const webhookPayload = {
        guestName: guestName || '',
        email: email || '',
        visitDate: visitDate || '',
        rating: rating || 0,
        feedback: feedback || '',
        consentToShare: consentToShare || false,
        aiResponse: aiResponseText,
        status: rating > 3 ? "responded" : "flagged",
        timestamp: new Date().toISOString(),
        formattedVisitDate: visitDate ? (() => {
          const date = new Date(visitDate);
          const month = String(date.getMonth() + 1).padStart(2, '0');
          const day = String(date.getDate()).padStart(2, '0');
          const year = String(date.getFullYear()).slice(-2);
          return `${month}/${day}/${year}`;
        })() : '',
        feedbackId: feedbackId,
        aiProcessed: true,
      };

      // Use retry mechanism for webhook
      await sendWebhookWithRetry(webhookPayload);
    }

    return new Response(JSON.stringify({ result: "success", aiResponse: aiResponseText }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("AI review edge function error:", e);
    return new Response(JSON.stringify({ error: e.message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
