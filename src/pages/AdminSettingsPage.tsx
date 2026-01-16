import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import SettingsDashboard from '@/components/admin/SettingsDashboard';

const AdminSettingsPage: React.FC = () => {
  return (
    <AdminLayout>
      <SettingsDashboard />
    </AdminLayout>
  );
};

export default AdminSettingsPage;
