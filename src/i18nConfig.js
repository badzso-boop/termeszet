// A frontenddel közös i18n-konfiguráció (nyelvek, útvonalak, SEO-logika) helye.
// A Docker image a frontend/src/i18n mappát /app/i18n alá másolja, lokálisan pedig
// közvetlenül a frontend forrásából olvassuk -- így a backend (SEO, tartalomfordítások)
// ugyanazt a nyelvlistát használja, mint a frontend.
const fs = require('fs');
const path = require('path');

const I18N_DIR = [
  path.join(__dirname, '..', 'i18n'),
  path.join(__dirname, '..', 'frontend', 'src', 'i18n'),
].find((dir) => fs.existsSync(path.join(dir, 'seoCore.js')));

const seoCore = require(path.join(I18N_DIR, 'seoCore.js'));

module.exports = {
  I18N_DIR,
  seoCore,
  LANGUAGES: seoCore.LANGUAGES,
  DEFAULT_LANG: seoCore.DEFAULT_LANG,
};
