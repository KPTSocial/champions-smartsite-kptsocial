import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { DragDropContext, Droppable, Draggable, DropResult } from '@hello-pangea/dnd';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from '@/components/ui/collapsible';
import { Plus, GripVertical, Pencil, Trash2, ChevronDown, Eye, EyeOff, Sparkles } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { SeasonalCardForm } from './SeasonalCardForm';
import {
  getSeasonalCardsAdmin,
  createSeasonalCard,
  updateSeasonalCard,
  deleteSeasonalCard,
  toggleSeasonalCardVisibility,
  updateSeasonalCardSortOrders,
  SeasonalEventCard,
  SeasonalEventCardInsert,
} from '@/services/seasonalCardService';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

export function SeasonalCardsManager() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isOpen, setIsOpen] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCard, setEditingCard] = useState<SeasonalEventCard | null>(null);
  const [deleteConfirmCard, setDeleteConfirmCard] = useState<SeasonalEventCard | null>(null);

  const { data: cards = [], isLoading } = useQuery({
    queryKey: ['seasonal-cards-admin'],
    queryFn: getSeasonalCardsAdmin,
  });

  const createMutation = useMutation({
    mutationFn: createSeasonalCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasonal-cards-admin'] });
      queryClient.invalidateQueries({ queryKey: ['seasonal-cards-public'] });
      toast({ title: 'Card created', description: 'The seasonal card has been created.' });
      setShowForm(false);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to create card.', variant: 'destructive' });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<SeasonalEventCardInsert> }) =>
      updateSeasonalCard(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasonal-cards-admin'] });
      queryClient.invalidateQueries({ queryKey: ['seasonal-cards-public'] });
      toast({ title: 'Card updated', description: 'The seasonal card has been updated.' });
      setShowForm(false);
      setEditingCard(null);
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to update card.', variant: 'destructive' });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteSeasonalCard,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasonal-cards-admin'] });
      queryClient.invalidateQueries({ queryKey: ['seasonal-cards-public'] });
      toast({ title: 'Card deleted', description: 'The seasonal card has been deleted.' });
    },
    onError: () => {
      toast({ title: 'Error', description: 'Failed to delete card.', variant: 'destructive' });
    },
  });

  const toggleVisibilityMutation = useMutation({
    mutationFn: ({ id, isVisible }: { id: string; isVisible: boolean }) =>
      toggleSeasonalCardVisibility(id, isVisible),
    onSuccess: (_, { isVisible }) => {
      queryClient.invalidateQueries({ queryKey: ['seasonal-cards-admin'] });
      queryClient.invalidateQueries({ queryKey: ['seasonal-cards-public'] });
      toast({
        title: isVisible ? 'Card visible' : 'Card hidden',
        description: isVisible ? 'The card is now visible on the public site.' : 'The card is now hidden from the public site.',
      });
    },
  });

  const reorderMutation = useMutation({
    mutationFn: updateSeasonalCardSortOrders,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['seasonal-cards-admin'] });
      queryClient.invalidateQueries({ queryKey: ['seasonal-cards-public'] });
    },
  });

  const handleDragEnd = (result: DropResult) => {
    if (!result.destination) return;

    const reorderedCards = Array.from(cards);
    const [removed] = reorderedCards.splice(result.source.index, 1);
    reorderedCards.splice(result.destination.index, 0, removed);

    const updates = reorderedCards.map((card, index) => ({
      id: card.id,
      sort_order: index,
    }));

    reorderMutation.mutate(updates);
  };

  const handleFormSubmit = async (data: SeasonalEventCardInsert) => {
    if (editingCard) {
      await updateMutation.mutateAsync({ id: editingCard.id, data });
    } else {
      await createMutation.mutateAsync(data);
    }
  };

  const handleEdit = (card: SeasonalEventCard) => {
    setEditingCard(card);
    setShowForm(true);
  };

  const handleFormClose = () => {
    setShowForm(false);
    setEditingCard(null);
  };

  const maxSortOrder = cards.length > 0 ? Math.max(...cards.map(c => c.sort_order)) : -1;

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen}>
      <Card className="border-dashed">
        <CollapsibleTrigger asChild>
          <CardHeader className="cursor-pointer hover:bg-muted/50 transition-colors">
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                Seasonal & Special Event Cards
              </CardTitle>
              <ChevronDown className={`h-5 w-5 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
            </div>
          </CardHeader>
        </CollapsibleTrigger>

        <CollapsibleContent>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Manage the seasonal event cards displayed on the Happenings page.
              </p>
              <Button onClick={() => setShowForm(true)} size="sm" className="gap-2">
                <Plus className="h-4 w-4" />
                Add Card
              </Button>
            </div>

            {isLoading ? (
              <div className="py-8 text-center text-muted-foreground">Loading cards...</div>
            ) : cards.length === 0 ? (
              <div className="py-8 text-center text-muted-foreground">
                No seasonal cards yet. Create your first one!
              </div>
            ) : (
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="seasonal-cards">
                  {(provided) => (
                    <div
                      {...provided.droppableProps}
                      ref={provided.innerRef}
                      className="space-y-2"
                    >
                      {cards.map((card, index) => (
                        <Draggable key={card.id} draggableId={card.id} index={index}>
                          {(provided, snapshot) => (
                            <div
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              className={`flex items-center gap-3 p-3 rounded-lg border bg-card ${
                                snapshot.isDragging ? 'shadow-lg ring-2 ring-primary' : ''
                              } ${!card.is_visible ? 'opacity-60' : ''}`}
                            >
                              <div
                                {...provided.dragHandleProps}
                                className="cursor-grab active:cursor-grabbing"
                              >
                                <GripVertical className="h-5 w-5 text-muted-foreground" />
                              </div>

                              {card.background_image_url && (
                                <div className="w-12 h-12 rounded overflow-hidden flex-shrink-0">
                                  <img
                                    src={card.background_image_url}
                                    alt={card.title}
                                    className="w-full h-full object-cover"
                                  />
                                </div>
                              )}

                              <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2">
                                  <span className="text-lg">{card.emoji}</span>
                                  <span className="font-medium truncate">{card.title}</span>
                                </div>
                                <p className="text-sm text-muted-foreground truncate">
                                  {card.description.slice(0, 60)}...
                                </p>
                              </div>

                              <div className="flex items-center gap-2">
                                <Switch
                                  checked={card.is_visible}
                                  onCheckedChange={(checked) =>
                                    toggleVisibilityMutation.mutate({ id: card.id, isVisible: checked })
                                  }
                                  aria-label={card.is_visible ? 'Hide card' : 'Show card'}
                                />
                                {card.is_visible ? (
                                  <Eye className="h-4 w-4 text-muted-foreground" />
                                ) : (
                                  <EyeOff className="h-4 w-4 text-muted-foreground" />
                                )}
                              </div>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleEdit(card)}
                              >
                                <Pencil className="h-4 w-4" />
                              </Button>

                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => setDeleteConfirmCard(card)}
                              >
                                <Trash2 className="h-4 w-4 text-destructive" />
                              </Button>
                            </div>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            )}
          </CardContent>
        </CollapsibleContent>
      </Card>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={handleFormClose}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {editingCard ? 'Edit Seasonal Card' : 'Create Seasonal Card'}
            </DialogTitle>
          </DialogHeader>
          <SeasonalCardForm
            card={editingCard}
            onSubmit={handleFormSubmit}
            onCancel={handleFormClose}
            maxSortOrder={maxSortOrder}
          />
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation */}
      <AlertDialog open={!!deleteConfirmCard} onOpenChange={() => setDeleteConfirmCard(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Seasonal Card?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{deleteConfirmCard?.title}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              onClick={() => {
                if (deleteConfirmCard) {
                  deleteMutation.mutate(deleteConfirmCard.id);
                  setDeleteConfirmCard(null);
                }
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Collapsible>
  );
}
