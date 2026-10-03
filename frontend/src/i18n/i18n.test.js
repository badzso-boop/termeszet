import React from "react";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import seoCore from "./seoCore";
import { resources } from "./index";
import LanguageSync from "./LanguageSync";
import Navigation from "../components/Navbar";
import { AuthProvider } from "../context/AuthContext";

// Az axios ESM-buildjét a CRA Jest-konfigja nem transzformálja (lásd App.test.js).
jest.mock("axios", () => ({ defaults: { headers: { common: {} } } }));

// Egy JSON-fa összes levél-kulcsa ("a.b.c"); tömböknél csak a hossz számít, a tartalom nyelvenként más.
const keyPaths = (node, prefix = "") => {
  if (Array.isArray(node)) return [`${prefix}[${node.length}]`, ...node.flatMap((item, i) => keyPaths(item, `${prefix}[${i}]`))];
  if (node && typeof node === "object") {
    return Object.entries(node).flatMap(([key, value]) => keyPaths(value, prefix ? `${prefix}.${key}` : key));
  }
  return [prefix];
};

describe("nyelvi fájlok", () => {
  const [base, ...others] = seoCore.LANGUAGES;

  test.each(others)("a(z) %s fordítás kulcsai megegyeznek a magyaréval", (lang) => {
    for (const ns of Object.keys(resources[base])) {
      expect({ ns, keys: keyPaths(resources[lang][ns]).sort() }).toEqual({ ns, keys: keyPaths(resources[base][ns]).sort() });
    }
  });
});

describe("seoCore útvonalak", () => {
  test("nyelv az URL-ből", () => {
    expect(seoCore.langFromPath("/")).toBe("hu");
    expect(seoCore.langFromPath("/galeria")).toBe("hu");
    expect(seoCore.langFromPath("/en")).toBe("en");
    expect(seoCore.langFromPath("/en/gallery")).toBe("en");
    expect(seoCore.langFromPath("/english")).toBe("hu");
  });

  test("lokalizált útvonal és a másik nyelvű megfelelő", () => {
    expect(seoCore.localizePath("gallery", "en")).toBe("/en/gallery");
    expect(seoCore.localizePath("course", "hu", { id: 7 })).toBe("/course/7");
    expect(seoCore.alternatePath("/kapcsolat", "en")).toBe("/en/contact");
    expect(seoCore.alternatePath("/en/course/7", "hu")).toBe("/course/7");
    expect(seoCore.alternatePath("/en", "hu")).toBe("/");
    // admin és ismeretlen oldal: a másik nyelv főoldala
    expect(seoCore.alternatePath("/admin", "en")).toBe("/en");
    expect(seoCore.alternatePath("/nincs-ilyen", "en")).toBe("/en");
  });
});

describe("nyelvváltó a navigációban", () => {
  const renderAt = (path) =>
    render(
      <AuthProvider>
        <MemoryRouter initialEntries={[path]}>
          <LanguageSync>
            <Navigation />
          </LanguageSync>
        </MemoryRouter>
      </AuthProvider>
    );

  test("angol oldalon angol menü, a váltó a magyar megfelelőre mutat", async () => {
    renderAt("/en/gallery");
    expect(await screen.findAllByText("Gallery")).not.toHaveLength(0);
    const switchLinks = screen.getAllByLabelText("Váltás magyar nyelvre");
    switchLinks.forEach((link) => expect(link).toHaveAttribute("href", "/galeria"));
    expect(screen.getAllByText("Courses")[0].closest("a")).toHaveAttribute("href", "/en/courses");
  });

  test("magyar oldalon magyar menü, a váltó az angol megfelelőre mutat", async () => {
    renderAt("/gyik");
    expect(await screen.findAllByText("Galéria")).not.toHaveLength(0);
    screen.getAllByLabelText("Switch to English").forEach((link) => expect(link).toHaveAttribute("href", "/en/faq"));
  });
});
