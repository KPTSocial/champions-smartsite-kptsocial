
import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { WifiOff } from 'lucide-react';
import { useNetworkStatus } from '@/hooks/useNetworkStatus';

const NetworkStatus: React.FC = () => {
  const { isOnline } = useNetworkStatus();

  if (isOnline) return null;

  return (
    <Alert variant="destructive" className="fixed top-4 left-4 right-4 z-50 md:left-auto md:right-4 md:w-80">
      <WifiOff className="h-4 w-4" />
      <AlertDescription>
        You're offline. Photos will be uploaded when you reconnect.
      </AlertDescription>
    </Alert>
  );
};

export default NetworkStatus;
