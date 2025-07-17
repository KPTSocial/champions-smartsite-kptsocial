interface DrinksSectionDisclaimerProps {
  categoryDescription?: string;
}

const DrinksSectionDisclaimer = ({ categoryDescription }: DrinksSectionDisclaimerProps) => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      {categoryDescription && (
        <p className="text-muted-foreground mb-4 max-w-2xl">{categoryDescription}</p>
      )}
      <div className="space-y-3 text-sm text-muted-foreground">
        {/* Icon placeholders with text */}
        <div className="flex items-center gap-2">
          <img src="/placeholder-icon-1.png" alt="Staff Favorite Icon" className="w-4 h-4" />
          <span>Champ's Staff Favorite</span>
        </div>
        
        {/* Alcohol-related disclaimers */}
        <p className="mt-4">
          *Must be 21+ with valid ID to consume alcoholic beverages
        </p>
        
        <p>
          Please drink responsibly and designate a driver
        </p>
        
        <p>
          Alcohol content may vary by drink
        </p>
        
        <p>
          Some may contain raw ingredients like egg whites*
        </p>
      </div>
    </div>
  );
};

export default DrinksSectionDisclaimer;