-- add_foreign_keys.sql
--
-- Cél: utólag hozzáadni a courseregisters.userId -> users.id,
-- courseregisters.courseId -> minikurzus.id, és homeworks.felhasznaloId -> users.id
-- foreign key constraint-eket egy már LÉTEZŐ, adatokkal feltöltött adatbázishoz,
-- amiben ezek a táblák FK constraint nélkül jöttek létre (sequelize.sync() vagy a
-- régi create.sql alapján).
--
-- Motiváció: modell-szintű Sequelize asszociációk hozzáadása (lásd
-- src/models/associations.js) csak az ÚJ, sync()-kel frissen létrehozott
-- táblákon eredményez FK constraint-et — a sequelize.sync() (force/alter nélkül)
-- "CREATE TABLE IF NOT EXISTS"-t generál, ami MÁR LÉTEZŐ táblákat nem módosít.
-- Ez a script az a kézi lépés, ami egy meglévő adatbázison pótolja ugyanazt.
--
-- =============================================================================
-- FIGYELEM — OLVASD EL, MIELŐTT BÁRMILYEN ADATBÁZISON FUTTATNÁD:
--
--   1. Ezt a scriptet SOHA nem szabad éles/valódi ügyféladatot tartalmazó
--      adatbázison lefuttatni frissen ellenőrzött backup nélkül.
--   2. Mielőtt lefuttatnád, ELLENŐRIZD, hogy nincs-e árva (dangling) sor:
--      olyan courseregisters.userId, ami nem létezik a users táblában, olyan
--      courseregisters.courseId, ami nem létezik a minikurzus táblában, vagy
--      olyan homeworks.felhasznaloId, ami nem létezik a users táblában.
--      Lásd az ellenőrző SELECT-eket lentebb — ha ezek bármelyike sort ad
--      vissza, a FOREIGN KEY hozzáadása HIBÁVAL el fog bukni (ami önmagában
--      nem veszélyes, de jelzi, hogy előbb kézzel kell dönteni az árva
--      sorokról: töröld őket, vagy javítsd a hivatkozott ID-t).
--   3. Ez a script NEM force/alter sync — nem töröl és nem ír felül semmilyen
--      meglévő adatot, csak megszorítást (constraint) ad hozzá.
--   4. Csak saját, izolált teszt-adatbázison validáld (pl. docker-compose
--      override-dal felhúzott konténeren) — ne futtasd a `termeszet-db` éles
--      konténer ellen.
-- =============================================================================

-- --- Ellenőrző lekérdezések (futtasd le ELŐSZÖR, kézzel, és nézd át az eredményt) ---
-- SELECT * FROM courseregisters cr WHERE NOT EXISTS (SELECT 1 FROM users u WHERE u.id = cr.userId);
-- SELECT * FROM courseregisters cr WHERE NOT EXISTS (SELECT 1 FROM minikurzus c WHERE c.id = cr.courseId);
-- SELECT * FROM homeworks h WHERE h.felhasznaloId IS NOT NULL AND NOT EXISTS (SELECT 1 FROM users u WHERE u.id = h.felhasznaloId);

ALTER TABLE courseregisters
    ADD CONSTRAINT fk_courseregisters_user
        FOREIGN KEY (userId) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE courseregisters
    ADD CONSTRAINT fk_courseregisters_course
        FOREIGN KEY (courseId) REFERENCES minikurzus(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;

ALTER TABLE homeworks
    ADD CONSTRAINT fk_homeworks_user
        FOREIGN KEY (felhasznaloId) REFERENCES users(id)
        ON DELETE CASCADE
        ON UPDATE CASCADE;
