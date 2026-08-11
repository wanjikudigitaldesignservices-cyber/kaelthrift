import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product, ProductFilters, SortOption } from '@/lib/types';

const PAGE_SIZE = 12;

export function useProducts(filters: ProductFilters = {}, sort: SortOption = 'newest') {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);

  const fetchProducts = useCallback(
    async (pageNum: number, append = false) => {
      try {
        setLoading(true);
        setError(null);

        let query = supabase
          .from('products')
          .select('*')
          .eq('status', 'available')
          .gt('quantity', 0);

        // Apply filters
        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.size) {
          query = query.ilike('size', `%${filters.size}%`);
        }
        if (filters.minPrice !== undefined && filters.minPrice > 0) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice !== undefined && filters.maxPrice > 0) {
          query = query.lte('price', filters.maxPrice);
        }
        if (filters.condition) {
          query = query.eq('condition', filters.condition);
        }
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }

        // Apply sort
        switch (sort) {
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          case 'newest':
          default:
            query = query.order('created_at', { ascending: false });
            break;
        }

        // Pagination
        const from = pageNum * PAGE_SIZE;
        const to = from + PAGE_SIZE - 1;
        query = query.range(from, to);

        const { data, error: queryError } = await query;

        if (queryError) throw queryError;

        const newProducts = (data as Product[]) || [];
        setHasMore(newProducts.length === PAGE_SIZE);

        if (append) {
          setProducts((prev) => [...prev, ...newProducts]);
        } else {
          setProducts(newProducts);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch products');
      } finally {
        setLoading(false);
      }
    },
    [filters, sort]
  );

  // Reset and fetch on filter/sort change
  useEffect(() => {
    setPage(0);
    fetchProducts(0, false);
  }, [fetchProducts]);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, true);
  }, [page, fetchProducts]);

  const refresh = useCallback(() => {
    setPage(0);
    fetchProducts(0, false);
  }, [fetchProducts]);

  return { products, loading, error, hasMore, loadMore, refresh };
}

export function useProduct(id: string | undefined) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    async function fetchProduct() {
      try {
        setLoading(true);
        const { data, error: queryError } = await supabase
          .from('products')
          .select('*')
          .eq('id', id)
          .single();

        if (queryError) throw queryError;
        setProduct(data as Product);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Product not found');
      } finally {
        setLoading(false);
      }
    }

    fetchProduct();
  }, [id]);

  return { product, loading, error };
}
