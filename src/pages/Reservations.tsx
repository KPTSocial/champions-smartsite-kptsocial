
import React from 'react';
import ReservationForm from '@/components/ReservationForm';

const Reservations = () => {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container">
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
      </div>
    </div>
  );
};

export default Reservations;
