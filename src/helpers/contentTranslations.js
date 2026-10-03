// Tartalomfordítások kezelése (szolgáltatások, kurzusok, leckék, galéria) -- lásd
// models/translationModels.js. A nyelvlista a frontenddel közös (src/i18nConfig.js), így
// egy új nyelv (pl. német) felvétele után ez a kód változtatás nélkül kezeli azt is.
const crypto = require('crypto');
const { LANGUAGES, DEFAULT_LANG } = require('../i18nConfig');
const { TRANSLATABLE_FIELDS } = require('../models/translationModels');
const apiError = require('./apiError');

const TRANSLATION_LANGUAGES = LANGUAGES.filter((lang) => lang !== DEFAULT_LANG);

const fieldsOf = (entity) => Object.keys(TRANSLATABLE_FIELDS[entity]);
const toPlain = (record) => (record && typeof record.get === 'function' ? record.get({ plain: true }) : { ...record });
const isFilled = (value) => value !== null && value !== undefined && String(value).trim() !== '';

// Érvényes, támogatott nyelv a kérésből (query vagy body `lang`), különben az alapnyelv.
const resolveLang = (value) => (LANGUAGES.includes(value) ? value : DEFAULT_LANG);

// A magyar forrásmezők hash-e: ha a fordításban tárolt érték ettől eltér, a fordítás elavult.
const sourceHash = (record, entity) =>
  crypto
    .createHash('sha256')
    .update(JSON.stringify(fieldsOf(entity).map((field) => (isFilled(record[field]) ? String(record[field]) : ''))))
    .digest('hex');

// Publikus include: csak a kért nyelv fordítása (az alapnyelvhez nem kell join).
const translationInclude = (TranslationModel, lang) =>
  lang === DEFAULT_LANG ? [] : [{ model: TranslationModel, as: 'translations', where: { lang }, required: false }];

// Publikus nézet: a fordítható mezők a kért nyelven, ahol nincs fordítás, ott magyarul.
// `i18n.fallback` jelzi, mely mezők maradtak magyarul (a frontend lang="hu"-val jelöli őket).
function localize(record, entity, lang) {
  const plain = toPlain(record);
  const translation = (plain.translations || []).find((t) => t.lang === lang);
  delete plain.translations;

  const fallback = [];
  if (lang !== DEFAULT_LANG) {
    for (const field of fieldsOf(entity)) {
      if (translation && isFilled(translation[field])) {
        plain[field] = translation[field];
      } else if (isFilled(plain[field])) {
        fallback.push(field);
      }
    }
  }
  plain.i18n = { lang, fallback };
  return plain;
}

// missing: nincs fordítás | outdated: a magyar azóta változott | partial: van kitöltetlen
// mező, aminek van magyar megfelelője | complete
function translationStatus(base, translation, entity) {
  const fields = fieldsOf(entity);
  if (!translation || !fields.some((field) => isFilled(translation[field]))) return 'missing';
  if (translation.sourceHash !== sourceHash(base, entity)) return 'outdated';
  if (fields.some((field) => isFilled(base[field]) && !isFilled(translation[field]))) return 'partial';
  return 'complete';
}

// Admin nézet: az alapnyelvi (magyar) mezők változatlanul, mellettük nyelvenként a fordítás
// és annak állapota: translations: { en: { title, ..., status } }.
function adminView(record, entity) {
  const plain = toPlain(record);
  const rows = plain.translations || [];
  plain.translations = Object.fromEntries(
    TRANSLATION_LANGUAGES.map((lang) => {
      const row = rows.find((t) => t.lang === lang);
      const values = Object.fromEntries(fieldsOf(entity).map((field) => [field, row ? row[field] ?? '' : '']));
      return [lang, { ...values, status: translationStatus(plain, row, entity) }];
    })
  );
  return plain;
}

// A kérésben érkező `translations` (objektum, vagy multipart űrlapnál JSON-string)
// validálása: csak támogatott, nem-alap nyelv; csak fordítható mező; string/null érték a
// mező hosszkorlátján belül. Hibánál apiError('generic.invalidData', 400).
function parseTranslationsInput(raw, entity) {
  if (raw === undefined || raw === null || raw === '') return null;
  let input = raw;
  if (typeof raw === 'string') {
    try {
      input = JSON.parse(raw);
    } catch (err) {
      throw apiError('generic.invalidData');
    }
  }
  if (typeof input !== 'object' || Array.isArray(input)) throw apiError('generic.invalidData');

  const specs = TRANSLATABLE_FIELDS[entity];
  const parsed = {};
  for (const [lang, values] of Object.entries(input)) {
    if (!TRANSLATION_LANGUAGES.includes(lang)) throw apiError('generic.invalidData');
    if (!values || typeof values !== 'object' || Array.isArray(values)) throw apiError('generic.invalidData');

    const fields = {};
    for (const [field, value] of Object.entries(values)) {
      if (field === 'markUpToDate' || field === 'status') continue;
      if (!specs[field]) continue; // ismeretlen mező: figyelmen kívül
      if (value !== null && typeof value !== 'string') throw apiError('generic.invalidData');
      const trimmed = value === null ? '' : value.trim();
      if (specs[field].maxLength && trimmed.length > specs[field].maxLength) throw apiError('generic.invalidData');
      fields[field] = trimmed === '' ? null : trimmed;
    }
    parsed[lang] = { fields, markUpToDate: values.markUpToDate === true || values.markUpToDate === 'true' };
  }
  return parsed;
}

// A (már validált) fordítások mentése egy entitáshoz. Nyelvenként:
// - ha minden mező üres -> a fordítás törlődik;
// - a sourceHash csak akkor frissül (= "naprakész"), ha a fordítás szövege ténylegesen
//   változott, vagy az admin kifejezetten naprakésznek jelölte (markUpToDate). Így ha az
//   admin csak a magyart írja át, a változatlanul visszaküldött fordítás elavultnak látszik.
async function saveTranslations({ TranslationModel, foreignKey, entity, record, parsed, transaction }) {
  if (!parsed) return;
  const currentHash = sourceHash(record, entity);

  for (const [lang, { fields, markUpToDate }] of Object.entries(parsed)) {
    const where = { [foreignKey]: record.id, lang };
    const existing = await TranslationModel.findOne({ where, transaction });
    const merged = Object.fromEntries(
      fieldsOf(entity).map((field) => [field, field in fields ? fields[field] : existing ? existing[field] : null])
    );

    if (!Object.values(merged).some(isFilled)) {
      if (existing) await existing.destroy({ transaction });
      continue;
    }

    const changed = !existing || fieldsOf(entity).some((field) => (existing[field] ?? null) !== merged[field]);
    const hash = changed || markUpToDate || !existing ? currentHash : existing.sourceHash;

    if (existing) {
      await existing.update({ ...merged, sourceHash: hash }, { transaction });
    } else {
      await TranslationModel.create({ ...where, ...merged, sourceHash: hash }, { transaction });
    }
  }
}

module.exports = {
  TRANSLATION_LANGUAGES,
  resolveLang,
  translationInclude,
  localize,
  adminView,
  parseTranslationsInput,
  saveTranslations,
  sourceHash,
};
