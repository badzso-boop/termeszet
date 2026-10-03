import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faSpa,
  faCertificate,
  faHeart,
  faHeartPulse,
  faCommentDots,
  faCalendarCheck,
  faHandsHoldingCircle,
  faQuoteLeft,
  faCircleQuestion,
  faPhone,
  faEnvelope,
  faCompass,
  faSeedling,
  faEye,
  faImages,
  faMagnifyingGlassPlus,
  faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import Logo from "../img/logo_1.png";
import Profile from "../img/prof-kep.jpg";
import Foot from "../img/lab.jpg";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";
import YouTubeSection from "../components/YouTubeSection";
import GalleryLightbox, {
  resolveImageUrl,
  resolveImageTitle,
  resolveImageCaption
} from "../components/GalleryLightbox";
import { useLocalizedPath } from "../i18n/useLocalizedPath";
import { fallbackLang } from "../i18n/contentLang";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// A "Miért engem válassz?", a beépített (DB-fallback) szolgáltatások és a kezelési lépések
// ikonjai -- a szövegek sorrendben a locales/<nyelv>/home.json tömbjeiből jönnek.
const WHY_ME_ICONS = [faEye, faCertificate, faHeart];
const DEFAULT_SERVICE_ICON_TYPES = ["hands", "heart", "compass", "seedling", "spa", "feet"];
const PROCESS_ICONS = [faCalendarCheck, faCommentDots, faHandsHoldingCircle];

