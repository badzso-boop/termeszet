import React from "react";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";

const GYIK = () => {
  const { t } = useTranslation("pages");
  const faqData = t("faq.items", { returnObjects: true });

  return (
    <>
      <div className="py-20 sm:py-28 bg-primary/40">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="section-heading mb-4">
            {t("faq.heading")}
          </h1>
          <div className="divider-gold mb-12" />
          <div className="space-y-4">
            {faqData.map((item, index) => (
              <div key={index} className="bg-white border border-secondary/20 rounded-md p-6 shadow-sm">
                <h2 className="font-display text-xl font-semibold text-ink mb-2">
                  {item.question}
                </h2>
                <p className="text-gray-700 leading-relaxed">{item.answer}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};


export default GYIK;
