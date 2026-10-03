import { useCallback } from "react";
import { useLocation } from "react-router-dom";
import seoCore from "./seoCore";

// Az aktuális nyelv az URL-ből (nem az i18n állapotából), így a linkek már az
// átváltás utáni első renderben is a jó nyelvű útvonalra mutatnak.
export const useLang = () => seoCore.langFromPath(useLocation().pathname);

// lp("gallery") -> "/galeria" vagy "/en/gallery"; lp("course", { id: 3 }) -> "/en/course/3"
export const useLocalizedPath = () => {
  const lang = useLang();
  return useCallback((key, params) => seoCore.localizePath(key, lang, params), [lang]);
};
