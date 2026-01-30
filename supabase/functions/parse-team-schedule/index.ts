import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface ParsedGame {
  id: string;
  date: string;
  time: string;
  opponent: string;
  location: 'home' | 'away';
  title: string;
  selected: boolean;
}

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { scheduleText, teamName } = await req.json();

    if (!scheduleText || !teamName) {
      return new Response(
        JSON.stringify({ error: 'Missing scheduleText or teamName' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const openAIApiKey = Deno.env.get('OPENAI_API_KEY');
    if (!openAIApiKey) {
      throw new Error('OpenAI API key not configured');
    }

    const currentYear = new Date().getFullYear();

    const systemPrompt = `You are a sports schedule parser. Extract game information from the provided text and return it as a JSON array.

For each game, extract:
- date: The game date in YYYY-MM-DD format (assume year ${currentYear} or ${currentYear + 1} if month is before current month)
- time: The game time in HH:MM format (24-hour). If not specified, use "19:00"
- opponent: The opposing team name (clean, no "vs" or "@" prefixes)
- location: "home" if the team is playing at home, "away" if traveling

Generate a title for each game in the format:
- For home games: "${teamName} vs [Opponent]"
- For away games: "${teamName} @ [Opponent]"

Return ONLY a valid JSON array with the games. No markdown, no explanation.

Example output:
[
  {
    "date": "2026-02-15",
    "time": "19:30",
    "opponent": "LA Galaxy",
    "location": "home",
    "title": "Portland Timbers vs LA Galaxy"
  }
]`;

    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${openAIApiKey}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-4o-mini',
        messages: [
          { role: 'system', content: systemPrompt },
          { role: 'user', content: `Parse this schedule for ${teamName}:\n\n${scheduleText}` },
        ],
        temperature: 0.1,
        max_tokens: 4000,
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error('Failed to parse schedule with AI');
    }

    const data = await response.json();
    const content = data.choices[0]?.message?.content || '[]';

    // Parse the JSON response
    let games: ParsedGame[];
    try {
      // Remove any markdown code blocks if present
      const cleanedContent = content.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
      const parsed = JSON.parse(cleanedContent);
      
      // Add id and selected fields to each game
      games = parsed.map((game: any, index: number) => ({
        id: `game-${index}-${Date.now()}`,
        date: game.date,
        time: game.time || '19:00',
        opponent: game.opponent,
        location: game.location || 'home',
        title: game.title,
        selected: true, // Default to selected
      }));
    } catch (parseError) {
      console.error('Failed to parse AI response:', content);
      throw new Error('Invalid response from AI');
    }

    return new Response(
      JSON.stringify({ games, rawResponse: content }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in parse-team-schedule:', error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
