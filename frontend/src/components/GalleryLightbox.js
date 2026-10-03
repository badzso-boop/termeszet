import React, { useState, useEffect, useCallback, useRef } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faTimes,
  faChevronLeft,
  faChevronRight,
  faSearchPlus,
  faSearchMinus,
  faRotateRight,
  faStar
} from '@fortawesome/free-solid-svg-icons';

export const resolveImageUrl = (img) => {
  if (!img) return '';
  if (typeof img === 'string') {
    if (img.startsWith('http://') || img.startsWith('https://') || img.startsWith('blob:') || img.startsWith('data:')) {
      return img;
    }
    const base = process.env.REACT_APP_API_BASE_URL || '';
    return `${base}${img.startsWith('/') ? '' : '/'}${img}`;
  }
  const path =
    img.optimizedUrl ||
    img.url ||
    img.originalUrl ||
    img.thumbnailUrl ||
    img.imageUrl ||
    img.image_url ||
    img.src ||
    img.path ||
    img.image ||
    '';
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://') || path.startsWith('blob:') || path.startsWith('data:')) {
    return path;
  }
  const base = process.env.REACT_APP_API_BASE_URL || '';
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const resolveImageTitle = (img) => {
  if (!img || typeof img === 'string') return '';
  return img.title || img.cim || img.name || img.alt || '';
};

export const resolveImageCaption = (img) => {
  if (!img || typeof img === 'string') return '';
  return img.caption || img.leiras || img.description || img.details || '';
};

