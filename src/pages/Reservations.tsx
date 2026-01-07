import React from 'react';
import { GuestFeedbackForm } from "@/components/feedback/GuestFeedbackForm";
import { BackgroundContainer } from '@/components/ui/background-container';
import { PageHeader } from '@/components/ui/page-header';
import { Phone, Clock, Users, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

const Reservations = () => {
  return (
    <BackgroundContainer
      backgroundImage="https://res.cloudinary.com/de3djsvlk/image/upload/v1753308641/A7305076_rdlcc6.jpg"
      className="py-16 md:py-24"
      grayscale={true}
    >
      <PageHeader
        title="Make a Reservation"
        description="Call us to reserve your table or book a spot for one of our special events."
      />
      
      {/* Phone Reservation Section */}
      <div className="mt-12 max-w-2xl mx-auto bg-card p-8 rounded-lg border text-center">
        <h2 className="text-2xl font-serif font-semibold mb-6">Reserve by Phone</h2>
        
        <p className="text-muted-foreground mb-6">
          For the best experience, we recommend calling ahead for:
        </p>
        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
            <Users className="h-8 w-8 text-primary mb-2" />
            <span className="font-medium">Parties of 6+</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
            <Calendar className="h-8 w-8 text-primary mb-2" />
            <span className="font-medium">Special Events</span>
          </div>
          <div className="flex flex-col items-center p-4 bg-muted rounded-lg">
            <Clock className="h-8 w-8 text-primary mb-2" />
            <span className="font-medium">Busy Nights</span>
          </div>
        </div>
        
        <Button 
          size="lg" 
          className="text-xl px-8 py-6"
          onClick={() => window.location.href = 'tel:+15037476063'}
        >
          <Phone className="mr-2 h-6 w-6" />
          (503) 747-6063
        </Button>
        
        <p className="mt-6 text-sm text-muted-foreground">
          Walk-ins are always welcome! Reservations help us prepare for your visit.
        </p>
      </div>
      
      {/* Guest Feedback Section */}
      <div className="mt-16 max-w-2xl mx-auto bg-muted p-8 rounded-lg border">
        <h2 className="text-2xl font-serif font-semibold mb-4 text-center">Guest Feedback</h2>
        <p className="mb-6 text-muted-foreground text-center">
          We value your honest feedback. Share your experience below – and our team will respond!
        </p>
        <GuestFeedbackForm />
      </div>
    </BackgroundContainer>
  );
};

export default Reservations;
