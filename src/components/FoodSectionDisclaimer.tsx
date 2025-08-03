interface FoodSectionDisclaimerProps {
  categoryDescription?: string;
}
const FoodSectionDisclaimer = ({
  categoryDescription
}: FoodSectionDisclaimerProps) => {
  return <div className="mt-8 pt-6 border-t border-border">
      {categoryDescription && <p className="text-muted-foreground mb-4 max-w-2xl">{categoryDescription}</p>}
      <div className="space-y-3 text-sm text-muted-foreground">
        {/* Icon placeholders with text */}
        <div className="flex items-center gap-2">
          <img src="/placeholder-icon-1.png" alt="Staff Favorite Icon" className="w-4 h-4" />
          <span>Champ's Staff Favorite</span>
        </div>
        
        <div className="flex items-center gap-2">
          <img src="/placeholder-icon-2.png" alt="Gluten Sensitivity Icon" className="w-4 h-4" />
          <span>We will do our best to accommodate gluten sensitivity, but cross-contamination may occur</span>
        </div>
        
        <div className="flex items-center gap-2">
          <img src="/placeholder-icon-3.png" alt="Vegetarian Option Icon" className="w-4 h-4" />
          <span>Vegetarian Option</span>
        </div>
        
        {/* Text-only disclaimers */}
        <p className="mt-4">
          *Consuming raw or undercooked meats or eggs may increase your risk of foodborne illness.
        </p>
        
        
      </div>
    </div>;
};
export default FoodSectionDisclaimer;