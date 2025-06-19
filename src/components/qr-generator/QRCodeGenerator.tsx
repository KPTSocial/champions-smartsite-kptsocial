
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FormLabel } from '@/components/ui/form';
import { Download, QrCode, Copy, CheckCircle } from 'lucide-react';
import { generateQRCode, downloadQRCode, type QRCodeOptions } from '@/utils/qrCodeGenerator';
import { useToast } from '@/hooks/use-toast';

const QRCodeGenerator: React.FC = () => {
  const { toast } = useToast();
  const [options, setOptions] = useState<QRCodeOptions>({
    eventId: '',
    location: '',
    campaign: ''
  });
  const [qrResult, setQrResult] = useState<{ url: string; qrCodeDataUrl: string | null } | null>(null);
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    const result = await generateQRCode(options);
    setQrResult(result);
    setIsGenerating(false);

    if (result.success) {
      toast({
        title: 'QR Code Generated!',
        description: 'Your mobile upload QR code is ready to use.',
      });
    } else {
      toast({
        title: 'Generation Failed',
        description: result.error || 'Failed to generate QR code.',
        variant: 'destructive',
      });
    }
  };

  const handleDownload = () => {
    if (qrResult?.qrCodeDataUrl) {
      const filename = `champions-upload-${options.eventId || 'general'}.png`;
      downloadQRCode(qrResult.qrCodeDataUrl, filename);
      toast({
        title: 'Downloaded!',
        description: 'QR code saved to your device.',
      });
    }
  };

  const handleCopyUrl = async () => {
    if (qrResult?.url) {
      try {
        await navigator.clipboard.writeText(qrResult.url);
        toast({
          title: 'Copied!',
          description: 'Upload URL copied to clipboard.',
        });
      } catch (error) {
        toast({
          title: 'Copy Failed',
          description: 'Failed to copy URL to clipboard.',
          variant: 'destructive',
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <QrCode className="mr-2 h-5 w-5" />
            QR Code Generator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <FormLabel htmlFor="eventId">Event ID (Optional)</FormLabel>
              <Input
                id="eventId"
                placeholder="e.g., nye2024"
                value={options.eventId}
                onChange={(e) => setOptions({ ...options, eventId: e.target.value })}
              />
            </div>
            <div>
              <FormLabel htmlFor="location">Location (Optional)</FormLabel>
              <Input
                id="location"
                placeholder="e.g., main-bar"
                value={options.location}
                onChange={(e) => setOptions({ ...options, location: e.target.value })}
              />
            </div>
            <div>
              <FormLabel htmlFor="campaign">Campaign (Optional)</FormLabel>
              <Input
                id="campaign"
                placeholder="e.g., holiday-promo"
                value={options.campaign}
                onChange={(e) => setOptions({ ...options, campaign: e.target.value })}
              />
            </div>
          </div>
          
          <Button 
            onClick={handleGenerate} 
            disabled={isGenerating}
            className="w-full"
          >
            {isGenerating ? 'Generating...' : 'Generate QR Code'}
          </Button>
        </CardContent>
      </Card>

      {qrResult && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center text-green-700">
              <CheckCircle className="mr-2 h-5 w-5" />
              Your QR Code
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center">
              {qrResult.qrCodeDataUrl && (
                <img 
                  src={qrResult.qrCodeDataUrl} 
                  alt="Mobile Upload QR Code"
                  className="mx-auto border rounded-lg shadow-sm"
                />
              )}
            </div>
            
            <div className="bg-gray-50 p-3 rounded-lg">
              <p className="text-sm text-gray-600 mb-2">Upload URL:</p>
              <p className="text-xs font-mono bg-white p-2 rounded border break-all">
                {qrResult.url}
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button 
                onClick={handleDownload}
                disabled={!qrResult.qrCodeDataUrl}
                className="flex-1"
              >
                <Download className="mr-2 h-4 w-4" />
                Download
              </Button>
              <Button 
                onClick={handleCopyUrl}
                variant="outline"
                className="flex-1"
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy URL
              </Button>
            </div>
            
            <div className="text-xs text-gray-500 space-y-1">
              <p>• Print this QR code and place it where guests can easily scan it</p>
              <p>• The QR code links directly to the mobile upload page</p>
              <p>• Guests can scan with any QR reader or camera app</p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default QRCodeGenerator;
