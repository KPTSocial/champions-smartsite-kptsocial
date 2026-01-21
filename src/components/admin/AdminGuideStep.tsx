import React from 'react';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AdminGuideStepProps {
  title: string;
  subtitle?: string;
  keyPoints?: string[];
  icon: LucideIcon;
  children?: React.ReactNode;
}

const AdminGuideStep: React.FC<AdminGuideStepProps> = ({
  title,
  subtitle,
  keyPoints,
  icon: Icon,
  children,
}) => {
  return (
    <div className="flex flex-col items-center text-center space-y-6 py-4">
      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
        <Icon className="h-8 w-8 text-primary" />
      </div>
      
      <div className="space-y-2">
        <h2 className="text-2xl md:text-3xl font-bold text-foreground">{title}</h2>
        {subtitle && (
          <p className="text-muted-foreground max-w-md mx-auto">{subtitle}</p>
        )}
      </div>

      {keyPoints && keyPoints.length > 0 && (
        <Card className="w-full max-w-lg">
          <CardContent className="pt-6">
            <ul className="space-y-3 text-left">
              {keyPoints.map((point, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-primary mt-0.5">✓</span>
                  <span className="text-foreground">{point}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {children}
    </div>
  );
};

export default AdminGuideStep;
