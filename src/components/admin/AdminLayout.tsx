
import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAdminAuth } from '@/hooks/useAdminAuth';
import { Button } from '@/components/ui/button';
import { LogOut, Camera, Calendar, Menu as MenuIcon, Users } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children }) => {
  const { isAdmin, loading, signOut, adminUser } = useAdminAuth();

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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-semibold text-gray-900">
                Champions Admin Dashboard
              </h1>
            </div>
            <div className="flex items-center space-x-4">
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

      {/* Navigation */}
      <nav className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <a
              href="/admin/photo-booth"
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-gray-900 border-b-2 border-blue-500"
            >
              <Camera className="h-4 w-4" />
              <span>Photo Booth</span>
            </a>
            <a
              href="/admin/events"
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              <Calendar className="h-4 w-4" />
              <span>Events</span>
            </a>
            <a
              href="/admin/menu"
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              <MenuIcon className="h-4 w-4" />
              <span>Menu</span>
            </a>
            <a
              href="/admin/members"
              className="flex items-center space-x-2 px-3 py-4 text-sm font-medium text-gray-500 hover:text-gray-900"
            >
              <Users className="h-4 w-4" />
              <span>Members</span>
            </a>
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
