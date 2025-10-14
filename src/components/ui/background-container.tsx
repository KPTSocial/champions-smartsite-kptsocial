import React from 'react';
import { cn } from '@/lib/utils';

interface BackgroundContainerProps {
  children: React.ReactNode;
  backgroundImage: string;
  className?: string;
  grayscale?: boolean;
  overlayOpacity?: number;
}

export function BackgroundContainer({
  children,
  backgroundImage,
  className,
  grayscale = false,
  overlayOpacity = 0.4,
}: BackgroundContainerProps) {
  return (
    <div 
      className={cn("relative min-h-screen", className)}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        backgroundAttachment: 'fixed',
        filter: grayscale ? 'grayscale(10%)' : undefined,
      }}
    >
      <div 
        className="absolute inset-0 backdrop-blur-sm" 
        style={{ backgroundColor: `hsl(var(--background) / ${overlayOpacity})` }}
      />
      <div className="container relative z-10">
        {children}
      </div>
    </div>
  );
}