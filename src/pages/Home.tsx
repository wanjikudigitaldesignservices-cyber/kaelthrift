import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Heart, Recycle, Star, ShieldCheck, Truck } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { MOCK_PRODUCTS, isSupabaseConfigured } from '@/lib/mockData';
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

const TESTIMONIALS = [
  {
    name: 'Wanjiku M.',
    text: 'Found the most amazing vintage denim jacket! Quality was even better than described. Definitely ordering again.',
    rating: 5,
  },
  {
    name: 'Akinyi O.',
    text: 'Love how every piece is unique. The measurements are always accurate — no surprises. My go-to thrift shop! 🛍️',
    rating: 5,
  },
  {
    name: 'Njeri K.',
    text: 'Fast delivery to Mombasa and the packaging was so cute. The leather bag I got looks brand new. 10/10.',
    rating: 5,
  },
];

export default function Home() {
  const [newDrops, setNewDrops] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchNewDrops() {
      if (!isSupabaseConfigured()) {
        const available = MOCK_PRODUCTS.filter(
          (p) => p.status === 'available' && p.quantity > 0
        ).slice(0, 8);
        setNewDrops(available);
        setLoading(false);
        return;
      }

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
          background:
            'linear-gradient(rgba(0,0,0,0.45), rgba(0,0,0,0.5)), url("/images/hero.png") center/cover no-repeat',
          color: 'white',
          padding: '5rem 1.25rem 6rem',
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
            width: '250px',
            height: '250px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.04)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '-40px',
            left: '-40px',
            width: '180px',
            height: '180px',
            borderRadius: '50%',
            background: 'rgba(255,255,255,0.03)',
          }}
        />

        <div style={{ maxWidth: '700px', margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div
            className="animate-fade-in-up delay-100"
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
            className="animate-fade-in-up delay-200"
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
            className="animate-fade-in-up delay-300"
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

          <div
            className="animate-fade-in-up delay-400"
            style={{ display: 'flex', gap: '0.75rem', justifyContent: 'center', flexWrap: 'wrap' }}
          >
            <Link
              to="/shop"
              className="btn-primary"
              style={{
                width: 'auto',
                padding: '0.875rem 2.5rem',
                fontSize: '1.05rem',
                background: 'white',
                color: 'var(--color-forest-dark)',
              }}
            >
              Shop Now <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Value Props */}
      <section
        style={{
          maxWidth: '1200px',
          margin: '-2.5rem auto 0',
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
            {
              icon: <Sparkles size={24} color="var(--color-terracotta)" />,
              title: 'One of a Kind',
              desc: "Every piece is unique — once it's gone, it's gone",
            },
            {
              icon: <Heart size={24} color="var(--color-terracotta)" />,
              title: 'Curated Selection',
              desc: 'Hand-picked for quality, style, and value',
            },
            {
              icon: <Recycle size={24} color="var(--color-terracotta)" />,
              title: 'Sustainable Fashion',
              desc: "Pre-loved style that's kind to the planet",
            },
            {
              icon: <Truck size={24} color="var(--color-terracotta)" />,
              title: 'Nationwide Delivery',
              desc: 'Fast, affordable delivery across Kenya',
            },
          ].map((prop, idx) => (
            <div
              key={prop.title}
              className={`animate-fade-in-up delay-${(idx + 1) * 100}`}
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
      <section style={{ maxWidth: '1200px', margin: '3.5rem auto', padding: '0 1.25rem' }}>
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
            <p style={{ fontSize: '0.9rem' }}>Check back later for fresh drops.</p>
          </div>
        ) : (
          <div
            className="animate-fade-in-up delay-200"
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: '1.25rem',
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
          className="animate-fade-in-up delay-300"
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
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
                background: `linear-gradient(to top, rgba(0,0,0,0.8), rgba(0,0,0,0.1)), url("${cat.image}") center/cover no-repeat`,
                borderRadius: '0.75rem',
                textDecoration: 'none',
                boxShadow: '0 1px 3px rgba(0,0,0,0.06)',
                transition: 'all 0.3s ease',
                border: '2px solid transparent',
                height: '200px',
                overflow: 'hidden',
              }}
              onMouseOver={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'var(--color-forest)';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(-4px)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 8px 25px rgba(0,0,0,0.15)';
              }}
              onMouseOut={(e) => {
                (e.currentTarget as HTMLElement).style.borderColor = 'transparent';
                (e.currentTarget as HTMLElement).style.transform = 'translateY(0)';
                (e.currentTarget as HTMLElement).style.boxShadow = '0 1px 3px rgba(0,0,0,0.06)';
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

      {/* Testimonials */}
      <section
        style={{
          background: 'white',
          padding: '3.5rem 1.25rem',
          marginTop: '2rem',
        }}
      >
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h2
            style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.75rem',
              fontWeight: 800,
              textAlign: 'center',
              marginBottom: '0.5rem',
            }}
          >
            What Our Customers Say
          </h2>
          <p
            style={{
              textAlign: 'center',
              color: 'var(--color-warm-gray)',
              marginBottom: '2rem',
              fontSize: '0.95rem',
            }}
          >
            Real reviews from real thrift lovers
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
              gap: '1.5rem',
            }}
          >
            {TESTIMONIALS.map((t) => (
              <div
                key={t.name}
                style={{
                  padding: '1.5rem',
                  borderRadius: '1rem',
                  background: 'var(--color-linen)',
                  border: '1px solid var(--color-cream-dark)',
                }}
              >
                <div style={{ display: 'flex', gap: '0.125rem', marginBottom: '0.75rem' }}>
                  {Array.from({ length: t.rating }).map((_, i) => (
                    <Star key={i} size={16} fill="var(--color-terracotta)" color="var(--color-terracotta)" />
                  ))}
                </div>
                <p
                  style={{
                    fontSize: '0.9rem',
                    lineHeight: 1.7,
                    color: 'var(--color-charcoal)',
                    marginBottom: '1rem',
                    fontStyle: 'italic',
                  }}
                >
                  "{t.text}"
                </p>
                <p style={{ fontWeight: 700, fontSize: '0.85rem', color: 'var(--color-forest-dark)' }}>
                  — {t.name}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Trust / Guarantee Bar */}
      <section
        style={{
          background: 'var(--color-forest-dark)',
          color: 'white',
          padding: '2rem 1.25rem',
        }}
      >
        <div
          style={{
            maxWidth: '1200px',
            margin: '0 auto',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.5rem',
            textAlign: 'center',
          }}
        >
          {[
            { icon: <ShieldCheck size={28} />, label: 'Quality Guaranteed' },
            { icon: <Truck size={28} />, label: 'Nationwide Delivery' },
            { icon: <Heart size={28} />, label: 'Curated with Love' },
          ].map((item) => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '0.5rem',
                opacity: 0.9,
              }}
            >
              {item.icon}
              <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Newsletter */}
      <section
        style={{
          maxWidth: '700px',
          margin: '3rem auto',
          padding: '2.5rem 2rem',
          textAlign: 'center',
          background: 'white',
          borderRadius: '1rem',
          marginLeft: '1.25rem',
          marginRight: '1.25rem',
          boxShadow: '0 4px 15px rgba(0,0,0,0.06)',
        }}
      >
        <Sparkles size={28} color="var(--color-terracotta)" style={{ marginBottom: '0.75rem' }} />
        <h2
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '1.5rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
          }}
        >
          Get Drop Alerts
        </h2>
        <p
          style={{
            color: 'var(--color-warm-gray)',
            marginBottom: '1.5rem',
            fontSize: '0.9rem',
          }}
        >
          Be the first to know when new unique pieces land. No spam, just style.
        </p>
        <form
          onSubmit={(e) => e.preventDefault()}
          style={{
            display: 'flex',
            gap: '0.5rem',
            maxWidth: '450px',
            margin: '0 auto',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          <input
            className="input"
            type="email"
            placeholder="Your email address"
            style={{ flex: '1 1 250px' }}
          />
          <button className="btn-primary" type="submit" style={{ whiteSpace: 'nowrap' }}>
            Subscribe
          </button>
        </form>
      </section>
    </div>
  );
}
