
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Download, X } from 'lucide-react';
import { usePWA } from '@/hooks/usePWA';

interface InstallPromptProps {
  onDismiss: () => void;
}

const InstallPrompt: React.FC<InstallPromptProps> = ({ onDismiss }) => {
  const { installApp } = usePWA();

  const handleInstall = () => {
    installApp();
    onDismiss();
  };

  return (
    <Card className="fixed bottom-4 left-4 right-4 z-50 border-primary bg-background shadow-lg md:left-auto md:right-4 md:w-80">
      <CardContent className="p-4">
        <div className="flex items-start justify-between space-x-3">
          <div className="flex-1">
            <h3 className="font-semibold text-sm">Install Champions Photo Booth</h3>
            <p className="text-xs text-muted-foreground mt-1">
              Add to your home screen for quick access and offline use
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDismiss}
            className="h-8 w-8 p-0"
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex space-x-2 mt-3">
          <Button onClick={handleInstall} size="sm" className="flex-1">
            <Download className="h-4 w-4 mr-1" />
            Install
          </Button>
          <Button onClick={onDismiss} variant="outline" size="sm">
            Not now
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default InstallPrompt;
