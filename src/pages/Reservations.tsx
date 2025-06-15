
import React from 'react';
import ReservationForm from '@/components/ReservationForm';

const Reservations = () => {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container">
        <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold font-serif">Make a Reservation</h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Book your table for a meal. For event-specific reservations like Bingo or Trivia, please find the event on our <a href="/happenings" className="text-primary underline hover:text-primary/80">Happenings page</a>.
            </p>
            <p className="mt-4 text-md text-muted-foreground">
              Please note: We accept reservations for parties of 6 or more. For smaller groups, we operate on a first-come, first-served basis and welcome you to walk in.
            </p>
        </div>
        <div className="mt-12 max-w-2xl mx-auto bg-card p-8 rounded-lg border">
            <h2 className="text-2xl font-serif font-semibold mb-6 text-center">Book a Table (Parties of 6+)</h2>
            <ReservationForm />
        </div>
      </div>
    </div>
  );
};

export default Reservations;
