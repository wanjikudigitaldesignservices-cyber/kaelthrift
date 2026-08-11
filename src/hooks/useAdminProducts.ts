import { useState, useCallback } from 'react';
import { supabase } from '@/lib/supabase';
import { MOCK_PRODUCTS, isSupabaseConfigured } from '@/lib/mockData';
import type { Product, DashboardStats } from '@/lib/types';
import type { ProductFormData } from '@/lib/schemas';

export function useAdminProducts() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchAllProducts = useCallback(
    async (
      statusFilter?: string,
      search?: string,
      sort: string = 'newest'
    ): Promise<Product[]> => {
      try {
        setLoading(true);
        setError(null);

        // ── Mock data path ───────────────────────────────────
        if (!isSupabaseConfigured()) {
          let result = [...MOCK_PRODUCTS];
          if (statusFilter && statusFilter !== 'all') {
            result = result.filter((p) => p.status === statusFilter);
          }
          if (search) {
            const q = search.toLowerCase();
            result = result.filter((p) => p.name.toLowerCase().includes(q));
          }
          switch (sort) {
            case 'oldest':
              result.sort((a, b) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime());
              break;
            case 'price-asc':
              result.sort((a, b) => a.price - b.price);
              break;
            case 'price-desc':
              result.sort((a, b) => b.price - a.price);
              break;
            default:
              result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
          }
          return result;
        }

        // ── Supabase path ────────────────────────────────────
        let query = supabase.from('products').select('*');

        if (statusFilter && statusFilter !== 'all') {
          query = query.eq('status', statusFilter);
        }
        if (search) {
          query = query.ilike('name', `%${search}%`);
        }

        switch (sort) {
          case 'oldest':
            query = query.order('created_at', { ascending: true });
            break;
          case 'price-asc':
            query = query.order('price', { ascending: true });
            break;
          case 'price-desc':
            query = query.order('price', { ascending: false });
            break;
          default:
            query = query.order('created_at', { ascending: false });
        }

        const { data, error: queryError } = await query;
        if (queryError) throw queryError;
        return (data as Product[]) || [];
      } catch (err) {
        const msg = err instanceof Error ? err.message : 'Failed to fetch products';
        setError(msg);
        return [];
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const createProduct = useCallback(async (data: ProductFormData) => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured()) {
        return { success: true };
      }

      const { error: insertError } = await supabase.from('products').insert({
        name: data.name,
        category: data.category,
        size: data.size,
        price: data.price,
        condition: data.condition,
        quantity: data.quantity,
        measurements: data.measurements || {},
        description: data.description || '',
        status: data.status,
        images: data.images,
      } as Record<string, unknown>);

      if (insertError) throw insertError;
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to create product';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProduct = useCallback(async (id: string, data: Partial<ProductFormData>) => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured()) {
        return { success: true };
      }

      const { error: updateError } = await supabase
        .from('products')
        .update(data as Record<string, unknown>)
        .eq('id', id);

      if (updateError) throw updateError;
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update product';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProduct = useCallback(async (id: string, images: string[]) => {
    try {
      setLoading(true);
      setError(null);

      if (!isSupabaseConfigured()) {
        return { success: true };
      }

      // Delete images from storage
      if (images.length > 0) {
        const paths = images
          .map((url) => {
            const parts = url.split('/product-images/');
            return parts[1] || '';
          })
          .filter(Boolean);

        if (paths.length > 0) {
          await supabase.storage.from('product-images').remove(paths);
        }
      }

      // Delete product row
      const { error: deleteError } = await supabase
        .from('products')
        .delete()
        .eq('id', id);

      if (deleteError) throw deleteError;
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to delete product';
      setError(msg);
      return { success: false, error: msg };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateStatus = useCallback(async (id: string, status: string) => {
    try {
      setError(null);

      if (!isSupabaseConfigured()) {
        return { success: true };
      }

      const updateData: Record<string, unknown> = { status };
      if (status === 'sold') {
        updateData.quantity = 0;
      }

      const { error: updateError } = await supabase
        .from('products')
        .update(updateData)
        .eq('id', id);

      if (updateError) throw updateError;
      return { success: true };
    } catch (err) {
      const msg = err instanceof Error ? err.message : 'Failed to update status';
      setError(msg);
      return { success: false, error: msg };
    }
  }, []);

  const fetchStats = useCallback(async (): Promise<DashboardStats> => {
    try {
      if (!isSupabaseConfigured()) {
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);
        return {
          total: MOCK_PRODUCTS.length,
          available: MOCK_PRODUCTS.filter((p) => p.status === 'available' && p.quantity > 0).length,
          soldThisWeek: MOCK_PRODUCTS.filter(
            (p) => p.status === 'sold' && p.sold_at && new Date(p.sold_at) >= weekAgo
          ).length,
          reserved: MOCK_PRODUCTS.filter((p) => p.status === 'reserved').length,
        };
      }

      const { data: allProducts } = await supabase
        .from('products')
        .select('status, sold_at, quantity');

      const products = (allProducts || []) as Array<{
        status: string;
        sold_at: string | null;
        quantity: number;
      }>;
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 7);

      return {
        total: products.length,
        available: products.filter((p) => p.status === 'available' && p.quantity > 0).length,
        soldThisWeek: products.filter(
          (p) => p.status === 'sold' && p.sold_at && new Date(p.sold_at) >= weekAgo
        ).length,
        reserved: products.filter((p) => p.status === 'reserved').length,
      };
    } catch {
      return { total: 0, available: 0, soldThisWeek: 0, reserved: 0 };
    }
  }, []);

  const uploadImages = useCallback(async (files: File[]): Promise<string[]> => {
    if (!isSupabaseConfigured()) {
      return files.map(() => '/images/cat-dresses.png');
    }

    const urls: string[] = [];

    for (const file of files) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}.${fileExt}`;
      const filePath = `products/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, file, { cacheControl: '3600', upsert: false });

      if (uploadError) throw uploadError;

      const { data } = supabase.storage.from('product-images').getPublicUrl(filePath);

      urls.push(data.publicUrl);
    }

    return urls;
  }, []);

  const deleteImage = useCallback(async (imageUrl: string) => {
    if (!isSupabaseConfigured()) return;

    const parts = imageUrl.split('/product-images/');
    const path = parts[1];
    if (path) {
      await supabase.storage.from('product-images').remove([path]);
    }
  }, []);

  return {
    loading,
    error,
    fetchAllProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    updateStatus,
    fetchStats,
    uploadImages,
    deleteImage,
  };
}
