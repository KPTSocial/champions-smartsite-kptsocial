import React from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  description?: string;
  className?: string;
}

export function PageHeader({ title, description, className }: PageHeaderProps) {
  return (
    <div className={cn("text-center max-w-4xl mx-auto", className)}>
      <h1 className="text-4xl md:text-6xl font-bold font-serif">{title}</h1>
      {description && (
        <p className="mt-4 text-lg md:text-xl text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}