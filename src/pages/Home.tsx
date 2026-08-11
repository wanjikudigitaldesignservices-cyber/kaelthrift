import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Recycle } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import type { Product } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';

const CATEGORY_CARDS = [
  { name: 'Dresses', slug: 'dresses', image: '/images/cat-dresses.png' },
  { name: 'Tops', slug: 'tops', image: '/images/cat-tops.png' },
  { name: 'Jeans', slug: 'jeans', image: '/images/cat-jeans.png' },
  { name: 'Shoes', slug: 'shoes', image: '/images/cat-shoes.png' },
  { name: 'Bags', slug: 'bags', image: '/images/cat-bags.png' },
  { name: 'Accessories', slug: 'accessories', image: '/images/cat-accessories.png' },
];

export default function Home() {
  const [newDrops, setNewDrops] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewDrops() {
      const { data } = await supabase
        .from('products')
        .select('*')
        .eq('status', 'available')
        .gt('quantity', 0)
        .order('created_at', { ascending: false })
        .limit(8);

      setNewDrops((data as Product[]) || []);
      setLoading(false);
    }
    fetchNewDrops();
  }, []);

  return (
    <div>
      {/* Hero Section */}
      <section
        style={{
          background: 'linear-gradient(135deg, rgba(34, 62, 54, 0.85) 0%, rgba(44, 85, 69, 0.85) 100%), url(/images/hero.png) center/cover no-repeat',
          color: 'white',
          padding: '4rem 1.25rem 5rem',
          textAlign: 'center',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative circles */}
        <div
          style={{
            position: 'absolute',
            top: '-60px',
            right: '-60px',
            width: '200px',
            height: '200px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.05)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '150px',
            height: '150px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }}
        />

        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.375rem',
              background: 'rgba(255,255,255,0.12)',
              backdropFilter: 'blur(8px)',
              borderRadius: '9999px',
              padding: '0.375rem 1rem',
              marginBottom: '1.5rem',
              fontSize: '0.85rem',
              fontWeight: 600,
              letterSpacing: '0.03em',
            }}
          >
            <Sparkles size={14} />
            Curated Vintage & Pre-Loved Fashion
          </div>

          <h1
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: 'clamp(2.2rem, 6vw, 3.5rem)',
              fontWeight: 900,
              lineHeight: 1.1,
              marginBottom: '1rem',
              color: 'white',
            }}
          >
            Unique Finds.<br />
            <span style={{ color: 'var(--color-sand)' }}>Unbeatable Prices.</span>
          </h1>

          <p
            style={{
              fontSize: '1.1rem',
              opacity: 0.9,
              lineHeight: 1.7,
              marginBottom: '2rem',
              maxWidth: '500px',
              margin: '0 auto 2rem',
            }}
          >
            Every piece is one-of-a-kind. Thrifted, styled, and delivered to your door across Kenya.
          </p>

          <div style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link to="/shop" className="btn-whatsapp" style={{ width: 'auto', padding: '0.875rem 2.5rem' }}>
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '-2rem auto 0',
          padding: '0 1.25rem',
          position: 'relative',
          zIndex: 2,
        }}
      >
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
            gap: '1rem',
          }}
        >
          {[
            { icon: <Sparkles size={22} color="var(--color-terracotta)" />, title: 'One of a Kind', desc: 'Every piece is unique — once it\'s gone, it\'s gone' },
            { icon: <Heart size={22} color="var(--color-terracotta)" />, title: 'Curated Selection', desc: 'Hand-picked for quality, style, and value' },
            { icon: <Recycle size={22} color="var(--color-terracotta)" />, title: 'Sustainable Fashion', desc: 'Pre-loved style that\'s kind to the planet' },
          ].map((prop) => (
            <div
              key={prop.title}
              style={{
                background: 'white',
                borderRadius: '0.75rem',
                padding: '1.5rem',
                textAlign: 'center',
                boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
              }}
            >
              <div style={{ marginBottom: '0.5rem' }}>{prop.icon}</div>
              <h3
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '0.95rem',
                  fontWeight: 700,
                  color: 'var(--color-charcoal)',
                  marginBottom: '0.25rem',
                }}
              >
                {prop.title}
              </h3>
              <p style={{ fontSize: '0.82rem', color: 'var(--color-warm-gray)', lineHeight: 1.5 }}>
                {prop.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* New Drops */}
      <section style={{ maxWidth: '1200px', margin: '3rem auto', padding: '0 1.25rem' }}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '1.5rem',
          }}
        >
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 800,
            }}
          >
            New Drops 🔥
          </h2>
          <Link
            to="/shop"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              color: 'var(--color-forest)',
              textDecoration: 'none',
              fontWeight: 600,
              fontSize: '0.9rem',
            }}
          >
            View all <ArrowRight size={16} />
          </Link>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-warm-gray)' }}>
            Loading fresh drops...
          </div>
        ) : newDrops.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--color-warm-gray)' }}>
            <p style={{ fontSize: '1.1rem', marginBottom: '0.5rem' }}>New items coming soon!</p>
            <p style={{ fontSize: '0.9rem' }}>Follow us on WhatsApp for drop alerts.</p>
          </div>
        ) : (
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
              gap: '1rem',
            }}
          >
            {newDrops.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </section>

      {/* Category Grid */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '3rem auto',
          padding: '0 1.25rem',
        }}
      >
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.75rem',
            fontWeight: 800,
            marginBottom: '1.5rem',
            textAlign: 'center',
          }}
        >
          Shop by Category
        </h2>
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))',
            gap: '0.75rem',
          }}
        >
          {CATEGORY_CARDS.map((cat) => (
            <Link
              key={cat.slug}
              to={`/shop?category=${cat.slug}`}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'flex-end',
                padding: '1.5rem 1rem',
                background: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url(${cat.image}) center/cover no-repeat`,
                borderRadius: '0.75rem',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.2s ease',
                border: '2px solid transparent',
                height: '180px',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-forest)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
              }}
            >
              <span
                style={{
                  fontWeight: 700,
                  fontSize: '1.1rem',
                  color: 'white',
                  textShadow: '0 2px 4px rgba(0,0,0,0.5)',
                }}
              >
                {cat.name}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
