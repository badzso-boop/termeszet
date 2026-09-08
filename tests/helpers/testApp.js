// Teszt-célú Express app-építő. Szándékosan NEM a src/app.js-t requireljük közvetlenül,
// mert az a modul betöltéskor automatikusan `sequelize.sync()`-et hív (retry-loop-pal) és
// `app.listen()`-t indít egy valódi TCP porton — ez teszt közben felesleges, portütközést és
// lassú/hibás retry-kört okozna. Ehelyett itt ugyanazokat a route-okat kötjük be, amiket a
// src/app.js is, de a szerver indítása és a DB-sync nélkül (ezt a tests/setup/jest.setup.js
// végzi, egyszer, kontrolláltan).
//
// FONTOS: ez a fájl a src/routes/*.js-t (tehát a valódi route-wiringot) importálja
// változtatás nélkül — nem duplikáljuk a route-logikát, csak a bootstrap-részt (app.listen,
// CORS-lista, SPA-fallback) hagyjuk ki, mert azok a HTTP API viselkedésének teszteléséhez
// nem relevánsak.

const express = require('express');
const userRoutes = require('../../src/routes/userRoutes');
const adminRoutes = require('../../src/routes/adminRoutes');

function buildTestApp() {
  const app = express();
  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use('/api', userRoutes);
  app.use('/api/admin', adminRoutes);

  return app;
}

module.exports = buildTestApp;
