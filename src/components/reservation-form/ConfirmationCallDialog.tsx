
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
  const restaurantPhone = "(503) 747-6063";
  
  const getConfirmationReason = () => {
    if ((reservationType === 'trivia' || reservationType === 'bingo') && partySize >= 5) {
      const eventName = reservationType === 'trivia' ? 'Trivia Night' : 'Bingo Night';
      return `${eventName} parties of ${partySize} people`;
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
        <AlertDialogFooter className="flex-col space-y-2 items-stretch">
          <AlertDialogAction 
            onClick={handleCallClick}
            className="w-full h-11 bg-green-600 hover:bg-green-700 flex items-center justify-center gap-2"
          >
            <Phone size={18} />
            Call {restaurantPhone}
          </AlertDialogAction>
          <AlertDialogAction 
            onClick={() => onOpenChange(false)}
            className="w-full h-11 border border-input bg-accent text-accent-foreground hover:bg-accent/90 flex items-center justify-center"
          >
            I'll Call Later
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};
