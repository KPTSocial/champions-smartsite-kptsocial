import React from 'react';
const AboutUs = () => {
  return <div className="bg-background py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-serif">Meet the Champions Behind Champions Sports Bar & Grill</h1>
        </div>

        {/* Jared's Story */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img src="/lovable-uploads/0b56b4f0-9ad3-4e31-b61a-272b24721a8e.png" alt="Jared Bailie and Michelle Wales, co-founders of Champions" className="rounded-lg shadow-xl w-full" />
          </div>
          <div>
            <h2 className="font-serif text-4xl font-semibold mb-4">Jared Bailie: Local Legend. Sports Enthusiast. Community Pillar.</h2>
            <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
              Born and raised in Hillsboro, Jared Bailie is more than just the co-founder of Champions—he is a champion of the community. From his early days on the Reedville baseball fields to graduating from Hillsboro High, Jared’s roots run deep in this town.
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              His journey didn’t stop there. Jared played collegiate baseball at Mt. Hood Community College and Western Oregon University, chasing the dream with grit and dedication—just like his older brother, who played both collegiate and minor league ball. Today, Jared’s love for the game lives on not only through memories but in the lively, sports-driven environment he’s helped build.
            </p>
            <p className="text-muted-foreground text-lg mt-4 leading-relaxed">
              After nearly 20 years with Columbia Distributing, Jared traded in his corporate badge for a dream fulfilled: opening a bar and grill where locals could come together, enjoy great food, and catch the game in good company. Whether he’s teeing off on the golf course or cheering on the Trail Blazers, Jared brings that same passion into every detail of Champions.
            </p>
          </div>
        </div>

        {/* Michelle's Story */}
        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div className="md:order-2">
                
            </div>
            <div className="md:order-1">
                <h2 className="font-serif text-4xl font-semibold mb-4">Michelle Wales: The Heartbeat of Hospitality</h2>
                <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                    If Jared is the fire, Michelle is the flame that keeps it burning bright. With years of experience in customer-focused service, Michelle has a gift for making guests feel seen, heard, and appreciated from the moment they walk in. Her warm, welcoming energy defines the soul of Champions, where no one stays a stranger for long.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    Michelle’s standards for hospitality are sky-high—and that’s why the atmosphere here feels more like a second home than just another bar. Her leadership behind the scenes ensures that everything runs smoothly, and every guest leaves happier than they came in.
                </p>
            </div>
        </div>

        {/* A Team with a Purpose */}
        <div className="mt-24">
            <div className="text-center">
                <h2 className="text-4xl font-serif font-semibold">A Team with Purpose</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    Jared and Michelle didn’t just build a bar—they built a hub for Hillsboro.
                </p>
            </div>
            <div className="mt-12 text-center max-w-4xl mx-auto">
                 <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                    Champions isn’t just about craft cocktails, 20 beers on tap, and weekend brunch (although let’s be honest—those are all pretty great). It’s about giving back. From sponsoring Reedville Baseball to supporting The Ronald McDonald House, Rock’n Rooms, Reclaiming Hope Ranch, and Ladybug Run, they’ve made giving part of their mission.
                </p>
                <p className="text-muted-foreground text-lg leading-relaxed">
                    They’ve even partnered with the Hillsboro Elks Lodge to support local families in need, especially during the holidays—because building community isn’t a seasonal thing, it’s a way of life.
                </p>
            </div>
        </div>

        {/* What sets them apart */}
        <div className="mt-24 bg-card p-8 md:p-12 rounded-lg shadow-lg">
             <div className="text-center">
                <h2 className="text-4xl font-serif font-semibold mb-8">What Sets Jared & Michelle Apart</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
                <div>
                    <h3 className="text-2xl font-semibold font-serif mb-2">Rooted in Hillsboro</h3>
                    <p className="text-muted-foreground">Jared’s story is Hillsboro’s story—local boy, turned athlete, turned entrepreneur.</p>
                </div>
                 <div>
                    <h3 className="text-2xl font-semibold font-serif mb-2">Service That Feels Like Family</h3>
                    <p className="text-muted-foreground">Michelle’s warmth and leadership make every guest experience unforgettable.</p>
                </div>
                 <div>
                    <h3 className="text-2xl font-semibold font-serif mb-2">Champions for the Community</h3>
                    <p className="text-muted-foreground">Their name isn’t just a brand—it’s a promise to show up for the people of Hillsboro, every single day.</p>
                </div>
            </div>
        </div>

        {/* Final Quote */}
        <div className="mt-24 text-center">
           <blockquote className="text-2xl md:text-3xl font-serif text-primary italic max-w-4xl mx-auto">
            “You’ll come for the 20 beers on tap... but you’ll stay for the atmosphere, the energy, and the people behind the bar who make this place feel like home.”
           </blockquote>
        </div>

      </div>
    </div>;
};
export default AboutUs;