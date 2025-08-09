import React, { useRef } from 'react';
import { BackgroundPaths } from "@/components/ui/background-paths";
const AboutUs = () => {
  const jaredSectionRef = useRef<HTMLDivElement | null>(null);
  const handleHeroButtonClick = () => {
    if (jaredSectionRef.current) {
      jaredSectionRef.current.scrollIntoView({
        behavior: 'smooth'
      });
    }
  };
  return <div className="bg-background">
      {/* Hero with animated background paths */}
      <BackgroundPaths title="Meet the Champions Behind Champions" buttonLabel="Discover Our Story" onButtonClick={handleHeroButtonClick} />

      {/* Existing About Us Content */}
      <div className="py-16 md:py-24">
        <div className="container">
          <div className="text-center max-w-4xl mx-auto">
            <p className="mt-4 text-lg md:text-xl text-muted-foreground">
              The story of a local legend and the heartbeat of hospitality who came together to build more than just a sports bar—they built a community hub for Hillsboro.
            </p>
          </div>

          <div className="mt-16 grid grid-cols-1 gap-12 items-center">
              <img src="/lovable-uploads/0b56b4f0-9ad3-4e31-b61a-272b24721a8e.png" alt="Michelle and Jared, owners of Champions" className="rounded-lg shadow-xl w-full max-w-3xl mx-auto" />
          </div>

          <div className="mt-24 space-y-16 max-w-4xl mx-auto">
            <div ref={jaredSectionRef} className="animate-fade-in">
              <h2 className="font-serif text-4xl font-semibold mb-2">Jared Bailie</h2>
              <p className="text-primary font-bold text-xl mb-4">Local Legend. Sports Enthusiast. Community Pillar.</p>
              <div className="text-muted-foreground text-lg space-y-4 leading-relaxed">
                  <p>
                      Born and raised in Hillsboro, Jared Bailie is more than just the co-founder of Champions—he is a champion of the community. From his early days on the Reedville baseball fields to graduating from Hillsboro High, Jared's roots run deep in this town.
                  </p>
                  <p>
                      His journey didn't stop there. Jared played collegiate baseball at Mt. Hood Community College and Western Oregon University, chasing the dream with grit and dedication—just like his older brother, who played both collegiate and minor league ball. Today, Jared's love for the game lives on not only through memories but in the lively, sports-driven environment he's helped build.
                  </p>
                  <p>
                      After nearly 20 years with Columbia Distributing, Jared traded in his corporate badge for a dream fulfilled: opening a bar and grill where locals could come together, enjoy great food, and catch the game in good company. Whether he's teeing off on the golf course or cheering on the Trail Blazers, Jared brings that same passion into every detail of Champions.
                  </p>
              </div>
            </div>

            <div className="animate-fade-in" style={{
            animationDelay: '200ms'
          }}>
              <h2 className="font-serif text-4xl font-semibold mb-2">Michelle Wales</h2>
              <p className="text-primary font-bold text-xl mb-4">The Heartbeat of Hospitality</p>
              <div className="text-muted-foreground text-lg space-y-4 leading-relaxed">
                  <p>
                      If Jared is the fire, Michelle is the flame that keeps it burning bright. With years of experience in customer-focused service, Michelle has a gift for making guests feel seen, heard, and appreciated from the moment they walk in. Her warm, welcoming energy defines the soul of Champions, where no one stays a stranger for long.
                  </p>
                  <p>
                    Michelle's standards for hospitality are sky-high—and that's why the atmosphere here feels more like a second home than just another bar. Her leadership behind the scenes ensures that everything runs smoothly, and every guest leaves happier than they came in.
                  </p>
              </div>
            </div>

            <div className="animate-fade-in" style={{
            animationDelay: '400ms'
          }}>
              <h2 className="font-serif text-4xl font-semibold mb-4">A Team with Purpose</h2>
              <div className="text-muted-foreground text-lg space-y-4 leading-relaxed">
                  <p>
                      Jared and Michelle didn't just build a bar—they built a hub for Hillsboro. Champions isn't only about craft cocktails, 20 beers on tap, and weekend brunch (though, let's be honest—those are pretty great). It's about giving back.
                  </p>
                  <p>
                      Over the years, Champions has supported a variety of local causes, from sponsoring Reedville Baseball to pitching in for events like The Ronald McDonald House, Rock'n Rooms, Reclaiming Hope Ranch, and Ladybug Run. But our longest-standing tradition—and one we're proud to continue every year—is partnering with the Hillsboro Elks Lodge, Hillsboro Police Department, and Hillsboro Fire Department to support families in need during the holidays.
                  </p>
                  <p>
                      Through this community-wide effort, volunteers deliver gifts to more than 2,000 homes in the Hillsboro School District—families identified by DHS who could use a little extra help. While younger kids often receive plenty of toys, we focus on the harder-to-shop-for group: teens ages 12–18. Clothing, sports gear, gift cards, and personal care items are just a few ways we help brighten their season.
                  </p>
              </div>
            </div>

            <div className="animate-fade-in bg-secondary/20 p-8 rounded-lg" style={{
            animationDelay: '600ms'
          }}>
                <h2 className="font-serif text-4xl font-semibold mb-4 text-center">What Sets Jared & Michelle Apart</h2>
                <ul className="list-disc list-inside text-muted-foreground text-lg space-y-2 max-w-2xl mx-auto">
                    <li><span className="font-semibold text-foreground">Rooted in Hillsboro:</span> Jared's story is Hillsboro's story—local boy, turned athlete, turned entrepreneur.</li>
                    <li><span className="font-semibold text-foreground">Service That Feels Like Family:</span> Michelle's warmth and leadership make every guest experience unforgettable.</li>
                    <li><span className="font-semibold text-foreground">Champions for the Community:</span> Their name isn't just a brand—it's a promise to show up for the people of Hillsboro, every single day.</li>
                </ul>
            </div>
            
            <blockquote className="animate-fade-in text-center text-2xl md:text-3xl font-serif italic text-foreground border-l-4 border-primary pl-6" style={{
            animationDelay: '800ms'
          }}>
                "You'll come for the 20 beers on tap... but you'll stay for the atmosphere, the energy, and the people behind the bar who make this place feel like home."
            </blockquote>
          </div>

          <div className="mt-24 text-center">
              <h2 className="text-4xl font-serif font-semibold">Locally Sourced. Seasonally Inspired. </h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">Our ingredients shift with the seasons—because the best flavors come from right here, right now. Grown in Northwest soil and crafted in-house, every dish tells the story of where we live and what we stand for.</p>
          </div>
          <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
              <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754712528/Fulton_Farms_w5ntlr.jpg" alt="Fulton Farms - Local farm partnership" className="rounded-lg object-cover aspect-square shadow-md" />
              <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754712529/Vertigo_Brewing_o9aigv.jpg" alt="Vertigo Brewing collaboration" className="rounded-lg object-cover aspect-square shadow-md" />
              <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754712529/blizzard_jxofq3.jpg" alt="Blizzard seasonal offerings" className="rounded-lg object-cover aspect-square shadow-md" />
          </div>
        </div>
      </div>
    </div>;
};
export default AboutUs;