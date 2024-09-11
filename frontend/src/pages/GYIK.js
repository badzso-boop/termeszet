import React from "react";
import Footer from "../components/Footer";

const GYIK = () => {
  return (
    <>
      <div className="py-12">
        <div className="max-w-4xl mx-auto px-6">
          <h2 className="text-3xl font-semibold text-black mb-8 text-center">
            Gyakran Ismételt Kérdések
          </h2>
          <div className="space-y-6">
            {faqData.map((item, index) => (
              <div key={index} className="bg-secondary shadow-md rounded-lg p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">
                  {item.question}
                </h3>
                <p className="text-gray-600">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

const faqData = [
  {
    question: "Hogyan lehet feliratkozni a kurzusokra?",
    answer:
      "A kurzusok menüpont alatt az Önnek megtetszett kurzusnál a 'Regisztrálok' gombra kattintással lehet jelentkezni. Ezután a rendszer elfogadja a jelentkezést.",
  },
  {
    question: "Milyen fizetési módokat fogadnak el a kurzusokért?",
    answer:
      "Egyelőre csak utalással lehet fizetni, de dolgozunk a további lehetőségeken.",
  },
  {
    question: "Van-e lehetőség ingyenes tartalmak elérésére?",
    answer: "Igen, találhatóak ingyenes tartalmak az oldalon!",
  },
  {
    question: "Mennyi ideig lehet hozzáférni egy megvásárolt kurzushoz?",
    answer:
      "Ameddig az oldal működőképes és a felhasználó nem szegi meg a szabályokat.",
  },
  {
    question: "Mi a visszatérítési politika, ha nem vagyok elégedett a kurzussal?",
    answer: "Nemtudom xd",
  },
  {
    question: "Hogyan működik a videókurzusok online megtekintése?",
    answer:
      "A kurzus sikeres fizetés után az adminisztrátor engedélyezi a hozzáférést, onnantól a videót le lehet játszani.",
  },
  {
    question: "Milyen szintű tapasztalattal kell rendelkezni a kurzusok elvégzéséhez?",
    answer: "Kurzusonként változó, de gyakran a kurzus leírása tesz erről említést.",
  },
  {
    question: "Hogyan vehetem fel a kapcsolatot a talpreflexológus szakemberrel további kérdések esetén?",
    answer: "A kapcsolat fülön minden információ megtalálható.",
  },
  {
    question: "Mik azok a talpreflexológiai kezelések, és hogyan működnek?",
    answer: "nemtom",
  },
  {
    question: "Van-e lehetőség személyes konzultációra vagy kezelésre?",
    answer: "nemtom",
  },
  {
    question: "Milyen előnyökkel jár a talpreflexológia rendszeres gyakorlása?",
    answer: "nemtom",
  },
  {
    question: "Ki végezheti el a kurzusokat, és szükséges-e hozzá előzetes képzettség?",
    answer: "nemtom",
  },
  {
    question: "Milyen eszközökre van szükségem a videókurzusok követéséhez?",
    answer: "Bármilyen eszközre, amivel internethozzáférés van és támogatja a videók lejátszását.",
  },
  {
    question: "Miért érdemes előfizetni az oldalon található kurzusokra?",
    answer: "nemtom",
  },
  {
    question: "Milyen különbségek vannak az egyes kurzusok között?",
    answer: "nemtom",
  },
  {
    question: "Hogyan garantálja az oldal a személyes adataim biztonságát?",
    answer: "A felhasználók adatát a GDPR szerint nem adjuk ki 3. félnek és megfelelő módon titkosítva vannak.",
  },
  {
    question: "Hol található a Szolgáltató által nyújtott oktatási anyagok szerzői jogaival kapcsolatos információ?",
    answer: "még kitalálás alatt van",
  },
  {
    question: "Milyen visszajelzéseket adhatok a kurzusokról és tartalmakról?",
    answer: "Komment formájában minden kurzushoz vissza lehet.",
  },
];

export default GYIK;
