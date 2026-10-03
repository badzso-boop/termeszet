import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import Footer from "../components/Footer";
import { useLocalizedPath } from "../i18n/useLocalizedPath";

const NotFound = () => {
  const { t } = useTranslation();
  const lp = useLocalizedPath();

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 flex items-center justify-center bg-primary/40 py-20 px-4">
        <div className="max-w-xl text-center">
          <h1 className="section-heading mb-4">{t("notFound.title")}</h1>
          <div className="divider-gold mb-6" />
          <p className="text-gray-700 mb-8">{t("notFound.text")}</p>
          <Link to={lp("home")} className="btn-brand">
            {t("notFound.backHome")}
          </Link>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NotFound;
