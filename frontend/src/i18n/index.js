import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import seoCore from "./seoCore";

import huCommon from "./locales/hu/common.json";
import huHome from "./locales/hu/home.json";
import huPages from "./locales/hu/pages.json";
import huLegal from "./locales/hu/legal.json";
import huApi from "./locales/hu/api.json";
import huSeo from "./locales/hu/seo.json";
import enCommon from "./locales/en/common.json";
import enHome from "./locales/en/home.json";
import enPages from "./locales/en/pages.json";
import enLegal from "./locales/en/legal.json";
import enApi from "./locales/en/api.json";
import enSeo from "./locales/en/seo.json";

export const resources = {
  hu: { common: huCommon, home: huHome, pages: huPages, legal: huLegal, api: huApi, seo: huSeo },
  en: { common: enCommon, home: enHome, pages: enPages, legal: enLegal, api: enApi, seo: enSeo },
};

// A nyelvet az URL határozza meg (/en/... = angol, minden más = magyar) -- nincs
// böngésző-nyelv alapú átirányítás, hogy minden URL-nek egyértelmű, indexelhető nyelve legyen.
i18n.use(initReactI18next).init({
  resources,
  lng: seoCore.langFromPath(window.location.pathname),
  fallbackLng: seoCore.DEFAULT_LANG,
  supportedLngs: seoCore.LANGUAGES,
  ns: ["common", "home", "pages", "legal", "api", "seo"],
  defaultNS: "common",
  interpolation: { escapeValue: false },
});

export default i18n;
