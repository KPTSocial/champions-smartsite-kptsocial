
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import MenuDashboard from '@/components/admin/MenuDashboard';

const AdminMenuPage: React.FC = () => {
  return (
    <AdminLayout>
      <MenuDashboard />
    </AdminLayout>
  );
};

export default AdminMenuPage;
