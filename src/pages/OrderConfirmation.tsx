import { useParams, Link } from 'react-router-dom';
import { CheckCircle, Package, ArrowRight, MessageCircle, Copy } from 'lucide-react';
import { useOrders } from '@/hooks/useOrders';
import { formatKES } from '@/lib/whatsapp';
import { useState } from 'react';

export default function OrderConfirmation() {
  const { orderId } = useParams<{ orderId: string }>();
  const { getOrder } = useOrders();
  const [copied, setCopied] = useState(false);

  const order = orderId ? getOrder(orderId) : null;

  if (!order) {
    return (
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '4rem 1.25rem',
          textAlign: 'center',
        }}
      >
        <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>
          Order not found
        </h1>
        <p style={{ color: 'var(--color-warm-gray)', marginBottom: '1.5rem' }}>
          This order may have expired or the link is invalid.
        </p>
        <Link to="/shop" className="btn-primary">
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  const handleCopyOrderNumber = () => {
    navigator.clipboard.writeText(order.orderNumber);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const whatsappMessage = `Hi KaelThrift! I just placed order ${order.orderNumber}. Total: ${formatKES(order.total)}. Please confirm. 🙏`;
  const whatsappLink = `https://wa.me/254740396075?text=${encodeURIComponent(whatsappMessage)}`;

  return (
    <div style={{ maxWidth: '650px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
      {/* Success Header */}
      <div
        style={{
          textAlign: 'center',
          marginBottom: '2rem',
        }}
      >
        <div
          className="animate-fade-in-up delay-100"
          style={{
            width: '80px',
            height: '80px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #E8F5E9, #C8E6C9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 1.25rem',
          }}
        >
          <CheckCircle size={40} color="var(--color-forest)" />
        </div>
        <h1
          className="animate-fade-in-up delay-200"
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(1.5rem, 4vw, 2rem)',
            fontWeight: 900,
            marginBottom: '0.5rem',
          }}
        >
          Order Placed! 🎉
        </h1>
        <p
          className="animate-fade-in-up delay-300"
          style={{
            color: 'var(--color-warm-gray)',
            fontSize: '1rem',
            maxWidth: '400px',
            margin: '0 auto',
          }}
        >
          Thank you for shopping with KaelThrift. Your unique finds are on their way!
        </p>
      </div>

      {/* Order Number Card */}
      <div
        className="animate-fade-in-up delay-300 checkout-card"
        style={{
          background: 'linear-gradient(135deg, var(--color-forest-dark), var(--color-forest))',
          color: 'white',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.8rem', opacity: 0.8, marginBottom: '0.25rem' }}>
          Order Number
        </p>
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.5rem',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.5rem',
              fontWeight: 800,
              letterSpacing: '0.05em',
            }}
          >
            {order.orderNumber}
          </span>
          <button
            onClick={handleCopyOrderNumber}
            style={{
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '0.375rem',
              padding: '0.375rem',
              cursor: 'pointer',
              color: 'white',
            }}
            title="Copy order number"
          >
            <Copy size={16} />
          </button>
        </div>
        {copied && (
          <p style={{ fontSize: '0.75rem', opacity: 0.8, marginTop: '0.25rem' }}>
            Copied to clipboard!
          </p>
        )}
      </div>

      {/* Order Details */}
      <div className="animate-fade-in-up delay-400 checkout-card">
        <h3
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.1rem',
            fontWeight: 700,
            marginBottom: '1rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem',
          }}
        >
          <Package size={18} /> Order Details
        </h3>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
          {order.items.map((item) => (
            <div
              key={item.productId}
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: '0.75rem 0',
                borderBottom: '1px solid var(--color-cream-dark)',
              }}
            >
              <div>
                <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.productName}</p>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-gray)' }}>
                  Size {item.size} · Qty {item.quantity}
                </p>
              </div>
              <span style={{ fontWeight: 600 }}>{formatKES(item.price * item.quantity)}</span>
            </div>
          ))}
        </div>

        <div className="checkout-totals" style={{ marginTop: '0.75rem' }}>
          <div className="checkout-total-row">
            <span>Subtotal</span>
            <span>{formatKES(order.subtotal)}</span>
          </div>
          <div className="checkout-total-row">
            <span>Delivery</span>
            <span>{formatKES(order.deliveryFee)}</span>
          </div>
          <div className="checkout-total-row total">
            <span>Total Paid</span>
            <span>{formatKES(order.total)}</span>
          </div>
        </div>
      </div>

      {/* Delivery Info */}
      <div className="animate-fade-in-up delay-400 checkout-card">
        <h3
          style={{
            fontSize: '0.9rem',
            fontWeight: 700,
            marginBottom: '0.75rem',
            color: 'var(--color-charcoal)',
          }}
        >
          Delivering to
        </h3>
        <p style={{ fontWeight: 600 }}>{order.delivery.fullName}</p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-warm-gray)' }}>
          {order.delivery.address}, {order.delivery.city}
        </p>
        <p style={{ fontSize: '0.9rem', color: 'var(--color-warm-gray)' }}>
          {order.delivery.phone}
        </p>
        <p
          style={{
            fontSize: '0.8rem',
            color: 'var(--color-warm-gray)',
            marginTop: '0.5rem',
            fontStyle: 'italic',
          }}
        >
          Payment: {order.paymentMethod === 'mpesa' ? 'M-Pesa' : 'Cash on Delivery'}
        </p>
      </div>

      {/* Actions */}
      <div
        className="animate-fade-in-up delay-500"
        style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '1rem' }}
      >
        <a
          href={whatsappLink}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
        >
          <MessageCircle size={18} />
          Confirm on WhatsApp
        </a>
        <Link
          to="/shop"
          className="btn-outline"
          style={{ width: '100%', justifyContent: 'center' }}
        >
          Continue Shopping <ArrowRight size={16} />
        </Link>
      </div>
    </div>
  );
}
