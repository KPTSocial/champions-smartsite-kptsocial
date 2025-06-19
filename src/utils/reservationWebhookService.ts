
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
  timestamp: string;
  formattedDate: string;
}

export async function sendReservationWebhook(payload: ReservationWebhookPayload): Promise<void> {
  const webhookUrl = "https://hook.us2.make.com/6mcr2iemqqk0yk8fly5p5uwt4jhhefa4";
  
  console.log('🚀 Starting webhook delivery process...');
  console.log('📊 Webhook URL:', webhookUrl);
  console.log('📦 Full payload being sent:', JSON.stringify(payload, null, 2));
  
  try {
    console.log('🌐 Making fetch request to webhook...');
    
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      mode: 'no-cors', // Handle CORS issues
      body: JSON.stringify(payload),
    });

    // Note: With no-cors mode, we can't read the response status
    // but the request will be sent successfully
    console.log('✅ Webhook request sent successfully (no-cors mode)');
    console.log('📝 Note: Response status not available due to CORS policy');

  } catch (error) {
    // Log error but don't throw - webhook failure shouldn't block reservation
    console.error('❌ Reservation webhook error (non-blocking):', error);
    console.error('🔍 Error details:', {
      message: error.message,
      stack: error.stack,
      payload: payload
    });
    
    // Optional: Try a retry after a short delay
    console.log('🔄 Attempting webhook retry in 2 seconds...');
    setTimeout(async () => {
      try {
        await fetch(webhookUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          mode: 'no-cors',
          body: JSON.stringify({
            ...payload,
            retryAttempt: true,
            originalError: error.message
          }),
        });
        console.log('✅ Webhook retry sent successfully');
      } catch (retryError) {
        console.error('❌ Webhook retry also failed:', retryError);
      }
    }, 2000);
  }
}

export function formatDateForWebhook(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}
