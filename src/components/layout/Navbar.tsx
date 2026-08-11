import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';

const NAV_LINKS = [
  { label: 'Home', path: '/' },
  { label: 'Shop', path: '/shop' },
  { label: 'About', path: '/about' },
];

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

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
              objectFit: 'contain'
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
          className="hidden md:flex"
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

        {/* Mobile Hamburger */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden"
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

      {/* Mobile Menu */}
      {isOpen && (
        <div
          className="md:hidden"
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
        </div>
      )}
    </nav>
  );
}
