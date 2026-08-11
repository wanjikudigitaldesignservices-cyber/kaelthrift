import { useState, useCallback } from 'react';
import { ChevronLeft, ChevronRight, X, ZoomIn } from 'lucide-react';

interface ImageCarouselProps {
  images: string[];
  alt: string;
}

export default function ImageCarousel({ images, alt }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isZoomed, setIsZoomed] = useState(false);

  const goTo = useCallback(
    (index: number) => {
      setCurrentIndex((index + images.length) % images.length);
    },
    [images.length]
  );

  if (!images || images.length === 0) {
    return (
      <div
        style={{
          aspectRatio: '3 / 4',
          backgroundColor: 'var(--color-cream)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '1rem',
          color: 'var(--color-warm-gray-light)',
          fontSize: '1.1rem',
        }}
      >
        No images available
      </div>
    );
  }

  return (
    <>
      <div style={{ position: 'relative' }}>
        {/* Main Image */}
        <div
          style={{
            aspectRatio: '3 / 4',
            overflow: 'hidden',
            borderRadius: '1rem',
            backgroundColor: 'var(--color-cream)',
            cursor: 'pointer',
            position: 'relative',
          }}
          onClick={() => setIsZoomed(true)}
        >
          <img
            src={images[currentIndex]}
            alt={`${alt} - image ${currentIndex + 1}`}
            style={{
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              transition: 'opacity 0.3s ease',
            }}
          />

          {/* Zoom hint */}
          <div
            style={{
              position: 'absolute',
              bottom: '0.75rem',
              right: '0.75rem',
              background: 'rgba(0,0,0,0.5)',
              color: 'white',
              borderRadius: '0.5rem',
              padding: '0.375rem 0.625rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.25rem',
              fontSize: '0.75rem',
              fontWeight: 600,
            }}
          >
            <ZoomIn size={14} />
            Tap to zoom
          </div>
        </div>

        {/* Nav Arrows */}
        {images.length > 1 && (
          <>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(currentIndex - 1);
              }}
              style={{
                position: 'absolute',
                top: '50%',
                left: '0.5rem',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              aria-label="Previous image"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              onClick={(e) => {
                e.stopPropagation();
                goTo(currentIndex + 1);
              }}
              style={{
                position: 'absolute',
                top: '50%',
                right: '0.5rem',
                transform: 'translateY(-50%)',
                background: 'rgba(255,255,255,0.9)',
                border: 'none',
                borderRadius: '50%',
                width: '36px',
                height: '36px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                cursor: 'pointer',
                boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
              }}
              aria-label="Next image"
            >
              <ChevronRight size={18} />
            </button>
          </>
        )}

        {/* Dots */}
        {images.length > 1 && (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '0.375rem',
              marginTop: '0.75rem',
            }}
          >
            {images.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: i === currentIndex ? '24px' : '8px',
                  height: '8px',
                  borderRadius: '4px',
                  background:
                    i === currentIndex
                      ? 'var(--color-forest)'
                      : 'var(--color-cream-dark)',
                  border: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
                aria-label={`Go to image ${i + 1}`}
              />
            ))}
          </div>
        )}

        {/* Thumbnail strip */}
        {images.length > 1 && (
          <div
            style={{
              display: 'flex',
              gap: '0.5rem',
              marginTop: '0.75rem',
              overflowX: 'auto',
              paddingBottom: '0.25rem',
            }}
          >
            {images.map((img, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                style={{
                  width: '64px',
                  height: '64px',
                  borderRadius: '0.5rem',
                  overflow: 'hidden',
                  border:
                    i === currentIndex
                      ? '2px solid var(--color-forest)'
                      : '2px solid transparent',
                  flexShrink: 0,
                  cursor: 'pointer',
                  padding: 0,
                  background: 'none',
                  opacity: i === currentIndex ? 1 : 0.6,
                  transition: 'all 0.2s ease',
                }}
              >
                <img
                  src={img}
                  alt={`${alt} thumbnail ${i + 1}`}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Zoom Modal */}
      {isZoomed && (
        <div
          className="modal-overlay"
          onClick={() => setIsZoomed(false)}
          style={{ background: 'rgba(0,0,0,0.9)', cursor: 'zoom-out' }}
        >
          <button
            onClick={() => setIsZoomed(false)}
            style={{
              position: 'absolute',
              top: '1rem',
              right: '1rem',
              background: 'rgba(255,255,255,0.15)',
              border: 'none',
              borderRadius: '50%',
              width: '40px',
              height: '40px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
              color: 'white',
              zIndex: 10,
            }}
            aria-label="Close zoom"
          >
            <X size={22} />
          </button>
          <img
            src={images[currentIndex]}
            alt={`${alt} - zoomed`}
            style={{
              maxWidth: '95vw',
              maxHeight: '90vh',
              objectFit: 'contain',
              borderRadius: '0.5rem',
            }}
            onClick={(e) => e.stopPropagation()}
          />

          {/* Zoom navigation */}
          {images.length > 1 && (
            <>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(currentIndex - 1);
                }}
                style={{
                  position: 'absolute',
                  left: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                <ChevronLeft size={22} />
              </button>
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  goTo(currentIndex + 1);
                }}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'rgba(255,255,255,0.15)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '44px',
                  height: '44px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer',
                  color: 'white',
                }}
              >
                <ChevronRight size={22} />
              </button>
            </>
          )}
        </div>
      )}
    </>
  );
}
