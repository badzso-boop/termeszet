import React, { useCallback, useState } from "react";
import seoCore from "../i18n/seoCore";

// Admin: fordítható tartalom (szolgáltatás, kurzus, lecke, galéria-cím) szerkesztése
// nyelvenként. A magyar az alapnyelv (az eredeti mezők), a többi nyelv a backend
// fordítási tábláiba kerül (`translations` mező, lásd src/helpers/contentTranslations.js).
// A nyelvlista az i18n/routes.json-ból jön, így egy új nyelv (pl. német) felvétele után a
// fülek és a mentés változtatás nélkül kezelik azt is.

export const DEFAULT_LANG = seoCore.DEFAULT_LANG;
export const TRANSLATION_LANGUAGES = seoCore.LANGUAGES.filter((lang) => lang !== DEFAULT_LANG);
export const languageName = (lang) => (seoCore.LANGUAGE_NAMES || {})[lang] || lang.toUpperCase();

export const TRANSLATION_STATUS = {
  complete: { icon: "✓", label: "Kész", className: "bg-emerald-100 text-emerald-900 border-emerald-300" },
  partial: { icon: "◐", label: "Részleges – van lefordítatlan mező", className: "bg-amber-50 text-amber-900 border-amber-300" },
  outdated: { icon: "⚠", label: "Elavult – a magyar szöveg azóta változott", className: "bg-orange-100 text-orange-900 border-orange-300" },
  missing: { icon: "–", label: "Nincs fordítás", className: "bg-white/70 text-ink/60 border-secondary/40" },
};

const emptyDrafts = (fields) =>
  Object.fromEntries(TRANSLATION_LANGUAGES.map((lang) => [lang, Object.fromEntries(fields.map((f) => [f, ""]))]));

// Szerkesztő-állapot egy űrlaphoz. `bind(field, huValue, setHuValue)` az aktuálisan
// szerkesztett nyelv szerinti value/onChange párost adja egy input/textarea-hoz.
// A mentésbe (`payload()`) csak azok a nyelvek kerülnek, amelyekhez az admin ténylegesen
// hozzányúlt -- így egy félig betöltött rekord mentése sem törölhet le meglévő fordítást.
export function useContentTranslations(fields) {
  const [editLang, setEditLang] = useState(DEFAULT_LANG);
  const [drafts, setDrafts] = useState(() => emptyDrafts(fields));
  const [statuses, setStatuses] = useState({});
  const [touched, setTouched] = useState({});
  const [upToDate, setUpToDate] = useState({});

  const reset = useCallback(
    (record) => {
      const next = emptyDrafts(fields);
      const nextStatuses = {};
      for (const lang of TRANSLATION_LANGUAGES) {
        const saved = record?.translations?.[lang];
        if (saved) {
          fields.forEach((field) => {
            next[lang][field] = saved[field] ?? "";
          });
          nextStatuses[lang] = saved.status;
        } else {
          nextStatuses[lang] = "missing";
        }
      }
      setDrafts(next);
      setStatuses(nextStatuses);
      setTouched({});
      setUpToDate({});
      setEditLang(DEFAULT_LANG);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fields.join("|")]
  );

  const setField = (lang, field, value) => {
    setDrafts((prev) => ({ ...prev, [lang]: { ...prev[lang], [field]: value } }));
    setTouched((prev) => ({ ...prev, [lang]: true }));
  };

  const bind = (field, huValue, setHuValue) =>
    editLang === DEFAULT_LANG
      ? { value: huValue ?? "", onChange: (e) => setHuValue(e.target.value) }
      : { value: drafts[editLang][field] ?? "", onChange: (e) => setField(editLang, field, e.target.value) };

  const markUpToDate = (lang) => {
    setUpToDate((prev) => ({ ...prev, [lang]: true }));
    setTouched((prev) => ({ ...prev, [lang]: true }));
  };

  const payload = () =>
    Object.fromEntries(
      TRANSLATION_LANGUAGES.filter((lang) => touched[lang]).map((lang) => [
        lang,
        { ...drafts[lang], ...(upToDate[lang] ? { markUpToDate: true } : {}) },
      ])
    );

  return {
    editLang,
    setEditLang,
    isDefault: editLang === DEFAULT_LANG,
    drafts,
    statuses,
    upToDate,
    reset,
    bind,
    markUpToDate,
    payload,
  };
}

