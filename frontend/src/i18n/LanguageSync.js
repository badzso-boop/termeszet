import { useLayoutEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useLang } from "./useLocalizedPath";

// Az i18n nyelvét az URL-hez igazítja (pl. nyelvváltó gomb, vissza/előre gomb), és addig
// nem rendereli a gyerekeit, amíg a kettő nem egyezik. Enélkül a nyelvváltáskor újonnan
// mountolt oldal még a régi nyelven renderelne, és lemaradna a "languageChanged"
// eseményről (a react-i18next csak a mount utáni effektben iratkozik fel rá). A váltás
// szinkron, festés előtt történik (a fordítások be vannak csomagolva), így nem villan.
const LanguageSync = ({ children }) => {
  const lang = useLang();
  const { i18n } = useTranslation();
  const [, setSyncedLang] = useState(i18n.language);

  useLayoutEffect(() => {
    if (i18n.language !== lang) {
      i18n.changeLanguage(lang);
      setSyncedLang(lang);
    }
  }, [lang, i18n]);

  return i18n.language === lang ? children : null;
};

export default LanguageSync;
