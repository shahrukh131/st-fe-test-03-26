import type { ProductCardSkeletonProps } from '../types/product';

export function ProductCardSkeleton({ count = 12 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="bg-white/70 backdrop-blur-sm border border-black/[0.08] rounded-xl overflow-hidden"
          aria-hidden="true"
          role="presentation"
        >
          {/* Image placeholder */}
          <div className="aspect-[4/3] bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />

          {/* Content placeholder */}
          <div className="pt-3.5 px-4 pb-[18px]">
            {/* Brand */}
            <div className="w-[40%] h-3 rounded bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
            {/* Name */}
            <div className="w-[80%] h-4 mt-2 rounded bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
            {/* Price */}
            <div className="w-[30%] h-5 mt-3 rounded bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer" />
          </div>
        </div>
      ))}
    </>
  );
}
