import React from "react";
import Footer from "../components/Footer";

const GYIK = () => {
  return (
    <>
      <div className="py-20 sm:py-28 bg-primary/40">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="section-heading mb-4">
            Gyakran Ismételt Kérdések
          </h1>
          <div className="divider-gold mb-12" />
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="bg-white border border-secondary/20 rounded-md p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-ink mb-2">
                  {item.question}
                </h2>
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
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
      "A kurzusok menüpont alatt a kiválasztott kurzusnál a 'Regisztrálok' gombra kattintva tudsz jelentkezni. Ezt követően a rendszer rögzíti a jelentkezésedet.",
  },
  {
    question: "Milyen fizetési módokat fogadnak el a kurzusokért?",
    answer:
      "Egyelőre banki átutalással lehet fizetni, a részleteket a jelentkezés után egyeztetjük.",
  },
  {
    question: "Van-e lehetőség ingyenes tartalmak elérésére?",
    answer: "Igen, időszakosan elérhetők ingyenes ismertető anyagok és bejegyzések az oldalon.",
  },
  {
    question: "Mennyi ideig lehet hozzáférni egy megvásárolt kurzushoz?",
    answer:
      "A kurzushoz folyamatos hozzáférést biztosítunk, amíg az oldal működik és a felhasználói fiók aktív.",
  },
  {
    question: "Hogyan működik a videókurzusok online megtekintése?",
    answer:
      "A befizetés megerősítését követően az adminisztrátor aktiválja a hozzáférést, így a videók és tananyagok azonnal megtekinthetővé válnak a fiókodban.",
  },
  {
    question: "Milyen szintű tapasztalattal kell rendelkezni a kurzusok elvégzéséhez?",
    answer: "Kurzusonként változó, az alapozó anyagokhoz semmilyen előképzettség nem szükséges.",
  },
  {
    question: "Hogyan vehetem fel a kapcsolatot további kérdések esetén?",
    answer: "A Kapcsolat fülön minden információ megtalálható: elérhető vagyok telefonon (+36 70 428 3858) és e-mailben (azegy1@gmail.com) is.",
  },
  {
    question: "Mik azok a talpreflexológiai kezelések, és hogyan működnek?",
    answer:
      "A reflexológia egy természetes gyógymód, amely a talpon található reflexpontok stimulálásával támogatja a test öngyógyító folyamatait. A reflexológus nyomást gyakorol a talp bizonyos pontjaira, amelyek kapcsolatban állnak a test különböző szerveivel, serkentve a keringést és az energiaáramlást.",
  },
  {
    question: "Van-e lehetőség személyes konzultációra vagy kezelésre?",
    answer:
      "Igen. Minden kezelés előtt átbeszéljük az igényeidet és panaszaidat, hogy a folyamat pontosan hozzád legyen igazítva.",
  },
  {
    question: "Milyen előnyökkel jár a talpreflexológia és az energetikai kezelés?",
    answer:
      "Stresszcsökkentés, mély relaxáció, testi fájdalmak és blokkok enyhítése, emésztési és hormonális harmónia, valamint a belső Forrással való mély kapcsolat megerősítése.",
  },
  {
    question: "Ki végezheti el a kurzusokat, és szükséges-e hozzá előzetes képzettség?",
    answer:
      "Bárki jelentkezhet, aki szeretne elmélyülni az önismeretben és a természetes öngyógyítás folyamataiban. Előzetes képzettség nem feltétel.",
  },
  {
    question: "Milyen eszközökre van szükségem a videókurzusok követéséhez?",
    answer: "Bármilyen internetkapcsolattal rendelkező okoseszközre (számítógép, tablet, telefon), amely támogatja a videólejátszást.",
  },
  {
    question: "Miért érdemes előfizetni az oldalon található kurzusokra?",
    answer:
      "A reflexológia és a Forrásodhoz való kapcsolódás alapjait tudod megtanulni, gyakorlati és személyes útmutatással kísérve.",
  },
  {
    question: "Milyen különbségek vannak az egyes kurzusok között?",
    answer:
      "A kurzusok témájukban, mélységükben és formájukban különböznek. Az egyes kurzusok részletes leírását a Kurzusok menüpontban találod.",
  },
  {
    question: "Hogyan garantálja az oldal a személyes adataim biztonságát?",
    answer:
      "Az adatokat a hatályos adatvédelmi szabályoknak (GDPR) megfelelően, biztonságosan kezeljük, és harmadik félnek nem adjuk ki.",
  },
];

export default GYIK;
