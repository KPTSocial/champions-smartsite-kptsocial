
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReferralWidget } from "@/components/member-dashboard/ReferralWidget";
import { MugClubWidget } from "@/components/member-dashboard/MugClubWidget";
import { WhiskeyRoomWidget } from "@/components/member-dashboard/WhiskeyRoomWidget";
import { Badge } from "@/components/ui/badge";
import { Beer, GlassWater, Trophy, Handshake } from "lucide-react";
import { Waves } from "@/components/ui/waves-background";

const MemberDashboard = () => {
  const demo_mode = false;

  return (
    <div className="relative min-h-screen bg-background flex flex-col justify-center">
      {/* Wavy animated background */}
      <Waves
        className="z-0 pointer-events-none select-none"
        lineColor="rgba(255,140,79,0.13)"
        backgroundColor="transparent"
        waveSpeedX={0.013}
        waveSpeedY={0.007}
        waveAmpX={34}
        waveAmpY={16}
        xGap={14}
        yGap={36}
        friction={0.93}
        tension={0.008}
        maxCursorMove={110}
      />
      {/* Stack content above waves */}
      <div className="relative z-10 bg-transparent py-16 md:py-24">
        <div className="container pb-20">
          <div className="mb-12">
            <h1 className="text-4xl md:text-5xl font-bold font-serif">
              Welcome back!
            </h1>
            {/* Optionally, show a user badge or their roles/status here */}
          </div>

          {/* NEW WIDGETS */}
          <ReferralWidget />
          <MugClubWidget />
          <WhiskeyRoomWidget />

          {/* Opportunities Section (optional, legacy) */}
          <div className="mt-8">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-3xl">Exclusive Opportunities</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="p-4 rounded-lg border bg-accent/10">
                           <h3 className="font-semibold text-xl flex items-center gap-2 mb-2"><Handshake className="text-primary"/>Sponsorships</h3>
                           <p className="text-muted-foreground">Explore exclusive sponsorship opportunities available only to our members, from local sports teams to community events.</p>
                      </div>
                       <div className="p-4 rounded-lg border bg-accent/10">
                           <h3 className="font-semibold text-xl flex items-center gap-2 mb-2"><Trophy className="text-primary"/>Cornhole Tournaments</h3>
                           <p className="text-muted-foreground">Get first access to sign up for our annual Summer and Fall Cornhole Tournaments. Glory (and prizes) await!</p>
                      </div>
                  </CardContent>
              </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MemberDashboard;
