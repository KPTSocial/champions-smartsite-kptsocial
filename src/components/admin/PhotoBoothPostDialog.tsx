
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Eye, Check, X, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface PhotoBoothPostDialogProps {
  post: any;
  onStatusUpdate: (postId: string, status: string, adminNotes?: string) => Promise<{ success: boolean; error?: string }>;
  onTagUpdate: (postId: string, tags: string[]) => Promise<{ success: boolean; error?: string }>;
  onDelete: (postId: string) => Promise<{ success: boolean; error?: string }>;
}

const PhotoBoothPostDialog: React.FC<PhotoBoothPostDialogProps> = ({
  post,
  onStatusUpdate,
  onTagUpdate,
  onDelete
}) => {
  const [tagInput, setTagInput] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const handleStatusUpdate = async (status: string) => {
    const result = await onStatusUpdate(post.id, status, adminNotes);
    if (result.success) {
      toast.success(`Post ${status} successfully`);
      setAdminNotes('');
    } else {
      toast.error(result.error);
    }
  };

  const handleTagUpdate = async () => {
    const tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    const result = await onTagUpdate(post.id, tags);
    if (result.success) {
      toast.success('Tags updated successfully');
      setTagInput('');
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async () => {
    if (confirm('Are you sure you want to delete this post?')) {
      const result = await onDelete(post.id);
      if (result.success) {
        toast.success('Post deleted successfully');
      } else {
        toast.error(result.error);
      }
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="sm" variant="outline">
          <Eye className="h-3 w-3 mr-1" />
          View
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[95vw] max-w-2xl max-h-[90vh] p-0 overflow-hidden">
        <DialogHeader className="p-6 pb-4 border-b">
          <DialogTitle>Photo Details</DialogTitle>
          <DialogDescription>
            Review and manage this photo booth submission
          </DialogDescription>
        </DialogHeader>
        
        <ScrollArea className="flex-1 max-h-[calc(90vh-120px)]">
          <div className="p-6 space-y-6">
            {/* Image Display */}
            <div className="flex justify-center">
              <img
                src={post.image_url}
                alt={post.caption}
                className="max-w-full max-h-[40vh] object-contain rounded-lg border"
              />
            </div>
            
            {/* Post Information */}
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium">Caption</Label>
                <p className="text-sm mt-1 p-2 bg-gray-50 rounded border">{post.caption}</p>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium">Uploaded by</Label>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded border">{post.uploaded_by}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium">Upload date</Label>
                  <p className="text-sm mt-1 p-2 bg-gray-50 rounded border">
                    {new Date(post.created_at).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>
            
            {/* Tags Section */}
            <div>
              <Label className="text-sm font-medium">Tags</Label>
              <div className="mt-2 space-y-2">
                <Input
                  placeholder="Enter tags separated by commas"
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                />
                <Button
                  size="sm"
                  onClick={handleTagUpdate}
                  disabled={!tagInput.trim()}
                  className="w-full sm:w-auto"
                >
                  <Tag className="h-3 w-3 mr-1" />
                  Update Tags
                </Button>
              </div>
            </div>
            
            {/* Admin Notes */}
            <div>
              <Label className="text-sm font-medium">Admin Notes</Label>
              <Textarea
                value={adminNotes}
                onChange={(e) => setAdminNotes(e.target.value)}
                placeholder="Add notes about this post..."
                className="mt-2 min-h-[80px]"
              />
            </div>
          </div>
        </ScrollArea>
        
        {/* Action Buttons - Fixed at bottom */}
        <div className="p-6 pt-4 border-t bg-white">
          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => handleStatusUpdate('approved')}
              size="sm"
              className="bg-green-600 hover:bg-green-700 flex-1 sm:flex-none"
            >
              <Check className="h-3 w-3 mr-1" />
              Approve
            </Button>
            <Button
              onClick={() => handleStatusUpdate('featured')}
              size="sm"
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              ⭐ Feature
            </Button>
            <Button
              onClick={() => handleStatusUpdate('rejected')}
              size="sm"
              variant="destructive"
              className="flex-1 sm:flex-none"
            >
              <X className="h-3 w-3 mr-1" />
              Reject
            </Button>
            <Button
              onClick={handleDelete}
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700 flex-1 sm:flex-none"
            >
              Delete
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default PhotoBoothPostDialog;
