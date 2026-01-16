import { MapPin, Phone, Mail, Facebook, Instagram } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface BusinessHour {
  id: number;
  day_label: string;
  open_time: string | null;
  close_time: string | null;
  is_closed: boolean;
  sort_order: number;
}

interface SpecialHour {
  id: number;
  label: string;
  description: string;
  is_active: boolean;
  sort_order: number;
}

const formatTime = (time: string | null): string => {
  if (!time) return '';
  const [hours, minutes] = time.split(':');
  const hour = parseInt(hours, 10);
  const ampm = hour >= 12 ? 'PM' : 'AM';
  const formattedHour = hour % 12 || 12;
  return minutes === '00' ? `${formattedHour}${ampm}` : `${formattedHour}:${minutes}${ampm}`;
};

const Footer = () => {
  const { data: businessHours } = useQuery({
    queryKey: ['business-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('business_hours')
        .select('*')
        .order('sort_order');
      if (error) throw error;
      return data as BusinessHour[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const { data: specialHours } = useQuery({
    queryKey: ['special-hours'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('special_hours')
        .select('*')
        .eq('is_active', true)
        .order('sort_order');
      if (error) throw error;
      return data as SpecialHour[];
    },
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

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
              Your home-field hangout, loaded with locally inspired eats.
            </p>
            
            <div className="mt-6">
              <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Contact</h3>
              <ul className="mt-4 space-y-3 text-sm text-secondary-foreground/70">
                <li className="flex items-start gap-3">
                  <MapPin className="h-4 w-4 mt-1 text-primary flex-shrink-0" />
                  <a 
                    href="https://www.google.com/maps/search/?api=1&query=2947+SE+73rd+Ave,+Hillsboro,+OR+97123" 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="hover:text-primary transition-colors"
                  >
                    2947 SE 73rd Ave, Hillsboro, OR 97123
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="tel:+15037476063" className="hover:text-primary transition-colors">
                    +1 (503) 747-6063
                  </a>
                </li>
                <li className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                  <a href="mailto:champions.sportsbar.grill@gmail.com" className="hover:text-primary transition-colors break-all">
                    champions.sportsbar.grill@gmail.com
                  </a>
                </li>
              </ul>
            </div>

            <div className="mt-6">
              <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Follow Us</h3>
              <div className="mt-4 flex gap-4">
                <a 
                  href="https://www.facebook.com/profile.php?id=100063835066138#" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-primary/80 transition-colors" 
                  aria-label="Follow us on Facebook"
                >
                  <Facebook className="h-6 w-6" />
                </a>
                <a 
                  href="https://www.instagram.com/champs_hillsboro/?hl=en" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-primary hover:text-primary/80 transition-colors" 
                  aria-label="Follow us on Instagram"
                >
                  <Instagram className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          
          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Links</h3>
            <ul className="mt-4 space-y-2">
              <li><Link to="/about" className="hover:text-primary transition-colors">About Us</Link></li>
              <li><Link to="/menu" className="hover:text-primary transition-colors">Menu</Link></li>
              <li><Link to="/happenings" className="hover:text-primary transition-colors">Happenings</Link></li>
              <li><Link to="/reservations" className="hover:text-primary transition-colors">Reservations</Link></li>
            </ul>
          </div>

          <div>
            <h3 className="font-serif text-lg font-semibold tracking-wider uppercase text-primary">Hours</h3>
            <ul className="mt-4 space-y-2 text-sm text-secondary-foreground/70">
              {businessHours?.map((hour) => (
                <li key={hour.id}>
                  <span className="font-semibold text-secondary-foreground">{hour.day_label}:</span>{' '}
                  {hour.is_closed 
                    ? 'Closed' 
                    : `${formatTime(hour.open_time)} - ${formatTime(hour.close_time)}`}
                </li>
              ))}
              {specialHours?.map((hour) => (
                <li key={hour.id} className="pt-2 text-accent">
                  <span className="font-bold">{hour.label}:</span> {hour.description}
                </li>
              ))}
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
              />
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
