import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  Sparkles, 
  Menu as MenuIcon, 
  Calendar, 
  ImageIcon,
  PartyPopper,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import AdminGuideStep from './AdminGuideStep';
import AdminGuideQuickReference from './AdminGuideQuickReference';

const AdminGuide: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const navigate = useNavigate();
  const totalSteps = 5;

  const goToNext = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
    }
  };

  const goToPrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const goToDashboard = () => {
    navigate('/admin/menu');
  };

  const skipToEnd = () => {
    setCurrentStep(totalSteps);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <AdminGuideStep
            icon={Sparkles}
            title="Welcome to Your Champions Command Center"
            subtitle="Everything you need to manage your website — menus, events, and customer feedback — all in one place. This quick tour takes about 2 minutes."
          />
        );
      
      case 2:
        return (
          <AdminGuideStep
            icon={MenuIcon}
            title="Update Your Menu in Seconds"
            subtitle="Keep your menu fresh and up-to-date with easy editing tools."
            keyPoints={[
              'Upload monthly specials with one image',
              'Edit prices, descriptions, and availability instantly',
              'Hide items temporarily without deleting them',
              'Drag and drop to reorder menu items and categories',
            ]}
          />
        );
      
      case 3:
        return (
          <AdminGuideStep
            icon={Calendar}
            title="Never Miss an Event"
            subtitle="Manage all your events from one central location."
            keyPoints={[
              'All major sports schedules pre-loaded (Timbers, Blazers, World Cup)',
              'Create trivia nights, live music, and special promotions',
              'Publish events immediately or save as drafts',
              'Feature events prominently on your homepage',
            ]}
          />
        );
      
      case 4:
        return (
          <AdminGuideStep
            icon={ImageIcon}
            title="Control Your Homepage Features"
            subtitle="Customize the seasonal event cards that appear on your homepage."
            keyPoints={[
              'Toggle Winter Olympics, Sunday Breakfast, and World Cup cards on/off',
              'Hide cards until you\'re ready to promote them',
              'Add custom event cards with your own images and descriptions',
              'Reorder cards to prioritize what matters most',
            ]}
          />
        );
      
      case 5:
        return (
          <div className="flex flex-col items-center text-center space-y-6 py-4">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <PartyPopper className="h-8 w-8 text-primary" />
            </div>
            <div className="space-y-2">
              <h2 className="text-2xl md:text-3xl font-bold text-foreground">You're All Set!</h2>
              <p className="text-muted-foreground max-w-md mx-auto">
                You now know the essentials. Here's a quick reference for the most common tasks.
              </p>
            </div>
            <AdminGuideQuickReference />
          </div>
        );
      
      default:
        return null;
    }
  };

  return (
    <div className="max-w-3xl mx-auto">
      {/* Progress Header */}
      <div className="mb-8 space-y-4">
        <div className="flex items-center justify-between text-sm text-muted-foreground">
          <span>Step {currentStep} of {totalSteps}</span>
          {currentStep < totalSteps && (
            <button
              onClick={skipToEnd}
              className="text-primary hover:underline"
            >
              Skip to End
            </button>
          )}
        </div>
        <Progress value={(currentStep / totalSteps) * 100} className="h-2" />
        
        {/* Step Indicators */}
        <div className="flex justify-center gap-2">
          {Array.from({ length: totalSteps }, (_, i) => i + 1).map((step) => (
            <button
              key={step}
              onClick={() => setCurrentStep(step)}
              className={`w-3 h-3 rounded-full transition-colors ${
                step === currentStep
                  ? 'bg-primary'
                  : step < currentStep
                  ? 'bg-primary/50'
                  : 'bg-muted'
              }`}
              aria-label={`Go to step ${step}`}
            />
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="min-h-[400px] flex items-center justify-center">
        {renderStepContent()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between mt-8 pt-6 border-t">
        <Button
          variant="outline"
          onClick={goToPrevious}
          disabled={currentStep === 1}
          className="gap-2"
        >
          <ChevronLeft className="h-4 w-4" />
          Previous
        </Button>

        {currentStep < totalSteps ? (
          <Button onClick={goToNext} className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={goToDashboard} className="gap-2">
            Go to Dashboard
            <ChevronRight className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default AdminGuide;
