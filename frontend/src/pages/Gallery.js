import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useTranslation } from 'react-i18next';
import {
  faImages,
  faStar,
  faExpand,
  faFilter
} from '@fortawesome/free-solid-svg-icons';
import GalleryLightbox from '../components/GalleryLightbox';
import { fallbackLang } from '../i18n/contentLang';
import Footer from '../components/Footer';
import Newsletter from '../components/Newsletter';

const Gallery = () => {
  const { t, i18n } = useTranslation('pages');
  const lang = i18n.language;
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all'); // 'all' or 'starred'
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || '';

  useEffect(() => {
    const fetchGallery = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/gallery`, { params: { lang } });
        setImages(res.data || []);
      } catch (err) {
        console.error('Error fetching gallery:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchGallery();
  }, [API_BASE_URL, lang]);

  const filteredImages = filter === 'starred' ? images.filter((img) => img.isStarred) : images;

  const openLightbox = (index) => {
    setLightboxIndex(index);
    setLightboxOpen(true);
  };

  const getThumbnailUrl = (img) => {
    const path = img.thumbnailUrl || img.optimizedUrl || img.originalUrl;
    if (path.startsWith('http')) return path;
    return `${API_BASE_URL}${path}`;
  };

  return (
    <div className="min-h-screen flex flex-col bg-background">
      {/* Hero Header */}
      <section className="bg-primary/50 border-b border-secondary/20 py-16 sm:py-24 px-4 text-center">
        <div className="max-w-4xl mx-auto">
          <div className="w-16 h-16 rounded-full bg-gold/20 text-gold flex items-center justify-center mx-auto mb-4">
            <FontAwesomeIcon icon={faImages} className="text-2xl" />
          </div>
          <h1 className="brand-script text-4xl sm:text-6xl text-ink mb-3">{t('gallery.heading')}</h1>
          <div className="divider-gold mb-4" />
          <p className="font-display text-lg sm:text-xl text-ink/80 max-w-2xl mx-auto">
            {t('gallery.intro')}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main className="flex-1 container mx-auto py-12 px-4 max-w-6xl">
        {/* Filter Bar */}
        {images.length > 0 && (
          <div className="flex justify-center items-center gap-3 mb-10 flex-wrap">
            <button
              onClick={() => setFilter('all')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'all'
                  ? 'bg-ink text-ivory shadow-sm'
                  : 'bg-white border border-secondary/30 text-ink hover:bg-secondary/20'
              }`}
            >
              <FontAwesomeIcon icon={faFilter} className="mr-2" />
              {t('gallery.all', { count: images.length })}
            </button>
            <button
              onClick={() => setFilter('starred')}
              className={`px-5 py-2 rounded-full text-sm font-medium transition-all ${
                filter === 'starred'
                  ? 'bg-ink text-ivory shadow-sm'
                  : 'bg-white border border-secondary/30 text-ink hover:bg-secondary/20'
              }`}
            >
              <FontAwesomeIcon icon={faStar} className="mr-2 text-gold" />
              {t('gallery.starred', { count: images.filter((i) => i.isStarred).length })}
            </button>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="aspect-square rounded-md bg-secondary/30 animate-pulse"
              />
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredImages.length === 0 && (
          <div className="text-center py-20 bg-white rounded-lg border border-secondary/20 p-8 max-w-md mx-auto shadow-sm">
            <FontAwesomeIcon icon={faImages} className="text-5xl text-gold/50 mb-4" />
            <h3 className="font-display text-xl font-semibold text-ink mb-2">
              {filter === 'starred' ? t('gallery.noStarredTitle') : t('gallery.emptyTitle')}
            </h3>
            <p className="text-gray-600 text-sm">
              {filter === 'starred'
                ? t('gallery.noStarredText')
                : t('gallery.emptyText')}
            </p>
          </div>
        )}

        {/* Image Grid */}
        {!loading && filteredImages.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredImages.map((img, index) => (
              <div
                key={img.id}
                onClick={() => openLightbox(index)}
                className="group relative aspect-square rounded-lg overflow-hidden bg-secondary/20 border border-secondary/30 shadow-sm hover:shadow-md transition-all duration-300 cursor-pointer"
              >
                <img
                  src={getThumbnailUrl(img)}
                  alt={img.title || t('gallery.imageAlt')}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
                  loading="lazy"
                />

                {/* Star Badge if featured */}
                {img.isStarred && (
                  <div className="absolute top-2 right-2 bg-black/60 text-gold p-1.5 rounded-full backdrop-blur-sm shadow-sm z-10">
                    <FontAwesomeIcon icon={faStar} className="text-xs" />
                  </div>
                )}

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-white">
                  <div className="flex items-center justify-between">
                    <p lang={img.title ? fallbackLang(img, 'title') : undefined} className="text-sm font-medium truncate drop-shadow-md">
                      {img.title || t('gallery.view')}
                    </p>
                    <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center text-ivory hover:text-gold shrink-0 ml-2">
                      <FontAwesomeIcon icon={faExpand} className="text-xs" />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Fullscreen Lightbox Modal */}
      {lightboxOpen && (
        <GalleryLightbox
          images={filteredImages}
          initialIndex={lightboxIndex}
          onClose={() => setLightboxOpen(false)}
        />
      )}

      <Newsletter />
      <Footer />
    </div>
  );
};

export default Gallery;
