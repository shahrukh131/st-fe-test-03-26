import { motion, AnimatePresence } from 'framer-motion';
import { 
  LayoutGrid, 
  Laptop, 
  Shirt, 
  Home, 
  Mountain,
  ChevronRight,
  X
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
  activeCategories,
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
      className="flex flex-col gap-1 w-full relative"
      aria-label="Category filtration"
    >
      <AnimatePresence>
        {activeCategories.length > 0 && (
          <motion.div
            initial={{ opacity: 0, height: 0, marginBottom: 0 }}
            animate={{ opacity: 1, height: 'auto', marginBottom: 24 }}
            exit={{ opacity: 0, height: 0, marginBottom: 0 }}
            className="px-3 overflow-hidden border-b border-slate-100/60 pb-5"
          >
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">
                Applied Filters
              </h2>
              {activeCategories.length > 1 && (
                <button
                  onClick={() => onCategoryChange('')}
                  className="text-[0.7rem] font-bold uppercase text-slate-400 hover:text-slate-900 transition-colors"
                >
                  Clear All
                </button>
              )}
            </div>
            <div className="flex flex-wrap gap-2">
              {activeCategories.map(cat => (
                <button
                  key={`tag-${cat}`}
                  onClick={() => onCategoryChange(cat)}
                  className="group inline-flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 text-slate-600 hover:bg-slate-200 hover:text-slate-900 text-[0.8rem] font-medium rounded-lg border border-slate-200 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2"
                  aria-label={`Remove ${cat} filter`}
                >
                  <span className="capitalize">{cat}</span>
                  <X size={14} className="text-slate-400 group-hover:text-slate-700 transition-colors" />
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="px-3 mt-1 mb-2 hidden lg:block">
        <h2 className="text-[0.7rem] font-bold uppercase tracking-wider text-slate-400">
          Categories
        </h2>
      </div>

      {allCategories.map((cat) => {
        const isActive = cat.value === '' 
          ? activeCategories.length === 0 
          : activeCategories.includes(cat.value);
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
            aria-checked={isActive}
            role="checkbox"
            aria-label={`Filter by ${cat.label}`}
          >
            <div className={`flex items-center justify-center w-8 h-8 rounded-lg transition-colors shrink-0 ${
              isActive ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-400 group-hover:text-slate-600'
            }`}>
              <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
            </div>

            <span className="flex-1 text-left truncate">{cat.label}</span>

            {cat.value !== '' && (
              <div className={`w-4 h-4 border rounded transition-all duration-200 flex items-center justify-center ${
                isActive ? 'bg-blue-600 border-blue-600' : 'border-slate-300'
              }`}>
                {isActive && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="w-1.5 h-1.5 bg-white rounded-full"
                  />
                )}
              </div>
            )}

            {cat.value === '' && (
              <ChevronRight 
                size={14} 
                className={`transition-all duration-200 ${
                  isActive ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-2'
                }`} 
              />
            )}

            {isActive && cat.value === '' && (
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
