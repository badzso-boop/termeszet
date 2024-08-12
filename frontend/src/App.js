import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Courses from './pages/Courses';
import Course from './components/Course';
import User from './components/User';
import Login from './pages/Login';
import Register from './pages/Register';
import Admin from './pages/Admin';
import AdminCreate from './components/AdminCreate';
import AdminUserUpdate from './components/AdminUserUpdate';
import AdminCourseUpdate from './components/AdminCourseUpdate'
import AdminHomeworkUpdate from './components/AdminHomeworkUpdate'
import axios from "axios";

import Navigation from './components/Navbar';

const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

const userFormConfig = {
  title: 'Felhasználó szerkesztése',
  fields: [
    { name: 'email', type: 'email', label: 'Email', required: true },
    { name: 'pwd', type: 'password', label: 'Password', required: true },
    { name: 'username', type: 'text', label: 'Username', required: true },
    { name: 'fullName', type: 'text', label: 'Full Name', required: true },
  ],
  submitFunction: (data) => axios.post(`${API_BASE_URL}/api/register`, data),
  submitButtonText: 'Register',
};

const courseFormConfig = {
  title: 'Kurzus létrehozása',
  fields: [
    { name: 'cim', type: 'text', label: 'Cím', required: true },
    { name: 'ar', type: 'number', label: 'Ár', required: true },
    { name: 'helyszin', type: 'text', label: 'Helyszín', required: true },
    { name: 'idopont', type: 'date', label: 'Időpont', required: true },
    { name: 'video', type: 'file', label: 'Videó' },
  ],
  submitFunction: (data) => axios.post(`${API_BASE_URL}/api/admin/createCourse`, data),
  submitButtonText: 'Kurzus létrehozása',
};

const homeworkFormConfig = {
  title: 'Házifeladat létrehozása',
  fields: [
    { name: 'cim', type: 'text', label: 'Cím', required: true },
    { name: 'leiras', type: 'text', label: 'Leírás', required: true },
    { name: 'hataridoDatum', type: 'date', label: 'Határidő dátuma', required: true },
    { name: 'letrehozasDatum', type: 'date', label: 'Létrehozás dátuma', required: true },
  ],
  submitFunction: (data) => axios.post(`${API_BASE_URL}/api/admin/homeworks`, data),
  submitButtonText: 'Create Homework',
};

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

            <Route path="/course/:id" element={<Course />} />
            <Route path="/user/:id" element={<User />} />

            <Route path="/admincreate/user" element={<AdminCreate formConfig={userFormConfig} />} />
            <Route path="/admincreate/course" element={<AdminCreate formConfig={courseFormConfig} />} />
            <Route path="/admincreate/homework" element={<AdminCreate formConfig={homeworkFormConfig} />} />
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
