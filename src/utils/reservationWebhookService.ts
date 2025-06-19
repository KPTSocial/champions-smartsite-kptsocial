
interface ReservationWebhookPayload {
  fullName: string;
  email: string;
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
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Webhook failed with status: ${response.status}`);
    }

    console.log('Reservation webhook sent successfully');
  } catch (error) {
    // Log error but don't throw - webhook failure shouldn't block reservation
    console.error('Reservation webhook error (non-blocking):', error);
  }
}

export function formatDateForWebhook(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}
