import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Calendar, Upload, FileText, Loader2, CheckCircle2, XCircle, Sparkles, CalendarDays, AlertCircle } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { 
  fetchTeams, 
  parseScheduleText, 
  createEventsFromSchedule,
  TeamSchedule,
  ParsedGame 
} from '@/services/teamScheduleService';
import { format } from 'date-fns';

interface TeamScheduleUploaderProps {
  onClose: () => void;
  onEventsCreated: () => void;
}

const TeamScheduleUploader: React.FC<TeamScheduleUploaderProps> = ({ onClose, onEventsCreated }) => {
  const { toast } = useToast();
  const [teams, setTeams] = useState<TeamSchedule[]>([]);
  const [selectedTeamId, setSelectedTeamId] = useState<string>('');
  const [scheduleText, setScheduleText] = useState('');
  const [isParsing, setIsParsing] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [parsedGames, setParsedGames] = useState<ParsedGame[]>([]);
  const [showPreview, setShowPreview] = useState(false);
  
  // Options
  const [isFeatured, setIsFeatured] = useState(false);
  const [saveAsDraft, setSaveAsDraft] = useState(true);

  // Load teams on mount
  useEffect(() => {
    const loadTeams = async () => {
      try {
        const data = await fetchTeams();
        setTeams(data);
      } catch (error) {
        console.error('Error loading teams:', error);
        toast({
          title: 'Error',
          description: 'Failed to load teams. Please try again.',
          variant: 'destructive',
        });
      }
    };
    loadTeams();
  }, [toast]);

  const selectedTeam = teams.find(t => t.id === selectedTeamId);

  const handleParseSchedule = async () => {
    if (!selectedTeam || !scheduleText.trim()) {
      toast({
        title: 'Missing information',
        description: 'Please select a team and paste the schedule text.',
        variant: 'destructive',
      });
      return;
    }

    setIsParsing(true);
    try {
      const games = await parseScheduleText(scheduleText, selectedTeam.team_name);
      setParsedGames(games);
      setShowPreview(true);
      
      if (games.length === 0) {
        toast({
          title: 'No games found',
          description: 'Could not extract any games from the provided text. Please check the format.',
          variant: 'destructive',
        });
      } else {
        toast({
          title: 'Schedule parsed',
          description: `Found ${games.length} games. Review and confirm below.`,
        });
      }
    } catch (error) {
      console.error('Parse error:', error);
      toast({
        title: 'Parse failed',
        description: 'Failed to parse the schedule. Please try again with a different format.',
        variant: 'destructive',
      });
    } finally {
      setIsParsing(false);
    }
  };

  const handleToggleGame = (gameId: string) => {
    setParsedGames(prev => 
      prev.map(game => 
        game.id === gameId ? { ...game, selected: !game.selected } : game
      )
    );
  };

  const handleSelectAll = () => {
    const allSelected = parsedGames.every(g => g.selected);
    setParsedGames(prev => prev.map(game => ({ ...game, selected: !allSelected })));
  };

  const handleCreateEvents = async () => {
    if (!selectedTeam) return;
    
    const selectedCount = parsedGames.filter(g => g.selected).length;
    if (selectedCount === 0) {
      toast({
        title: 'No games selected',
        description: 'Please select at least one game to import.',
        variant: 'destructive',
      });
      return;
    }

    setIsCreating(true);
    try {
      const result = await createEventsFromSchedule(parsedGames, selectedTeam, {
        isFeatured,
        saveAsDraft,
      });

      if (result.success > 0) {
        toast({
          title: 'Events created',
          description: `Successfully created ${result.success} event${result.success !== 1 ? 's' : ''}${result.failed > 0 ? ` (${result.failed} failed)` : ''}.`,
        });
        onEventsCreated();
        onClose();
      } else {
        toast({
          title: 'Import failed',
          description: 'Failed to create any events. Please try again.',
          variant: 'destructive',
        });
      }
    } catch (error) {
      console.error('Create events error:', error);
      toast({
        title: 'Error',
        description: 'Failed to create events. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsCreating(false);
    }
  };

  const handleUpdateGameField = (gameId: string, field: keyof ParsedGame, value: string) => {
    setParsedGames(prev =>
      prev.map(game =>
        game.id === gameId ? { ...game, [field]: value } : game
      )
    );
  };

  const selectedCount = parsedGames.filter(g => g.selected).length;

  if (showPreview && parsedGames.length > 0) {
    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <CalendarDays className="h-5 w-5" />
              Review Schedule
            </h3>
            <p className="text-sm text-muted-foreground">
              {selectedTeam?.team_name} • {parsedGames.length} games found
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => setShowPreview(false)}>
            ← Back to Edit
          </Button>
        </div>

        <div className="flex items-center justify-between border-b pb-3">
          <Button variant="ghost" size="sm" onClick={handleSelectAll}>
            {parsedGames.every(g => g.selected) ? 'Deselect All' : 'Select All'}
          </Button>
          <Badge variant="secondary">
            {selectedCount} of {parsedGames.length} selected
          </Badge>
        </div>

        <ScrollArea className="h-[300px] border rounded-lg">
          <div className="p-3 space-y-2">
            {parsedGames.map((game) => (
              <div
                key={game.id}
                className={`flex items-start gap-3 p-3 rounded-lg border transition-colors ${
                  game.selected ? 'bg-accent/50 border-primary/30' : 'bg-muted/30 opacity-60'
                }`}
              >
                <Checkbox
                  checked={game.selected}
                  onCheckedChange={() => handleToggleGame(game.id)}
                  className="mt-1"
                />
                <div className="flex-1 space-y-2">
                  <Input
                    value={game.title}
                    onChange={(e) => handleUpdateGameField(game.id, 'title', e.target.value)}
                    className="font-medium h-8"
                  />
                  <div className="flex flex-wrap gap-2 text-sm">
                    <div className="flex items-center gap-1">
                      <Calendar className="h-3 w-3 text-muted-foreground" />
                      <Input
                        type="date"
                        value={game.date}
                        onChange={(e) => handleUpdateGameField(game.id, 'date', e.target.value)}
                        className="h-7 w-36 text-xs"
                      />
                    </div>
                    <div className="flex items-center gap-1">
                      <Input
                        type="time"
                        value={game.time}
                        onChange={(e) => handleUpdateGameField(game.id, 'time', e.target.value)}
                        className="h-7 w-24 text-xs"
                      />
                    </div>
                    <Badge variant={game.location === 'home' ? 'default' : 'outline'} className="text-xs">
                      {game.location === 'home' ? 'Home' : 'Away'}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Card className="bg-muted/30">
          <CardContent className="pt-4 space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="featured-switch"
                  checked={isFeatured}
                  onCheckedChange={setIsFeatured}
                />
                <Label htmlFor="featured-switch" className="text-sm">
                  Mark all as Featured Events
                </Label>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Switch
                  id="draft-switch"
                  checked={saveAsDraft}
                  onCheckedChange={setSaveAsDraft}
                />
                <Label htmlFor="draft-switch" className="text-sm">
                  Save as Draft (review before publishing)
                </Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button 
            onClick={handleCreateEvents} 
            disabled={isCreating || selectedCount === 0}
            className="flex-1 gap-2"
          >
            {isCreating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              <>
                <CheckCircle2 className="h-4 w-4" />
                Import {selectedCount} Event{selectedCount !== 1 ? 's' : ''}
              </>
            )}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2">
        <CalendarDays className="h-5 w-5 text-primary" />
        <h3 className="text-lg font-semibold">Season Schedule Uploader</h3>
      </div>
      
      <p className="text-sm text-muted-foreground">
        Paste a team's schedule and we'll automatically create events for each game.
      </p>

      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Select Team</Label>
          <Select value={selectedTeamId} onValueChange={setSelectedTeamId}>
            <SelectTrigger>
              <SelectValue placeholder="Choose a team..." />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  <span className="flex items-center gap-2">
                    {team.team_name}
                    <Badge variant="outline" className="text-xs">
                      {team.event_type}
                    </Badge>
                  </span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Paste Schedule</Label>
          <Textarea
            placeholder={`Paste the team's schedule here...

Example formats:
Feb 15, 7:30 PM - vs LA Galaxy (Home)
Feb 22, 5:00 PM - @ Seattle Sounders (Away)
Mar 1, 7:00 PM - vs Real Salt Lake

Or paste directly from the team's website.`}
            value={scheduleText}
            onChange={(e) => setScheduleText(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>

        <Card className="bg-primary/5 border-primary/20">
          <CardContent className="pt-4">
            <div className="flex items-start gap-3">
              <Sparkles className="h-5 w-5 text-primary mt-0.5" />
              <div className="text-sm">
                <p className="font-medium">AI-Powered Parsing</p>
                <p className="text-muted-foreground">
                  Our AI will extract dates, times, opponents, and home/away status from any format.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="flex gap-3 pt-2">
          <Button variant="outline" onClick={onClose} className="flex-1">
            Cancel
          </Button>
          <Button
            onClick={handleParseSchedule}
            disabled={isParsing || !selectedTeamId || !scheduleText.trim()}
            className="flex-1 gap-2"
          >
            {isParsing ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Parsing...
              </>
            ) : (
              <>
                <FileText className="h-4 w-4" />
                Parse Schedule
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default TeamScheduleUploader;
