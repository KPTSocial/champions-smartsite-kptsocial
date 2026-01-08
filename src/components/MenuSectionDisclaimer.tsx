import { Crown, Wheat, Leaf } from 'lucide-react';

const MenuSectionDisclaimer = () => {
  return (
    <div className="mt-8 pt-6 border-t border-border">
      <div className="space-y-3 text-sm text-muted-foreground">
        {/* Icon placeholders with text */}
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-500" />
          <span>Champ's Staff Favorite</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Wheat className="w-6 h-6 text-amber-600" />
          <span>We will do our best to accommodate gluten sensitivity, but cross-contamination may occur</span>
        </div>
        
        <div className="flex items-center gap-2">
          <Leaf className="w-6 h-6 text-green-600" />
          <span>Vegetarian Option</span>
        </div>
        
        {/* Text-only disclaimers */}
        <p className="mt-4">
          *Consuming raw or undercooked meats or eggs may increase your risk of foodborne illness.
        </p>
        
        <p>
          Plates are served with a complimentary dipping sauce — any additional house-made sauce is $0.25
        </p>
      </div>
    </div>
  );
};

export default MenuSectionDisclaimer;