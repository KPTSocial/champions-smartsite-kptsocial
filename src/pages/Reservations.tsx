import React from 'react';
import ReservationForm from '@/components/ReservationForm';
import { GuestFeedbackForm } from "@/components/feedback/GuestFeedbackForm";
const Reservations = () => {
  return <div 
      className="relative min-h-screen py-16 md:py-24"
      style={{
        backgroundImage: 'url(https://res.cloudinary.com/de3djsvlk/image/upload/v1753308641/A7305076_rdlcc6.jpg)',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        filter: 'grayscale(10%)'
      }}
    >
      <div className="absolute inset-0 bg-background/40 backdrop-blur-sm" />
      <div className="container relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-6xl font-bold font-serif">Make a Reservation</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground">
            Book your table for a meal or reserve your spot for one of our special events like Bingo or Trivia.
          </p>
        </div>
        <div className="mt-12 max-w-2xl mx-auto bg-card p-8 rounded-lg border">
          <h2 className="text-2xl font-serif font-semibold mb-6 text-center">Reservation Details</h2>
          <ReservationForm />
        </div>
        <div className="mt-16 max-w-2xl mx-auto bg-muted p-8 rounded-lg border">
          <h2 className="text-2xl font-serif font-semibold mb-4 text-center">Guest Feedback</h2>
          <p className="mb-6 text-muted-foreground text-center">We value your honest feedback. Share your experience below – and our team will respond!</p>
          <GuestFeedbackForm />
        </div>
      </div>
    </div>;
};
export default Reservations;