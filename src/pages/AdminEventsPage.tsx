import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import EventsDashboard from '@/components/admin/EventsDashboard';

const AdminEventsPage: React.FC = () => {
  return (
    <AdminLayout>
      <EventsDashboard />
    </AdminLayout>
  );
};

export default AdminEventsPage;