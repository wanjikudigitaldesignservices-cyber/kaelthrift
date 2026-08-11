import { Link } from 'react-router-dom';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/hooks/useWishlist';
import { useCart } from '@/hooks/useCart';
import { MOCK_PRODUCTS, isSupabaseConfigured } from '@/lib/mockData';
import { formatKES } from '@/lib/whatsapp';
import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';

export default function Wishlist() {
  const { wishlist, toggleWishlist } = useWishlist();
  const { addItem } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchWishlistProducts() {
      if (wishlist.length === 0) {
        setProducts([]);
        setLoading(false);
        return;
      }

      if (!isSupabaseConfigured()) {
        setProducts(MOCK_PRODUCTS.filter((p) => wishlist.includes(p.id)));
        setLoading(false);
        return;
      }

      try {
        const { data } = await supabase
          .from('products')
          .select('*')
          .in('id', wishlist);
        setProducts((data as Product[]) || []);
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    }

    fetchWishlistProducts();
  }, [wishlist]);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1.25rem 4rem' }}>
      {/* Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Heart size={28} color="var(--color-terracotta)" /> My Wishlist
        </h1>
        <p style={{ color: 'var(--color-warm-gray)', fontSize: '0.95rem' }}>
          {wishlist.length === 0
            ? 'Save your favorite finds here'
            : `${wishlist.length} item${wishlist.length > 1 ? 's' : ''} saved`}
        </p>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'var(--color-warm-gray)' }}>
          Loading your wishlist...
        </div>
      ) : products.length === 0 ? (
        <div
          style={{
            textAlign: 'center',
            padding: '4rem 2rem',
          }}
        >
          <Heart
            size={72}
            color="var(--color-cream-dark)"
            style={{ marginBottom: '1rem' }}
          />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 700,
              marginBottom: '0.5rem',
            }}
          >
            Your wishlist is empty
          </h2>
          <p
            style={{
              color: 'var(--color-warm-gray)',
              marginBottom: '1.5rem',
              maxWidth: '400px',
              margin: '0 auto 1.5rem',
            }}
          >
            Browse our shop and tap the heart icon on items you love to save them here.
          </p>
          <Link to="/shop" className="btn-primary">
            Explore the Shop <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
            gap: '1.5rem',
          }}
        >
          {products.map((product) => {
            const isSold = product.status === 'sold' || product.quantity === 0;
            return (
              <div key={product.id} className="card" style={{ position: 'relative' }}>
                {/* Image */}
                <Link to={isSold ? '#' : `/product/${product.id}`}>
                  <div
                    style={{
                      aspectRatio: '3 / 4',
                      overflow: 'hidden',
                      backgroundColor: 'var(--color-cream)',
                      position: 'relative',
                    }}
                  >
                    <img
                      src={product.images[0]}
                      alt={product.name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                      }}
                    />
                    {isSold && (
                      <div className="sold-overlay">
                        <span className="sold-stamp">SOLD</span>
                      </div>
                    )}
                  </div>
                </Link>

                {/* Remove from wishlist */}
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="wishlist-btn active"
                  style={{
                    position: 'absolute',
                    top: '0.5rem',
                    right: '0.5rem',
                    zIndex: 5,
                  }}
                  aria-label="Remove from wishlist"
                >
                  <Heart size={18} fill="var(--color-terracotta)" color="var(--color-terracotta)" />
                </button>

                {/* Info */}
                <div style={{ padding: '1rem' }}>
                  <h3
                    style={{
                      fontWeight: 600,
                      fontSize: '0.9rem',
                      marginBottom: '0.375rem',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {product.name}
                  </h3>
                  <div
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      marginBottom: '0.75rem',
                    }}
                  >
                    <span
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '1.1rem',
                        fontWeight: 700,
                        color: 'var(--color-forest-dark)',
                      }}
                    >
                      {formatKES(product.price)}
                    </span>
                    <span
                      style={{
                        fontSize: '0.78rem',
                        color: 'var(--color-warm-gray)',
                        background: 'var(--color-cream)',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '0.25rem',
                      }}
                    >
                      Size {product.size}
                    </span>
                  </div>

                  {!isSold && (
                    <button
                      className="btn-primary"
                      onClick={() => addItem(product)}
                      style={{ width: '100%', padding: '0.625rem', fontSize: '0.85rem' }}
                    >
                      <ShoppingBag size={16} /> Add to Cart
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
