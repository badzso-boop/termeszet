import React from "react";
import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto flex justify-between items-center">
          <div className="text-sm">
            &copy; 2024 Reflexológia és Hangterápia. Minden jog fenntartva.
          </div>
          <nav className="space-x-4">
            <Link to="/aszf" className="hover:text-gray-400">
              ÁSZF
            </Link>
            <Link to="/gyik" className="hover:text-gray-400">
              GY.I.K.
            </Link>
            <Link to="/felhasznalas" className="hover:text-gray-400">
              Felhasználási feltételek
            </Link>
            <Link to="/adatvedelem" className="hover:text-gray-400">
              Adatvédelem
            </Link>
          </nav>
        </div>
      </footer>
  );
};

export default Footer;
