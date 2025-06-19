
interface GuestFeedbackWebhookPayload {
  guestName: string;
  email: string;
  visitDate: string;
  rating: number;
  feedback: string;
  consentToShare: boolean;
  aiResponse?: string;
  status: string;
  timestamp: string;
  formattedVisitDate: string;
  feedbackId?: string;
}

export async function sendGuestFeedbackWebhook(payload: GuestFeedbackWebhookPayload): Promise<void> {
  const webhookUrl = "https://hook.us2.make.com/ycn54k1rkfnymmiqud08vb6lvoeml1rs";
  
  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Guest feedback webhook failed with status: ${response.status}`);
    }

    console.log('Guest feedback webhook sent successfully');
  } catch (error) {
    // Log error but don't throw - webhook failure shouldn't block feedback submission
    console.error('Guest feedback webhook error (non-blocking):', error);
  }
}

export function formatDateForWebhook(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}
