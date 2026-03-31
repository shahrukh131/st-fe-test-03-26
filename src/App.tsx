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
    selectedCategories,
    search,
    categories,
    loadingCategories,
  } = useProducts();

  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleCategoryChange = (newCategory: string) => {
    setCategory(newCategory);
  };

  // Hero Banner (Scrolls away)
  const heroBanner = (
    <div className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] p-6">
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

  // Slim Sticky Header (Nav/Search)
  const stickyHeader = (
    <section className="flex flex-row items-center gap-2 md:gap-4">
      {/* Mobile Branding Icon */}
      <div className="lg:hidden flex items-center justify-center w-10 md:w-11 h-10 md:h-11 rounded-[14px] bg-blue-100/80 backdrop-blur-xl border border-blue-200/50 text-blue-600 shrink-0 shadow-[0_2px_15px_rgba(37,99,235,0.08)]">
        <ShoppingBag size={20} strokeWidth={2} />
      </div>

      {/* Search */}
      <div className="flex items-center px-3 md:px-4 h-10 md:h-11 flex-1 gap-2 md:gap-3 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] focus-within:ring-2 focus-within:ring-blue-500/50 transition-shadow">
        <Search size={18} className="text-slate-500 shrink-0 md:w-5 md:h-5" />
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
            className="shrink-0 w-6 h-6 rounded-full flex items-center justify-center text-slate-500 text-xl leading-none hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-2 focus-visible:outline-blue-600"
            onClick={() => setSearch('')}
            aria-label="Clear search"
          >
            <X size={16} strokeWidth={2.5} />
          </button>
        )}
      </div>

      {/* Mobile Filter Toggle */}
      <button
        className="lg:hidden flex items-center justify-center gap-2 px-4 md:px-6 h-10 md:h-11 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_2px_15px_rgba(0,0,0,0.03)] text-slate-700 font-semibold hover:text-slate-900 hover:bg-white focus-visible:outline-2 focus-visible:outline-blue-600 transition-colors shrink-0 whitespace-nowrap"
        onClick={() => setIsMobileMenuOpen(true)}
        aria-label="Open filters"
      >
        <Filter size={18} />
        {/* <span>Filters</span> */}
        {selectedCategories.length > 0 && (
          <span className="flex items-center justify-center min-w-[1.25rem] h-5 px-1 bg-blue-600 text-white text-[0.7rem] font-bold rounded-full ml-1">
            {selectedCategories.length}
          </span>
        )}
      </button>
    </section>
  );

  // Sidebar Piece
  const sidebar = (
    <CategoryFilter
      activeCategories={selectedCategories}
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
          {/* Panel (Bottom Sheet) */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 250 }}
            className="fixed left-0 right-0 bottom-0 w-full max-h-[85vh] bg-white z-[101] shadow-[0_-8px_30px_rgba(0,0,0,0.12)] rounded-t-[32px] lg:hidden flex flex-col overflow-hidden"
          >
            {/* Native Drag Handle */}
            <div className="w-full flex justify-center pt-3 pb-1 shrink-0">
              <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
            </div>

            <div className="px-6 pb-4 pt-1 border-b border-slate-100 flex items-center justify-between shrink-0">
              <h2 className="text-lg font-bold text-slate-900 tracking-tight">Filters</h2>
              <button
                onClick={() => setIsMobileMenuOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 hover:bg-slate-200 transition-colors"
                aria-label="Close filters"
              >
                <X size={16} strokeWidth={2.5} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 scrollbar-none pb-10">
              <CategoryFilter
                activeCategories={selectedCategories}
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
      heroBanner={heroBanner}
      stickyHeader={stickyHeader}
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
      {/* Results Meta Info */}
      <div className="text-sm text-slate-500 mb-4 px-1" aria-live="polite">
        {loading && !hasStaleData ? (
          <div className="h-5 w-48 bg-slate-200/70 rounded-md animate-pulse mt-0.5" aria-label="Loading results" />
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
