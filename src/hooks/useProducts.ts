import { useState, useEffect, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MOCK_PRODUCTS, isSupabaseConfigured } from '@/lib/mockData';
import type { Product, ProductFilters, SortOption } from '@/lib/types';

const PAGE_SIZE = 12;

/**
 * Apply filters and sort to a product array (used for mock data fallback).
 */
function filterAndSort(
  products: Product[],
  filters: ProductFilters,
  sort: SortOption
): Product[] {
  let result = products.filter((p) => p.status === 'available' && p.quantity > 0);

  if (filters.category) {
    result = result.filter((p) => p.category === filters.category);
  }
  if (filters.size) {
    result = result.filter((p) =>
      p.size.toLowerCase().includes(filters.size!.toLowerCase())
    );
  }
  if (filters.minPrice && filters.minPrice > 0) {
    result = result.filter((p) => p.price >= filters.minPrice!);
  }
  if (filters.maxPrice && filters.maxPrice > 0) {
    result = result.filter((p) => p.price <= filters.maxPrice!);
  }
  if (filters.condition) {
    result = result.filter((p) => p.condition === filters.condition);
  }
  if (filters.search) {
    const q = filters.search.toLowerCase();
    result = result.filter((p) => p.name.toLowerCase().includes(q));
  }

  switch (sort) {
    case 'price-asc':
      result.sort((a, b) => a.price - b.price);
      break;
    case 'price-desc':
      result.sort((a, b) => b.price - a.price);
      break;
    case 'newest':
    default:
      result.sort(
        (a, b) =>
          new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      );
      break;
  }

  return result;
}

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

        // ── Mock data path ───────────────────────────────────
        if (!isSupabaseConfigured()) {
          const filtered = filterAndSort(MOCK_PRODUCTS, filters, sort);
          const from = pageNum * PAGE_SIZE;
          const sliced = filtered.slice(from, from + PAGE_SIZE);
          setHasMore(from + PAGE_SIZE < filtered.length);

          if (append) {
            setProducts((prev) => [...prev, ...sliced]);
          } else {
            setProducts(sliced);
          }
          return;
        }

        // ── Supabase path ────────────────────────────────────
        let query = supabase
          .from('products')
          .select('*')
          .eq('status', 'available')
          .gt('quantity', 0);

        if (filters.category) {
          query = query.eq('category', filters.category);
        }
        if (filters.size) {
          query = query.ilike('size', `%${filters.size}%`);
        }
        if (filters.minPrice && filters.minPrice > 0) {
          query = query.gte('price', filters.minPrice);
        }
        if (filters.maxPrice && filters.maxPrice > 0) {
          query = query.lte('price', filters.maxPrice);
        }
        if (filters.condition) {
          query = query.eq('condition', filters.condition);
        }
        if (filters.search) {
          query = query.ilike('name', `%${filters.search}%`);
        }

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

        // ── Mock data path ─────────────────────────────────
        if (!isSupabaseConfigured()) {
          const found = MOCK_PRODUCTS.find((p) => p.id === id) || null;
          setProduct(found);
          if (!found) setError('Product not found');
          return;
        }

        // ── Supabase path ──────────────────────────────────
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
