
import { serve } from "https://deno.land/std@0.190.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReservationWebhookPayload {
  fullName: string;
  email: string;
  phoneNumber?: string;
  partySize: number;
  reservationType: string;
  reservationDate: string;
  reservationTime: string;
  notes: string | null;
  specialEventReason?: string;
  eventId: string | null;
  eventType?: string;
  requiresConfirmation?: boolean;
  timestamp: string;
  formattedDate: string;
}

const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/6mcr2iemqqk0yk8fly5p5uwt4jhhefa4";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: ReservationWebhookPayload = await req.json();
    console.log('Received reservation webhook payload:', payload);

    // Prepare clean payload for Make
    const makePayload = {
      // Contact Information
      fullName: payload.fullName,
      firstName: payload.fullName.split(' ')[0] || '',
      lastName: payload.fullName.split(' ').slice(1).join(' ') || '',
      email: payload.email,
      phoneNumber: payload.phoneNumber || '',
      
      // Reservation Details
      partySize: payload.partySize,
      reservationType: payload.reservationType,
      reservationDate: payload.formattedDate,
      reservationTime: payload.reservationTime,
      reservationDateTime: payload.reservationDate,
      
      // Additional Information
      notes: payload.notes || '',
      specialEventReason: payload.specialEventReason || '',
      requiresConfirmation: payload.requiresConfirmation || false,
      
      // System Information
      timestamp: payload.timestamp,
      eventId: payload.eventId || '',
      eventType: payload.eventType || '',
      
      // Source tracking
      source: "Website Reservation Form",
      businessName: "Champions Sports Bar"
    };

    console.log('Sending to Make webhook:', makePayload);

    // Send to Make webhook with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(MAKE_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(makePayload),
        });

        if (response.ok) {
          console.log('Successfully sent reservation to Make webhook');
          return new Response(
            JSON.stringify({ success: true, message: 'Webhook sent successfully' }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        } else {
          const responseText = await response.text();
          throw new Error(`HTTP ${response.status}: ${response.statusText} - ${responseText}`);
        }
      } catch (error) {
        attempts++;
        console.error(`Attempt ${attempts} failed:`, error);
        
        if (attempts >= maxAttempts) {
          throw error;
        }
        
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, attempts) * 1000));
      }
    }

  } catch (error) {
    console.error('Error in send-reservation-webhook function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to send webhook', 
        details: error.message 
      }),
      {
        status: 500,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );
  }
};

serve(handler);
