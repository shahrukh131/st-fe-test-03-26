import type { ProductCardSkeletonProps } from '../types/product';

export function ProductCardSkeleton({ count = 12 }: ProductCardSkeletonProps) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={`skeleton-${i}`}
          className="bg-white/80 backdrop-blur-xl border border-black/[0.05] rounded-3xl p-5 shadow-sm overflow-hidden flex flex-col h-[400px]"
          aria-hidden="true"
        >
          {/* Shimmering Image Area */}
          <div className="relative aspect-[4/3] w-full bg-slate-100 rounded-2xl mb-5 overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/40 to-transparent -translate-x-full animate-[shimmer_2s_infinite]" />
          </div>

          {/* Text Content */}
          <div className="flex-1 space-y-4 px-1">
            <div className="space-y-2">
              <div className="h-4 bg-slate-100 rounded-lg w-1/3 animate-pulse" />
              <div className="h-5 bg-slate-200/60 rounded-lg w-3/4 animate-pulse" />
              <div className="h-4 bg-slate-100 rounded-lg w-full animate-pulse" />
            </div>
            
            <div className="flex items-center justify-between pt-2">
              <div className="h-6 bg-blue-50/50 rounded-lg w-1/4 animate-pulse" />
              <div className="h-4 bg-slate-50 rounded-lg w-1/5 animate-pulse" />
            </div>
          </div>
        </div>
      ))}
    </>
  );
}
