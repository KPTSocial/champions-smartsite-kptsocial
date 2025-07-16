import React, { useState, useRef, useEffect } from 'react';
import { MenuSection } from '@/types/menu';
import { cn } from '@/lib/utils';

interface EnhancedMenuTabsProps {
  sections: MenuSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const EnhancedMenuTabs: React.FC<EnhancedMenuTabsProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  const [highlightStyle, setHighlightStyle] = useState<React.CSSProperties>({});
  const tabsRef = useRef<HTMLDivElement>(null);
  const activeTabRef = useRef<HTMLButtonElement>(null);

  const updateHighlight = () => {
    if (activeTabRef.current && tabsRef.current) {
      // Use offsetLeft/offsetTop for more reliable positioning
      const tabElement = activeTabRef.current;
      const containerElement = tabsRef.current;
      
      // Calculate position relative to container
      let left = tabElement.offsetLeft;
      let parent = tabElement.offsetParent;
      
      // Walk up the DOM tree to find the relative position to the container
      while (parent && parent !== containerElement) {
        left += (parent as HTMLElement).offsetLeft;
        parent = (parent as HTMLElement).offsetParent;
      }
      
      setHighlightStyle({
        width: `${tabElement.offsetWidth}px`,
        height: `${tabElement.offsetHeight}px`,
        transform: `translateX(${left}px)`,
      });
    }
  };

  useEffect(() => {
    updateHighlight();
  }, [activeSection]);

  useEffect(() => {
    const handleResize = () => updateHighlight();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <nav ref={tabsRef} className="relative flex flex-wrap gap-3 w-fit mx-auto mb-12">
      {/* Moving highlight */}
      <span
        className="absolute bg-primary rounded-full transition-all duration-300 ease-out -z-10"
        style={highlightStyle}
      />
      
      {sections.map((section) => (
        <button
          key={section.id}
          ref={activeSection === section.id ? activeTabRef : null}
          onClick={() => onSectionChange(section.id)}
          className={cn(
            "relative px-6 py-3 font-semibold transition-colors duration-200 rounded-full",
            activeSection === section.id
              ? "text-primary-foreground"
              : "text-secondary hover:text-primary"
          )}
        >
          {section.name}
        </button>
      ))}
    </nav>
  );
};

export default EnhancedMenuTabs;