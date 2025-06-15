import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1555939594-58d7cb561ad1?q=80&w=3000&auto=format&fit=crop"
          alt="Delicious food platter"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="relative z-20 container px-4">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
            Where Great Sports & Great Food Meet
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto drop-shadow-md">
            Experience the thrill of the game and the taste of locally-sourced, farm-to-table cuisine. Welcome to your new favorite spot.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/menu">View The Menu</Link>
            </Button>
            <Button size="lg" variant="secondary">
              Book a Table
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-serif">A Bar for Champions</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We're more than just a sports bar. We're a community hub with a passion for fresh ingredients and unforgettable moments.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Card 1: Farm-to-Table */}
            <div className="text-center p-6 border border-border rounded-lg bg-card shadow-sm">
              <img src="https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=2070&auto=format&fit=crop" className="w-full h-48 object-cover rounded-md mb-4" alt="Farm to table salad"/>
              <h3 className="text-2xl font-serif font-semibold">Farm-to-Table</h3>
              <p className="mt-2 text-muted-foreground">Savor the difference with fresh, locally-sourced ingredients in every dish.</p>
            </div>
            {/* Card 2: Every Game, Every Screen */}
            <div className="text-center p-6 border border-border rounded-lg bg-card shadow-sm">
              <img src="https://images.unsplash.com/photo-1628009628373-a6f90e487d1a?q=80&w=2070&auto=format&fit=crop" className="w-full h-48 object-cover rounded-md mb-4" alt="Big screen TVs"/>
              <h3 className="text-2xl font-serif font-semibold">Every Game, Every Screen</h3>
              <p className="mt-2 text-muted-foreground">With dozens of HD screens, you won't miss a second of the action.</p>
            </div>
            {/* Card 3: QR Code Card */}
            <div className="text-center p-6 border border-border rounded-lg bg-card shadow-sm flex flex-col">
              <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-2">Scan for Our Lists</h3>
              <p className="mt-2 text-muted-foreground mb-4">Scan the QR code for bottle or draft list.</p>
              <div className="w-full flex-1 flex flex-col justify-center">
                <div className="grid grid-cols-2 gap-4 md:flex md:gap-8 justify-center items-start">
                  {/* Bottle List QR */}
                  <a
                    href="https://fbpage.digitalpour.com/?companyID=663a232d942c522daf15cf69&locationID=1&templateID=663cfa8fbf432ea8ea0ba1bb"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group"
                  >
                    <img
                      src="/lovable-uploads/ec5bd889-11fa-4a28-bc26-43be4d716800.png"
                      alt="Scan me for bottle list"
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-md border border-border transition-transform group-hover:scale-105"
                    />
                    <span className="mt-2 font-medium text-sm md:text-base">Bottle List</span>
                  </a>
                  {/* Draft List QR */}
                  <a
                    href="https://fbpage.digitalpour.com/?companyID=663a232d942c522daf15cf69&locationID=1&templateID=663cfa6bdc2d350eefe0d630"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex flex-col items-center group"
                  >
                    <img
                      src="/lovable-uploads/4169d955-5253-4d18-9d98-1718628bc80e.png"
                      alt="Scan me for draft list"
                      className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-md border border-border transition-transform group-hover:scale-105"
                    />
                    <span className="mt-2 font-medium text-sm md:text-base">Draft List</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;
