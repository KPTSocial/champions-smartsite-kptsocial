
import { MenuCategory } from '@/types/menu';
import MenuItemCard from './MenuItemCard';
import MenuSectionDisclaimer from './MenuSectionDisclaimer';

const MenuCategorySection = ({ category }: { category: MenuCategory }) => {
  if (!category.items || category.items.length === 0) {
    return null;
  }

  return (
    <section id={category.name.toLowerCase().replace(/\s+/g, '-')} className="scroll-mt-28">
      <h3 className="text-3xl font-serif font-bold mb-2 text-secondary">{category.name}</h3>
      {category.description && <p className="text-muted-foreground mb-8 max-w-2xl">{category.description}</p>}
      <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
        {category.items.map(item => (
          <MenuItemCard key={item.id} item={item} />
        ))}
      </div>
      <MenuSectionDisclaimer />
    </section>
  );
};

export default MenuCategorySection;
