import { Link, NavLink } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Menu as MenuIcon } from 'lucide-react';
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from 'react';
const navItems = [{
  name: 'Home',
  path: '/'
}, {
  name: 'About Us',
  path: '/about'
}, {
  name: 'Happenings',
  path: '/happenings'
}, {
  name: 'Menu',
  path: '/menu'
}, {
  name: 'Photo Booth',
  path: '/photo-booth'
}];
const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  return <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container h-20 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img alt="Champions Sports Bar & Grill Logo" src="https://res.cloudinary.com/de3djsvlk/image/upload/v1752102164/Champions_logo_charcoal_b4caoh.png" className="h-12 lg:h-16 w-auto object-scale-down" />
        </Link>
        
        <nav className="hidden lg:flex items-center gap-6">
          {navItems.map(item => <NavLink key={item.name} to={item.path} className={({
          isActive
        }) => `text-lg font-medium transition-colors hover:text-primary ${isActive ? 'text-primary' : 'text-muted-foreground'}`}>
              {item.name}
            </NavLink>)}
        </nav>
        
        {/* Mobile Menu Button */}
        <div className="lg:hidden">
          <Sheet open={isOpen} onOpenChange={setIsOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="h-10 w-10">
                <MenuIcon className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80 px-0">
              <div className="px-6 py-6">
                <div className="flex items-center mb-8">
                  <img src="/lovable-uploads/cf92096a-fadb-4815-a25a-bc8d845a92c1.png" alt="Champions Logo" className="h-8 w-auto object-contain mr-3" />
                  <span className="font-serif text-xl font-bold">Champions</span>
                </div>
                
                <nav className="space-y-1">
                  {navItems.map(item => <NavLink key={item.name} to={item.path} onClick={() => setIsOpen(false)} className={({
                  isActive
                }) => `block px-4 py-3 text-base font-medium rounded-lg transition-colors hover:bg-accent hover:text-accent-foreground ${isActive ? 'bg-primary/10 text-primary border border-primary/20' : 'text-foreground hover:text-primary'}`}>
                      {item.name}
                    </NavLink>)}
                </nav>
                
              </div>
          </SheetContent>
        </Sheet>
        </div>
      </div>
    </header>;
};
export default Header;