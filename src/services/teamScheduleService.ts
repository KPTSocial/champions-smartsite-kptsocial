import { supabase } from '@/integrations/supabase/client';

export interface TeamSchedule {
  id: string;
  team_name: string;
  event_type: string;
  default_image_url: string | null;
  created_at: string;
}

export interface ParsedGame {
  id: string;
  date: string;
  time: string;
  opponent: string;
  location: 'home' | 'away';
  title: string;
  selected: boolean;
}

export const fetchTeams = async (): Promise<TeamSchedule[]> => {
  const { data, error } = await supabase
    .from('team_schedules')
    .select('*')
    .order('team_name');

  if (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }

  return (data || []) as TeamSchedule[];
};

export const parseScheduleText = async (
  scheduleText: string,
  teamName: string
): Promise<ParsedGame[]> => {
  const response = await fetch(
    'https://hqgdbufmokvrsydajdfr.supabase.co/functions/v1/parse-team-schedule',
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhxZ2RidWZtb2t2cnN5ZGFqZGZyIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDQ5MTczNjIsImV4cCI6MjA2MDQ5MzM2Mn0.aGckcRjor1nDLQq0Cc6mxJBN23iM3QCvljzZy5TTsGc`,
      },
      body: JSON.stringify({
        scheduleText,
        teamName,
      }),
    }
  );

  if (!response.ok) {
    const errorText = await response.text();
    console.error('Parse schedule error:', errorText);
    throw new Error('Failed to parse schedule');
  }

  const result = await response.json();
  return result.games || [];
};

export const createEventsFromSchedule = async (
  games: ParsedGame[],
  team: TeamSchedule,
  options: {
    isFeatured: boolean;
    saveAsDraft: boolean;
  }
): Promise<{ success: number; failed: number }> => {
  const selectedGames = games.filter(g => g.selected);
  let success = 0;
  let failed = 0;

  for (const game of selectedGames) {
    try {
      // Combine date and time into ISO string
      const eventDateTime = new Date(`${game.date}T${game.time || '19:00'}`);
      
      // Cast event_type to the expected type (includes WNBA which may not be in generated types yet)
      const eventType = team.event_type as 'Live Music' | 'Game Night' | 'Specials' | 'Soccer' | 'NCAA FB' | 'NBA' | 'WNBA' | 'MLS' | 'NWSL' | 'Olympics' | 'World Cup';
      
      const { error } = await supabase.from('events').insert({
        event_title: game.title,
        event_date: eventDateTime.toISOString(),
        event_type: eventType,
        description: `Watch the ${team.team_name} ${game.location === 'home' ? 'host' : 'visit'} the ${game.opponent}!`,
        location: 'on-site',
        image_url: team.default_image_url,
        is_featured: options.isFeatured,
        status: options.saveAsDraft ? 'draft' : 'published',
        allow_rsvp: false,
      });

      if (error) {
        console.error('Error creating event:', error);
        failed++;
      } else {
        success++;
      }
    } catch (err) {
      console.error('Error creating event:', err);
      failed++;
    }
  }

  return { success, failed };
};
