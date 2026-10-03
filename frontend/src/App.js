import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Course from './components/Course';
import User from './components/User';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import ASZF from './pages/ASZF';
import FelhasznalasiFeltetelek from './pages/FelhasznalasiFeltetelek';
import Adatvedelem from './pages/Adatvedelem';
import GYIK from './pages/GYIK';
import Contact from './pages/Contact';
import Gallery from './pages/Gallery';
import NotFound from './pages/NotFound';

import AdminCreate from './components/AdminCreate';
import AdminUserUpdate from './components/AdminUserUpdate';
import AdminCourseUpdate from './components/AdminCourseUpdate';
import AdminHomeworkUpdate from './components/AdminHomeworkUpdate';

import Navigation from './components/Navbar';
import seoCore from './i18n/seoCore';
import LanguageSync from './i18n/LanguageSync';
import SeoManager from './i18n/SeoManager';

// Útvonal-kulcs -> oldal. Az útvonalak nyelvenként az i18n/routes.json-ból jönnek
// (pl. gallery: /galeria és /en/gallery), ugyanabból, amiből a szerver a SEO-tageket és a
// sitemap.xml-t generálja.
const PAGES = {
  home: Home,
  courses: Courses,
  gallery: Gallery,
  contact: Contact,
  faq: GYIK,
  terms: ASZF,
  termsOfUse: FelhasznalasiFeltetelek,
  privacy: Adatvedelem,
  login: Login,
  register: Register,
  course: Course,
  user: User,
};

const App = () => {
  return (
    <Router>
      <SeoManager />
      <LanguageSync>
        <div className="flex">
          <Navigation />
          <div className="flex-1 pt-16 sm:pt-0">
            <Routes>
              {seoCore.LANGUAGES.flatMap((lang) =>
                Object.entries(PAGES).map(([key, Page]) => (
                  <Route key={`${lang}-${key}`} path={seoCore.ROUTES[key][lang]} element={<Page />} />
                ))
              )}
              {Object.entries(seoCore.REDIRECTS).map(([from, to]) => (
                <Route key={from} path={from} element={<Navigate to={to} replace />} />
              ))}

              {/* Admin felület: csak magyarul */}
              <Route path="/admin" element={<Admin />} />
              <Route path="/admincreate/course" element={<AdminCreate />} />
              <Route path="/adminupdateuser/:id" element={<AdminUserUpdate type={"user"}/>} />
              <Route path="/adminupdatecourse/:id" element={<AdminCourseUpdate type={"course"}/>} />
              <Route path="/adminupdatehw/:id" element={<AdminHomeworkUpdate type={"hw"}/>} />

              <Route path="*" element={<NotFound />} />
            </Routes>
          </div>
        </div>
      </LanguageSync>
    </Router>
  );
};

export default App;
