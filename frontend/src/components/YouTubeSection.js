import React, { useState, useEffect } from "react";
import axios from "axios";
import { useTranslation } from "react-i18next";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faPlay,
  faArrowUpRightFromSquare,
  faCirclePlay,
  faCalendarDays
} from "@fortawesome/free-solid-svg-icons";
import Profile from "../img/prof-kep.jpg";

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

// Alapértelmezett videók fallback esetére
const DEFAULT_VIDEOS = [
  {
    id: "MAKXalKZrGk",
    title: "Mondjatok le...",
    published: "2024-06-20T06:03:37+00:00",
    url: "https://www.youtube.com/watch?v=MAKXalKZrGk",
    embedUrl: "https://www.youtube-nocookie.com/embed/MAKXalKZrGk",
    thumbnailUrl: "https://img.youtube.com/vi/MAKXalKZrGk/hqdefault.jpg",
    maxThumbnailUrl: "https://img.youtube.com/vi/MAKXalKZrGk/maxresdefault.jpg"
  },
  {
    id: "PSA9kBgvfNo",
    title: "3. Gyorssegély a mindennapi élethez",
    published: "2024-06-19T16:42:55+00:00",
    url: "https://www.youtube.com/watch?v=PSA9kBgvfNo",
    embedUrl: "https://www.youtube-nocookie.com/embed/PSA9kBgvfNo",
    thumbnailUrl: "https://img.youtube.com/vi/PSA9kBgvfNo/hqdefault.jpg",
    maxThumbnailUrl: "https://img.youtube.com/vi/PSA9kBgvfNo/maxresdefault.jpg"
  },
  {
    id: "HBIZUsoUrN8",
    title: "2. Gyorssegély a mindennapi élethez",
    published: "2024-06-19T16:42:05+00:00",
    url: "https://www.youtube.com/watch?v=HBIZUsoUrN8",
    embedUrl: "https://www.youtube-nocookie.com/embed/HBIZUsoUrN8",
    thumbnailUrl: "https://img.youtube.com/vi/HBIZUsoUrN8/hqdefault.jpg",
    maxThumbnailUrl: "https://img.youtube.com/vi/HBIZUsoUrN8/maxresdefault.jpg"
  },
  {
    id: "ePOk6yLond4",
    title: "1. Mostani nehéz idők segítésére",
    published: "2024-06-19T16:41:04+00:00",
    url: "https://www.youtube.com/watch?v=ePOk6yLond4",
    embedUrl: "https://www.youtube-nocookie.com/embed/ePOk6yLond4",
    thumbnailUrl: "https://img.youtube.com/vi/ePOk6yLond4/hqdefault.jpg",
    maxThumbnailUrl: "https://img.youtube.com/vi/ePOk6yLond4/maxresdefault.jpg"
  },
  {
    id: "T2mp69zrj4U",
    title: "Merj szabadon élni!",
    published: "2024-05-10T12:00:00+00:00",
    url: "https://www.youtube.com/watch?v=T2mp69zrj4U",
    embedUrl: "https://www.youtube-nocookie.com/embed/T2mp69zrj4U",
    thumbnailUrl: "https://img.youtube.com/vi/T2mp69zrj4U/hqdefault.jpg",
    maxThumbnailUrl: "https://img.youtube.com/vi/T2mp69zrj4U/maxresdefault.jpg"
  },
  {
    id: "2Oj4mg0TtOU",
    title: "A háborút kint vagy bent éled meg...?!",
    published: "2024-04-15T12:00:00+00:00",
    url: "https://www.youtube.com/watch?v=2Oj4mg0TtOU",
    embedUrl: "https://www.youtube-nocookie.com/embed/2Oj4mg0TtOU",
    thumbnailUrl: "https://img.youtube.com/vi/2Oj4mg0TtOU/hqdefault.jpg",
    maxThumbnailUrl: "https://img.youtube.com/vi/2Oj4mg0TtOU/maxresdefault.jpg"
  }
];

function formatDate(dateString, lang) {
  if (!dateString) return "";
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return "";
    return d.toLocaleDateString(lang === "en" ? "en-GB" : "hu-HU", {
      year: "numeric",
      month: "long",
      day: "numeric"
    });
  } catch (e) {
    return "";
  }
}

