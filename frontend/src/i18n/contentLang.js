import seoCore from "./seoCore";

// Adatbázisból jövő, lokalizált tartalom (szolgáltatás, kurzus, lecke, galéria) segédei.
// A backend `i18n.fallback`-ben jelzi, mely mezők maradtak magyarul, mert nincs fordításuk:
// ezeket lang="hu"-val jelöljük (képernyőolvasók, keresők felé).
export const fallbackLang = (item, field) =>
  item?.i18n?.fallback?.includes(field) ? seoCore.DEFAULT_LANG : undefined;

// A kurzus időpontja a felület nyelvének megfelelő formátumban.
export const formatContentDate = (value, lang) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return String(value);
  return date.toLocaleDateString(lang === "en" ? "en-GB" : `${lang}-${lang.toUpperCase()}`, {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};
