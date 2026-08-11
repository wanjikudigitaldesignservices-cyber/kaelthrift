import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  ArrowRight,
  ShoppingBag,
  MapPin,
  CreditCard,
  Loader2,
  Phone,
  Truck,
  Shield,
} from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useOrders, type DeliveryDetails, type PaymentMethod } from '@/hooks/useOrders';
import { formatKES } from '@/lib/whatsapp';

type CheckoutStep = 'summary' | 'delivery' | 'payment';

const STEPS: { key: CheckoutStep; label: string; icon: typeof ShoppingBag }[] = [
  { key: 'summary', label: 'Order Summary', icon: ShoppingBag },
  { key: 'delivery', label: 'Delivery', icon: MapPin },
  { key: 'payment', label: 'Payment', icon: CreditCard },
];

export default function Checkout() {
  const navigate = useNavigate();
  const { items, total, clearCart } = useCart();
  const { loading, createOrder, DELIVERY_FEE } = useOrders();

  const [step, setStep] = useState<CheckoutStep>('summary');
  const [delivery, setDelivery] = useState<DeliveryDetails>({
    fullName: '',
    phone: '',
    email: '',
    address: '',
    city: 'Nairobi',
    notes: '',
  });
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('mpesa');
  const [errors, setErrors] = useState<Record<string, string>>({});

  const stepIndex = STEPS.findIndex((s) => s.key === step);

  const validateDelivery = (): boolean => {
    const errs: Record<string, string> = {};
    if (!delivery.fullName.trim()) errs.fullName = 'Full name is required';
    if (!delivery.phone.trim()) errs.phone = 'Phone number is required';
    else if (!/^(?:\+?254|0)\d{9}$/.test(delivery.phone.replace(/\s/g, '')))
      errs.phone = 'Enter a valid Kenyan phone number';
    if (!delivery.address.trim()) errs.address = 'Delivery address is required';
    if (!delivery.city.trim()) errs.city = 'City is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleNext = () => {
    if (step === 'summary') {
      setStep('delivery');
    } else if (step === 'delivery') {
      if (validateDelivery()) setStep('payment');
    }
  };

  const handleBack = () => {
    if (step === 'delivery') setStep('summary');
    else if (step === 'payment') setStep('delivery');
  };

  const handlePlaceOrder = async () => {
    const order = await createOrder(items, delivery, paymentMethod);
    clearCart();
    navigate(`/order-confirmation/${order.id}`);
  };

  // Empty cart redirect
  if (items.length === 0) {
    return (
      <div
        style={{
          maxWidth: '600px',
          margin: '0 auto',
          padding: '4rem 1.25rem',
          textAlign: 'center',
        }}
      >
        <ShoppingBag size={64} color="var(--color-cream-dark)" style={{ marginBottom: '1rem' }} />
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
          }}
        >
          Your cart is empty
        </h1>
        <p style={{ color: 'var(--color-warm-gray)', marginBottom: '1.5rem' }}>
          Add some items to your cart before checking out.
        </p>
        <Link to="/shop" className="btn-primary">
          Browse Shop <ArrowRight size={16} />
        </Link>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '1.5rem 1.25rem 4rem' }}>
      {/* Back link */}
      <button
        onClick={() => (step === 'summary' ? navigate(-1) : handleBack())}
        style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.375rem',
          color: 'var(--color-warm-gray)',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          fontWeight: 500,
          fontSize: '0.9rem',
          marginBottom: '1.5rem',
          padding: 0,
        }}
      >
        <ArrowLeft size={16} />
        {step === 'summary' ? 'Back to cart' : 'Back'}
      </button>

      {/* Step Indicator */}
      <div className="checkout-steps">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const isActive = i === stepIndex;
          const isCompleted = i < stepIndex;
          return (
            <div key={s.key} className="checkout-step-item">
              <div
                className={`checkout-step-circle ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
              >
                <Icon size={16} />
              </div>
              <span
                style={{
                  fontSize: '0.75rem',
                  fontWeight: isActive ? 700 : 500,
                  color: isActive ? 'var(--color-forest)' : 'var(--color-warm-gray)',
                  marginTop: '0.25rem',
                }}
              >
                {s.label}
              </span>
              {i < STEPS.length - 1 && <div className="checkout-step-line" />}
            </div>
          );
        })}
      </div>

      {/* ── Step 1: Order Summary ──────────────────────────── */}
      {step === 'summary' && (
        <div className="checkout-card">
          <h2 className="checkout-section-title">Order Summary</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {items.map((item) => (
              <div key={item.product.id} className="checkout-item">
                <img
                  src={item.product.images[0]}
                  alt={item.product.name}
                  className="checkout-item-img"
                />
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontWeight: 600, fontSize: '0.9rem', marginBottom: '0.125rem' }}>
                    {item.product.name}
                  </h4>
                  <p style={{ fontSize: '0.8rem', color: 'var(--color-warm-gray)' }}>
                    Size {item.product.size} · Qty {item.quantity}
                  </p>
                </div>
                <span
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontWeight: 700,
                    color: 'var(--color-forest-dark)',
                  }}
                >
                  {formatKES(item.product.price * item.quantity)}
                </span>
              </div>
            ))}
          </div>

          <div className="checkout-totals">
            <div className="checkout-total-row">
              <span>Subtotal</span>
              <span>{formatKES(total)}</span>
            </div>
            <div className="checkout-total-row">
              <span>Delivery</span>
              <span>{formatKES(DELIVERY_FEE)}</span>
            </div>
            <div className="checkout-total-row total">
              <span>Total</span>
              <span>{formatKES(total + DELIVERY_FEE)}</span>
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleNext}
            style={{ width: '100%', padding: '0.875rem', marginTop: '1rem' }}
          >
            Continue to Delivery <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* ── Step 2: Delivery Details ───────────────────────── */}
      {step === 'delivery' && (
        <div className="checkout-card">
          <h2 className="checkout-section-title">
            <Truck size={20} /> Delivery Details
          </h2>

          <div className="checkout-form">
            <div className="form-group">
              <label className="label" htmlFor="fullName">Full Name *</label>
              <input
                id="fullName"
                className={`input ${errors.fullName ? 'input-error' : ''}`}
                value={delivery.fullName}
                onChange={(e) => setDelivery({ ...delivery, fullName: e.target.value })}
                placeholder="Jane Wanjiku"
              />
              {errors.fullName && <span className="form-error">{errors.fullName}</span>}
            </div>

            <div className="form-group">
              <label className="label" htmlFor="phone">Phone Number *</label>
              <div style={{ position: 'relative' }}>
                <Phone
                  size={16}
                  style={{
                    position: 'absolute',
                    left: '0.875rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    color: 'var(--color-warm-gray-light)',
                  }}
                />
                <input
                  id="phone"
                  className={`input ${errors.phone ? 'input-error' : ''}`}
                  value={delivery.phone}
                  onChange={(e) => setDelivery({ ...delivery, phone: e.target.value })}
                  placeholder="0712 345 678"
                  style={{ paddingLeft: '2.5rem' }}
                />
              </div>
              {errors.phone && <span className="form-error">{errors.phone}</span>}
            </div>

            <div className="form-group">
              <label className="label" htmlFor="email">Email (optional)</label>
              <input
                id="email"
                className="input"
                type="email"
                value={delivery.email}
                onChange={(e) => setDelivery({ ...delivery, email: e.target.value })}
                placeholder="jane@example.com"
              />
            </div>

            <div className="form-group">
              <label className="label" htmlFor="address">Delivery Address *</label>
              <input
                id="address"
                className={`input ${errors.address ? 'input-error' : ''}`}
                value={delivery.address}
                onChange={(e) => setDelivery({ ...delivery, address: e.target.value })}
                placeholder="Building, street, area"
              />
              {errors.address && <span className="form-error">{errors.address}</span>}
            </div>

            <div className="form-group">
              <label className="label" htmlFor="city">City *</label>
              <select
                id="city"
                className={`select ${errors.city ? 'input-error' : ''}`}
                value={delivery.city}
                onChange={(e) => setDelivery({ ...delivery, city: e.target.value })}
              >
                <option value="Nairobi">Nairobi</option>
                <option value="Mombasa">Mombasa</option>
                <option value="Kisumu">Kisumu</option>
                <option value="Nakuru">Nakuru</option>
                <option value="Eldoret">Eldoret</option>
                <option value="Other">Other</option>
              </select>
              {errors.city && <span className="form-error">{errors.city}</span>}
            </div>

            <div className="form-group">
              <label className="label" htmlFor="notes">Delivery Notes (optional)</label>
              <textarea
                id="notes"
                className="input"
                value={delivery.notes}
                onChange={(e) => setDelivery({ ...delivery, notes: e.target.value })}
                placeholder="e.g. Gate code, landmark"
                rows={3}
                style={{ resize: 'vertical' }}
              />
            </div>
          </div>

          <button
            className="btn-primary"
            onClick={handleNext}
            style={{ width: '100%', padding: '0.875rem', marginTop: '1rem' }}
          >
            Continue to Payment <ArrowRight size={16} />
          </button>
        </div>
      )}

      {/* ── Step 3: Payment ────────────────────────────────── */}
      {step === 'payment' && (
        <div className="checkout-card">
          <h2 className="checkout-section-title">
            <CreditCard size={20} /> Payment Method
          </h2>

          <div className="payment-options">
            <label
              className={`payment-option ${paymentMethod === 'mpesa' ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="payment"
                value="mpesa"
                checked={paymentMethod === 'mpesa'}
                onChange={() => setPaymentMethod('mpesa')}
              />
              <div className="payment-option-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Phone size={20} color="var(--color-forest)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>M-Pesa</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-warm-gray)' }}>
                      Pay via M-Pesa — instructions sent after order
                    </div>
                  </div>
                </div>
              </div>
            </label>

            <label
              className={`payment-option ${paymentMethod === 'cod' ? 'selected' : ''}`}
            >
              <input
                type="radio"
                name="payment"
                value="cod"
                checked={paymentMethod === 'cod'}
                onChange={() => setPaymentMethod('cod')}
              />
              <div className="payment-option-content">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Truck size={20} color="var(--color-forest)" />
                  <div>
                    <div style={{ fontWeight: 700, fontSize: '0.95rem' }}>Cash on Delivery</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--color-warm-gray)' }}>
                      Pay when your order arrives
                    </div>
                  </div>
                </div>
              </div>
            </label>
          </div>

          {/* Order Total Summary */}
          <div className="checkout-totals" style={{ marginTop: '1.5rem' }}>
            <div className="checkout-total-row">
              <span>Subtotal ({items.length} items)</span>
              <span>{formatKES(total)}</span>
            </div>
            <div className="checkout-total-row">
              <span>Delivery to {delivery.city}</span>
              <span>{formatKES(DELIVERY_FEE)}</span>
            </div>
            <div className="checkout-total-row total">
              <span>Total</span>
              <span>{formatKES(total + DELIVERY_FEE)}</span>
            </div>
          </div>

          {/* Trust badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              justifyContent: 'center',
              margin: '1rem 0',
              color: 'var(--color-warm-gray)',
              fontSize: '0.8rem',
            }}
          >
            <Shield size={16} color="var(--color-sage)" />
            <span>Secure checkout · Quality guaranteed</span>
          </div>

          <button
            className="btn-primary"
            onClick={handlePlaceOrder}
            disabled={loading}
            style={{
              width: '100%',
              padding: '1rem',
              fontSize: '1.05rem',
              background: loading ? 'var(--color-warm-gray-light)' : undefined,
            }}
          >
            {loading ? (
              <>
                <Loader2 size={18} className="animate-spin" />
                Processing...
              </>
            ) : (
              <>Place Order — {formatKES(total + DELIVERY_FEE)}</>
            )}
          </button>
        </div>
      )}
    </div>
  );
}
