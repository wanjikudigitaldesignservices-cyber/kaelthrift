import { useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { CATEGORIES, CONDITIONS } from '@/lib/schemas';
import type { ProductFilters, SortOption } from '@/lib/types';

interface FilterSidebarProps {
  filters: ProductFilters;
  sort: SortOption;
  onFiltersChange: (filters: ProductFilters) => void;
  onSortChange: (sort: SortOption) => void;
}

export default function FilterSidebar({
  filters,
  sort,
  onFiltersChange,
  onSortChange,
}: FilterSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);

  const updateFilter = (key: keyof ProductFilters, value: string | number | undefined) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const hasActiveFilters =
    filters.category || filters.size || filters.condition || filters.minPrice || filters.maxPrice;

  const filterContent = (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Sort */}
      <div>
        <label className="label">Sort by</label>
        <select
          className="select"
          value={sort}
          onChange={(e) => onSortChange(e.target.value as SortOption)}
        >
          <option value="newest">Newest first</option>
          <option value="price-asc">Price: Low → High</option>
          <option value="price-desc">Price: High → Low</option>
        </select>
      </div>

      {/* Category */}
      <div>
        <label className="label">Category</label>
        <select
          className="select"
          value={filters.category || ''}
          onChange={(e) => updateFilter('category', e.target.value || undefined)}
        >
          <option value="">All categories</option>
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat.charAt(0).toUpperCase() + cat.slice(1)}
            </option>
          ))}
        </select>
      </div>

      {/* Size */}
      <div>
        <label className="label">Size</label>
        <input
          className="input"
          type="text"
          placeholder="e.g. S, M, L, 38"
          value={filters.size || ''}
          onChange={(e) => updateFilter('size', e.target.value || undefined)}
        />
      </div>

      {/* Price Range */}
      <div>
        <label className="label">Price range (KES)</label>
        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <input
            className="input"
            type="number"
            placeholder="Min"
            value={filters.minPrice || ''}
            onChange={(e) =>
              updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            style={{ flex: 1 }}
          />
          <span style={{ color: 'var(--color-warm-gray)' }}>—</span>
          <input
            className="input"
            type="number"
            placeholder="Max"
            value={filters.maxPrice || ''}
            onChange={(e) =>
              updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
            }
            style={{ flex: 1 }}
          />
        </div>
      </div>

      {/* Condition */}
      <div>
        <label className="label">Condition</label>
        <select
          className="select"
          value={filters.condition || ''}
          onChange={(e) => updateFilter('condition', e.target.value || undefined)}
        >
          <option value="">Any condition</option>
          {CONDITIONS.map((cond) => (
            <option key={cond} value={cond}>
              {cond}
            </option>
          ))}
        </select>
      </div>

      {/* Clear */}
      {hasActiveFilters && (
        <button className="btn-ghost" onClick={clearFilters} style={{ justifySelf: 'start' }}>
          <X size={14} />
          Clear all filters
        </button>
      )}
    </div>
  );

  return (
    <>
      {/* Mobile Filter Toggle */}
      <button
        className="btn-outline md:hidden"
        onClick={() => setIsOpen(true)}
        style={{ marginBottom: '1rem' }}
      >
        <SlidersHorizontal size={16} />
        Filters {hasActiveFilters ? '•' : ''}
      </button>

      {/* Desktop Filter Bar */}
      <div className="hidden md:flex" style={{ 
        width: '100%', 
        alignItems: 'flex-end', 
        gap: '1.25rem',
        padding: '1rem',
        background: 'var(--color-creamy-white)',
        borderRadius: '0.75rem',
        border: '1px solid var(--color-warm-gray-light)',
        flexWrap: 'wrap'
      }}>
        {/* Sort */}
        <div style={{ flex: '1 1 120px' }}>
          <label className="label" style={{ fontSize: '0.75rem' }}>Sort by</label>
          <select
            className="select"
            value={sort}
            onChange={(e) => onSortChange(e.target.value as SortOption)}
          >
            <option value="newest">Newest first</option>
            <option value="price-asc">Price: Low → High</option>
            <option value="price-desc">Price: High → Low</option>
          </select>
        </div>

        {/* Category */}
        <div style={{ flex: '1 1 120px' }}>
          <label className="label" style={{ fontSize: '0.75rem' }}>Category</label>
          <select
            className="select"
            value={filters.category || ''}
            onChange={(e) => updateFilter('category', e.target.value || undefined)}
          >
            <option value="">All categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Condition */}
        <div style={{ flex: '1 1 120px' }}>
          <label className="label" style={{ fontSize: '0.75rem' }}>Condition</label>
          <select
            className="select"
            value={filters.condition || ''}
            onChange={(e) => updateFilter('condition', e.target.value || undefined)}
          >
            <option value="">Any condition</option>
            {CONDITIONS.map((cond) => (
              <option key={cond} value={cond}>
                {cond}
              </option>
            ))}
          </select>
        </div>

        {/* Size */}
        <div style={{ flex: '1 1 100px' }}>
          <label className="label" style={{ fontSize: '0.75rem' }}>Size</label>
          <input
            className="input"
            type="text"
            placeholder="e.g. S, 38"
            value={filters.size || ''}
            onChange={(e) => updateFilter('size', e.target.value || undefined)}
          />
        </div>

        {/* Price Range */}
        <div style={{ flex: '2 1 200px' }}>
          <label className="label" style={{ fontSize: '0.75rem' }}>Price (KES)</label>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <input
              className="input"
              type="number"
              placeholder="Min"
              value={filters.minPrice || ''}
              onChange={(e) =>
                updateFilter('minPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              style={{ flex: 1 }}
            />
            <span style={{ color: 'var(--color-warm-gray)' }}>—</span>
            <input
              className="input"
              type="number"
              placeholder="Max"
              value={filters.maxPrice || ''}
              onChange={(e) =>
                updateFilter('maxPrice', e.target.value ? Number(e.target.value) : undefined)
              }
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {/* Clear */}
        {hasActiveFilters && (
          <button className="btn-ghost" onClick={clearFilters} style={{ height: '42px', padding: '0 1rem' }}>
            <X size={14} />
            Clear
          </button>
        )}
      </div>

      {/* Mobile Filter Modal */}
      {isOpen && (
        <div className="modal-overlay" onClick={() => setIsOpen(false)}>
          <div
            className="modal-content"
            onClick={(e) => e.stopPropagation()}
            style={{
              maxWidth: '100%',
              width: '100%',
              borderRadius: '1rem 1rem 0 0',
              position: 'fixed',
              bottom: 0,
              left: 0,
              right: 0,
              maxHeight: '80vh',
              overflowY: 'auto',
              padding: '1.5rem',
            }}
          >
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '1.25rem',
              }}
            >
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: '1.25rem',
                  fontWeight: 700,
                }}
              >
                Filter & Sort
              </h3>
              <button
                onClick={() => setIsOpen(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  color: 'var(--color-charcoal)',
                }}
              >
                <X size={22} />
              </button>
            </div>
            {filterContent}
            <button
              className="btn-primary"
              onClick={() => setIsOpen(false)}
              style={{ width: '100%', marginTop: '1.5rem' }}
            >
              Show results
            </button>
          </div>
        </div>
      )}
    </>
  );
}
