import { useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import type { PaginationProps } from '../types/product';

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  disabled = false,
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const pageNumbers = useMemo(() => {
    const pages: (number | 'ellipsis-start' | 'ellipsis-end')[] = [];
    const delta = 1;

    pages.push(1);

    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    if (rangeStart > 2) {
      pages.push('ellipsis-start');
    }

    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    if (rangeEnd < totalPages - 1) {
      pages.push('ellipsis-end');
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  }, [currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages || page === currentPage || disabled) return;
    onPageChange(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const btnBase =
    'inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium text-slate-500 border border-transparent transition-all duration-200 min-w-[36px] min-h-[36px] focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-2 hover:bg-white hover:border-black/[0.08] hover:text-slate-900 disabled:opacity-[0.35] disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:border-transparent disabled:hover:text-slate-500';

  return (
    <nav
      className="flex items-center justify-center gap-2 mt-8 py-4 flex-wrap"
      role="navigation"
      aria-label="Product listing pagination"
    >
      {/* Previous Button */}
      <button
        className={`${btnBase} px-4`}
        onClick={() => handlePageChange(currentPage - 1)}
        disabled={currentPage === 1 || disabled}
        aria-label="Go to previous page"
      >
        <ChevronLeft size={18} />
        <span className="hidden sm:inline">Previous</span>
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1" role="list">
        {pageNumbers.map((item, idx) => {
          if (typeof item === 'string') {
            return (
              <span
                key={item}
                className="px-1 text-slate-500 text-sm select-none"
                aria-hidden="true"
              >
                …
              </span>
            );
          }

          const isActive = item === currentPage;
          return (
            <button
              key={`page-${item}-${idx}`}
              className={`${btnBase} ${
                isActive
                  ? '!bg-blue-600 !text-white !border-blue-600 !font-semibold'
                  : ''
              }`}
              onClick={() => handlePageChange(item)}
              disabled={disabled}
              aria-label={`Go to page ${item}`}
              aria-current={isActive ? 'page' : undefined}
            >
              {item}
            </button>
          );
        })}
      </div>

      {/* Next Button */}
      <button
        className={`${btnBase} px-4`}
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages || disabled}
        aria-label="Go to next page"
      >
        <span className="hidden sm:inline">Next</span>
        <ChevronRight size={18} />
      </button>
    </nav>
  );
}
