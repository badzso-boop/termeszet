import { act, renderHook } from "@testing-library/react";
import { useContentTranslations, TRANSLATION_LANGUAGES } from "./AdminContentTranslation";

const FIELDS = ["title", "description"];
const record = {
  title: "Magyar cím",
  translations: { en: { title: "English title", description: "", status: "partial" } },
};

describe("useContentTranslations", () => {
  test("a nyelvlista a routes.json-ból jön, az alapnyelv nélkül", () => {
    expect(TRANSLATION_LANGUAGES).toContain("en");
    expect(TRANSLATION_LANGUAGES).not.toContain("hu");
  });

  test("betöltés után a fordítás és az állapot látszik; érintetlen nyelv nem kerül a mentésbe", () => {
    const { result } = renderHook(() => useContentTranslations(FIELDS));
    act(() => result.current.reset(record));
    expect(result.current.statuses.en).toBe("partial");
    expect(result.current.drafts.en.title).toBe("English title");
    // Az admin csak a magyart szerkesztette -> a meglévő angol fordítást nem küldjük (nem törlődhet)
    expect(result.current.payload()).toEqual({});
  });

  test("bind: magyar fülön az eredeti mezőt, angol fülön a fordítást szerkeszti", () => {
    let hu = "Magyar cím";
    const setHu = (v) => {
      hu = v;
    };
    const { result } = renderHook(() => useContentTranslations(FIELDS));
    act(() => result.current.reset(record));

    expect(result.current.bind("title", hu, setHu).value).toBe("Magyar cím");
    act(() => result.current.setEditLang("en"));
    expect(result.current.bind("title", hu, setHu).value).toBe("English title");
    act(() => result.current.bind("title", hu, setHu).onChange({ target: { value: "New title" } }));

    expect(hu).toBe("Magyar cím");
    expect(result.current.payload()).toEqual({ en: { title: "New title", description: "" } });
  });

  test("naprakésznek jelölés: markUpToDate a mentésben", () => {
    const { result } = renderHook(() => useContentTranslations(FIELDS));
    act(() => result.current.reset({ translations: { en: { title: "T", description: "D", status: "outdated" } } }));
    act(() => result.current.markUpToDate("en"));
    expect(result.current.payload()).toEqual({ en: { title: "T", description: "D", markUpToDate: true } });
  });
});
