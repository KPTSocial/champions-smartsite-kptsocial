
import React, { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { copyToClipboard } from "@/utils/copyToClipboard";
import { toast } from "@/components/ui/use-toast";
import { LogOut, Copy, Users, Gift, CheckCircle } from "lucide-react";

type Referral = {
  id: string;
  referred_email: string;
  joined: boolean;
  points_awarded: number;
  created_at: string;
};

type Stats = {
  totalReferrals: number;
  totalPoints: number;
  joinedList: { email: string; date: string }[];
};

const REFERRAL_BASE_URL = "champions.com/r/";

export function ReferralWidget() {
  const [userId, setUserId] = useState<string | null>(null);
  const [referralCode, setReferralCode] = useState<string | null>(null);
  const [referralLink, setReferralLink] = useState<string>("");
  const [stats, setStats] = useState<Stats>({
    totalReferrals: 0,
    totalPoints: 0,
    joinedList: [],
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;
    async function fetchProfileAndRefs() {
      setLoading(true);
      // Get current user session
      const {
        data: { session },
        error,
      } = await supabase.auth.getSession();
      if (error || !session?.user) {
        setLoading(false);
        return;
      }
      const uid = session.user.id;
      setUserId(uid);

      // Fetch or create user profile w/ referral code
      let { data: profile } = await supabase
        .from("user_profiles")
        .select("*")
        .eq("id", uid)
        .single();

      if (!profile) {
        // Generate a code from username/email prefix (or fallback to ID-6)
        const code = (session.user.user_metadata?.username?.toLowerCase() ??
          session.user.email?.split("@")[0]?.toLowerCase() ??
          uid.substring(0, 6)
        ).replace(/[^a-z0-9]/gi, "");

        const { data: createdProfile } = await supabase
          .from("user_profiles")
          .insert({
            id: uid,
            user_email: session.user.email,
            referral_code: code,
          })
          .select("*")
          .single();
        profile = createdProfile;
      }
      setReferralCode(profile.referral_code);
      setReferralLink(`${REFERRAL_BASE_URL}${profile.referral_code}`);

      // Get referrals sent by this user
      let { data: referrals, error: refErr } = await supabase
        .from("referrals")
        .select("*")
        .eq("referrer_id", uid)
        .order("created_at", { ascending: false });
      if (!referrals) referrals = [];

      // Calculate stats
      const joinedList = referrals
        .filter((r: Referral) => r.joined)
        .map((r: Referral) => ({
          email: r.referred_email,
          date: new Date(r.created_at).toLocaleDateString(),
        }));

      const totalPoints = referrals.reduce(
        (sum: number, r: Referral) => sum + (r.points_awarded || 0), 0
      );

      if (isMounted) {
        setStats({
          totalReferrals: referrals.length,
          totalPoints,
          joinedList,
        });
        setLoading(false);
      }
    }
    fetchProfileAndRefs();
    return () => {
      isMounted = false;
    };
  }, []);

  if (loading) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <Users className="text-primary" /> Champions Club – Referral Program
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse py-6">Loading referral info...</div>
        </CardContent>
      </Card>
    );
  }

  if (!userId) {
    return (
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Champions Club – Referral Program</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground mb-2">Sign in to see your referral perks.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <Gift className="text-primary" /> Invite Friends, Earn Points!
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4 space-y-2">
          <div>
            <strong>Give your friends $5 off. You get 100 points when they join.</strong>
          </div>
          <div className="bg-accent p-2 rounded flex flex-col sm:flex-row sm:items-center gap-2">
            <span className="truncate font-mono text-muted-foreground">{referralLink}</span>
            <Button
              variant="secondary"
              size="sm"
              className="shrink-0"
              onClick={async () => {
                await copyToClipboard(referralLink);
                toast({ title: "Copied!", description: "Your referral link is now on your clipboard." });
              }}
            >
              <Copy className="w-4 h-4" /> Copy My Link
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4 mt-4">
          <div>
            <div className="text-2xl font-bold">{stats.totalReferrals}</div>
            <div className="text-sm text-muted-foreground">Total Referrals</div>
          </div>
          <div>
            <div className="text-2xl font-bold">{stats.totalPoints}</div>
            <div className="text-sm text-muted-foreground">Points Earned</div>
          </div>
        </div>

        <div className="mt-4">
          <div className="font-semibold mb-2 text-sm">Joined from your invites:</div>
          {stats.joinedList.length > 0 ? (
            <ul className="space-y-1">
              {stats.joinedList.map(({ email, date }, i) => (
                <li key={i} className="flex items-center gap-2 text-muted-foreground text-xs">
                  <CheckCircle className="w-3 h-3 text-green-500" /> <span>{email}</span> <span>({date})</span>
                </li>
              ))}
            </ul>
          ) : (
            <span className="text-xs text-muted-foreground">No friends have joined yet.</span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
