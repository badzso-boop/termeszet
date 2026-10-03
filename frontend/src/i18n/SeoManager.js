import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import seoCore from "./seoCore";
import huSeo from "./locales/hu/seo.json";
import enSeo from "./locales/en/seo.json";

const seoTexts = { hu: huSeo, en: enSeo };
const siteUrl = (process.env.REACT_APP_SITE_URL || seoCore.SITE_URL).replace(/\/$/, "");

// Kliens oldali navigáció után frissíti a <head>-et. Első betöltéskor ugyanezeket a
// tageket már a szerver (src/seo.js) beinjektálja -- mindkettő a `data-seo` attribútumú
// elemeket kezeli, így itt egyszerűen lecseréljük őket.
const SeoManager = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    const seo = seoCore.buildSeo(pathname, { siteUrl, seoTexts });
    document.title = seo.title;
    document.documentElement.lang = seo.lang;

    document.head.querySelectorAll("[data-seo]").forEach((el) => el.remove());
    seo.tags.forEach(({ tag, attrs }) => {
      const el = document.createElement(tag);
      Object.entries(attrs).forEach(([name, value]) => el.setAttribute(name, value));
      el.setAttribute("data-seo", "");
      document.head.appendChild(el);
    });
    if (seo.jsonLd) {
      const script = document.createElement("script");
      script.type = "application/ld+json";
      script.setAttribute("data-seo", "");
      script.textContent = JSON.stringify(seo.jsonLd);
      document.head.appendChild(script);
    }
  }, [pathname]);

  return null;
};

export default SeoManager;
