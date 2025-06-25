
import React, { useState } from 'react';
import { usePhotoBoothPosts } from '@/hooks/usePhotoBoothPosts';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Eye, Check, X, Tag, Calendar, Search } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const PhotoBoothDashboard: React.FC = () => {
  const [filters, setFilters] = useState({
    status: '',
    dateFrom: '',
    dateTo: '',
    searchTerm: '',
  });
  
  const { posts, loading, updatePostStatus, updatePostTags, deletePost } = usePhotoBoothPosts(filters);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [tagInput, setTagInput] = useState('');
  const [adminNotes, setAdminNotes] = useState('');

  const handleStatusUpdate = async (postId: string, status: string) => {
    const result = await updatePostStatus(postId, status, adminNotes);
    if (result.success) {
      toast.success(`Post ${status} successfully`);
      setAdminNotes('');
    } else {
      toast.error(result.error);
    }
  };

  const handleTagUpdate = async (postId: string) => {
    const tags = tagInput.split(',').map(tag => tag.trim()).filter(tag => tag);
    const result = await updatePostTags(postId, tags);
    if (result.success) {
      toast.success('Tags updated successfully');
      setTagInput('');
    } else {
      toast.error(result.error);
    }
  };

  const handleDelete = async (postId: string) => {
    if (confirm('Are you sure you want to delete this post?')) {
      const result = await deletePost(postId);
      if (result.success) {
        toast.success('Post deleted successfully');
      } else {
        toast.error(result.error);
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'featured': return 'bg-blue-100 text-blue-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

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
      <Card>
        <CardContent className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <Label>Search</Label>
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search captions or names..."
                  className="pl-10"
                  value={filters.searchTerm}
                  onChange={(e) => setFilters(prev => ({ ...prev, searchTerm: e.target.value }))}
                />
              </div>
            </div>
            
            <div>
              <Label>Status</Label>
              <Select value={filters.status} onValueChange={(value) => setFilters(prev => ({ ...prev, status: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="All statuses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All statuses</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                  <SelectItem value="featured">Featured</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label>From Date</Label>
              <Input
                type="date"
                value={filters.dateFrom}
                onChange={(e) => setFilters(prev => ({ ...prev, dateFrom: e.target.value }))}
              />
            </div>
            
            <div>
              <Label>To Date</Label>
              <Input
                type="date"
                value={filters.dateTo}
                onChange={(e) => setFilters(prev => ({ ...prev, dateTo: e.target.value }))}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
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

      {/* Posts Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {filteredPosts.map((post) => (
          <Card key={post.id} className="overflow-hidden">
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
                <Dialog>
                  <DialogTrigger asChild>
                    <Button size="sm" variant="outline" onClick={() => setSelectedPost(post)}>
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
                          onClick={() => handleTagUpdate(post.id)}
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
                          onClick={() => handleStatusUpdate(post.id, 'approved')}
                          size="sm"
                          className="bg-green-600 hover:bg-green-700"
                        >
                          <Check className="h-3 w-3 mr-1" />
                          Approve
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(post.id, 'featured')}
                          size="sm"
                          variant="outline"
                        >
                          ⭐ Feature
                        </Button>
                        <Button
                          onClick={() => handleStatusUpdate(post.id, 'rejected')}
                          size="sm"
                          variant="destructive"
                        >
                          <X className="h-3 w-3 mr-1" />
                          Reject
                        </Button>
                        <Button
                          onClick={() => handleDelete(post.id)}
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
                
                {post.status === 'pending' && (
                  <>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(post.id, 'approved')}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      <Check className="h-3 w-3" />
                    </Button>
                    <Button
                      size="sm"
                      onClick={() => handleStatusUpdate(post.id, 'rejected')}
                      variant="destructive"
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </>
                )}
              </div>
            </CardContent>
          </Card>
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
