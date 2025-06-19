
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

async function sendWebhookWithRetry(
  webhookUrl: string, 
  payload: GuestFeedbackWebhookPayload, 
  maxRetries = 3
): Promise<void> {
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: isMobile ? 'no-cors' : 'cors',
        body: JSON.stringify(payload),
      });

      // Assume success if no error is thrown (especially for no-cors mode)
      return;
    } catch (error) {
      if (attempt < maxRetries) {
        // Simple exponential backoff without logging
        const delay = Math.pow(2, attempt) * 1000 + Math.random() * 1000;
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Final mobile fallback attempt (silent)
  if (isMobile) {
    try {
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify(payload),
      });
    } catch {
      // Silent failure
    }
  }
}

export async function sendGuestFeedbackWebhook(payload: GuestFeedbackWebhookPayload): Promise<void> {
  const webhookUrl = "https://hook.us2.make.com/ycn54k1rkfnymmiqud08vb6lvoeml1rs";
  await sendWebhookWithRetry(webhookUrl, payload);
}

export function formatDateForWebhook(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}
