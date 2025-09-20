import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useHeaderMedia } from "@/hooks/useHeaderMedia";
import { useHomepageContent } from "@/hooks/useHomepageContent";
import VideoHeader from "@/components/VideoHeader";
import SpotOnLoyaltyWidget from "@/components/loyalty/SpotOnLoyaltyWidget";
const Index = () => {
  const {
    data: headerMedia,
    isLoading: isHeaderLoading,
    error
  } = useHeaderMedia();

  const {
    data: homepageContent,
    isLoading: isContentLoading,
    error: contentError
  } = useHomepageContent();

  // Debug logging to track data loading
  console.log('Header media data:', headerMedia);
  console.log('Is loading:', isHeaderLoading);
  console.log('Error:', error);
  return <div>
      {/* Hero Section */}
      <section className="relative h-[60vh] md:h-[80vh] w-full flex items-center justify-center text-center text-white">
        <div className="absolute inset-0 bg-black/50 z-10"></div>
        
        {/* Video or clean background */}
        {isHeaderLoading ? <div className="absolute inset-0 w-full h-full bg-gray-900 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div> : headerMedia && headerMedia.video_url ? <VideoHeader videoUrl={headerMedia.video_url} title={headerMedia.title} description={headerMedia.description} /> : <div className="absolute inset-0 w-full h-full bg-gray-900" />}
        
        <div className="relative z-20 container px-4">
          <h1 className="font-serif text-4xl md:text-6xl lg:text-7xl font-bold drop-shadow-lg">
            Hillsboro's Sports & Flavor Hub
          </h1>
          <p className="mt-4 text-lg md:text-xl max-w-3xl mx-auto drop-shadow-md">Experience the thrill of the game and the taste of locally-sourced, PNW cuisine. Welcome to your new favorite spot.</p>
          <div className="mt-8 flex flex-col sm:flex-row justify-center gap-4 max-w-md mx-auto">
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/menu">View The Menu</Link>
            </Button>
            <Button asChild size="lg" variant="secondary">
              <a href="https://championssportbar.shop.securetree.com/" target="_blank" rel="noopener noreferrer">
                Gift Cards
              </a>
            </Button>
            <Button asChild size="lg" className="bg-primary hover:bg-primary/90 text-primary-foreground">
              <Link to="/reservations">Reservations</Link>
            </Button>
          </div>
          <p className="mt-6 text-white text-xl md:text-2xl text-center drop-shadow-md">
            <a href="tel:5037476063" className="hover:underline">(503) 747-6063</a>
          </p>
          
          {/* Loyalty Widget - Desktop Only */}
          <div className="hidden lg:block mt-12">
            <SpotOnLoyaltyWidget variant="hero" className="mx-auto max-w-[250px]" />
          </div>
        </div>
      </section>

      <section className="py-16 md:py-24 bg-background">
        <div className="container px-4">
          <div className="text-center">
            <h2 className="text-4xl md:text-5xl font-bold font-serif">A Bar for Champions</h2>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We're more than just a sports bar. We're a community hub with a passion for fresh ingredients and unforgettable moments.
            </p>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-8">
            {isContentLoading ? (
              <div className="col-span-full flex justify-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
              </div>
            ) : contentError ? (
              <div className="col-span-full text-center py-8 text-muted-foreground">
                Failed to load content. Please try again later.
              </div>
            ) : (
              homepageContent?.map((content) => (
                content.section_name === 'qr_codes' ? (
                  <div key={content.id} className="text-center p-6 border border-border rounded-lg bg-card shadow-sm flex flex-col">
                    <h3 className="text-2xl md:text-3xl font-serif font-semibold mb-2">{content.title}</h3>
                    <p className="mt-2 text-muted-foreground mb-4">Scan OR Press QR code for draft and bottle list.</p>
                    <div className="w-full flex-1 flex flex-col justify-center">
                      <div className="grid grid-cols-2 gap-4 md:flex md:gap-8 justify-center items-start">
                        {/* Draft List QR */}
                        <a href="https://fbpage.digitalpour.com/?companyID=663a232d942c522daf15cf69&locationID=1&templateID=663cfa6bdc2d350eefe0d630" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                          <img src="/lovable-uploads/4169d955-5253-4d18-9d98-1718628bc80e.png" alt="Scan me for draft list" className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-md border border-border transition-transform group-hover:scale-105" />
                          <span className="mt-2 font-medium text-sm md:text-base">Draft List</span>
                        </a>
                        {/* Bottle List QR */}
                        <a href="https://fbpage.digitalpour.com/?companyID=663a232d942c522daf15cf69&locationID=1&templateID=663cfa8fbf432ea8ea0ba1bb" target="_blank" rel="noopener noreferrer" className="flex flex-col items-center group">
                          <img src="/lovable-uploads/ec5bd889-11fa-4a28-bc26-43be4d716800.png" alt="Scan me for bottle list" className="w-32 h-32 sm:w-40 sm:h-40 object-contain rounded-md border border-border transition-transform group-hover:scale-105" />
                          <span className="mt-2 font-medium text-sm md:text-base">Bottle List</span>
                        </a>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div key={content.id} className="text-center p-6 border border-border rounded-lg bg-card shadow-sm">
                    {content.image_url && (
                      <img 
                        src={content.image_url} 
                        className="w-full h-48 object-cover rounded-md mb-4" 
                        alt={content.alt_text || content.title} 
                      />
                    )}
                    <h3 className="text-2xl font-serif font-semibold">
                      {content.title === "Scratch-Made Goodness" ? "Seasonally Inspired Flavors" : content.title}
                    </h3>
                    <p className="mt-2 text-muted-foreground">
                      {content.title === "Scratch-Made Goodness" ? "Fresh, seasonal ingredients and bold flavors—curated in-house and crafted with care, no matter the season." : content.description}
                    </p>
                  </div>
                )
              ))
            )}
          </div>
        </div>
      </section>
    </div>;
};
export default Index;