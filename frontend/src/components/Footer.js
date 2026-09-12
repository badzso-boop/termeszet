import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-ink text-ivory/80 py-10 px-4">
      <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center gap-6">
        <div className="text-sm font-display tracking-wide text-ivory text-center sm:text-left">
          Németh Gabriella <span className="opacity-50">— Reflexológia és Hangterápia</span>
        </div>
        <nav className="flex flex-wrap justify-center gap-x-6 gap-y-2 text-sm">
          <Link to="/aszf" className="hover:text-gold transition-colors duration-300">
            ÁSZF
          </Link>
          <Link to="/gyik" className="hover:text-gold transition-colors duration-300">
            GY.I.K.
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
        &copy; 2024 Németh Gabriella. Minden jog fenntartva.
      </div>
    </footer>
  );
};

export default Footer;
