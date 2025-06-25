
import React, { useState } from 'react';
import { usePhotoBoothPosts } from '@/hooks/usePhotoBoothPosts';
import PhotoBoothFilters from './PhotoBoothFilters';
import PhotoBoothStats from './PhotoBoothStats';
import PhotoBoothPostCard from './PhotoBoothPostCard';

const PhotoBoothDashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
  });
  
  const { posts, loading, updatePostStatus, updatePostTags, deletePost } = usePhotoBoothPosts(filters);

  const filteredPosts = posts.filter(post => 
    !filters.searchTerm || 
    post.caption.toLowerCase().includes(filters.searchTerm.toLowerCase()) ||
    post.uploaded_by.toLowerCase().includes(filters.searchTerm.toLowerCase())
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Photo Booth Management</h1>
        <p className="text-gray-600">Manage and moderate photo booth submissions</p>
      </div>

      {/* Filters */}
      <PhotoBoothFilters filters={filters} onFiltersChange={setFilters} />

      {/* Stats */}
      <PhotoBoothStats posts={posts} />

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPosts.map((post) => (
          <PhotoBoothPostCard
            key={post.id}
            post={post}
            onStatusUpdate={updatePostStatus}
            onTagUpdate={updatePostTags}
            onDelete={deletePost}
          />
        ))}
      </div>

      {filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-500">No photo booth posts found.</div>
        </div>
      )}
    </div>
  );
};

export default PhotoBoothDashboard;
