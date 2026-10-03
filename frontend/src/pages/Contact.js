import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPhone, faEnvelope, faClock, faHeart } from "@fortawesome/free-solid-svg-icons";
import Footer from "../components/Footer";
import Profile from "../img/prof-kep.jpg";
import Logo from "../img/logo_1.png";

const Contact = () => {
  return (
    <div className="min-h-screen flex flex-col bg-primary/40">
      <div className="flex-1 py-16 sm:py-24 px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="section-heading mb-4">Kapcsolat</h1>
          <div className="divider-gold mb-12" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
            {/* Kapcsolati kártya */}
            <div className="bg-white border border-secondary/20 rounded-md p-8 shadow-sm flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-4 mb-6">
                  <img
                    src={Profile}
                    alt="Németh Gabriella"
                    className="w-20 h-20 rounded-full object-cover object-top ring-1 ring-gold/40 shadow-sm"
                  />
                  <div>
                    <h2 className="font-display text-2xl font-semibold text-ink">Németh Gabriella</h2>
                    <p className="text-sm text-ink/70">
                      Reflexológia és Forrás-kód® lélekalkotás kísérő
                    </p>
                  </div>
                </div>

                <p className="text-gray-700 mb-8 leading-relaxed">
                  Szeretettel várlak, ha szeretnél rátalálni a belső Forrásodra, oldani a testi-lelki blokkokat,
                  vagy kísérést keresel a gyógyulási utadon. Keress bizalommal az alábbi elérhetőségeken!
                </p>

                <div className="space-y-4">
                  <a
                    href="tel:+36704283858"
                    className="flex items-center gap-4 p-3 rounded-md border border-secondary/20 hover:border-gold hover:bg-gold/5 transition-all text-ink"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold/20 text-ink flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faPhone} />
                    </div>
                    <div>
                      <div className="text-xs text-ink/60 uppercase tracking-wider">Telefonszám</div>
                      <div className="font-medium text-base">+36 70 428 3858</div>
                    </div>
                  </a>

                  <a
                    href="mailto:azegy1@gmail.com"
                    className="flex items-center gap-4 p-3 rounded-md border border-secondary/20 hover:border-gold hover:bg-gold/5 transition-all text-ink"
                  >
                    <div className="w-10 h-10 rounded-full bg-gold/20 text-ink flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faEnvelope} />
                    </div>
                    <div>
                      <div className="text-xs text-ink/60 uppercase tracking-wider">E-mail cím</div>
                      <div className="font-medium text-base">azegy1@gmail.com</div>
                    </div>
                  </a>

                  <div className="flex items-center gap-4 p-3 rounded-md border border-secondary/20 bg-primary/20 text-ink">
                    <div className="w-10 h-10 rounded-full bg-gold/20 text-ink flex items-center justify-center shrink-0">
                      <FontAwesomeIcon icon={faClock} />
                    </div>
                    <div>
                      <div className="text-xs text-ink/60 uppercase tracking-wider">Időpont-egyeztetés</div>
                      <div className="font-medium text-sm">Előzetes bejelentkezés alapján</div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-secondary/20 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <span className="text-sm text-ink/70">Kövess be közösségi oldalaimon:</span>
                <div className="flex items-center gap-2">
                  <a
                    href="https://www.facebook.com/gabriella.ujj.10"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook profil"
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#1877F2] text-white hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium shadow-sm"
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
                    className="inline-flex items-center gap-2 px-3.5 py-2 rounded-md bg-[#FF0000] text-white hover:opacity-90 transition-opacity text-xs sm:text-sm font-medium shadow-sm"
                  >
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                    <span>YouTube</span>
                  </a>
                </div>
              </div>
            </div>

            {/* Jobb oldali információs kártya */}
            <div className="bg-secondary/80 border border-secondary/30 rounded-md p-8 shadow-sm flex flex-col justify-between text-ink">
              <div className="text-center">
                <img
                  src={Logo}
                  alt="Logó"
                  className="max-h-36 mx-auto mb-6 object-contain drop-shadow-sm"
                />
                <h3 className="font-display text-2xl font-semibold mb-4">
                  Egyéni és Személyre Szabott Kísérés
                </h3>
                <p className="text-ink/80 text-sm leading-relaxed mb-6">
                  Hiszek az együttműködésben és a test-lélek folyamatos párbeszédében.
                  Minden kezelés és konzultáció az egyéni igényeidhez, saját tempódhoz és
                  lélekfeladatodhoz igazodik.
                </p>
              </div>

              <div className="bg-white/80 rounded-md p-5 border border-gold/30">
                <div className="flex items-center gap-3 mb-2 text-ink font-semibold">
                  <FontAwesomeIcon icon={faHeart} className="text-gold" />
                  <span>Helyszíni és Online Konzultáció</span>
                </div>
                <p className="text-xs text-gray-700 leading-relaxed">
                  A kezelések személyesen, nyugodt, harmonikus környezetben történnek.
                  Bizonyos életmód- és Forrás-kód® konzultációk online formában is elérhetők.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Contact;
