
import QRCode from 'qrcode';

export interface QRCodeOptions {
  eventId?: string;
  location?: string;
  campaign?: string;
}

export const generateMobileUploadUrl = (options: QRCodeOptions = {}) => {
  const baseUrl = window.location.origin;
  const url = new URL('/mobile-upload', baseUrl);
  
  if (options.eventId) url.searchParams.set('event', options.eventId);
  if (options.location) url.searchParams.set('location', options.location);
  if (options.campaign) url.searchParams.set('campaign', options.campaign);
  
  return url.toString();
};

export const generateQRCode = async (options: QRCodeOptions = {}) => {
  const url = generateMobileUploadUrl(options);
  
  try {
    const qrCodeDataUrl = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#1a1a1a',
        light: '#ffffff'
      }
    });
    
    return {
      url,
      qrCodeDataUrl,
      success: true
    };
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return {
      url,
      qrCodeDataUrl: null,
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error'
    };
  }
};

export const downloadQRCode = (dataUrl: string, filename: string = 'champions-photo-qr.png') => {
  const link = document.createElement('a');
  link.href = dataUrl;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
