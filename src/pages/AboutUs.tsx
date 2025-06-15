
import React from 'react';
import { Separator } from "@/components/ui/separator";

const AboutUs = () => {
  return (
    <div className="bg-background">
      <style>
        {`
          .fade-in-section {
            opacity: 0;
          }
        `}
      </style>
      {/* Hero */}
      <section className="py-16 md:py-24">
        <div className="container text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-serif animate-fade-in fade-in-section">
            Meet the Champions Behind Champions Sports Bar & Grill
          </h1>
        </div>
      </section>

      {/* Jared's Story */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container max-w-4xl mx-auto text-center animate-fade-in fade-in-section" style={{ animationDelay: '200ms' }}>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-6">Jared Bailie: Local Legend. Sports Enthusiast. Community Pillar.</h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              Born and raised in Hillsboro, Jared Bailie is more than just the co-founder of Champions—he is a champion of the community. From his early days on the Reedville baseball fields to graduating from Hillsboro High, Jared’s roots run deep in this town.
            </p>
            <p>
              His journey didn’t stop there. Jared played collegiate baseball at Mt. Hood Community College and Western Oregon University, chasing the dream with grit and dedication—just like his older brother, who played both collegiate and minor league ball. Today, his love for the game lives on not only through memories but in the lively, sports-driven environment he’s helped build.
            </p>
            <p>
              After nearly 20 years with Columbia Distributing, Jared traded in his corporate badge for a dream fulfilled: opening a bar and grill where locals could come together, enjoy great food, and catch the game in good company. Whether he’s teeing off on the golf course or cheering on the Trail Blazers, Jared brings that same passion into every detail of Champions.
            </p>
          </div>
        </div>
      </section>

      {/* Michelle's Story */}
      <section className="py-16 md:py-24">
        <div className="container max-w-4xl mx-auto text-center animate-fade-in fade-in-section" style={{ animationDelay: '400ms' }}>
          <h2 className="font-serif text-3xl md:text-5xl font-semibold mb-6">Michelle Wales: The Heartbeat of Hospitality</h2>
          <div className="space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              If Jared is the fire, Michelle is the flame that keeps it burning bright. With years of experience in customer-focused service, Michelle has a gift for making guests feel seen, heard, and appreciated from the moment they walk in. Her warm, welcoming energy defines the soul of Champions, where no one stays a stranger for long.
            </p>
            <p>
              Michelle’s standards for hospitality are sky-high—and that’s why the atmosphere here feels more like a second home than just another bar. Her leadership behind the scenes ensures that everything runs smoothly, and every guest leaves happier than they came in.
            </p>
          </div>
        </div>
      </section>

      <div className="container">
        <Separator className="my-8" />
      </div>

      {/* A Team with a Purpose */}
      <section className="py-16 md:py-24">
        <div className="container text-center animate-fade-in fade-in-section" style={{ animationDelay: '600ms' }}>
          <h2 className="text-3xl md:text-5xl font-serif font-semibold">A Team with Purpose</h2>
          <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
            Jared and Michelle didn’t just build a bar—they built a hub for Hillsboro.
          </p>
          <div className="mt-12 max-w-4xl mx-auto space-y-4 text-muted-foreground text-lg leading-relaxed">
            <p>
              Champions isn’t just about craft cocktails, 20 beers on tap, and weekend brunch (although let’s be honest—those are all pretty great). It’s about giving back. From sponsoring Reedville Baseball to supporting The Ronald McDonald House, Rock’n Rooms, Reclaiming Hope Ranch, and Ladybug Run, they’ve made giving part of their mission.
            </p>
            <p>
              They’ve even partnered with the Hillsboro Elks Lodge to support local families in need, especially during the holidays—because building community isn’t a seasonal thing, it’s a way of life.
            </p>
          </div>
        </div>
      </section>

      {/* What sets them apart */}
      <section className="py-16 md:py-24 bg-card">
        <div className="container animate-fade-in fade-in-section" style={{ animationDelay: '800ms' }}>
          <div className="text-center">
            <h2 className="text-3xl md:text-5xl font-serif font-semibold mb-12">What Sets Jared & Michelle Apart</h2>
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
      </section>

      {/* Final Quote */}
      <section className="py-16 md:py-24 bg-primary text-primary-foreground">
        <div className="container text-center animate-fade-in fade-in-section" style={{ animationDelay: '1000ms' }}>
          <blockquote className="text-2xl md:text-3xl font-serif italic max-w-4xl mx-auto">
            “You’ll come for the 20 beers on tap... but you’ll stay for the atmosphere, the energy, and the people behind the bar who make this place feel like home.”
          </blockquote>
        </div>
      </section>
    </div>
  );
};

export default AboutUs;
