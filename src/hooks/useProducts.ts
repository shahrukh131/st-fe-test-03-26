import { useState, useEffect, useCallback, useTransition } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../services/api';
import type { UseProductsReturn } from '../types/product';

const ITEMS_PER_PAGE = 12;

export function useProducts(): UseProductsReturn {
  const queryClient = useQueryClient();
  const [isPending, startTransition] = useTransition();

  // Initialize state from URL search params
  const getSearchParams = () => new URLSearchParams(window.location.search);
  
  const [page, setPage] = useState(() => Number(getSearchParams().get('page')) || 1);
  const [selectedCategories, setSelectedCategories] = useState<string[]>(() => {
    const catParam = getSearchParams().get('category');
    return catParam ? catParam.split(',').filter(Boolean) : [];
  });
  const [search, setSearch] = useState(() => getSearchParams().get('search') || '');
  const [debouncedSearch, setDebouncedSearch] = useState(search);

  // Sync state to URL
  useEffect(() => {
    const params = new URLSearchParams();
    if (page > 1) params.set('page', page.toString());
    if (selectedCategories.length > 0) params.set('category', selectedCategories.join(','));
    if (debouncedSearch) params.set('search', debouncedSearch);
    
    const newRelativePathQuery = window.location.pathname + '?' + params.toString();
    // Only push to history if params changed to avoid infinite loops or cluttered history
    if (window.location.search !== '?' + params.toString() && window.location.search !== params.toString()) {
      window.history.pushState(null, '', newRelativePathQuery);
    }
  }, [page, selectedCategories, debouncedSearch]);

  // Handle browser back/forward buttons
  useEffect(() => {
    const handlePopState = () => {
      const params = getSearchParams();
      setPage(Number(params.get('page')) || 1);
      
      const catParam = params.get('category');
      setSelectedCategories(catParam ? catParam.split(',').filter(Boolean) : []);
      
      setSearch(params.get('search') || '');
      setDebouncedSearch(params.get('search') || '');
    };

    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  // Debounce search input (300ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      startTransition(() => {
        setDebouncedSearch(search);
        setPage(1); 
      });
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  const handleSetCategory = useCallback((newCategory: string) => {
    startTransition(() => {
      setSelectedCategories(prev => {
        if (!newCategory) return []; // Clear all if empty string (All Categories)
        
        if (prev.includes(newCategory)) {
          return prev.filter(c => c !== newCategory);
        } else {
          return [...prev, newCategory];
        }
      });
      setPage(1);
    });
  }, []);

  const handleSetPage = useCallback((newPage: number) => {
    startTransition(() => {
      setPage(newPage);
    });
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
    queryKey: ['products', { page, category: selectedCategories, search: debouncedSearch }],
    queryFn: () =>
      api.fetchProducts({
        page,
        limit: ITEMS_PER_PAGE,
        category: selectedCategories.length > 0 ? selectedCategories : undefined,
        search: debouncedSearch || undefined,
      }),
    retry: 3,
    retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
  });

  // Predictive Prefetching: Load the next page in the background
  useEffect(() => {
    if (data && data.page < data.totalPages) {
      const nextPage = data.page + 1;
      queryClient.prefetchQuery({
        queryKey: ['products', { page: nextPage, category: selectedCategories, search: debouncedSearch }],
        queryFn: () =>
          api.fetchProducts({
            page: nextPage,
            limit: ITEMS_PER_PAGE,
            category: selectedCategories.length > 0 ? selectedCategories : undefined,
            search: debouncedSearch || undefined,
          }),
      });
    }
  }, [data, selectedCategories, debouncedSearch, queryClient]);

  const {
    data: categoriesData,
    isLoading: isLoadingCategories,
  } = useQuery({
    queryKey: ['categories'],
    queryFn: () => api.fetchCategories(),
    staleTime: Infinity,
  });

  return {
    products: data?.data ?? [],
    loading: isLoading || isPending,
    error: isError ? (error as Error).message : null,
    page: data?.page ?? page,
    totalPages: data?.totalPages ?? 0,
    total: data?.total ?? 0,
    isRetrying: isFetching && failureCount > 0,
    hasStaleData: !!data && isError,
    setPage: handleSetPage,
    setCategory: handleSetCategory,
    setSearch: (val) => startTransition(() => setSearch(val)),
    retry: () => refetch(),
    selectedCategories,
    search,
    categories: categoriesData ?? [],
    loadingCategories: isLoadingCategories,
  };
}
