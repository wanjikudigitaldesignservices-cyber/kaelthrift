import { useState } from 'react';
import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, ShoppingBag, Heart, Ruler, Tag, Package, ShieldCheck, Minus, Plus, Check } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';
import ImageCarousel from '@/components/product/ImageCarousel';
import { formatKES } from '@/lib/whatsapp';
import { trackEvent, EVENTS } from '@/lib/analytics';

function getConditionBadgeClass(condition: string): string {
  switch (condition) {
    case 'New with tags':
      return 'badge badge-condition-new';
    case 'Excellent':
      return 'badge badge-condition-excellent';
    case 'Good':
      return 'badge badge-condition-good';
    default:
      return 'badge';
  }
}

export default function ProductDetail() {
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const { product, loading, error } = useProduct(id);
  const { addItem, items } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const [qty, setQty] = useState(1);
  const [addedToCart, setAddedToCart] = useState(false);

  if (loading) {
    return (
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          minHeight: '60vh',
          color: 'var(--color-warm-gray)',
        }}
      >
        Loading product...
      </div>
    );
  }

  if (error || !product) {
    return (
      <div
        style={{
          textAlign: 'center',
          padding: '4rem 1.25rem',
          minHeight: '60vh',
        }}
      >
        <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>Product not found</h2>
        <p style={{ color: 'var(--color-warm-gray)', marginBottom: '1.5rem' }}>
          This item may have been sold or removed.
        </p>
        <Link to="/shop" className="btn-primary">
          <ArrowLeft size={16} />
          Back to shop
        </Link>
      </div>
    );
  }

  const isSold = product.status === 'sold' || product.quantity === 0;
  const wishlisted = isWishlisted(product.id);
  const inCart = items.find((item) => item.product.id === product.id);
  const maxQty = product.quantity - (inCart?.quantity || 0);

  const measurements = product.measurements || {};
  const hasMeasurements = Object.values(measurements).some((v) => v && v.trim() !== '');

  const handleAddToCart = () => {
    addItem(product, qty);
    setAddedToCart(true);
    trackEvent(EVENTS.PRODUCT_VIEW, product.id);
    setTimeout(() => setAddedToCart(false), 2000);
  };

  void location; // referenced for potential future use

  return (
    <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '1.5rem 1.25rem 3rem' }}>
      {/* Back link */}
      <Link
        to="/shop"
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          color: 'var(--color-warm-gray)',
          textDecoration: 'none',
          fontWeight: 500,
          fontSize: '0.9rem',
          marginBottom: '1.25rem',
        }}
      >
        <ArrowLeft size={16} />
        Back to shop
      </Link>

      <div className="product-detail-grid">
        {/* Images */}
        <div style={{ position: 'relative' }}>
          <ImageCarousel images={product.images} alt={product.name} />

          {isSold && (
            <div
              className="sold-overlay"
              style={{ borderRadius: '1rem' }}
            >
              <span className="sold-stamp">SOLD</span>
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          {/* Name & Price */}
          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 800,
              marginBottom: '0.5rem',
              lineHeight: 1.2,
            }}
          >
            {product.name}
          </h1>

          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.75rem',
              marginBottom: '1rem',
              flexWrap: 'wrap',
            }}
          >
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.5rem',
                fontWeight: 700,
                color: 'var(--color-forest-dark)',
              }}
            >
              {formatKES(product.price)}
            </span>
            <span className={getConditionBadgeClass(product.condition)}>
              {product.condition}
            </span>
            {product.quantity === 1 && !isSold && (
              <span className="badge badge-scarcity">1 of 1</span>
            )}
          </div>

          {/* Quantity */}
          {!isSold && (
            <div style={{ marginBottom: '1rem' }}>
              <span className={`quantity-badge ${product.quantity <= 2 ? 'low-stock' : ''}`}>
                <Package size={12} />
                {product.quantity} available
              </span>
            </div>
          )}

          {/* Size */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginBottom: '0.75rem',
              padding: '0.75rem 1rem',
              background: 'var(--color-cream)',
              borderRadius: '0.5rem',
            }}
          >
            <Tag size={16} color="var(--color-forest)" />
            <span style={{ fontWeight: 600 }}>Size:</span>
            <span>{product.size}</span>
          </div>

          {/* Measurements */}
          {hasMeasurements && (
            <div
              style={{
                marginBottom: '1rem',
                padding: '1rem',
                background: 'white',
                borderRadius: '0.5rem',
                border: '1px solid var(--color-cream-dark)',
              }}
            >
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  marginBottom: '0.75rem',
                }}
              >
                <Ruler size={16} color="var(--color-forest)" />
                <span style={{ fontWeight: 700, fontSize: '0.9rem' }}>Measurements</span>
              </div>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))',
                  gap: '0.5rem',
                }}
              >
                {Object.entries(measurements).map(
                  ([key, value]) =>
                    value &&
                    value.trim() !== '' && (
                      <div key={key}>
                        <span
                          style={{
                            fontSize: '0.75rem',
                            color: 'var(--color-warm-gray)',
                            textTransform: 'capitalize',
                          }}
                        >
                          {key}
                        </span>
                        <div style={{ fontWeight: 600, fontSize: '0.9rem' }}>{value}</div>
                      </div>
                    )
                )}
              </div>
            </div>
          )}

          {/* Description */}
          {product.description && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.9rem',
                  fontWeight: 700,
                  marginBottom: '0.5rem',
                  color: 'var(--color-charcoal)',
                }}
              >
                Description
              </h3>
              <p
                style={{
                  color: 'var(--color-warm-gray)',
                  lineHeight: 1.7,
                  fontSize: '0.9rem',
                  whiteSpace: 'pre-wrap',
                }}
              >
                {product.description}
              </p>
            </div>
          )}

          {/* Add to Cart / Sold */}
          {!isSold ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {/* Quantity Selector */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Quantity:</span>
                <div className="quantity-stepper">
                  <button
                    onClick={() => setQty(Math.max(1, qty - 1))}
                    className="qty-btn"
                    disabled={qty <= 1}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={14} />
                  </button>
                  <span className="qty-value">{qty}</span>
                  <button
                    onClick={() => setQty(Math.min(maxQty, qty + 1))}
                    className="qty-btn"
                    disabled={qty >= maxQty}
                    aria-label="Increase quantity"
                  >
                    <Plus size={14} />
                  </button>
                </div>
              </div>

              {/* Add to Cart Button */}
              <button
                className={`btn-primary ${addedToCart ? 'btn-added' : ''}`}
                onClick={handleAddToCart}
                disabled={maxQty <= 0}
                style={{
                  padding: '1rem',
                  fontSize: '1.05rem',
                  width: '100%',
                  background: addedToCart ? 'var(--color-sage)' : undefined,
                }}
              >
                {addedToCart ? (
                  <>
                    <Check size={20} /> Added to Cart!
                  </>
                ) : maxQty <= 0 ? (
                  'Already in Cart'
                ) : (
                  <>
                    <ShoppingBag size={20} /> Add to Cart — {formatKES(product.price * qty)}
                  </>
                )}
              </button>

              {/* Wishlist Button */}
              <button
                className="btn-outline"
                onClick={() => toggleWishlist(product.id)}
                style={{ width: '100%' }}
              >
                <Heart
                  size={18}
                  fill={wishlisted ? 'var(--color-terracotta)' : 'none'}
                  color={wishlisted ? 'var(--color-terracotta)' : 'currentColor'}
                />
                {wishlisted ? 'Remove from Wishlist' : 'Add to Wishlist'}
              </button>
            </div>
          ) : (
            <div
              style={{
                padding: '1rem',
                background: 'var(--color-cream)',
                borderRadius: '0.75rem',
                textAlign: 'center',
                color: 'var(--color-sold-red)',
                fontWeight: 600,
              }}
            >
              This item has been sold
            </div>
          )}

          {/* Trust badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              marginTop: '1rem',
              color: 'var(--color-warm-gray)',
              fontSize: '0.8rem',
            }}
          >
            <ShieldCheck size={16} color="var(--color-sage)" />
            <span>Quality checked · Exact measurements provided · Secure checkout</span>
          </div>
        </div>
      </div>
    </div>
  );
}
