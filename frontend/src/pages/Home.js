import React from "react";
import Hero from "../img/hero.jpg";
import Profile from "../img/prof-kep.jpg";
import Foot from "../img/lab.jpg";
import Footer from "../components/Footer";

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Hőskép */}
      <section
        className="relative bg-cover bg-center h-96"
        style={{ backgroundImage: `url(${Hero})` }}
      >
        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="text-center text-white">
            <h1 className="text-4xl font-bold mb-4">
              Fedezze fel a természetes gyógyulás útját és a hangtálak varázsát!
            </h1>
          </div>
        </div>
      </section>

      {/* Bemutatkozó Szöveg */}
      <section id="about" className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Bemutatkozás
        </h2>
        <div className="flex flex-col md:flex-row items-center justify-center">
          {/* Kép a masszőrről */}
          <img
            src={Profile}
            alt="Masszőr képe"
            className="w-48 h-48 rounded-full shadow-md mb-6 md:mb-0 md:mr-6 object-cover object-top"
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
            <p className="text-gray-700 leading-relaxed">
              Hivatásom, hogy természetes módszerekkel segítsek az embereknek
              jobban megismerni testüket és lelküket, és támogassam őket a
              stressz csökkentésében, a fizikai és lelki egészség megőrzésében.
              Szeretettel várok mindenkit, aki érdeklődik a reflexológia, a
              hangtálak vagy bármilyen alternatív gyógyászat iránt.
            </p>
          </div>
        </div>
      </section>
      {/* Szolgáltatások Bemutatása */}
      <section id="services" className="bg-gray-100 py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Szolgáltatások
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
                Reflexológiai Talpmasszázs
              </h3>
              <p className="text-gray-700">
                Stresszoldás és általános jólét növelése érdekében.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">Hangtálas Terápia</h3>
              <p className="text-gray-700">
                Lelki egyensúly helyreállítása, stresszcsökkentés és mély
                relaxáció hangtálakkal.
              </p>
            </div>
            <div className="bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-xl font-semibold mb-4">
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
      <section id="how-it-works" className="container mx-auto py-16 px-4">
        <h2 className="text-3xl font-semibold text-center mb-6">
          Hogyan Működik a Reflexológia?
        </h2>
        <p className="text-center max-w-2xl mx-auto text-gray-700 leading-relaxed">
          A reflexológia egy természetes gyógymód, amely a talpon található
          reflexpontok stimulálásával támogatja a test öngyógyító folyamatait. A
          reflexológus nyomást gyakorol a talp bizonyos pontjaira, amelyek
          kapcsolatban állnak a test különböző szerveivel és rendszereivel, így
          serkentve a vérkeringést és az energiaáramlást.
        </p>
        {/* Illusztráció hozzáadása */}
        <div className="flex justify-center mt-8">
          <img
            src={Foot}
            alt="Reflexológiai pontok a talpon"
            className="max-w-xs rounded-lg shadow-md"
          />
        </div>
      </section>
      {/* Előnyök és Eredmények */}
      <section id="benefits" className="bg-secondary text-white py-16 px-4">
        <div className="container mx-auto">
          <h2 className="text-3xl font-semibold text-center mb-6">
            Előnyök és Eredmények
          </h2>
          <ul className="list-disc list-inside space-y-4 max-w-2xl mx-auto">
            <li>Stresszcsökkentés és relaxáció.</li>
            <li>
              Fájdalomcsillapítás (fejfájás, hátfájás, ízületi fájdalmak).
            </li>
            <li>Emésztési problémák enyhítése.</li>
            <li>Hormonális egyensúly javítása.</li>
            <li>Általános immunitás és energia növelése.</li>
          </ul>
          {/* Esettanulmányok és visszajelzések */}
          <div className="text-center mt-8">
            <blockquote className="text-lg italic">
              "A reflexológiai és hangtál terápia segített megszabadulni a
              hosszú ideje fennálló migrénemtől!" - Boldog Kliens
            </blockquote>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Home;
