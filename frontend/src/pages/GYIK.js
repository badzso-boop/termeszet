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
    answer:
      "Ha nem vagy elégedett a kurzussal, keress meg minket a kapcsolati elérhetőségeken, és egyedileg megvizsgáljuk a lehetőségeket. A pontos feltételeket az ÁSZF tartalmazza.",
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
    answer:
      "A reflexológia egy természetes gyógymód, amely a talpon található reflexpontok stimulálásával támogatja a test öngyógyító folyamatait. A reflexológus nyomást gyakorol a talp bizonyos pontjaira, amelyek kapcsolatban állnak a test különböző szerveivel, így serkentve a vérkeringést és az energiaáramlást.",
  },
  {
    question: "Van-e lehetőség személyes konzultációra vagy kezelésre?",
    answer:
      "Igen. Minden kezelés előtt átbeszéljük az igényeidet és panaszaidat, hogy a kezelés pontosan hozzád legyen szabva – ehhez a regisztráció után vedd fel velünk a kapcsolatot.",
  },
  {
    question: "Milyen előnyökkel jár a talpreflexológia rendszeres gyakorlása?",
    answer:
      "Stresszcsökkentés és relaxáció, fájdalomcsillapítás (fejfájás, hátfájás, ízületi fájdalmak), emésztési problémák enyhítése, hormonális egyensúly javítása, valamint az általános immunitás és energiaszint növelése.",
  },
  {
    question: "Ki végezheti el a kurzusokat, és szükséges-e hozzá előzetes képzettség?",
    answer:
      "Bárki jelentkezhet, aki érdeklődik a téma iránt – előzetes képzettség általában nem szükséges, de ha egy adott kurzusnál mégis van megkötés, azt mindig feltüntetjük a kurzus leírásánál.",
  },
  {
    question: "Milyen eszközökre van szükségem a videókurzusok követéséhez?",
    answer: "Bármilyen eszközre, amivel internethozzáférés van és támogatja a videók lejátszását.",
  },
  {
    question: "Miért érdemes előfizetni az oldalon található kurzusokra?",
    answer:
      "Mert szakértő vezetésével, saját tempódban, otthonról is elsajátíthatod a reflexológia és a hangtálterápia alapjait, videóanyagok és személyre szabott konzultáció segítségével.",
  },
  {
    question: "Milyen különbségek vannak az egyes kurzusok között?",
    answer:
      "A kurzusok témában, időpontban, helyszínben (személyes vagy online) és árban is különböznek – minden kurzusnál a kurzus oldalán találod a pontos részleteket.",
  },
  {
    question: "Hogyan garantálja az oldal a személyes adataim biztonságát?",
    answer:
      "Az adataidat a GDPR előírásainak megfelelően kezeljük, és nem adjuk ki harmadik félnek. Az adatvédelemmel kapcsolatos részletekért lásd az Adatvédelmi Tájékoztatót.",
  },
  {
    question: "Hol található a Szolgáltató által nyújtott oktatási anyagok szerzői jogaival kapcsolatos információ?",
    answer:
      "A szerzői jogokkal kapcsolatos részletes tájékoztatást az ÁSZF és a Felhasználási feltételek oldalakon találod.",
  },
  {
    question: "Milyen visszajelzéseket adhatok a kurzusokról és tartalmakról?",
    answer: "Komment formájában minden kurzushoz vissza lehet.",
  },
];

export default GYIK;
