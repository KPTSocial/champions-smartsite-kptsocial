import React from 'react';
import AdminLayout from '@/components/admin/AdminLayout';
import AdminGuide from '@/components/admin/AdminGuide';

const AdminGuidePage: React.FC = () => {
  return (
    <AdminLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Dashboard Guide</h1>
          <p className="text-gray-600 mt-1">
            Learn how to use the Champions Admin Dashboard
          </p>
        </div>
        <AdminGuide />
      </div>
    </AdminLayout>
  );
};

export default AdminGuidePage;
