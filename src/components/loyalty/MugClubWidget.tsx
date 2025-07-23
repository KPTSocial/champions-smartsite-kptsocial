
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { BadgeCheck, Beer, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

type MugClubMember = {
  joined_date: string;
  engraved_name: string;
  renewal_date?: string | null;
  active: boolean;
};

export function MugClubWidget() {
  const [member, setMember] = useState<MugClubMember | null>(null);
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
        .from("mug_club_members")
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
            <Beer className="text-primary" /> Mug Club Portal
          </CardTitle>
        </CardHeader>
        <CardContent><Loader2 className="animate-spin mr-2 inline" /> Loading...</CardContent>
      </Card>
    );
  }

  if (!member) {
    // Not a member, show join option (NO payment logic yet, just stub)
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Beer className="text-primary" /> Mug Club Portal
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 font-semibold">Join the Mug Club: Your Name. Your Mug. Your Tap.</div>
          <ul className="list-disc ml-5 mb-4 text-muted-foreground text-sm">
            <li>Engraved mug behind the bar</li>
            <li>Discounted draft pours, all the time</li>
            <li>Tap alerts when your favorite keg is on</li>
            <li>Exclusive events & early-access perks</li>
          </ul>
          <Button variant="default" size="sm" onClick={() => console.log('Mug Club interest captured')}>
            <Beer className="w-4 h-4 mr-2" />
            Join the Waitlist
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
          <BadgeCheck className="text-green-600" /> Mug Club Member Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-2">
          <strong>Engraved Name:</strong> {member.engraved_name}
        </div>
        <div className="mb-2">
          <strong>Member Since:</strong>{" "}
          {member.joined_date && new Date(member.joined_date).toLocaleDateString()}
        </div>
        {member.renewal_date ? (
          <div className="mb-2">
            <strong>Renewal Date:</strong>{" "}
            {new Date(member.renewal_date).toLocaleDateString()}
          </div>
        ) : (
          <div className="mb-2 text-muted-foreground text-xs">See staff to update membership info.</div>
        )}
        <div className="mt-3">
          <ul className="list-disc ml-4 text-sm text-muted-foreground">
            <li>Get exclusive event invites</li>
            <li>Birthday beer bonus!</li>
            <li>First dibs on limited pours</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
}
