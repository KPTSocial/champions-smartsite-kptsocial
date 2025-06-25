
import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import PhotoBoothDashboard from '@/components/admin/PhotoBoothDashboard';

const AdminPhotoBoothPage: React.FC = () => {
  return (
    <AdminLayout>
      <PhotoBoothDashboard />
    </AdminLayout>
  );
};

export default AdminPhotoBoothPage;
