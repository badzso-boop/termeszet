import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-ink text-ivory/80 py-10 px-4">
      <div className="container mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
        <div className="text-sm font-display tracking-wide text-ivory text-center md:text-left">
          Németh Gabriella <span className="opacity-60">— Reflexológia és Forrás-kód® lélekalkotás kísérő</span>
          <div className="text-xs text-ivory/50 mt-1">
            Tel: <a href="tel:+36704283858" className="hover:text-gold transition-colors">+36 70 428 3858</a> · E-mail: <a href="mailto:azegy1@gmail.com" className="hover:text-gold transition-colors">azegy1@gmail.com</a>
          </div>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link to="/kapcsolat" className="hover:text-gold transition-colors duration-300">
            Kapcsolat
          </Link>
          <Link to="/galeria" className="hover:text-gold transition-colors duration-300">
            Galéria
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
          <Link to="/courses" className="hover:text-gold transition-colors duration-300">
            Kurzusok
          </Link>
          <Link to="/gyik" className="hover:text-gold transition-colors duration-300">
            GY.I.K.
          </Link>
          <Link to="/aszf" className="hover:text-gold transition-colors duration-300">
            ÁSZF
          </Link>
          <Link to="/felhasznalas" className="hover:text-gold transition-colors duration-300">
            Felhasználási feltételek
          </Link>
          <Link to="/adatvedelem" className="hover:text-gold transition-colors duration-300">
            Adatvédelem
          </Link>
        </nav>
      </div>
      <div className="text-center text-xs text-ivory/40 mt-6">
        &copy; {new Date().getFullYear()} Németh Gabriella. Minden jog fenntartva.
      </div>
    </footer>
  );
};

export default Footer;
