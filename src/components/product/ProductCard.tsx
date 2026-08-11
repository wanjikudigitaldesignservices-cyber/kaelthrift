import { Link } from 'react-router-dom';
import { Package, Heart, ShoppingBag } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatKES } from '@/lib/whatsapp';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

interface ProductCardProps {
  product: Product;
}

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

export default function ProductCard({ product }: ProductCardProps) {
  const { addItem } = useCart();
  const { isWishlisted, toggleWishlist } = useWishlist();
  const isSold = product.status === 'sold' || product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 2;
  const wishlisted = isWishlisted(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isSold) addItem(product);
  };

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <Link
      to={isSold ? '#' : `/product/${product.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        pointerEvents: isSold ? 'none' : 'auto',
      }}
    >
      <div className="card product-card" style={{ position: 'relative', opacity: isSold ? 0.7 : 1 }}>
        {/* Image */}
        <div
          style={{
            position: 'relative',
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            backgroundColor: 'var(--color-cream)',
          }}
        >
          {product.images && product.images.length > 0 ? (
            <>
              <img
                src={product.images[0]}
                alt={product.name}
                loading="lazy"
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                  transition: 'opacity 0.3s ease, transform 0.4s ease',
                  position: 'absolute',
                  inset: 0,
                  zIndex: 1,
                }}
                className={product.images.length > 1 ? 'hover-fade' : ''}
              />
              {product.images.length > 1 && (
                <img
                  src={product.images[1]}
                  alt={`${product.name} alternate view`}
                  loading="lazy"
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    transition: 'transform 0.4s ease',
                    position: 'absolute',
                    inset: 0,
                  }}
                />
              )}
            </>
          ) : (
            <div
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'var(--color-warm-gray-light)',
              }}
            >
              <Package size={48} />
            </div>
          )}

          {/* Sold overlay */}
          {isSold && (
            <div className="sold-overlay">
              <span className="sold-stamp">SOLD</span>
            </div>
          )}

          {/* Quantity / Scarcity badges */}
          <div
            style={{
              position: 'absolute',
              top: '0.5rem',
              left: '0.5rem',
              display: 'flex',
              flexDirection: 'column',
              gap: '0.25rem',
              zIndex: 3,
            }}
          >
            {product.quantity === 1 && !isSold && (
              <span className="badge badge-scarcity">1 of 1</span>
            )}
            {isLowStock && product.quantity > 1 && (
              <span className="quantity-badge low-stock">
                Only {product.quantity} left
              </span>
            )}
          </div>

          {/* Condition badge */}
          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', zIndex: 3 }}>
            <span className={getConditionBadgeClass(product.condition)}>
              {product.condition}
            </span>
          </div>

          {/* Hover Actions Overlay */}
          {!isSold && (
            <div className="product-card-actions">
              <button
                onClick={handleToggleWishlist}
                className={`product-action-btn ${wishlisted ? 'wishlisted' : ''}`}
                aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
              >
                <Heart
                  size={18}
                  fill={wishlisted ? 'var(--color-terracotta)' : 'none'}
                  color={wishlisted ? 'var(--color-terracotta)' : 'white'}
                />
              </button>
              <button
                onClick={handleAddToCart}
                className="product-action-btn cart-action"
                aria-label="Add to cart"
              >
                <ShoppingBag size={18} />
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div style={{ padding: '0.875rem 1rem' }}>
          <h3
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              fontWeight: 600,
              color: 'var(--color-charcoal)',
              marginBottom: '0.25rem',
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
              marginTop: '0.25rem',
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
                fontWeight: 500,
                background: 'var(--color-cream)',
                padding: '0.15rem 0.5rem',
                borderRadius: '0.25rem',
              }}
            >
              Size {product.size}
            </span>
          </div>

          {/* Quantity available */}
          {!isSold && product.quantity > 2 && (
            <div style={{ marginTop: '0.375rem' }}>
              <span className="quantity-badge">
                {product.quantity} available
              </span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
