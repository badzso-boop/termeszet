// Ez a fájl (Jest `setupFiles`) a teszt-futtatás legelején, minden más require előtt fut le
// egy-egy teszt-fájlra nézve. Célja: a src/config/db.js és a controllerek által olvasott
// process.env változókat a teszt-DB-hez (docker-compose.override.yml, `-p testbackend`)
// igazítani, MIELŐTT bármelyik src/ modul (és annak `dotenv.config()` hívása) lefutna.
//
// A dotenv csak azokat a kulcsokat tölti be a .env fájlból, amik MÉG NINCSENEK beállítva
// a process.env-ben — ezért ha itt előbb beállítjuk ezeket, a .env tartalma (pl. DB_NAME,
// DB_USER, DB_PASSWORD, JWT_SECRET) nem lesz felülírva, csak kiegészítve azzal, ami hiányzik
// (jelen esetben elsősorban a DB_HOST, ami a .env-ben nincs is benne).
//
// Fontos: a src/config/db.js (amit NEM módosítunk) csak `DB_HOST`-ot olvas, portot nem —
// ezért a teszt MySQL konténer a hoston a szabvány 3306-os porton van kitéve
// (lásd docker-compose.override.yml).

function setDefault(key, value) {
  if (process.env[key] === undefined || process.env[key] === '') {
    process.env[key] = value;
  }
}

setDefault('DB_HOST', '127.0.0.1');
setDefault('DB_NAME', 'termeszet');
setDefault('DB_USER', 'termeszet');
setDefault('DB_PASSWORD', 'local_dev_pw_change_me');
setDefault('JWT_SECRET', 'local_dev_jwt_secret_change_me_please');
// Az emailSender.js-t a __mocks__/nodemailer.js automatikusan lemockolja, így ezek az
// értékek sosem mennek ki valódi SMTP-kérésként — csak azért kellenek, hogy a
// nodemailer.createTransport hívás ne dobjon hibát hiányzó konfig miatt.
setDefault('EMAIL_USER', 'test@example.com');
setDefault('EMAIL_PASS', 'test-pass');
