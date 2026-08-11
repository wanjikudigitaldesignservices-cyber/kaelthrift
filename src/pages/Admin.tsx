import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import { CATEGORIES } from '@/lib/schemas';
import { Loader2 } from 'lucide-react';

export default function Admin() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setProducts(data || []);
    } catch (err) {
      console.error('Error fetching products:', err);
    } finally {
      setLoading(false);
    }
  };

  const updateProductCategory = async (id: string, newCategory: string) => {
    setSavingId(id);
    try {
      const { error } = await supabase
        .from('products')
        .update({ category: newCategory as any })
        .eq('id', id);

      if (error) throw error;
      
      // Update local state
      setProducts(products.map(p => p.id === id ? { ...p, category: newCategory as any } : p));
    } catch (err) {
      console.error('Error updating category:', err);
      alert('Failed to update category');
    } finally {
      setSavingId(null);
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', padding: '4rem' }}>
        <Loader2 size={24} className="animate-spin" />
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 'bold', marginBottom: '1rem' }}>Admin Dashboard</h1>
      <p style={{ marginBottom: '2rem', color: 'var(--color-warm-gray)' }}>
        Quickly organize your products by selecting the correct category below.
      </p>

      <div style={{ overflowX: 'auto' }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
          <thead>
            <tr style={{ borderBottom: '2px solid var(--color-warm-gray-light)' }}>
              <th style={{ padding: '1rem' }}>Image</th>
              <th style={{ padding: '1rem' }}>Name</th>
              <th style={{ padding: '1rem' }}>Price</th>
              <th style={{ padding: '1rem' }}>Category</th>
            </tr>
          </thead>
          <tbody>
            {products.map(product => (
              <tr key={product.id} style={{ borderBottom: '1px solid var(--color-warm-gray-light)' }}>
                <td style={{ padding: '1rem' }}>
                  <img 
                    src={product.images[0]} 
                    alt={product.name} 
                    style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px' }}
                  />
                </td>
                <td style={{ padding: '1rem', fontWeight: 500 }}>{product.name}</td>
                <td style={{ padding: '1rem' }}>KES {product.price}</td>
                <td style={{ padding: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <select
                      className="select"
                      value={product.category}
                      onChange={(e) => updateProductCategory(product.id, e.target.value)}
                      disabled={savingId === product.id}
                      style={{ padding: '0.5rem', width: 'auto' }}
                    >
                      {CATEGORIES.map(cat => (
                        <option key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </option>
                      ))}
                    </select>
                    {savingId === product.id && <Loader2 size={16} className="animate-spin" />}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
