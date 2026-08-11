import { MapPin, MessageCircle, ShieldCheck, Heart } from 'lucide-react';
import { getGeneralWhatsAppLink } from '@/lib/whatsapp';

export default function About() {
  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '2rem 1.25rem 4rem' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: 'clamp(2rem, 5vw, 2.75rem)',
            fontWeight: 900,
            marginBottom: '0.75rem',
          }}
        >
          Our Story
        </h1>
        <p
          style={{
            color: 'var(--color-warm-gray)',
            fontSize: '1.05rem',
            lineHeight: 1.7,
            maxWidth: '550px',
            margin: '0 auto',
          }}
        >
          Curated vintage & pre-loved fashion, handpicked for the modern Kenyan woman.
        </p>
      </div>

      {/* Story */}
      <section
        style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <Heart size={20} color="var(--color-terracotta)" />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              fontWeight: 700,
            }}
          >
            Why KaelThrift?
          </h2>
        </div>
        <div style={{ color: 'var(--color-warm-gray)', lineHeight: 1.8, fontSize: '0.95rem' }}>
          <p style={{ marginBottom: '1rem' }}>
            KaelThrift was born from a simple belief: fashion should be accessible, sustainable, and unique.
            We carefully curate pre-loved and vintage pieces that tell their own story — each item
            handpicked for quality, style, and value.
          </p>
          <p style={{ marginBottom: '1rem' }}>
            In a world of fast fashion, we choose to slow down. Every piece in our collection is
            one-of-a-kind, which means when you shop with us, you're not just buying clothes — you're
            finding pieces that no one else will have.
          </p>
          <p>
            Based in Kenya, we serve thrift lovers across the country with delivery options
            that bring curated fashion right to your doorstep.
          </p>
        </div>
      </section>

      {/* Location */}
      <section
        style={{
          background: 'white',
          borderRadius: '1rem',
          padding: '2rem',
          marginBottom: '2rem',
          boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.75rem' }}>
          <MapPin size={20} color="var(--color-terracotta)" />
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.3rem',
              fontWeight: 700,
            }}
          >
            Find Us
          </h2>
        </div>
        <p style={{ color: 'var(--color-warm-gray)', lineHeight: 1.7, fontSize: '0.95rem' }}>
          Based in Nairobi, Kenya 🇰🇪 — delivering nationwide.
        </p>
      </section>

      {/* Contact */}
      <section
        style={{
          background: 'linear-gradient(135deg, var(--color-forest-dark), var(--color-forest))',
          borderRadius: '1rem',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          color: 'white',
          marginBottom: '2rem',
        }}
      >
        <MessageCircle
          size={36}
          style={{ marginBottom: '0.75rem', opacity: 0.9 }}
        />
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 700,
            marginBottom: '0.5rem',
            color: 'white',
          }}
        >
          Let's Chat!
        </h2>
        <p
          style={{
            opacity: 0.9,
            marginBottom: '1.5rem',
            maxWidth: '400px',
            margin: '0 auto 1.5rem',
            lineHeight: 1.6,
          }}
        >
          Have questions? Want to request a specific item? Reach out anytime on WhatsApp.
        </p>
        <a
          href={getGeneralWhatsAppLink()}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-whatsapp"
          style={{
            maxWidth: '300px',
            margin: '0 auto',
            background: 'white',
            color: 'var(--color-whatsapp-dark)',
          }}
        >
          <MessageCircle size={18} />
          Chat on WhatsApp
        </a>
      </section>

      {/* Privacy Notice */}
      <section
        style={{
          background: 'var(--color-cream)',
          borderRadius: '1rem',
          padding: '1.5rem 2rem',
          border: '1px solid var(--color-cream-dark)',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
          <ShieldCheck size={18} color="var(--color-forest)" />
          <h3
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '0.9rem',
              fontWeight: 700,
              color: 'var(--color-charcoal)',
            }}
          >
            Privacy Notice
          </h3>
        </div>
        <p style={{ fontSize: '0.82rem', color: 'var(--color-warm-gray)', lineHeight: 1.7 }}>
          KaelThrift respects your privacy in accordance with the Kenya Data Protection Act, 2019.
          We do not collect, store, or process personal data through this website beyond what is
          strictly necessary for your browsing experience. When you contact us via WhatsApp, your
          communication is governed by WhatsApp's privacy policies. We do not share your information
          with third parties.
        </p>
      </section>
    </div>
  );
}
