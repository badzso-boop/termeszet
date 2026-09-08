# Backend tesztek futtatása

A `src/` backendhez Jest + Supertest alapú, valódi HTTP-szintű integrációs tesztek
tartoznak (`tests/*.test.js`), amik egy izolált, docker-compose-os MySQL teszt-adatbázis
ellen futnak. **Nem mockolják a Sequelize/DB réteget** — valódi SQL-lel dolgoznak egy
elkülönített MySQL konténer ellen, hogy a védőháló érdemi legyen.

## 1. Teszt-adatbázis felhúzása

A worktree gyökerén van egy git-ignorolt `docker-compose.override.yml`, ami a teszt
konténereket **külön névre és portra** állítja, hogy ne ütközzön az éles
`termeszet`/`termeszet-db` konténerekkel (`127.0.0.1:8087`):

```bash
docker compose -p testbackend up -d db
```

Ellenőrizd, hogy healthy lett-e (kb. 30-60 másodperc, az első MySQL-induláskor van egy
belső restart):

```bash
docker inspect --format='{{.State.Health.Status}}' termeszet-db-testbackend
```

A DB a hoston a szabvány `127.0.0.1:3306`-on érhető el (a `src/config/db.js` csak
`DB_HOST`-ot ismer, portot nem, ezért kell szabvány porton kitenni).

## 2. Tesztek futtatása

```bash
npm test
```

Ez a `jest --runInBand`-et futtatja. A `--runInBand` szándékos: minden teszt-fájl
ugyanazt a megosztott MySQL teszt-DB-t használja, párhuzamos futtatás versenyhelyzeteket
okozna.

A szükséges környezeti változókat (`DB_HOST=127.0.0.1`, `DB_NAME`, `DB_USER`,
`DB_PASSWORD`, `JWT_SECRET`, `EMAIL_USER`, `EMAIL_PASS`) a `tests/setup/env.setup.js`
állítja be alapértelmezettként, a worktree-ben lévő `.env` értékeivel összhangban — nem
kell kézzel exportálni semmit, hacsak nem akarsz más DB-hez csatlakozni.

A `nodemailer` csomag a `__mocks__/nodemailer.js` manuális mock miatt automatikusan
lemockolva fut minden tesztben — a regisztráció/kurzus-regisztráció/fizetés végpontok
mögötti e-mail küldés (`src/helpers/emailSender.js`) így sosem próbál valódi SMTP-kapcsolatot
nyitni.

## 3. Mit fednek le a tesztek

- `tests/register.test.js` — regisztráció (siker, hiányzó mezők, duplikált email, bcrypt
  hashelés ellenőrzése).
- `tests/login.test.js` — bejelentkezés (siker + token/userId/rang, rossz jelszó, nem
  létező email, hiányzó mezők).
- `tests/registercourse.test.js` — kurzusra regisztráció, beleértve a duplikált eset MAI
  (201 "already registered") viselkedésének dokumentálását.
- `tests/paid.test.js` — fizetés jelzése (siker, már fizetett eset, nem létező
  CourseRegisterId).
- `tests/newsletter.test.js` — hírlevél-feliratkozás (érvényes/érvénytelen email,
  duplikáció).
- `tests/admin.users.test.js`, `tests/admin.courses.test.js`,
  `tests/admin.registercourse.test.js` — admin CRUD happy-path + 404 esetek, és egy
  külön teszt, ami dokumentálja, hogy a `verifyAdmin` middleware ma ténylegesen
  `req.body.userId`-t nézi, nem valódi JWT-t (lásd `docs/security-review.md`).
- `tests/characterization.orphaned-registrations.test.js` — "characterization test":
  dokumentálja, hogy a mai (asszociáció/cascade nélküli) modell-rétegen egy user törlése
  NEM törli automatikusan a hozzá tartozó `CourseRegister` sorokat. Ha ez a teszt egy
  jövőbeli, `feature/db-associations`-t is tartalmazó merge után megbukik, az azt jelzi,
  hogy a viselkedés megváltozott (cascade delete bekerült) — akkor a tesztet frissíteni
  kell az új elvárt viselkedésre.

## 4. Takarítás

Minden teszt-fájl egyedi, véletlenszerű email/username értékeket generál
(`tests/helpers/factories.js`), és `afterAll`-ban törli a saját maga által létrehozott
sorokat, hogy ne maradjon piszkos állapot a következő futtatáshoz.

A teszt-DB konténer/volume viszont a `npm test` lefutása UTÁN is megmarad (ez szándékos,
gyors iterációhoz) — ha végleg nincs rá szükség, állítsd le és töröld:

```bash
docker compose -p testbackend down -v
```

**Az éles `termeszet`/`termeszet-db` konténereket ez semmilyen módon nem érinti** — azok
teljesen más projekt-névtér (`-p testbackend` vs. az éles compose névtér) és port alatt
futnak.
