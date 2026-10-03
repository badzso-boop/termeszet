import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  LineHomeIcon,
  LineCourseIcon,
  LineGalleryIcon,
  LineContactIcon,
  LineLoginIcon,
  LineRegisterIcon,
  LineAdminIcon,
  LineProfileIcon,
  LineLogoutIcon,
  LineSpaIcon,
  LineMenuIcon,
  LineCloseIcon
} from './LineIcons';

import { useAuth } from '../context/AuthContext';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { rang, logout, userId } = useAuth();
  const navigate = useNavigate();

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate('/login');
  };

  const renderTooltip = (label, desc) => {
    if (isOpen) return null;
    return (
      <div className="hidden sm:group-hover:flex absolute left-full top-1/2 -translate-y-1/2 ml-3.5 px-3 py-1.5 bg-ink text-ivory text-xs rounded-md shadow-xl border border-gold/40 whitespace-nowrap z-50 pointer-events-none items-center gap-1.5 transition-all duration-200 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0">
        <span className="font-semibold text-gold">{label}</span>
        {desc && <span className="text-ivory/70 text-[11px]">— {desc}</span>}
        <div className="absolute right-full top-1/2 -translate-y-1/2 border-[5px] border-transparent border-r-ink" />
      </div>
    );
  };

  return (
    <div className="flex">
      {/* Mobil felső sáv: márkázott háttér a hamburger gomb és az oldal neve mögött */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-secondary shadow-sm flex items-center px-4">
        <button
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Menü bezárása' : 'Menü megnyitása'}
          className="text-ink hover:text-gold transition-colors rounded-md w-10 h-10 flex items-center justify-center"
        >
          {isOpen ? <LineCloseIcon className="w-6 h-6" /> : <LineMenuIcon className="w-6 h-6" />}
        </button>
        <Link to="/" onClick={closeSidebar} className="flex items-center ml-2 text-ink font-display font-semibold tracking-wide truncate">
          <LineSpaIcon className="w-6 h-6 mr-2 shrink-0 text-gold" />
          <span className="truncate">Németh Gabriella</span>
        </Link>
      </div>

      {/* Mobil overlay háttér - kattintásra bezárja a menüt */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 bg-secondary text-ink transition-transform duration-300 ease-in-out ${
          isOpen
            ? 'translate-x-0 w-[260px] sm:w-[300px]'
            : '-translate-x-full sm:translate-x-0 sm:w-16'
        }`}
      >
        <div className={`p-4 hidden sm:flex ${isOpen ? 'justify-start' : 'justify-center'}`}>
          <button
            onClick={toggleSidebar}
            className="text-ink hover:text-gold transition-colors p-1"
            aria-label="Menü kapcsoló"
            title={isOpen ? 'Menü összecsukása' : 'Menü kinyitása'}
          >
            {isOpen ? <LineCloseIcon className="w-7 h-7" /> : <LineMenuIcon className="w-7 h-7" />}
          </button>
        </div>
        <ul className="p-4 pt-16 sm:pt-4">
          {/* Főoldal */}
          <li className="mb-4 relative group">
            <Link
              to="/"
              onClick={closeSidebar}
              title="Főoldal (Kezdőlap)"
              className={`flex justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} items-center text-ink hover:text-gold transition-colors font-medium`}
            >
              <LineHomeIcon className={`w-7 h-7 shrink-0 ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`} />
              <span className={isOpen ? '' : 'sm:hidden'}>Főoldal</span>
            </Link>
            {renderTooltip('Főoldal', 'Kezdőlap')}
          </li>

          {/* Kurzusok */}
          <li className="mb-4 relative group">
            <Link
              to="/courses"
              onClick={closeSidebar}
              title="Kurzusok (Elérhető képzések & tananyagok)"
              className={`flex justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} items-center text-ink hover:text-gold transition-colors font-medium`}
            >
              <LineCourseIcon className={`w-7 h-7 shrink-0 ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`} />
              <span className={isOpen ? '' : 'sm:hidden'}>Kurzusok</span>
            </Link>
            {renderTooltip('Kurzusok', 'Elérhető képzések & tananyagok')}
          </li>

          {/* Galéria */}
          <li className="mb-4 relative group">
            <Link
              to="/galeria"
              onClick={closeSidebar}
              title="Galéria (Fényképek & pillanatok)"
              className={`flex justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} items-center text-ink hover:text-gold transition-colors font-medium`}
            >
              <LineGalleryIcon className={`w-7 h-7 shrink-0 ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`} />
              <span className={isOpen ? '' : 'sm:hidden'}>Galéria</span>
            </Link>
            {renderTooltip('Galéria', 'Fényképek & pillanatok')}
          </li>

          {/* Kapcsolat */}
          <li className="mb-4 relative group">
            <Link
              to="/kapcsolat"
              onClick={closeSidebar}
              title="Kapcsolat (Elérhetőségek & kapcsolatfelvétel)"
              className={`flex justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} items-center text-ink hover:text-gold transition-colors font-medium`}
            >
              <LineContactIcon className={`w-7 h-7 shrink-0 ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`} />
              <span className={isOpen ? '' : 'sm:hidden'}>Kapcsolat</span>
            </Link>
            {renderTooltip('Kapcsolat', 'Elérhetőségek & kapcsolatfelvétel')}
          </li>

          {!rang && (
            <>
              {/* Bejelentkezés */}
              <li className="mb-4 relative group">
                <Link
                  to="/login"
                  onClick={closeSidebar}
                  title="Bejelentkezés (Fiók belépés)"
                  className={`flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-ink hover:text-gold transition-colors font-medium`}
                >
                  <LineLoginIcon className={`w-7 h-7 shrink-0 ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`} />
                  <span className={isOpen ? '' : 'sm:hidden'}>Bejelentkezés</span>
                </Link>
                {renderTooltip('Bejelentkezés', 'Fiók belépés')}
              </li>

              {/* Regisztráció */}
              <li className="mb-4 relative group">
                <Link
                  to="/register"
                  onClick={closeSidebar}
                  title="Regisztráció (Új fiók létrehozása)"
                  className={`flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-ink hover:text-gold transition-colors font-medium`}
                >
                  <LineRegisterIcon className={`w-7 h-7 shrink-0 ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`} />
                  <span className={isOpen ? '' : 'sm:hidden'}>Regisztráció</span>
                </Link>
                {renderTooltip('Regisztráció', 'Új fiók létrehozása')}
              </li>
            </>
          )}

          {rang === "a" && (
            <li className="mb-4 relative group">
              <Link
                to="/admin"
                onClick={closeSidebar}
                title="Admin (Adminisztrációs felület)"
                className={`flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-ink hover:text-gold transition-colors font-medium`}
              >
                <LineAdminIcon className={`w-7 h-7 shrink-0 ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`} />
                <span className={isOpen ? '' : 'sm:hidden'}>Admin</span>
              </Link>
              {renderTooltip('Admin', 'Adminisztrációs felület')}
            </li>
          )}

          {rang && (
            <>
              <li className="mb-4 relative group">
                <Link
                  to={`/user/${userId}`}
                  onClick={closeSidebar}
                  title="Profil (Saját profil & adatok)"
                  className={`flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-ink hover:text-gold transition-colors font-medium`}
                >
                  <LineProfileIcon className={`w-7 h-7 shrink-0 ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`} />
                  <span className={isOpen ? '' : 'sm:hidden'}>Profil</span>
                </Link>
                {renderTooltip('Profil', 'Saját profil & adatok')}
              </li>
              <li className="mb-4 relative group">
                <button
                  onClick={handleLogout}
                  title="Kijelentkezés"
                  className={`flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-ink hover:text-gold transition-colors font-medium w-full`}
                >
                  <LineLogoutIcon className={`w-7 h-7 shrink-0 ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`} />
                  <span className={isOpen ? '' : 'sm:hidden'}>Kijelentkezés</span>
                </button>
                {renderTooltip('Kijelentkezés', 'Kijelentkezés')}
              </li>
            </>
          )}
        </ul>
      </div>
      <div
        className={`transition-all duration-300 ${
          isOpen ? 'w-0 sm:w-[300px]' : 'w-0 sm:w-16'
        }`}
      />
    </div>
  );
};

export default Navigation;
