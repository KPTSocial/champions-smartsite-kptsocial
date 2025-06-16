import { Link, NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from 'react';

const navItems = [
  { name: 'Home', path: '/' },
  { name: 'About Us', path: '/about' },
  { name: 'Happenings', path: '/happenings' },
  { name: 'Photo Booth', path: '/photo-booth' },
  { name: 'Menu', path: '/menu' },
  { name: 'Member Login', path: '/member-dashboard' },
];

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img 
            src="/lovable-uploads/67358992-a1b5-4f0a-86fb-29a46730c102.png" 
            alt="Champions Sports Bar & Grill Logo" 
            className="h-12 w-auto object-contain"
          />
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map((item) => (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `text-lg font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
        <div className="hidden lg:flex">
          <Button asChild>
            <Link to="/reservations">Reservations</Link>
          </Button>
        </div>
        
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon">
                <MenuIcon className="h-6 w-6" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right">
              <nav className="grid gap-6 text-lg font-medium mt-12">
                {navItems.map((item) => (
                  <NavLink
                    key={item.name}
                    to={item.path}
                    onClick={() => setIsOpen(false)}
                     className={({ isActive }) =>
                      `transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`
                    }
                  >
                    {item.name}
                  </NavLink>
                ))}
                 <Button asChild className="mt-4">
                    <Link to="/reservations">Reservations</Link>
                 </Button>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;
