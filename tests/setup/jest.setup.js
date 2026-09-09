// Jest `setupFilesAfterEnv`: ez már a jest globals (describe/beforeAll/...) telepítése UTÁN
// fut le, minden teszt-fájlra külön (Jest fájlonként izolált modul-regisztert használ).
//
// Minden teszt-fájlhoz tartozik egy saját Sequelize-kapcsolat: a fájl elején egyszer
// szinkronizáljuk a modelleket (táblák létrehozása, ha még nincsenek), a végén pedig
// lezárjuk a kapcsolatot, hogy a Jest folyamat rendesen ki tudjon lépni.

const sequelize = require('../../src/config/db');

// Az összes modellt be kell tölteni ahhoz, hogy a sequelize.sync() az összes táblát
// létrehozza (a modellek `sequelize.define()`-nal regisztrálják magukat a betöltéskor).
require('../../src/models/userModel');
require('../../src/models/courseModel');
require('../../src/models/courseRegisterModel');
require('../../src/models/newsletterModel');
require('../../src/models/homeworkModel');
require('../../src/models/lessonModel');
// A modell-asszociációkat (FK constraint-ek, ON DELETE CASCADE) is be kell tölteni, MIELŐTT
// a sync() lefut -- különben, ha egy korábbi tesztfutásból már léteznek a táblák FK nélkül
// (a docker teszt-DB volume-ja szándékosan megmarad futtatások között, lásd docs/testing.md),
// a `CREATE TABLE IF NOT EXISTS` no-op marad és a constraint-ek sosem kerülnek be utólag.
require('../../src/models/associations');

beforeAll(async () => {
  await sequelize.sync();
});

afterAll(async () => {
  await sequelize.close();
});
