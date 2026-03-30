import { AnimatePresence } from 'framer-motion';
import { PackageOpen } from 'lucide-react';
import { ProductCard } from './ProductCard';
import { ProductCardSkeleton } from './ProductCardSkeleton';
import type { ProductGridProps } from '../types/product';

export function ProductGrid({ products, loading, hasStaleData }: ProductGridProps) {
  // Full loading state (no stale data to show)
  if (loading && !hasStaleData) {
    return (
      <div
        className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5 sm:grid-cols-[repeat(auto-fill,minmax(270px,1fr))] sm:gap-6"
        role="status"
        aria-label="Loading products"
      >
        <ProductCardSkeleton count={12} />
      </div>
    );
  }

  // Empty state
  if (!loading && products.length === 0) {
    return (
      <div
        className="flex flex-col items-center justify-center p-16 text-center bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
        role="status"
      >
        <PackageOpen size={56} strokeWidth={1.2} className="text-slate-500" />
        <h2 className="text-xl font-semibold mt-4 mb-2">No products found</h2>
        <p className="text-slate-500 max-w-[360px] leading-relaxed">
          Try adjusting your filters or search to find what you're looking for.
        </p>
      </div>
    );
  }

  return (
    <div
      className={`grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-5 sm:grid-cols-[repeat(auto-fill,minmax(270px,1fr))] sm:gap-6 transition-opacity duration-300 ${hasStaleData && loading ? 'opacity-[0.55] pointer-events-none' : ''
        }`}
      aria-busy={loading}
    >
      <AnimatePresence>
        {products.map((product, index) => (
          <ProductCard key={product.id} product={product} index={index} />
        ))}
      </AnimatePresence>
    </div>
  );
}
