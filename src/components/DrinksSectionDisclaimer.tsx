import { Crown } from 'lucide-react';

interface DrinksSectionDisclaimerProps {
  categoryDescription?: string;
}
const DrinksSectionDisclaimer = ({
  categoryDescription
}: DrinksSectionDisclaimerProps) => {
  return <div className="mt-8 pt-6 border-t border-border">
      {categoryDescription && <p className="text-muted-foreground mb-4 max-w-2xl">{categoryDescription}</p>}
      <div className="space-y-3 text-sm text-muted-foreground">
        {/* Icon placeholders with text */}
        <div className="flex items-center gap-2">
          <Crown className="w-6 h-6 text-amber-500" />
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
        
        <p>*Consuming raw or undercooked eggs may increase your risk of
foodborne illness, especially if you have certain medical
conditions.</p>
      </div>
    </div>;
};
export default DrinksSectionDisclaimer;