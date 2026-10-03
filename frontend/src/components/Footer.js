import React from "react";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useLocalizedPath } from "../i18n/useLocalizedPath";

const Footer = () => {
  const { t } = useTranslation();
  const lp = useLocalizedPath();

  return (
    <footer className="bg-ink text-ivory/80 py-10 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm font-display tracking-wide text-ivory text-center md:text-left">
          {t("brand.name")} <span className="opacity-60">— {t("brand.tagline")}</span>
          <div className="text-xs text-ivory/50 mt-1">
            {t("footer.phone")}: <a href="tel:+36704283858" className="hover:text-gold transition-colors">+36 70 428 3858</a> · {t("footer.email")}: <a href="mailto:azegy1@gmail.com" className="hover:text-gold transition-colors">azegy1@gmail.com</a>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link to={lp("contact")} className="hover:text-gold transition-colors duration-300">
            {t("nav.contact")}
          </Link>
          <Link to={lp("gallery")} className="hover:text-gold transition-colors duration-300">
            {t("nav.gallery")}
          </Link>
          <a
            href="https://www.facebook.com/gabriella.ujj.10"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors duration-300"
          >
            Facebook
          </a>
          <a
            href="https://www.youtube.com/@gabriellanemeth4897"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gold transition-colors duration-300"
          >
            YouTube
          </a>
          <Link to={lp("courses")} className="hover:text-gold transition-colors duration-300">
            {t("nav.courses")}
          </Link>
          <Link to={lp("faq")} className="hover:text-gold transition-colors duration-300">
            {t("footer.faq")}
          </Link>
          <Link to={lp("terms")} className="hover:text-gold transition-colors duration-300">
            {t("footer.terms")}
          </Link>
          <Link to={lp("termsOfUse")} className="hover:text-gold transition-colors duration-300">
            {t("footer.termsOfUse")}
          </Link>
          <Link to={lp("privacy")} className="hover:text-gold transition-colors duration-300">
            {t("footer.privacy")}
          </Link>
        </nav>
      </div>
      <div className="text-center text-xs text-ivory/40 mt-6">
        &copy; {new Date().getFullYear()} {t("brand.name")}. {t("footer.rights")}
      </div>
    </footer>
  );
};

export default Footer;
