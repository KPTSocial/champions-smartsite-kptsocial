import { Crown } from 'lucide-react';

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
          <Crown className="w-6 h-6 text-amber-500" />
          <span>Champ's Staff Favorite</span>
        </div>
        
        <div className="flex items-center gap-2">
          <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754249140/gf_tmnou5.jpg" alt="Gluten Sensitivity Icon" className="w-6 h-6" />
          <span>We will do our best to accommodate gluten sensitivity, but cross-contamination may occur</span>
        </div>
        
        <div className="flex items-center gap-2">
          <img src="https://res.cloudinary.com/de3djsvlk/image/upload/v1754249140/veg_fbwf0q.jpg" alt="Vegetarian Option Icon" className="w-6 h-6" />
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