const YouTubeSection = () => {
  const { t, i18n } = useTranslation();
  const [videos, setVideos] = useState(DEFAULT_VIDEOS);
  const [loading, setLoading] = useState(true);
  const [selectedVideo, setSelectedVideo] = useState(DEFAULT_VIDEOS[0]);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const fetchVideos = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`${API_BASE_URL}/api/youtube/videos`);
        if (res.data && Array.isArray(res.data.videos) && res.data.videos.length > 0) {
          if (isMounted) {
            setVideos(res.data.videos);
            setSelectedVideo(res.data.videos[0]);
          }
        }
      } catch (err) {
        console.warn("Nem sikerült elérni a YouTube API-t, alapértelmezett videók használata:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchVideos();

    return () => {
      isMounted = false;
    };
  }, []);

  const handleSelectVideo = (video) => {
    setSelectedVideo(video);
    setIsPlaying(true);
  };

  const handleStartPlay = () => {
    setIsPlaying(true);
  };

  const channelUrl = "https://www.youtube.com/@gabriellanemeth4897";
  const subscribeUrl = "https://www.youtube.com/@gabriellanemeth4897?sub_confirmation=1";

  return (
    <section id="videos" className="py-20 sm:py-28 px-4 bg-primary/40 border-t border-secondary/20">
      <div className="container mx-auto max-w-6xl">
        {/* Szekció Cím és leírás */}
        <div className="text-center mb-12">
          <h2 className="section-heading mb-4">{t("youtube.heading")}</h2>
          <div className="divider-gold mb-4" />
          <p className="text-base sm:text-lg text-ink/80 max-w-2xl mx-auto leading-relaxed">
            {t("youtube.intro")}
          </p>
        </div>

        {/* Fő tartalom: Balra a nagy lejátszó, Jobbra a lejátszási lista */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-12">
          {/* Fő Lejátszó Oszlop (7 oszlop széles nagy képernyőn) */}
          <div className="lg:col-span-7 bg-white rounded-lg border border-secondary/20 shadow-sm overflow-hidden flex flex-col">
            {/* Videó képernyő (16:9 arány) */}
            <div className="relative aspect-video w-full bg-ink/90 overflow-hidden">
              {isPlaying ? (
                <iframe
                  src={`https://www.youtube-nocookie.com/embed/${selectedVideo?.id}?autoplay=1&rel=0&modestbranding=1`}
                  title={selectedVideo?.title || t("youtube.playerTitle")}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <div
                  onClick={handleStartPlay}
                  className="group relative w-full h-full cursor-pointer overflow-hidden select-none"
                >
                  {/* Nagyfelbontású borítókép */}
                  <img
                    src={selectedVideo?.maxThumbnailUrl || selectedVideo?.thumbnailUrl}
                    alt={selectedVideo?.title || t("youtube.coverAlt")}
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                    onError={(e) => {
                      if (selectedVideo?.thumbnailUrl && e.target.src !== selectedVideo.thumbnailUrl) {
                        e.target.src = selectedVideo.thumbnailUrl;
                      }
                    }}
                  />
                  {/* Sötét színátmenet a jobb olvashatóságért */}
                  <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/30 to-transparent" />

                  {/* Központi elegáns Play gomb */}
                  <div className="absolute inset-0 flex items-center justify-center">
                    <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-full bg-ink/80 text-gold border-2 border-gold/80 flex items-center justify-center shadow-xl backdrop-blur-sm group-hover:scale-110 group-hover:bg-[#FF0000] group-hover:border-white group-hover:text-white transition-all duration-300">
                      <FontAwesomeIcon icon={faPlay} className="text-xl sm:text-2xl ml-1" />
                    </div>
                  </div>

                  {/* Alsó infósáv az előnézetben */}
                  <div className="absolute bottom-0 inset-x-0 p-4 sm:p-6 text-ivory">
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-black/60 text-gold text-xs font-medium mb-2 backdrop-blur-sm border border-gold/20">
                      <FontAwesomeIcon icon={faCirclePlay} />
                      <span>{t("youtube.clickToPlay")}</span>
                    </div>
                    <h3 className="font-display text-lg sm:text-2xl font-semibold text-ivory line-clamp-2 leading-tight">
                      {selectedVideo?.title}
                    </h3>
                  </div>
                </div>
              )}
            </div>

            {/* Fő videó részletei */}
            <div className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1">
                  <h3 className="font-display text-xl sm:text-2xl font-semibold text-ink leading-snug">
                    {selectedVideo?.title}
                  </h3>
                  {selectedVideo?.published && (
                    <div className="flex items-center gap-2 text-xs text-ink/60 font-medium">
                      <FontAwesomeIcon icon={faCalendarDays} className="text-gold" />
                      <span>{t("youtube.uploaded", { date: formatDate(selectedVideo.published, i18n.language) })}</span>
                    </div>
                  )}
                </div>

                {/* Közvetlen YouTube link gomb */}
                <a
                  href={selectedVideo?.url || channelUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn-outline text-xs sm:text-sm py-2 px-4 shrink-0 flex items-center gap-2 self-start sm:self-center"
                >
                  <span>{t("youtube.openOnYoutube")}</span>
                  <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs" />
                </a>
              </div>
            </div>
          </div>

          {/* Jobb oldali videólista (5 oszlop széles nagy képernyőn) */}
          <div className="lg:col-span-5 flex flex-col bg-white rounded-lg border border-secondary/20 shadow-sm p-5">
            <div className="flex items-center justify-between pb-4 mb-4 border-b border-secondary/20">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-red-600 animate-pulse" />
                <h4 className="font-display font-semibold text-lg text-ink">
                  {t("youtube.latest")}
                </h4>
              </div>
              <span className="text-xs text-ink/60 font-medium">
                {t("youtube.videoCount", { count: videos.length })}
              </span>
            </div>

            {/* Görgethető vagy rácsos lista */}
            <div className="space-y-3 max-h-[480px] overflow-y-auto pr-1">
              {loading ? (
                [...Array(4)].map((_, i) => (
                  <div key={i} className="flex gap-3 p-2 rounded-md animate-pulse">
                    <div className="w-28 aspect-video bg-secondary/30 rounded" />
                    <div className="flex-1 space-y-2 py-1">
                      <div className="h-4 bg-secondary/30 rounded w-3/4" />
                      <div className="h-3 bg-secondary/20 rounded w-1/2" />
                    </div>
                  </div>
                ))
              ) : (
                videos.map((vid) => {
                  const isCurrent = selectedVideo?.id === vid.id;
                  return (
                    <button
                      key={vid.id}
                      onClick={() => handleSelectVideo(vid)}
                      type="button"
                      className={`w-full text-left flex gap-3.5 p-2.5 rounded-md transition-all duration-200 border ${
                        isCurrent
                          ? "bg-gold/15 border-gold shadow-sm"
                          : "bg-primary/10 hover:bg-primary/30 border-secondary/15 hover:border-gold/40"
                      }`}
                    >
                      {/* Előnézeti kép miniatűr */}
                      <div className="relative w-28 sm:w-32 aspect-video shrink-0 rounded overflow-hidden bg-ink/10">
                        <img
                          src={vid.thumbnailUrl}
                          alt={vid.title}
                          loading="lazy"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                          <div
                            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs ${
                              isCurrent ? "bg-[#FF0000] text-white" : "bg-black/60 text-white"
                            }`}
                          >
                            <FontAwesomeIcon icon={faPlay} className="ml-0.5 text-[9px]" />
                          </div>
                        </div>
                      </div>

                      {/* Cím és Dátum */}
                      <div className="flex-1 min-w-0 flex flex-col justify-center">
                        <h5
                          className={`text-xs sm:text-sm font-medium line-clamp-2 leading-snug ${
                            isCurrent ? "text-ink font-semibold" : "text-gray-800"
                          }`}
                        >
                          {vid.title}
                        </h5>
                        {vid.published && (
                          <span className="text-[11px] text-ink/60 mt-1">
                            {formatDate(vid.published, i18n.language)}
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </div>

        {/* Alsó Csatorna Banner & Feliratkozás CTA */}
        <div className="bg-gradient-to-r from-ink via-ink/95 to-ink text-ivory rounded-lg p-6 sm:p-8 border border-gold/30 shadow-md flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-5 text-center sm:text-left flex-col sm:flex-row">
            <img
              src={Profile}
              alt={t("brand.name")}
              className="w-16 h-16 sm:w-20 sm:h-20 rounded-full object-cover object-top ring-2 ring-gold/60 shadow-md shrink-0"
            />
            <div>
              <div className="flex items-center justify-center sm:justify-start gap-2 mb-1">
                <h4 className="font-display text-xl sm:text-2xl font-semibold text-ivory">
                  {t("youtube.channelTitle")}
                </h4>
              </div>
              <p className="text-xs sm:text-sm text-ivory/80 max-w-xl leading-relaxed">
                {t("youtube.channelText")}
              </p>
              <div className="text-xs text-gold/90 mt-1 font-mono">
                @gabriellanemeth4897
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto shrink-0 justify-center">
            <a
              href={subscribeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t("youtube.subscribeAria")}
              className="inline-flex items-center justify-center gap-3 px-6 py-3.5 rounded-md bg-[#FF0000] text-white font-semibold text-sm hover:bg-[#CC0000] transition-colors shadow-md"
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>{t("youtube.subscribe")}</span>
            </a>
            <a
              href={channelUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-md bg-white/10 hover:bg-white/20 text-ivory border border-gold/40 text-sm font-medium transition-colors"
            >
              <span>{t("youtube.allVideos")}</span>
              <FontAwesomeIcon icon={faArrowUpRightFromSquare} className="text-xs text-gold" />
            </a>
          </div>
        </div>
      </div>
    </section>
  );
};

export default YouTubeSection;
