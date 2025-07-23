
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { GlassWater, Loader2, CheckSquare } from "lucide-react";

type WhiskeyRoomMember = {
  joined_date: string;
  personalized_locker?: string | null;
  active: boolean;
};

export function WhiskeyRoomWidget() {
  const [member, setMember] = useState<WhiskeyRoomMember | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchMembership() {
      setLoading(true);
      const { data: { session }, error } = await supabase.auth.getSession();
      if (error || !session?.user) {
        setMember(null);
        setLoading(false);
        return;
      }
      // Fetch membership for this user
      const { data, error: memError } = await supabase
        .from("whiskey_room_members")
        .select("*")
        .eq("user_id", session.user.id)
        .eq("active", true)
        .single();

      if (isMounted) {
        setMember(data || null);
        setLoading(false);
      }
    }
    fetchMembership();
    return () => { isMounted = false; };
  }, []);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <GlassWater className="text-primary" /> Whiskey Room
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Loader2 className="animate-spin mr-2 inline" /> Loading...
        </CardContent>
      </Card>
    );
  }

  if (!member) {
    // Not a member (stub: joining logic not shown), demo messaging only.
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <GlassWater className="text-primary" /> Whiskey Room
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="font-semibold mb-2">Unlock the Whiskey Room: Elite Spirits, Private Access</div>
          <ul className="list-disc ml-5 mb-3 text-muted-foreground text-sm">
            <li>Curated rare whiskeys</li>
            <li>Special tasting events</li>
            <li>Personal locker for your bottles</li>
          </ul>
          <Button variant="default" size="sm" onClick={() => console.log('Whiskey Room interest captured')} className="mt-2">
            <GlassWater className="w-4 h-4 mr-2" />
            Join the Whiskey List
          </Button>
        </CardContent>
      </Card>
    );
  }

  // Show member info
  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <CheckSquare className="text-green-700" /> Whiskey Room Member
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <strong>Member Since:</strong> {new Date(member.joined_date).toLocaleDateString()}
        </div>
        <div className="mb-2">
          <strong>Locker:</strong> {member.personalized_locker ? member.personalized_locker : <span className="text-muted-foreground">None assigned</span>}
        </div>
        <div className="mt-3">
          <ul className="list-disc ml-4 text-sm text-muted-foreground">
            <li>VIP tastings with distillers</li>
            <li>Priority reservations for lounge</li>
            <li>Exclusive barrel picks</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
