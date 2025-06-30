// This file is deprecated - webhook functionality moved to edge function
// Keeping minimal exports for backward compatibility during transition

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

export async function sendReservationWebhook(payload: ReservationWebhookPayload): Promise<void> {
  // Deprecated: This function is no longer used
  // Webhook functionality has been moved to the edge function
  console.log('sendReservationWebhook is deprecated - functionality moved to edge function');
}

export function formatDateForWebhook(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}
