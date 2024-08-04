import React, { createContext, useContext, useState } from "react";
import axios from "axios";

import { useAuth } from "./AuthContext";

const AdminContext = createContext();

export const AdminProvider = ({ children }) => {
  const { userId } = useAuth();
  const [users, setUsers] = useState([]);
  const [courses, setCourses] = useState([]);
  const [homeworks, setHomeworks] = useState([]);
  const [registerCourses, setRegisterCourses] = useState([]);

  const fetchData = async () => {
    try {
      const users = await axios.post("http://192.168.0.104:3000/api/admin/users", {
        userId: userId,
      });

      const courses = await axios.post(
        "http://192.168.0.104:3000/api/admin/courses",
        {
          userId: userId,
        }
      );

      const homeworks = await axios.post(
        "http://192.168.0.104:3000/api/admin/homeworks",
        {
          userId: userId,
        }
      );

      const registerCourses = await axios.post(
        "http://192.168.0.104:3000/api/admin/registercourses",
        {
          userId: userId,
        }
      );

      setRegisterCourses(registerCourses.data);
      setUsers(users.data);
      setCourses(courses.data);
      setHomeworks(homeworks.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };
  
  const fetchUsers = async () => {
    try {
      const users = await axios.post("http://192.168.0.104:3000/api/admin/users", {
        userId: userId,
      });

      setUsers(users.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const fetchCourses = async () => {
    try {
      const courses = await axios.post(
        "http://192.168.0.104:3000/api/admin/courses",
        {
          userId: userId,
        }
      );

      setCourses(courses.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const fetchCoursesUser = async () => {
    try {
      const courses = await axios.get("http://192.168.0.104:3000/api/courses");
      setCourses(courses.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const fetchHomeworks = async () => {
    try {
      const homeworks = await axios.post(
        "http://192.168.0.104:3000/api/admin/homeworks",
        {
          userId: userId,
        }
      );

      setHomeworks(homeworks.data);
    } catch (error) {
      console.error("Error fetching admin data:", error);
    }
  };

  const registerCourse = async (userId, courseId) => {
    const course = await axios.post("http://192.168.0.104:3000/api/registercourse", {
      userId: userId,
      courseId: courseId
    });
  }

  const getOneUser = async (userId) => {
    const user = await axios.post("http://192.168.0.104:3000/api/user", {
      userId: userId,
    });

    return user;
  };

  const getOneCourse = async (courseId) => {
    const id = typeof courseId === 'string' ? parseInt(courseId, 10) : courseId;
    const course = courses.find((course) => course.id === id);  
    return course;
  };

  const deleteUser = async (userIdToDelete, adminId) => {
    try {
      await axios.delete("http://192.168.0.104:3000/api/admin/deleteUser", {
        data: {
          userId: adminId,
          id: userIdToDelete,
        },
      });
      await fetchUsers();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  const deleteCourse = async (courseIdToDelete, adminId) => {
    try {
      await axios.delete("http://192.168.0.104:3000/api/admin/deleteCourse", {
        data: {
          userId: adminId,
          id: courseIdToDelete,
        },
      });
      await fetchCourses();
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

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
    console.log(jsonObject);
    console.log(JSON.stringify(jsonObject));
    return JSON.stringify(jsonObject);
  };

  return (
    <AdminContext.Provider
      value={{
        users,
        courses,
        homeworks,
        registerCourses,
        fetchData,
        fetchCourses,
        fetchCoursesUser,
        getOneUser,
        getOneCourse,
        deleteUser,
        deleteCourse,
        parseJsonString,
        stringifyJsonObject,
        removeBackslashes,
        registerCourse,
      }}
    >
      {children}
    </AdminContext.Provider>
  );
};

export const useAdmin = () => useContext(AdminContext);