// Kis állapotjelvény egy nyelvhez (listákban és a füleken).
export const TranslationBadge = ({ lang, status }) => {
  const info = TRANSLATION_STATUS[status] || TRANSLATION_STATUS.missing;
  return (
    <span
      title={`${languageName(lang)}: ${info.label}`}
      className={`inline-flex items-center gap-1 px-1.5 py-0.5 rounded border text-[10px] font-semibold tracking-wide ${info.className}`}
    >
      {lang.toUpperCase()} {info.icon}
    </span>
  );
};

// Listanézethez: egy rekord összes nyelvének állapota (record.translations.<nyelv>.status).
export const TranslationBadges = ({ translations }) => (
  <span className="inline-flex flex-wrap gap-1">
    {TRANSLATION_LANGUAGES.map((lang) => (
      <TranslationBadge key={lang} lang={lang} status={translations?.[lang]?.status} />
    ))}
  </span>
);

// Nyelvválasztó fülek egy űrlap tetejére + magyarázat / "naprakész" jelölés a nem-magyar füleken.
export const AdminLanguageTabs = ({ editor }) => {
  const { editLang, setEditLang, statuses, upToDate, markUpToDate, isDefault } = editor;
  const status = upToDate[editLang] ? "complete" : statuses[editLang];

  return (
    <div className="mb-4">
      <div className="text-xs font-semibold text-ink uppercase tracking-wider mb-1.5">Szerkesztett nyelv</div>
      <div className="flex flex-wrap gap-2" role="tablist" aria-label="Szerkesztett nyelv">
        {[DEFAULT_LANG, ...TRANSLATION_LANGUAGES].map((lang) => (
          <button
            key={lang}
            type="button"
            role="tab"
            aria-selected={editLang === lang}
            onClick={() => setEditLang(lang)}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md border text-sm font-medium transition-colors ${
              editLang === lang ? "bg-ink text-ivory border-ink" : "bg-white/70 text-ink border-secondary/40 hover:border-gold"
            }`}
          >
            <span>{languageName(lang)}{lang === DEFAULT_LANG ? " (alap)" : ""}</span>
            {lang !== DEFAULT_LANG && (
              <TranslationBadge lang={lang} status={upToDate[lang] ? "complete" : statuses[lang]} />
            )}
          </button>
        ))}
      </div>
      {!isDefault && (
        <div className="mt-2 text-xs text-ink/70 leading-relaxed">
          {languageName(editLang)} fordítás. Ami itt üresen marad, az a weboldalon magyarul jelenik meg. A magyar
          eredeti minden mező alatt látszik.
          {status === "outdated" && (
            <div className="mt-2 p-2 rounded-md border border-orange-300 bg-orange-50 text-orange-900 flex flex-wrap items-center justify-between gap-2">
              <span>A magyar szöveg a fordítás óta megváltozott – nézd át a fordítást.</span>
              <button
                type="button"
                onClick={() => markUpToDate(editLang)}
                className="px-2 py-1 rounded border border-orange-400 bg-white text-xs font-semibold hover:bg-orange-100"
              >
                Átnéztem, naprakész
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

// Nem-magyar fül alatt a mező magyar eredetije (referencia a fordításhoz).
export const SourceText = ({ editor, text }) =>
  editor.isDefault ? null : (
    <div className="mt-1 text-xs text-ink/60 whitespace-pre-wrap max-h-24 overflow-y-auto">
      <span className="font-semibold">Magyar eredeti:</span> {text ? text : <em>(üres)</em>}
    </div>
  );
