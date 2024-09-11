import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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

import AdminCreate from './components/AdminCreate';
import AdminUserUpdate from './components/AdminUserUpdate';
import AdminCourseUpdate from './components/AdminCourseUpdate'
import AdminHomeworkUpdate from './components/AdminHomeworkUpdate'

import Navigation from './components/Navbar';

const App = () => {
  return (
    <Router>
      <div className="flex">
        <Navigation />
        <div className="flex-1 pl-4">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/courses" element={<Courses />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin" element={<Admin />} />

            <Route path="/aszf" element={<ASZF /> } />
            <Route path="/felhasznalas" element={<FelhasznalasiFeltetelek />} />
            <Route path="/adatvedelem" element={<Adatvedelem />} />
            <Route path="/gyik" element={<GYIK />} />

            <Route path="/course/:id" element={<Course />} />
            <Route path="/user/:id" element={<User />} />
            <Route path="/admincreate/course" element={<AdminCreate />} />
            <Route path="/adminupdateuser/:id" element={<AdminUserUpdate type={"user"}/>} />
            <Route path="/adminupdatecourse/:id" element={<AdminCourseUpdate type={"course"}/>} />
            <Route path="/adminupdatehw/:id" element={<AdminHomeworkUpdate type={"hw"}/>} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
