import { motion } from 'framer-motion';
import { 
  LayoutGrid, 
  Laptop, 
  Shirt, 
  Home, 
  Mountain,
  ChevronRight
} from 'lucide-react';
import type { CategoryFilterProps } from '../types/product';

// Icon mapping based on category name
const getCategoryIcon = (categoryName: string) => {
  const name = categoryName.toLowerCase();
  if (name.includes('electronics')) return Laptop;
  if (name.includes('clothing')) return Shirt;
  if (name.includes('home')) return Home;
  if (name.includes('outdoor')) return Mountain;
  return LayoutGrid;
};

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
  categories,
  isLoading = false,
  disabled = false,
}: CategoryFilterProps) {
  if (isLoading) {
    return (
      <div className="flex flex-col gap-2 w-full animate-pulse px-2">
        <div className="h-3 w-16 bg-slate-200 rounded mb-4" />
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 py-2 px-3">
            <div className="w-8 h-8 bg-slate-200 rounded-lg" />
            <div className="h-4 flex-1 bg-slate-200 rounded" />
          </div>
        ))}
      </div>
    );
  }

  // Prepend "All" category if not already present
  const allCategories = [{ value: '', label: 'All Categories' }, ...categories.map(cat => ({
    value: cat.toLowerCase(),
    label: cat
  }))];

  return (
    <nav
      className="flex flex-col gap-1 w-full"
      aria-label="Category filtration"
    >
      <div className="px-3 mb-2 hidden lg:block">
        <h2 className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">
          Categories
        </h2>
      </div>

      {allCategories.map((cat) => {
        const isActive = activeCategory === cat.value;
        const Icon = getCategoryIcon(cat.label);

        return (
          <button
            key={cat.value}
            className={`group relative flex items-center gap-3 px-4 py-3 rounded-xl text-[0.9rem] font-medium transition-all duration-200 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isActive
                ? 'text-blue-600 bg-blue-50/50'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-50'
              }`}
            onClick={() => onCategoryChange(cat.value)}
            disabled={disabled}
            aria-selected={isActive}
            aria-label={`Filter by ${cat.label}`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors ${
              isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'
            }`}>
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            <span className="flex-1 text-left">{cat.label}</span>

            <ChevronRight 
              size={14} 
              className={`transition-all duration-200 ${
                isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
              }`} 
            />

            {isActive && (
              <motion.div
                layoutId="activeIndicator"
                className="absolute left-0 w-1 h-6 bg-blue-600 rounded-r-full"
                transition={{ type: "spring", stiffness: 300, damping: 30 }}
              />
            )}
          </button>
        );
      })}
    </nav>
  );
}
