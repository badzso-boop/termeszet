import React from "react";
import Footer from "../components/Footer";

const ASZF = () => {
  return (
    <>
      <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-4">
        <h1 className="text-2xl font-bold mb-4">Általános Szerződési Feltételek (ÁSZF)</h1>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">1. Bevezetés</h2>
          <p className="text-gray-700">
            Az Általános Szerződési Feltételek (a továbbiakban: ÁSZF) szabályozzák a [Weboldal neve] (a továbbiakban: Szolgáltató) által nyújtott online szolgáltatások használatának feltételeit. A weboldalon elérhető szolgáltatások igénybevétele az alábbi feltételek elfogadásával történik.
          </p>
          <p className="text-gray-700 mt-2">
            <strong>Szolgáltató adatai:</strong>
          </p>
          <ul className="list-disc list-inside text-gray-700">
            <li>Cégnév: [Cégnév]</li>
            <li>Székhely: [Cím]</li>
            <li>Adószám: [Adószám]</li>
            <li>Cégjegyzékszám: [Cégjegyzékszám]</li>
            <li>Elérhetőség: [Email, Telefon]</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">2. Felhasználási feltételek</h2>
          <p className="text-gray-700">
            A weboldal használata és a szolgáltatások igénybevétele kizárólag a jelen ÁSZF-ben meghatározott feltételek szerint történhet. A weboldal használata során a felhasználó köteles betartani a vonatkozó jogszabályokat és nem sértheti más felhasználók jogait.
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>A felhasználó köteles a valós adatokat megadni a regisztráció során.</li>
            <li>A felhasználó nem jogosult harmadik fél adatait vagy jogosultságait használni.</li>
            <li>A szolgáltatások használata során tilos bármilyen jogellenes tevékenység folytatása.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">3. Regisztráció és fiók létrehozása</h2>
          <p className="text-gray-700">
            A szolgáltatások igénybevételéhez a felhasználónak regisztrálnia kell a weboldalon. A regisztráció során a felhasználó köteles valós és pontos adatokat megadni. A fiók létrehozása után a felhasználó felelős a fiókja biztonságáért és a belépési adatai titokban tartásáért.
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>A regisztráció során szükséges adatok: teljes név, e-mail cím, jelszó, stb.</li>
            <li>A fiók létrehozásával a felhasználó elfogadja az ÁSZF-et és az Adatvédelmi nyilatkozatot.</li>
            <li>A fiók tulajdonosa teljes mértékben felelős a fiók biztonságáért és az azzal kapcsolatos tevékenységekért.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">4. Szolgáltatások leírása</h2>
          <p className="text-gray-700">
            A weboldal különböző típusú kurzusokat és előfizetési lehetőségeket kínál a felhasználók számára. Az elérhető kurzusok, azok időtartama, tartalma, valamint a hozzáférés módja és díjazása az egyes kurzusok részletei között találhatók meg.
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Kurzusok típusai: [pl. online tanfolyamok, workshopok, videókurzusok].</li>
            <li>Elérhetőség: A kurzusokhoz való hozzáférés [pl. előfizetés, egyszeri díj megfizetése stb.] révén lehetséges.</li>
            <li>Az egyes kurzusok tartalmát, időtartamát, célját és oktatóit az adott kurzus leírása tartalmazza.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">5. Előfizetési feltételek</h2>
          <p className="text-gray-700">
            Az előfizetés lehetővé teszi a felhasználók számára a weboldalon elérhető kurzusokhoz való hozzáférést meghatározott időszakra. Az előfizetési díjak és feltételek az oldalon külön feltüntetésre kerülnek.
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Előfizetési lehetőségek: havi, negyedéves, éves.</li>
            <li>Fizetési módok: bankkártya, átutalás, PayPal stb.</li>
            <li>Lemondási feltételek: Az előfizetés bármikor lemondható, azonban a már kifizetett díjak nem téríthetők vissza, kivéve a jogszabály által előírt esetekben.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">6. Visszatérítési politika</h2>
          <p className="text-gray-700">
            A visszatérítési feltételek részletezik, hogy a felhasználók milyen esetekben igényelhetnek visszatérítést a kurzusok vagy az előfizetési díjak után.
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Elégedetlenség esetén: A felhasználónak lehetősége van az első [X nap] alatt visszatérítést kérni, ha nem elégedett a szolgáltatással.</li>
            <li>Technikai problémák: Ha a szolgáltatás technikai problémák miatt nem elérhető, a felhasználó jogosult lehet részleges vagy teljes visszatérítésre.</li>
            <li>Jogi rendelkezések: A visszatérítési politika megfelel a vonatkozó jogszabályoknak és fogyasztóvédelmi előírásoknak.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">7. Szerzői jogok és szellemi tulajdon</h2>
          <p className="text-gray-700">
            Az oldalon elérhető összes tartalom, beleértve a kurzusokat, cikkeket, képeket, videókat és egyéb anyagokat, a Szolgáltató vagy a tartalom készítőjének tulajdonát képezi.
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>A tartalmak semmilyen formában nem másolhatók, terjeszthetők, módosíthatók, vagy használhatók fel a Szolgáltató előzetes írásos engedélye nélkül.</li>
            <li>A felhasználók által feltöltött tartalmak esetében a felhasználó kijelenti, hogy jogosult a tartalom megosztására, és nem sérti harmadik fél jogait.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">8. Felelősség korlátozása</h2>
          <p className="text-gray-700">
            A Szolgáltató mindent megtesz annak érdekében, hogy a weboldalon elérhető tartalmak és szolgáltatások hibamentesen működjenek, azonban a következő felelősségkorlátozásokat érvényesíti:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Technikai hibák: A Szolgáltató nem vállal felelősséget a weboldal használata során felmerülő technikai problémákért, adatvesztésért, vagy bármilyen közvetett kárért, amely a felhasználó eszközeinek meghibásodásából ered.</li>
            <li>Hozzáférési korlátozások: A Szolgáltató fenntartja a jogot a weboldalhoz való hozzáférés időszakos korlátozására, karbantartás vagy egyéb okok miatt.</li>
            <li>Tartalmi pontatlanságok: A weboldalon található információk helyességéért és teljességéért a Szolgáltató nem vállal felelősséget. A felhasználó köteles saját belátása szerint eljárni az információk használatakor.</li>
            <li>Harmadik felek szolgáltatásai: A Szolgáltató nem vállal felelősséget harmadik fél által nyújtott szolgáltatásokért vagy azok hibáiért, amelyek elérhetők a weboldalon keresztül.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">9. Adatvédelem</h2>
          <p className="text-gray-700">
            A Szolgáltató elkötelezett a felhasználók személyes adatainak védelme mellett, és betartja az Európai Unió általános adatvédelmi rendeletének (GDPR) előírásait.
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Adatgyűjtés és felhasználás: A Szolgáltató gyűjtheti és feldolgozhatja a felhasználók személyes adatait a weboldal használata során. Az adatkezelés céljai: szolgáltatások biztosítása, ügyfélszolgálat, marketing célú megkeresések, statisztikai elemzések.</li>
            <li>Adatvédelmi tájékoztató: A felhasználók részletes adatvédelmi tájékoztatót érhetnek el az Adatvédelmi nyilatkozatban, amely meghatározza az adatgyűjtés, -feldolgozás és -tárolás módját.</li>
            <li>Felhasználói jogok: A felhasználók bármikor kérhetik személyes adataik törlését, módosítását vagy az adatkezelés korlátozását.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">10. Jogviták rendezése</h2>
          <p className="text-gray-700">
            A Szolgáltató és a felhasználók között felmerülő jogvitákat a felek békés úton, tárgyalásos megbeszélés során próbálják rendezni. Amennyiben ez nem vezet eredményre, a jogviták rendezésére a Szolgáltató székhelye szerinti bíróság illetékes.
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Illetékes bíróság: A jogviták rendezésére az illetékes bíróság [Város neve] területén található.</li>
            <li>Jogszabályi háttér: Az ÁSZF-ben nem szabályozott kérdésekben a Magyarország hatályos jogszabályai, különösen a Polgári Törvénykönyv rendelkezései az irányadók.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">11. ÁSZF módosításának lehetősége</h2>
          <p className="text-gray-700">
            A Szolgáltató fenntartja a jogot, hogy az ÁSZF-et bármikor módosítsa. A módosításokról a felhasználókat a weboldalon keresztül vagy e-mailben értesítjük.
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Módosítási jog: A Szolgáltató jogosult az ÁSZF egyoldalú módosítására, különösen, de nem kizárólag, jogszabályváltozás, új szolgáltatások bevezetése, vagy a szolgáltatások megszüntetése esetén.</li>
            <li>Értesítési kötelezettség: A módosítás hatályba lépését megelőzően [X nappal] a Szolgáltató értesíti a felhasználókat a változásokról.</li>
          </ul>
        </section>

        <section className="mb-6">
          <h2 className="text-xl font-semibold mb-2">12. Kapcsolatfelvételi adatok</h2>
          <p className="text-gray-700">
            A felhasználók bármilyen kérdés, észrevétel vagy panasz esetén kapcsolatba léphetnek a Szolgáltatóval az alábbi elérhetőségeken:
          </p>
          <ul className="list-disc list-inside text-gray-700 mt-2">
            <li>Ügyfélszolgálat: [Email cím, telefonszám]</li>
            <li>Postai cím: [Cím]</li>
            <li>Ügyfélszolgálati nyitva tartás: [Hétfőtől péntekig, 9:00-17:00]</li>
          </ul>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ASZF;
