// A src/seo.js szerver oldali SEO-injektálásának tesztjei (DB nélküli egységtesztek).
const seo = require('../src/seo');

const TEMPLATE =
  '<!doctype html><html lang="hu"><head><meta charset="utf-8">' +
  '<meta data-seo name="description" content="alapértelmezett">' +
  '<title>Alap cím</title></head><body><div id="root"></div></body></html>';

const SITE = 'https://termeszet.ujjweb.hu';

describe('renderPage', () => {
  test('magyar oldal: lang=hu, magyar cím, canonical és hreflang alternatívák', () => {
    const { status, html } = seo.renderPage(TEMPLATE, '/galeria');
    expect(status).toBe(200);
    expect(html).toContain('<html lang="hu">');
    expect(html).toContain('<title>Galéria – Németh Gabriella</title>');
    expect(html).toContain(`<link rel="canonical" href="${SITE}/galeria" data-seo>`);
    expect(html).toContain(`<link rel="alternate" hreflang="en" href="${SITE}/en/gallery" data-seo>`);
    expect(html).toContain(`<link rel="alternate" hreflang="x-default" href="${SITE}/galeria" data-seo>`);
    expect(html).toContain('content="index, follow"');
    // az alapértelmezett title/description ne maradjon benne duplán
    expect(html).not.toContain('Alap cím');
    expect(html).not.toContain('alapértelmezett');
    expect(html.match(/<title>/g)).toHaveLength(1);
  });

  test('angol oldal: lang=en, angol szövegek, og:locale en_US', () => {
    const { status, html } = seo.renderPage(TEMPLATE, '/en/faq');
    expect(status).toBe(200);
    expect(html).toContain('<html lang="en">');
    expect(html).toContain('<title>Frequently Asked Questions – Gabriella Németh</title>');
    expect(html).toContain(`<link rel="canonical" href="${SITE}/en/faq" data-seo>`);
    expect(html).toContain(`<link rel="alternate" hreflang="hu" href="${SITE}/gyik" data-seo>`);
    expect(html).toContain('<meta property="og:locale" content="en_US" data-seo>');
  });

  test('főoldal: Person JSON-LD, a "<" escape-elve', () => {
    const { html } = seo.renderPage(TEMPLATE, '/en');
    const match = html.match(/<script type="application\/ld\+json" data-seo>(.*?)<\/script>/);
    expect(match).not.toBeNull();
    const data = JSON.parse(match[1]);
    expect(data['@type']).toBe('Person');
    expect(data.url).toBe(`${SITE}/en`);
  });

  test('bejelentkezés / kurzus / admin oldal: noindex, nincs canonical', () => {
    for (const p of ['/login', '/en/course/5', '/admin', '/adminupdateuser/3']) {
      const { status, html } = seo.renderPage(TEMPLATE, p);
      expect(status).toBe(200);
      expect(html).toContain('content="noindex, follow"');
      expect(html).not.toContain('rel="canonical"');
    }
  });

  test('ismeretlen útvonal: 404 + noindex, a prefix szerinti nyelven', () => {
    const hu = seo.renderPage(TEMPLATE, '/nincs-ilyen');
    expect(hu.status).toBe(404);
    expect(hu.html).toContain('content="noindex, follow"');
    expect(hu.html).toContain('<title>Az oldal nem található – Németh Gabriella</title>');
    const en = seo.renderPage(TEMPLATE, '/en/no-such-page');
    expect(en.status).toBe(404);
    expect(en.html).toContain('<html lang="en">');
  });
});

describe('redirectFor', () => {
  test('régi aliasok és záró perjel 301-re', () => {
    expect(seo.redirectFor('/gallery')).toBe('/galeria');
    expect(seo.redirectFor('/contact')).toBe('/kapcsolat');
    expect(seo.redirectFor('/en/')).toBe('/en');
    expect(seo.redirectFor('/galeria/')).toBe('/galeria');
    expect(seo.redirectFor('/')).toBeNull();
    expect(seo.redirectFor('/galeria')).toBeNull();
  });
});

describe('sitemap.xml és robots.txt', () => {
  test('a sitemap csak az indexelhető oldalakat tartalmazza, mindkét nyelven, hreflanggal', () => {
    const xml = seo.sitemapXml();
    expect(xml).toContain(`<loc>${SITE}/</loc>`);
    expect(xml).toContain(`<loc>${SITE}/en</loc>`);
    expect(xml).toContain(`<loc>${SITE}/en/privacy</loc>`);
    expect(xml).toContain(`<xhtml:link rel="alternate" hreflang="hu" href="${SITE}/adatvedelem"/>`);
    expect(xml).not.toContain('/login');
    expect(xml).not.toContain('/admin');
    expect(xml).not.toContain('/course/');
  });

  test('robots.txt: API és admin tiltva, sitemap hivatkozva', () => {
    const txt = seo.robotsTxt();
    expect(txt).toContain('Disallow: /api/');
    expect(txt).toContain('Disallow: /admin');
    expect(txt).toContain(`Sitemap: ${SITE}/sitemap.xml`);
  });
});
