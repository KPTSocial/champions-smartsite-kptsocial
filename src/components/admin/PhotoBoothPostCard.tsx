
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Check, X, Calendar } from 'lucide-react';
import PhotoBoothPostDialog from './PhotoBoothPostDialog';

interface PhotoBoothPostCardProps {
  post: any;
  onStatusUpdate: (postId: string, status: string, adminNotes?: string) => Promise<{ success: boolean; error?: string }>;
  onTagUpdate: (postId: string, tags: string[]) => Promise<{ success: boolean; error?: string }>;
  onDelete: (postId: string) => Promise<{ success: boolean; error?: string }>;
}

const PhotoBoothPostCard: React.FC<PhotoBoothPostCardProps> = ({
  post,
  onStatusUpdate,
  onTagUpdate,
  onDelete
}) => {
  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'featured': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  return (
    <Card className="overflow-hidden">
      <div className="aspect-square relative">
        <img
          src={post.image_url}
          alt={post.caption}
          className="w-full h-full object-cover"
          onError={(e) => {
            e.currentTarget.src = "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?q=80&w=300&auto=format&fit=crop";
          }}
        />
        <div className="absolute top-2 right-2">
          <Badge className={getStatusBadgeColor(post.status || 'pending')}>
            {post.status || 'pending'}
          </Badge>
        </div>
      </div>
      
      <CardContent className="p-4">
        <p className="text-sm text-gray-900 mb-2 line-clamp-2">{post.caption}</p>
        <div className="text-xs text-gray-500 mb-2">
          <div>By: {post.uploaded_by}</div>
          <div className="flex items-center mt-1">
            <Calendar className="h-3 w-3 mr-1" />
            {new Date(post.created_at).toLocaleDateString()}
          </div>
        </div>
        
        {post.tags && post.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {post.tags.map((tag, index) => (
              <Badge key={index} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        
        <div className="flex flex-wrap gap-2">
          <PhotoBoothPostDialog
            post={post}
            onStatusUpdate={onStatusUpdate}
            onTagUpdate={onTagUpdate}
            onDelete={onDelete}
          />
          
          {post.status === 'pending' && (
            <>
              <Button
                size="sm"
                onClick={() => onStatusUpdate(post.id, 'approved')}
                className="bg-green-600 hover:bg-green-700"
              >
                <Check className="h-3 w-3" />
              </Button>
              <Button
                size="sm"
                onClick={() => onStatusUpdate(post.id, 'rejected')}
                variant="destructive"
              >
                <X className="h-3 w-3" />
              </Button>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default PhotoBoothPostCard;
