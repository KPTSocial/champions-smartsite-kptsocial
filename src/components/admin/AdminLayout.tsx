
import React, { useState } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Calendar, Menu as MenuIcon, Settings, MessageSquare, HelpCircle } from 'lucide-react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet';
import MobileViewNotice from './MobileViewNotice';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, loading, signOut, adminUser } = useAdminAuth();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!isAdmin) {
    return <Navigate to="/admin/login" replace />;
  }

  const handleSignOut = async () => {
    await signOut();
  };

  const isActiveRoute = (path: string) => location.pathname === path;

  const navigationItems = [
    { href: '/admin/menu', icon: MenuIcon, label: 'Menu' },
    { href: '/admin/events', icon: Calendar, label: 'Events' },
    { href: '/admin/feedback', icon: MessageSquare, label: 'Feedback' },
    { href: '/admin/settings', icon: Settings, label: 'Settings' },
    { href: '/admin/guide', icon: HelpCircle, label: 'Guide' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Mobile View Notice */}
      <MobileViewNotice />

      {/* Header */}
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Mobile Menu Button & Title */}
            <div className="flex items-center gap-3">
              <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
                <SheetTrigger asChild className="md:hidden">
                  <Button variant="ghost" size="icon">
                    <MenuIcon className="h-5 w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-64">
                  <SheetHeader>
                    <SheetTitle>Admin Menu</SheetTitle>
                  </SheetHeader>
                  <nav className="mt-6 space-y-2">
                    {navigationItems.map((item) => {
                      const Icon = item.icon;
                      return (
                        <a
                          key={item.href}
                          href={item.href}
                          onClick={() => setMobileMenuOpen(false)}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg transition-colors ${
                            isActiveRoute(item.href)
                              ? 'bg-primary/10 text-primary font-medium'
                              : 'text-gray-600 hover:bg-gray-100'
                          }`}
                        >
                          <Icon className="h-5 w-5" />
                          <span>{item.label}</span>
                        </a>
                      );
                    })}
                  </nav>
                  <div className="absolute bottom-4 left-4 right-4 space-y-3">
                    <div className="text-sm text-gray-600 border-t pt-3">
                      {adminUser?.email}
                      <br />
                      <span className="text-xs">({adminUser?.role})</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleSignOut}
                      className="w-full"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </SheetContent>
              </Sheet>

              <h1 className="text-lg md:text-xl font-semibold text-gray-900">
                <span className="hidden sm:inline">Champions Admin Dashboard</span>
                <span className="sm:hidden">Admin</span>
              </h1>
            </div>

            {/* Desktop User Info */}
            <div className="hidden md:flex items-center space-x-4">
              <span className="text-sm text-gray-600">
                {adminUser?.email} ({adminUser?.role})
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleSignOut}
                className="flex items-center space-x-2"
              >
                <LogOut className="h-4 w-4" />
                <span>Sign Out</span>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Desktop Navigation */}
      <nav className="hidden md:block bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              return (
                <a
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-2 px-3 py-4 text-sm font-medium ${
                    isActiveRoute(item.href)
                      ? 'text-gray-900 border-b-2 border-blue-500'
                      : 'text-gray-500 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};

export default AdminLayout;
