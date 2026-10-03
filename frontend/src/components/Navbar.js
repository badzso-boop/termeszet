import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
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
import seoCore from '../i18n/seoCore';
import { useLang, useLocalizedPath } from '../i18n/useLocalizedPath';

const Navigation = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { rang, logout, userId } = useAuth();
  const navigate = useNavigate();
  const { pathname } = useLocation();
  const { t } = useTranslation();
  const lang = useLang();
  const lp = useLocalizedPath();

  // A nyelvváltó ugyanannak az oldalnak a másik nyelvű változatára visz (pl. /galeria <-> /en/gallery).
  const otherLang = seoCore.LANGUAGES.find((l) => l !== lang);
  const switchLanguagePath = seoCore.alternatePath(pathname, otherLang);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  const handleLogout = () => {
    logout();
    closeSidebar();
    navigate(lp('login'));
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

  const itemClass = `flex items-center justify-start ${isOpen ? 'sm:justify-start' : 'sm:justify-center'} text-ink hover:text-gold transition-colors font-medium`;
  const iconClass = `w-7 h-7 shrink-0 ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`;
  const labelClass = isOpen ? '' : 'sm:hidden';

  const renderLink = (to, Icon, label, desc) => (
    <li className="mb-4 relative group" key={label}>
      <Link to={to} onClick={closeSidebar} title={`${label} (${desc})`} className={itemClass}>
        <Icon className={iconClass} />
        <span className={labelClass}>{label}</span>
      </Link>
      {renderTooltip(label, desc)}
    </li>
  );

  return (
    <div className="flex">
      {/* Mobil felső sáv: márkázott háttér a hamburger gomb és az oldal neve mögött */}
      <div className="sm:hidden fixed top-0 left-0 right-0 z-50 h-16 bg-secondary shadow-sm flex items-center px-4">
        <button
          onClick={toggleSidebar}
          aria-label={isOpen ? t('nav.closeMenu') : t('nav.openMenu')}
          className="text-ink hover:text-gold transition-colors rounded-md w-10 h-10 flex items-center justify-center"
        >
          {isOpen ? <LineCloseIcon className="w-6 h-6" /> : <LineMenuIcon className="w-6 h-6" />}
        </button>
        <Link to={lp('home')} onClick={closeSidebar} className="flex items-center ml-2 text-ink font-display font-semibold tracking-wide truncate">
          <LineSpaIcon className="w-6 h-6 mr-2 shrink-0 text-gold" />
          <span className="truncate">{t('brand.name')}</span>
        </Link>
        <Link
          to={switchLanguagePath}
          onClick={closeSidebar}
          hrefLang={otherLang}
          aria-label={t('language.switchAria')}
          className="ml-auto shrink-0 px-2.5 py-1 rounded-md border border-ink/30 text-xs font-semibold tracking-wider text-ink hover:text-gold hover:border-gold transition-colors"
        >
          {t('language.switchToShort')}
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
            aria-label={t('nav.toggleMenu')}
            title={isOpen ? t('nav.collapseMenu') : t('nav.expandMenu')}
          >
            {isOpen ? <LineCloseIcon className="w-7 h-7" /> : <LineMenuIcon className="w-7 h-7" />}
          </button>
        </div>
        <ul className="p-4 pt-16 sm:pt-4">
          {renderLink(lp('home'), LineHomeIcon, t('nav.home'), t('nav.homeDesc'))}
          {renderLink(lp('courses'), LineCourseIcon, t('nav.courses'), t('nav.coursesDesc'))}
          {renderLink(lp('gallery'), LineGalleryIcon, t('nav.gallery'), t('nav.galleryDesc'))}
          {renderLink(lp('contact'), LineContactIcon, t('nav.contact'), t('nav.contactDesc'))}

          {!rang && (
            <>
              {renderLink(lp('login'), LineLoginIcon, t('nav.login'), t('nav.loginDesc'))}
              {renderLink(lp('register'), LineRegisterIcon, t('nav.register'), t('nav.registerDesc'))}
            </>
          )}

          {/* Az admin felület csak magyarul érhető el */}
          {rang === "a" && renderLink('/admin', LineAdminIcon, t('nav.admin'), t('nav.adminDesc'))}

          {rang && (
            <>
              {renderLink(lp('user', { id: userId }), LineProfileIcon, t('nav.profile'), t('nav.profileDesc'))}
              <li className="mb-4 relative group">
                <button
                  onClick={handleLogout}
                  title={t('nav.logout')}
                  className={`${itemClass} w-full`}
                >
                  <LineLogoutIcon className={iconClass} />
                  <span className={labelClass}>{t('nav.logout')}</span>
                </button>
                {renderTooltip(t('nav.logout'))}
              </li>
            </>
          )}

          {/* Nyelvváltó */}
          <li className="mb-4 relative group hidden sm:block">
            <Link
              to={switchLanguagePath}
              onClick={closeSidebar}
              hrefLang={otherLang}
              aria-label={t('language.switchAria')}
              title={t('language.switchTo')}
              className={itemClass}
            >
              <span className={`w-7 h-7 shrink-0 flex items-center justify-center rounded-md border border-ink/30 text-[11px] font-semibold tracking-wider ${isOpen ? 'mr-3' : 'sm:mr-0 mr-3'}`}>
                {t('language.switchToShort')}
              </span>
              <span className={labelClass}>{t('language.switchTo')}</span>
            </Link>
            {renderTooltip(t('language.label'), t('language.switchTo'))}
          </li>
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
