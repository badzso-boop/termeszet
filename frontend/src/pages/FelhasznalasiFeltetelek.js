import React from "react";
import Footer from "../components/Footer";

const FelhasznalasiFeltetelek = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto p-8 bg-white border border-secondary/20 rounded-md min-h-screen my-16">
        <h1 className="font-display text-2xl font-semibold mb-6">Felhasználási Feltételek</h1>

        <section className="mb-6">
          <h2 className="font-display text-xl font-semibold mb-2 text-ink">1. A weboldalon található tartalmak tulajdonjoga</h2>
          <p className="text-gray-700">
            A weboldalon található minden tartalom – beleértve, de nem kizárólagosan, a cikkeket, videókat, tanfolyamokat
            és egyéb oktatási anyagokat – a weboldal tulajdonosának kizárólagos tulajdonát képezik. Ezek másolása,
            terjesztése, átdolgozása, vagy bármilyen más módon történő felhasználása kizárólag a tulajdonos előzetes
            írásbeli engedélyével lehetséges.
          </p>
        </section>

        <section className="mb-6">
          <h2 className="font-display text-xl font-semibold mb-2 text-ink">2. Szerzői jogok védelme</h2>
          <p className="text-gray-700">
            A weboldal tartalmának bármilyen engedély nélküli felhasználása szerzői jogsértésnek minősül, és jogi eljárást
            von maga után. A tulajdonos fenntartja a jogot, hogy jogi lépéseket tegyen bármilyen engedély nélküli
            felhasználás esetén.
          </p>
        </section>

        <section>
          <h2 className="font-display text-xl font-semibold mb-2 text-ink">3. Felelősség kizárása</h2>
          <p className="text-gray-700">
            A weboldal tulajdonosa nem vállal felelősséget a tartalmak felhasználásából eredő közvetlen vagy közvetett
            károkért.
          </p>
        </section>
      </div>

      <Footer />
    </>
  );
};

export default FelhasznalasiFeltetelek;
