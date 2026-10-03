import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
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

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || "";

const Home = () => {
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
          const res = await axios.get(`${API_BASE_URL}/api/gallery/featured`);
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
            const resAll = await axios.get(`${API_BASE_URL}/api/gallery`);
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
          const res = await axios.get(`${API_BASE_URL}/api/services/featured`);
          const data = Array.isArray(res.data) ? res.data : [];
          if (data.length > 0) {
            servList = data;
          }
        } catch (e) {
          // Fallback to all services
          try {
            const resAll = await axios.get(`${API_BASE_URL}/api/services`);
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
  }, []);

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
            alt="Németh Gabriella Logó"
            className="max-h-64 sm:max-h-80 md:max-h-96 w-auto mx-auto mb-6 object-contain drop-shadow-md"
          />
          <h1 className="brand-script text-4xl sm:text-6xl text-ink mb-3">
            Németh Gabriella
          </h1>
          <div className="divider-gold mb-6" />
          <p className="font-display text-xl sm:text-2xl font-semibold text-ink tracking-wide mb-4">
            Spirituális energia- és lélekgyógyász · Talpreflexológus · Forrás-kód® lélekalkotás kísérő
          </p>
          <p className="text-base sm:text-lg text-ink/80 max-w-2xl mx-auto mb-8 leading-relaxed">
            Hiszem, hogy a test és a lélek folyamatosan párbeszédben van egymással. Kísérés a belső Forráshoz,
            az öngyógyító folyamatokhoz és a harmonikus testi-lelki egyensúlyhoz.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/courses" className="btn-brand">
              Kurzusok megtekintése
            </Link>
            <Link to="/kapcsolat" className="btn-outline">
              Kapcsolatfelvétel
            </Link>
          </div>
        </div>
      </section>

      {/* Bemutatkozó Szöveg */}
      <section id="about" className="container mx-auto py-20 sm:py-28 px-4">
        <h2 className="section-heading mb-4">Bemutatkozás</h2>
        <div className="divider-gold mb-12" />
        <div className="flex flex-col md:flex-row items-center justify-center gap-12 max-w-5xl mx-auto">
          {/* Kép a gyógyítóról */}
          <div className="shrink-0 text-center">
            <img
              src={Profile}
              alt="Németh Gabriella"
              className="w-56 h-56 sm:w-64 sm:h-64 rounded-full shadow-md object-cover object-top ring-2 ring-gold/50 mx-auto"
            />
            <p className="font-display text-xl font-semibold mt-4 text-ink">Németh Gabriella</p>
            <p className="text-sm text-ink/70">Lélekalkotás kísérő & Reflexológus</p>
          </div>

          <div className="text-left space-y-4 text-gray-800 leading-relaxed">
            <p>
              Hiszem, hogy a test és a lélek folyamatosan párbeszédben van egymással. Spirituális energia- és
              lélekgyógyászként, energetikai kezeléssel és talpreflexológiával kísérem azokat, akik szeretnék
              jobban megérteni, mit üzen a testük, és hogyan találhatnak vissza a belső egyensúlyukhoz.
              A hozzám fordulókkal együtt nézzük meg, milyen testi-lelki folyamatok állhatnak a tünetek mögött.
              Abban támogatok mindenkit, hogy a saját tempójában haladva rátaláljon a számára leginkább működő
              megoldásokra. Számomra ez egy olyan jelenlétet és figyelmet igénylő folyamat, melyben a már a vendégemben
              lévő utat tárom fel önmagához, és tudatosítom benne azokat a szunnyadó képességeit, amit benső Forrásához
              kapcsolódva képessé válik megtapasztalni azt mi az Ő lélek feladata.
            </p>
            <p>
              Empataként gyerekkorom óta velem él az a fajta mély érzékenység, amellyel finoman ráhangolódok mások
              belső folyamataira. Több mint harminc éve kísér ez a belső nyelv, amely segít ráérezni a mélyebben
              gyökerező, akár generációkon átívelő mintákra is. A talpreflexológia számomra egy híd: a talpon keresztül
              a test jelzéseivel dolgozva teret adunk annak, hogy régi feszültségek és lenyomatok finoman elkezdhessenek
              oldódni. Ez nem ígéret, hanem közös figyelem és kísérés, a saját ritmusodban.
            </p>
            <p>
              Már gyerekkoromban is erősen érzékeltem az embereket és a körülöttük lévő világot. Gyógynövényteákat
              készítettem, gyengéden masszíroztam és sokszor azt tapasztaltam, hogy a fájdalom enyhül. Tinédzserként
              egyre tudatosabban figyeltem fel arra is, hogy terekben, otthonokban milyen más finom jelenlétet érzek,
              és számomra gyakran elég volt a csendes, koncentrált jelenlét ahhoz, hogy a hely atmoszférája megváltozzon.
              Ezeket a tapasztalatokat akkor még nem tudtam megnevezni, csak éltem őket, ma pedig már látom, hogy
              mennyire meghatározták azt az utat, amin ma kísérem az embereket.
            </p>
            <p>
              Több mint tíz éve kísérek daganatos megbetegedéssel érintett embereket abban, hogy a saját útjukon,
              a saját tempójukban találják meg a belső támaszaikat. Hiszek az együttműködésben. A hozzám fordulókat
              abban támogatom, hogy az orvosi ellátás mellett kiegészítő, támogató megoldásokat adjak számukra.
            </p>
          </div>
        </div>
      </section>

      {/* Miért engem válassz */}
      <section id="why-me" className="bg-primary/40 py-16 px-4 border-y border-secondary/20">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-4">Miért engem válassz?</h2>
          <div className="divider-gold mb-10" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
            <div className="text-center p-6 bg-white rounded-md border border-secondary/20 shadow-sm">
              <FontAwesomeIcon icon={faEye} className="text-3xl mb-4 text-gold" />
              <h3 className="font-display text-xl font-semibold mb-2">30+ év mély empátia</h3>
              <p className="text-gray-700">
                Gyerekkorom óta kísérő finom ráhangolódás, amellyel ráérzek a mélyen gyökerező, akár generációs mintákra is.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-md border border-secondary/20 shadow-sm">
              <FontAwesomeIcon icon={faCertificate} className="text-3xl mb-4 text-gold" />
              <h3 className="font-display text-xl font-semibold mb-2">10+ év tapasztalat</h3>
              <p className="text-gray-700">
                Több mint egy évtizede kísérek daganatos és krónikus betegséggel érintett embereket az orvosi ellátást kiegészítve.
              </p>
            </div>
            <div className="text-center p-6 bg-white rounded-md border border-secondary/20 shadow-sm">
              <FontAwesomeIcon icon={faHeart} className="text-3xl mb-4 text-gold" />
              <h3 className="font-display text-xl font-semibold mb-2">Személyre szabott jelenlét</h3>
              <p className="text-gray-700">
                A saját ritmusodban haladva tárjuk fel a belső Forrásodat és szunnyadó képességeidet a teljes harmóniáért.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Szolgáltatások Bemutatása */}
      <section id="services" className="py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="section-heading mb-4">Szolgáltatások</h2>
          <div className="divider-gold mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {(featuredServices.length > 0 ? featuredServices : [
              {
                id: "def-1",
                title: "Kombinált Kezelés",
                description: "Reflexológia és energetikai kezelés az egész testre, amellyel a testi blokkok oldása mellett a lelket és a belső energiákat harmonizáljuk.",
                iconType: "hands"
              },
              {
                id: "def-2",
                title: "Vérreflexológia",
                description: "A vérkeringést, nyirokkeringést és a testnedvek optimális áramlását serkentő, célzott kezelés, amely elősegíti a sejtek oxigén- és tápanyagellátását, a méregtelenítést és az érhálózat megújulását.",
                iconType: "heart"
              },
              {
                id: "def-3",
                title: "Életmódtanácsadás",
                description: "Személyre szabott mély meditációval viszlek vissza a születés előtti állapotodhoz és mutatom be a jelenlegi életedhez illő folyamatokat, amivel az új életedet tudod felépíteni.",
                iconType: "compass"
              },
              {
                id: "def-4",
                title: "Táplálkozás és Energetikai Tanácsadás",
                description: "A tested által mutatott folyamatoknak megfelelően adom az étrendet, testmozgást javaslok, életmegújító, gondolkodásmód-formáló gyakorlatokkal és munkafolyamatokkal építjük újjá az életedet.",
                iconType: "seedling"
              },
              {
                id: "def-5",
                title: "Lélekalkotás Kísérő (Forrás-kód®)",
                description: "Ezen a foglalkozáson egyénileg kérheted, hogy egy új személyiséget hozzunk létre a te eredendő lélekprogramodnak megfelelően.",
                iconType: "spa"
              },
              {
                id: "def-6",
                title: "Talpreflexológia",
                description: "A talpon keresztül a test jelzéseivel dolgozva teret adunk annak, hogy a régi feszültségek, blokkok és lenyomatok finoman elkezdhessenek oldódni.",
                iconType: "feet"
              }
            ]).map((service) => (
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
                  <h3 className="font-display text-xl font-semibold mb-3 text-ink">
                    {service.title}
                  </h3>
                  <p className="text-gray-700 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
                {(service.price || service.duration) && (
                  <div className="pt-4 mt-4 border-t border-secondary/15 flex items-center justify-between text-xs text-ink/70 font-medium">
                    {service.duration && <span>Időtartam: {service.duration}</span>}
                    {service.price && <span className="text-ink font-semibold text-sm">{service.price}</span>}
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
          <h2 className="section-heading mb-4">Galéria</h2>
          <div className="divider-gold mb-4" />
          <p className="text-base sm:text-lg text-ink/80 max-w-2xl mx-auto mb-12 leading-relaxed">
            Pillantson be a kezelések, a tanfolyamok és a békés környezet legszebb pillanataiba.
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
                      alt={title || `Galéria előnézet ${idx + 1}`}
                      loading="lazy"
                      className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-ink/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4 text-left text-ivory">
                      <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/40 text-gold flex items-center justify-center backdrop-blur-sm border border-gold/30 group-hover:scale-110 transition-transform">
                        <FontAwesomeIcon icon={faMagnifyingGlassPlus} className="text-xs" />
                      </div>
                      {title && (
                        <h4 className="font-display font-semibold text-base line-clamp-1 text-ivory">
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
                Galériánk hamarosan feltöltésre kerül a legújabb pillanatokkal.
              </p>
            </div>
          )}

          {/* Button to full Gallery page */}
          <div>
            <Link
              to="/galeria"
              className="btn-brand inline-flex items-center gap-2 shadow-sm"
            >
              <span>Tovább a galériára</span>
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
            Hogyan Működik a Reflexológia?
          </h2>
          <div className="divider-gold mb-8" />
          <p className="text-center max-w-2xl mx-auto text-gray-800 leading-relaxed">
            A reflexológia egy természetes gyógymód, amely a talpon található
            reflexpontok stimulálásával támogatja a test öngyógyító folyamatait. A
            talp bizonyos pontjaira gyakorolt nyomással aktiváljuk a test szerveivel
            és energetikai rendszereivel való kapcsolatot, serkentve a vérkeringést
            és a belső energiaáramlást.
          </p>
          <div className="flex justify-center mt-10">
            <img
              src={Foot}
              alt="Reflexológiai pontok a talpon"
              className="max-w-xs rounded-md shadow-md ring-1 ring-gold/30"
            />
          </div>
        </div>
      </section>

      {/* Mire számíthatsz egy kezelésen */}
      <section id="process" className="container mx-auto py-20 sm:py-28 px-4">
        <h2 className="section-heading mb-4">
          Mire számíthatsz egy kezelésen?
        </h2>
        <div className="divider-gold mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 max-w-5xl mx-auto">
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-gold text-ink flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">1. Időpont-egyeztetés</h3>
            <p className="text-gray-700">
              Vedd fel velem a kapcsolatot telefonon, emailben vagy az oldalon keresztül, és egyeztetjük a részleteket.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-gold text-ink flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCommentDots} />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">2. Konzultáció</h3>
            <p className="text-gray-700">
              Alaposan átbeszéljük a testi-lelki folyamataidat, tüneteidet, hogy a kezelés teljesen rád és a tempódra legyen szabva.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-gold text-ink flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faHandsHoldingCircle} />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">3. Kezelés és relaxáció</h3>
            <p className="text-gray-700">
              Nyugodt, gondoskodó légkörben megkapod a reflexológiai és/vagy energetikai kezelést, és testben-lélekben feltöltődve távozol.
            </p>
          </div>
        </div>
      </section>

      {/* Vendégvisszajelzések */}
      <section id="testimonials" className="bg-ink text-ivory py-20 sm:py-28 px-4">
        <div className="container mx-auto max-w-5xl">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-4 text-ivory">
            Vendégvisszajelzések
          </h2>
          <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-12" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <blockquote className="bg-ivory/5 border border-gold/20 rounded-md p-6 flex flex-col justify-between">
              <div>
                <FontAwesomeIcon icon={faQuoteLeft} className="mb-3 text-gold opacity-80" />
                <p className="italic mb-4 text-ivory/90 leading-relaxed">
                  "Hálásan köszönöm neked az önzetlen és szakértői segítségedet, amivel végigkísértél a kemoterápián, mert sokban hozzájárultál a teljes gyógyulásomhoz, hogy mindig elérhető voltál és a pontos módszereket az orvosokkal együttdolgozva adtad meg számomra."
                </p>
              </div>
              <footer className="text-sm font-semibold text-gold">– Zsuzsanna</footer>
            </blockquote>

            <blockquote className="bg-ivory/5 border border-gold/20 rounded-md p-6 flex flex-col justify-between">
              <div>
                <FontAwesomeIcon icon={faQuoteLeft} className="mb-3 text-gold opacity-80" />
                <p className="italic mb-4 text-ivory/90 leading-relaxed">
                  "Köszönöm, hogy a csontvelő daganatomból segítettél felépülni."
                </p>
              </div>
              <footer className="text-sm font-semibold text-gold">– Erzsébet</footer>
            </blockquote>

            <blockquote className="bg-ivory/5 border border-gold/20 rounded-md p-6 flex flex-col justify-between">
              <div>
                <FontAwesomeIcon icon={faQuoteLeft} className="mb-3 text-gold opacity-80" />
                <p className="italic mb-4 text-ivory/90 leading-relaxed">
                  "Nem tudok elég hálás lenni neked azért a sok segítségért, megértésért és folyamatos kommunikációért, amit a lombikos program alatt irányunkba mutattál. A segítséged nélkül nem születhetett volna meg kislányunk, köszönöm."
                </p>
              </div>
              <footer className="text-sm font-semibold text-gold">– Barbara</footer>
            </blockquote>

            <blockquote className="bg-ivory/5 border border-gold/20 rounded-md p-6 flex flex-col justify-between">
              <div>
                <FontAwesomeIcon icon={faQuoteLeft} className="mb-3 text-gold opacity-80" />
                <p className="italic mb-4 text-ivory/90 leading-relaxed">
                  "Drága Gabi, számomra hatalmas nagy csoda és még mindig alig hiszem el, hogy ez tényleg megtörtént! Várandós vagyok! Minden rendben, van keze lába, ujjai, orra, füle, szíve, gyomra, veséje, pulzál mindene. Az én méhem minden oldala jól működik és tele van élettel!"
                </p>
              </div>
              <footer className="text-sm font-semibold text-gold">– Katalin</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* GYIK teaser */}
      <section className="container mx-auto py-16 px-4">
        <div className="bg-primary/60 rounded-md border border-secondary/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-3xl text-gold shrink-0" />
            <p className="text-gray-800">
              Kérdésed van a kezelésekkel vagy a kurzusokkal kapcsolatban? Nézd meg a gyakran
              ismételt kérdéseket!
            </p>
          </div>
          <Link to="/gyik" className="btn-outline whitespace-nowrap">
            GY.I.K.
          </Link>
        </div>
      </section>

      {/* Kapcsolat szekció */}
      <section id="contact" className="bg-primary/40 border-t border-secondary/20 py-20 px-4 text-center">
        <div className="max-w-3xl mx-auto">
          <h2 className="section-heading mb-4">Vedd fel velem a kapcsolatot!</h2>
          <div className="divider-gold mb-8" />
          <p className="max-w-xl mx-auto text-gray-800 leading-relaxed mb-8">
            Kérdésed van a kezelésekről vagy szeretnél időpontot egyeztetni? Keress bátran telefonon vagy e-mailben!
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
              aria-label="Facebook profil"
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
              aria-label="YouTube csatorna"
              className="flex items-center gap-3 px-5 py-3 bg-[#FF0000] rounded-md text-white hover:opacity-90 transition-opacity font-medium shadow-sm"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
              </svg>
              <span>YouTube</span>
            </a>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/kapcsolat" className="btn-brand">
              Részletes kapcsolati adatok
            </Link>
            <Link to="/courses" className="btn-outline">
              Kurzusok megtekintése
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
