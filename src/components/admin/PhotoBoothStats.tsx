
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface PhotoBoothStatsProps {
  posts: any[];
}

const PhotoBoothStats: React.FC<PhotoBoothStatsProps> = ({ posts }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{posts.filter(p => p.status === 'pending').length}</div>
          <div className="text-sm text-gray-600">Pending Review</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{posts.filter(p => p.status === 'approved').length}</div>
          <div className="text-sm text-gray-600">Approved</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{posts.filter(p => p.status === 'featured').length}</div>
          <div className="text-sm text-gray-600">Featured</div>
        </CardContent>
      </Card>
      <Card>
        <CardContent className="p-4">
          <div className="text-2xl font-bold">{posts.length}</div>
          <div className="text-sm text-gray-600">Total Posts</div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PhotoBoothStats;
