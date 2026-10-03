// Szerver oldali SEO: az SPA index.html-jébe még a kiszolgálás előtt beinjektálja az adott
// URL nyelvének megfelelő <html lang>, <title>, meta description, canonical, hreflang,
// Open Graph és JSON-LD tageket, így a keresőrobotok és a link-előnézetek (Facebook stb.)
// JavaScript futtatása nélkül is a helyes, nyelvhelyes adatokat látják. Itt állítja elő a
// sitemap.xml-t és a robots.txt-t is.
//
// Az útvonaltábla, a tag-generáló logika és a szövegek a frontenddel közösek
// (frontend/src/i18n/{routes.json,seoCore.js,locales/*/seo.json}), lásd src/i18nConfig.js.
const fs = require('fs');
const path = require('path');

const { I18N_DIR, seoCore } = require('./i18nConfig');

const seoTexts = Object.fromEntries(
  seoCore.LANGUAGES.map((lang) => [
    lang,
    JSON.parse(fs.readFileSync(path.join(I18N_DIR, 'locales', lang, 'seo.json'), 'utf8')),
  ])
);

const siteUrl = () => (process.env.SITE_URL || seoCore.SITE_URL).replace(/\/$/, '');

const escapeHtml = (value) =>
  String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');

const renderTag = ({ tag, attrs }) => {
  const attrString = Object.entries(attrs)
    .map(([name, value]) => `${name}="${escapeHtml(value)}"`)
    .join(' ');
  return `<${tag} ${attrString} data-seo>`;
};

// Az index.html sablon (CRA build) alapértelmezett title/description tagjeit kicseréli az
// adott útvonalhoz generáltakra. Visszaadja a HTTP státuszt is (ismeretlen útvonal: 404).
function renderPage(template, pathname) {
  const seo = seoCore.buildSeo(pathname, { siteUrl: siteUrl(), seoTexts });
  const head = [
    `<title>${escapeHtml(seo.title)}</title>`,
    ...seo.tags.map(renderTag),
    seo.jsonLd
      ? `<script type="application/ld+json" data-seo>${JSON.stringify(seo.jsonLd).replace(/</g, '\\u003c')}</script>`
      : '',
  ].join('');

  const html = template
    .replace(/<html[^>]*>/i, `<html lang="${seo.lang}">`)
    .replace(/<title>[\s\S]*?<\/title>/i, '')
    .replace(/<(meta|link)\b[^>]*\bdata-seo\b[^>]*>/gi, '')
    .replace('</head>', `${head}</head>`);

  return { status: seo.status, html };
}

// Régi aliasok és a záró perjeles változatok 301-gyel a kanonikus URL-re, hogy egy oldal
// ne legyen több címen is indexelve. null, ha nincs teendő.
function redirectFor(pathname) {
  if (seoCore.REDIRECTS[pathname]) return seoCore.REDIRECTS[pathname];
  if (pathname.length > 1 && pathname.endsWith('/')) return pathname.replace(/\/+$/, '') || '/';
  return null;
}

function sitemapXml() {
  const base = siteUrl();
  const urls = Object.entries(seoCore.ROUTES)
    .filter(([, def]) => def.index)
    .flatMap(([key, def]) =>
      seoCore.LANGUAGES.map((lang) => {
        const alternates = seoCore.LANGUAGES.map(
          (alt) => `    <xhtml:link rel="alternate" hreflang="${alt}" href="${base}${seoCore.localizePath(key, alt)}"/>`
        );
        alternates.push(
          `    <xhtml:link rel="alternate" hreflang="x-default" href="${base}${seoCore.localizePath(key, seoCore.DEFAULT_LANG)}"/>`
        );
        return [
          '  <url>',
          `    <loc>${base}${seoCore.localizePath(key, lang)}</loc>`,
          ...alternates,
          `    <priority>${def.priority}</priority>`,
          '  </url>',
        ].join('\n');
      })
    );

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n');
}

function robotsTxt() {
  return [
    'User-agent: *',
    'Disallow: /api/',
    ...seoCore.HUNGARIAN_ONLY.map((pattern) => `Disallow: ${pattern.replace(/\/:\w+$/, '/')}`),
    '',
    `Sitemap: ${siteUrl()}/sitemap.xml`,
    '',
  ].join('\n');
}

module.exports = { renderPage, redirectFor, sitemapXml, robotsTxt };
