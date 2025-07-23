import React from 'react';
import ReservationForm from '@/components/ReservationForm';
import { GuestFeedbackForm } from "@/components/feedback/GuestFeedbackForm";
import { BackgroundContainer } from '@/components/ui/background-container';
import { PageHeader } from '@/components/ui/page-header';
const Reservations = () => {
  return (
    <BackgroundContainer
      backgroundImage="https://res.cloudinary.com/de3djsvlk/image/upload/v1753308641/A7305076_rdlcc6.jpg"
      className="py-16 md:py-24"
      grayscale={true}
    >
      <PageHeader
        title="Make a Reservation"
        description="Book your table for a meal or reserve your spot for one of our special events like Bingo or Trivia."
      />
      <div className="mt-12 max-w-2xl mx-auto bg-card p-8 rounded-lg border">
        <h2 className="text-2xl font-serif font-semibold mb-6 text-center">Reservation Details</h2>
        <ReservationForm />
      </div>
      <div className="mt-16 max-w-2xl mx-auto bg-muted p-8 rounded-lg border">
        <h2 className="text-2xl font-serif font-semibold mb-4 text-center">Guest Feedback</h2>
        <p className="mb-6 text-muted-foreground text-center">We value your honest feedback. Share your experience below – and our team will respond!</p>
        <GuestFeedbackForm />
      </div>
    </BackgroundContainer>
  );
};
export default Reservations;