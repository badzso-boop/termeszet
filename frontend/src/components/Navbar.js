import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHome, faSignInAlt, faUserPlus, faUser, faUserShield, faBars, faTimes, faSignOutAlt, faTasks, faSpa } from '@fortawesome/free-solid-svg-icons';

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

  return (
    <div className="flex">
      {/* Mobil felső sáv: márkázott háttér a hamburger gomb és az oldal neve mögött,
          hogy a gomb ne egy csupasz fehér csíkon "lebegjen" kis képernyőn */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-secondary shadow-md flex items-center px-4">
        <button
          onClick={toggleSidebar}
          aria-label={isOpen ? 'Menü bezárása' : 'Menü megnyitása'}
          className="text-black rounded-full w-10 h-10 flex items-center justify-center"
        >
          <FontAwesomeIcon icon={isOpen ? faTimes : faBars} className="text-xl" />
        </button>
        <div className="flex items-center ml-2 text-black font-semibold truncate">
          <FontAwesomeIcon icon={faSpa} className="mr-2 shrink-0" />
          <span className="truncate">Németh Gabriella</span>
        </div>
      </div>

      {/* Mobil overlay háttér - kattintásra bezárja a menüt */}
      {isOpen && (
        <div
          className="sm:hidden fixed inset-0 bg-black bg-opacity-40 z-30"
          onClick={closeSidebar}
        />
      )}

      <div
        className={`fixed inset-y-0 left-0 z-40 bg-secondary text-black transition-transform duration-300 ease-in-out ${
          isOpen
            ? 'translate-x-0 w-[260px] sm:w-[300px]'
            : '-translate-x-full sm:translate-x-0 sm:w-16'
        }`}
      >
        <div className={`p-4 hidden sm:flex ${isOpen ? 'justify-start' : 'justify-center'}`}>
          <button onClick={toggleSidebar} className="text-black text-3xl">
            <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
          </button>
        </div>
        <ul className="p-4 pt-16 sm:pt-4">
          <li className="mb-4">
            <Link
              to="/"
              onClick={closeSidebar}
              className={`flex justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} items-center text-black hover:text-gray-300`}
            >
              <FontAwesomeIcon icon={faHome} className={`text-3xl ${isOpen ? 'mr-2' : 'sm:mr-0 mr-2'}`} />
              <span className={isOpen ? '' : 'sm:hidden'}>Főoldal</span>
            </Link>
          </li>
          <li className="mb-4">
            <Link
              to="/courses"
              onClick={closeSidebar}
              className={`flex justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} items-center text-black hover:text-gray-300`}
            >
              <FontAwesomeIcon icon={faTasks} className={`text-3xl ${isOpen ? 'mr-2' : 'sm:mr-0 mr-2'}`} />
              <span className={isOpen ? '' : 'sm:hidden'}>Kurzusok</span>
            </Link>
          </li>
          {!rang &&
            <>
              <li className="mb-4">
                <Link
                  to="/login"
                  onClick={closeSidebar}
                  className={`flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-black hover:text-gray-300`}
                >
                  <FontAwesomeIcon icon={faSignInAlt} className={`text-3xl ${isOpen ? 'mr-2' : 'sm:mr-0 mr-2'}`} />
                  <span className={isOpen ? '' : 'sm:hidden'}>Bejelentkezés</span>
                </Link>
              </li>
              <li className="mb-4">
                <Link
                  to="/register"
                  onClick={closeSidebar}
                  className={`flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-black hover:text-gray-300`}
                >
                  <FontAwesomeIcon icon={faUserPlus} className={`text-3xl ${isOpen ? 'mr-2' : 'sm:mr-0 mr-2'}`} />
                  <span className={isOpen ? '' : 'sm:hidden'}>Regisztráció</span>
                </Link>
              </li>
            </>}

          {rang === "a" && (
            <li className="mb-4">
              <Link
                to="/admin"
                onClick={closeSidebar}
                className={`flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-black hover:text-gray-300`}
              >
                <FontAwesomeIcon icon={faUserShield} className={`text-3xl ${isOpen ? 'mr-2' : 'sm:mr-0 mr-2'}`} />
                <span className={isOpen ? '' : 'sm:hidden'}>Admin</span>
              </Link>
            </li>
          )}
          {rang &&
          <>
            <li className="mb-4">
              <Link
                to={`/user/${userId}`}
                onClick={closeSidebar}
                className={`flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-black hover:text-gray-300`}
              >
                <FontAwesomeIcon icon={faUser} className={`text-3xl ${isOpen ? 'mr-2' : 'sm:mr-0 mr-2'}`} />
                <span className={isOpen ? '' : 'sm:hidden'}>Profil</span>
              </Link>
            </li>
            <li className="mb-4">
              <button
                onClick={handleLogout}
                className={`flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-black hover:text-gray-300 w-full`}
              >
                <FontAwesomeIcon icon={faSignOutAlt} className={`text-3xl ${isOpen ? 'mr-2' : 'sm:mr-0 mr-2'}`} />
                <span className={isOpen ? '' : 'sm:hidden'}>Kijelentkezés</span>
              </button>
            </li>
            </>}
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
