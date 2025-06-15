import React from 'react';

const AboutUs = () => {
  return (
    <div className="bg-background py-16 md:py-24">
      <div className="container">
        <div className="text-center">
          <h1 className="text-4xl md:text-6xl font-bold font-serif">Our Story</h1>
          <p className="mt-4 text-lg md:text-xl text-muted-foreground max-w-3xl mx-auto">
            From lifelong friends to business partners, our dream was to create a place where community, sports, and good food come together.
          </p>
        </div>

        <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div>
            <img 
              src="https://images.unsplash.com/photo-1556742059-4f32c3214555?q=80&w=2070&auto=format&fit=crop"
              alt="Michelle and Jared, owners of Champions"
              className="rounded-lg shadow-xl w-full"
            />
          </div>
          <div>
            <h2 className="font-serif text-4xl font-semibold mb-4">Meet Michelle & Jared</h2>
            <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
              We're Michelle and Jared, and we've been part of this community our whole lives. We grew up watching the big games, celebrating wins, and sharing meals with family and friends. We always dreamed of a place that captured that spirit—a place that felt like home, but with better food and more TVs!
            </p>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Champions is the realization of that dream. It's more than a sports bar; it's a commitment to our hometown. We partner with local farms to bring you a menu that's as fresh as it is delicious. We believe in the power of a shared meal and a cheering crowd. We're so glad you're here to be a part of it.
            </p>
          </div>
        </div>

        <div className="mt-24">
            <div className="text-center">
                <h2 className="text-4xl font-serif font-semibold">Our Community Commitment</h2>
                <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                    We're more than just a sports bar; we're part of the fabric of this town. We believe in giving back to the community that supports us.
                </p>
            </div>
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h3 className="font-serif text-3xl font-semibold mb-4">Sponsoring Local Youth Sports</h3>
                    <p className="text-muted-foreground text-lg mb-4 leading-relaxed">
                        This year, we're proud sponsors of the "Flavor Town Fireballs," our local youth soccer league. We're providing team jerseys and post-game meals, helping kids stay active, build friendships, and learn the value of teamwork.
                    </p>
                    <p className="text-muted-foreground text-lg leading-relaxed">
                        Seeing the kids' faces light up after a game is the real win for us. It's our way of investing in the next generation of champions.
                    </p>
                </div>
                <div>
                     <img 
                      src="https://images.unsplash.com/photo-1517022812141-23620dba5c23?q=80&w=2742&auto=format&fit=crop"
                      alt="A local youth sports team sponsored by Champions"
                      className="rounded-lg shadow-xl w-full"
                    />
                </div>
            </div>
        </div>

        <div className="mt-24 text-center">
            <h2 className="text-4xl font-serif font-semibold">Our Commitment to Farm-to-Table</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-3xl mx-auto">
                We believe great food starts with great ingredients. That's why we're proud to partner with local farmers and purveyors to bring you the freshest flavors of the season.
            </p>
        </div>
         <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            <img src="https://images.unsplash.com/photo-1598170845058-32b9d6a5da37?q=80&w=2070&auto=format&fit=crop" alt="Fresh vegetables" className="rounded-lg object-cover aspect-square shadow-md"/>
            <img src="https://images.unsplash.com/photo-1627992499112-595f9e855b55?q=80&w=2070&auto=format=fit=crop" alt="Local farm" className="rounded-lg object-cover aspect-square shadow-md"/>
            <img src="https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?q=80&w=1981&auto=format=fit=crop" alt="Finished pizza dish" className="rounded-lg object-cover aspect-square shadow-md"/>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;