const GalleryLightbox = ({
  images = [],
  initialIndex = 0,
  currentIndex: propIndex,
  isOpen = true,
  onClose,
  onIndexChange
}) => {
  const activeInitial = propIndex !== undefined ? propIndex : initialIndex;
  const [currentIndex, setCurrentIndex] = useState(activeInitial);
  const [scale, setScale] = useState(1);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Sync prop index when it changes
  useEffect(() => {
    if (propIndex !== undefined) {
      setCurrentIndex(propIndex);
    }
  }, [propIndex]);

  // Touch tracking for swipe & pinch
  const touchStartRef = useRef(null);
  const initialDistanceRef = useRef(null);
  const initialScaleRef = useRef(1);

  const currentImage = images && images.length > 0 ? images[currentIndex] : null;

  const handleNext = useCallback(() => {
    if (!images || images.length === 0) return;
    setScale(1);
    setPosition({ x: 0, y: 0 });
    const nextIdx = (currentIndex + 1) % images.length;
    setCurrentIndex(nextIdx);
    if (onIndexChange) onIndexChange(nextIdx);
  }, [currentIndex, images, onIndexChange]);

  const handlePrev = useCallback(() => {
    if (!images || images.length === 0) return;
    setScale(1);
    setPosition({ x: 0, y: 0 });
    const prevIdx = (currentIndex - 1 + images.length) % images.length;
    setCurrentIndex(prevIdx);
    if (onIndexChange) onIndexChange(prevIdx);
  }, [currentIndex, images, onIndexChange]);

  const zoomIn = () => {
    setScale((prev) => Math.min(prev + 0.5, 4));
  };

  const zoomOut = () => {
    setScale((prev) => {
      const next = Math.max(prev - 0.5, 1);
      if (next === 1) setPosition({ x: 0, y: 0 });
      return next;
    });
  };

  const resetZoom = () => {
    setScale(1);
    setPosition({ x: 0, y: 0 });
  };

  // Keyboard navigation & scroll lock
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e) => {
      if (e.key === 'Escape') onClose?.();
      else if (e.key === 'ArrowRight') handleNext();
      else if (e.key === 'ArrowLeft') handlePrev();
      else if (e.key === '+' || e.key === '=') zoomIn();
      else if (e.key === '-' || e.key === '_') zoomOut();
      else if (e.key === '0' || e.key === 'r' || e.key === 'R') resetZoom();
    };

    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [isOpen, onClose, handleNext, handlePrev]);

  // Touch event handlers for swipe and pinch zoom
  const handleTouchStart = (e) => {
    if (e.touches.length === 1) {
      touchStartRef.current = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
        time: Date.now()
      };
      if (scale > 1) {
        setIsDragging(true);
        setDragStart({
          x: e.touches[0].clientX - position.x,
          y: e.touches[0].clientY - position.y
        });
      }
    } else if (e.touches.length === 2) {
      // Pinch to zoom start
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      initialDistanceRef.current = Math.hypot(dx, dy);
      initialScaleRef.current = scale;
    }
  };

  const handleTouchMove = (e) => {
    if (e.touches.length === 2 && initialDistanceRef.current) {
      // Pinch to zoom active
      e.preventDefault();
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const currentDistance = Math.hypot(dx, dy);
      const newScale = (currentDistance / initialDistanceRef.current) * initialScaleRef.current;
      setScale(Math.max(1, Math.min(newScale, 4)));
    } else if (e.touches.length === 1 && scale > 1 && isDragging) {
      // Pan zoomed image
      e.preventDefault();
      setPosition({
        x: e.touches[0].clientX - dragStart.x,
        y: e.touches[0].clientY - dragStart.y
      });
    }
  };

  const handleTouchEnd = (e) => {
    if (e.touches.length === 0) {
      setIsDragging(false);
      initialDistanceRef.current = null;

      // Handle swipe if not zoomed in
      if (scale === 1 && touchStartRef.current) {
        const touchEnd = e.changedTouches[0];
        const dx = touchEnd.clientX - touchStartRef.current.x;
        const dy = touchEnd.clientY - touchStartRef.current.y;
        const dt = Date.now() - touchStartRef.current.time;

        if (dt < 400 && Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.5) {
          if (dx < 0) {
            handleNext();
          } else {
            handlePrev();
          }
        }
      }
      touchStartRef.current = null;
    }
  };

  // Mouse pan handlers when zoomed
  const handleMouseDown = (e) => {
    if (scale > 1) {
      e.preventDefault();
      setIsDragging(true);
      setDragStart({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && scale > 1) {
      setPosition({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Double click/tap toggle zoom
  const handleDoubleClick = () => {
    if (scale > 1) {
      resetZoom();
    } else {
      setScale(2.5);
    }
  };

  if (!isOpen || !currentImage) return null;

  const imgSrc = resolveImageUrl(currentImage);
  const imgTitle = resolveImageTitle(currentImage);
  const imgCaption = resolveImageCaption(currentImage);
  const isStarred = currentImage?.isStarred || currentImage?.is_featured || currentImage?.featured;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Fénykép megtekintő"
      className="fixed inset-0 z-50 bg-black/95 flex flex-col justify-between select-none animate-fadeIn backdrop-blur-sm"
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    >
      {/* Top Bar */}
      <div className="flex items-center justify-between p-4 bg-gradient-to-b from-black/80 to-transparent z-10 text-white">
        <div className="flex items-center space-x-3">
          <span className="text-sm font-medium tracking-wider text-gold font-display">
            {currentIndex + 1} / {images.length}
          </span>
          {isStarred && (
            <span className="flex items-center text-xs bg-gold/20 text-gold px-2.5 py-0.5 rounded-full border border-gold/40">
              <FontAwesomeIcon icon={faStar} className="mr-1 text-xs" /> Kiemelt
            </span>
          )}
        </div>

        {/* Controls */}
        <div className="flex items-center space-x-2 sm:space-x-3">
          <button
            type="button"
            onClick={zoomOut}
            disabled={scale <= 1}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-colors text-ivory border border-white/10"
            title="Kicsinyítés (-)"
            aria-label="Kicsinyítés"
          >
            <FontAwesomeIcon icon={faSearchMinus} className="text-sm sm:text-base" />
          </button>
          <button
            type="button"
            onClick={zoomIn}
            disabled={scale >= 4}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-white/10 disabled:opacity-30 transition-colors text-ivory border border-white/10"
            title="Nagyítás (+)"
            aria-label="Nagyítás"
          >
            <FontAwesomeIcon icon={faSearchPlus} className="text-sm sm:text-base" />
          </button>
          {scale > 1 && (
            <button
              type="button"
              onClick={resetZoom}
              className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-white/10 transition-colors text-ivory border border-gold/30 hover:border-gold"
              title="Visszaállítás (R)"
              aria-label="Visszaállítás"
            >
              <FontAwesomeIcon icon={faRotateRight} className="text-sm sm:text-base" />
            </button>
          )}
          <button
            type="button"
            onClick={onClose}
            className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-white/10 text-ivory hover:text-gold transition-colors ml-1 sm:ml-2 border border-gold/40"
            title="Bezárás (Esc)"
            aria-label="Bezárás"
          >
            <FontAwesomeIcon icon={faTimes} className="text-lg sm:text-xl" />
          </button>
        </div>
      </div>

      {/* Main Image Area */}
      <div
        className="flex-1 flex items-center justify-center overflow-hidden relative touch-none p-2 sm:p-6"
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onMouseDown={handleMouseDown}
        onDoubleClick={handleDoubleClick}
      >
        {/* Previous Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handlePrev();
            }}
            className="absolute left-2 sm:left-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/80 text-white hover:text-gold border border-gold/30 hover:border-gold transition-all backdrop-blur-sm shadow-lg"
            aria-label="Előző kép"
            title="Előző kép (Balra nyíl)"
          >
            <FontAwesomeIcon icon={faChevronLeft} className="text-lg sm:text-xl" />
          </button>
        )}

        {/* Image Container */}
        <div
          className="transition-transform duration-100 ease-out max-h-full max-w-full flex items-center justify-center p-2"
          style={{
            transform: `translate3d(${position.x}px, ${position.y}px, 0) scale(${scale})`,
            cursor: scale > 1 ? (isDragging ? 'grabbing' : 'grab') : 'zoom-in'
          }}
        >
          <img
            src={imgSrc}
            alt={imgTitle || `Galéria kép ${currentIndex + 1}`}
            className="max-h-[75vh] max-w-[92vw] sm:max-w-[85vw] object-contain shadow-2xl rounded transition-opacity duration-300 pointer-events-auto"
            draggable={false}
          />
        </div>

        {/* Next Button */}
        {images.length > 1 && (
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              handleNext();
            }}
            className="absolute right-2 sm:right-6 z-20 w-11 h-11 sm:w-13 sm:h-13 rounded-full flex items-center justify-center bg-black/40 hover:bg-black/80 text-white hover:text-gold border border-gold/30 hover:border-gold transition-all backdrop-blur-sm shadow-lg"
            aria-label="Következő kép"
            title="Következő kép (Jobbra nyíl)"
          >
            <FontAwesomeIcon icon={faChevronRight} className="text-lg sm:text-xl" />
          </button>
        )}
      </div>

      {/* Bottom Bar / Caption */}
      <div className="p-4 sm:p-6 bg-gradient-to-t from-black/80 to-transparent z-10 text-center">
        {imgTitle ? (
          <div className="max-w-2xl mx-auto">
            <h3 className="text-white text-base sm:text-lg font-display font-medium drop-shadow-md mb-1">
              {imgTitle}
            </h3>
            {imgCaption && (
              <p className="text-white/80 text-xs sm:text-sm font-light">
                {imgCaption}
              </p>
            )}
          </div>
        ) : (
          <p className="text-white/60 text-xs sm:text-sm font-light">
            Érintéssel / görgetéssel vagy a gombokkal nagyíthatsz és lapozhatsz
          </p>
        )}
      </div>
    </div>
  );
};

export default GalleryLightbox;
