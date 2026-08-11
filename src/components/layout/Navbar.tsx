import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, Heart } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWishlist } from '@/hooks/useWishlist';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { itemCount, openCart } = useCart();
  const { wishlist } = useWishlist();

  return (
    <nav
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 100,
        background: 'rgba(250, 247, 242, 0.92)',
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid var(--color-cream-dark)',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0.75rem 1.25rem',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        {/* Logo */}
        <Link
          to="/"
          style={{
            display: 'flex',
            alignItems: 'center',
            textDecoration: 'none',
          }}
        >
          <img
            src="/logo.png"
            alt="KaelThrift Logo"
            style={{
              height: '48px',
              width: 'auto',
              objectFit: 'contain',
            }}
          />
        </Link>

        {/* Desktop Nav */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '2rem',
          }}
          className="nav-desktop"
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              style={{
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '0.95rem',
                color:
                  location.pathname === link.path
                    ? 'var(--color-forest)'
                    : 'var(--color-warm-gray)',
                borderBottom:
                  location.pathname === link.path
                    ? '2px solid var(--color-terracotta)'
                    : '2px solid transparent',
                paddingBottom: '0.25rem',
                transition: 'all 0.2s ease',
              }}
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* Right Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {/* Wishlist */}
          <Link
            to="/wishlist"
            className="nav-icon-btn"
            aria-label="Wishlist"
          >
            <Heart size={22} />
            {wishlist.length > 0 && (
              <span className="nav-badge wishlist-badge">{wishlist.length}</span>
            )}
          </Link>

          {/* Cart */}
          <button
            onClick={openCart}
            className="nav-icon-btn"
            aria-label="Open cart"
          >
            <ShoppingBag size={22} />
            {itemCount > 0 && (
              <span className="nav-badge cart-badge">{itemCount}</span>
            )}
          </button>

          {/* Mobile Hamburger */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="nav-hamburger"
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              color: 'var(--color-charcoal)',
              padding: '0.5rem',
            }}
            aria-label="Toggle menu"
          >
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="nav-mobile-menu"
          style={{
            padding: '1rem 1.25rem 1.5rem',
            background: 'var(--color-linen)',
            borderTop: '1px solid var(--color-cream-dark)',
            animation: 'slide-up 0.3s ease-out',
          }}
        >
          {NAV_LINKS.map((link) => (
            <Link
              key={link.path}
              to={link.path}
              onClick={() => setIsOpen(false)}
              style={{
                display: 'block',
                padding: '0.75rem 0',
                textDecoration: 'none',
                fontWeight: 600,
                fontSize: '1.1rem',
                color:
                  location.pathname === link.path
                    ? 'var(--color-forest)'
                    : 'var(--color-charcoal)',
                borderBottom: '1px solid var(--color-cream-dark)',
              }}
            >
              {link.label}
            </Link>
          ))}
          <Link
            to="/wishlist"
            onClick={() => setIsOpen(false)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              padding: '0.75rem 0',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '1.1rem',
              color: 'var(--color-charcoal)',
              borderBottom: '1px solid var(--color-cream-dark)',
            }}
          >
            <Heart size={18} /> Wishlist
            {wishlist.length > 0 && (
              <span className="badge badge-available">{wishlist.length}</span>
            )}
          </Link>
        </div>
      )}
    </nav>
  );
}
