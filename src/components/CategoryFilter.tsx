import { motion } from 'framer-motion';
import type { CategoryFilterProps } from '../types/product';

const CATEGORIES = [
  { value: '', label: 'All' },
  { value: 'electronics', label: 'Electronics' },
  { value: 'clothing', label: 'Clothing' },
  { value: 'home', label: 'Home' },
  { value: 'outdoors', label: 'Outdoors' },
];

export function CategoryFilter({
  activeCategory,
  onCategoryChange,
  disabled = false,
}: CategoryFilterProps) {
  return (
    <div
      className="flex gap-2 flex-wrap"
      role="tablist"
      aria-label="Filter by category"
    >
      {CATEGORIES.map((cat) => {
        const isActive = activeCategory === cat.value;

        return (
          <button
            key={cat.value}
            className={`relative px-[1.1rem] py-2 rounded-full text-[0.85rem] font-medium border whitespace-nowrap transition-colors duration-200 focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 disabled:opacity-50 disabled:cursor-not-allowed ${isActive
                ? 'text-white border-transparent'
                : 'border-black/[0.08] bg-white/60 text-slate-500 hover:border-black/[0.15] hover:text-slate-900'
              }`}
            onClick={() => onCategoryChange(cat.value)}
            disabled={disabled}
            role="tab"
            aria-selected={isActive}
            aria-label={`Filter by ${cat.label}`}
          >
            {isActive && (
              <motion.span
                className="absolute inset-0 bg-blue-600 rounded-full z-0"
                layoutId="activePill"
                transition={{ duration: 0.2 }}
              />
            )}
            <span className="relative z-10">{cat.label}</span>
          </button>
        );
      })}
    </div>
  );
}
