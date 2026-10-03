// Közös útvonal- és SEO-logika a React-apphoz ÉS az Express szerverhez (src/seo.js).
// Szándékosan CommonJS és függőségmentes: a frontend importálja, a backend pedig a
// Docker image-be másolt példányát require-eli -- így a szerver által az első
// betöltéskor beinjektált head-tagek és a kliens oldali navigáció utáni tagek
// garantáltan ugyanabból a logikából és ugyanazokból a szövegekből (seo.json) jönnek.
const config = require('./routes.json');

const LANGUAGES = config.languages;
const DEFAULT_LANG = config.defaultLanguage;
const LANGUAGE_NAMES = config.languageNames;
const SITE_URL = config.siteUrl;
const OG_LOCALES = { hu: 'hu_HU', en: 'en_US' };

const splitPath = (p) => p.split('/').filter(Boolean);

function matchPattern(pattern, pathname) {
  const parts = splitPath(pattern);
  const segments = splitPath(pathname);
  if (parts.length !== segments.length) return null;
  const params = {};
  for (let i = 0; i < parts.length; i++) {
    if (parts[i].startsWith(':')) {
      params[parts[i].slice(1)] = segments[i];
    } else if (parts[i] !== segments[i]) {
      return null;
    }
  }
  return params;
}

// Az alapnyelv (hu) prefix nélküli, a többi nyelv /<nyelv> prefixszel él.
function langFromPath(pathname) {
  const first = splitPath(pathname)[0];
  return first && first !== DEFAULT_LANG && LANGUAGES.includes(first) ? first : DEFAULT_LANG;
}

// { key, lang, params, index } egy ismert, lefordított oldalra; key: null a csak magyar
// (admin) oldalakra; null, ha az útvonal ismeretlen (404).
function matchRoute(pathname) {
  for (const [key, def] of Object.entries(config.routes)) {
    for (const lang of LANGUAGES) {
      const params = matchPattern(def[lang], pathname);
      if (params) return { key, lang, params, index: Boolean(def.index) };
    }
  }
  for (const pattern of config.hungarianOnly) {
    if (matchPattern(pattern, pathname)) return { key: null, lang: DEFAULT_LANG, params: {}, index: false };
  }
  return null;
}

function localizePath(key, lang, params = {}) {
  const def = config.routes[key] || config.routes.home;
  return def[lang].replace(/:(\w+)/g, (_, name) => String(params[name] ?? ''));
}

// Ugyanaz az oldal a másik nyelven; ha nincs megfelelője (admin, 404), a főoldal.
function alternatePath(pathname, targetLang) {
  const match = matchRoute(pathname);
  if (!match || !match.key) return localizePath('home', targetLang);
  return localizePath(match.key, targetLang, match.params);
}

function personJsonLd(texts, siteUrl, lang) {
  return {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: texts.siteName,
    jobTitle: texts.jobTitle,
    description: texts.pages.home.description,
    url: siteUrl + localizePath('home', lang),
    image: `${siteUrl}/og-image.jpg`,
    telephone: '+36704283858',
    email: 'mailto:azegy1@gmail.com',
    sameAs: [
      'https://www.facebook.com/gabriella.ujj.10',
      'https://www.youtube.com/@gabriellanemeth4897',
    ],
  };
}

// seoTexts: { hu: <locales/hu/seo.json>, en: <locales/en/seo.json> }
function buildSeo(pathname, { siteUrl, seoTexts }) {
  const match = matchRoute(pathname);
  const lang = match ? match.lang : langFromPath(pathname);
  const texts = seoTexts[lang];
  const pageKey = !match ? 'notFound' : texts.pages[match.key] ? match.key : 'default';
  const page = texts.pages[pageKey];
  const description = page.description || texts.pages.default.description;
  const indexable = Boolean(match && match.index);

  const tags = [
    { tag: 'meta', attrs: { name: 'description', content: description } },
    { tag: 'meta', attrs: { name: 'robots', content: indexable ? 'index, follow' : 'noindex, follow' } },
  ];

  let url = siteUrl + pathname;
  if (indexable) {
    url = siteUrl + localizePath(match.key, lang, match.params);
    tags.push({ tag: 'link', attrs: { rel: 'canonical', href: url } });
    for (const alt of LANGUAGES) {
      tags.push({
        tag: 'link',
        attrs: { rel: 'alternate', hreflang: alt, href: siteUrl + localizePath(match.key, alt, match.params) },
      });
    }
    tags.push({
      tag: 'link',
      attrs: { rel: 'alternate', hreflang: 'x-default', href: siteUrl + localizePath(match.key, DEFAULT_LANG, match.params) },
    });
  }

  tags.push(
    { tag: 'meta', attrs: { property: 'og:type', content: 'website' } },
    { tag: 'meta', attrs: { property: 'og:site_name', content: texts.siteName } },
    { tag: 'meta', attrs: { property: 'og:title', content: page.title } },
    { tag: 'meta', attrs: { property: 'og:description', content: description } },
    { tag: 'meta', attrs: { property: 'og:url', content: url } },
    { tag: 'meta', attrs: { property: 'og:image', content: `${siteUrl}/og-image.jpg` } },
    { tag: 'meta', attrs: { property: 'og:locale', content: OG_LOCALES[lang] } },
    ...LANGUAGES.filter((l) => l !== lang).map((l) => ({
      tag: 'meta',
      attrs: { property: 'og:locale:alternate', content: OG_LOCALES[l] },
    })),
    { tag: 'meta', attrs: { name: 'twitter:card', content: 'summary_large_image' } },
  );

  return {
    lang,
    status: match ? 200 : 404,
    title: page.title,
    tags,
    jsonLd: match && match.key === 'home' ? personJsonLd(texts, siteUrl, lang) : null,
  };
}

module.exports = {
  LANGUAGES,
  DEFAULT_LANG,
  LANGUAGE_NAMES,
  SITE_URL,
  ROUTES: config.routes,
  HUNGARIAN_ONLY: config.hungarianOnly,
  REDIRECTS: config.redirects,
  langFromPath,
  matchRoute,
  localizePath,
  alternatePath,
  buildSeo,
};
