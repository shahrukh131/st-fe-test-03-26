export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  imageUrl: string;
  stock: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface FetchProductsParams {
  page?: number;
  limit?: number;
  category?: string | string[];
  search?: string;
}

// Hook Interfaces
export interface UseProductsState {
  products: Product[];
  loading: boolean;
  error: string | null;
  page: number;
  totalPages: number;
  total: number;
  isRetrying: boolean;
  hasStaleData: boolean;
}

export interface UseProductsReturn extends UseProductsState {
  setPage: (page: number) => void;
  setCategory: (category: string) => void;
  setSearch: (search: string) => void;
  retry: () => void;
  selectedCategories: string[];
  search: string;
  categories: string[];
  loadingCategories: boolean;
}

// Component Prop Interfaces
export interface ProductCardProps {
  product: Product;
  index: number;
}

export interface ProductCardSkeletonProps {
  count?: number;
}

export interface ProductGridProps {
  products: Product[];
  loading: boolean;
  hasStaleData: boolean;
}

export interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  disabled?: boolean;
}

export interface CategoryFilterProps {
  activeCategories: string[];
  onCategoryChange: (category: string) => void;
  categories: string[];
  isLoading?: boolean;
  disabled?: boolean;
}

export interface ErrorBannerProps {
  error: string | null;
  hasStaleData: boolean;
  isRetrying: boolean;
  onRetry: () => void;
}
