import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MenuSection } from '@/types/menu';

interface MobileMenuSectionDropdownProps {
  sections: MenuSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
}

const MobileMenuSectionDropdown: React.FC<MobileMenuSectionDropdownProps> = ({
  sections,
  activeSection,
  onSectionChange,
}) => {
  const activeSectionName = sections.find(s => s.id === activeSection)?.name || '';

  return (
    <div className="mb-6">
      <label className="text-sm font-medium text-muted-foreground mb-2 block">Menu Section</label>
      <Select value={activeSection} onValueChange={onSectionChange}>
        <SelectTrigger className="h-14 text-lg font-medium bg-card border-2 hover:border-primary/20 transition-colors">
          <SelectValue placeholder="Choose Menu Section" />
        </SelectTrigger>
        <SelectContent className="bg-card border-2 z-50">
          {sections.map((section) => (
            <SelectItem key={section.id} value={section.id} className="h-14 text-lg">
              {section.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default MobileMenuSectionDropdown;