import { useState } from 'react';
import { Search, Loader2, ShoppingBag, Filter, X } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';
import { useProducts } from './hooks/useProducts';
import { ProductGrid } from './components/ProductGrid';
import { Pagination } from './components/Pagination';
import { CategoryFilter } from './components/CategoryFilter';
import { ErrorBanner } from './components/ErrorBanner';
import { MainLayout } from './components/MainLayout';

function App() {
  const {
    products,
    loading,
    error,
    page,
    totalPages,
    total,
    isRetrying,
    hasStaleData,
    setPage,
    setCategory,
    setSearch,
    retry,
    category,
    search,
    categories,
    loadingCategories,
  } = useProducts();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
    setIsMobileMenuOpen(false);
  };

  // Header Piece
  const header = (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] p-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-blue-100 text-blue-600 shrink-0">
          <ShoppingBag size={28} strokeWidth={1.8} />
        </div>
        <div>
          <h1 className="text-[1.75rem] font-bold tracking-tight leading-tight">
            Premium Products
          </h1>
          <p className="text-slate-500 text-[0.95rem] mt-0.5">
            Discover our curated collection of premium products
          </p>
        </div>
      </div>
    </div>
  );

  // Sidebar Piece
  const sidebar = (
    <CategoryFilter
      activeCategory={category}
      onCategoryChange={handleCategoryChange}
      categories={categories}
      isLoading={loadingCategories}
      disabled={loading && !hasStaleData}
    />
  );

  // Mobile Drawer Piece
  const mobileDrawer = (
    <AnimatePresence>
      {isMobileMenuOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsMobileMenuOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[100] lg:hidden"
          />
          {/* Panel */}
          <motion.div
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed left-0 top-0 bottom-0 w-[280px] bg-white z-[101] shadow-2xl lg:hidden flex flex-col"
          >
            <div className="p-6 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-lg font-bold text-slate-900">Filters</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500"
              >
                <X size={20} />
              </button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 scrollbar-none">
              <CategoryFilter
                activeCategory={category}
                onCategoryChange={handleCategoryChange}
                categories={categories}
                isLoading={loadingCategories}
                disabled={loading && !hasStaleData}
              />
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );

  return (
    <MainLayout
      header={header}
      sidebar={sidebar}
      mobileDrawer={mobileDrawer}
      errorBanner={
        <ErrorBanner
          error={error}
          hasStaleData={hasStaleData}
          isRetrying={isRetrying}
          onRetry={retry}
        />
      }
    >
      {/* Controls Section */}
      <section className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center px-4 py-2.5 flex-1 gap-3 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <Search size={20} className="text-slate-500 shrink-0" />
          <input
            id="product-search"
            type="text"
            placeholder="Search products..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-transparent border-none text-slate-900 outline-none w-full text-[0.95rem] placeholder:text-slate-500"
            aria-label="Search products"
          />
          {search && (
            <button
              className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-slate-500 text-xl leading-none hover:bg-slate-100 hover:text-slate-900"
              onClick={() => setSearch('')}
              aria-label="Clear search"
            >
              ×
            </button>
          )}
        </div>

        {/* Mobile Filter Toggle */}
        <button
          className="lg:hidden flex items-center gap-2 px-4 py-2 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] text-slate-600 font-medium hover:text-slate-900 transition-colors"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open filters"
        >
          <Filter size={18} />
          <span>Filters</span>
          {category && (
            <span className="w-2 h-2 bg-blue-600 rounded-full" />
          )}
        </button>
      </section>

      {/* Results Meta Info */}
      <div className="text-sm text-slate-500 mb-4 px-1" aria-live="polite">
        {loading && !hasStaleData ? (
          <span className="inline-flex items-center gap-2">
            <Loader2 size={16} className="animate-spin" />
            Loading products…
          </span>
        ) : (
          <span>
            Showing{' '}
            <strong className="text-slate-900 font-semibold">
              {total > 0 ? (page - 1) * 12 + 1 : 0}-
              {Math.min(page * 12, total)}
            </strong>{' '}
            of{' '}
            <strong className="text-slate-900 font-semibold">{total}</strong>{' '}
            products
            {category && (
              <> in{' '}
                <strong className="text-slate-900 font-semibold capitalize">
                  {category}
                </strong>
              </>
            )}
          </span>
        )}
      </div>

      {/* Main Content Area */}
      <AnimatePresence mode="wait">
        {/* Full Error State */}
        {!loading && error && products.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex flex-col items-center justify-center p-16 text-center bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)]"
          >
            <div className="mb-6 opacity-80 text-red-500">
               <X className="w-16 h-16" strokeWidth={1.5} />
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Unable to Load Products
            </h2>
            <p className="text-slate-500 max-w-[400px] mb-6 leading-relaxed">
              {error}
            </p>
            <button
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-[0.95rem] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px] justify-center transition-colors"
              onClick={retry}
              disabled={isRetrying}
            >
              {isRetrying ? (
                <>
                  <Loader2 size={16} className="animate-spin" />
                  Retrying…
                </>
              ) : (
                'Try Again'
              )}
            </button>
          </motion.div>
        ) : (
          <ProductGrid
            products={products}
            loading={loading}
            hasStaleData={hasStaleData}
          />
        )}
      </AnimatePresence>

      {/* Pagination Footer */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        disabled={loading && !hasStaleData}
      />
    </MainLayout>
  );
}

export default App;
