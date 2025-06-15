
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Beer, GlassWater, Trophy, Handshake } from "lucide-react";

const MemberDashboard = () => {
  const demo_mode = true;
  const user_name = "Jordan P.";

  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container pb-20">
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold font-serif">
            Welcome back, {demo_mode ? user_name : "{{name}}"}
          </h1>
          <div className="mt-4 flex flex-wrap gap-2">
            {demo_mode ? (
              <>
                <Badge variant="secondary" className="text-sm">Mug Club Member</Badge>
                <Badge variant="secondary" className="text-sm">Whiskey Room Member</Badge>
              </>
            ) : (
              <Badge variant="secondary" className="text-sm">{"{{tier}}"}</Badge>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <Beer className="text-primary" />
                Your Mug Club Perks
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Your own engraved mug waiting for you behind the bar.</li>
                <li>Discounted pours on all draft beers, all the time.</li>
                <li>First dibs on limited edition and seasonal brews.</li>
                <li>Exclusive invites to our "Brewer's Night" events.</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-3 text-3xl">
                <GlassWater className="text-primary" />
                The Whiskey Room
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Exclusive access to a curated selection of rare and premium whiskeys.</li>
                <li>Member-only tasting events with master distillers.</li>
                <li>Personalized locker to store your favorite bottles.</li>
                <li>Priority reservations for the private Whiskey Room lounge.</li>
              </ul>
            </CardContent>
          </Card>
        </div>

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

      {demo_mode && (
        <div className="fixed bottom-0 left-0 right-0 bg-accent text-accent-foreground p-3 text-center text-sm font-semibold z-50">
          <p>🧪 Demo Mode: Loyalty Data Simulated</p>
        </div>
      )}
    </div>
  );
};

export default MemberDashboard;
