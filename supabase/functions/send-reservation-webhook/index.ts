
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

const LEADCONNECTOR_WEBHOOK_URL = "https://services.leadconnectorhq.com/hooks/GP50eEHJorZpETpYfOVk/webhook-trigger/af3fe41a-c3dd-4fb0-8126-d8919e42b87f";

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const payload: ReservationWebhookPayload = await req.json();
    console.log('Received reservation webhook payload:', payload);

    // Transform data for LeadConnector
    const leadConnectorPayload = {
      // Contact Information
      first_name: payload.fullName.split(' ')[0] || '',
      last_name: payload.fullName.split(' ').slice(1).join(' ') || '',
      email: payload.email,
      phone: payload.phoneNumber || '',
      
      // Reservation Details
      party_size: payload.partySize,
      reservation_type: payload.reservationType,
      reservation_date: payload.formattedDate,
      reservation_time: payload.reservationTime,
      reservation_datetime: payload.reservationDate,
      
      // Additional Information
      notes: payload.notes || '',
      special_event_reason: payload.specialEventReason || '',
      requires_confirmation: payload.requiresConfirmation || false,
      
      // Business Context
      business_name: "Champions Sports Bar",
      source: "Website Reservation Form",
      timestamp: payload.timestamp,
      
      // Event Information (if applicable)
      event_type: payload.eventType || '',
      event_id: payload.eventId || '',
    };

    console.log('Sending to LeadConnector:', leadConnectorPayload);

    // Send to LeadConnector with retry logic
    let attempts = 0;
    const maxAttempts = 3;
    
    while (attempts < maxAttempts) {
      try {
        const response = await fetch(LEADCONNECTOR_WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(leadConnectorPayload),
        });

        if (response.ok) {
          console.log('Successfully sent reservation to LeadConnector');
          return new Response(
            JSON.stringify({ success: true, message: 'Webhook sent successfully' }),
            {
              status: 200,
              headers: { 'Content-Type': 'application/json', ...corsHeaders },
            }
          );
        } else {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
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
