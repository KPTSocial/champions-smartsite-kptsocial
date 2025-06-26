
import React from 'react';
import { AlertDialog, AlertDialogAction, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Phone } from 'lucide-react';

interface ConfirmationCallDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  partySize: number;
  reservationType: string;
}

export const ConfirmationCallDialog = ({ open, onOpenChange, partySize, reservationType }: ConfirmationCallDialogProps) => {
  const restaurantPhone = "(555) 123-4567"; // Replace with actual restaurant phone number
  
  const getConfirmationReason = () => {
    if (reservationType === 'table' && partySize > 15) {
      return `parties of ${partySize} people`;
    }
    if (reservationType === 'trivia' && partySize >= 6) {
      return `Trivia Night parties of ${partySize} people`;
    }
    return `large parties`;
  };

  const handleCallClick = () => {
    window.location.href = `tel:${restaurantPhone.replace(/[^\d]/g, '')}`;
  };

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="max-w-md">
        <AlertDialogHeader>
          <AlertDialogTitle className="text-center">Confirmation Required</AlertDialogTitle>
          <AlertDialogDescription className="text-center">
            Your reservation has been submitted! However, {getConfirmationReason()} require confirmation from our team.
            <br /><br />
            Please call us to confirm your reservation:
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter className="flex-col space-y-2">
          <AlertDialogAction 
            onClick={handleCallClick}
            className="w-full bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            Call {restaurantPhone}
          </AlertDialogAction>
          <AlertDialogAction 
            onClick={() => onOpenChange(false)}
            className="w-full border border-input bg-background hover:bg-accent hover:text-accent-foreground"
          >
            I'll Call Later
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
