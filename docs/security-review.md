# Biztonsági átvilágítás — `termeszet` backend

**Frissítés (2026-09-09):** a #1 (admin JWT-hitelesítés), #3 (videó path traversal + auth) és
#9 (JWT payload kulcsnév-eltérés) pontok javítva -- lásd `src/middleware/authMiddleware.js`,
`src/routes/adminRoutes.js`, `src/routes/userRoutes.js`, `src/controllers/userController.js`
és a hozzájuk tartozó tesztek (`tests/admin.*.test.js`, `tests/video.test.js`). A többi (#2,
#4-#8, #10) pont még nyitott, a lenti leírás továbbra is érvényes rájuk.

Dátum: 2026-09-08
Terjedelem: `src/` (Node.js/Express + MySQL/Sequelize backend), érintőlegesen `sql/` és a fájlfeltöltés/videó kiszolgálás. A frontend nem volt fókuszban.

Kontextus: éles, ügyfél számára készülő oktatási/kurzus-értékesítő webalkalmazás. A `Users` tábla egészségügyi jellegű adatokat is tárol (allergiák, műtétek, amalgám fogtömés, gyógyszerek, panaszok, célok), ezért minden auth-hiba közvetlenül érzékeny személyes/egészségügyi adat kiszivárgását jelenti.

**Összefoglaló ítélet: a teljes auth-réteg jelenleg nem működik.** Az admin route-ok és a user route-ok gyakorlatilag hitelesítés nélkül elérhetők — ez minden más találatnál súlyosabb, és önmagában is elegendő ahhoz, hogy a rendszert éles környezetben azonnal nem biztonságosnak minősítsük.

---

## KRITIKUS

### 1. Admin-végpontok nincsenek JWT-vel védve — bárki adminná "válhat" egyetlen body-mezővel
`src/middleware/authMiddleware.js:18-28` (`verifyAdmin`), `src/routes/adminRoutes.js:8-28`

A `verifyAdmin` middleware nem a JWT-ből dekódolt, hitelesített `req.userId`-t nézi, hanem közvetlenül a kliens által küldött `req.body.userId`-t olvassa ki, és azzal keres usert:

```js
exports.verifyAdmin = async (req, res, next) => {
  const user = await User.findByPk(req.body.userId);
  if (!user || user.rang !== "a") { ... }
  next();
};
```

A `verifyToken` middleware-t az `adminRoutes.js` importálja, de **egyetlen route sem használja** — nincs JWT-ellenőrzés ezeken a végpontokon.

**Támadási forgatókönyv:** bárki, token nélkül, `POST /api/admin/users` kéréssel `{"userId": 1}` body-val (az id=1 valószínűleg az éles admin fiók) hozzáfér az összes admin funkcióhoz: teljes felhasználólista lekérése jelszóhash-sel és egészségügyi adatokkal, tetszőleges user módosítása/törlése, admin user létrehozása, kurzus törlés/létrehozás/videó feltöltés. Ez teljes admin API takeover hitelesítés nélkül, csak egy triviálisan kitalálható numerikus ID ismeretével.

**Javítás:** `router.use(verifyToken)` az összes admin route elé, majd `verifyAdmin`-ban `req.userId`-t (JWT-ből) használni `req.body.userId` helyett.

### 2. A `/api/*` user-végpontok nincsenek hitelesítve — teljes IDOR minden egészségügyi adatra
`src/routes/userRoutes.js:7-15`

A `register` és `login` kivételével egyetlen route-on sincs `verifyToken`:
- `POST /api/user` (`userController.js:160-178`) — bárki lekérheti bármely user teljes rekordját (jelszóhash, allergiák, gyógyszerek, panaszok stb.) `{"userId": N}` body-val.
- `POST /api/registercourse` — bárki regisztrálhat bármely `userId`-t bármely kurzusra.
- `POST /api/paid` — bárki "fizetettre" állíthatja bármely kurzusregisztrációt anélkül, hogy fizetett volna (üzleti logika megkerülése).
- `GET /api/registercourses` — az összes user összes kurzus-regisztrációja hitelesítés nélkül lekérhető.

**Javítás:** `verifyToken` minden személyes adatot kiadó/state-változtató route elé, és `req.body.userId` helyett a JWT-ből dekódolt azonosítót kell forrásként használni.

### 3. Path traversal a videó-kiszolgáló endpointon, hitelesítés nélkül
`src/controllers/userController.js:266-270`

```js
exports.getVideo = async (req, res) => {
  const filePath = path.join(__dirname, "../../uploads", req.params.filename);
  res.sendFile(filePath);
};
```

`req.params.filename` nincs whitelistelve vagy az `uploads` gyökérhez viszonyítva ellenőrizve. Kódolt `../` szekvenciákkal (`GET /api/video/..%2f..%2f..%2fetc%2fpasswd`) az `uploads` mappán kívülre lehet mutatni, és a szerver process jogosultsága szerinti tetszőleges fájlt kiolvasni (pl. `.env`, forráskód). A route teljesen nyilvános, nincs auth.

**Javítás:** `path.basename(req.params.filename)` a bemenetre, majd `path.resolve` + ellenőrzés, hogy az eredmény az `uploads` könyvtáron belül marad; emellett `verifyToken` + jogosultság-ellenőrzés (csak a kurzusra regisztrált user kapja meg a videót).

### 4. Éles adatbázis-dump (jelszóhashek + egészségügyi PII) commitolva a git repóba
`sql/termeszet.sql`, `sql/termeszet_latest.sql` (git-tracked, jelenleg is a HEAD-en)

Valós felhasználói sorok éles e-mail címekkel, bcrypt jelszóhash-ekkel, és az `allergies`/`mutetek`/`drugs`/`complaints` mezőkben valódi egészségügyi jellegű bejegyzésekkel. Ez git-történetben marad akkor is, ha a fájlokat most törlik — a hash-ek offline brute-force-szal visszafejthetők, és a PII/egészségügyi adat GDPR szempontból önmagában is incidens, ha a repo bárhogy kikerül.

**Javítás:** a fájlok eltávolítása a jelenlegi HEAD-ről *és* a teljes git-történetből (history rewrite / BFG); az érintett jelszavak (legalább az admin fiókoké) cseréje; `sql/` felvétele a `.gitignore`-ba — csak séma-only (adat nélküli) dump kerülhet verziókezelésbe.

---

## MAGAS

### 5. Fájlfeltöltés — MIME-type spoofolható, nincs valódi tartalom-ellenőrzés
`src/middleware/upload.js:18-30`

A szűrés kizárólag a kliens által küldött `Content-Type`-ra és a fájlkiterjesztésre támaszkodik, a tényleges fájltartalmat (magic bytes) nem ellenőrzi. A #1 miatt ez a végpont ma gyakorlatilag hitelesítés nélkül elérhető, tehát ez egy nyitott, tetszőleges fájlfeltöltési vektor.

**Javítás:** elsődlegesen #1-et javítani; emellett tartalom-alapú típusellenőrzés (pl. `file-type` csomag magic byte alapján).

### 6. Nincs rate limiting a `login`/`register` végpontokon
`src/routes/userRoutes.js:5-6`

Nincs `express-rate-limit` vagy hasonló a függőségek között. `POST /api/login` korlátlanul próbálgatható → online brute-force/credential stuffing. A `register` spam-regisztrációra és a nodemailer-es email küldés kihasználására is nyitott (a Gmail fiók kitiltásáig).

**Javítás:** `express-rate-limit` a `/login` és `/register` végpontokra (pl. 5-10 kísérlet/15 perc, IP-nkénti).

### 7. Tömeges attribútum-hozzárendelés admin `updateUser`-ben
`src/controllers/adminController.js:23-53`

A `rang` mező jelenleg nem módosítható innen (helyes), de mivel #1 miatt bárki eléri ezt a végpontot bármely `id`-vel, tetszőleges user email/username/egészségügyi mezőit át tudja írni — adatintegritás-sérülés, nem csak olvasási IDOR.

---

## KÖZEPES

### 8. Plaintext jelszó kerül a szerver logba regisztrációkor
`src/controllers/userController.js:13`

```js
console.log(req.body);
```

A `register` handler a teljes request body-t logolja, ami a plaintext jelszót is tartalmazza. A HTTP válaszban nincs stack trace / infó-leak (a hibaválaszok generikusak), de a szerver logfájl plaintext jelszót tárol.

**Javítás:** a sor eltávolítása, vagy a `pwd` mező explicit redaktálása logolás előtt.

### 9. JWT payload kulcsnév-eltérés — a `verifyToken` middleware bekötve is hibásan működne
`src/middleware/authMiddleware.js:13` vs. `src/controllers/userController.js:94-96`

A `login` a tokent `jwt.sign({ userId: user.id }, ...)` formában állítja ki, de a `verifyToken` middleware `decoded.id`-t olvasna ki (`req.userId = decoded.id`). Ha a #1/#2 javítás során egyszerűen bekötnék a meglévő `verifyToken`-t, `req.userId` mindig `undefined` maradna — ez egy rejtett bug, amit a routing-javítással egyszerre kell kezelni.

**Javítás:** `authMiddleware.js:13`: `req.userId = decoded.userId;`

### 10. CORS whitelist nem tartalmazza az éles domaint
`src/app.js:15-19`

Az `origin` lista csak `localhost:3000/5000`-et és egy nyers fejlesztői IP-t tartalmaz, az éles `ujjweb.hu` (al)domain nincs benne. Funkcionális kockázat inkább, mint biztonsági — de érdemes ellenőrizni, hogy éles configban nincs-e emiatt `*`-ra tágítva valahol a beállítás.

---

## ALACSONY / POZITÍV

- **Jelszó-hashelés helyes:** `bcrypt.hash(pwd, 10)` mindenhol, megfelelő cost factor, automatikus só. Nincs saját hash-elés/MD5/SHA1.
- **SQL injection:** a modellréteg kizárólag Sequelize paraméterezett query-ket használ, nem találtam `sequelize.query`/raw SQL-t — ezen a rétegen nincs SQLi kockázat.
- A #1 miatt jelenleg nyitott fájlfeltöltési végponton (korlátlan kérésszám, 100MB/kérés) lemezterület-kimerítéses DoS is lehetséges — külön javítás nem szükséges, ha #1 rendeződik, de érdemes utána is feltöltési kvótát bevezetni.

---

## A 3 legsürgősebb tennivaló

1. **Kösd be a JWT-hitelesítést ténylegesen mindenhová** (#1, #2, #9 együtt): `verifyToken` minden `/api/admin/*` és minden személyes/state-változtató `/api/*` route elé, `verifyAdmin` átírása a JWT-ből dekódolt userId-ra, és a `decoded.id`/`decoded.userId` kulcsnév-eltérés javítása.
2. **A `/api/video/:filename` path traversal és a hiányzó auth javítása** (#3) — jelenleg bárki, token nélkül, fájlrendszer-olvasási vektorral rendelkezik a szerveren.
3. **A `sql/termeszet.sql` és `sql/termeszet_latest.sql` (valós jelszóhash + egészségügyi PII dump) eltávolítása a git-történetből, és az érintett jelszavak cseréje** (#4) — ez már megtörtént adatszivárgás a verziókezelőben, nem csak potenciális kockázat.

---

## Érintett fájlok

- `src/middleware/authMiddleware.js`
- `src/routes/adminRoutes.js`
- `src/routes/userRoutes.js`
- `src/controllers/userController.js`
- `src/controllers/adminController.js`
- `src/middleware/upload.js`
- `sql/termeszet.sql`
- `sql/termeszet_latest.sql`
