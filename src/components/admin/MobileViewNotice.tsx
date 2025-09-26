import React, { useState, useEffect } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { X, Tablet } from 'lucide-react';
import { Button } from '@/components/ui/button';

const MobileViewNotice: React.FC = () => {
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const wasDismissed = localStorage.getItem('admin-mobile-notice-dismissed');
    if (wasDismissed === 'true') {
      setDismissed(true);
    }
  }, []);

  const handleDismiss = () => {
    setDismissed(true);
    localStorage.setItem('admin-mobile-notice-dismissed', 'true');
  };

  if (dismissed) return null;

  return (
    <div className="md:hidden">
      <Alert className="m-4 bg-amber-50 border-amber-200">
        <Tablet className="h-4 w-4 text-amber-600" />
        <AlertDescription className="pr-8 text-amber-900">
          For the best experience, we recommend using a tablet or desktop to access the admin dashboard.
        </AlertDescription>
        <Button
          variant="ghost"
          size="icon"
          className="absolute top-2 right-2 h-6 w-6"
          onClick={handleDismiss}
        >
          <X className="h-4 w-4" />
        </Button>
      </Alert>
    </div>
  );
};

export default MobileViewNotice;