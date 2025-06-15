
import React from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const Menu = () => {
  return (
    <div className="container py-16 md:py-24 text-center">
      <h1 className="text-5xl font-bold text-center mb-4">Our Menu</h1>
      <p className="text-center text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
        Farm-fresh ingredients, bold flavors. Our full menu is being crafted with care. Check back soon!
      </p>
      <div className="text-center">
        <img src="https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop" alt="Menu placeholder" className="mx-auto w-full max-w-4xl rounded-lg shadow-lg" />
        <p className="mt-4 text-sm text-muted-foreground">Photo of one of our signature dishes.</p>
        <Button asChild className="mt-8">
            <Link to="/">Back to Home</Link>
        </Button>
      </div>
    </div>
  );
};

export default Menu;
