
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
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
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Photo Details</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <img
            src={post.image_url}
            alt={post.caption}
            className="w-full max-h-96 object-contain rounded-lg"
          />
          <div>
            <Label>Caption</Label>
            <p className="text-sm mt-1">{post.caption}</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label>Uploaded by</Label>
              <p className="text-sm mt-1">{post.uploaded_by}</p>
            </div>
            <div>
              <Label>Upload date</Label>
              <p className="text-sm mt-1">{new Date(post.created_at).toLocaleDateString()}</p>
            </div>
          </div>
          
          <div>
            <Label>Tags</Label>
            <Input
              placeholder="Enter tags separated by commas"
              value={tagInput}
              onChange={(e) => setTagInput(e.target.value)}
              className="mt-1"
            />
            <Button
              size="sm"
              onClick={handleTagUpdate}
              className="mt-2"
              disabled={!tagInput.trim()}
            >
              <Tag className="h-3 w-3 mr-1" />
              Update Tags
            </Button>
          </div>
          
          <div>
            <Label>Admin Notes</Label>
            <Textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Add notes about this post..."
              className="mt-1"
            />
          </div>
          
          <div className="flex gap-2">
            <Button
              onClick={() => handleStatusUpdate('approved')}
              size="sm"
              className="bg-green-600 hover:bg-green-700"
            >
              <Check className="h-3 w-3 mr-1" />
              Approve
            </Button>
            <Button
              onClick={() => handleStatusUpdate('featured')}
              size="sm"
              variant="outline"
            >
              ⭐ Feature
            </Button>
            <Button
              onClick={() => handleStatusUpdate('rejected')}
              size="sm"
              variant="destructive"
            >
              <X className="h-3 w-3 mr-1" />
              Reject
            </Button>
            <Button
              onClick={handleDelete}
              size="sm"
              variant="outline"
              className="text-red-600 hover:text-red-700"
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
