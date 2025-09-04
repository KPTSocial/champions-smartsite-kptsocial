
interface WebhookPayload {
  // Core fields
  timestamp: string;
  formatted_date: string;
  first_name: string;
  last_name: string;
  email: string;
  caption_request: boolean;
  event_name?: string;
  status: string;
  source: string;
  
  // File metadata
  original_filename: string;
  mime_type: string;
  image_url: string;
  image_data_size: number;
  
  // Optional fields
  caption?: string | null;
  webhook_run_id?: string;
  
  // Advanced options
  watermarkScale?: number;
  watermarkPosition?: string;
  shareConsent: boolean;
  tags?: string[];
}

export async function sendToWebhook(payload: WebhookPayload): Promise<void> {
  const webhookUrl = "http://localhost:5678/webhook-test/champions-photobooth-upload";
  
  try {
    console.log('Sending webhook with payload:', payload);
    
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
