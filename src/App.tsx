import { Search, Loader2, ShoppingBag } from 'lucide-react';
import { useProducts } from './hooks/useProducts';
import { ProductGrid } from './components/ProductGrid';
import { Pagination } from './components/Pagination';
import { CategoryFilter } from './components/CategoryFilter';
import { ErrorBanner } from './components/ErrorBanner';

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
  } = useProducts();

  return (
    <div className="min-h-screen p-4 md:p-8 max-w-[1400px] mx-auto">
      {/* Error Banner — floats above content */}
      <ErrorBanner
        error={error}
        hasStaleData={hasStaleData}
        isRetrying={isRetrying}
        onRetry={retry}
      />

      {/* Header Section */}
      <header className="bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)] p-6 mb-6">
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
      </header>

      {/* Controls Section */}
      <section className="flex flex-col md:flex-row md:items-center gap-4 mb-6">
        {/* Search */}
        <div className="flex items-center px-4 py-2.5 flex-1 max-w-[400px] gap-3 bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
          <Search
            size={20}
            className="text-slate-500 shrink-0"
          />
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

        {/* Category Filter */}
        <CategoryFilter
          activeCategory={category}
          onCategoryChange={setCategory}
          disabled={loading && !hasStaleData}
        />
      </section>

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
              <>
                {' '}
                in{' '}
                <strong className="text-slate-900 font-semibold capitalize">
                  {category}
                </strong>
              </>
            )}
          </span>
        )}
      </div>

      {/* Main Grid */}
      <main>
        {/* Full Error State (no products at all) */}
        {!loading && error && products.length === 0 ? (
          <div className="flex flex-col items-center justify-center p-16 text-center bg-white/80 backdrop-blur-xl border border-black/[0.08] rounded-2xl shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
            <div className="mb-6 opacity-80">
              <svg
                width="64"
                height="64"
                viewBox="0 0 24 24"
                fill="none"
                stroke="#ef4444"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold mb-2">
              Unable to Load Products
            </h2>
            <p className="text-slate-500 max-w-[400px] mb-6 leading-relaxed">
              {error}
            </p>
            <button
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg font-medium text-[0.95rem] hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed min-w-[140px] justify-center"
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
          </div>
        ) : (
          <ProductGrid
            products={products}
            loading={loading}
            hasStaleData={hasStaleData}
          />
        )}
      </main>

      {/* Pagination */}
      <Pagination
        currentPage={page}
        totalPages={totalPages}
        onPageChange={setPage}
        disabled={loading && !hasStaleData}
      />
    </div>
  );
}

export default App;
