import { Link } from 'react-router-dom';
import { ShoppingBag, MessageCircle } from 'lucide-react';
import { getGeneralWhatsAppLink } from '@/lib/whatsapp';

export default function Footer() {
  return (
    <footer
      style={{
        background: 'var(--color-forest-dark)',
        color: 'var(--color-cream)',
        padding: '3rem 1.25rem 1.5rem',
        marginTop: '4rem',
      }}
    >
      <div
        style={{
          maxWidth: '1200px',
          margin: '0 auto',
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '2rem',
        }}
      >
        {/* Brand */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
            <ShoppingBag size={22} color="var(--color-sage-light)" />
            <span
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '1.3rem',
                fontWeight: 700,
              }}
            >
              KaelThrift
            </span>
          </div>
          <p style={{ fontSize: '0.875rem', lineHeight: 1.7, opacity: 0.85 }}>
            Curated vintage & pre-loved fashion. Every piece is unique — just like you.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
              color: 'var(--color-sage-light)',
            }}
          >
            Quick Links
          </h4>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {[
              { label: 'Shop All', path: '/shop' },
              { label: 'About Us', path: '/about' },
            ].map((link) => (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  color: 'var(--color-cream)',
                  textDecoration: 'none',
                  fontSize: '0.9rem',
                  opacity: 0.85,
                  transition: 'opacity 0.2s',
                }}
              >
                {link.label}
              </Link>
            ))}
          </div>
        </div>

        {/* Contact */}
        <div>
          <h4
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.85rem',
              fontWeight: 700,
              textTransform: 'uppercase',
              letterSpacing: '0.08em',
              marginBottom: '0.75rem',
              color: 'var(--color-sage-light)',
            }}
          >
            Get in Touch
          </h4>
          <a
            href={getGeneralWhatsAppLink()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              color: 'var(--color-whatsapp)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            <MessageCircle size={16} />
            Chat on WhatsApp
          </a>
        </div>
      </div>

      {/* Bottom bar */}
      <div
        style={{
          borderTop: '1px solid rgba(255,255,255,0.12)',
          marginTop: '2rem',
          paddingTop: '1rem',
          textAlign: 'center',
        }}
      >
        <p style={{ fontSize: '0.78rem', opacity: 0.6 }}>
          © {new Date().getFullYear()} KaelThrift. All rights reserved.
        </p>
        <p style={{ fontSize: '0.7rem', opacity: 0.5, marginTop: '0.25rem' }}>
          We respect your privacy under the Kenya Data Protection Act 2019. No personal data is collected without consent.
        </p>
      </div>
    </footer>
  );
}
