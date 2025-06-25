
import { UtensilsCrossed, MapPin, Phone, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-secondary text-secondary-foreground">
      <div className="container py-12 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 xl:gap-12">
          
          <div>
            <Link to="/" className="flex items-center gap-2">
              <img 
                src="/lovable-uploads/3945cf0e-e4bd-4a9f-b682-9710e263952f.png" 
                alt="Champions Sports Bar & Grill Logo" 
                className="h-16 w-16 object-contain"
              />
              <span className="font-serif text-3xl font-bold">
                Champions
              </span>
            </Link>
            <p className="mt-4 text-sm text-secondary-foreground/70">
              Vibrant sports bar with a farm-to-table soul.
            </p>
            
            <div className="mt-6">
              <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Contact</h3>
              <ul className="mt-4 space-y-3 text-sm text-secondary-foreground/70">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <a href="https://www.google.com/maps/search/?api=1&query=2947+SE+73rd+Ave,+Hillsboro,+OR+97123" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
                    2947 SE 73rd Ave, Hillsboro, OR 97123
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="tel:+15037476063" className="hover:text-primary transition-colors">+1 (503) 747-6063</a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="mailto:champions.sportsbar.grill@gmail.com" className="hover:text-primary transition-colors break-all">champions.sportsbar.grill@gmail.com</a>
                </li>
              </ul>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
              <li><Link to="/happenings" className="hover:text-primary transition-colors">Happenings</Link></li>
              <li><Link to="/photo-booth" className="hover:text-primary transition-colors">Photo Booth</Link></li>
              <li><Link to="/member-dashboard" className="hover:text-primary transition-colors">Member Area</Link></li>
              <li><Link to="/reservations" className="hover:text-primary transition-colors">Reservations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Hours</h3>
            <ul className="mt-4 space-y-2 text-sm text-secondary-foreground/70">
                <li><span className="font-semibold text-secondary-foreground">Sun - Tue:</span> 11AM - 10PM</li>
                <li><span className="font-semibold text-secondary-foreground">Wed - Thu:</span> 11AM - 11PM</li>
                <li><span className="font-semibold text-secondary-foreground">Fri:</span> 11AM - 12AM</li>
                <li><span className="font-semibold text-secondary-foreground">Sat:</span> 11AM - 11PM</li>
                <li className="pt-2 text-accent"><span className="font-bold">Brunch:</span> Daily 11AM - 2PM</li>
                <li className="text-accent"><span className="font-bold">Happy Hour:</span> Daily 2:30PM - 5:30PM</li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Location</h3>
            <div className="mt-4 rounded-md overflow-hidden shadow-lg h-64 bg-secondary-foreground/10">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2795.6823432717!2d-122.9064566236949!3d45.51352892978016!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x54950fa5f8c858e7%3A0x1d1e67e3a3a4b6c!2s2947%20SE%2073rd%20Ave%2C%20Hillsboro%2C%20OR%2097123!5e0!3m2!1sen!2sus!4v1718486980121!5m2!1sen!2sus"
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen={false}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Google Map of Champions Sports Bar & Grill location"
              ></iframe>
            </div>
          </div>

        </div>
        <div className="mt-12 border-t border-secondary-foreground/20 pt-8 text-center text-sm text-secondary-foreground/70">
          <p>&copy; {new Date().getFullYear()} Champions Sports Bar & Grill. All Rights Reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
