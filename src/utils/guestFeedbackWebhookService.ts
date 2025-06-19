
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
  let lastError: Error | null = null;
  
  // Detect if this is a mobile device
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  console.log('Sending webhook from:', isMobile ? 'Mobile device' : 'Desktop device');
  
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      console.log(`Guest feedback webhook attempt ${attempt}/${maxRetries}:`, {
        guestName: payload.guestName,
        rating: payload.rating,
        status: payload.status,
        isMobile,
        timestamp: payload.timestamp
      });

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: isMobile ? 'no-cors' : 'cors', // Use no-cors for mobile to avoid CORS issues
        body: JSON.stringify(payload),
      });

      // For no-cors mode, we can't check response.ok, so assume success if no error thrown
      if (isMobile || response.ok) {
        console.log(`Guest feedback webhook sent successfully on attempt ${attempt}`);
        return;
      } else {
        throw new Error(`Guest feedback webhook failed with status: ${response.status}`);
      }
    } catch (error) {
      lastError = error as Error;
      console.error(`Guest feedback webhook attempt ${attempt} failed:`, error);
      
      if (attempt < maxRetries) {
        // Exponential backoff with jitter for mobile networks
        const baseDelay = Math.pow(2, attempt) * 1000; // 2s, 4s, 8s
        const jitter = Math.random() * 1000; // Add up to 1s random delay
        const delay = baseDelay + jitter;
        
        console.log(`Retrying guest feedback webhook in ${Math.round(delay)}ms...`);
        await new Promise(resolve => setTimeout(resolve, delay));
      }
    }
  }
  
  // Log error but don't throw - webhook failure shouldn't block feedback submission
  console.error('All guest feedback webhook attempts failed. Last error:', lastError);
  
  // For mobile devices, try one final attempt with different settings
  if (isMobile) {
    try {
      console.log('Final mobile fallback attempt...');
      await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        mode: 'no-cors',
        cache: 'no-cache',
        body: JSON.stringify(payload),
      });
      console.log('Mobile fallback webhook attempt completed');
    } catch (fallbackError) {
      console.error('Mobile fallback webhook also failed:', fallbackError);
    }
  }
}

export async function sendGuestFeedbackWebhook(payload: GuestFeedbackWebhookPayload): Promise<void> {
  const webhookUrl = "https://hook.us2.make.com/ycn54k1rkfnymmiqud08vb6lvoeml1rs";
  
  // Add mobile-specific logging
  const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  console.log('Guest feedback submission:', {
    device: isMobile ? 'mobile' : 'desktop',
    userAgent: navigator.userAgent,
    online: navigator.onLine,
    payload: {
      guestName: payload.guestName,
      rating: payload.rating,
      status: payload.status
    }
  });
  
  await sendWebhookWithRetry(webhookUrl, payload);
}

export function formatDateForWebhook(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}
