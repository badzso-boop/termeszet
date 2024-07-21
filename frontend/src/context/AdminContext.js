import React, { createContext, useContext, useState } from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { userId } = useAuth();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [homeworks, setHomeworks] = useState([]);

  const fetchData = async () => {
    try {
      const users = await axios.post('http://localhost:3000/api/admin/users', {
        userId:  userId
      });

      const courses = await axios.post('http://localhost:3000/api/admin/courses', {
        userId:  userId
      });

      const homeworks = await axios.post('http://localhost:3000/api/admin/homeworks', {
        userId:  userId
      });

      setUsers(users.data);
      setCourses(courses.data)
      setHomeworks(homeworks.data)
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const getOneUser = async (userId) => {
    const user = await axios.post('http://localhost:3000/api/user', {
      userId:  userId
    });

    return user;
  }

  const deleteUser = async (userId) => {
    console.log(userId)
  }

  const parseJsonString = (jsonString) => {
    try {
      return JSON.parse(jsonString);
    } catch (e) {
      return {};
    }
  };

  function removeBackslashes(inputString) {
    return inputString;
  }
  
  const stringifyJsonObject = (jsonObject) => {
    console.log(jsonObject)
    console.log(JSON.stringify(jsonObject))
    return JSON.stringify(jsonObject);
  };

  return (
    <AdminContext.Provider value={{ users, courses, homeworks, fetchData, getOneUser, deleteUser, parseJsonString, stringifyJsonObject, removeBackslashes }}>
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
