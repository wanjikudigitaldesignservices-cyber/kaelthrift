import { useParams, Link, useLocation } from 'react-router-dom';
import { ArrowLeft, MessageCircle, Ruler, Tag, Package, ShieldCheck } from 'lucide-react';
import { useProduct } from '@/hooks/useProducts';
import ImageCarousel from '@/components/product/ImageCarousel';
import { getOrderWhatsAppLink, formatKES } from '@/lib/whatsapp';
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
  const productUrl = `${window.location.origin}${location.pathname}`;
  const whatsAppLink = getOrderWhatsAppLink(product.name, product.price, productUrl);

  const measurements = product.measurements || {};
  const hasMeasurements = Object.values(measurements).some((v) => v && v.trim() !== '');

  const handleOrderClick = () => {
    trackEvent(EVENTS.WHATSAPP_ORDER_CLICK, product.id);
  };

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

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '2rem',
        }}
        className="md:grid-cols-2"
      >
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

          {/* WhatsApp Order Button */}
          {!isSold ? (
            <a
              href={whatsAppLink}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-whatsapp"
              onClick={handleOrderClick}
              style={{ marginBottom: '0.75rem' }}
            >
              <MessageCircle size={20} />
              Order via WhatsApp
            </a>
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
            <span>Quality checked · Exact measurements provided · No returns on thrift items</span>
          </div>
        </div>
      </div>
    </div>
  );
}
