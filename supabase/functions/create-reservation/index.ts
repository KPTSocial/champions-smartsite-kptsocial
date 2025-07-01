import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.50.0";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ReservationRequest {
  full_name: string;
  email: string;
  phone_number?: string;
  party_size: number;
  reservation_date: string;
  notes?: string;
  reservation_type: 'Event' | 'Table';
  event_id?: string;
  requires_confirmation?: boolean;
  formData?: any;
  specialEventReason?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    // Initialize Supabase client with service role key for elevated permissions
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    const requestData: ReservationRequest = await req.json();
    console.log('Received reservation request:', requestData);

    // Insert reservation with service role permissions (bypasses RLS)
    const { data: reservation, error: insertError } = await supabase
      .from('reservations')
      .insert({
        full_name: requestData.full_name,
        email: requestData.email,
        phone_number: requestData.phone_number || null,
        party_size: requestData.party_size,
        reservation_date: requestData.reservation_date,
        notes: requestData.notes || null,
        reservation_type: requestData.reservation_type,
        event_id: requestData.event_id || null,
        requires_confirmation: requestData.requires_confirmation || false,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Database insert error:', insertError);
      throw new Error(`Failed to create reservation: ${insertError.message}`);
    }

    console.log('Reservation created successfully:', reservation);

    // Send webhook to Make.com
    const MAKE_WEBHOOK_URL = "https://hook.us2.make.com/6mcr2iemqqk0yk8fly5p5uwt4jhhefa4";
    
    // Determine proper event type based on reservation details
    let eventType = 'Table';
    let reservationType = 'table';
    
    if (requestData.formData?.reservationType) {
      reservationType = requestData.formData.reservationType;
      if (reservationType === 'bingo') {
        eventType = 'Bingo';
      } else if (reservationType === 'trivia') {
        eventType = 'Trivia';
      } else if (reservationType === 'special-event') {
        eventType = 'Special Event';
      }
    }

    // Format date for webhook
    const formatDateForWebhook = (date: Date): string => {
      const month = String(date.getMonth() + 1).padStart(2, '0');
      const day = String(date.getDate()).padStart(2, '0');
      const year = String(date.getFullYear()).slice(-2);
      return `${month}/${day}/${year}`;
    };

    // Prepare webhook payload
    const webhookPayload = {
      // Contact Information
      fullName: reservation.full_name,
      firstName: reservation.full_name.split(' ')[0] || '',
      lastName: reservation.full_name.split(' ').slice(1).join(' ') || '',
      email: reservation.email,
      phoneNumber: reservation.phone_number || '',
      
      // Reservation Details
      partySize: reservation.party_size,
      reservationType: reservationType,
      reservationDate: formatDateForWebhook(new Date(reservation.reservation_date)),
      reservationTime: new Date(reservation.reservation_date).toLocaleTimeString('en-US', { hour12: false, hour: '2-digit', minute: '2-digit' }),
      reservationDateTime: reservation.reservation_date,
      
      // Additional Information
      notes: reservation.notes || '',
      specialEventReason: requestData.specialEventReason || '',
      requiresConfirmation: reservation.requires_confirmation || false,
      
      // System Information
      timestamp: new Date().toISOString(),
      eventId: reservation.event_id || '',
      eventType: eventType,
      
      // Source tracking
      source: "Website Reservation Form",
      businessName: "Champions Sports Bar"
    };

    console.log('Sending webhook payload:', webhookPayload);

    // Send to Make webhook
    try {
      const webhookResponse = await fetch(MAKE_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(webhookPayload),
      });

      if (webhookResponse.ok) {
        console.log('Webhook sent successfully');
      } else {
        console.error('Webhook failed with status:', webhookResponse.status);
      }
    } catch (webhookError) {
      console.error('Webhook error (non-blocking):', webhookError);
      // Don't throw - webhook failure shouldn't break reservation
    }

    return new Response(
      JSON.stringify({ 
        success: true, 
        reservation: reservation,
        message: 'Reservation created successfully'
      }),
      {
        status: 200,
        headers: { 'Content-Type': 'application/json', ...corsHeaders },
      }
    );

  } catch (error) {
    console.error('Error in create-reservation function:', error);
    return new Response(
      JSON.stringify({ 
        error: 'Failed to create reservation', 
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