const Home = () => {
  const { t, i18n } = useTranslation(["home", "common"]);
  const lang = i18n.language;
  const lp = useLocalizedPath();
  const [featuredPhotos, setFeaturedPhotos] = useState([]);
  const [galleryLoading, setGalleryLoading] = useState(true);
  const [featuredServices, setFeaturedServices] = useState([]);
  const [servicesLoading, setServicesLoading] = useState(true);
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  useEffect(() => {
    let isMounted = true;

    const fetchFeaturedPhotos = async () => {
      try {
        setGalleryLoading(true);
        let photos = [];

        // Try to fetch featured/starred photos first
        try {
          const res = await axios.get(`${API_BASE_URL}/api/gallery/featured`, { params: { lang } });
          let data = res.data;
          if (data && Array.isArray(data.images)) data = data.images;
          else if (data && Array.isArray(data.data)) data = data.data;

          if (Array.isArray(data) && data.length > 0) {
            photos = data;
          }
        } catch (e) {
          // Fallback to all photos if featured endpoint isn't available or empty
        }

        // If no featured photos returned, fetch general gallery
        if (photos.length === 0) {
          try {
            const resAll = await axios.get(`${API_BASE_URL}/api/gallery`, { params: { lang } });
            let dataAll = resAll.data;
            if (dataAll && Array.isArray(dataAll.images)) dataAll = dataAll.images;
            else if (dataAll && Array.isArray(dataAll.data)) dataAll = dataAll.data;

            if (Array.isArray(dataAll) && dataAll.length > 0) {
              photos = dataAll;
            }
          } catch (e) {
            console.error("Nem sikerült lekérni a galéria képeit a főoldalra:", e);
          }
        }

        if (isMounted) {
          setFeaturedPhotos(photos);
        }
      } finally {
        if (isMounted) {
          setGalleryLoading(false);
        }
      }
    };

    const fetchFeaturedServices = async () => {
      try {
        setServicesLoading(true);
        let servList = [];
        try {
          const res = await axios.get(`${API_BASE_URL}/api/services/featured`, { params: { lang } });
          const data = Array.isArray(res.data) ? res.data : [];
          if (data.length > 0) {
            servList = data;
          }
        } catch (e) {
          // Fallback to all services
          try {
            const resAll = await axios.get(`${API_BASE_URL}/api/services`, { params: { lang } });
            const dataAll = Array.isArray(resAll.data) ? resAll.data : [];
            if (dataAll.length > 0) {
              servList = dataAll.filter(s => s.isStarred !== false);
            }
          } catch (errAll) {
            console.warn("Could not fetch services from API, using defaults:", errAll);
          }
        }

        if (isMounted && servList.length > 0) {
          setFeaturedServices(servList);
        }
      } finally {
        if (isMounted) {
          setServicesLoading(false);
        }
      }
    };

    fetchFeaturedPhotos();
    fetchFeaturedServices();

    return () => {
      isMounted = false;
    };
  }, [lang]);

  const openPhotoLightbox = (idx) => {
    setSelectedPhotoIndex(idx);
    setLightboxOpen(true);
  };

  const closePhotoLightbox = () => {
    setLightboxOpen(false);
  };

  return (
    <div className="min-h-screen flex flex-col">
      {/* Hős szekció (Hero) - Névjegykártya dizájn, hangsúlyos nagy logóval */}
      <section className="bg-primary/60 border-b border-secondary/20 py-20 sm:py-28 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <img
            src={Logo}
            alt={t("common:brand.logoAlt")}
            className="max-h-64 sm:max-h-80 md:max-h-96 w-auto mx-auto mb-6 object-contain drop-shadow-md"
          />
          <h1 className="brand-script text-4xl sm:text-6xl text-ink mb-3">
            {t("common:brand.name")}
          </h1>
          <div className="divider-gold mb-6" />
          <p className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-wide mb-4">
            {t("hero.roles")}
          </p>
          <p className="text-base sm:text-lg text-ink/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            {t("hero.intro")}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={lp("courses")} className="btn-brand">
              {t("hero.viewCourses")}
            </Link>
            <Link to={lp("contact")} className="btn-outline">
              {t("hero.getInTouch")}
            </Link>
          </div>
        </div>
      </section>

      {/* Bemutatkozó Szöveg */}
      <section id="about" className="container mx-auto py-20 sm:py-28 px-4">
        <h2 className="section-heading mb-4">{t("about.heading")}</h2>
        <div className="divider-gold mb-12" />
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
          {/* Kép a gyógyítóról */}
          <div className="shrink-0 text-center">
            <img
              src={Profile}
              alt={t("common:brand.name")}
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-full shadow-md object-cover object-top ring-2 ring-gold/50 mx-auto"
            />
            <p className="font-display text-xl font-semibold mt-4 text-ink">{t("common:brand.name")}</p>
            <p className="text-sm text-ink/70">{t("about.role")}</p>
          </div>

          <div className="text-left space-y-4 text-gray-800 leading-relaxed">
            {t("about.paragraphs", { returnObjects: true }).map((paragraph, idx) => (
              <p key={idx}>{paragraph}</p>
            ))}
          </div>
        </div>
      </section>

      {/* Miért engem válassz */}
      <section id="why-me" className="bg-primary/40 py-16 px-4 border-y border-secondary/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-4">{t("whyMe.heading")}</h2>
          <div className="divider-gold mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            {t("whyMe.items", { returnObjects: true }).map((item, idx) => (
              <div key={idx} className="text-center p-6 bg-white rounded-md border border-secondary/20 shadow-sm">
                <FontAwesomeIcon icon={WHY_ME_ICONS[idx]} className="text-3xl mb-4 text-gold" />
                <h3 className="font-display text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-700">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Szolgáltatások Bemutatása */}
      <section id="services" className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-heading mb-4">{t("services.heading")}</h2>
          <div className="divider-gold mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredServices.length > 0
              ? featuredServices
              : t("services.defaults", { returnObjects: true }).map((service, idx) => ({
                  ...service,
                  id: `def-${idx + 1}`,
                  iconType: DEFAULT_SERVICE_ICON_TYPES[idx],
                }))
            ).map((service) => (
              <div
                key={service.id || service.title}
                className="bg-white p-8 rounded-md border border-secondary/20 shadow-sm flex flex-col justify-between hover:shadow-md transition-shadow"
              >
                <div>
                  <div className="w-14 h-14 rounded-full bg-gold/15 text-ink flex items-center justify-center mb-5 border border-gold/30 overflow-hidden shrink-0">
                    {service.iconUrl ? (
                      <img
                        src={service.iconUrl}
                        alt={service.title}
                        className="w-full h-full object-contain p-2"
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.style.display = "none";
                        }}
                      />
                    ) : (
                      <FontAwesomeIcon
                        icon={
                          service.iconType === "heart"
                            ? faHeartPulse
                            : service.iconType === "compass"
                            ? faCompass
                            : service.iconType === "seedling"
                            ? faSeedling
                            : service.iconType === "spa"
                            ? faSpa
                            : faHandsHoldingCircle
                        }
                        className="text-2xl text-ink"
                      />
                    )}
                  </div>
                  <h3 lang={fallbackLang(service, "title")} className="font-display text-xl font-semibold mb-3 text-ink">
                    {service.title}
                  </h3>
                  <p lang={fallbackLang(service, "description")} className="text-gray-700 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
                {(service.price || service.duration) && (
                  <div className="pt-4 mt-4 border-t border-secondary/15 flex items-center justify-between text-xs text-ink/70 font-medium">
                    {service.duration && <span lang={fallbackLang(service, "duration")}>{t("services.duration", { duration: service.duration })}</span>}
                    {service.price && <span lang={fallbackLang(service, "price")} className="text-ink font-semibold text-sm">{service.price}</span>}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* YouTube Videók Szekció */}
      <YouTubeSection />

      {/* Galéria Előnézet Szekció */}
      <section id="gallery" className="bg-primary/30 py-20 sm:py-28 px-4 border-t border-secondary/20">
        <div className="container mx-auto max-w-6xl text-center">
          <h2 className="section-heading mb-4">{t("gallery.heading")}</h2>
          <div className="divider-gold mb-4" />
          <p className="text-base sm:text-lg text-ink/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            {t("gallery.intro")}
          </p>

          {/* Loading Skeleton */}
          {galleryLoading && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
              {[...Array(6)].map((_, i) => (
                <div
                  key={i}
                  className="aspect-square bg-secondary/30 rounded-lg animate-pulse border border-secondary/20"
                />
              ))}
            </div>
          )}

          {/* Gallery Preview Grid */}
          {!galleryLoading && featuredPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-10">
              {featuredPhotos.slice(0, 6).map((photo, idx) => {
                const src = resolveImageUrl(photo);
                const title = resolveImageTitle(photo);
                const caption = resolveImageCaption(photo);

                return (
                  <div
                    key={photo.id || idx}
                    onClick={() => openPhotoLightbox(idx)}
                    className="group relative aspect-square bg-black/5 rounded-lg overflow-hidden cursor-pointer border border-secondary/20 hover:border-gold shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    <img
                      src={src}
                      alt={title || t("gallery.previewAlt", { number: idx + 1 })}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left text-ivory">
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-gold flex items-center justify-center backdrop-blur-sm border border-gold/30 group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="text-xs" />
                      </div>
                      {title && (
                        <h4 lang={fallbackLang(photo, "title")} className="font-display font-semibold text-base line-clamp-1 text-ivory">
                          {title}
                        </h4>
                      )}
                      {caption && (
                        <p className="text-xs text-ivory/80 line-clamp-2 mt-0.5 font-light">
                          {caption}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Empty fallback */}
          {!galleryLoading && featuredPhotos.length === 0 && (
            <div className="text-center py-10 px-4 mb-10 bg-white/60 rounded-lg border border-secondary/20 max-w-lg mx-auto">
              <FontAwesomeIcon icon={faImages} className="text-3xl text-gold mb-3" />
              <p className="text-gray-700 text-sm">
                {t("gallery.empty")}
              </p>
            </div>
          )}

          {/* Button to full Gallery page */}
          <div>
            <Link
              to={lp("gallery")}
              className="btn-brand inline-flex items-center gap-2 shadow-sm"
            >
              <span>{t("gallery.more")}</span>
              <FontAwesomeIcon icon={faArrowRight} className="text-sm" />
            </Link>
          </div>
        </div>
      </section>

      {/* Lightbox for Homepage preview photos */}
      <GalleryLightbox
        images={featuredPhotos.slice(0, 6)}
        currentIndex={selectedPhotoIndex}
        isOpen={lightboxOpen}
        onClose={closePhotoLightbox}
        onIndexChange={(idx) => setSelectedPhotoIndex(idx)}
      />

      {/* Reflexológia ismertetése */}
      <section id="how-it-works" className="bg-primary/50 py-20 sm:py-28 px-4 border-y border-secondary/20">
        <div className="container mx-auto max-w-4xl">
          <h2 className="section-heading mb-4">
            {t("reflexology.heading")}
          </h2>
          <div className="divider-gold mb-8" />
          <p className="text-center max-w-2xl mx-auto text-gray-800 leading-relaxed">
            {t("reflexology.text")}
          </p>
          <div className="flex justify-center mt-10">
            <img
              src={Foot}
              alt={t("reflexology.imageAlt")}
              className="max-w-xs rounded-md shadow-md ring-1 ring-gold/30"
            />
          </div>
        </div>
      </section>

      {/* Mire számíthatsz egy kezelésen */}
      <section id="process" className="container mx-auto py-20 sm:py-28 px-4">
        <h2 className="section-heading mb-4">
          {t("process.heading")}
        </h2>
        <div className="divider-gold mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          {t("process.steps", { returnObjects: true }).map((step, idx) => (
            <div key={idx} className="text-center p-4">
              <div className="w-12 h-12 rounded-full bg-gold text-ink flex items-center justify-center mx-auto mb-4">
                <FontAwesomeIcon icon={PROCESS_ICONS[idx]} />
              </div>
              <h3 className="font-display text-xl font-semibold mb-2">{step.title}</h3>
              <p className="text-gray-700">{step.text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Vendégvisszajelzések */}
      <section id="testimonials" className="bg-ink text-ivory py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-4 text-ivory">
            {t("testimonials.heading")}
          </h2>
          <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {t("testimonials.items", { returnObjects: true }).map((item) => (
              <blockquote key={item.author} className="bg-ivory/5 border border-gold/20 rounded-md p-6 flex flex-col justify-between">
                <div>
                  <FontAwesomeIcon icon={faQuoteLeft} className="mb-3 text-gold opacity-80" />
                  <p className="italic mb-4 text-ivory/90 leading-relaxed">
                    "{item.quote}"
                  </p>
                </div>
                <footer className="text-sm font-semibold text-gold">– {item.author}</footer>
              </blockquote>
            ))}
          </div>
        </div>
      </section>

      {/* GYIK teaser */}
      <section className="container mx-auto py-16 px-4">
        <div className="bg-primary/60 rounded-md border border-secondary/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-3xl text-gold shrink-0" />
            <p className="text-gray-800">
              {t("faqTeaser.text")}
            </p>
          </div>
          <Link to={lp("faq")} className="btn-outline whitespace-nowrap">
            {t("faqTeaser.button")}
          </Link>
        </div>
      </section>

      {/* Kapcsolat szekció */}
      <section id="contact" className="bg-primary/40 border-t border-secondary/20 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-heading mb-4">{t("contact.heading")}</h2>
          <div className="divider-gold mb-8" />
          <p className="max-w-xl mx-auto text-gray-800 leading-relaxed mb-8">
            {t("contact.text")}
          </p>
          <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center items-center mb-10">
            <a
              href="tel:+36704283858"
              className="flex items-center gap-3 px-5 py-3 bg-white rounded-md border border-secondary/20 text-ink hover:border-gold transition-colors font-medium shadow-sm"
            >
              <FontAwesomeIcon icon={faPhone} className="text-gold" />
              <span>+36 70 428 3858</span>
            </a>
            <a
              href="mailto:azegy1@gmail.com"
              className="flex items-center gap-3 px-5 py-3 bg-white rounded-md border border-secondary/20 text-ink hover:border-gold transition-colors font-medium shadow-sm"
            >
              <FontAwesomeIcon icon={faEnvelope} className="text-gold" />
              <span>azegy1@gmail.com</span>
            </a>
            <a
              href="https://www.facebook.com/gabriella.ujj.10"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("common:social.facebookAria")}
              className="flex items-center gap-3 px-5 py-3 bg-[#1877F2] rounded-md text-white hover:opacity-90 transition-opacity font-medium shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
              <span>Facebook</span>
            </a>
            <a
              href="https://www.youtube.com/@gabriellanemeth4897"
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("common:social.youtubeAria")}
              className="flex items-center gap-3 px-5 py-3 bg-[#FF0000] rounded-md text-white hover:opacity-90 transition-opacity font-medium shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube</span>
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to={lp("contact")} className="btn-brand">
              {t("contact.details")}
            </Link>
            <Link to={lp("courses")} className="btn-outline">
              {t("contact.viewCourses")}
            </Link>
          </div>
        </div>
      </section>

      <Newsletter />

      <Footer />
    </div>
  );
};

export default Home;
