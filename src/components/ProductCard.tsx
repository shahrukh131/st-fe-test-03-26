import { useState, memo } from 'react';
import { motion } from 'framer-motion';
import type { ProductCardProps } from '../types/product';

function ProductCardComponent({ product, index }: ProductCardProps) {
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  const formattedPrice = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(product.price);

  return (
    <motion.article
      className="group cursor-pointer flex flex-col bg-white/70 backdrop-blur-sm border border-black/[0.08] rounded-xl overflow-hidden transition-all duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] hover:-translate-y-1 hover:scale-[1.01] hover:bg-white/95 hover:border-black/[0.15] hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.15)]"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.03,
      }}
      role="article"
      aria-label={`${product.name} - ${formattedPrice}`}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-slate-100">
        {!imageLoaded && !imageError && (
          <div
            className="absolute inset-0 bg-gradient-to-r from-slate-100 via-slate-200 to-slate-100 bg-[length:200%_100%] animate-shimmer"
            aria-hidden="true"
          />
        )}
        {imageError ? (
          <div
            className="flex items-center justify-center w-full h-full text-slate-300 bg-slate-100"
            aria-label="Product image unavailable"
          >
            <svg
              width="48"
              height="48"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </div>
        ) : (
          <img
            src={product.imageUrl}
            alt={product.name}
            className={`w-full h-full object-cover transition-all duration-700 ease-in-out group-hover:scale-110 ${imageLoaded ? 'opacity-100' : 'opacity-0'}`}
            loading="lazy"
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        )}

        {/* Low Stock Badge */}
        {product.stock > 0 && product.stock < 5 && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[0.7rem] font-semibold tracking-wide uppercase bg-amber-50 text-amber-800 border border-amber-200">
            Low Stock
          </span>
        )}
        {product.stock === 0 && (
          <span className="absolute top-2.5 left-2.5 px-2.5 py-1 rounded-md text-[0.7rem] font-semibold tracking-wide uppercase bg-red-50 text-red-500 border border-red-200">
            Out of Stock
          </span>
        )}
      </div>

      {/* Card Content */}
      <div className="pt-3.5 px-4 pb-[18px] flex flex-col flex-1">
        {/* Brand / Category */}
        <span className="text-[0.7rem] font-semibold text-slate-600 uppercase tracking-[0.08em] mb-1.5">
          {product.category}
        </span>

        {/* Product Name */}
        <h3
          className="text-[0.95rem] font-medium leading-snug text-slate-900 mb-2.5 line-clamp-2 flex-1"
          title={product.name}
        >
          {product.name}
        </h3>

        {/* Price */}
        <p className="text-lg font-bold text-blue-600 tracking-tight transition-colors duration-300 group-hover:text-blue-700">
          {formattedPrice}
        </p>
      </div>
    </motion.article>
  );
}

export const ProductCard = memo(ProductCardComponent);
