
import { UtensilsCrossed } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="md:col-span-1">
            <Link to="/" className="flex items-center gap-2">
              <UtensilsCrossed className="h-8 w-8 text-primary" />
              <span className="font-serif text-3xl font-bold">
                Champions
              </span>
            </Link>
            <p className="mt-4 text-sm text-secondary-foreground/70">
              Vibrant sports bar with a farm-to-table soul.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-8 col-span-1 md:col-span-2">
            <div>
              <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Links</h3>
              <ul className="mt-4 space-y-2">
                <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
                <li><Link to="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
                <li><Link to="/photo-booth" className="hover:text-primary transition-colors">Photo Booth</Link></li>
                <li><a href="#" className="hover:text-primary transition-colors">Reservations</a></li>
              </ul>
            </div>
            <div>
              <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Contact</h3>
              <ul className="mt-4 space-y-2 text-secondary-foreground/70">
                <li>123 Foodie Lane, Flavor Town</li>
                <li>(555) 123-4567</li>
                <li>contact@championsgrill.com</li>
              </ul>
            </div>
          </div>
          <div className="md:col-span-1">
            <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Hours</h3>
            <ul className="mt-4 space-y-2 text-secondary-foreground/70">
                <li>Mon-Thurs: 11am - 10pm</li>
                <li>Fri-Sat: 11am - 12am</li>
                <li>Sun: 10am - 9pm (Brunch 'til 3)</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 border-t border-secondary-foreground/20 pt-8 text-center text-sm text-secondary-foreground/70">
          <p>&copy; {new Date().getFullYear()} Champions Sports Bar & Grill. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
