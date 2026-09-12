import React from "react";
import Footer from "../components/Footer";

const Adatvedelem = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto p-8 bg-white border border-secondary/20 rounded-md my-16">
        <h1 className="font-display text-2xl font-semibold mb-6">Adatvédelmi Tájékoztató</h1>

        <section className="mb-6">
          <h2 className="font-display text-xl font-semibold mb-2 text-ink">1. Adatkezelő megnevezése és elérhetősége</h2>
          <p className="text-gray-700">
            <strong>Név:</strong> [Weboldal Tulajdonosának Neve] <br />
            <strong>Cím:</strong> [Weboldal Tulajdonosának Címe] <br />
            <strong>E-mail:</strong> [E-mail cím] <br />
            <strong>Telefonszám:</strong> [Telefonszám]
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-display text-xl font-semibold mb-2 text-ink">2. A kezelt adatok köre</h2>
          <p className="text-gray-700">
            A weboldalunkon kizárólag az alábbi adatokat gyűjtjük és kezeljük: név, e-mail cím, felhasználónév, jelszó
            (titkosított formában).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-display text-xl font-semibold mb-2 text-ink">3. Az adatkezelés célja és jogalapja</h2>
          <p className="text-gray-700">
            Az adatkezelés célja: a felhasználók azonosítása, a weboldal szolgáltatásainak nyújtása, kurzusokhoz való
            hozzáférés biztosítása, és a felhasználói fiókok kezelése.
          </p>
          <p className="text-gray-700">
            Az adatkezelés jogalapja: a felhasználó hozzájárulása a regisztráció során (GDPR 6. cikk (1) bekezdés a)
            pont).
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-display text-xl font-semibold mb-2 text-ink">4. Az adatok tárolása és biztonsága</h2>
          <p className="text-gray-700">
            A felhasználók adatait biztonságos MySQL szerveren tároljuk, amelyhez csak megfelelő jogosultsággal rendelkező
            személyek férhetnek hozzá. A jelszavak titkosítva vannak tárolva. Az adatokat harmadik félnek nem adjuk át,
            kivéve, ha erre jogszabályi kötelezettségünk van.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-display text-xl font-semibold mb-2 text-ink">5. Adatok megőrzési ideje</h2>
          <p className="text-gray-700">
            A felhasználói adatokat addig őrizzük meg, amíg az adott felhasználó regisztrációja aktív. A felhasználói
            fiók törlésekor az adatokat haladéktalanul töröljük.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-display text-xl font-semibold mb-2 text-ink">6. A felhasználók jogai</h2>
          <p className="text-gray-700">
            A felhasználóknak joguk van hozzáférni a róluk tárolt adatokhoz, kérni azok helyesbítését, törlését,
            korlátozását, vagy tiltakozni az adatkezelés ellen. Továbbá joguk van a hozzájárulás bármikor történő
            visszavonásához.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold mb-2 text-ink">7. Adatvédelmi kapcsolattartó</h2>
          <p className="text-gray-700">
            Ha kérdése van az adatvédelmi szabályzatunkkal kapcsolatban, kérjük, lépjen kapcsolatba velünk a fent
            megadott elérhetőségeken.
          </p>
        </section>

      </div>
      <Footer />
    </>
  );
};

export default Adatvedelem;