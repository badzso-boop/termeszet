import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "./Footer";

// Az ÁSZF / Adatvédelem / Felhasználási feltételek közös megjelenítője. A tartalom a
// locales/<nyelv>/legal.json-ban strukturáltan van: fejezetenként bekezdések, opcionális
// címke + felsorolás, vagy címke-érték mezők.
const LegalDocument = ({ docKey, className = "" }) => {
  const { t } = useTranslation("legal");
  const doc = t(docKey, { returnObjects: true });
  const notice = t("notice");

  return (
    <>
      <div className={`max-w-4xl mx-auto p-8 bg-white border border-secondary/20 rounded-md my-16 ${className}`}>
        <h1 className="font-display text-2xl font-semibold mb-6">{doc.title}</h1>
        {notice && <p className="text-sm italic text-ink/70 mb-6">{notice}</p>}

        {doc.sections.map((section, idx) => (
          <section key={section.heading} className={idx < doc.sections.length - 1 ? "mb-6" : ""}>
            <h2 className="font-display text-xl font-semibold mb-2 text-ink">{section.heading}</h2>
            {section.fields && (
              <p className="text-gray-700">
                {section.fields.map((field) => (
                  <React.Fragment key={field.label}>
                    <strong>{field.label}</strong> {field.value} <br />
                  </React.Fragment>
                ))}
              </p>
            )}
            {(section.paragraphs || []).map((paragraph, i) => (
              <p key={i} className={`text-gray-700${i > 0 ? " mt-2" : ""}`}>
                {paragraph}
              </p>
            ))}
            {section.label && (
              <p className="text-gray-700 mt-2">
                <strong>{section.label}</strong>
              </p>
            )}
            {section.items && (
              <ul className={`list-disc list-inside text-gray-700${section.label ? "" : " mt-2"}`}>
                {section.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default LegalDocument;
