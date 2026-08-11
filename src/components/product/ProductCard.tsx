import { Link } from 'react-router-dom';
import { Package } from 'lucide-react';
import type { Product } from '@/lib/types';
import { formatKES } from '@/lib/whatsapp';

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
  const isSold = product.status === 'sold' || product.quantity === 0;
  const isLowStock = product.quantity > 0 && product.quantity <= 2;

  return (
    <Link
      to={isSold ? '#' : `/product/${product.id}`}
      style={{
        textDecoration: 'none',
        color: 'inherit',
        pointerEvents: isSold ? 'none' : 'auto',
      }}
    >
      <div className="card" style={{ position: 'relative', opacity: isSold ? 0.7 : 1 }}>
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
            <img
              src={product.images[0]}
              alt={product.name}
              loading="lazy"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                transition: 'transform 0.4s ease',
              }}
              onMouseOver={(e) => {
                (e.target as HTMLImageElement).style.transform = 'scale(1.05)';
              }}
              onMouseOut={(e) => {
                (e.target as HTMLImageElement).style.transform = 'scale(1)';
              }}
            />
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
          <div style={{ position: 'absolute', top: '0.5rem', left: '0.5rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
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
          <div style={{ position: 'absolute', top: '0.5rem', right: '0.5rem' }}>
            <span className={getConditionBadgeClass(product.condition)}>
              {product.condition}
            </span>
          </div>
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
