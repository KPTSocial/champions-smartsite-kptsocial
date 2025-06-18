
interface WebhookPayload {
  firstName: string;
  lastName: string;
  email: string;
  caption: string | null;
  imageUrl: string;
  timestamp: string;
  formattedDate: string;
  aiCaptionRequested: boolean;
}

export async function sendToWebhook(payload: WebhookPayload): Promise<void> {
  const webhookUrl = "https://hook.us2.make.com/8l5czub5ulppyui2m5h31h2vinwogcky";
  
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

    console.log('Webhook sent successfully');
  } catch (error) {
    // Log error but don't throw - webhook failure shouldn't block form submission
    console.error('Webhook error (non-blocking):', error);
  }
}

export function formatDateToMMDDYY(date: Date): string {
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const year = String(date.getFullYear()).slice(-2);
  return `${month}/${day}/${year}`;
}
