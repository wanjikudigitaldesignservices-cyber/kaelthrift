import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Search, Loader2 } from 'lucide-react';
import { useProducts } from '@/hooks/useProducts';
import type { ProductFilters, SortOption } from '@/lib/types';
import ProductCard from '@/components/product/ProductCard';
import FilterSidebar from '@/components/product/FilterSidebar';
import { debounce } from '@/lib/utils';

export default function Shop() {
  const [searchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || '';

  const [filters, setFilters] = useState<ProductFilters>({
    category: initialCategory as ProductFilters['category'],
  });
  const [sort, setSort] = useState<SortOption>('newest');
  const [searchInput, setSearchInput] = useState('');

  const handleSearch = useMemo(
    () =>
      (debounce as any)((value: string) => {
        setFilters(prev => ({ ...prev, search: value }));
      }, 500),
    [setFilters]
  );

  const handleSearchChange = (value: string) => {
    setSearchInput(value);
    handleSearch(value);
  };

  const { products, loading, hasMore, loadMore } = useProducts(filters, sort);

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '1.5rem 1.25rem' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '1.5rem' }}>
        <h1
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2rem',
            fontWeight: 800,
            marginBottom: '0.5rem',
          }}
        >
          Shop All
        </h1>
        <p style={{ color: 'var(--color-warm-gray)', fontSize: '0.95rem' }}>
          Unique thrift finds — each piece is one-of-a-kind
        </p>
      </div>

      {/* Search Bar */}
      <div style={{ position: 'relative', marginBottom: '1.25rem' }}>
        <Search
          size={18}
          style={{
            position: 'absolute',
            left: '0.875rem',
            top: '50%',
            transform: 'translateY(-50%)',
            color: 'var(--color-warm-gray-light)',
          }}
        />
        <input
          className="input"
          type="text"
          placeholder="Search items..."
          value={searchInput}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{ paddingLeft: '2.75rem' }}
        />
      </div>

      {/* Layout: Sidebar + Grid */}
      <div style={{ display: 'flex', gap: '2rem', alignItems: 'flex-start' }}>
        <FilterSidebar
          filters={filters}
          sort={sort}
          onFiltersChange={setFilters}
          onSortChange={setSort}
        />

        <div style={{ flex: 1 }}>
          {loading && products.length === 0 ? (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                padding: '4rem',
                color: 'var(--color-warm-gray)',
              }}
            >
              <Loader2 size={24} className="animate-spin" style={{ marginRight: '0.5rem' }} />
              Loading items...
            </div>
          ) : products.length === 0 ? (
            <div
              style={{
                textAlign: 'center',
                padding: '4rem 2rem',
                color: 'var(--color-warm-gray)',
              }}
            >
              <p style={{ fontSize: '1.2rem', fontWeight: 600, marginBottom: '0.5rem' }}>
                No items found
              </p>
              <p style={{ fontSize: '0.9rem' }}>
                Try adjusting your filters or search term.
              </p>
            </div>
          ) : (
            <>
              <div
                style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))',
                  gap: '1rem',
                }}
              >
                {products.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>

              {/* Load More */}
              {hasMore && (
                <div style={{ textAlign: 'center', marginTop: '2rem' }}>
                  <button
                    className="btn-outline"
                    onClick={loadMore}
                    disabled={loading}
                  >
                    {loading ? (
                      <>
                        <Loader2 size={16} className="animate-spin" />
                        Loading...
                      </>
                    ) : (
                      'Load more'
                    )}
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
