
import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { format } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { toast } from '@/hooks/use-toast';
import { Star, Search, MessageSquare, Phone, Mail, Calendar, CheckCircle, AlertTriangle, Clock } from 'lucide-react';

interface GuestFeedback {
  id: string;
  name: string | null;
  email: string | null;
  phone: string | null;
  visit_date: string;
  rating: number;
  feedback: string;
  consent_to_share: boolean;
  ai_response: string | null;
  status: string;
  created_at: string;
}

const FeedbackDashboard: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [ratingFilter, setRatingFilter] = useState<string>('all');
  const queryClient = useQueryClient();

  const { data: feedbackList = [], isLoading } = useQuery({
    queryKey: ['guest-feedback'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('guest_feedback')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as GuestFeedback[];
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const { error } = await supabase
        .from('guest_feedback')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['guest-feedback'] });
      toast({ title: 'Status updated', description: 'Feedback status has been updated.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update status.', variant: 'destructive' });
    },
  });

  const filteredFeedback = feedbackList.filter((feedback) => {
    const matchesSearch =
      !searchTerm ||
      feedback.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      feedback.feedback.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesStatus = statusFilter === 'all' || feedback.status === statusFilter;
    const matchesRating =
      ratingFilter === 'all' ||
      (ratingFilter === 'positive' && feedback.rating > 3) ||
      (ratingFilter === 'negative' && feedback.rating <= 3);

    return matchesSearch && matchesStatus && matchesRating;
  });

  const stats = {
    total: feedbackList.length,
    new: feedbackList.filter((f) => f.status === 'new').length,
    flagged: feedbackList.filter((f) => f.status === 'flagged').length,
    responded: feedbackList.filter((f) => f.status === 'responded').length,
    avgRating: feedbackList.length > 0
      ? (feedbackList.reduce((sum, f) => sum + f.rating, 0) / feedbackList.length).toFixed(1)
      : '0',
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'new':
        return <Badge variant="secondary" className="flex items-center gap-1"><Clock className="h-3 w-3" />New</Badge>;
      case 'flagged':
        return <Badge variant="destructive" className="flex items-center gap-1"><AlertTriangle className="h-3 w-3" />Flagged</Badge>;
      case 'responded':
        return <Badge className="flex items-center gap-1 bg-green-600"><CheckCircle className="h-3 w-3" />Responded</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const renderStars = (rating: number) => {
    return (
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${star <= rating ? 'fill-amber-400 text-amber-400' : 'text-gray-300'}`}
          />
        ))}
      </div>
    );
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Guest Feedback</h2>
        <p className="text-gray-600 mt-1">View and manage customer reviews</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground">Total Reviews</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-amber-500">{stats.avgRating}</div>
            <p className="text-xs text-muted-foreground">Avg Rating</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-blue-600">{stats.new}</div>
            <p className="text-xs text-muted-foreground">New</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-red-600">{stats.flagged}</div>
            <p className="text-xs text-muted-foreground">Flagged</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="pt-4">
            <div className="text-2xl font-bold text-green-600">{stats.responded}</div>
            <p className="text-xs text-muted-foreground">Responded</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="pt-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search by name, email, or content..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9"
              />
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="new">New</SelectItem>
                <SelectItem value="flagged">Flagged</SelectItem>
                <SelectItem value="responded">Responded</SelectItem>
              </SelectContent>
            </Select>
            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger className="w-full sm:w-40">
                <SelectValue placeholder="Rating" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Ratings</SelectItem>
                <SelectItem value="positive">Positive (4-5)</SelectItem>
                <SelectItem value="negative">Negative (1-3)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Feedback List */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">
            {filteredFeedback.length} Review{filteredFeedback.length !== 1 ? 's' : ''}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {filteredFeedback.length === 0 ? (
            <p className="text-center text-muted-foreground py-8">No feedback found</p>
          ) : (
            <Accordion type="single" collapsible className="space-y-2">
              {filteredFeedback.map((feedback) => (
                <AccordionItem key={feedback.id} value={feedback.id} className="border rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline py-4">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 text-left w-full pr-4">
                      <div className="flex items-center gap-2">
                        {renderStars(feedback.rating)}
                        {getStatusBadge(feedback.status)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="font-medium truncate block">
                          {feedback.name || 'Anonymous'}
                        </span>
                      </div>
                      <span className="text-sm text-muted-foreground">
                        {format(new Date(feedback.created_at), 'MMM d, yyyy')}
                      </span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pb-4">
                    <div className="space-y-4">
                      {/* Contact Info */}
                      <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                        {feedback.email && (
                          <div className="flex items-center gap-1">
                            <Mail className="h-4 w-4" />
                            <a href={`mailto:${feedback.email}`} className="hover:underline">
                              {feedback.email}
                            </a>
                          </div>
                        )}
                        {feedback.phone && (
                          <div className="flex items-center gap-1">
                            <Phone className="h-4 w-4" />
                            <a href={`tel:${feedback.phone}`} className="hover:underline">
                              {feedback.phone}
                            </a>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          Visited: {format(new Date(feedback.visit_date), 'MMM d, yyyy')}
                        </div>
                      </div>

                      {/* Feedback Content */}
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p className="whitespace-pre-wrap">{feedback.feedback}</p>
                      </div>

                      {/* AI Response */}
                      {feedback.ai_response && (
                        <div className="border-l-4 border-primary bg-primary/5 p-4 rounded-r-lg">
                          <div className="flex items-center gap-2 text-sm font-medium mb-2">
                            <MessageSquare className="h-4 w-4" />
                            AI-Generated Response
                          </div>
                          <p className="text-sm whitespace-pre-wrap">{feedback.ai_response}</p>
                        </div>
                      )}

                      {/* Consent */}
                      <div className="text-xs text-muted-foreground">
                        {feedback.consent_to_share
                          ? '✓ Consented to share publicly'
                          : '✗ Did not consent to share'}
                      </div>

                      {/* Status Actions */}
                      <div className="flex flex-wrap gap-2 pt-2 border-t">
                        <span className="text-sm font-medium mr-2">Update Status:</span>
                        <Button
                          size="sm"
                          variant={feedback.status === 'new' ? 'default' : 'outline'}
                          onClick={() => updateStatusMutation.mutate({ id: feedback.id, status: 'new' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          New
                        </Button>
                        <Button
                          size="sm"
                          variant={feedback.status === 'flagged' ? 'destructive' : 'outline'}
                          onClick={() => updateStatusMutation.mutate({ id: feedback.id, status: 'flagged' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          Flagged
                        </Button>
                        <Button
                          size="sm"
                          variant={feedback.status === 'responded' ? 'default' : 'outline'}
                          className={feedback.status === 'responded' ? 'bg-green-600 hover:bg-green-700' : ''}
                          onClick={() => updateStatusMutation.mutate({ id: feedback.id, status: 'responded' })}
                          disabled={updateStatusMutation.isPending}
                        >
                          Responded
                        </Button>
                      </div>
                    </div>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default FeedbackDashboard;
