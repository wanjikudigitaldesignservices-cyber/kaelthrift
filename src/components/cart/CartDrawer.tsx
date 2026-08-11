import { Link } from 'react-router-dom';
import { X, Minus, Plus, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { formatKES } from '@/lib/whatsapp';

export default function CartDrawer() {
  const { items, itemCount, total, isOpen, closeCart, removeItem, updateQuantity } = useCart();

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="cart-backdrop" onClick={closeCart} />

      {/* Drawer */}
      <div className="cart-drawer">
        {/* Header */}
        <div className="cart-drawer-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShoppingBag size={20} />
            <h2
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.25rem',
                fontWeight: 700,
                color: 'var(--color-charcoal)',
              }}
            >
              Your Cart
            </h2>
            {itemCount > 0 && (
              <span className="badge badge-available">{itemCount}</span>
            )}
          </div>
          <button
            onClick={closeCart}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-warm-gray)',
              padding: '0.375rem',
              borderRadius: '0.375rem',
              transition: 'background 0.15s',
            }}
            aria-label="Close cart"
          >
            <X size={22} />
          </button>
        </div>

        {/* Cart Items */}
        <div className="cart-drawer-body">
          {items.length === 0 ? (
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '3rem 1.5rem',
                textAlign: 'center',
                gap: '1rem',
                height: '100%',
              }}
            >
              <ShoppingBag size={56} color="var(--color-cream-dark)" />
              <div>
                <p
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '1.2rem',
                    fontWeight: 700,
                    color: 'var(--color-charcoal)',
                    marginBottom: '0.375rem',
                  }}
                >
                  Your cart is empty
                </p>
                <p style={{ color: 'var(--color-warm-gray)', fontSize: '0.9rem' }}>
                  Discover unique thrift finds in our shop
                </p>
              </div>
              <Link
                to="/shop"
                className="btn-primary"
                onClick={closeCart}
                style={{ marginTop: '0.5rem' }}
              >
                Start Shopping <ArrowRight size={16} />
              </Link>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {items.map((item) => (
                <div key={item.product.id} className="cart-item">
                  {/* Image */}
                  <Link
                    to={`/product/${item.product.id}`}
                    onClick={closeCart}
                    style={{ flexShrink: 0 }}
                  >
                    <img
                      src={item.product.images[0]}
                      alt={item.product.name}
                      className="cart-item-image"
                    />
                  </Link>

                  {/* Details */}
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <Link
                      to={`/product/${item.product.id}`}
                      onClick={closeCart}
                      style={{
                        textDecoration: 'none',
                        color: 'var(--color-charcoal)',
                      }}
                    >
                      <h4
                        style={{
                          fontWeight: 600,
                          fontSize: '0.88rem',
                          marginBottom: '0.125rem',
                          overflow: 'hidden',
                          textOverflow: 'ellipsis',
                          whiteSpace: 'nowrap',
                        }}
                      >
                        {item.product.name}
                      </h4>
                    </Link>
                    <p
                      style={{
                        fontSize: '0.75rem',
                        color: 'var(--color-warm-gray)',
                        marginBottom: '0.5rem',
                      }}
                    >
                      Size {item.product.size}
                    </p>

                    <div
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                      }}
                    >
                      {/* Quantity Controls */}
                      <div className="quantity-stepper">
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity - 1)
                          }
                          className="qty-btn"
                          aria-label="Decrease quantity"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="qty-value">{item.quantity}</span>
                        <button
                          onClick={() =>
                            updateQuantity(item.product.id, item.quantity + 1)
                          }
                          className="qty-btn"
                          disabled={item.quantity >= item.product.quantity}
                          aria-label="Increase quantity"
                        >
                          <Plus size={14} />
                        </button>
                      </div>

                      {/* Price */}
                      <span
                        style={{
                          fontFamily: 'var(--font-display)',
                          fontWeight: 700,
                          fontSize: '0.95rem',
                          color: 'var(--color-forest-dark)',
                        }}
                      >
                        {formatKES(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeItem(item.product.id)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      color: 'var(--color-warm-gray-light)',
                      padding: '0.25rem',
                      alignSelf: 'flex-start',
                      transition: 'color 0.15s',
                    }}
                    aria-label={`Remove ${item.product.name}`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="cart-drawer-footer">
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1rem',
              }}
            >
              <span style={{ fontWeight: 600, color: 'var(--color-warm-gray)' }}>
                Subtotal
              </span>
              <span
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                  color: 'var(--color-forest-dark)',
                }}
              >
                {formatKES(total)}
              </span>
            </div>
            <p
              style={{
                fontSize: '0.78rem',
                color: 'var(--color-warm-gray)',
                marginBottom: '0.75rem',
                textAlign: 'center',
              }}
            >
              Delivery fee calculated at checkout
            </p>
            <Link
              to="/checkout"
              className="btn-primary"
              onClick={closeCart}
              style={{ width: '100%', padding: '0.875rem', fontSize: '1rem' }}
            >
              Checkout <ArrowRight size={18} />
            </Link>
          </div>
        )}
      </div>
    </>
  );
}
