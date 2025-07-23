import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ReferralWidget } from "@/components/loyalty/ReferralWidget";
import { MugClubWidget } from "@/components/loyalty/MugClubWidget";
import { WhiskeyRoomWidget } from "@/components/loyalty/WhiskeyRoomWidget";
import SpotOnLoyaltyWidget from "@/components/loyalty/SpotOnLoyaltyWidget";
import { Badge } from "@/components/ui/badge";
import { Gift, Trophy, Handshake, Star } from "lucide-react";
import { Waves } from "@/components/ui/waves-background";

const LoyaltyPage = () => {
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
              Loyalty & Rewards
            </h1>
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              Discover exclusive benefits, earn rewards, and unlock special perks
            </p>
          </div>

          {/* NEW WIDGETS */}
          <ReferralWidget />
          <MugClubWidget />
          <WhiskeyRoomWidget />

          {/* Loyalty Benefits Section */}
          <div className="mt-8">
              <Card>
                  <CardHeader>
                      <CardTitle className="text-3xl">Loyalty Benefits</CardTitle>
                  </CardHeader>
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      <div className="p-4 rounded-lg border bg-accent/10">
                           <h3 className="font-semibold text-xl flex items-center gap-2 mb-2"><Gift className="text-primary"/>Earn Points</h3>
                           <p className="text-muted-foreground">Earn points with every purchase and redeem them for exclusive rewards and discounts.</p>
                      </div>
                      <div className="p-4 rounded-lg border bg-accent/10">
                           <h3 className="font-semibold text-xl flex items-center gap-2 mb-2"><Star className="text-primary"/>VIP Perks</h3>
                           <p className="text-muted-foreground">Enjoy special member pricing, birthday rewards, and exclusive access to events.</p>
                      </div>
                      <div className="p-4 rounded-lg border bg-accent/10">
                           <h3 className="font-semibold text-xl flex items-center gap-2 mb-2"><Trophy className="text-primary"/>Tournament Access</h3>
                           <p className="text-muted-foreground">Get first access to sign up for our annual Summer and Fall Cornhole Tournaments.</p>
                      </div>
                  </CardContent>
              </Card>
          </div>
          
          {/* SpotOn Loyalty Widget */}
          <SpotOnLoyaltyWidget />
        </div>
      </div>
    </div>
  );
};

export default LoyaltyPage;