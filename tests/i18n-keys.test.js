// A backend minden válaszüzenete i18n-kulcs (`{ message: 'course.notFound' }`), amit a
// frontend fordít. Ez a teszt végignézi a src/ alatti összes ilyen kulcsot, és ellenőrzi,
// hogy mindegyik létezik a frontend minden nyelvi fájljában -- így egy új, elgépelt vagy
// lefordítatlan kulcs nem jut ki élesbe.
const fs = require('fs');
const path = require('path');

const SRC_DIR = path.join(__dirname, '..', 'src');
const LOCALES_DIR = path.join(__dirname, '..', 'frontend', 'src', 'i18n', 'locales');

const listJsFiles = (dir) =>
  fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return listJsFiles(full);
    return entry.name.endsWith('.js') ? [full] : [];
  });

const collectKeys = () => {
  const keys = new Set();
  const patterns = [
    /\b(?:message|error)\s*:\s*['"]([^'"]+)['"]/g,
    /apiError\(\s*['"]([^'"]+)['"]/g,
    /\bkey\s*=\s*[^;]*?['"]([a-z][A-Za-z]*\.[A-Za-z]+)['"]\s*:\s*['"]([a-z][A-Za-z]*\.[A-Za-z]+)['"]/g,
  ];
  for (const file of listJsFiles(SRC_DIR)) {
    const source = fs.readFileSync(file, 'utf8');
    for (const pattern of patterns) {
      for (const match of source.matchAll(pattern)) {
        match.slice(1).filter(Boolean).forEach((k) => keys.add(k));
      }
    }
  }
  return [...keys];
};

const lookup = (obj, key) => key.split('.').reduce((node, part) => (node ? node[part] : undefined), obj);

describe('backend i18n-kulcsok', () => {
  const keys = collectKeys();

  test('találunk kulcsokat, és mind "névtér.kulcs" alakú', () => {
    expect(keys.length).toBeGreaterThan(40);
    for (const key of keys) {
      expect(key).toMatch(/^[a-z][A-Za-z]*\.[A-Za-z]+$/);
    }
  });

  for (const lang of fs.readdirSync(LOCALES_DIR)) {
    test(`minden kulcsnak van fordítása: ${lang}`, () => {
      const api = JSON.parse(fs.readFileSync(path.join(LOCALES_DIR, lang, 'api.json'), 'utf8'));
      const missing = keys.filter((key) => typeof lookup(api, key) !== 'string');
      expect(missing).toEqual([]);
    });
  }
});
