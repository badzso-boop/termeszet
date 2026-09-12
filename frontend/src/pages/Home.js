import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSpa, faCertificate, faHeart, faCommentDots, faCalendarCheck, faHandsHoldingCircle, faQuoteLeft, faCircleQuestion } from "@fortawesome/free-solid-svg-icons";
import Hero from "../img/hero.jpg";
import Profile from "../img/prof-kep.jpg";
import Foot from "../img/lab.jpg";
import Footer from "../components/Footer";
import Newsletter from "../components/Newsletter";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hőskép */}
      <section
        className="relative bg-cover bg-center min-h-[28rem] sm:h-[32rem]"
        style={{ backgroundImage: `url(${Hero})` }}
      >
        <div className="absolute inset-0 bg-ink/55 flex items-center justify-center">
          <div className="text-center text-ivory px-4 max-w-3xl">
            <p className="brand-script text-4xl sm:text-6xl mb-4">Németh Gabriella</p>
            <div className="divider-gold mb-6" />
            <h1 className="font-display text-2xl sm:text-3xl font-medium mb-4 leading-snug">
              Fedezze fel a természetes gyógyulás útját és a hangtálak varázsát
            </h1>
            <p className="text-base sm:text-lg mb-8 max-w-2xl mx-auto text-ivory/85">
              Reflexológia és hangtál-terápia egy tapasztalt szakember gondoskodó kezei alatt.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/courses" className="btn-brand">
                Kurzusok megtekintése
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center justify-center px-6 py-3 rounded-md border border-ivory/60 text-ivory font-medium tracking-wide transition-colors duration-300 ease-out hover:border-gold hover:text-gold"
              >
                Regisztráció
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Bemutatkozó Szöveg */}
      <section id="about" className="container mx-auto py-20 sm:py-28 px-4">
        <h2 className="section-heading mb-4">
          Bemutatkozás
        </h2>
        <div className="divider-gold mb-12" />
        <div className="flex flex-col md:flex-row items-center justify-center gap-10">
          {/* Kép a masszőrről */}
          <img
            src={Profile}
            alt="Masszőr képe"
            className="w-48 h-48 rounded-full shadow-sm mb-2 md:mb-0 object-cover object-top ring-1 ring-gold/40"
          />
          <div className="text-center md:text-left max-w-xl">
            <p className="text-gray-700 leading-relaxed mb-4">
              Németh Gabriella vagyok, okleveles talpreflexológus és
              hangtál-terapeuta, több mint 10 év tapasztalattal a reflexológia
              és természetgyógyászat területén. Szakmai utam során a
              talpreflexológia mellett felfedeztem a hangtálak gyógyító erejét
              is, amelyek segítenek a belső egyensúly és harmónia
              helyreállításában.
            </p>
            <p className="text-gray-700 leading-relaxed mb-4">
              Hivatásom, hogy természetes módszerekkel segítsek az embereknek
              jobban megismerni testüket és lelküket, és támogassam őket a
              stressz csökkentésében, a fizikai és lelki egészség megőrzésében.
              Szeretettel várok mindenkit, aki érdeklődik a reflexológia, a
              hangtálak vagy bármilyen alternatív gyógyászat iránt.
            </p>
            <p className="text-gray-700 leading-relaxed">
              Minden vendégemet egyedi igényei szerint fogadom: az első
              alkalommal mindig alaposan átbeszéljük, mi hozott hozzám, hol
              érzed a feszültséget, milyen panaszaid vannak – így a kezelés
              végig a te tempódhoz és állapotodhoz igazodik, nem egy sablon
              szerint zajlik.
            </p>
          </div>
        </div>
      </section>
      {/* Miért engem válassz */}
      <section id="why-me" className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-10">
          Miért engem válassz?
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-4">
            <FontAwesomeIcon icon={faCertificate} className="text-3xl mb-4 text-gold" />
            <h3 className="font-display text-xl font-semibold mb-2">Okleveles szakértelem</h3>
            <p className="text-gray-700">
              Képzett talpreflexológus és hangtál-terapeuta, folyamatosan bővülő szakmai tudással.
            </p>
          </div>
          <div className="text-center p-4">
            <FontAwesomeIcon icon={faSpa} className="text-3xl mb-4 text-gold" />
            <h3 className="font-display text-xl font-semibold mb-2">10+ év tapasztalat</h3>
            <p className="text-gray-700">
              Több mint egy évtizede kísérem ügyfeleimet a testi-lelki egyensúly megtalálásában.
            </p>
          </div>
          <div className="text-center p-4">
            <FontAwesomeIcon icon={faHeart} className="text-3xl mb-4 text-gold" />
            <h3 className="font-display text-xl font-semibold mb-2">Személyre szabott gondoskodás</h3>
            <p className="text-gray-700">
              Minden kezelés egyéni igényeidhez igazodik, nyugodt, gondoskodó légkörben.
            </p>
          </div>
        </div>
      </section>

      {/* Szolgáltatások Bemutatása */}
      <section id="services" className="bg-primary/60 py-20 sm:py-28 px-4">
        <div className="container mx-auto">
          <h2 className="section-heading mb-4">
            Szolgáltatások
          </h2>
          <div className="divider-gold mb-12" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-md border border-secondary/20 shadow-sm">
              <h3 className="font-display text-xl font-semibold mb-3">
                Reflexológiai Talpmasszázs
              </h3>
              <p className="text-gray-700">
                Stresszoldás és általános jólét növelése érdekében.
              </p>
            </div>
            <div className="bg-white p-8 rounded-md border border-secondary/20 shadow-sm">
              <h3 className="font-display text-xl font-semibold mb-3">Hangtálas Terápia</h3>
              <p className="text-gray-700">
                Lelki egyensúly helyreállítása, stresszcsökkentés és mély
                relaxáció hangtálakkal.
              </p>
            </div>
            <div className="bg-white p-8 rounded-md border border-secondary/20 shadow-sm">
              <h3 className="font-display text-xl font-semibold mb-3">
                Kombinált Kezelések
              </h3>
              <p className="text-gray-700">
                Reflexológia és hangtál-terápia kombinációja az egész test és
                lélek harmonizálására.
              </p>
            </div>
          </div>
        </div>
      </section>
      {/* Reflexológia ismertetése */}
      <section id="how-it-works" className="container mx-auto py-20 sm:py-28 px-4">
        <h2 className="section-heading mb-4">
          Hogyan Működik a Reflexológia?
        </h2>
        <div className="divider-gold mb-8" />
        <p className="text-center max-w-2xl mx-auto text-gray-700 leading-relaxed">
          A reflexológia egy természetes gyógymód, amely a talpon található
          reflexpontok stimulálásával támogatja a test öngyógyító folyamatait. A
          reflexológus nyomást gyakorol a talp bizonyos pontjaira, amelyek
          kapcsolatban állnak a test különböző szerveivel és rendszereivel, így
          serkentve a vérkeringést és az energiaáramlást.
        </p>
        {/* Illusztráció hozzáadása */}
        <div className="flex justify-center mt-10">
          <img
            src={Foot}
            alt="Reflexológiai pontok a talpon"
            className="max-w-xs rounded-md shadow-sm ring-1 ring-gold/30"
          />
        </div>
      </section>

      {/* Hangtálterápia ismertetése */}
      <section id="hangtal" className="bg-primary/60 py-20 sm:py-28 px-4">
        <div className="container mx-auto">
          <h2 className="section-heading mb-4">
            Hogyan Működik a Hangtálterápia?
          </h2>
          <div className="divider-gold mb-8" />
          <p className="text-center max-w-2xl mx-auto text-gray-700 leading-relaxed">
            A hangtálak rezgése és mély, tiszta hangja segít a testet és az
            elmét mély relaxációs állapotba juttatni. A hangtál rezgései a
            sejtek szintjén hatnak: oldják az izmokban és a gondolatokban
            felhalmozódott feszültséget, miközben a hallgatóban nyugalom és
            belső csend alakul ki – sokan élményszerű, meditatív állapotként
            írják le a kezelés végét.
          </p>
        </div>
      </section>

      {/* Mire számíthatsz egy kezelésen */}
      <section id="process" className="container mx-auto py-20 sm:py-28 px-4">
        <h2 className="section-heading mb-4">
          Mire számíthatsz egy kezelésen?
        </h2>
        <div className="divider-gold mb-12" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-gold text-ink flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCalendarCheck} />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">1. Időpont egyeztetés</h3>
            <p className="text-gray-700">
              Regisztrálsz, kiválasztod a neked megfelelő kurzust vagy
              kezelést, és egyeztetjük a részleteket.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-gold text-ink flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faCommentDots} />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">2. Konzultáció</h3>
            <p className="text-gray-700">
              Átbeszéljük az igényeidet, panaszaidat, hogy a kezelés pontosan
              rád legyen szabva.
            </p>
          </div>
          <div className="text-center p-4">
            <div className="w-12 h-12 rounded-full bg-gold text-ink flex items-center justify-center mx-auto mb-4">
              <FontAwesomeIcon icon={faHandsHoldingCircle} />
            </div>
            <h3 className="font-display text-xl font-semibold mb-2">3. Kezelés és relaxáció</h3>
            <p className="text-gray-700">
              Nyugodt, gondoskodó légkörben megkapod a reflexológiai és/vagy
              hangtálas kezelést, és testben-lélekben feltöltődve távozol.
            </p>
          </div>
        </div>
      </section>

      {/* Előnyök és Eredmények */}
      <section id="benefits" className="bg-ink text-ivory py-20 sm:py-28 px-4">
        <div className="container mx-auto">
          <h2 className="font-display font-semibold text-3xl sm:text-4xl text-center mb-4">
            Előnyök és Eredmények
          </h2>
          <div className="w-20 h-px mx-auto bg-gradient-to-r from-transparent via-gold to-transparent mb-10" />
          <ul className="list-disc list-inside space-y-3 max-w-2xl mx-auto text-ivory/90">
            <li>Stresszcsökkentés és relaxáció.</li>
            <li>
              Fájdalomcsillapítás (fejfájás, hátfájás, ízületi fájdalmak).
            </li>
            <li>Emésztési problémák enyhítése.</li>
            <li>Hormonális egyensúly javítása.</li>
            <li>Általános immunitás és energia növelése.</li>
          </ul>
          {/* Esettanulmányok és visszajelzések */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            <blockquote className="bg-ivory/5 border border-gold/20 rounded-md p-6">
              <FontAwesomeIcon icon={faQuoteLeft} className="mb-3 text-gold opacity-80" />
              <p className="italic mb-3 text-ivory/90">
                "A reflexológiai és hangtál terápia segített megszabadulni a
                hosszú ideje fennálló migrénemtől!"
              </p>
              <footer className="text-sm text-ivory/60">– Boldog Kliens</footer>
            </blockquote>
            <blockquote className="bg-ivory/5 border border-gold/20 rounded-md p-6">
              <FontAwesomeIcon icon={faQuoteLeft} className="mb-3 text-gold opacity-80" />
              <p className="italic mb-3 text-ivory/90">
                "Évek óta küzdöttem a stresszel, a hangtálas kezelés után
                először éreztem igazi belső nyugalmat."
              </p>
              <footer className="text-sm text-ivory/60">– Elégedett Vendég</footer>
            </blockquote>
            <blockquote className="bg-ivory/5 border border-gold/20 rounded-md p-6">
              <FontAwesomeIcon icon={faQuoteLeft} className="mb-3 text-gold opacity-80" />
              <p className="italic mb-3 text-ivory/90">
                "Gondoskodó, figyelmes hozzáállás minden alkalommal – szívből
                ajánlom bárkinek, aki feltöltődésre vágyik."
              </p>
              <footer className="text-sm text-ivory/60">– Visszatérő Vendég</footer>
            </blockquote>
          </div>
        </div>
      </section>

      {/* GYIK teaser */}
      <section className="container mx-auto py-20 sm:py-24 px-4">
        <div className="bg-primary/60 rounded-md border border-secondary/20 p-8 flex flex-col sm:flex-row items-center justify-between gap-6 max-w-3xl mx-auto">
          <div className="flex items-center gap-4">
            <FontAwesomeIcon icon={faCircleQuestion} className="text-3xl text-gold shrink-0" />
            <p className="text-gray-700">
              Kérdésed van a kezelésekkel vagy a kurzusokkal kapcsolatban? Nézd meg a gyakran
              ismételt kérdéseket, talán már megválaszoltuk!
            </p>
          </div>
          <Link to="/gyik" className="btn-outline whitespace-nowrap">
            GY.I.K.
          </Link>
        </div>
      </section>

      {/* Kapcsolat */}
      <section id="contact" className="container mx-auto py-20 sm:py-28 px-4 text-center">
        <h2 className="section-heading mb-4">Vedd fel velem a kapcsolatot!</h2>
        <div className="divider-gold mb-8" />
        <p className="max-w-xl mx-auto text-gray-700 leading-relaxed mb-10">
          Kérdésed van egy kezelésről vagy szeretnél időpontot foglalni? Nézd meg az elérhető
          kurzusokat, vagy regisztrálj, és személyesen egyeztetünk a részletekről.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/courses" className="btn-brand">
            Kurzusok megtekintése
          </Link>
          <Link to="/register" className="btn-outline">
            Regisztráció
          </Link>
        </div>
      </section>

      <Newsletter />

      <Footer />
    </div>
  );
};

export default Home;
