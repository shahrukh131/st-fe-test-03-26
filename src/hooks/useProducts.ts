import { useState, useEffect, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { api } from '../services/api';
import type { UseProductsReturn } from '../types/product';

const ITEMS_PER_PAGE = 12;

export function useProducts(): UseProductsReturn {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
      setPage(1); // Reset to page 1 on new search
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Reset to page 1 when category changes
  const handleSetCategory = useCallback((newCategory: string) => {
    setCategory(newCategory);
    setPage(1);
  }, []);

  const {
    data,
    isLoading,
    isError,
    error,
    isFetching,
    refetch,
    failureCount,
  } = useQuery({
    queryKey: ['products', { page, category, search: debouncedSearch }],
    queryFn: () =>
      api.fetchProducts({
        page,
        limit: ITEMS_PER_PAGE,
        category: category || undefined,
        search: debouncedSearch || undefined,
      }),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.fetchCategories(),
    staleTime: Infinity, // Categories are unlikely to change during the session
  });

  return {
    products: data?.data ?? [],
    // Show loading (skeletons) if we have no data yet (first load or filter change)
    loading: isLoading,
    error: isError ? (error as Error).message : null,
    page: data?.page ?? page,
    totalPages: data?.totalPages ?? 0,
    total: data?.total ?? 0,
    isRetrying: isFetching && failureCount > 0,
    // hasStaleData means we are currently showing an error but have some data from before
    hasStaleData: !!data && isError,
    setPage,
    setCategory: handleSetCategory,
    setSearch,
    retry: () => refetch(),
    category,
    search,
    categories: categoriesData ?? [],
    loadingCategories: isLoadingCategories,
  };
}
